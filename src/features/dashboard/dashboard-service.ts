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
  // ACTIVITY FEED
  // ====================================================================================

  /**
   * * Gets recent activity for a user
   * @param userId - User ID
   * @returns Array of recent activities
   */
  async getRecentActivity(userId: string): Promise<Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>> {
    try {
      const activities: Array<{
        id: string
        type: string
        description: string
        timestamp: Date
      }> = []

      // Get recent documents (include inactive for activity feed)
      const recentDocuments = await this.prisma.document.findMany({
        where: {
          userId
        },
        select: {
          id: true,
          category: true,
          uploadedAt: true,
          creationStatus: true,
          isActive: true
        },
        orderBy: {
          uploadedAt: 'desc'
        },
        take: 10
      })

      // Add document activities
      recentDocuments.forEach(doc => {
        let description = ''
        if (!doc.isActive) {
          description = `${doc.category.replace('_', ' ').toLowerCase()} document deleted`
        } else if (doc.creationStatus === 'CONFIRMED') {
          description = `${doc.category.replace('_', ' ').toLowerCase()} document uploaded successfully`
        } else {
          description = `${doc.category.replace('_', ' ').toLowerCase()} document upload in progress`
        }

        activities.push({
          id: `doc_${doc.id}`,
          type: doc.isActive ? 'document_uploaded' : 'document_deleted',
          description,
          timestamp: doc.uploadedAt
        })
      })

      // Get recent leases
      const recentLeases = await this.prisma.lease.findMany({
        where: {
          userId
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          study: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })

      // Add lease activities
      recentLeases.forEach(lease => {
        let description = ''
        if (lease.status === 'Pending') {
          description = `Applied to ${lease.study.title}`
        } else if (lease.status === 'Active') {
          description = `Data lease confirmed for ${lease.study.title}`
        } else if (lease.status === 'Completed') {
          description = `Data lease completed for ${lease.study.title}`
        } else {
          description = `Lease ${lease.status.toLowerCase()} for ${lease.study.title}`
        }

        activities.push({
          id: `lease_${lease.id}`,
          type: `lease_${lease.status.toLowerCase()}`,
          description,
          timestamp: lease.createdAt
        })
      })

      // Get recent emergency access logs
      const recentAccessLogs = await this.prisma.accessLog.findMany({
        where: {
          userId
        },
        select: {
          id: true,
          responderName: true,
          accessTime: true
        },
        orderBy: {
          accessTime: 'desc'
        },
        take: 5
      })

      // Add access log activities
      recentAccessLogs.forEach(log => {
        activities.push({
          id: `access_${log.id}`,
          type: 'emergency_access',
          description: `Emergency access granted to ${log.responderName}`,
          timestamp: log.accessTime
        })
      })

      // Sort all activities by timestamp (most recent first)
      const sortedActivities = activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 20) // Return top 20 most recent
        .map(activity => ({
          ...activity,
          timestamp: activity.timestamp.toISOString()
        }))

      logger.info('Dashboard activity retrieved successfully', {
        userId,
        count: sortedActivities.length
      })

      return sortedActivities
    } catch (error) {
      logger.error('Failed to retrieve dashboard activity', {
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