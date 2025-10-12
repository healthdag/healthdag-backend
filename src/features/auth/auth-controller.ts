// * Authentication controller for HealthLease Hub
import type { Context } from 'hono'
import { AuthService, ConflictError, UnauthorizedError, ValidationError } from '../../core/services/auth-service'
import { createApiResponse, createErrorResponse } from '../../core/services/response-factory'
import type { 
  User, 
  UserCreateInput, 
  LoginCredentials, 
  LoginResult,
  ApiResponse,
  ApiErrorResponse
} from '../../core/types/auth-types'

// ====================================================================================
// TYPES & INTERFACES
// ====================================================================================

export interface AuthController {
  register(c: Context): Promise<Response>
  login(c: Context): Promise<Response>
  logout(c: Context): Promise<Response>
}

export interface RegisterResponse {
  id: string
  email: string
}

export interface LogoutResponse {
  message: "Logged out successfully."
}

// ====================================================================================
// CONTROLLER CLASS
// ====================================================================================

export class AuthControllerImpl implements AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  // ====================================================================================
  // USER REGISTRATION
  // ====================================================================================

  /**
   * * Registers a new user account
   * @param c - Hono context
   * @returns Registration response
   */
  async register(c: Context): Promise<Response> {
    try {
      const body = c.get('validatedBody') as UserCreateInput
      
      const user = await this.authService.register(body.email, body.password)
      
      const registerResponse: RegisterResponse = {
        id: user.id,
        email: user.email
      }
      
      const response = createApiResponse('POST /api/auth/register', 201, registerResponse)
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof ConflictError) {
        console.log('⚠️ Registration conflict:', error.message)
        const response = createErrorResponse('POST /api/auth/register', 409, 'Conflict', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      if (error instanceof ValidationError) {
        console.log('⚠️ Registration validation error:', error.message)
        const response = createErrorResponse('POST /api/auth/register', 400, 'Validation Error', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      console.error('❌ REGISTRATION ERROR:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      })
      
      const response = createErrorResponse('POST /api/auth/register', 500, 'Internal Server Error', 'Registration failed')
      return c.json(response.payload, response.statusCode)
    }
  }

  // ====================================================================================
  // USER LOGIN
  // ====================================================================================

  /**
   * * Authenticates a user and returns access token
   * @param c - Hono context
   * @returns Login response
   */
  async login(c: Context): Promise<Response> {
    try {
      const body = c.get('validatedBody') as LoginCredentials
      
      const result: LoginResult = await this.authService.login(body.email, body.password)
      
      const response = createApiResponse('POST /api/auth/login', 200, result)
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        console.log('⚠️ Login unauthorized:', error.message)
        const response = createErrorResponse('POST /api/auth/login', 401, 'Unauthorized', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      if (error instanceof ValidationError) {
        console.log('⚠️ Login validation error:', error.message)
        const response = createErrorResponse('POST /api/auth/login', 400, 'Validation Error', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      console.error('❌ LOGIN ERROR:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      })
      
      const response = createErrorResponse('POST /api/auth/login', 500, 'Internal Server Error', 'Login failed')
      return c.json(response.payload, response.statusCode)
    }
  }

  // ====================================================================================
  // USER LOGOUT
  // ====================================================================================

  /**
   * * Logs out a user by blacklisting their token
   * @param c - Hono context
   * @returns Logout response
   */
  async logout(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        console.log('⚠️ Logout attempted without userId')
        const response = createErrorResponse('POST /api/auth/logout', 401, 'Unauthorized', 'No active session to log out from')
        return c.json(response.payload, response.statusCode)
      }
      
      // Extract token from Authorization header for blacklisting
      const authHeader = c.req.header('Authorization')
      const token = authHeader?.replace('Bearer ', '') || undefined
      
      await this.authService.logout(userId, token)
      
      const logoutResponse: LogoutResponse = {
        message: 'Logged out successfully.'
      }
      
      const response = createApiResponse('POST /api/auth/logout', 200, logoutResponse)
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      console.error('❌ LOGOUT ERROR:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      })
      
      const response = createErrorResponse('POST /api/auth/logout', 500, 'Internal Server Error', 'Logout failed')
      return c.json(response.payload, response.statusCode)
    }
  }
}

// ====================================================================================
// FACTORY FUNCTION
// ====================================================================================

/**
 * * Creates a new authentication controller instance
 * @param authService - Authentication service instance
 * @returns Authentication controller
 */
export function createAuthController(authService: AuthService): AuthController {
  return new AuthControllerImpl(authService)
}

// ====================================================================================
// EXPORTS
// ====================================================================================

// Types are already exported above
