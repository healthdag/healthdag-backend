import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { createApiResponse } from './core/services/response-factory'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import documentRoutes from './routes/documents.routes'
import marketplaceRoutes from './routes/marketplace.routes'
import emergencyRoutes from './routes/emergency.routes'
import dashboardRoutes from './routes/dashboard.routes'
import accessLogsRoutes from './routes/access-logs.routes'
import settingsRoutes from './routes/settings.routes'

// * Main Hono application instance with OpenAPI support
const app = new OpenAPIHono()

// * Middleware setup
app.use('*', logger())
app.use('*', cors())

// * Mount API routes
app.route('/api/auth', authRoutes)
app.route('/api/user', userRoutes)
app.route('/api/documents', documentRoutes)
app.route('/api/marketplace', marketplaceRoutes)
app.route('/api/emergency', emergencyRoutes)
app.route('/api/dashboard', dashboardRoutes)
app.route('/api/access-logs', accessLogsRoutes)
app.route('/api/settings', settingsRoutes)

// * Root documentation routes
app.get('/ui', swaggerUI({ url: '/doc' }))
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'HealthLease Hub API',
    description: 'The complete backend API for HealthLease Hub MVP',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
})

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

// Start the server
const server = serve({
  fetch: app.fetch,
  port: Number(port),
})

console.log(`✅ HealthLease server running on http://localhost:${port}`)
console.log(`📚 API Documentation: http://localhost:${port}/ui`)

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...')
  server.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...')
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})

export default {
  port,
  fetch: app.fetch,
}
