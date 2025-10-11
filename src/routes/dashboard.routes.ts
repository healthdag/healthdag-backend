// * Dashboard routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'

const app = new OpenAPIHono()

// === GET DASHBOARD STATS ===
const getStatsRoute = createRoute({
  method: 'get',
  path: '/stats',
  tags: ['Dashboard'],
  summary: 'Get dashboard statistics',
  description: 'Fetches aggregated stats: document count, active leases, and total earnings',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Dashboard stats retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            documentCount: z.number().int(),
            activeLeases: z.number().int(),
            totalEarned: z.string(),
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

app.openapi(getStatsRoute, async (c) => {
  try {
    // TODO: Implement actual dashboard stats logic
    // const stats = await dashboardService.getUserStats(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/dashboard/stats', 200, {
      documentCount: 5,
      activeLeases: 2,
      totalEarned: '250.00',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/dashboard/stats', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === GET ACTIVITY FEED ===
const getActivityRoute = createRoute({
  method: 'get',
  path: '/activity',
  tags: ['Dashboard'],
  summary: 'Get user activity feed',
  description: 'Retrieves a feed of recent user activities (e.g., "Document Uploaded")',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Activity feed retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(z.object({
            id: z.string().cuid(),
            type: z.string(),
            description: z.string(),
            timestamp: z.string().datetime(),
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

app.openapi(getActivityRoute, async (c) => {
  try {
    // TODO: Implement actual activity feed logic
    // const activities = await dashboardService.getUserActivity(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/dashboard/activity', 200, [
      {
        id: 'activity_123',
        type: 'document_uploaded',
        description: 'Lab results document uploaded successfully',
        timestamp: new Date('2024-01-15T10:30:00.000Z').toISOString(),
      },
      {
        id: 'activity_456',
        type: 'study_applied',
        description: 'Applied to Cardiovascular Health Study',
        timestamp: new Date('2024-01-14T15:45:00.000Z').toISOString(),
      },
      {
        id: 'activity_789',
        type: 'lease_confirmed',
        description: 'Data lease confirmed for Diabetes Management Research',
        timestamp: new Date('2024-01-13T09:20:00.000Z').toISOString(),
      },
    ])
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/dashboard/activity', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
