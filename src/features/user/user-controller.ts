// * User controller for HealthLease Hub
import type { Context, TypedResponse } from 'hono'
import { UserService } from '../../core/services/user-service'
import { ConflictError, ValidationError } from '../../core/services/auth-service'
import { NotFoundError } from '../../core/services/user-service'
import { createApiResponse, createErrorResponse } from '../../core/services/response-factory'
import type { 
  User, 
  UserUpdateInput, 
  WalletConnectionRequest,
  UserStats
} from '../../core/types/auth-types'
import type { UserResponse } from '../../core/types/api-responses'

// ====================================================================================
// TYPES & INTERFACES
// ====================================================================================

export interface UserController {
  getCurrentUser(c: Context): Promise<Response>
  updateUser(c: Context): Promise<Response>
  connectWallet(c: Context): Promise<Response>
  disconnectWallet(c: Context): Promise<Response>
  getUserStats(c: Context): Promise<Response>
  createDid(c: Context): Promise<Response>
  getDidStatus(c: Context): Promise<Response>
}

// ====================================================================================
// CONTROLLER CLASS
// ====================================================================================

export class UserControllerImpl implements UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  // * Helper method to convert User to UserResponse
  private convertUserToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      walletAddress: user.walletAddress,
      did: user.did,
      didCreationStatus: user.didCreationStatus,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  }

  // ====================================================================================
  // USER PROFILE MANAGEMENT
  // ====================================================================================

  /**
   * * Gets the current user's profile
   * @param c - Hono context
   * @returns User profile response
   */
  async getCurrentUser(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('GET /api/user/me', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const user: User | null = await this.userService.findById(userId)
      
      if (!user) {
        const response = createErrorResponse('GET /api/user/me', 404, 'Not Found', 'User not found')
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createApiResponse('GET /api/user/me', 200, this.convertUserToResponse(user))
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      const response = createErrorResponse('GET /api/user/me', 500, 'Internal Server Error', 'Failed to retrieve user profile')
      return c.json(response.payload, response.statusCode)
    }
  }

  /**
   * * Updates the current user's profile
   * @param c - Hono context
   * @returns Updated user profile response
   */
  async updateUser(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('PUT /api/user/me', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const body = await c.req.json() as UserUpdateInput
      
      const updatedUser: User = await this.userService.updateUser(userId, body)
      
      const response = createApiResponse('PUT /api/user/me', 200, this.convertUserToResponse(updatedUser))
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = createErrorResponse('PUT /api/user/me', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      if (error instanceof ValidationError) {
        const response = createErrorResponse('PUT /api/user/me', 400, 'Validation Error', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createErrorResponse('PUT /api/user/me', 500, 'Internal Server Error', 'Failed to update user profile')
      return c.json(response.payload, response.statusCode)
    }
  }

  // ====================================================================================
  // WALLET CONNECTION
  // ====================================================================================

  /**
   * * Connects a Web3 wallet to the current user's account
   * @param c - Hono context
   * @returns Wallet connection response
   */
  async connectWallet(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('POST /api/user/wallet/connect', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const body = await c.req.json() as WalletConnectionRequest
      
      const updatedUser: User = await this.userService.connectWallet(
        userId,
        body.walletAddress,
        body.message,
        body.signature
      )
      
      const response = createApiResponse('POST /api/user/wallet/connect', 200, this.convertUserToResponse(updatedUser))
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = createErrorResponse('POST /api/user/wallet/connect', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      if (error instanceof ConflictError) {
        const response = createErrorResponse('POST /api/user/wallet/connect', 409, 'Conflict', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      if (error instanceof ValidationError) {
        const response = createErrorResponse('POST /api/user/wallet/connect', 400, 'Validation Error', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createErrorResponse('POST /api/user/wallet/connect', 500, 'Internal Server Error', 'Failed to connect wallet')
      return c.json(response.payload, response.statusCode)
    }
  }

  /**
   * * Disconnects the wallet from the current user's account
   * @param c - Hono context
   * @returns Wallet disconnection response
   */
  async disconnectWallet(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('DELETE /api/user/wallet/connect', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const updatedUser: User = await this.userService.disconnectWallet(userId)
      
      const response = createApiResponse('DELETE /api/user/wallet/connect', 200, this.convertUserToResponse(updatedUser))
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = createErrorResponse('DELETE /api/user/wallet/connect', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createErrorResponse('DELETE /api/user/wallet/connect', 500, 'Internal Server Error', 'Failed to disconnect wallet')
      return c.json(response.payload, response.statusCode)
    }
  }

  // ====================================================================================
  // USER STATISTICS
  // ====================================================================================

  /**
   * * Gets the current user's statistics
   * @param c - Hono context
   * @returns User statistics response
   */
  async getUserStats(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('GET /api/user/stats', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const stats: UserStats = await this.userService.getUserStats(userId)
      
      const response = createApiResponse('GET /api/user/stats', 200, stats)
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = createErrorResponse('GET /api/user/stats', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createErrorResponse('GET /api/user/stats', 500, 'Internal Server Error', 'Failed to retrieve user statistics')
      return c.json(response.payload, response.statusCode)
    }
  }

  // ====================================================================================
  // DID MANAGEMENT
  // ====================================================================================

  /**
   * * Initiates DID creation for the current user
   * @param c - Hono context
   * @returns DID creation initiation response
   */
  async createDid(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('POST /api/user/wallet/did', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const updatedUser: User = await this.userService.initiateDidCreation(userId)
      
      const response = createApiResponse('POST /api/user/wallet/did', 202, {
        id: updatedUser.id,
        status: updatedUser.didCreationStatus
      })
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('Wallet address is required') || errorMessage.includes('already has a DID') || errorMessage.includes('already in progress')) {
        const response = createErrorResponse('POST /api/user/wallet/did', 409, 'Conflict', errorMessage)
        return c.json(response.payload, response.statusCode)
      }
      
      if (error instanceof NotFoundError) {
        const response = createErrorResponse('POST /api/user/wallet/did', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createErrorResponse('POST /api/user/wallet/did', 500, 'Internal Server Error', 'Failed to initiate DID creation')
      return c.json(response.payload, response.statusCode)
    }
  }


  /**
   * * Gets the DID creation status for the current user
   * @param c - Hono context
   * @returns DID status response
   */
  async getDidStatus(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId')
      
      if (!userId) {
        const response = createErrorResponse('GET /api/user/wallet/did/status', 401, 'Unauthorized', 'Missing or invalid JWT')
        return c.json(response.payload, response.statusCode)
      }
      
      const status = await this.userService.getDidCreationStatus(userId)
      
      const response = createApiResponse('GET /api/user/wallet/did/status', 200, status)
      
      return c.json(response.payload, response.statusCode)
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = createErrorResponse('GET /api/user/wallet/did/status', 404, 'Not Found', error.message)
        return c.json(response.payload, response.statusCode)
      }
      
      const response = createErrorResponse('GET /api/user/wallet/did/status', 500, 'Internal Server Error', 'Failed to retrieve DID status')
      return c.json(response.payload, response.statusCode)
    }
  }
}

// ====================================================================================
// FACTORY FUNCTION
// ====================================================================================

/**
 * * Creates a new user controller instance
 * @param userService - User service instance
 * @returns User controller
 */
export function createUserController(userService: UserService): UserController {
  return new UserControllerImpl(userService)
}

// ====================================================================================
// EXPORTS
// ====================================================================================

// Types are already exported above