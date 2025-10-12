import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
// Using Bun's built-in server instead of @hono/node-server
import { swaggerUI } from '@hono/swagger-ui'
import { Scalar } from '@scalar/hono-api-reference'
import { logError, logInfo, logSuccess, logWarning } from './core/utils/error-logger'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import documentRoutes from './routes/documents.routes'
import marketplaceRoutes from './routes/marketplace.routes'
import emergencyRoutes from './routes/emergency.routes'
import dashboardRoutes from './routes/dashboard.routes'
import accessLogsRoutes from './routes/access-logs.routes'
import settingsRoutes from './routes/settings.routes'
import qrRoutes from './routes/qr.routes'

// * Main Hono application instance with OpenAPI support
const app = new OpenAPIHono()

// * Middleware setup
// * Add request logger at the very top
app.use('*', async (c, next) => {
  logInfo('SERVER', 'Incoming request', { method: c.req.method, path: c.req.path })
  await next()
  logInfo('SERVER', 'Response sent', { method: c.req.method, path: c.req.path, status: c.res.status })
})

// * Configure logger based on environment
const logLevel = process.env.LOG_LEVEL || 'info'
app.use('*', logger())

// * Global error handler middleware
app.onError((err, c) => {
  logError('SERVER', err, {
    operation: 'global-error-handler',
    path: c.req.path,
    method: c.req.method
  })

  // Always return detailed error for now during testing
  return c.json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: err.message,
      stack: err.stack,
      path: c.req.path
    },
    timestamp: new Date().toISOString()
  }, 500)
})

// * Debug mode configuration
if (process.env.DEBUG === 'true') {
  logInfo('SERVER', 'Debug mode enabled')
  logInfo('SERVER', 'Environment variables loaded', {
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
logInfo('SERVER', 'CORS Configuration', {
  allowedOrigins: corsOrigin.join(', '),
  allowedMethods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  credentials: 'Enabled'
})

// * Mount API routes with error handling
logInfo('SERVER', 'Mounting API routes')
try {
  app.route('/api/auth', authRoutes)
  logSuccess('SERVER', 'Auth routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-auth-routes' })
}

try {
  app.route('/api/user', userRoutes)
  logSuccess('SERVER', 'User routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-user-routes' })
}

try {
  app.route('/api/documents', documentRoutes)
  logSuccess('SERVER', 'Documents routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-documents-routes' })
}

try {
  app.route('/api/marketplace', marketplaceRoutes)
  logSuccess('SERVER', 'Marketplace routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-marketplace-routes' })
}

try {
  app.route('/api/emergency', emergencyRoutes)
  logSuccess('SERVER', 'Emergency routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-emergency-routes' })
}

try {
  app.route('/api/dashboard', dashboardRoutes)
  logSuccess('SERVER', 'Dashboard routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-dashboard-routes' })
}

try {
  app.route('/api/access-logs', accessLogsRoutes)
  logSuccess('SERVER', 'Access logs routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-access-logs-routes' })
}

try {
  app.route('/api/settings', settingsRoutes)
  logSuccess('SERVER', 'Settings routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-settings-routes' })
}

try {
  app.route('/api/qr', qrRoutes)
  logSuccess('SERVER', 'QR routes mounted')
} catch (error) {
  logError('SERVER', error, { operation: 'mount-qr-routes' })
}

// * Root documentation routes (conditionally enabled)
if (process.env.ENABLE_DOCS !== 'false') {
  logInfo('SERVER', 'Registering API documentation routes')
  
  try {
    // OpenAPI spec endpoint
    logInfo('SERVER', 'Generating OpenAPI spec')
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
    logSuccess('SERVER', 'OpenAPI spec registered at /doc')
    
    // Add a test endpoint to verify OpenAPI spec generation
    app.get('/doc-test', (c) => {
      try {
        logInfo('SERVER', 'Testing OpenAPI spec generation')
        return c.json({ 
          success: true, 
          message: 'OpenAPI spec is accessible',
          hint: 'Try accessing /doc to see the full spec'
        })
      } catch (error) {
        logError('SERVER', error, { operation: 'doc-test' })
        return c.json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }, 500)
      }
    })
    logSuccess('SERVER', 'OpenAPI spec test endpoint at /doc-test')
    
    // Swagger UI
    app.get('/ui', swaggerUI({ url: '/doc' }))
    logSuccess('SERVER', 'Swagger UI registered at /ui')
    
    // Scalar API Reference with error handling
    logInfo('SERVER', 'Setting up Scalar API Reference')
    try {
      app.get('/scalar', 
        Scalar({
          url: '/doc', // Path to your OpenAPI document
          theme: 'purple', // Optional: Set a theme (e.g., 'default', 'moon', 'solarized')
          pageTitle: "HealthLease Hub API Reference"
        })
      )
      logSuccess('SERVER', 'Scalar API Reference registered at /scalar')
    } catch (error) {
      logError('SERVER', error, { operation: 'register-scalar' })
      
      // Add fallback error route
      app.get('/scalar', (c) => {
        return c.json({
          error: 'Failed to initialize Scalar API documentation',
          message: error instanceof Error ? error.message : 'Unknown error',
          hint: 'Try accessing /doc for the raw OpenAPI spec or /ui for Swagger UI'
        }, 500)
      })
      logWarning('SERVER', 'Scalar fallback error route registered')
    }
    
  } catch (error) {
    logError('SERVER', error, { operation: 'register-documentation-routes' })
  }
}

// * Log documentation routes if enabled
if (process.env.ENABLE_DOCS !== 'false') {
  logInfo('SERVER', 'API Documentation routes registered', {
    swaggerUI: 'http://localhost:3000/ui',
    scalar: 'http://localhost:3000/scalar',
    openapi: 'http://localhost:3000/doc'
  })
} else {
  logInfo('SERVER', 'API Documentation disabled (ENABLE_DOCS=false)')
}

// * Health check endpoint
app.get('/health', (c) => {
  logInfo('SERVER', 'Health check requested')
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'healthlease-hub-backend',
  })
})

// * Root endpoint
app.get('/', (c) => {
  logInfo('SERVER', 'Root endpoint requested')
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
      settings: '/api/settings',
      qr: '/api/qr/*'
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

// * Export the app for Bun to serve
const port = Number(process.env.PORT || 3000)

logInfo('SERVER', 'HealthLease server starting', { port })
logSuccess('SERVER', 'HealthLease server running', { 
  url: `http://localhost:${port}`,
  documentation: `http://localhost:${port}/ui`
})

// * Export for Bun to serve
export default {
  port,
  fetch: app.fetch,
}
