import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { createApiResponse } from './core/services/response-factory'
import authRoutes from './routes/auth.routes'

// * Main Hono application instance
const app = new Hono()

// * Middleware setup
app.use('*', logger())
app.use('*', cors())

// * Mount API routes
app.route('/api/auth', authRoutes)

// * Health check endpoint
app.get('/health', (c) => {
  const response = createApiResponse('GET /health', 200, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'healthlease-hub-backend',
  })
  
  return c.json(response.payload, response.statusCode as any)
})

// * Root endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'HealthLease Hub API', 
    version: '1.0.0',
    documentation: '/ui',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      user: '/api/user/*',
      documents: '/api/documents/*',
      marketplace: '/api/marketplace/*',
      emergency: '/api/emergency/*',
      dashboard: '/api/dashboard/*',
      accessLogs: '/api/access-logs',
      settings: '/api/settings'
    }
  })
})

// * All endpoints are now handled by their respective route modules

// * Start server
const port = process.env.PORT || 3000

console.log(`🚀 HealthLease server starting on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
