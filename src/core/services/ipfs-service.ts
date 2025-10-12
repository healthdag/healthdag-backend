import { PinataSDK } from 'pinata'
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'crypto'

// * Singleton IPFS service using Pinata SDK with encryption capabilities
class IpfsService {
  private static instance: IpfsService
  private pinata: PinataSDK
  private readonly masterSecret: string
  private readonly algorithm = 'aes-256-cbc'

  private constructor() {
    const jwt = process.env.PINATA_JWT_TOKEN
    const gateway = process.env.PINATA_GATEWAY_URL
    this.masterSecret = process.env.MASTER_ENCRYPTION_SECRET || 'default-master-secret-change-in-production'

    if (!jwt) {
      throw new Error('Pinata JWT token not found in environment variables')
    }

    if (!gateway) {
      throw new Error('Pinata Gateway URL not found in environment variables')
    }

    if (this.masterSecret === 'default-master-secret-change-in-production') {
      console.warn('! Using default master encryption secret - change MASTER_ENCRYPTION_SECRET in production')
    }

    this.pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway,
    })
  }

  public static getInstance(): IpfsService {
    if (!IpfsService.instance) {
      IpfsService.instance = new IpfsService()
    }
    return IpfsService.instance
  }

  /**
   * Encrypts the provided data buffer and uploads it to Pinata
   * @param data - Buffer data to encrypt and upload
   * @param encryptionKey - Buffer containing the encryption key
   * @returns Object containing the IPFS hash
   */
  public async encryptAndUpload(data: Buffer, encryptionKey: Buffer): Promise<{ ipfsHash: string }> {
    try {
      // * Encrypt the data using the provided key
      const encryptedData = this._encrypt(data, encryptionKey)
      
      // * Convert encrypted buffer to File object for Pinata SDK
      const fileData = new Uint8Array(encryptedData.buffer.slice(
        encryptedData.byteOffset, 
        encryptedData.byteOffset + encryptedData.byteLength
      ))
      
      const file = new File([fileData], `encrypted-${Date.now()}`, {
        type: 'application/octet-stream'
      })

      // * Upload to IPFS via Pinata
      const result = await this.pinata.upload.file(file)
      
      return { ipfsHash: result.cid }
    } catch (error) {
      console.error('Encrypt and upload failed:', error)
      throw new Error(`Failed to encrypt and upload to IPFS: ${error}`)
    }
  }

  /**
   * Downloads a file from IPFS and decrypts it
   * @param ipfsHash - IPFS hash (CID) of the encrypted file
   * @param encryptionKey - Buffer containing the decryption key
   * @returns Decrypted buffer data
   */
  public async downloadAndDecrypt(ipfsHash: string, encryptionKey: Buffer): Promise<Buffer> {
    try {
      // * Download the encrypted file from IPFS
      const gatewayUrl = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud'
      const response = await fetch(`${gatewayUrl}${ipfsHash}`)
      
      if (!response.ok) {
        throw new Error(`Failed to download from IPFS: ${response.statusText}`)
      }

      // * Convert response to buffer
      const encryptedBuffer = Buffer.from(await response.arrayBuffer())
      
      // * Decrypt the data using the provided key
      const decryptedData = this._decrypt(encryptedBuffer, encryptionKey)
      
      return decryptedData
    } catch (error) {
      console.error('Download and decrypt failed:', error)
      throw new Error(`Failed to download and decrypt from IPFS: ${error}`)
    }
  }

  /**
   * Encrypts data using AES-256-CBC algorithm
   * @param data - Buffer data to encrypt
   * @param key - Buffer containing the encryption key
   * @returns Encrypted buffer with IV prepended
   */
  private _encrypt(data: Buffer, key: Buffer): Buffer {
    try {
      // * Generate random initialization vector
      const iv = randomBytes(16)
      
      // * Create cipher with AES-256-CBC algorithm
      const cipher = createCipheriv(this.algorithm, key, iv)
      
      // * Encrypt the data
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
      
      // * Prepend IV to encrypted data for decryption
      return Buffer.concat([iv, encrypted])
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error(`Encryption failed: ${error}`)
    }
  }

  /**
   * Decrypts data using AES-256-CBC algorithm
   * @param encryptedData - Buffer containing IV + encrypted data
   * @param key - Buffer containing the decryption key
   * @returns Decrypted buffer data
   */
  private _decrypt(encryptedData: Buffer, key: Buffer): Buffer {
    try {
      // * Extract IV from the beginning of the encrypted data
      const iv = encryptedData.slice(0, 16)
      const encrypted = encryptedData.slice(16)
      
      // * Create decipher with AES-256-CBC algorithm
      const decipher = createDecipheriv(this.algorithm, key, iv)
      
      // * Decrypt the data
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
      
      return decrypted
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error(`Decryption failed: ${error}`)
    }
  }

  /**
   * Derives a user-specific encryption key from master secret and user ID
   * @param userId - User identifier for key derivation
   * @returns Buffer containing the derived encryption key
   */
  private _deriveUserKey(userId: string): Buffer {
    try {
      // * Use HMAC-SHA256 to derive a deterministic key from master secret and user ID
      const hmac = createHmac('sha256', this.masterSecret)
      hmac.update(userId)
      
      return hmac.digest()
    } catch (error) {
      console.error('Key derivation failed:', error)
      throw new Error(`Key derivation failed: ${error}`)
    }
  }

  /**
   * Get IPFS URL for a given hash using Pinata gateway
   * @param hash - IPFS hash (CID)
   * @returns Full IPFS URL
   */
  public async getIpfsUrl(hash: string): Promise<string> {
    try {
      const gatewayUrl = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud'
      return `${gatewayUrl}${hash}`
    } catch (error) {
      console.error('Failed to construct IPFS URL:', error)
      throw new Error(`Failed to construct IPFS URL: ${error}`)
    }
  }

  /**
   * Health check for IPFS service using Pinata SDK
   * @returns True if service is healthy
   */
  public async healthCheck(): Promise<boolean> {
    try {
      // * Test authentication by attempting to list files
      await this.pinata.files.list()
      return true
    } catch (error) {
      console.error('IPFS health check failed:', error)
      return false
    }
  }
}

// * Export singleton instance
export const ipfsService = IpfsService.getInstance()
export { IpfsService }
export default ipfsService
