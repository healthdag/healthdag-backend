// * QR Code Service - Handles QR code generation and access management
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export interface QRCodeConfig {
  documentIds: string[]
  expiresIn: number // hours
  accessType: 'EMERGENCY' | 'SHARE'
  requireName?: boolean
  requireCredential?: boolean
  requireLocation?: boolean
}

export interface QRCodePayload {
  userId: string
  qrCodeId: string
  documentIds: string[]
  accessType: string
  expiresAt: string
  iat: number
  exp: number
}

export interface ResponderInfo {
  responderName: string
  responderCredential: string
  responderLocation: string
}

export interface AccessResponse {
  patient: {
    name: string | null
    email: string
    did: string | null
  }
  documents: Array<{
    id: string
    category: string
    uploadedAt: string
    ipfsHash: string | null
  }>
  expiresAt: string
}

export class QRService {
  private prisma: PrismaClient
  private jwtSecret: string

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
  }

  /**
   * Generate QR code for emergency/controlled access
   * @param userId - User ID
   * @param config - QR code configuration
   * @returns QR payload (JWT) and metadata
   */
  async generateQRCode(userId: string, config: QRCodeConfig): Promise<{
    qrPayload: string
    qrCodeId: string
    expiresAt: Date
  }> {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Validate documents belong to user
    const documents = await this.prisma.document.findMany({
      where: {
        id: { in: config.documentIds },
        userId,
        isActive: true
      }
    })

    if (documents.length !== config.documentIds.length) {
      throw new Error('Some documents not found or do not belong to user')
    }

    // Calculate expiration
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + config.expiresIn)

    // Create QR code record in database
    const qrCode = await this.prisma.qRCode.create({
      data: {
        userId,
        documentIds: config.documentIds,
        accessType: config.accessType,
        expiresAt,
        isActive: true,
        accessCount: 0,
        requireName: config.requireName ?? true,
        requireCredential: config.requireCredential ?? true,
        requireLocation: config.requireLocation ?? true,
        qrPayload: '' // Will be updated after JWT generation
      }
    })

    // Generate JWT payload
    const jwtPayload: Omit<QRCodePayload, 'iat' | 'exp'> = {
      userId,
      qrCodeId: qrCode.id,
      documentIds: config.documentIds,
      accessType: config.accessType,
      expiresAt: expiresAt.toISOString()
    }

    // Sign JWT
    const token = jwt.sign(jwtPayload, this.jwtSecret, {
      expiresIn: `${config.expiresIn}h`
    })

    // Update QR code with token
    await this.prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { qrPayload: token }
    })

    return {
      qrPayload: token,
      qrCodeId: qrCode.id,
      expiresAt
    }
  }

  /**
   * Validate and process QR code access
   * @param qrPayload - JWT token from QR code
   * @param responderInfo - Information about responder
   * @returns Access data
   */
  async processQRAccess(qrPayload: string, responderInfo: ResponderInfo): Promise<AccessResponse> {
    // Verify JWT
    let decodedPayload: QRCodePayload
    try {
      decodedPayload = jwt.verify(qrPayload, this.jwtSecret) as QRCodePayload
    } catch (error) {
      throw new Error('Invalid or expired QR code')
    }

    // Get QR code from database
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id: decodedPayload.qrCodeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            did: true
          }
        }
      }
    })

    if (!qrCode) {
      throw new Error('QR code not found')
    }

    if (!qrCode.isActive) {
      throw new Error('QR code has been revoked')
    }

    if (new Date() > qrCode.expiresAt) {
      throw new Error('QR code has expired')
    }

    // Validate responder info
    if (qrCode.requireName && !responderInfo.responderName) {
      throw new Error('Responder name is required')
    }

    if (qrCode.requireCredential && !responderInfo.responderCredential) {
      throw new Error('Responder credential is required')
    }

    if (qrCode.requireLocation && !responderInfo.responderLocation) {
      throw new Error('Responder location is required')
    }

    // Get documents
    const documents = await this.prisma.document.findMany({
      where: {
        id: { in: qrCode.documentIds },
        userId: qrCode.userId,
        isActive: true
      },
      select: {
        id: true,
        category: true,
        uploadedAt: true,
        ipfsHash: true
      }
    })

    // Log access
    await this.prisma.accessLog.create({
      data: {
        userId: qrCode.userId,
        onChainGrantId: BigInt(Date.now()), // Simplified - should be from blockchain
        responderName: responderInfo.responderName,
        responderCredential: responderInfo.responderCredential,
        responderLocation: responderInfo.responderLocation,
        dataAccessed: qrCode.documentIds,
        grantExpiresAt: qrCode.expiresAt
      }
    })

    // Increment access count
    await this.prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { accessCount: { increment: 1 } }
    })

    return {
      patient: {
        name: qrCode.user.name,
        email: qrCode.user.email,
        did: qrCode.user.did
      },
      documents: documents.map(doc => ({
        id: doc.id,
        category: doc.category,
        uploadedAt: doc.uploadedAt.toISOString(),
        ipfsHash: doc.ipfsHash
      })),
      expiresAt: qrCode.expiresAt.toISOString()
    }
  }

  /**
   * Get all QR codes for a user
   * @param userId - User ID
   * @returns List of QR codes
   */
  async getUserQRCodes(userId: string): Promise<Array<{
    id: string
    accessType: string
    expiresAt: Date
    isActive: boolean
    accessCount: number
    documentIds: string[]
    createdAt: Date
  }>> {
    return await this.prisma.qRCode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        accessType: true,
        expiresAt: true,
        isActive: true,
        accessCount: true,
        documentIds: true,
        createdAt: true
      }
    })
  }

  /**
   * Revoke a QR code
   * @param qrCodeId - QR code ID
   * @param userId - User ID (for authorization)
   */
  async revokeQRCode(qrCodeId: string, userId: string): Promise<void> {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id: qrCodeId }
    })

    if (!qrCode) {
      throw new Error('QR code not found')
    }

    if (qrCode.userId !== userId) {
      throw new Error('Unauthorized')
    }

    await this.prisma.qRCode.update({
      where: { id: qrCodeId },
      data: { isActive: false }
    })
  }

  /**
   * Regenerate expired QR code
   * @param qrCodeId - QR code ID
   * @param userId - User ID (for authorization)
   * @param newExpiresIn - New expiration in hours
   * @returns New QR payload
   */
  async regenerateQRCode(qrCodeId: string, userId: string, newExpiresIn: number): Promise<{
    qrPayload: string
    qrCodeId: string
    expiresAt: Date
  }> {
    const oldQrCode = await this.prisma.qRCode.findUnique({
      where: { id: qrCodeId }
    })

    if (!oldQrCode) {
      throw new Error('QR code not found')
    }

    if (oldQrCode.userId !== userId) {
      throw new Error('Unauthorized')
    }

    // Deactivate old QR code
    await this.prisma.qRCode.update({
      where: { id: qrCodeId },
      data: { isActive: false }
    })

    // Generate new QR code with same configuration
    return await this.generateQRCode(userId, {
      documentIds: oldQrCode.documentIds,
      expiresIn: newExpiresIn,
      accessType: oldQrCode.accessType as 'EMERGENCY' | 'SHARE',
      requireName: oldQrCode.requireName,
      requireCredential: oldQrCode.requireCredential,
      requireLocation: oldQrCode.requireLocation
    })
  }
}
