// * Access logs routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'

const app = new OpenAPIHono()

// === GET ACCESS LOGS ===
const getAccessLogsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Access Control'],
  summary: 'Get access logs',
  description: 'Provides an immutable log of who has accessed the user\'s data and when',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Access logs retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(z.object({
            responderName: z.string(),
            responderCredential: z.string(),
            accessTime: z.string().datetime(),
            dataAccessed: z.array(z.string()),
          })),
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

app.openapi(getAccessLogsRoute, async (c) => {
  try {
    // TODO: Implement actual access logs retrieval logic
    // const logs = await accessLogService.getUserAccessLogs(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/access-logs', 200, [
      {
        responderName: 'Dr. Sarah Johnson',
        responderCredential: 'EMT-12345',
        accessTime: new Date('2024-01-15T14:30:00.000Z').toISOString(),
        dataAccessed: ['allergies', 'medications', 'bloodType'],
      },
      {
        responderName: 'Paramedic Mike Chen',
        responderCredential: 'PARAM-67890',
        accessTime: new Date('2024-01-10T08:15:00.000Z').toISOString(),
        dataAccessed: ['allergies', 'emergencyContact'],
      },
    ])
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/access-logs', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
