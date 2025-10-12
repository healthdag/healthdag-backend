// * Dashboard controller for HealthLease application
import type { Context } from 'hono'
import { DashboardService, type DashboardStats } from './dashboard-service'
import { prismaService } from '../../core/services/prisma-service'
// * Simple error response helper
const createErrorResponse = (message: string) => ({
  error: 'Error',
  message
})
import { logger } from '../../core/utils/logger'

// ====================================================================================
// CONTROLLER CLASS
// ====================================================================================

export class DashboardController {
  private dashboardService: DashboardService

  constructor() {
    this.dashboardService = new DashboardService(prismaService.prisma)
  }

  // ====================================================================================
  // DASHBOARD ENDPOINTS
  // ====================================================================================

  /**
   * * Gets dashboard statistics for the authenticated user
   * @param c - Hono context
   * @returns Dashboard statistics response
   */
  async getStats(c: Context) {
    try {
      // * Extract user ID from JWT token (set by auth middleware)
      const userId = c.get('userId') as string
      
      if (!userId) {
        return c.json(createErrorResponse('Unauthorized: Missing user ID'), 401)
      }

      // * Get dashboard statistics
      const stats = await this.dashboardService.getStats(userId)

      logger.info('Dashboard stats retrieved successfully', {
        userId,
        endpoint: 'GET /api/dashboard/stats'
      })

      return c.json(stats, 200)

    } catch (error) {
      logger.error('Failed to retrieve dashboard stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: 'GET /api/dashboard/stats'
      })

      if (error instanceof Error && error.message === 'User not found') {
        return c.json(createErrorResponse('User not found'), 404)
      }

      return c.json(createErrorResponse('Internal server error'), 500)
    }
  }

  /**
   * * Gets recent user activity for the dashboard
   * @param c - Hono context
   * @returns Recent activity response
   */
  async getActivity(c: Context) {
    try {
      // * Extract user ID from JWT token (set by auth middleware)
      const userId = c.get('userId') as string
      
      if (!userId) {
        return c.json(createErrorResponse('Unauthorized: Missing user ID'), 401)
      }

      // * Get recent activity from service
      const activity = await this.dashboardService.getRecentActivity(userId)

      logger.info('Dashboard activity retrieved successfully', {
        userId,
        endpoint: 'GET /api/dashboard/activity',
        count: activity.length
      })

      return c.json(activity, 200)

    } catch (error) {
      logger.error('Failed to retrieve dashboard activity', {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: 'GET /api/dashboard/activity'
      })

      return c.json(createErrorResponse('Internal server error'), 500)
    }
  }

  // ====================================================================================
  // HEALTH CHECK
  // ====================================================================================

  /**
   * * Health check endpoint for dashboard service
   * @param c - Hono context
   * @returns Health status response
   */
  async healthCheck(c: Context) {
    try {
      const health = await this.dashboardService.healthCheck()
      
      if (health.healthy) {
        return c.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'dashboard'
        }, 200)
      } else {
        return c.json(createErrorResponse(`Service unhealthy: ${health.error}`), 503)
      }
    } catch (error) {
      return c.json(createErrorResponse('Health check failed'), 500)
    }
  }
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export const dashboardController = new DashboardController()
export type { DashboardStats }