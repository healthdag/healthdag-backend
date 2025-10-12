// * Rate limiting middleware for HealthLease Hub
import type { Context, Next } from 'hono'
import { PrismaClient } from '@prisma/client'

// ====================================================================================
// TYPES & INTERFACES
// ====================================================================================

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (c: Context) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  totalHits: number
}

// ====================================================================================
// RATE LIMIT STORE
// ====================================================================================

class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    return this.store.get(key) || null
  }

  async set(key: string, count: number, resetTime: number): Promise<void> {
    this.store.set(key, { count, resetTime })
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + windowMs
    const existing = this.store.get(key)

    if (existing && existing.resetTime > now) {
      // Within window, increment count
      existing.count++
      return existing
    } else {
      // New window or expired, start fresh
      const newEntry = { count: 1, resetTime }
      this.store.set(key, newEntry)
      return newEntry
    }
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime <= now) {
        this.store.delete(key)
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

// ====================================================================================
// MIDDLEWARE FUNCTIONS
// ====================================================================================

// * Global rate limit store
const rateLimitStore = new RateLimitStore()

/**
 * * Rate limiting middleware
 * @param options - Rate limiting options
 * @returns Middleware function
 */
export function rateLimit(options: RateLimitOptions) {
  return async (c: Context, next: Next): Promise<Response> => {
    try {
      // Generate rate limit key
      const key = options.keyGenerator 
        ? options.keyGenerator(c)
        : generateDefaultKey(c)

      // Check current rate limit status
      const result = await checkRateLimit(key, options)

      // Set rate limit headers
      c.header('X-RateLimit-Limit', options.maxRequests.toString())
      c.header('X-RateLimit-Remaining', result.remaining.toString())
      c.header('X-RateLimit-Reset', result.resetTime.toString())
      c.header('X-RateLimit-Total-Hits', result.totalHits.toString())

      if (!result.allowed) {
        return c.json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        }, 429)
      }

      // Continue to next middleware
      await next()

      // Update rate limit after request (if needed)
      if (!options.skipSuccessfulRequests || c.res.status >= 400) {
        await updateRateLimit(key, options)
      }

      return c.res
    } catch (error) {
      console.error('Rate limit middleware error:', error)
      // Continue without rate limiting if there's an error
      await next()
      return c.res
    }
  }
}

// ====================================================================================
// AUTHENTICATION RATE LIMITS
// ====================================================================================

/**
 * * Strict rate limit for authentication endpoints
 * @param windowMs - Time window in milliseconds (default: 15 minutes)
 * @param maxRequests - Maximum requests per window (default: 5)
 */
export function authRateLimit(windowMs: number = 15 * 60 * 1000, maxRequests: number = 5) {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (c) => {
      // Use IP address for authentication endpoints
      const ip = getClientIP(c)
      return `auth:${ip}`
    },
    skipSuccessfulRequests: false // Count all requests for auth endpoints
  })
}

/**
 * * Moderate rate limit for general API endpoints
 * @param windowMs - Time window in milliseconds (default: 15 minutes)
 * @param maxRequests - Maximum requests per window (default: 100)
 */
export function apiRateLimit(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (c) => {
      // Use IP address for general API endpoints
      const ip = getClientIP(c)
      return `api:${ip}`
    },
    skipSuccessfulRequests: true // Don't count successful requests
  })
}

/**
 * * User-specific rate limit for authenticated endpoints
 * @param windowMs - Time window in milliseconds (default: 15 minutes)
 * @param maxRequests - Maximum requests per window (default: 200)
 */
export function userRateLimit(windowMs: number = 15 * 60 * 1000, maxRequests: number = 200) {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (c) => {
      // Use user ID if authenticated, otherwise IP
      const userId = c.get('userId')
      const ip = getClientIP(c)
      return `user:${userId || ip}`
    },
    skipSuccessfulRequests: true // Don't count successful requests
  })
}

// ====================================================================================
// HELPER FUNCTIONS
// ====================================================================================

/**
 * * Generates default rate limit key based on IP address
 * @param c - Hono context
 * @returns Rate limit key
 */
function generateDefaultKey(c: Context): string {
  const ip = getClientIP(c)
  return `rate_limit:${ip}`
}

/**
 * * Gets client IP address from request
 * @param c - Hono context
 * @returns Client IP address
 */
function getClientIP(c: Context): string {
  // Check various headers for IP address
  const forwarded = c.req.header('X-Forwarded-For')
  const realIP = c.req.header('X-Real-IP')
  const cfConnectingIP = c.req.header('CF-Connecting-IP')
  
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to connection remote address
  return c.env?.ip || 'unknown'
}

/**
 * * Checks current rate limit status
 * @param key - Rate limit key
 * @param options - Rate limit options
 * @returns Rate limit result
 */
async function checkRateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now()
  const existing = await rateLimitStore.get(key)

  if (!existing || existing.resetTime <= now) {
    // No existing limit or expired
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
      totalHits: 1
    }
  }

  const remaining = Math.max(0, options.maxRequests - existing.count)
  const allowed = existing.count < options.maxRequests

  return {
    allowed,
    remaining,
    resetTime: existing.resetTime,
    totalHits: existing.count
  }
}

/**
 * * Updates rate limit after request
 * @param key - Rate limit key
 * @param options - Rate limit options
 */
async function updateRateLimit(key: string, options: RateLimitOptions): Promise<void> {
  await rateLimitStore.increment(key, options.windowMs)
}

// ====================================================================================
// EXPORTS
// ====================================================================================

// Types are already exported above
