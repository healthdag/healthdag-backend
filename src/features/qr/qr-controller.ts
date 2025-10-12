// * QR Controller - Handles QR code HTTP requests
import { Context } from 'hono'
import { QRService, QRCodeConfig, ResponderInfo } from '../../core/services/qr-service'
import { createApiResponse, createErrorResponse } from '../../core/services/response-factory'

export class QRController {
  private qrService: QRService

  constructor(qrService: QRService) {
    this.qrService = qrService
  }

  /**
   * Generate QR code for document sharing
   * POST /api/qr/generate
   */
  async generateQRCode(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      const body = await c.req.json()

      const config: QRCodeConfig = {
        documentIds: body.documentIds,
        expiresIn: body.expiresIn || 24, // Default 24 hours
        accessType: body.accessType || 'SHARE',
        requireName: body.requireName ?? true,
        requireCredential: body.requireCredential ?? true,
        requireLocation: body.requireLocation ?? true
      }

      const result = await this.qrService.generateQRCode(userId, config)

      const response = createApiResponse('POST /api/qr/generate', 201, {
        qrPayload: result.qrPayload,
        qrCodeId: result.qrCodeId,
        expiresAt: result.expiresAt.toISOString()
      })

      return c.json(response.payload, response.statusCode as any)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate QR code'
      const response = createErrorResponse('POST /api/qr/generate', 400, 'Bad Request', errorMessage)
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Get all QR codes for authenticated user
   * GET /api/qr/my-codes
   */
  async getMyQRCodes(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')

      const qrCodes = await this.qrService.getUserQRCodes(userId)

      const response = createApiResponse('GET /api/qr/my-codes', 200, qrCodes)
      return c.json(response.payload, response.statusCode as any)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve QR codes'
      const response = createErrorResponse('GET /api/qr/my-codes', 500, 'Internal Server Error', errorMessage)
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Revoke a QR code
   * DELETE /api/qr/:id
   */
  async revokeQRCode(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      const qrCodeId = c.req.param('id')

      await this.qrService.revokeQRCode(qrCodeId, userId)

      const response = createApiResponse('DELETE /api/qr/:id', 200, {
        message: 'QR code revoked successfully'
      })

      return c.json(response.payload, response.statusCode as any)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to revoke QR code'
      const statusCode = errorMessage.includes('not found') ? 404 : errorMessage.includes('Unauthorized') ? 403 : 400
      const response = createErrorResponse('DELETE /api/qr/:id', statusCode, 'Error', errorMessage)
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Regenerate expired QR code
   * PUT /api/qr/:id/regenerate
   */
  async regenerateQRCode(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      const qrCodeId = c.req.param('id')
      const body = await c.req.json()

      const newExpiresIn = body.expiresIn || 24

      const result = await this.qrService.regenerateQRCode(qrCodeId, userId, newExpiresIn)

      const response = createApiResponse('PUT /api/qr/:id/regenerate', 200, {
        qrPayload: result.qrPayload,
        qrCodeId: result.qrCodeId,
        expiresAt: result.expiresAt.toISOString()
      })

      return c.json(response.payload, response.statusCode as any)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to regenerate QR code'
      const statusCode = errorMessage.includes('not found') ? 404 : errorMessage.includes('Unauthorized') ? 403 : 400
      const response = createErrorResponse('PUT /api/qr/:id/regenerate', statusCode, 'Error', errorMessage)
      return c.json(response.payload, response.statusCode as any)
    }
  }

  /**
   * Process QR code access (public endpoint for scanning)
   * POST /api/qr/access
   */
  async processQRAccess(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()

      const qrPayload = body.qrPayload
      const responderInfo: ResponderInfo = {
        responderName: body.responderName,
        responderCredential: body.responderCredential,
        responderLocation: body.responderLocation
      }

      const result = await this.qrService.processQRAccess(qrPayload, responderInfo)

      const response = createApiResponse('POST /api/qr/access', 200, result)
      return c.json(response.payload, response.statusCode as any)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process QR access'
      const statusCode = errorMessage.includes('Invalid') || errorMessage.includes('expired') ? 400 :
                        errorMessage.includes('not found') ? 404 :
                        errorMessage.includes('revoked') ? 403 : 400
      const response = createErrorResponse('POST /api/qr/access', statusCode, 'Error', errorMessage)
      return c.json(response.payload, response.statusCode as any)
    }
  }
}
