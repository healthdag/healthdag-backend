import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
// Using Bun's built-in server instead of @hono/node-server
import { swaggerUI } from '@hono/swagger-ui'
import { Scalar } from '@scalar/hono-api-reference'
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
// * Configure logger based on environment
const logLevel = process.env.LOG_LEVEL || 'info'
app.use('*', logger())

// * Debug mode configuration
if (process.env.DEBUG === 'true') {
  console.log('🐛 Debug mode enabled')
  console.log('📊 Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL: process.env.LOG_LEVEL,
    DEBUG: process.env.DEBUG
  })
}

// * CORS configuration with environment variables
const corsOrigin = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173']
app.use('*', cors({
  origin: corsOrigin,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}))

// * Log CORS configuration
console.log('🌐 CORS Configuration:')
console.log('  • Allowed Origins:', corsOrigin.join(', '))
console.log('  • Allowed Methods: GET, POST, PUT, DELETE, OPTIONS')
console.log('  • Allowed Headers: Content-Type, Authorization, X-Requested-With')
console.log('  • Credentials: Enabled')

// * Mount API routes
app.route('/api/auth', authRoutes)
app.route('/api/user', userRoutes)
app.route('/api/documents', documentRoutes)
app.route('/api/marketplace', marketplaceRoutes)
app.route('/api/emergency', emergencyRoutes)
app.route('/api/dashboard', dashboardRoutes)
app.route('/api/access-logs', accessLogsRoutes)
app.route('/api/settings', settingsRoutes)

// * Root documentation routes (conditionally enabled)
if (process.env.ENABLE_DOCS !== 'false') {
  app.get('/ui', swaggerUI({ url: '/doc' }))
  app.get('/scalar', Scalar({ 
    url: '/doc',
    pageTitle: 'HealthLease Hub API',
    theme: 'purple'
  }))
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
      {
        url: 'https://healthlease-api.goremote.africa',
        description: 'Production documentation server',
      },
    ],
  })
}

// * Log documentation routes if enabled
if (process.env.ENABLE_DOCS !== 'false') {
  console.log('📚 API Documentation routes registered:')
  console.log('  • Swagger UI: http://localhost:3000/ui')
  console.log('  • Scalar API Reference: http://localhost:3000/scalar')
  console.log('  • OpenAPI Spec: http://localhost:3000/doc')
} else {
  console.log('📚 API Documentation disabled (ENABLE_DOCS=false)')
}

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
  const response: any = { 
    message: 'HealthLease Hub API', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
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
  }

  // * Add documentation links if enabled
  if (process.env.ENABLE_DOCS !== 'false') {
    response.documentation = {
      swagger: '/ui',
      scalar: '/scalar',
      openapi: '/doc'
    }
  }

  return c.json(response)
})

// * All endpoints are now handled by their respective route modules

// * Start server
const port = process.env.PORT || 3000

console.log(`🚀 HealthLease server starting on port ${port}`)

console.log(`✅ HealthLease server running on http://localhost:${port}`)
console.log(`📚 API Documentation: http://localhost:${port}/ui`)

// * Export the Hono app for Bun's built-in server
export default {
  port: Number(port),
  fetch: app.fetch,
}
