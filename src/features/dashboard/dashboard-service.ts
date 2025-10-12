// * Dashboard service for HealthLease application
import { PrismaClient } from '@prisma/client'
import { logger } from '../../core/utils/logger'

// ====================================================================================
// TYPES
// ====================================================================================

export interface DashboardStats {
  documentCount: number
  activeLeases: number
  totalEarned: string
}

// ====================================================================================
// SERVICE CLASS
// ====================================================================================

export class DashboardService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // ====================================================================================
  // DASHBOARD STATISTICS
  // ====================================================================================

  /**
   * * Gets aggregated dashboard statistics for a user
   * Performs an efficient Prisma query using _count and _sum aggregations 
   * to get all required stats in a single database call
   * @param userId - User ID
   * @returns Dashboard statistics
   */
  async getStats(userId: string): Promise<DashboardStats> {
    try {
      // * Single efficient query using Prisma aggregations
      const stats = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          _count: {
            select: {
              documents: true,
              leases: {
                where: {
                  status: 'Active'
                }
              }
            }
          },
          leases: {
            where: {
              status: {
                in: ['Active', 'Completed']
              }
            },
            select: {
              paymentAmount: true
            }
          }
        }
      })

      if (!stats) {
        throw new Error('User not found')
      }

      // * Calculate total earnings from completed and active leases
      const totalEarned = stats.leases.reduce((sum, lease) => {
        return sum + Number(lease.paymentAmount)
      }, 0)

      const result: DashboardStats = {
        documentCount: stats._count.documents,
        activeLeases: stats._count.leases,
        totalEarned: totalEarned.toFixed(2)
      }

      logger.info('Dashboard stats retrieved successfully', {
        userId,
        stats: result
      })

      return result

    } catch (error) {
      logger.error('Failed to retrieve dashboard stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId
      })

      throw error
    }
  }

  // ====================================================================================
  // HEALTH CHECK
  // ====================================================================================

  /**
   * * Checks if the dashboard service is healthy
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

// * DashboardStats interface is already exported above