// * DID Creation Service - Extension for UserService
import { PrismaClient, DidCreationStatus } from '@prisma/client'
import type { User } from '../types/auth-types'

export class UserDidService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * Initiate DID creation for a user
   * @param userId - User ID
   * @returns Updated user with PENDING status
   */
  async initiateDidCreation(userId: string): Promise<User> {
    // Get user
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
      throw new Error('User not found')
    }

    if (!user.walletAddress) {
      throw new Error('Wallet address is required before creating DID')
    }

    if (user.did && user.didCreationStatus === 'CONFIRMED') {
      throw new Error('User already has a DID')
    }

    if (user.didCreationStatus === 'PENDING') {
      throw new Error('DID creation already in progress')
    }

    // Update status to PENDING
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

    // Trigger DID creation in background
    this.createDidOnBlockchain(userId, user.walletAddress).catch(error => {
      console.error('DID creation failed:', error)
      // Update status to FAILED
      this.prisma.user.update({
        where: { id: userId },
        data: { didCreationStatus: 'FAILED' }
      }).catch(console.error)
    })

    return updatedUser
  }

  /**
   * Create DID on blockchain
   */
  private async createDidOnBlockchain(userId: string, walletAddress: string): Promise<void> {
    try {
      // Generate DID based on wallet address
      const did = `did:blockdag:${walletAddress.toLowerCase()}`

      // Update user with DID
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          did,
          didCreationStatus: 'CONFIRMED'
        }
      })

      console.log(`DID created for user ${userId}: ${did}`)
    } catch (error) {
      console.error('DID creation error:', error)
      throw error
    }
  }

  /**
   * Get DID creation status for a user
   * @param userId - User ID
   * @returns DID status information
   */
  async getDidCreationStatus(userId: string): Promise<{
    status: DidCreationStatus
    did: string | null
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        did: true,
        didCreationStatus: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      status: user.didCreationStatus,
      did: user.did
    }
  }

  /**
   * Retry failed DID creation
   * @param userId - User ID
   * @returns Updated user
   */
  async retryDidCreation(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        walletAddress: true,
        didCreationStatus: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.didCreationStatus !== 'FAILED') {
      throw new Error('Can only retry failed DID creation')
    }

    if (!user.walletAddress) {
      throw new Error('Wallet address is required')
    }

    // Update status to PENDING and retry
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

    // Trigger DID creation in background
    this.createDidOnBlockchain(userId, user.walletAddress).catch(error => {
      console.error('DID creation retry failed:', error)
      this.prisma.user.update({
        where: { id: userId },
        data: { didCreationStatus: 'FAILED' }
      }).catch(console.error)
    })

    return updatedUser
  }
}
