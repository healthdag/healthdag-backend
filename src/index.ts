import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'
import { routes } from './routes/index.js'
import { 
  timingMiddleware, 
  validationMiddleware, 
  errorHandlerMiddleware, 
  securityHeadersMiddleware 
} from './middleware/index.js'
import { createSuccessResponse } from './utils/index.js'

// * Main Hono application instance
const app = new Hono()

// * Middleware setup
app.use('*', errorHandlerMiddleware)
app.use('*', timingMiddleware)
app.use('*', validationMiddleware)
app.use('*', securityHeadersMiddleware)
app.use('*', logger())
app.use('*', cors())

// * Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// * Mount API routes
app.route('/', routes)

// * Root endpoint
app.get('/', (c) => {
  return c.json(createSuccessResponse({
    message: 'HealthLease API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      apiInfo: '/api/info',
      static: '/static/*'
    }
  }))
})

// * Start server
const port = process.env.PORT || 3000

console.log(`🚀 HealthLease server starting on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
