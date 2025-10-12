// * JWT utility functions for HealthLease Hub authentication
import * as jwt from 'jsonwebtoken'
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
  try {
    return jwt.sign(payload, JWT_SECRET_ASSERTED, {
      expiresIn,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    } as jwt.SignOptions)
  } catch (error) {
    throw new Error(`Failed to sign JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * * Verifies a JWT token and returns the payload if valid
 * @param token - The JWT token to verify
 * @returns JWT verification result
 */
export function verifyToken(token: string): JwtResult {
  try {
    const payload = jwt.verify(token, JWT_SECRET_ASSERTED) as JwtPayload
    return {
      valid: true,
      payload
    }
  } catch (error) {
    let errorMessage = 'Invalid token'
    
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token has expired'
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Invalid token format'
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = 'Token not active yet'
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
  try {
    const decoded = jwt.decode(token, { complete: true })
    
    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token format')
    }
    
    if (!isJwtPayload(decoded.payload)) {
      throw new Error('Invalid payload format')
    }
    
    return {
      header: decoded.header as unknown as Record<string, unknown>,
      payload: decoded.payload,
      signature: decoded.signature
    }
  } catch (error) {
    throw new Error(`Failed to decode token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * * Extracts JWT token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns Extracted token or null if not found
 */
export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

/**
 * * Checks if a JWT token is expired
 * @param token - The JWT token to check
 * @returns True if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token)
    const now = Math.floor(Date.now() / 1000)
    return decoded.payload.exp ? decoded.payload.exp < now : false
  } catch {
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
  const payload: JwtPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    // * Remove exp property - jwt.sign will set it automatically based on expiresIn
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE
  }
  
  return signToken(payload, expiresIn)
}

/**
 * * Validates JWT token format without verification
 * @param token - The JWT token to validate
 * @returns True if token format is valid, false otherwise
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false
  
  const parts = token.split('.')
  return parts.length === 3
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { JwtPayload, JwtResult, JwtDecoded }
