// * Authentication middleware for HealthLease Hub
import type { Context, Next } from 'hono'
import { extractTokenFromHeader, verifyToken } from '../utils/jwt-util'
import { createErrorResponse } from '../services/response-factory'
import type { ApiEndpoint } from '../types/api-responses'
import { TokenBlacklistService } from '../services/token-blacklist-service'
import { PrismaClient } from '@prisma/client'
import { logError, logInfo, logSuccess, logWarning } from '../utils/error-logger'

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
  logInfo('AUTH_MIDDLEWARE', 'Starting token authentication', { required: options.required })
  
  try {
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization')
    const token = extractTokenFromHeader(authHeader || '')

    if (!token) {
      if (options.required) {
        logWarning('AUTH_MIDDLEWARE', 'Missing authorization header', { path: c.req.path, method: c.req.method })
        // * Return error response directly for middleware
        return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401)
      }
      // Continue without authentication if not required
      logInfo('AUTH_MIDDLEWARE', 'Continuing without authentication (not required)')
      await next()
      return
    }

    // Verify token
    logInfo('AUTH_MIDDLEWARE', 'Verifying token')
    const verification = verifyToken(token)
    if (!verification.valid || !verification.payload) {
      if (options.required) {
        logWarning('AUTH_MIDDLEWARE', 'Token verification failed', { error: verification.error, path: c.req.path })
        // * Return error response directly for middleware
        return c.json({ error: 'Unauthorized', message: verification.error || 'Invalid or expired token' }, 401)
      }
      // Continue without authentication if not required
      logInfo('AUTH_MIDDLEWARE', 'Continuing without authentication (token invalid but not required)')
      await next()
      return
    }

    // Check if token is blacklisted
    logInfo('AUTH_MIDDLEWARE', 'Checking token blacklist')
    const blacklistService = getTokenBlacklistService()
    const isBlacklisted = await blacklistService.isTokenBlacklisted(token)
    if (isBlacklisted) {
      if (options.required) {
        logWarning('AUTH_MIDDLEWARE', 'Token is blacklisted', { userId: verification.payload.sub, path: c.req.path })
        // * Return error response directly for middleware
        return c.json({ error: 'Unauthorized', message: 'Token has been revoked' }, 401)
      }
      // Continue without authentication if not required
      logInfo('AUTH_MIDDLEWARE', 'Continuing without authentication (token blacklisted but not required)')
      await next()
      return
    }

    // Attach user ID to context
    c.set('userId', verification.payload.sub)
    logSuccess('AUTH_MIDDLEWARE', 'Authentication successful', { userId: verification.payload.sub, path: c.req.path })
    
    await next()
  } catch (error) {
    logError('AUTH_MIDDLEWARE', error, { operation: 'authenticateToken', path: c.req.path, method: c.req.method })
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
  logInfo('AUTH_MIDDLEWARE', 'RequireAuth middleware called', { path: c.req.path })
  return authenticateToken(c, next, { required: true })
}

/**
 * * Optional authentication - continues without error if not authenticated
 * @param c - Hono context
 * @param next - Next middleware function
 */
export async function optionalAuth(c: Context, next: Next): Promise<Response | void> {
  logInfo('AUTH_MIDDLEWARE', 'OptionalAuth middleware called', { path: c.req.path })
  return authenticateToken(c, next, { required: false })
}

/**
 * * Admin authentication middleware (placeholder for future role-based auth)
 * @param c - Hono context
 * @param next - Next middleware function
 */
export async function requireAdmin(c: Context, next: Next): Promise<Response | void> {
  logInfo('AUTH_MIDDLEWARE', 'RequireAdmin middleware called', { path: c.req.path })
  
  // First require authentication
  const authResult = await requireAuth(c, async () => {
    logInfo('AUTH_MIDDLEWARE', 'Admin role check (placeholder)', { userId: c.get('userId') })
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