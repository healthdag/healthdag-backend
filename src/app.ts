import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

// * Main Hono application instance
const app = new Hono()

// * Middleware setup
app.use('*', logger())
app.use('*', cors())

// * Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'healthlease'
  })
})

// * Root endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'HealthLease API', 
    version: '1.0.0',
    endpoints: {
      health: '/health'
    }
  })
})

// * Start server
const port = process.env.PORT || 3000

console.log(`🚀 HealthLease server starting on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
