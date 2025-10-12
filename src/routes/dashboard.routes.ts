// * Dashboard routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { DashboardService } from '../features/dashboard/dashboard-service'
import { prismaService } from '../core/services/prisma-service'
import { requireAuth, getUserId } from '../core/middleware/auth-middleware'

const app = new OpenAPIHono()

// * Initialize dashboard service
const dashboardService = new DashboardService(prismaService.prisma)

// * Apply authentication middleware
app.use('*', requireAuth)

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
    // * Get user ID from auth middleware
    const userId = getUserId(c)
    
    if (!userId) {
      const response = createErrorResponse('GET /api/dashboard/stats', 401, 'Unauthorized', 'User not authenticated')
      return c.json(response.payload, response.statusCode as any)
    }
    
    // * Get dashboard statistics using the service
    const stats = await dashboardService.getStats(userId)
    
    const response = createApiResponse('GET /api/dashboard/stats', 200, stats)
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/dashboard/stats', 401, 'Unauthorized', 'Failed to retrieve dashboard stats')
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
  // Dashboard activity is handled by the dashboard controller
  return await dashboardController.getActivity(c)
})

export default app
