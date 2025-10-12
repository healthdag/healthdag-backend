// * PaymentProcessor Contract Service
import { ethers } from 'ethers'

export class PaymentProcessorService {
  private contract: ethers.Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  // ====================================================================================
  // READ METHODS
  // ====================================================================================

  /**
   * Get escrow balance for a study
   * @param studyId - Study ID
   * @returns Escrow balance in wei
   */
  async getEscrow(studyId: bigint): Promise<bigint> {
    try {
      return await this.contract.getEscrow(studyId)
    } catch (error) {
      throw new Error(`Failed to get escrow: ${error}`)
    }
  }

  /**
   * Get depositor for a study
   * @param studyId - Study ID
   * @returns Depositor address
   */
  async getDepositor(studyId: bigint): Promise<string> {
    try {
      return await this.contract.getDepositor(studyId)
    } catch (error) {
      throw new Error(`Failed to get depositor: ${error}`)
    }
  }

  /**
   * Get platform wallet address
   * @returns Platform wallet address
   */
  async getPlatformWallet(): Promise<string> {
    try {
      return await this.contract.platformWallet()
    } catch (error) {
      throw new Error(`Failed to get platform wallet: ${error}`)
    }
  }

  /**
   * Get total platform fees collected
   * @returns Total fees in wei
   */
  async getTotalPlatformFees(): Promise<bigint> {
    try {
      return await this.contract.totalPlatformFees()
    } catch (error) {
      throw new Error(`Failed to get total platform fees: ${error}`)
    }
  }

  // ====================================================================================
  // WRITE METHODS
  // ====================================================================================

  /**
   * Deposit escrow for a study
   * @param studyId - Study ID
   * @param depositor - Depositor address
   * @param value - Amount to deposit in wei
   * @returns Transaction receipt
   */
  async depositEscrow(
    studyId: bigint,
    depositor: string,
    value: bigint
  ): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.depositEscrow(studyId, depositor, { value })
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to deposit escrow: ${error}`)
    }
  }

  /**
   * Release payment from escrow
   * @param studyId - Study ID
   * @param recipient - Recipient address
   * @param amount - Amount to release in wei
   * @returns Transaction receipt
   */
  async releaseFromEscrow(
    studyId: bigint,
    recipient: string,
    amount: bigint
  ): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.releaseFromEscrow(studyId, recipient, amount)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to release from escrow: ${error}`)
    }
  }

  /**
   * Refund escrow to depositor
   * @param studyId - Study ID
   * @param recipient - Recipient address
   * @param amount - Amount to refund in wei
   * @returns Transaction receipt
   */
  async refund(
    studyId: bigint,
    recipient: string,
    amount: bigint
  ): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.refund(studyId, recipient, amount)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to refund: ${error}`)
    }
  }

  /**
   * Withdraw platform fees (admin only)
   * @returns Transaction receipt
   */
  async withdrawPlatformFees(): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.withdrawPlatformFees()
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to withdraw platform fees: ${error}`)
    }
  }

  /**
   * Update platform wallet address (admin only)
   * @param newWallet - New platform wallet address
   * @returns Transaction receipt
   */
  async updatePlatformWallet(newWallet: string): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.updatePlatformWallet(newWallet)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to update platform wallet: ${error}`)
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

