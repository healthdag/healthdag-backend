// * Dashboard controller for HealthLease application
import type { Context } from 'hono'
import { DashboardService, type DashboardStats } from './dashboard-service'
import { prismaService } from '../../core/services/prisma-service'
import { logger } from '../../core/utils/logger'
import { logError, logInfo, logSuccess, logWarning } from '../../core/utils/error-logger'

// * Simple error response helper
const createErrorResponse = (message: string) => ({
  error: 'Error',
  message
})

// ====================================================================================
// CONTROLLER CLASS
// ====================================================================================

export class DashboardController {
  private dashboardService: DashboardService

  constructor() {
    logInfo('DASHBOARD_CONTROLLER', 'Initializing DashboardController')
    this.dashboardService = new DashboardService(prismaService.prisma)
    logSuccess('DASHBOARD_CONTROLLER', 'DashboardController initialized successfully')
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
    logInfo('DASHBOARD_CONTROLLER', 'Starting dashboard stats retrieval')
    
    try {
      // * Extract user ID from JWT token (set by auth middleware)
      const userId = c.get('userId') as string
      
      if (!userId) {
        logWarning('DASHBOARD_CONTROLLER', 'Stats request without userId')
        return c.json(createErrorResponse('Unauthorized: Missing user ID'), 401)
      }

      logInfo('DASHBOARD_CONTROLLER', 'Getting dashboard statistics', { userId })
      // * Get dashboard statistics
      const stats = await this.dashboardService.getStats(userId)

      logSuccess('DASHBOARD_CONTROLLER', 'Dashboard stats retrieved successfully', {
        userId,
        endpoint: 'GET /api/dashboard/stats'
      })

      return c.json(stats, 200)

    } catch (error) {
      logError('DASHBOARD_CONTROLLER', error, {
        operation: 'getStats',
        userId: c.get('userId'),
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
    logInfo('DASHBOARD_CONTROLLER', 'Starting dashboard activity retrieval')
    
    try {
      // * Extract user ID from JWT token (set by auth middleware)
      const userId = c.get('userId') as string
      
      if (!userId) {
        logWarning('DASHBOARD_CONTROLLER', 'Activity request without userId')
        return c.json(createErrorResponse('Unauthorized: Missing user ID'), 401)
      }

      logInfo('DASHBOARD_CONTROLLER', 'Getting recent activity', { userId })
      // * Get recent activity from service
      const activity = await this.dashboardService.getRecentActivity(userId)

      logSuccess('DASHBOARD_CONTROLLER', 'Dashboard activity retrieved successfully', {
        userId,
        endpoint: 'GET /api/dashboard/activity',
        count: activity.length
      })

      return c.json(activity, 200)

    } catch (error) {
      logError('DASHBOARD_CONTROLLER', error, {
        operation: 'getActivity',
        userId: c.get('userId'),
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
    logInfo('DASHBOARD_CONTROLLER', 'Starting dashboard health check')
    
    try {
      const health = await this.dashboardService.healthCheck()
      
      if (health.healthy) {
        logSuccess('DASHBOARD_CONTROLLER', 'Dashboard health check passed')
        return c.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'dashboard'
        }, 200)
      } else {
        logWarning('DASHBOARD_CONTROLLER', 'Dashboard health check failed', { error: health.error })
        return c.json(createErrorResponse(`Service unhealthy: ${health.error}`), 503)
      }
    } catch (error) {
      logError('DASHBOARD_CONTROLLER', error, {
        operation: 'healthCheck'
      })
      
      return c.json(createErrorResponse('Health check failed'), 500)
    }
  }
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export const dashboardController = new DashboardController()
export type { DashboardStats }