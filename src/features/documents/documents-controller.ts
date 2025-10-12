// * Documents controller for HealthLease application
import type { Context } from 'hono'
import { requireAuth, getUserId } from '../../core/middleware/auth-middleware'
import { DocumentService } from './documents-service'
import { createApiResponse } from '../../core/services/response-factory'
import { logger } from '../../core/utils/logger'

// * Document service instance
const documentService = new DocumentService()

/**
 * * POST /api/documents - Upload a document
 * Asynchronously upload, encrypt, pin to IPFS, and register a document on the blockchain
 */
export async function uploadDocument(c: Context) {
  try {
    // * Verify authentication
    const authResult = await requireAuth(c, async () => {})
    if (authResult && typeof authResult === 'object' && 'status' in authResult && authResult.status !== 200) {
      return authResult
    }

    // * Get authenticated user ID
    const userId = getUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized', message: 'User ID not found' }, 401)
    }

    // * Parse multipart form data
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string

    // * Validate required fields
    if (!file) {
      return c.json({ error: 'Bad Request', message: 'File is required' }, 400)
    }

    if (!category) {
      return c.json({ error: 'Bad Request', message: 'Category is required' }, 400)
    }

    // * Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ 
        error: 'Bad Request', 
        message: 'Invalid file type. Only PDF and image files are allowed' 
      }, 400)
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return c.json({ 
        error: 'Bad Request', 
        message: 'File size too large. Maximum size is 10MB' 
      }, 400)
    }

    // * Validate category
    const validCategories = ['LAB_RESULT', 'IMAGING', 'PRESCRIPTION', 'VISIT_NOTES', 'PROFILE']
    if (!validCategories.includes(category)) {
      return c.json({ 
        error: 'Bad Request', 
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ') 
      }, 400)
    }

    // * Initiate document upload
    const preliminaryDoc = await documentService.initiateDocumentUpload(userId, file, category as any)

    // * Return 202 Accepted with preliminary document info
    const response = createApiResponse('POST /api/documents', 202, {
      id: preliminaryDoc.id,
      status: 'PENDING'
    })

    logger.info('Document upload initiated', { 
      userId, 
      documentId: preliminaryDoc.id, 
      category, 
      fileName: file.name,
      fileSize: file.size 
    })

    return c.json(response.payload, response.statusCode as any)

  } catch (error) {
    logger.error('Document upload failed', { error: error instanceof Error ? error.message : String(error) })
    return c.json({ 
      error: 'Internal Server Error', 
      message: 'Failed to process document upload' 
    }, 500)
  }
}

/**
 * * GET /api/documents - Get user's documents
 */
export async function getUserDocuments(c: Context) {
  try {
    // * Verify authentication
    const authResult = await requireAuth(c, async () => {})
    if (authResult && typeof authResult === 'object' && 'status' in authResult && authResult.status !== 200) {
      return authResult
    }

    // * Get authenticated user ID
    const userId = getUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized', message: 'User ID not found' }, 401)
    }

    // * Get documents from service
    const documents = await documentService.getUserDocuments(userId)

    const response = createApiResponse('GET /api/documents', 200, {
      documents: documents.map(doc => ({
        id: doc.id,
        category: doc.category,
        creationStatus: doc.creationStatus,
        uploadedAt: doc.uploadedAt.toISOString(),
        ipfsHash: doc.ipfsHash,
        onChainId: doc.onChainId?.toString() || null,
        isActive: doc.isActive
      }))
    })

    return c.json(response.payload, response.statusCode as any)

  } catch (error) {
    logger.error('Failed to get user documents', { error: error instanceof Error ? error.message : String(error) })
    return c.json({ 
      error: 'Internal Server Error', 
      message: 'Failed to retrieve documents' 
    }, 500)
  }
}

/**
 * * GET /api/documents/:id - Get specific document
 */
export async function getDocument(c: Context) {
  try {
    // * Verify authentication
    const authResult = await requireAuth(c, async () => {})
    if (authResult && typeof authResult === 'object' && 'status' in authResult && authResult.status !== 200) {
      return authResult
    }

    // * Get authenticated user ID
    const userId = getUserId(c)
    if (!userId) {
      return c.json({ error: 'Unauthorized', message: 'User ID not found' }, 401)
    }

    // * Get document ID from params
    const documentId = c.req.param('id')
    if (!documentId) {
      return c.json({ error: 'Bad Request', message: 'Document ID is required' }, 400)
    }

    // * Get document from service
    const document = await documentService.getDocument(documentId, userId)

    if (!document) {
      return c.json({ error: 'Not Found', message: 'Document not found' }, 404)
    }

    const response = createApiResponse('GET /api/documents/:id', 200, {
      id: document.id,
      category: document.category,
      creationStatus: document.creationStatus,
      uploadedAt: document.uploadedAt.toISOString(),
      ipfsHash: document.ipfsHash,
      onChainId: document.onChainId?.toString() || null,
      isActive: document.isActive
    })

    return c.json(response.payload, response.statusCode as any)

  } catch (error) {
    logger.error('Failed to get document', { error: error instanceof Error ? error.message : String(error) })
    return c.json({ 
      error: 'Internal Server Error', 
      message: 'Failed to retrieve document' 
    }, 500)
  }
}
