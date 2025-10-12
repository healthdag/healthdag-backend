// * Documents Service - Handles document upload, retrieval, and management with IPFS
import { PrismaClient, Document, DocumentCategory, RecordCreationStatus } from '@prisma/client'
import { IPFSService } from '../../core/services/ipfs-service'
import crypto from 'crypto'

export class DocumentsService {
  private prisma: PrismaClient
  private ipfsService: IPFSService

  constructor(prisma: PrismaClient, ipfsService: IPFSService) {
    this.prisma = prisma
    this.ipfsService = ipfsService
  }

  /**
   * Upload document to IPFS and register on blockchain
   * @param userId - User ID
   * @param file - File buffer
   * @param fileName - Original file name
   * @param fileSize - File size in bytes
   * @param category - Document category
   * @returns Created document record
   */
  async uploadDocument(
    userId: string,
    file: Buffer,
    fileName: string,
    fileSize: number,
    category: DocumentCategory
  ): Promise<Document> {
    // 1. Verify user exists and has DID
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.did || user.didCreationStatus !== 'CONFIRMED') {
      throw new Error('DID not created. Please create DID first.')
    }

    if (!user.walletAddress) {
      throw new Error('Wallet not connected')
    }

    // 2. Encrypt file
    const encryptedFile = this.encryptFile(file)

    // 3. Upload to IPFS
    let ipfsHash: string
    try {
      ipfsHash = await this.ipfsService.uploadFile(encryptedFile)
    } catch (error) {
      throw new Error(`Failed to upload to IPFS: ${error}`)
    }

    // 4. Create document record in database (PENDING)
    const document = await this.prisma.document.create({
      data: {
        userId,
        ipfsHash,
        fileName,
        fileSize,
        category,
        creationStatus: 'PENDING',
        isActive: true
      }
    })

    // 5. Register on blockchain (async - status will be updated by background job)
    this.registerDocumentOnChain(document.id, user.walletAddress, ipfsHash, category)
      .catch(error => {
        console.error('Failed to register document on blockchain:', error)
        // Update document status to FAILED
        this.prisma.document.update({
          where: { id: document.id },
          data: { creationStatus: 'FAILED' }
        }).catch(console.error)
      })

    return document
  }

  /**
   * Register document on blockchain
   */
  private async registerDocumentOnChain(
    documentId: string,
    userAddress: string,
    ipfsHash: string,
    category: DocumentCategory
  ): Promise<void> {
    try {
      // Simulate blockchain registration
      const onChainId = BigInt(Date.now())

      // Update document with blockchain info
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          onChainId,
          creationStatus: 'CONFIRMED'
        }
      })

      console.log(`Document ${documentId} registered on blockchain with ID ${onChainId}`)
    } catch (error) {
      console.error('Blockchain registration error:', error)
      throw error
    }
  }

  /**
   * Encrypt file using AES-256-CBC
   */
  private encryptFile(file: Buffer): Buffer {
    const key = this.getEncryptionKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    const encrypted = Buffer.concat([cipher.update(file), cipher.final()])

    // Prepend IV to encrypted data
    return Buffer.concat([iv, encrypted])
  }

  /**
   * Decrypt file using AES-256-CBC
   */
  private decryptFile(encryptedFile: Buffer): Buffer {
    const key = this.getEncryptionKey()
    const iv = encryptedFile.slice(0, 16)
    const encrypted = encryptedFile.slice(16)

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    return decrypted
  }

  /**
   * Get encryption key from environment
   */
  private getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY

    if (!key) {
      throw new Error('ENCRYPTION_KEY not set in environment')
    }

    // Ensure key is 32 bytes for AES-256
    return crypto.createHash('sha256').update(key).digest()
  }

  /**
   * Get all documents for a user
   * @param userId - User ID
   * @param category - Optional category filter
   * @returns List of documents
   */
  async getUserDocuments(userId: string, category?: DocumentCategory): Promise<Document[]> {
    const where: any = {
      userId,
      isActive: true
    }

    if (category) {
      where.category = category
    }

    return await this.prisma.document.findMany({
      where,
      orderBy: { uploadedAt: 'desc' }
    })
  }

  /**
   * Get document by ID
   * @param documentId - Document ID
   * @param userId - User ID (for authorization)
   * @returns Document
   */
  async getDocument(documentId: string, userId: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      throw new Error('Document not found')
    }

    if (document.userId !== userId) {
      throw new Error('Unauthorized')
    }

    return document
  }

  /**
   * Get document status
   * @param documentId - Document ID
   * @param userId - User ID (for authorization)
   * @returns Document with status
   */
  async getDocumentStatus(documentId: string, userId: string): Promise<{
    status: RecordCreationStatus
    ipfsHash?: string
    onChainId?: bigint | null
  }> {
    const document = await this.getDocument(documentId, userId)

    return {
      status: document.creationStatus,
      ipfsHash: document.ipfsHash || undefined,
      onChainId: document.onChainId
    }
  }

  /**
   * Download document from IPFS
   * @param documentId - Document ID
   * @param userId - User ID (for authorization)
   * @returns Decrypted file buffer
   */
  async downloadDocument(documentId: string, userId: string): Promise<{
    file: Buffer
    fileName: string
    mimeType: string
  }> {
    const document = await this.getDocument(documentId, userId)

    if (!document.ipfsHash) {
      throw new Error('Document not uploaded to IPFS')
    }

    if (document.creationStatus !== 'CONFIRMED') {
      throw new Error('Document not yet confirmed')
    }

    // Download from IPFS
    const encryptedFile = await this.ipfsService.getFile(document.ipfsHash)

    // Decrypt
    const decryptedFile = this.decryptFile(encryptedFile)

    // Determine MIME type from file name
    const mimeType = this.getMimeType(document.fileName || '')

    return {
      file: decryptedFile,
      fileName: document.fileName || 'document',
      mimeType
    }
  }

  /**
   * Delete document (soft delete)
   * @param documentId - Document ID
   * @param userId - User ID (for authorization)
   */
  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.getDocument(documentId, userId)

    // Soft delete: mark as inactive
    await this.prisma.document.update({
      where: { id: documentId },
      data: { isActive: false }
    })

    // Document has been soft-deleted
    console.log(`Document ${documentId} deleted`)
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()

    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      txt: 'text/plain',
      json: 'application/json'
    }

    return mimeTypes[ext || ''] || 'application/octet-stream'
  }

  /**
   * Get document statistics for user
   */
  async getDocumentStats(userId: string): Promise<{
    total: number
    byCategory: Record<string, number>
    pending: number
    confirmed: number
    failed: number
  }> {
    const documents = await this.prisma.document.findMany({
      where: { userId, isActive: true }
    })

    const byCategory: Record<string, number> = {}
    let pending = 0
    let confirmed = 0
    let failed = 0

    for (const doc of documents) {
      // Count by category
      byCategory[doc.category] = (byCategory[doc.category] || 0) + 1

      // Count by status
      if (doc.creationStatus === 'PENDING') pending++
      else if (doc.creationStatus === 'CONFIRMED') confirmed++
      else if (doc.creationStatus === 'FAILED') failed++
    }

    return {
      total: documents.length,
      byCategory,
      pending,
      confirmed,
      failed
    }
  }
}
