// * JWT utility functions for HealthLease Hub authentication
import * as jwt from 'jsonwebtoken'
import { logError, logInfo, logSuccess, logWarning } from './error-logger'
import type { 
  JwtPayload, 
  JwtResult, 
  JwtDecoded, 
  JwtTokenType
} from '../types/auth-types'
import { 
  JWT_ISSUER,
  JWT_AUDIENCE,
  isJwtPayload
} from '../types/auth-types'

// ====================================================================================
// CONFIGURATION
// ====================================================================================

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m' // Default to 15 minutes as per requirements

if (!JWT_SECRET) {
  logError('JWT_UTIL', new Error('JWT_SECRET environment variable is required'), { operation: 'initialization' })
  throw new Error('JWT_SECRET environment variable is required')
}

// Type assertion after runtime check
const JWT_SECRET_ASSERTED = JWT_SECRET as string

// ====================================================================================
// JWT OPERATIONS
// ====================================================================================

/**
 * * Signs a JWT token with the provided payload
 * @param payload - The payload to sign
 * @param expiresIn - Token expiration time (defaults to JWT_EXPIRES_IN)
 * @returns Signed JWT token
 */
export function signToken(payload: JwtPayload, expiresIn: string = JWT_EXPIRES_IN): string {
  logInfo('JWT_UTIL', 'Signing JWT token', { sub: payload.sub, expiresIn })
  try {
    const token = jwt.sign(payload, JWT_SECRET_ASSERTED, {
      expiresIn,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    } as jwt.SignOptions)
    logSuccess('JWT_UTIL', 'JWT token signed successfully', { sub: payload.sub })
    return token
  } catch (error) {
    logError('JWT_UTIL', error, { operation: 'signToken', sub: payload.sub })
    throw new Error(`Failed to sign JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * * Verifies a JWT token and returns the payload if valid
 * @param token - The JWT token to verify
 * @returns JWT verification result
 */
export function verifyToken(token: string): JwtResult {
  logInfo('JWT_UTIL', 'Verifying JWT token')
  try {
    const payload = jwt.verify(token, JWT_SECRET_ASSERTED, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }) as JwtPayload
    logSuccess('JWT_UTIL', 'JWT token verified successfully', { sub: payload.sub })
    return {
      valid: true,
      payload
    }
  } catch (error) {
    let errorMessage = 'Invalid token'
    
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token has expired'
      logWarning('JWT_UTIL', 'Token verification failed - expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Invalid token format'
      logWarning('JWT_UTIL', 'Token verification failed - invalid format')
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = 'Token not active yet'
      logWarning('JWT_UTIL', 'Token verification failed - not active yet')
    } else {
      logError('JWT_UTIL', error, { operation: 'verifyToken' })
    }
    
    return {
      valid: false,
      error: errorMessage
    }
  }
}

/**
 * * Decodes a JWT token without verification (for inspection)
 * @param token - The JWT token to decode
 * @returns Decoded token parts
 */
export function decodeToken(token: string): JwtDecoded {
  logInfo('JWT_UTIL', 'Decoding JWT token')
  try {
    const decoded = jwt.decode(token, { complete: true })
    
    if (!decoded || typeof decoded === 'string') {
      logWarning('JWT_UTIL', 'Token decode failed - invalid format')
      throw new Error('Invalid token format')
    }
    
    if (!isJwtPayload(decoded.payload)) {
      logWarning('JWT_UTIL', 'Token decode failed - invalid payload format')
      throw new Error('Invalid payload format')
    }
    
    logSuccess('JWT_UTIL', 'JWT token decoded successfully', { sub: decoded.payload.sub })
    return {
      header: decoded.header as unknown as Record<string, unknown>,
      payload: decoded.payload,
      signature: decoded.signature
    }
  } catch (error) {
    logError('JWT_UTIL', error, { operation: 'decodeToken' })
    throw new Error(`Failed to decode token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * * Extracts JWT token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns Extracted token or null if not found
 */
export function extractTokenFromHeader(authHeader: string): string | null {
  logInfo('JWT_UTIL', 'Extracting token from Authorization header')
  
  if (!authHeader) {
    logWarning('JWT_UTIL', 'No Authorization header provided')
    return null
  }
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    logWarning('JWT_UTIL', 'Invalid Authorization header format')
    return null
  }
  
  logSuccess('JWT_UTIL', 'Token extracted from Authorization header')
  return parts[1]
}

/**
 * * Checks if a JWT token is expired
 * @param token - The JWT token to check
 * @returns True if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  logInfo('JWT_UTIL', 'Checking if token is expired')
  try {
    const decoded = decodeToken(token)
    const now = Math.floor(Date.now() / 1000)
    const isExpired = decoded.payload.exp ? decoded.payload.exp < now : false
    logSuccess('JWT_UTIL', 'Token expiration check completed', { isExpired })
    return isExpired
  } catch (error) {
    logWarning('JWT_UTIL', 'Token expiration check failed - considering expired', { error: error instanceof Error ? error.message : 'Unknown error' })
    return true // If we can't decode it, consider it expired
  }
}

/**
 * * Generates a new access token for a user
 * @param userId - The user ID to include in the token
 * @param expiresIn - Token expiration time (defaults to JWT_EXPIRES_IN)
 * @returns New JWT access token
 */
export function generateAccessToken(userId: string, expiresIn: string = JWT_EXPIRES_IN): string {
  logInfo('JWT_UTIL', 'Generating access token', { userId, expiresIn })
  const payload: JwtPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000)
    // * Remove exp, aud, and iss properties - jwt.sign will set them automatically based on options
  }
  
  return signToken(payload, expiresIn)
}

/**
 * * Validates JWT token format without verification
 * @param token - The JWT token to validate
 * @returns True if token format is valid, false otherwise
 */
export function isValidTokenFormat(token: string): boolean {
  logInfo('JWT_UTIL', 'Validating token format')
  if (!token || typeof token !== 'string') {
    logWarning('JWT_UTIL', 'Token format validation failed - invalid type')
    return false
  }
  
  const parts = token.split('.')
  const isValid = parts.length === 3
  logSuccess('JWT_UTIL', 'Token format validation completed', { isValid })
  return isValid
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { JwtPayload, JwtResult, JwtDecoded }
