// * Emergency routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { GenerateQrSchema, RequestAccessSchema } from '../core/types/api-schemas'
import { requireAuth } from '../core/middleware/auth-middleware'

const app = new OpenAPIHono()

// * Apply authentication middleware to all emergency routes
app.use('*', requireAuth)

// === GENERATE QR CODE ===
const generateQrRoute = createRoute({
  method: 'post',
  path: '/qr',
  tags: ['Emergency'],
  summary: 'Generate emergency QR code',
  description: 'Generates a new, signed QR code payload for emergency access',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: GenerateQrSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'QR code generated successfully',
      content: {
        'application/json': {
          schema: z.object({
            qrPayload: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(generateQrRoute, async (c) => {
  try {
    const body = c.req.valid('json')
    const userId = c.get('userId')
    
    if (!userId) {
      const response = createErrorResponse('POST /api/emergency/qr', 401, 'Unauthorized', 'Missing or invalid JWT')
      return c.json(response.payload, response.statusCode as any)
    }
    
    // * Validate data categories
    const validCategories = ['allergies', 'medications', 'bloodType', 'conditions', 'emergencyContacts', 'medicalHistory']
    const invalidCategories = body.dataToInclude.filter(category => !validCategories.includes(category))
    
    if (invalidCategories.length > 0) {
      const response = createErrorResponse('POST /api/emergency/qr', 400, 'Bad Request', `Invalid data categories: ${invalidCategories.join(', ')}. Valid categories are: ${validCategories.join(', ')}`)
      return c.json(response.payload, response.statusCode as any)
    }
    
    // TODO: Implement actual QR generation logic
    // const qrPayload = await emergencyService.generateQrCode(userId, body.dataToInclude)
    
    // * Generate mock QR payload with timestamp and user context
    const timestamp = Date.now()
    const qrPayload = `emergency_qr_${userId}_${timestamp}_${body.dataToInclude.join('_')}`
    
    const response = createApiResponse('POST /api/emergency/qr', 200, {
      qrPayload,
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const response = createErrorResponse('POST /api/emergency/qr', 400, 'Bad Request', 'Invalid request body format')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/emergency/qr', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === REQUEST EMERGENCY ACCESS ===
const requestAccessRoute = createRoute({
  method: 'post',
  path: '/access',
  tags: ['Emergency'],
  summary: 'Request emergency access',
  description: 'Public endpoint for first responders to request access using a scanned QR payload',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RequestAccessSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Emergency access granted',
      content: {
        'application/json': {
          schema: z.object({
            patientData: z.record(z.any()),
            expiresAt: z.string().datetime(),
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(requestAccessRoute, async (c) => {
  try {
    const body = c.req.valid('json')
    
    // TODO: Implement actual emergency access logic
    // const result = await emergencyService.requestAccess(body.qrPayload, body.responderInfo)
    
    // Mock response for now
    const response = createApiResponse('POST /api/emergency/access', 200, {
      patientData: {
        allergies: ['Penicillin', 'Shellfish'],
        medications: ['Metformin 500mg', 'Lisinopril 10mg'],
        bloodType: 'O+',
        conditions: ['Type 2 Diabetes', 'Hypertension'],
      },
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'InvalidQrPayloadError') {
      const response = createErrorResponse('POST /api/emergency/access', 400, 'Bad Request', 'The QR payload is invalid or malformed')
      return c.json(response.payload, response.statusCode as any)
    }
    
    if (error.name === 'AccessDeniedError') {
      const response = createErrorResponse('POST /api/emergency/access', 403, 'Forbidden', 'The on-chain grant could not be created or access is denied')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/emergency/access', 400, 'Bad Request', 'The QR payload is invalid or malformed')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
