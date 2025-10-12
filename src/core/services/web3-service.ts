// * Web3Service - Sole interface with Ethers.js library and smart contracts
// * No other service should ever import ethers directly
import { ethers } from 'ethers'
import { ContractABIs } from '../../exports/contracts.js'

// * Study struct interface for blockchain data
interface StudyStruct {
  id: bigint;
  title: string;
  description: string;
  researcher: string;
  fee: bigint;
  isActive: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

// * Singleton Web3Service class
class Web3Service {
  private static instance: Web3Service
  public readonly provider: ethers.JsonRpcProvider
  public readonly signer: ethers.Wallet
  public readonly didRegistry: ethers.Contract
  public readonly dataLease: ethers.Contract
  public readonly emergencyAccess: ethers.Contract
  public readonly marketplace: ethers.Contract
  public readonly paymentProcessor: ethers.Contract

  private constructor() {
    const rpcUrl = process.env.RPC_URL
    const privateKey = process.env.PRIVATE_KEY

    if (!rpcUrl) {
      throw new Error('RPC_URL environment variable is required')
    }

    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required')
    }

    // * Initialize provider and signer
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.signer = new ethers.Wallet(privateKey, this.provider)

    // * Get contract addresses from environment variables
    const didRegistryAddress = process.env.DID_REGISTRY_ADDRESS
    const dataLeaseAddress = process.env.DATA_LEASE_ADDRESS
    const emergencyAccessAddress = process.env.EMERGENCY_ACCESS_ADDRESS
    const marketplaceAddress = process.env.MARKETPLACE_ADDRESS
    const paymentProcessorAddress = process.env.PAYMENT_PROCESSOR_ADDRESS

    if (!didRegistryAddress || !dataLeaseAddress || !emergencyAccessAddress || 
        !marketplaceAddress || !paymentProcessorAddress) {
      throw new Error('One or more contract addresses not found in environment variables')
    }

    // * Initialize contract instances
    this.didRegistry = new ethers.Contract(
      didRegistryAddress,
      ContractABIs.DIDRegistry,
      this.signer
    )

    this.dataLease = new ethers.Contract(
      dataLeaseAddress,
      ContractABIs.DataLease,
      this.signer
    )

    this.emergencyAccess = new ethers.Contract(
      emergencyAccessAddress,
      ContractABIs.EmergencyAccess,
      this.signer
    )

    this.marketplace = new ethers.Contract(
      marketplaceAddress,
      ContractABIs.Marketplace,
      this.signer
    )

