// * User service for HealthLease application
// * Manages user profile data and orchestrates Web3 identity workflows
import { ethers } from 'ethers'
import { prismaService } from '../../core/services/prisma-service.js'
import { web3Service } from '../../core/services/web3-service.js'
import { ipfsService } from '../../core/services/ipfs-service.js'
import type { User, UpdateUser, ConnectWalletDto, DidStatusResponse } from '../../core/types/api-schemas.js'
import { DidCreationStatusEnum } from '../../core/types/api-schemas.js'
import { logger } from '../../core/utils/logger.js'

/**
 * UserService - Manages user profile data and orchestrates Web3 identity workflows
 * 
 * Responsibilities:
 * - User profile management (CRUD operations)
 * - Wallet connection with signature verification
 * - DID creation workflow orchestration
 * - Integration with Web3Service and IpfsService
 */
export class UserService {
  private readonly prisma = prismaService.prisma
  private readonly web3Service = web3Service
  private readonly ipfsService = ipfsService

  /**
   * Fetches a user profile by ID
   * @param userId - User identifier
   * @returns User profile data
   * @throws Error if user not found
   */
  async findById(userId: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
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

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      return user as User
    } catch (error) {
      logger.error('Failed to find user by ID', { error: (error as Error).message, userId })
      throw error
    }
  }

  /**
   * Updates user data (e.g., name)
   * @param userId - User identifier
   * @param dto - Update data transfer object
   * @returns Updated user profile
   * @throws Error if user not found or update fails
   */
  async updateUser(userId: string, dto: UpdateUser): Promise<User> {
    try {
      // * Verify user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!existingUser) {
        throw new Error(`User with ID ${userId} not found`)
      }

      // * Update user data
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: dto,
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

      logger.info('User profile updated successfully', { userId, updatedFields: Object.keys(dto) })
      return updatedUser as User
    } catch (error) {
      logger.error('Failed to update user', { error: (error as Error).message, userId, dto })
      throw error
    }
  }

  /**
   * Connects a wallet to user account with signature verification
   * @param userId - User identifier
   * @param dto - Wallet connection data with signature
   * @returns Updated user profile with wallet address
   * @throws Error if signature verification fails or wallet conflict exists
   */
  async connectWallet(userId: string, dto: ConnectWalletDto): Promise<User> {
    try {
      // * Verify user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!existingUser) {
        throw new Error(`User with ID ${userId} not found`)
      }

      // * Verify signature using ethers.verifyMessage
      const recoveredAddress = ethers.verifyMessage(dto.message, dto.signature)
      
      if (recoveredAddress.toLowerCase() !== dto.walletAddress.toLowerCase()) {
        throw new Error('Signature verification failed - recovered address does not match provided wallet address')
      }

      // * Check for wallet conflicts (another user already has this wallet)
      const conflictingUser = await this.prisma.user.findUnique({
        where: { walletAddress: dto.walletAddress }
      })

      if (conflictingUser && conflictingUser.id !== userId) {
        throw new Error('Wallet address is already connected to another account')
      }

      // * Update user with wallet address
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { walletAddress: dto.walletAddress },
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

      logger.info('Wallet connected successfully', { userId, walletAddress: dto.walletAddress })
      return updatedUser as User
    } catch (error) {
      logger.error('Failed to connect wallet', { error: (error as Error).message, userId, walletAddress: dto.walletAddress })
      throw error
    }
  }

  /**
   * Initiates DID creation process (the "Accept" part of the workflow)
   * Performs pre-flight checks, updates user status to PENDING, and triggers background process
   * @param userId - User identifier
   * @returns Updated user profile with PENDING status
   * @throws Error if pre-flight checks fail
   */
  async initiateDidCreation(userId: string): Promise<User> {
    try {
      // * Get current user data
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      // * Pre-flight checks
      if (!user.walletAddress) {
        throw new Error('Wallet address is required for DID creation')
      }

      if (user.didCreationStatus !== 'NONE') {
        throw new Error(`DID creation already in progress or completed. Current status: ${user.didCreationStatus}`)
      }

      if (user.did) {
        throw new Error('User already has a DID')
      }

      // * Update user status to PENDING
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { didCreationStatus: 'PENDING' as const },
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

      // * TODO: Trigger background process for DID creation
      // * This would typically involve adding a job to a queue system
      // * For now, we'll log the initiation
      logger.info('DID creation initiated - background process should be triggered', { userId, walletAddress: user.walletAddress })

      return updatedUser as User
    } catch (error) {
      logger.error('Failed to initiate DID creation', { error: (error as Error).message, userId })
      throw error
    }
  }

  /**
   * Processes DID creation in background (the "Background" part)
   * Orchestrates calls to IpfsService and Web3Service to perform actual creation
   * @param userId - User identifier
   * @returns Promise that resolves when DID creation is complete
   * @throws Error if DID creation fails
   */
  async processDidCreation(userId: string): Promise<void> {
    try {
      // * Get user data
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      if (!user.walletAddress) {
        throw new Error('Wallet address is required for DID creation')
      }

      // * Create initial DID document (placeholder for now)
      const initialDidDocument = {
        '@context': 'https://www.w3.org/ns/did/v1',
        id: `did:healthlease:${userId}`,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        verificationMethod: [{
          id: `did:healthlease:${userId}#key-1`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: `did:healthlease:${userId}`,
          publicKeyHex: user.walletAddress
        }]
      }

      // * Upload DID document to IPFS
      const didDocumentBuffer = Buffer.from(JSON.stringify(initialDidDocument, null, 2))
      const encryptionKey = Buffer.from(userId.padEnd(32, '0').slice(0, 32)) // * Simple key derivation
      
      const { ipfsHash } = await this.ipfsService.encryptAndUpload(didDocumentBuffer, encryptionKey)

      // * Create DID on blockchain using Web3Service
      const { did } = await this.web3Service.createDID(user.walletAddress, ipfsHash)

      // * Update user record with DID and confirmed status
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          did: did,
          didCreationStatus: 'CONFIRMED'
        }
      })

      logger.info('DID creation completed successfully', { userId, did, ipfsHash })
    } catch (error) {
      // * Update user status to FAILED
      await this.prisma.user.update({
        where: { id: userId },
        data: { didCreationStatus: 'FAILED' }
      })

      logger.error('DID creation failed', { error: (error as Error).message, userId })
      throw error
    }
  }

  /**
   * Gets DID creation status for polling endpoint
   * @param userId - User identifier
   * @returns DID status and DID string if available
   * @throws Error if user not found
   */
  async getDidStatus(userId: string): Promise<DidStatusResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          did: true,
          didCreationStatus: true
        }
      })

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      return {
        status: user.didCreationStatus,
        did: user.did
      }
    } catch (error) {
      logger.error('Failed to get DID status', { error: (error as Error).message, userId })
      throw error
    }
  }
}

// * Export singleton instance
export const userService = new UserService()
export default userService
