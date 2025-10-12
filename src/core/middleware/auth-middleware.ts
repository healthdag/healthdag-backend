// * Authentication middleware for HealthLease Hub
import type { Context, Next } from 'hono'
import { extractTokenFromHeader, verifyToken } from '../utils/jwt-util'
import { createErrorResponse } from '../services/response-factory'
import type { ApiEndpoint } from '../types/api-responses'
import { TokenBlacklistService } from '../services/token-blacklist-service'
import { PrismaClient } from '@prisma/client'

// ====================================================================================
// TYPES & INTERFACES
// ====================================================================================

export interface AuthenticatedContext extends Context {
  get(key: 'userId'): string
  set(key: 'userId', value: string): void
}

export interface AuthMiddlewareOptions {
  required?: boolean
  allowExpired?: boolean
}

// * Singleton token blacklist service
let tokenBlacklistService: TokenBlacklistService | null = null

function getTokenBlacklistService(): TokenBlacklistService {
  if (!tokenBlacklistService) {
    const prisma = new PrismaClient()
    tokenBlacklistService = new TokenBlacklistService(prisma)
  }
  return tokenBlacklistService
}

// ====================================================================================
// MIDDLEWARE FUNCTIONS
// ====================================================================================

/**
 * * Authentication middleware that verifies JWT tokens
 * @param c - Hono context
 * @param next - Next middleware function
 * @param options - Middleware options
 */
export async function authenticateToken(
  c: Context, 
  next: Next, 
  options: AuthMiddlewareOptions = { required: true }
): Promise<Response | void> {
  try {
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization')
    const token = extractTokenFromHeader(authHeader || '')

    if (!token) {
      if (options.required) {
        // * Return error response directly for middleware
        return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401)
      }
      // Continue without authentication if not required
      await next()
      return
    }

    // Verify token
    const verification = verifyToken(token)
    if (!verification.valid || !verification.payload) {
      if (options.required) {
        // * Return error response directly for middleware
        return c.json({ error: 'Unauthorized', message: verification.error || 'Invalid or expired token' }, 401)
      }
      // Continue without authentication if not required
      await next()
      return
    }

    // Check if token is blacklisted
    const blacklistService = getTokenBlacklistService()
    const isBlacklisted = await blacklistService.isTokenBlacklisted(token)
    if (isBlacklisted) {
      if (options.required) {
        // * Return error response directly for middleware
        return c.json({ error: 'Unauthorized', message: 'Token has been revoked' }, 401)
      }
      // Continue without authentication if not required
      await next()
      return
    }

    // Attach user ID to context
    c.set('userId', verification.payload.sub)
    
    await next()
  } catch (error) {
    // * Return error response directly for middleware
    return c.json({ error: 'Unauthorized', message: 'Authentication failed' }, 401)
  }
}

/**
 * * Requires authentication - throws error if not authenticated
 * @param c - Hono context
 * @param next - Next middleware function
 */
export async function requireAuth(c: Context, next: Next): Promise<Response | void> {
  return authenticateToken(c, next, { required: true })
}

/**
 * * Optional authentication - continues without error if not authenticated
 * @param c - Hono context
 * @param next - Next middleware function
 */
export async function optionalAuth(c: Context, next: Next): Promise<Response | void> {
  return authenticateToken(c, next, { required: false })
}

/**
 * * Admin authentication middleware (placeholder for future role-based auth)
 * @param c - Hono context
 * @param next - Next middleware function
 */
export async function requireAdmin(c: Context, next: Next): Promise<Response | void> {
  // First require authentication
  const authResult = await requireAuth(c, async () => {
    // TODO: Implement admin role checking
    // For now, this is a placeholder as the MVP only has one user role
    // * Admin role check passed - continue to next middleware
    await next()
  })
  
  // If auth failed, return the error response
  if (authResult && typeof authResult === 'object' && 'status' in authResult && authResult.status !== 200) {
    return authResult
  }
  
  // Admin check passed, continue
  await next()
}

// ====================================================================================
// HELPER FUNCTIONS
// ====================================================================================

/**
 * * Gets the authenticated user ID from context
 * @param c - Hono context
 * @returns User ID or null
 */
export function getUserId(c: Context): string | null {
  return c.get('userId') || null
}

/**
 * * Checks if the context has an authenticated user
 * @param c - Hono context
 * @returns True if user is authenticated
 */
export function isAuthenticated(c: Context): boolean {
  return !!c.get('userId')
}

// ====================================================================================
// EXPORTS
// ====================================================================================

// Types are already exported above