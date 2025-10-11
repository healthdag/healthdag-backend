// * BlockDAG Web3 service for HealthLease application
import { ethers } from 'ethers'

// * Singleton BlockDAG Web3 service
class Web3Service {
  private static instance: Web3Service
  private provider: ethers.JsonRpcProvider
  private wallet: ethers.Wallet | null = null
  private contracts: Map<string, ethers.Contract> = new Map()

  private constructor() {
    const rpcUrl = process.env.RPC_URL
    const privateKey = process.env.PRIVATE_KEY

    if (!rpcUrl) {
      throw new Error('BlockDAG RPC URL not found in environment variables')
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl)

    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey, this.provider)
    }
  }

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service()
    }
    return Web3Service.instance
  }

  /**
   * Initialize wallet with private key
   * @param privateKey - BlockDAG private key
   */
  public initializeWallet(privateKey: string): void {
    this.wallet = new ethers.Wallet(privateKey, this.provider)
  }

  /**
   * Get current wallet address
   * @returns Wallet address or null
   */
  public getWalletAddress(): string | null {
    return this.wallet?.address || null
  }

  /**
   * Get BlockDAG network info
   * @returns Network information
   */
  public async getNetworkInfo(): Promise<any> {
    try {
      const network = await this.provider.getNetwork()
      const blockNumber = await this.provider.getBlockNumber()
      const gasPrice = await this.provider.getFeeData()

      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString(),
        network: process.env.BLOCKDAG_NETWORK || 'mainnet'
      }
    } catch (error) {
      console.error('Failed to get network info:', error)
      throw new Error(`Failed to get BlockDAG network info: ${error}`)
    }
  }

  /**
   * Load smart contract
   * @param contractName - Name of the contract
   * @param contractAddress - Contract address
   * @param abi - Contract ABI
   */
  public loadContract(contractName: string, contractAddress: string, abi: any[]): void {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call initializeWallet() first.')
    }

    const contract = new ethers.Contract(contractAddress, abi, this.wallet)
    this.contracts.set(contractName, contract)
  }

  /**
   * Get contract instance
   * @param contractName - Name of the contract
   * @returns Contract instance
   */
  public getContract(contractName: string): ethers.Contract {
    const contract = this.contracts.get(contractName)
    if (!contract) {
      throw new Error(`Contract ${contractName} not loaded`)
    }
    return contract
  }

  /**
   * Create DID on BlockDAG
   * @param walletAddress - User's wallet address
   * @param ipfsHash - IPFS hash of the profile
   * @returns Transaction receipt
   */
  public async createDID(walletAddress: string, ipfsHash: string): Promise<any> {
    try {
      const didRegistry = this.getContract('DID_REGISTRY')
      const tx = await didRegistry.createDID(walletAddress, ipfsHash)
      const receipt = await tx.wait()
      
      // Extract DID from event logs
      const didEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = didRegistry.interface.parseLog(log)
          return parsed?.name === 'DIDCreated'
        } catch {
          return false
        }
      })

      if (didEvent) {
        const parsed = didRegistry.interface.parseLog(didEvent)
        return {
          success: true,
          transactionHash: receipt.hash,
          did: parsed?.args.did,
          blockNumber: receipt.blockNumber
        }
      }

      throw new Error('DID creation event not found in transaction logs')
    } catch (error) {
      console.error('DID creation failed:', error)
      throw new Error(`Failed to create DID: ${error}`)
    }
  }

  /**
   * Add document to BlockDAG
   * @param walletAddress - User's wallet address
   * @param ipfsHash - IPFS hash of the document
   * @param category - Document category
   * @returns Transaction receipt
   */
  public async addDocument(walletAddress: string, ipfsHash: string, category: string): Promise<any> {
    try {
      const dataLease = this.getContract('DATA_LEASE')
      const tx = await dataLease.addDocument(walletAddress, ipfsHash, category)
      const receipt = await tx.wait()

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Document addition failed:', error)
      throw new Error(`Failed to add document: ${error}`)
    }
  }

  /**
   * Apply to study on BlockDAG
   * @param walletAddress - User's wallet address
   * @param studyId - Study ID
   * @returns Transaction receipt
   */
  public async applyToStudy(walletAddress: string, studyId: string): Promise<any> {
    try {
      const dataLease = this.getContract('DATA_LEASE')
      const paymentProcessor = this.getContract('PAYMENT_PROCESSOR')
      
      // Create lease
      const leaseTx = await dataLease.createLease(walletAddress, studyId)
      const leaseReceipt = await leaseTx.wait()

      // Process payment
      const paymentTx = await paymentProcessor.processPayment(walletAddress, studyId)
      const paymentReceipt = await paymentTx.wait()

      return {
        success: true,
        leaseTransactionHash: leaseReceipt.hash,
        paymentTransactionHash: paymentReceipt.hash,
        blockNumber: leaseReceipt.blockNumber
      }
    } catch (error) {
      console.error('Study application failed:', error)
      throw new Error(`Failed to apply to study: ${error}`)
    }
  }

  /**
   * Grant emergency access on BlockDAG
   * @param walletAddress - User's wallet address
   * @param responderInfo - Responder information
   * @param duration - Access duration in hours
   * @returns Transaction receipt
   */
  public async grantEmergencyAccess(walletAddress: string, responderInfo: any, duration: number): Promise<any> {
    try {
      const emergencyAccess = this.getContract('EMERGENCY_ACCESS')
      const tx = await emergencyAccess.grantAccess(walletAddress, responderInfo, duration)
      const receipt = await tx.wait()

      return {
        success: true,
        transactionHash: receipt.hash,
        grantId: receipt.logs[0]?.args?.grantId,
        blockNumber: receipt.blockNumber
      }
    } catch (error) {
      console.error('Emergency access grant failed:', error)
      throw new Error(`Failed to grant emergency access: ${error}`)
    }
  }

  /**
   * Health check for BlockDAG service
   * @returns True if service is healthy
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.provider.getBlockNumber()
      return true
    } catch (error) {
      console.error('BlockDAG health check failed:', error)
      return false
    }
  }
}

// * Export singleton instance
export const web3Service = Web3Service.getInstance()
export default web3Service
