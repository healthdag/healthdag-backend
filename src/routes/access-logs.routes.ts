// * Access logs routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { logError } from '../core/utils/error-logger'

const app = new OpenAPIHono()

// * Initialize Prisma client
console.log('🔧 Initializing access logs services...')
try {
  var prisma = new PrismaClient()
  console.log('✅ PrismaClient initialized for access logs')
} catch (error) {
  console.error('❌ FAILED TO INITIALIZE ACCESS LOGS SERVICES:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    error
  })
  throw error
}

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
    const userId = c.get('userId')
    
    if (!userId) {
      const response = createErrorResponse(
        'GET /api/access-logs',
        401,
        'Unauthorized',
        'User authentication required'
      )
      return c.json(response.payload, response.statusCode as any)
    }
    
    // Get access logs from database
    const accessLogs = await prisma.accessLog.findMany({
      where: {
        userId
      },
      select: {
        responderName: true,
        responderCredential: true,
        accessTime: true,
        dataAccessed: true
      },
      orderBy: {
        accessTime: 'desc'
      },
      take: 50 // Limit to last 50 logs
    })
    
    const response = createApiResponse('GET /api/access-logs', 200, accessLogs)
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    logError('ACCESS_LOGS', error, {
      endpoint: 'GET /api/access-logs',
      userId: c.get('userId'),
      operation: 'list'
    })
    
    const response = createErrorResponse(
      'GET /api/access-logs',
      500,
      'Internal Server Error',
      'Failed to retrieve access logs'
    )
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
