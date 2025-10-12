// * Marketplace Contract Service
import { ethers } from 'ethers'

export interface StudyStruct {
  studyId: bigint
  researcher: string
  title: string
  metadataHash: string
  irbApprovalHash: string
  participantsNeeded: bigint
  participantsEnrolled: bigint
  paymentPerUser: bigint
  totalEscrow: bigint
  startTime: bigint
  endTime: bigint
  status: number
  requiredDataCategories: string[]
  createdAt: bigint
}

export class MarketplaceService {
  private contract: ethers.Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  // ====================================================================================
  // READ METHODS
  // ====================================================================================

  /**
   * Get study by ID
   * @param studyId - Study ID
   * @returns Study struct
   */
  async getStudy(studyId: bigint): Promise<StudyStruct> {
    try {
      const study = await this.contract.getStudy(studyId)
      return {
        studyId: study.studyId,
        researcher: study.researcher,
        title: study.title,
        metadataHash: study.metadataHash,
        irbApprovalHash: study.irbApprovalHash,
        participantsNeeded: study.participantsNeeded,
        participantsEnrolled: study.participantsEnrolled,
        paymentPerUser: study.paymentPerUser,
        totalEscrow: study.totalEscrow,
        startTime: study.startTime,
        endTime: study.endTime,
        status: study.status,
        requiredDataCategories: study.requiredDataCategories,
        createdAt: study.createdAt
      }
    } catch (error) {
      throw new Error(`Failed to get study: ${error}`)
    }
  }

  /**
   * Get all active studies
   * @returns Array of active study IDs
   */
  async getActiveStudies(): Promise<bigint[]> {
    try {
      return await this.contract.getActiveStudies()
    } catch (error) {
      throw new Error(`Failed to get active studies: ${error}`)
    }
  }

  /**
   * Get studies for a user
   * @param userDID - User's DID
   * @returns Array of study IDs
   */
  async getUserStudies(userDID: string): Promise<bigint[]> {
    try {
      return await this.contract.getUserStudies(userDID)
    } catch (error) {
      throw new Error(`Failed to get user studies: ${error}`)
    }
  }

  /**
   * Get study participants
   * @param studyId - Study ID
   * @returns Array of participant DIDs
   */
  async getStudyParticipants(studyId: bigint): Promise<string[]> {
    try {
      return await this.contract.getStudyParticipants(studyId)
    } catch (error) {
      throw new Error(`Failed to get study participants: ${error}`)
    }
  }

  /**
   * Get required documents for a study
   * @param studyId - Study ID
   * @param userDID - User's DID
   * @returns Required documents info
   */
  async getRequiredDocuments(
    studyId: bigint, 
    userDID: string
  ): Promise<{
    categories: string[]
    availableDocIds: bigint[][]
    timestamps: bigint[][]
  }> {
    try {
      const result = await this.contract.getRequiredDocuments(studyId, userDID)
      return {
        categories: result.categories,
        availableDocIds: result.availableDocIds,
        timestamps: result.timestamps
      }
    } catch (error) {
      throw new Error(`Failed to get required documents: ${error}`)
    }
  }

  /**
   * Get platform fee percentage
   * @returns Platform fee percentage
   */
  async getPlatformFeePercentage(): Promise<number> {
    try {
      const fee = await this.contract.platformFeePercentage()
      return Number(fee)
    } catch (error) {
      throw new Error(`Failed to get platform fee percentage: ${error}`)
    }
  }

  /**
   * Get total studies count
   * @returns Total number of studies
   */
  async getTotalStudies(): Promise<number> {
    try {
      const count = await this.contract.totalStudies()
      return Number(count)
    } catch (error) {
      throw new Error(`Failed to get total studies: ${error}`)
    }
  }

  // ====================================================================================
  // WRITE METHODS
  // ====================================================================================

  /**
   * Create a new study
   * @param title - Study title
   * @param metadataHash - Metadata hash (IPFS)
   * @param irbApprovalHash - IRB approval hash (IPFS)
   * @param participantsNeeded - Number of participants needed
   * @param paymentPerUser - Payment per user in wei
   * @param duration - Study duration in seconds
   * @param requiredDataCategories - Array of required data categories
   * @param value - Payment value for escrow
   * @returns Study ID
   */
  async createStudy(
    title: string,
    metadataHash: string,
    irbApprovalHash: string,
    participantsNeeded: bigint,
    paymentPerUser: bigint,
    duration: bigint,
    requiredDataCategories: string[],
    value: bigint
  ): Promise<{ studyId: bigint; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.createStudy(
        title,
        metadataHash,
        irbApprovalHash,
        participantsNeeded,
        paymentPerUser,
        duration,
        requiredDataCategories,
        { value }
      )
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse StudyCreated event
      const studyEvent = this._parseEvent(receipt, 'StudyCreated')
      const studyId = studyEvent.args.studyId

      return { studyId, receipt }
    } catch (error) {
      throw new Error(`Failed to create study: ${error}`)
    }
  }

  /**
   * Apply to a study
   * @param studyId - Study ID
   * @param userDID - User's DID
   * @param documentIds - Array of document IDs to share
   * @returns Transaction receipt
   */
  async applyToStudy(
    studyId: bigint,
    userDID: string,
    documentIds: bigint[]
  ): Promise<{ leaseId: bigint; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.applyToStudy(studyId, userDID, documentIds)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse ParticipantApplied event
      const applyEvent = this._parseEvent(receipt, 'ParticipantApplied')
      const leaseId = applyEvent.args.leaseId

      return { leaseId, receipt }
    } catch (error) {
      throw new Error(`Failed to apply to study: ${error}`)
    }
  }

  /**
   * Close a study
   * @param studyId - Study ID
   * @returns Transaction receipt
   */
  async closeStudy(studyId: bigint): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.closeStudy(studyId)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to close study: ${error}`)
    }
  }

  /**
   * Pause a study
   * @param studyId - Study ID
   * @returns Transaction receipt
   */
  async pauseStudy(studyId: bigint): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.pauseStudy(studyId)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to pause study: ${error}`)
    }
  }

  /**
   * Resume a study
   * @param studyId - Study ID
   * @returns Transaction receipt
   */
  async resumeStudy(studyId: bigint): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.resumeStudy(studyId)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to resume study: ${error}`)
    }
  }

  /**
   * Release payment after access
   * @param leaseId - Lease ID
   * @returns Transaction receipt
   */
  async releasePaymentAfterAccess(leaseId: bigint): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.releasePaymentAfterAccess(leaseId)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to release payment: ${error}`)
    }
  }

  // ====================================================================================
  // PRIVATE METHODS
  // ====================================================================================

  /**
   * Parse event from transaction receipt
   * @param receipt - Transaction receipt
   * @param eventName - Name of the event to parse
   * @returns Parsed event log
   */
  private _parseEvent(receipt: ethers.TransactionReceipt, eventName: string): ethers.LogDescription {
    try {
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log)
          return parsed?.name === eventName
        } catch {
          return false
        }
      })

      if (!event) {
        throw new Error(`Event ${eventName} not found in transaction logs`)
      }

      const parsed = this.contract.interface.parseLog(event)
      if (!parsed) {
        throw new Error(`Failed to parse event ${eventName}`)
      }

      return parsed
    } catch (error) {
      throw new Error(`Failed to parse event ${eventName}: ${error}`)
    }
  }
}

