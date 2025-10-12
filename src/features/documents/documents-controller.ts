// * Documents Controller - Handles HTTP requests for document management
import { Context } from 'hono'
import { DocumentsService } from './documents-service'
import { createApiResponse, createErrorResponse } from '../../core/services/response-factory'
import { DocumentCategory } from '@prisma/client'

export class DocumentsController {
  private documentsService: DocumentsService

  constructor(documentsService: DocumentsService) {
    this.documentsService = documentsService
  }

  /**
   * Upload a document
   * POST /api/documents
   */
  async uploadDocument(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        const response = createErrorResponse('POST /api/documents', 401, 'Unauthorized', 'User not authenticated')
        return c.json(response.payload, response.statusCode as any)
      }

      // Parse multipart form data
      const formData = await c.req.formData()
      const file = formData.get('file') as File
      const category = formData.get('category') as DocumentCategory

      if (!file) {
        const response = createErrorResponse('POST /api/documents', 400, 'Bad Request', 'No file provided')
        return c.json(response.payload, response.statusCode as any)
      }

      if (!category) {
        const response = createErrorResponse('POST /api/documents', 400, 'Bad Request', 'Category is required')
        return c.json(response.payload, response.statusCode as any)
      }

      // Validate category
      const validCategories = ['LAB_RESULT', 'IMAGING', 'PRESCRIPTION', 'VISIT_NOTES', 'PROFILE']
      if (!validCategories.includes(category)) {
        const response = createErrorResponse('POST /api/documents', 400, 'Bad Request', 'Invalid category')
        return c.json(response.payload, response.statusCode as any)
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        const response = createErrorResponse('POST /api/documents', 400, 'Bad Request', 'File size exceeds 10MB limit')
        return c.json(response.payload, response.statusCode as any)
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload document
      const document = await this.documentsService.uploadDocument(
        userId,
        buffer,
        file.name,
        file.size,
        category
      )

      const response = createApiResponse('POST /api/documents', 202, {
        id: document.id,
        status: document.creationStatus
      })

      return c.json(response.payload, response.statusCode as any)
    } catch (error: any) {
      console.error('Upload document error:', error)
      const response = createErrorResponse(
        'POST /api/documents',
        500,
        'Internal Server Error',
        error.message || 'Failed to upload document'
      )
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Get all documents for the authenticated user
   * GET /api/documents
   */
  async getDocuments(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        const response = createErrorResponse('GET /api/documents', 401, 'Unauthorized', 'User not authenticated')
        return c.json(response.payload, response.statusCode as any)
      }

      // Optional category filter
      const category = c.req.query('category') as DocumentCategory | undefined

      const documents = await this.documentsService.getUserDocuments(userId, category)

      const response = createApiResponse('GET /api/documents', 200, documents)
      return c.json(response.payload, response.statusCode as any)
    } catch (error: any) {
      console.error('Get documents error:', error)
      const response = createErrorResponse(
        'GET /api/documents',
        500,
        'Internal Server Error',
        error.message || 'Failed to retrieve documents'
      )
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Get document status
   * GET /api/documents/:id/status
   */
  async getDocumentStatus(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        const response = createErrorResponse('GET /api/documents/:id/status', 401, 'Unauthorized', 'User not authenticated')
        return c.json(response.payload, response.statusCode as any)
      }

      const documentId = c.req.param('id')
      if (!documentId) {
        const response = createErrorResponse('GET /api/documents/:id/status', 400, 'Bad Request', 'Document ID is required')
        return c.json(response.payload, response.statusCode as any)
      }

      const status = await this.documentsService.getDocumentStatus(documentId, userId)

      const response = createApiResponse('GET /api/documents/:id/status', 200, status)
      return c.json(response.payload, response.statusCode as any)
    } catch (error: any) {
      console.error('Get document status error:', error)

      if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
        const response = createErrorResponse('GET /api/documents/:id/status', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode as any)
      }

      const response = createErrorResponse(
        'GET /api/documents/:id/status',
        500,
        'Internal Server Error',
        error.message || 'Failed to get document status'
      )
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Download a document
   * GET /api/documents/:id/download
   */
  async downloadDocument(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        const response = createErrorResponse('GET /api/documents/:id/download', 401, 'Unauthorized', 'User not authenticated')
        return c.json(response.payload, response.statusCode as any)
      }

      const documentId = c.req.param('id')
      if (!documentId) {
        const response = createErrorResponse('GET /api/documents/:id/download', 400, 'Bad Request', 'Document ID is required')
        return c.json(response.payload, response.statusCode as any)
      }

      const { file, fileName, mimeType } = await this.documentsService.downloadDocument(documentId, userId)

      // Return file as response
      return c.body(file, 200, {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': file.length.toString()
      })
    } catch (error: any) {
      console.error('Download document error:', error)

      if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
        const response = createErrorResponse('GET /api/documents/:id/download', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode as any)
      }

      const response = createErrorResponse(
        'GET /api/documents/:id/download',
        500,
        'Internal Server Error',
        error.message || 'Failed to download document'
      )
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Delete a document
   * DELETE /api/documents/:id
   */
  async deleteDocument(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      if (!userId) {
        const response = createErrorResponse('DELETE /api/documents/:id', 401, 'Unauthorized', 'User not authenticated')
        return c.json(response.payload, response.statusCode as any)
      }

      const documentId = c.req.param('id')
      if (!documentId) {
        const response = createErrorResponse('DELETE /api/documents/:id', 400, 'Bad Request', 'Document ID is required')
        return c.json(response.payload, response.statusCode as any)
      }

      await this.documentsService.deleteDocument(documentId, userId)

      const response = createApiResponse('DELETE /api/documents/:id', 200, {
        message: 'Document deleted successfully'
      })
      return c.json(response.payload, response.statusCode as any)
    } catch (error: any) {
      console.error('Delete document error:', error)

      if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
        const response = createErrorResponse('DELETE /api/documents/:id', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode as any)
      }

      const response = createErrorResponse(
        'DELETE /api/documents/:id',
        500,
        'Internal Server Error',
        error.message || 'Failed to delete document'
      )
      return c.json(response.payload, response.statusCode as any)
    }
  }
}
