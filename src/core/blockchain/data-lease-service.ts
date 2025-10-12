// * DataLease Contract Service
import { ethers } from 'ethers'

export interface LeaseStruct {
  leaseId: bigint
  userDID: string
  studyId: bigint
  researcher: string
  startTime: bigint
  endTime: bigint
  paymentAmount: bigint
  status: number
  dataCategories: string[]
  documentIds: bigint[]
  accessToken: string
  termsHash: string
  paymentReleased: boolean
  tokenGenerated: boolean
  createdAt: bigint
}

export class DataLeaseService {
  private contract: ethers.Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  // ====================================================================================
  // READ METHODS
  // ====================================================================================

  /**
   * Get lease by ID
   * @param leaseId - Lease ID
   * @returns Lease struct
   */
  async getLease(leaseId: bigint): Promise<LeaseStruct> {
    try {
      const lease = await this.contract.getLease(leaseId)
      return {
        leaseId: lease.leaseId,
        userDID: lease.userDID,
        studyId: lease.studyId,
        researcher: lease.researcher,
        startTime: lease.startTime,
        endTime: lease.endTime,
        paymentAmount: lease.paymentAmount,
        status: lease.status,
        dataCategories: lease.dataCategories,
        documentIds: lease.documentIds,
        accessToken: lease.accessToken,
        termsHash: lease.termsHash,
        paymentReleased: lease.paymentReleased,
        tokenGenerated: lease.tokenGenerated,
        createdAt: lease.createdAt
      }
    } catch (error) {
      throw new Error(`Failed to get lease: ${error}`)
    }
  }

  /**
   * Get user leases
   * @param userDID - User's DID
   * @returns Array of lease IDs
   */
  async getUserLeases(userDID: string): Promise<bigint[]> {
    try {
      return await this.contract.getUserLeases(userDID)
    } catch (error) {
      throw new Error(`Failed to get user leases: ${error}`)
    }
  }

  /**
   * Get study leases
   * @param studyId - Study ID
   * @returns Array of lease IDs
   */
  async getStudyLeases(studyId: bigint): Promise<bigint[]> {
    try {
      return await this.contract.getStudyLeases(studyId)
    } catch (error) {
      throw new Error(`Failed to get study leases: ${error}`)
    }
  }

  /**
   * Get active lease count for user
   * @param userDID - User's DID
   * @returns Number of active leases
   */
  async getActiveLeaseCount(userDID: string): Promise<number> {
    try {
      const count = await this.contract.getActiveLeaseCount(userDID)
      return Number(count)
    } catch (error) {
      throw new Error(`Failed to get active lease count: ${error}`)
    }
  }

  /**
   * Check if lease is active
   * @param leaseId - Lease ID
   * @returns True if lease is active
   */
  async isLeaseActive(leaseId: bigint): Promise<boolean> {
    try {
      return await this.contract.isLeaseActive(leaseId)
    } catch (error) {
      throw new Error(`Failed to check if lease is active: ${error}`)
    }
  }

  /**
   * Get access token for a lease
   * @param leaseId - Lease ID
   * @returns Access token
   */
  async getAccessToken(leaseId: bigint): Promise<string> {
    try {
      return await this.contract.getAccessToken(leaseId)
    } catch (error) {
      throw new Error(`Failed to get access token: ${error}`)
    }
  }

  /**
   * Get lease documents
   * @param leaseId - Lease ID
   * @returns Array of document IDs
   */
  async getLeaseDocuments(leaseId: bigint): Promise<bigint[]> {
    try {
      return await this.contract.getLeaseDocuments(leaseId)
    } catch (error) {
      throw new Error(`Failed to get lease documents: ${error}`)
    }
  }

  // ====================================================================================
  // WRITE METHODS
  // ====================================================================================

  /**
   * Create a new lease
   * @param userDID - User's DID
   * @param studyId - Study ID
   * @param researcher - Researcher address
   * @param duration - Lease duration in seconds
   * @param paymentAmount - Payment amount
   * @param dataCategories - Array of data categories
   * @param termsHash - Terms hash
   * @returns Lease ID
   */
  async createLease(
    userDID: string,
    studyId: bigint,
    researcher: string,
    duration: bigint,
    paymentAmount: bigint,
    dataCategories: string[],
    termsHash: string
  ): Promise<{ leaseId: bigint; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.createLease(
        userDID,
        studyId,
        researcher,
        duration,
        paymentAmount,
        dataCategories,
        termsHash
      )
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse LeaseCreated event
      const leaseEvent = this._parseEvent(receipt, 'LeaseCreated')
      const leaseId = leaseEvent.args.leaseId

      return { leaseId, receipt }
    } catch (error) {
      throw new Error(`Failed to create lease: ${error}`)
    }
  }

  /**
   * Activate a lease
   * @param leaseId - Lease ID
   * @param documentIds - Array of document IDs
   * @returns Transaction receipt
   */
  async activateLease(
    leaseId: bigint,
    documentIds: bigint[]
  ): Promise<{ accessToken: string; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.activateLease(leaseId, documentIds)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse LeaseActivated event
      const activateEvent = this._parseEvent(receipt, 'LeaseActivated')
      const accessToken = activateEvent.args.accessToken

      return { accessToken, receipt }
    } catch (error) {
      throw new Error(`Failed to activate lease: ${error}`)
    }
  }

  /**
   * Revoke a lease
   * @param leaseId - Lease ID
   * @param reason - Reason for revocation
   * @returns Transaction receipt
   */
  async revokeLease(leaseId: bigint, reason: string): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.revokeLease(leaseId, reason)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to revoke lease: ${error}`)
    }
  }

  /**
   * Release payment for a lease
   * @param leaseId - Lease ID
   * @returns Transaction receipt
   */
  async releasePayment(leaseId: bigint): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.releasePayment(leaseId)
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