    this.paymentProcessor = new ethers.Contract(
      paymentProcessorAddress,
      ContractABIs.PaymentProcessor,
      this.signer
    )
  }

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service()
    }
    return Web3Service.instance
  }

  // ====================================================================================
  // PUBLIC METHODS (READ-ONLY)
  // ====================================================================================

  /**
   * Get study details by on-chain ID
   * @param onChainId - Study ID on blockchain
   * @returns Study struct data
   */
  async getStudyDetails(onChainId: bigint): Promise<StudyStruct> {
    try {
      const study = await this.marketplace.getStudy(onChainId)
      return {
        id: study.id,
        title: study.title,
        description: study.description,
        researcher: study.researcher,
        fee: study.fee,
        isActive: study.isActive,
        createdAt: study.createdAt,
        updatedAt: study.updatedAt
      }
    } catch (error) {
      throw new Error(`Failed to get study details: ${error}`)
    }
  }

  /**
   * Get all active studies
   * @returns Array of active study structs
   */
  async getActiveStudies(): Promise<StudyStruct[]> {
    try {
      const studies = await this.marketplace.getActiveStudies()
      return studies.map((study: any) => ({
        id: study.id,
        title: study.title,
        description: study.description,
        researcher: study.researcher,
        fee: study.fee,
        isActive: study.isActive,
        createdAt: study.createdAt,
        updatedAt: study.updatedAt
      }))
    } catch (error) {
      throw new Error(`Failed to get active studies: ${error}`)
    }
  }

  /**
   * Check if access grant is valid
   * @param grantId - Access grant ID
   * @returns True if grant is valid and active
   */
  async checkAccessGrant(grantId: bigint): Promise<boolean> {
    try {
      const grant = await this.emergencyAccess.getAccessGrant(grantId)
      return grant.isActive && grant.expiresAt > BigInt(Math.floor(Date.now() / 1000))
    } catch (error) {
      throw new Error(`Failed to check access grant: ${error}`)
    }
  }

  // ====================================================================================
  // PUBLIC METHODS (WRITE/TRANSACTIONAL)
  // ====================================================================================

  /**
   * Create a new DID for a user
   * @param ownerAddress - User's wallet address
   * @param initialDocHash - Initial document hash (IPFS hash)
   * @returns Created DID string
   */
  async createDID(ownerAddress: string, initialDocHash: string): Promise<{ did: string }> {
    try {
      const tx = await this.didRegistry.createDID(ownerAddress, initialDocHash)
      const receipt = await this._waitForTransaction(tx)
      
      const didEvent = this._parseEvent(receipt, 'DIDCreated')
      const did = didEvent.args.did

      return { did }
    } catch (error) {
      throw new Error(`Failed to create DID: ${error}`)
    }
  }

  /**
   * Add a document to a DID
   * @param didOwnerAddress - DID owner's wallet address
   * @param ipfsHash - IPFS hash of the document
   * @param category - Document category
   * @returns New document ID on-chain
   */
  async addDocument(didOwnerAddress: string, ipfsHash: string, category: string): Promise<{ onChainId: bigint }> {
    try {
      const tx = await this.dataLease.addDocument(didOwnerAddress, ipfsHash, category)
      const receipt = await this._waitForTransaction(tx)
      
      const documentEvent = this._parseEvent(receipt, 'DocumentAdded')
      const onChainId = documentEvent.args.documentId

      return { onChainId }
    } catch (error) {
      throw new Error(`Failed to add document: ${error}`)
    }
  }

  /**
   * Revoke a document from a DID
   * @param didOwnerAddress - DID owner's wallet address
   * @param onChainId - Document ID on-chain
   * @returns Success status
   */
  async revokeDocument(didOwnerAddress: string, onChainId: bigint): Promise<{ success: boolean }> {
    try {
      const tx = await this.dataLease.revokeDocument(didOwnerAddress, onChainId)
      await this._waitForTransaction(tx)
      
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to revoke document: ${error}`)
    }
  }

  /**
   * Apply to participate in a study
   * @param didOwnerAddress - DID owner's wallet address
   * @param did - User's DID
   * @param studyOnChainId - Study ID on-chain
   * @returns New lease ID on-chain
   */
  async applyToStudy(didOwnerAddress: string, did: string, studyOnChainId: bigint): Promise<{ leaseOnChainId: bigint }> {
    try {
      const tx = await this.dataLease.applyToStudy(didOwnerAddress, did, studyOnChainId)
      const receipt = await this._waitForTransaction(tx)
      
      const participantEvent = this._parseEvent(receipt, 'ParticipantApplied')
      const leaseOnChainId = participantEvent.args.leaseId

      return { leaseOnChainId }
    } catch (error) {
      throw new Error(`Failed to apply to study: ${error}`)
    }
  }

  /**
   * Grant emergency access to patient data
   * @param patientDID - Patient's DID
   * @param responderInfo - Emergency responder information
   * @returns Grant ID and expiration timestamp
   */
  async grantEmergencyAccess(patientDID: string, responderInfo: any): Promise<{ onChainGrantId: bigint, expiresAt: Date }> {
    try {
      const tx = await this.emergencyAccess.grantEmergencyAccess(patientDID, responderInfo)
      const receipt = await this._waitForTransaction(tx)
      
      const accessEvent = this._parseEvent(receipt, 'AccessGranted')
      const onChainGrantId = accessEvent.args.grantId
      const expiresAt = new Date(Number(accessEvent.args.expiresAt) * 1000)

      return { onChainGrantId, expiresAt }
    } catch (error) {
      throw new Error(`Failed to grant emergency access: ${error}`)
    }
  }

  // ====================================================================================
  // PRIVATE METHODS
  // ====================================================================================

  /**
   * Wait for transaction confirmation and return receipt
   * @param tx - Transaction response
   * @returns Transaction receipt
   */
  private async _waitForTransaction(tx: ethers.TransactionResponse): Promise<ethers.TransactionReceipt> {
    try {
      const receipt = await tx.wait()
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }
      return receipt
    } catch (error) {
      throw new Error(`Transaction failed: ${error}`)
    }
  }

  /**
   * Parse event from transaction receipt logs
   * @param receipt - Transaction receipt
   * @param eventName - Name of the event to parse
   * @returns Parsed event log
   */
  private _parseEvent(receipt: ethers.TransactionReceipt, eventName: string): ethers.LogDescription {
    try {
      // * Try to find the event in any of the contract interfaces
      const contracts = [this.didRegistry, this.dataLease, this.emergencyAccess, this.marketplace, this.paymentProcessor]
      
      for (const contract of contracts) {
        try {
          const event = receipt.logs.find(log => {
            try {
              const parsed = contract.interface.parseLog(log)
              return parsed?.name === eventName
            } catch {
              return false
            }
          })

          if (event) {
            const parsed = contract.interface.parseLog(event)
            if (parsed) {
              return parsed
            }
          }
        } catch {
          // * Continue to next contract
          continue
        }
      }

      throw new Error(`Event ${eventName} not found in transaction logs`)
    } catch (error) {
      throw new Error(`Failed to parse event ${eventName}: ${error}`)
    }
  }

  /**
   * Health check for Web3 service
   * @returns True if service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.provider.getBlockNumber()
      return true
    } catch (error) {
      console.error('Web3Service health check failed:', error)
      return false
    }
  }
}

// * Export singleton instance
export const web3Service = Web3Service.getInstance()
export default web3Service
