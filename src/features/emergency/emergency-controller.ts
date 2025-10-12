// * Emergency controller for HealthLease application
import type { Context } from 'hono'
import EmergencyService from './emergency-service'
import { createApiResponse, createErrorResponse } from '../../core/services/response-factory'
import type { GenerateQrDto, RequestAccessDto } from '../../core/types/api-schemas'

// ====================================================================================
// TYPES & INTERFACES
// ====================================================================================

export interface EmergencyController {
  generateQrPayload(c: Context): Promise<Response>
  grantAndRetrieveData(c: Context): Promise<Response>
}

// ====================================================================================
// CONTROLLER CLASS
// ====================================================================================

export class EmergencyControllerImpl implements EmergencyController {
  private emergencyService: EmergencyService

  constructor(emergencyService: EmergencyService) {
    this.emergencyService = emergencyService
  }

  // ====================================================================================
  // EMERGENCY QR GENERATION
  // ====================================================================================

  /**
   * * Generates a signed QR payload for emergency access
   * @param c - Hono context
   * @returns QR payload response
   */
  async generateQrPayload(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('POST /api/emergency/qr', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const body = await c.req.json() as GenerateQrDto
      
      const result = await this.emergencyService.generateQrPayload(userId, body)
      
      const response = createApiResponse('POST /api/emergency/qr', 200, result)
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User not found')) {
          const response = createErrorResponse('POST /api/emergency/qr', 404, 'Not Found', error.message)
          return c.json(response.payload, response.statusCode)
        }
        
        if (error.message.includes('does not have a DID')) {
          const response = createErrorResponse('POST /api/emergency/qr', 400, 'Bad Request', error.message)
          return c.json(response.payload, response.statusCode)
        }
      }
      
      const response = createErrorResponse('POST /api/emergency/qr', 500, 'Internal Server Error', 'Failed to generate QR payload')
      return c.json(response.payload, response.statusCode)
    }
  }

  // ====================================================================================
  // EMERGENCY ACCESS REQUEST
  // ====================================================================================

  /**
   * * Grants emergency access and retrieves patient data
   * @param c - Hono context
   * @returns Patient data and expiration response
   */
  async grantAndRetrieveData(c: Context): Promise<Response> {
    try {
      const body = await c.req.json() as RequestAccessDto
      
      const result = await this.emergencyService.grantAndRetrieveData(body)
      
      const response = createApiResponse('POST /api/emergency/access', 200, {
        patientData: result.patientData,
        expiresAt: result.expiresAt.toISOString()
      })
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('QR payload verification failed') || 
            error.message.includes('Invalid QR payload') ||
            error.message.includes('QR payload has expired')) {
          const response = createErrorResponse('POST /api/emergency/access', 400, 'Bad Request', 'The QR payload is invalid or malformed')
          return c.json(response.payload, response.statusCode)
        }
        
        if (error.message.includes('Failed to grant emergency access')) {
          const response = createErrorResponse('POST /api/emergency/access', 403, 'Forbidden', 'The on-chain grant could not be created or access is denied')
          return c.json(response.payload, response.statusCode)
        }
      }
      
      const response = createErrorResponse('POST /api/emergency/access', 500, 'Internal Server Error', 'Failed to process emergency access request')
      return c.json(response.payload, response.statusCode)
    }
  }
}

// ====================================================================================
// FACTORY FUNCTION
// ====================================================================================

/**
 * * Creates a new emergency controller instance
 * @param emergencyService - Emergency service instance
 * @returns Emergency controller
 */
export function createEmergencyController(emergencyService: EmergencyService): EmergencyController {
  return new EmergencyControllerImpl(emergencyService)
}

// ====================================================================================
// EXPORTS
// ====================================================================================

// Types are already exported above
