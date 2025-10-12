// * Dashboard routes for HealthLease application
import { Hono } from 'hono'
import { dashboardController } from './dashboard-controller'
import { requireAuth } from '../../core/middleware/auth-middleware'

// ====================================================================================
// ROUTER SETUP
// ====================================================================================

export const dashboardRoutes = new Hono()

// * Apply authentication middleware to all dashboard routes
dashboardRoutes.use('*', requireAuth)

// ====================================================================================
// DASHBOARD ENDPOINTS
// ====================================================================================

/**
 * GET /api/dashboard/stats
 * * Gets aggregated dashboard statistics for the authenticated user
 * * Returns: documentCount, activeLeases, totalEarned
 */
dashboardRoutes.get('/stats', async (c) => {
  return await dashboardController.getStats(c)
})

/**
 * GET /api/dashboard/activity
 * * Gets recent user activity for the dashboard
 * * Returns: Array of recent activities with timestamps
 */
dashboardRoutes.get('/activity', async (c) => {
  return await dashboardController.getActivity(c)
})

/**
 * GET /api/dashboard/health
 * * Health check endpoint for dashboard service
 * * Returns: Service health status
 */
dashboardRoutes.get('/health', async (c) => {
  return await dashboardController.healthCheck(c)
})

// ====================================================================================
// EXPORTS
// ====================================================================================

export default dashboardRoutes