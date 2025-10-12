// * Marketplace service for HealthLease application
// * Manages study browsing and application workflows
import { PrismaClient } from '@prisma/client'
import type { Study, Lease, LeaseStatus } from '@prisma/client'
import { web3Service } from '../../core/services/web3-service.js'
import { prismaService } from '../../core/services/prisma-service.js'
import { logger } from '../../core/utils/logger.js'

// * MarketplaceService class for managing study marketplace operations
export class MarketplaceService {
  private prisma: PrismaClient
  private web3Service: typeof web3Service

  constructor() {
    this.prisma = prismaService.prisma
    this.web3Service = web3Service
  }

  // ====================================================================================
  // PUBLIC METHODS (READ)
  // ====================================================================================

  /**
   * Fetches all active studies from the Prisma cache
   * @returns Array of active studies
   */
  async findAllStudies(): Promise<Study[]> {
    try {
      logger.info('Fetching all active studies from database')
      
      const studies = await this.prisma.study.findMany({
        where: {
          status: 'Active'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      logger.info(`Found ${studies.length} active studies`)
      return studies
    } catch (error) {
      logger.error('Failed to fetch studies from database', { error: error instanceof Error ? error.message : String(error) })
      throw new Error(`Failed to fetch studies: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Fetches a specific study by ID
   * @param studyId - Study ID
   * @returns Study details
   */
  async findStudyById(studyId: string): Promise<Study> {
    try {
      logger.info('Fetching study by ID', { studyId })

      const study = await this.prisma.study.findUnique({
        where: {
          id: studyId
        },
        include: {
          leases: {
            select: {
              id: true,
              status: true,
              userId: true
            }
          }
        }
      })

      if (!study) {
        throw new Error(`Study with ID ${studyId} not found`)
      }

      logger.info('Study found successfully', { studyId })
      return study
    } catch (error) {
      logger.error('Failed to fetch study by ID', { error: error instanceof Error ? error.message : String(error), studyId })
      throw new Error(`Failed to fetch study: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // ====================================================================================
  // PUBLIC METHODS (WRITE)
  // ====================================================================================

  /**
   * Initiates a study application - the "Accept" part
   * Performs pre-flight checks, creates a PENDING Lease record, and triggers background process
   * @param userId - User ID applying for the study
   * @param studyId - Study ID to apply for
   * @returns Created lease record
   */
  async initiateStudyApplication(userId: string, studyId: string): Promise<Lease> {
    try {
      logger.info('Initiating study application', { userId, studyId })

      // * Pre-flight checks
      await this._performPreFlightChecks(userId, studyId)

      // * Get study details for lease creation
      const study = await this.findStudyById(studyId)
      
      // * Check if study is still active and has capacity
      if (study.status !== 'Active') {
        throw new Error('Study is no longer active')
      }

      if (study.participantsEnrolled >= study.participantsNeeded) {
        throw new Error('Study has reached maximum participants')
      }

      // * Check if user already has an active lease for this study
      const existingLease = await this.prisma.lease.findFirst({
        where: {
          userId,
          studyId,
          status: {
            in: ['Pending', 'Active']
          }
        }
      })

      if (existingLease) {
        throw new Error('User already has an active application for this study')
      }

      // * Create PENDING lease record
      const lease = await this.prisma.lease.create({
        data: {
          userId,
          studyId,
          paymentAmount: study.paymentPerUser,
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // * 30 days from now
          status: 'Pending',
          onChainId: BigInt(0) // * Will be updated when blockchain transaction completes
        }
      })

      logger.info('Lease record created, triggering background process', { leaseId: lease.id, userId, studyId })

      // * Trigger background process (fire and forget)
      this.processStudyApplication(lease.id, userId, studyId).catch(error => {
        logger.error('Background study application processing failed', { error: error instanceof Error ? error.message : String(error), leaseId: lease.id })
      })

      return lease
    } catch (error) {
      logger.error('Failed to initiate study application', { error: error instanceof Error ? error.message : String(error), userId, studyId })
      throw new Error(`Failed to initiate study application: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Processes study application - the "Background" part
   * Calls web3Service.applyToStudy and updates the Lease record
   * @param leaseId - Lease ID to process
   * @param userId - User ID
   * @param studyId - Study ID
   */
  async processStudyApplication(leaseId: string, userId: string, studyId: string): Promise<void> {
    try {
      logger.info('Processing study application in background', { leaseId, userId, studyId })

      // * Get user details
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { walletAddress: true, did: true }
      })

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      if (!user.walletAddress) {
        throw new Error('User wallet address not found')
      }

      if (!user.did) {
        throw new Error('User DID not found')
      }

      // * Get study details
      const study = await this.findStudyById(studyId)

      // * Call web3Service to apply to study on blockchain
      const result = await this.web3Service.marketplace.applyToStudy(
        study.onChainId,
        user.did,
        [] // TODO: Add document IDs when available
      )

      // * Update lease record with on-chain ID and status
      await this.prisma.lease.update({
        where: { id: leaseId },
        data: {
          onChainId: result.leaseOnChainId,
          status: 'Active'
        }
      })

      // * Update study participants count
      await this.prisma.study.update({
        where: { id: studyId },
        data: {
          participantsEnrolled: {
            increment: 1
          }
        }
      })

      logger.info('Study application processed successfully', { leaseId, onChainId: result.leaseOnChainId.toString() })
    } catch (error) {
      logger.error('Failed to process study application', { error: error instanceof Error ? error.message : String(error), leaseId, userId, studyId })

      // * Update lease status to failed
      try {
        await this.prisma.lease.update({
          where: { id: leaseId },
          data: {
            status: 'Revoked'
          }
        })
      } catch (updateError) {
        logger.error('Failed to update lease status to failed', { error: updateError instanceof Error ? updateError.message : String(updateError), leaseId })
      }

      throw new Error(`Failed to process study application: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Gets lease status for polling logic
   * @param userId - User ID
   * @param leaseId - Lease ID
   * @returns Lease status information
   */
  async getLeaseStatus(userId: string, leaseId: string): Promise<{ status: LeaseStatus }> {
    try {
      logger.info('Getting lease status', { userId, leaseId })

      const lease = await this.prisma.lease.findFirst({
        where: {
          id: leaseId,
          userId
        },
        select: {
          status: true
        }
      })

      if (!lease) {
        throw new Error(`Lease with ID ${leaseId} not found for user ${userId}`)
      }

      logger.info('Lease status retrieved', { userId, leaseId, status: lease.status })
      return { status: lease.status }
    } catch (error) {
      logger.error('Failed to get lease status', { error: error instanceof Error ? error.message : String(error), userId, leaseId })
      throw new Error(`Failed to get lease status: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // ====================================================================================
  // PRIVATE METHODS
  // ====================================================================================

  /**
   * Performs pre-flight checks before initiating study application
   * @param userId - User ID
   * @param studyId - Study ID
   */
  private async _performPreFlightChecks(userId: string, studyId: string): Promise<void> {
    try {
      // * Check if user exists and has required fields
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { 
          walletAddress: true, 
          did: true, 
          didCreationStatus: true 
        }
      })

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }

      if (!user.walletAddress) {
        throw new Error('User must have a wallet address to apply for studies')
      }

      if (!user.did) {
        throw new Error('User must have a DID to apply for studies')
      }

      if (user.didCreationStatus !== 'CONFIRMED') {
        throw new Error('User DID must be confirmed before applying for studies')
      }

      // * Check if study exists
      const study = await this.prisma.study.findUnique({
        where: { id: studyId }
      })

      if (!study) {
        throw new Error(`Study with ID ${studyId} not found`)
      }

      logger.info('Pre-flight checks passed', { userId, studyId })
    } catch (error) {
      logger.error('Pre-flight checks failed', { error: error instanceof Error ? error.message : String(error), userId, studyId })
      throw error
    }
  }
}

// * Export singleton instance
export const marketplaceService = new MarketplaceService()
export default marketplaceService
