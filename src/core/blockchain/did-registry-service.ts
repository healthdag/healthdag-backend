// * DIDRegistry Contract Service
import { ethers } from 'ethers'

export class DIDRegistryService {
  private contract: ethers.Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  // ====================================================================================
  // READ METHODS
  // ====================================================================================

  /**
   * Get DID for a user address
   * @param userAddress - User's wallet address
   * @returns DID string
   */
  async getDID(userAddress: string): Promise<string> {
    try {
      return await this.contract.getDID(userAddress)
    } catch (error) {
      throw new Error(`Failed to get DID: ${error}`)
    }
  }

  /**
   * Check if user has a DID
   * @param userAddress - User's wallet address
   * @returns True if DID exists
   */
  async didExists(userAddress: string): Promise<boolean> {
    try {
      return await this.contract.didExists(userAddress)
    } catch (error) {
      throw new Error(`Failed to check DID existence: ${error}`)
    }
  }

  /**
   * Get address by DID
   * @param did - DID string
   * @returns User's wallet address
   */
  async getAddressByDID(did: string): Promise<string> {
    try {
      return await this.contract.getAddressByDID(did)
    } catch (error) {
      throw new Error(`Failed to get address by DID: ${error}`)
    }
  }

  /**
   * Get document count for a user
   * @param userAddress - User's wallet address
   * @returns Number of documents
   */
  async getDocumentCount(userAddress: string): Promise<number> {
    try {
      const count = await this.contract.getDocumentCount(userAddress)
      return Number(count)
    } catch (error) {
      throw new Error(`Failed to get document count: ${error}`)
    }
  }

  /**
   * Get documents metadata for a user
   * @param userAddress - User's wallet address
   * @returns Documents metadata arrays
   */
  async getDocumentsMetadata(userAddress: string): Promise<{
    documentIds: bigint[]
    categories: string[]
    timestamps: bigint[]
    activeStatus: boolean[]
  }> {
    try {
      const result = await this.contract.getDocumentsMetadata(userAddress)
      return {
        documentIds: result.documentIds,
        categories: result.categories,
        timestamps: result.timestamps,
        activeStatus: result.activeStatus
      }
    } catch (error) {
      throw new Error(`Failed to get documents metadata: ${error}`)
    }
  }

  /**
   * Validate document
   * @param userAddress - User's wallet address
   * @param documentId - Document ID
   * @returns Validation result (exists, isActive)
   */
  async validateDocument(userAddress: string, documentId: bigint): Promise<{
    exists: boolean
    isActive: boolean
  }> {
    try {
      const result = await this.contract.validateDocument(userAddress, documentId)
      return {
        exists: result.exists,
        isActive: result.isActive
      }
    } catch (error) {
      throw new Error(`Failed to validate document: ${error}`)
    }
  }

  // ====================================================================================
  // WRITE METHODS
  // ====================================================================================

  /**
   * Create a new DID
   * @param initialDocumentHash - Initial document hash (IPFS hash)
   * @returns Transaction receipt with DID
   */
  async createDID(initialDocumentHash: string): Promise<{ did: string; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.createDID(initialDocumentHash)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse DIDCreated event
      const didEvent = this._parseEvent(receipt, 'DIDCreated')
      const did = didEvent.args.did

      return { did, receipt }
    } catch (error) {
      throw new Error(`Failed to create DID: ${error}`)
    }
  }

  /**
   * Add a document to user's DID
   * @param ipfsHash - IPFS hash of the document
   * @param category - Document category
   * @param encryptionMethod - Encryption method used
   * @returns Document ID
   */
  async addDocument(
    ipfsHash: string, 
    category: string, 
    encryptionMethod: string
  ): Promise<{ documentId: bigint; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.addDocument(ipfsHash, category, encryptionMethod)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse DocumentAdded event
      const docEvent = this._parseEvent(receipt, 'DocumentAdded')
      const documentId = docEvent.args.documentId

      return { documentId, receipt }
    } catch (error) {
      throw new Error(`Failed to add document: ${error}`)
    }
  }

  /**
   * Revoke a document
   * @param documentId - Document ID to revoke
   * @returns Transaction receipt
   */
  async revokeDocument(documentId: bigint): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.revokeDocument(documentId)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to revoke document: ${error}`)
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

