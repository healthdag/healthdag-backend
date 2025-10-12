// * DIDRegistry Contract Service
import { ethers } from 'ethers'
import { logError, logInfo, logSuccess, logWarning } from '../utils/error-logger'

export class DIDRegistryService {
  private contract: ethers.Contract

  constructor(contract: ethers.Contract) {
    logInfo('DID_REGISTRY', 'Initializing DIDRegistryService')
    this.contract = contract
    logSuccess('DID_REGISTRY', 'DIDRegistryService initialized successfully')
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
    logInfo('DID_REGISTRY', 'Getting DID for user', { userAddress })
    try {
      const did = await this.contract.getDID(userAddress)
      logSuccess('DID_REGISTRY', 'DID retrieved successfully', { userAddress, did })
      return did
    } catch (error) {
      logError('DID_REGISTRY', error, { operation: 'getDID', userAddress })
      throw new Error(`Failed to get DID: ${error}`)
    }
  }

  /**
   * Check if user has a DID
   * @param userAddress - User's wallet address
   * @returns True if DID exists
   */
  async didExists(userAddress: string): Promise<boolean> {
    logInfo('DID_REGISTRY', 'Checking if DID exists', { userAddress })
    try {
      const exists = await this.contract.didExists(userAddress)
      logSuccess('DID_REGISTRY', 'DID existence checked', { userAddress, exists })
      return exists
    } catch (error) {
      logError('DID_REGISTRY', error, { operation: 'didExists', userAddress })
      throw new Error(`Failed to check DID existence: ${error}`)
    }
  }

  /**
   * Get address by DID
   * @param did - DID string
   * @returns User's wallet address
   */
  async getAddressByDID(did: string): Promise<string> {
    logInfo('DID_REGISTRY', 'Getting address by DID', { did })
    try {
      const address = await this.contract.getAddressByDID(did)
      logSuccess('DID_REGISTRY', 'Address retrieved by DID', { did, address })
      return address
    } catch (error) {
      logError('DID_REGISTRY', error, { operation: 'getAddressByDID', did })
      throw new Error(`Failed to get address by DID: ${error}`)
    }
  }

  /**
   * Get document count for a user
   * @param userAddress - User's wallet address
   * @returns Number of documents
   */
  async getDocumentCount(userAddress: string): Promise<number> {
    logInfo('DID_REGISTRY', 'Getting document count', { userAddress })
    try {
      const count = await this.contract.getDocumentCount(userAddress)
      const countNumber = Number(count)
      logSuccess('DID_REGISTRY', 'Document count retrieved', { userAddress, count: countNumber })
      return countNumber
    } catch (error) {
      logError('DID_REGISTRY', error, { operation: 'getDocumentCount', userAddress })
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
    logInfo('DID_REGISTRY', 'Getting documents metadata', { userAddress })
    try {
      const result = await this.contract.getDocumentsMetadata(userAddress)
      const metadata = {
        documentIds: result.documentIds,
        categories: result.categories,
        timestamps: result.timestamps,
        activeStatus: result.activeStatus
      }
      logSuccess('DID_REGISTRY', 'Documents metadata retrieved', { userAddress, documentCount: metadata.documentIds.length })
      return metadata
    } catch (error) {
      logError('DID_REGISTRY', error, { operation: 'getDocumentsMetadata', userAddress })
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
    logInfo('DID_REGISTRY', 'Validating document', { userAddress, documentId: documentId.toString() })
    try {
      const result = await this.contract.validateDocument(userAddress, documentId)
      const validation = {
        exists: result.exists,
        isActive: result.isActive
      }
      logSuccess('DID_REGISTRY', 'Document validation completed', { userAddress, documentId: documentId.toString(), ...validation })
      return validation
    } catch (error) {
      logError('DID_REGISTRY', error, { operation: 'validateDocument', userAddress, documentId: documentId.toString() })
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
    logInfo('DID_REGISTRY', 'Creating new DID', { initialDocumentHash })
    try {
      const tx = await this.contract.createDID(initialDocumentHash)
      logInfo('DID_REGISTRY', 'DID creation transaction sent', { txHash: tx.hash })
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

