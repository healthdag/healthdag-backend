// * User service for HealthLease Hub
import { PrismaClient, DidCreationStatus } from '@prisma/client'
import { validateWalletConnectionRequest, normalizeAddress } from '../utils/wallet-util'
import { validateEmail, sanitizeName } from '../utils/validation-util'
import { UserDidService } from './user-service-did'
import type {
  User,
  UserUpdateInput,
  WalletConnectionRequest,
  UserStats
} from '../types/auth-types'
import { AuthErrorType } from '../types/auth-types'

// ====================================================================================
// ERROR CLASSES
// ====================================================================================

export class ConflictError extends Error {
  public readonly type = AuthErrorType.CONFLICT_ERROR
  
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class ValidationError extends Error {
  public readonly type = AuthErrorType.VALIDATION_ERROR
  
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  public readonly type = AuthErrorType.NOT_FOUND_ERROR
  
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

// ====================================================================================
// SERVICE CLASS
// ====================================================================================

export class UserService {
  private prisma: PrismaClient
  private didService: UserDidService

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.didService = new UserDidService(prisma)
  }

  // ====================================================================================
  // USER MANAGEMENT
  // ====================================================================================

  /**
   * * Finds a user by ID
   * @param userId - User ID
   * @returns User data or null
   */
  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  /**
   * * Finds a user by email
   * @param email - User's email
   * @returns User data or null
   */
  async findByEmail(email: string): Promise<User | null> {
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return null
    }

    return await this.prisma.user.findUnique({
      where: { email: emailValidation.normalized },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  /**
   * * Updates a user's profile
   * @param userId - User ID
   * @param updateData - Data to update
   * @returns Updated user data
   */
  async updateUser(userId: string, updateData: UserUpdateInput): Promise<User> {
    // Validate user exists
    const existingUser = await this.findById(userId)
    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    // Prepare update data
    const dataToUpdate: Partial<{ name: string | null }> = {}

    if (updateData.name !== undefined) {
      dataToUpdate.name = updateData.name ? sanitizeName(updateData.name) : null
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return updatedUser
  }

  /**
   * * Deletes a user account
   * @param userId - User ID
   */
  async deleteUser(userId: string): Promise<void> {
    // Check if user exists
    const existingUser = await this.findById(userId)
    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    // Delete user (cascade will handle related records)
    await this.prisma.user.delete({
      where: { id: userId }
    })
  }

  // ====================================================================================
  // WALLET CONNECTION
  // ====================================================================================

  /**
   * * Connects a Web3 wallet to a user account
   * @param userId - User ID
   * @param walletAddress - Wallet address to connect
   * @param message - Message that was signed
   * @param signature - Signature of the message
   * @returns Updated user data
   */
  async connectWallet(
    userId: string, 
    walletAddress: string, 
    message: string, 
    signature: string
  ): Promise<User> {
    // Validate user exists
    const existingUser = await this.findById(userId)
    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    // Validate wallet connection request
    const walletRequest: WalletConnectionRequest = {
      message,
      signature,
      walletAddress
    }
    const validation = validateWalletConnectionRequest(walletRequest, userId)

    if (!validation.valid) {
      throw new ValidationError(validation.error || 'Invalid wallet connection request')
    }

    // Normalize wallet address
    const normalizedAddress = normalizeAddress(walletAddress)

    // Check if wallet is already connected to another user
    const existingWalletUser = await this.prisma.user.findUnique({
      where: { walletAddress: normalizedAddress }
    })


    if (existingWalletUser && existingWalletUser.id !== userId) {
      throw new ConflictError('This wallet is already connected to another account')
    }

    // Update user with wallet address
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { walletAddress: normalizedAddress },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return updatedUser
  }

  /**
   * * Disconnects a wallet from a user account
   * @param userId - User ID
   * @returns Updated user data
   */
  async disconnectWallet(userId: string): Promise<User> {
    // Validate user exists
    const existingUser = await this.findById(userId)
    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    // Update user to remove wallet address
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { walletAddress: null },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return updatedUser
  }

  /**
   * * Verifies wallet ownership
   * @param walletAddress - Wallet address
   * @param message - Message that was signed
   * @param signature - Signature of the message
   * @returns True if wallet ownership is verified
   */
  async verifyWalletOwnership(
    walletAddress: string, 
    message: string, 
    signature: string
  ): Promise<boolean> {
    const validation = validateWalletConnectionRequest({
      message,
      signature,
      walletAddress
    })

    return validation.valid
  }

  // ====================================================================================
  // USER STATISTICS
  // ====================================================================================

  /**
   * * Gets user statistics
   * @param userId - User ID
   * @returns User statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    // Validate user exists
    const existingUser = await this.findById(userId)
    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    // Get counts for related entities
    const [documentCount, activeLeases] = await Promise.all([
      this.prisma.document.count({
        where: { userId }
      }),
      this.prisma.lease.count({
        where: { userId, status: 'Active' }
      })
    ])

    // Calculate total earnings (placeholder - would need actual transaction data)
    const totalEarned = '0.00'

    return {
      documentCount,
      activeLeases,
      totalEarned
    }
  }

  /**
   * * Gets user's leases with their statuses and metadata
   * @param userId - User identifier
   * @returns Array of user leases with study details
   * @throws Error if user not found
   */
  async getUserLeases(userId: string): Promise<any[]> {
    try {
      // Validate user exists
      const existingUser = await this.findById(userId)
      if (!existingUser) {
        throw new NotFoundError('User not found')
      }

      const leases = await this.prisma.lease.findMany({
        where: { userId },
        include: {
          study: {
            select: {
              id: true,
              onChainId: true,
              title: true,
              description: true,
              researcherAddress: true,
              paymentPerUser: true,
              participantsNeeded: true,
              participantsEnrolled: true,
              status: true,
              metadataHash: true,
              irbApprovalHash: true,
              createdAt: true,
              updatedAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // * Transform the data to include metadata and status information
      return leases.map(lease => ({
        id: lease.id,
        onChainId: lease.onChainId.toString(),
        paymentAmount: lease.paymentAmount.toString(),
        startTime: lease.startTime.toISOString(),
        endTime: lease.endTime.toISOString(),
        status: lease.status,
        createdAt: lease.createdAt.toISOString(),
        updatedAt: lease.updatedAt.toISOString(),
        study: {
          id: lease.study.id,
          onChainId: lease.study.onChainId.toString(),
          title: lease.study.title,
          description: lease.study.description,
          researcherAddress: lease.study.researcherAddress,
          paymentPerUser: lease.study.paymentPerUser.toString(),
          participantsNeeded: lease.study.participantsNeeded,
          participantsEnrolled: lease.study.participantsEnrolled,
          status: lease.study.status,
          metadataHash: lease.study.metadataHash,
          irbApprovalHash: lease.study.irbApprovalHash,
          createdAt: lease.study.createdAt.toISOString(),
          updatedAt: lease.study.updatedAt.toISOString()
        },
        // * Additional metadata
        isActive: lease.status === 'Active',
        isExpired: new Date() > lease.endTime,
        daysRemaining: Math.max(0, Math.ceil((lease.endTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
        totalDuration: Math.ceil((lease.endTime.getTime() - lease.startTime.getTime()) / (1000 * 60 * 60 * 24))
      }))
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new Error(`Failed to get user leases: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ====================================================================================
  // DID CREATION
  // ====================================================================================

  /**
   * * Initiates DID creation for a user
   * @param userId - User ID
   * @returns Updated user with PENDING status
   */
  async initiateDidCreation(userId: string): Promise<User> {
    return await this.didService.initiateDidCreation(userId)
  }

  /**
   * * Gets DID creation status for a user
   * @param userId - User ID
   * @returns DID status information
   */
  async getDidCreationStatus(userId: string): Promise<{
    status: DidCreationStatus
    did: string | null
  }> {
    return await this.didService.getDidCreationStatus(userId)
  }

  /**
   * * Retries failed DID creation
   * @param userId - User ID
   * @returns Updated user
   */
  async retryDidCreation(userId: string): Promise<User> {
    return await this.didService.retryDidCreation(userId)
  }

  // ====================================================================================
  // HEALTH CHECK
  // ====================================================================================

  /**
   * * Checks if the user service is healthy
   * @returns Health status
   */
  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`
      return { healthy: true }
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { UserStats }
