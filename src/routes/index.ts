// * Route handlers for HealthLease application

import { Hono } from 'hono'
import { createSuccessResponse, createErrorResponse } from '../utils/index.js'
import type { HealthCheckResponse } from '../types/index.js'

// * Create routes instance
export const routes = new Hono()

/**
 * Enhanced health check endpoint
 * Returns detailed system status
 */
routes.get('/health', (c) => {
  const healthData: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'healthlease',
    version: '1.0.0'
  }
  
  return c.json(createSuccessResponse(healthData))
})

/**
 * API info endpoint
 * Returns API documentation and available endpoints
 */
routes.get('/api/info', (c) => {
  const apiInfo = {
    name: 'HealthLease API',
    version: '1.0.0',
    description: 'HealthLease application API',
    endpoints: {
      health: '/health',
      apiInfo: '/api/info',
      static: '/static/*'
    },
    documentation: 'https://docs.healthlease.com'
  }
  
  return c.json(createSuccessResponse(apiInfo))
})

/**
 * 404 handler for API routes
 */
routes.notFound((c) => {
  return c.json(createErrorResponse('API endpoint not found', 'NOT_FOUND'), 404)
})
