// * Emergency service for HealthLease application
import { PrismaClient } from '@prisma/client'
import { createHmac, createSign } from 'crypto'
import type { GenerateQrDto, RequestAccessDto } from '../../core/types/api-schemas'
import { web3Service } from '../../core/services/web3-service'
import { ipfsService } from '../../core/services/ipfs-service'
import { logger } from '../../core/utils/logger'

// * QR payload structure for emergency access
interface QrPayload {
  userId: string
  did: string
  dataToInclude: string[]
  timestamp: number
  signature: string
}

// * Emergency service class for handling security-critical emergency access
class EmergencyService {
  private prisma: PrismaClient
  private web3Service: typeof web3Service
  private ipfsService: typeof ipfsService
  private readonly privateKey: string

  constructor(
    prisma: PrismaClient,
    web3ServiceInstance: typeof web3Service,
    ipfsServiceInstance: typeof ipfsService
  ) {
    this.prisma = prisma
    this.web3Service = web3ServiceInstance
    this.ipfsService = ipfsServiceInstance
    
    // * Get private key for signing QR payloads
    const privateKey = process.env.PRIVATE_KEY
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required for emergency service')
    }
    this.privateKey = privateKey
  }

  /**
   * * Generates a signed QR payload for emergency access
   * @param userId - User ID requesting QR generation
   * @param dto - Data transfer object containing data categories to include
   * @returns Signed QR payload string
   */
  async generateQrPayload(userId: string, dto: GenerateQrDto): Promise<{ qrPayload: string }> {
    try {
      // * Get user information including DID
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          did: true,
          name: true,
          email: true
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      if (!user.did) {
        throw new Error('User does not have a DID - cannot generate emergency QR')
      }

      // * Create QR payload structure
      const payload: Omit<QrPayload, 'signature'> = {
        userId: user.id,
        did: user.did,
        dataToInclude: dto.dataToInclude,
        timestamp: Date.now()
      }

      // * Sign the payload using HMAC-SHA256 with private key
      const payloadString = JSON.stringify(payload)
      const signature = this._signPayload(payloadString)

      // * Create final signed payload
      const signedPayload: QrPayload = {
        ...payload,
        signature
      }

      // * Return base64 encoded payload for QR code
      const qrPayload = Buffer.from(JSON.stringify(signedPayload)).toString('base64')

      logger.info('Emergency QR payload generated', {
        userId,
        did: user.did,
        dataCategories: dto.dataToInclude,
        timestamp: payload.timestamp
      })

      return { qrPayload }
    } catch (error) {
      logger.error('Failed to generate QR payload', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        dataToInclude: dto.dataToInclude
      })
      throw error
    }
  }

  /**
   * * Grants emergency access and retrieves patient data synchronously
   * @param dto - Request access data transfer object
   * @returns Patient data and expiration timestamp
   */
  async grantAndRetrieveData(dto: RequestAccessDto): Promise<{ patientData: any, expiresAt: Date }> {
    try {
      // * Step 1: Verify QR payload signature
      const qrPayload = this._verifyQrPayload(dto.qrPayload)
      
      // * Step 2: Call web3Service.grantEmergencyAccess
      const durationSeconds = BigInt(24 * 60 * 60) // 24 hours in seconds
      const grantResult = await this.web3Service.grantEmergencyAccess(
        qrPayload.did,
        dto.responderInfo.address,
        dto.responderInfo.name,
        dto.responderInfo.credential,
        durationSeconds,
        2, // CRITICAL access level
        dto.responderInfo.location
      )
      
      // * Calculate expiration time from blockchain duration
      const expiresAt = new Date(Date.now() + Number(durationSeconds) * 1000)

      // * Step 3: Create AccessLog in Prisma
      const accessLog = await this.prisma.accessLog.create({
        data: {
          onChainGrantId: grantResult.grantId,
          responderName: dto.responderInfo.name,
          responderCredential: dto.responderInfo.credential,
          responderLocation: dto.responderInfo.location,
          dataAccessed: qrPayload.dataToInclude,
          grantExpiresAt: expiresAt,
          userId: qrPayload.userId
        }
      })

      // * Step 4: Fetch document hashes from Prisma
      const documents = await this.prisma.document.findMany({
        where: {
          userId: qrPayload.userId,
          isActive: true,
          category: {
            in: qrPayload.dataToInclude as any[] // Type assertion for enum values
          }
        },
        select: {
          id: true,
          ipfsHash: true,
          category: true,
          uploadedAt: true
        }
      })

      // * Step 5: Call ipfsService.downloadAndDecrypt for each hash
      const patientData: any = {}
      
      for (const document of documents) {
        if (!document.ipfsHash) continue

        try {
          // * Derive encryption key for this user/document
          const encryptionKey = this._deriveEncryptionKey(qrPayload.userId, document.id)
          
          // * Download and decrypt document
          const decryptedData = await this.ipfsService.downloadAndDecrypt(
            document.ipfsHash,
            encryptionKey
          )

          // * Parse decrypted data
          const parsedData = JSON.parse(decryptedData.toString())
          
          // * Store in patient data by category
          if (!patientData[document.category]) {
            patientData[document.category] = []
          }
          patientData[document.category].push({
            id: document.id,
            data: parsedData,
            uploadedAt: document.uploadedAt
          })
        } catch (error) {
          logger.warn('Failed to decrypt document during emergency access', {
            error: error instanceof Error ? error.message : 'Unknown error',
            documentId: document.id,
            ipfsHash: document.ipfsHash
          })
          
          // * Continue with other documents even if one fails
          continue
        }
      }

      logger.info('Emergency access granted and data retrieved', {
        userId: qrPayload.userId,
        responderName: dto.responderInfo.name,
        documentsAccessed: documents.length,
        grantId: grantResult.grantId.toString(),
        expiresAt: expiresAt
      })

      return {
        patientData,
        expiresAt: expiresAt
      }
    } catch (error) {
      logger.error('Failed to grant emergency access', {
        error: error instanceof Error ? error.message : 'Unknown error',
        qrPayload: dto.qrPayload.substring(0, 100) + '...', // Log partial payload for debugging
        responderInfo: dto.responderInfo
      })
      throw error
    }
  }

  /**
   * * Signs a payload string using HMAC-SHA256
   * @param payload - String payload to sign
   * @returns Hexadecimal signature
   */
  private _signPayload(payload: string): string {
    try {
      const hmac = createHmac('sha256', this.privateKey)
      hmac.update(payload)
      return hmac.digest('hex')
    } catch (error) {
      throw new Error(`Failed to sign payload: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * * Verifies QR payload signature and returns parsed payload
   * @param qrPayload - Base64 encoded QR payload
   * @returns Parsed and verified QR payload
   */
  private _verifyQrPayload(qrPayload: string): QrPayload {
    try {
      // * Decode base64 payload
      const decodedPayload = Buffer.from(qrPayload, 'base64').toString('utf-8')
      const payload: QrPayload = JSON.parse(decodedPayload)

      // * Validate payload structure
      if (!payload.userId || !payload.did || !payload.dataToInclude || !payload.timestamp || !payload.signature) {
        throw new Error('Invalid QR payload structure')
      }

      // * Check timestamp (QR codes expire after 24 hours)
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      if (now - payload.timestamp > maxAge) {
        throw new Error('QR payload has expired')
      }

      // * Recreate payload without signature for verification
      const payloadToVerify: Omit<QrPayload, 'signature'> = {
        userId: payload.userId,
        did: payload.did,
        dataToInclude: payload.dataToInclude,
        timestamp: payload.timestamp
      }

      // * Verify signature
      const expectedSignature = this._signPayload(JSON.stringify(payloadToVerify))
      if (payload.signature !== expectedSignature) {
        throw new Error('Invalid QR payload signature')
      }

      return payload
    } catch (error) {
      throw new Error(`QR payload verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * * Derives encryption key for user/document combination
   * @param userId - User ID
   * @param documentId - Document ID
   * @returns Buffer containing encryption key
   */
  private _deriveEncryptionKey(userId: string, documentId: string): Buffer {
    try {
      const hmac = createHmac('sha256', this.privateKey)
      hmac.update(userId)
      hmac.update(documentId)
      return hmac.digest()
    } catch (error) {
      throw new Error(`Failed to derive encryption key: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * * Health check for emergency service
   * @returns True if service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      // * Check database connection
      await this.prisma.$queryRaw`SELECT 1`
      
      // * Check Web3 service
      const web3Healthy = await this.web3Service.healthCheck()
      
      // * Check IPFS service
      const ipfsHealthy = await this.ipfsService.healthCheck()
      
      return web3Healthy && ipfsHealthy
    } catch (error) {
      logger.error('Emergency service health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return false
    }
  }
}

export default EmergencyService
