// * Documents service for HealthLease application
import { prismaService } from '../../core/services/prisma-service'
import { ipfsService } from '../../core/services/ipfs-service'
import { web3Service } from '../../core/services/web3-service'
import { logger } from '../../core/utils/logger'
import type { Document, DocumentCategory, RecordCreationStatus } from '@prisma/client'

export class DocumentService {
  private prisma = prismaService.prisma

  /**
   * * Initiate document upload process
   * Creates a preliminary document record and starts background processing
   * @param userId - User ID
   * @param file - File to upload
   * @param category - Document category
   * @returns Preliminary document record
   */
  async initiateDocumentUpload(
    userId: string, 
    file: File, 
    category: DocumentCategory
  ): Promise<Document> {
    try {
      // * Create preliminary document record
      const preliminaryDoc = await this.prisma.document.create({
        data: {
          userId,
          category,
          creationStatus: 'PENDING',
          isActive: true
        }
      })

      // * Start background processing (fire-and-forget)
      this.processDocumentUpload(preliminaryDoc.id, userId, file, category)
        .catch(error => {
          logger.error('Background document processing failed', { 
            error: error.message, 
            documentId: preliminaryDoc.id, 
            userId 
          })
        })

      logger.info('Document upload initiated', { 
        documentId: preliminaryDoc.id, 
        userId, 
        category 
      })

      return preliminaryDoc

    } catch (error) {
      logger.error('Failed to initiate document upload', { 
        error: error instanceof Error ? error.message : String(error), 
        userId, 
        category 
      })
      throw new Error('Failed to initiate document upload')
    }
  }

  /**
   * * Process document upload in background
   * Handles encryption, IPFS upload, and blockchain registration
   * @param docId - Document ID
   * @param userId - User ID
   * @param file - File to process
   * @param category - Document category
   */
  private async processDocumentUpload(
    docId: string,
    userId: string,
    file: File,
    category: DocumentCategory
  ): Promise<void> {
    try {
      logger.info('Starting document processing', { documentId: docId, userId })

      // * Read file into buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer())

      // * Encrypt and upload to IPFS
      const { ipfsHash } = await ipfsService.encryptAndUpload(fileBuffer, userId)

      logger.info('File encrypted and uploaded to IPFS', { 
        documentId: docId, 
        userId, 
        ipfsHash 
      })

      // * Get user's DID
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { did: true }
      })

      if (!user?.did) {
        throw new Error('User does not have a DID')
      }

      // * Register document on blockchain
      const { documentId: onChainId } = await web3Service.addDocument(
        user.did,
        ipfsHash,
        category
      )

      logger.info('Document registered on blockchain', { 
        documentId: docId, 
        userId, 
        onChainId: onChainId.toString(),
        ipfsHash 
      })

      // * Update document record with success
      await this.prisma.document.update({
        where: { id: docId },
        data: {
          ipfsHash,
          onChainId,
          creationStatus: 'CONFIRMED'
        }
      })

      logger.info('Document processing completed successfully', { 
        documentId: docId, 
        userId, 
        onChainId: onChainId.toString(),
        ipfsHash 
      })

    } catch (error) {
      logger.error('Document processing failed', { 
        error: error instanceof Error ? error.message : String(error), 
        documentId: docId, 
        userId 
      })

      // * Update document record with failure
      try {
        await this.prisma.document.update({
          where: { id: docId },
          data: {
            creationStatus: 'FAILED'
          }
        })
      } catch (updateError) {
        logger.error('Failed to update document status to FAILED', { 
          error: updateError instanceof Error ? updateError.message : String(updateError), 
          documentId: docId 
        })
      }

      throw error
    }
  }

  /**
   * * Get user's documents
   * @param userId - User ID
   * @returns Array of user's documents
   */
  async getUserDocuments(userId: string): Promise<Document[]> {
    try {
      const documents = await this.prisma.document.findMany({
        where: { userId },
        orderBy: { uploadedAt: 'desc' }
      })

      return documents

    } catch (error) {
      logger.error('Failed to get user documents', { 
        error: error instanceof Error ? error.message : String(error), 
        userId 
      })
      throw new Error('Failed to retrieve user documents')
    }
  }

  /**
   * * Get specific document
   * @param documentId - Document ID
   * @param userId - User ID (for authorization)
   * @returns Document or null if not found
   */
  async getDocument(documentId: string, userId: string): Promise<Document | null> {
    try {
      const document = await this.prisma.document.findFirst({
        where: { 
          id: documentId,
          userId 
        }
      })

      return document

    } catch (error) {
      logger.error('Failed to get document', { 
        error: error instanceof Error ? error.message : String(error), 
        documentId, 
        userId 
      })
      throw new Error('Failed to retrieve document')
    }
  }

  /**
   * * Get document by ID (admin function)
   * @param documentId - Document ID
   * @returns Document or null if not found
   */
  async getDocumentById(documentId: string): Promise<Document | null> {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId }
      })

      return document

    } catch (error) {
      logger.error('Failed to get document by ID', { 
        error: error instanceof Error ? error.message : String(error), 
        documentId 
      })
      throw new Error('Failed to retrieve document')
    }
  }

  /**
   * * Update document status
   * @param documentId - Document ID
   * @param status - New status
   */
  async updateDocumentStatus(
    documentId: string, 
    status: RecordCreationStatus
  ): Promise<void> {
    try {
      await this.prisma.document.update({
        where: { id: documentId },
        data: { creationStatus: status }
      })

      logger.info('Document status updated', { documentId, status })

    } catch (error) {
      logger.error('Failed to update document status', { 
        error: error instanceof Error ? error.message : String(error), 
        documentId, 
        status 
      })
      throw new Error('Failed to update document status')
    }
  }

  /**
   * * Deactivate document
   * @param documentId - Document ID
   * @param userId - User ID (for authorization)
   */
  async deactivateDocument(documentId: string, userId: string): Promise<void> {
    try {
      const document = await this.prisma.document.findFirst({
        where: { 
          id: documentId,
          userId 
        }
      })

      if (!document) {
        throw new Error('Document not found or access denied')
      }

      await this.prisma.document.update({
        where: { id: documentId },
        data: { isActive: false }
      })

      logger.info('Document deactivated', { documentId, userId })

    } catch (error) {
      logger.error('Failed to deactivate document', { 
        error: error instanceof Error ? error.message : String(error), 
        documentId, 
        userId 
      })
      throw new Error('Failed to deactivate document')
    }
  }
}
