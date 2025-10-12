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
import qrRoutes from './routes/qr.routes'

// * Main Hono application instance with OpenAPI support
const app = new OpenAPIHono()

// * Middleware setup
// * Configure logger based on environment
const logLevel = process.env.LOG_LEVEL || 'info'
app.use('*', logger())

// * Global error handler middleware
app.onError((err, c) => {
  console.error('❌ UNHANDLED ERROR:', {
    message: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString()
  })
  
  // Return detailed error in development, generic in production
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  return c.json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: isDevelopment ? err.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  }, 500)
})

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

// * Mount API routes with error handling
console.log('🔌 Mounting API routes...')
try {
  app.route('/api/auth', authRoutes)
  console.log('  ✅ Auth routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount auth routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/user', userRoutes)
  console.log('  ✅ User routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount user routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/documents', documentRoutes)
  console.log('  ✅ Documents routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount documents routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/marketplace', marketplaceRoutes)
  console.log('  ✅ Marketplace routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount marketplace routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/emergency', emergencyRoutes)
  console.log('  ✅ Emergency routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount emergency routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/dashboard', dashboardRoutes)
  console.log('  ✅ Dashboard routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount dashboard routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/access-logs', accessLogsRoutes)
  console.log('  ✅ Access logs routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount access logs routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/settings', settingsRoutes)
  console.log('  ✅ Settings routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount settings routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

try {
  app.route('/api/qr', qrRoutes)
  console.log('  ✅ QR routes mounted')
} catch (error) {
  console.error('  ❌ Failed to mount QR routes:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  })
}

// * Root documentation routes (conditionally enabled)
if (process.env.ENABLE_DOCS !== 'false') {
  console.log('📚 Registering API documentation routes...')
  
  try {
    // OpenAPI spec endpoint
    console.log('  🔍 Generating OpenAPI spec...')
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
    console.log('  ✅ OpenAPI spec registered at /doc')
    
    // Add a test endpoint to verify OpenAPI spec generation
    app.get('/doc-test', (c) => {
      try {
        console.log('📋 Testing OpenAPI spec generation...')
        return c.json({ 
          success: true, 
          message: 'OpenAPI spec is accessible',
          hint: 'Try accessing /doc to see the full spec'
        })
      } catch (error) {
        console.error('❌ Doc test error:', error)
        return c.json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }, 500)
      }
    })
    console.log('  ✅ OpenAPI spec test endpoint at /doc-test')
    
    // Swagger UI
    app.get('/ui', swaggerUI({ url: '/doc' }))
    console.log('  ✅ Swagger UI registered at /ui')
    
    // Scalar API Reference with error handling
    console.log('  🎨 Setting up Scalar API Reference...')
    try {
      app.get('/scalar', 
        Scalar({
          url: '/doc', // Path to your OpenAPI document
          theme: 'purple', // Optional: Set a theme (e.g., 'default', 'moon', 'solarized')
          pageTitle: "HealthLease Hub API Reference"
        })
      )
      console.log('  ✅ Scalar API Reference registered at /scalar')
    } catch (error) {
      console.error('  ❌ Failed to register Scalar:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      })
      
      // Add fallback error route
      app.get('/scalar', (c) => {
        return c.json({
          error: 'Failed to initialize Scalar API documentation',
          message: error instanceof Error ? error.message : 'Unknown error',
          hint: 'Try accessing /doc for the raw OpenAPI spec or /ui for Swagger UI'
        }, 500)
      })
      console.log('  ⚠️ Scalar fallback error route registered')
    }
    
  } catch (error) {
    console.error('❌ FAILED TO REGISTER DOCUMENTATION ROUTES:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
  }
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
