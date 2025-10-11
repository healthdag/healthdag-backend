// * Middleware functions for HealthLease application

import type { Context, Next } from 'hono'
import { createErrorResponse } from '../utils/index.js'

/**
 * Request timing middleware
 * Logs request duration for performance monitoring
 */
export async function timingMiddleware(c: Context, next: Next) {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  
  // * Log slow requests (>1 second)
  if (duration > 1000) {
    console.warn(`Slow request: ${c.req.method} ${c.req.url} took ${duration}ms`)
  }
}

/**
 * Request validation middleware
 * Validates required headers and basic request structure
 */
export async function validationMiddleware(c: Context, next: Next) {
  const userAgent = c.req.header('user-agent')
  
  // * Block requests without user agent (basic bot protection)
  if (!userAgent) {
    return c.json(createErrorResponse('User-Agent header required'), 400)
  }
  
  await next()
}

/**
 * Error handling middleware
 * Catches and formats unhandled errors
 */
export async function errorHandlerMiddleware(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('Unhandled error:', error)
    
    const errorResponse = createErrorResponse(
      'Internal server error',
      'INTERNAL_ERROR',
      process.env.NODE_ENV === 'development' ? error : undefined
    )
    
    return c.json(errorResponse, 500)
  }
}

/**
 * Security headers middleware
 * Adds security headers to responses
 */
export async function securityHeadersMiddleware(c: Context, next: Next) {
  await next()
  
  // * Add security headers
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
}
