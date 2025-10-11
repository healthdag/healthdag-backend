// * Emergency routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { GenerateQrSchema, RequestAccessSchema } from '../core/types/api-schemas'

const app = new OpenAPIHono()

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
    
    // TODO: Implement actual QR generation logic
    // const qrPayload = await emergencyService.generateQrCode(c.get('user'), body.dataToInclude)
    
    // Mock response for now
    const response = createApiResponse('POST /api/emergency/qr', 200, {
      qrPayload: 'signed-qr-payload-here-with-data-included',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
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
            patientData: z.object({
              allergies: z.array(z.string()),
              medications: z.array(z.string()),
              bloodType: z.string().nullable(),
              conditions: z.array(z.string()),
            }),
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
