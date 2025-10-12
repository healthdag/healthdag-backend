// * Token blacklist service for HealthLease Hub authentication
import { PrismaClient } from '@prisma/client'
import type { JwtPayload } from '../types/auth-types'

// ====================================================================================
// SERVICE CLASS
// ====================================================================================

export class TokenBlacklistService {
  private prisma: PrismaClient
  private blacklistedTokens: Set<string> = new Set()

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.initializeBlacklist()
  }

  // ====================================================================================
  // INITIALIZATION
  // ====================================================================================

  /**
   * * Initializes the in-memory blacklist from database
   */
  private async initializeBlacklist(): Promise<void> {
    try {
      // Load recently blacklisted tokens (last 24 hours)
      const recentBlacklistedTokens = await this.prisma.blacklistedToken.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        select: { token: true }
      })

      // Populate in-memory set
      recentBlacklistedTokens.forEach(({ token }) => {
        this.blacklistedTokens.add(token)
      })

      console.log(`Loaded ${recentBlacklistedTokens.length} blacklisted tokens`)
    } catch (error) {
      console.error('Failed to initialize token blacklist:', error)
    }
  }

  // ====================================================================================
  // TOKEN BLACKLISTING
  // ====================================================================================

  /**
   * * Adds a token to the blacklist
   * @param token - JWT token to blacklist
   * @param userId - User ID (optional, for audit purposes)
   * @param reason - Reason for blacklisting (optional)
   */
  async blacklistToken(token: string, userId?: string, reason?: string): Promise<void> {
    try {
      // Add to in-memory blacklist for immediate effect
      this.blacklistedTokens.add(token)

      // Add to database for persistence
      await this.prisma.blacklistedToken.create({
        data: {
          token,
          userId: userId || null,
          reason: reason || 'User logout',
          expiresAt: this.extractTokenExpiration(token)
        }
      })

      console.log(`Token blacklisted for user: ${userId || 'unknown'}`)
    } catch (error) {
      console.error('Failed to blacklist token:', error)
      // Don't throw error - blacklisting should not break the logout flow
    }
  }

  /**
   * * Checks if a token is blacklisted
   * @param token - JWT token to check
   * @returns True if token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    // Check in-memory blacklist first (fast)
    if (this.blacklistedTokens.has(token)) {
      return true
    }

    // Check database (slower but more reliable)
    try {
      const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
        where: { token }
      })

      if (blacklistedToken) {
        // Add to in-memory cache for future requests
        this.blacklistedTokens.add(token)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to check token blacklist:', error)
      // If database check fails, assume token is not blacklisted
      return false
    }
  }

  /**
   * * Removes expired tokens from blacklist
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const now = new Date()
      
      // Remove from database
      const deletedCount = await this.prisma.blacklistedToken.deleteMany({
        where: {
          expiresAt: {
            lt: now
          }
        }
      })

      // Remove from in-memory blacklist
      const tokensToRemove: string[] = []
      for (const token of Array.from(this.blacklistedTokens)) {
        try {
          const expiration = this.extractTokenExpiration(token)
          if (expiration < now) {
            tokensToRemove.push(token)
          }
        } catch {
          // If we can't parse the token, remove it
          tokensToRemove.push(token)
        }
      }

      tokensToRemove.forEach(token => this.blacklistedTokens.delete(token))

      if (deletedCount.count > 0) {
        console.log(`Cleaned up ${deletedCount.count} expired blacklisted tokens`)
      }
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error)
    }
  }

  // ====================================================================================
  // HELPER METHODS
  // ====================================================================================

  /**
   * * Extracts expiration time from JWT token
   * @param token - JWT token
   * @returns Expiration date
   */
  private extractTokenExpiration(token: string): Date {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as JwtPayload
      return new Date(payload.exp * 1000)
    } catch (error) {
      // If we can't parse the token, assume it expires in 15 minutes
      return new Date(Date.now() + 15 * 60 * 1000)
    }
  }

  /**
   * * Gets blacklist statistics
   * @returns Blacklist statistics
   */
  async getBlacklistStats(): Promise<{
    inMemoryCount: number
    databaseCount: number
    recentCount: number
  }> {
    try {
      const [databaseCount, recentCount] = await Promise.all([
        this.prisma.blacklistedToken.count(),
        this.prisma.blacklistedToken.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        })
      ])

      return {
        inMemoryCount: this.blacklistedTokens.size,
        databaseCount,
        recentCount
      }
    } catch (error) {
      console.error('Failed to get blacklist stats:', error)
      return {
        inMemoryCount: this.blacklistedTokens.size,
        databaseCount: 0,
        recentCount: 0
      }
    }
  }

  // ====================================================================================
  // HEALTH CHECK
  // ====================================================================================

  /**
   * * Checks if the token blacklist service is healthy
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

// Class is already exported above
