// * Web3Service - Sole interface with Ethers.js library and smart contracts
// * No other service should ever import ethers directly
import { ethers } from 'ethers'
import { ContractABIs } from '../../exports/contracts'
import { 
  DIDRegistryService, 
  DataLeaseService, 
  EmergencyAccessService, 
  MarketplaceService, 
  PaymentProcessorService 
} from '../blockchain'
import { logger } from '../utils/logger'
import { logError, logInfo, logSuccess, logWarning } from '../utils/error-logger'

// * Singleton Web3Service class
class Web3Service {
  private static instance: Web3Service
  public readonly provider: ethers.JsonRpcProvider
  public readonly signer: ethers.Wallet
  
  // * Blockchain service instances
  public readonly didRegistry: DIDRegistryService
  public readonly dataLease: DataLeaseService
  public readonly emergencyAccess: EmergencyAccessService
  public readonly marketplace: MarketplaceService
  public readonly paymentProcessor: PaymentProcessorService

  private constructor() {
    logInfo('WEB3', 'Initializing Web3Service')
    
    // * Get RPC URL and private key from environment
    const rpcUrl = process.env.RPC_URL
    const privateKey = process.env.PRIVATE_KEY

    if (!rpcUrl) {
      logError('WEB3', new Error('RPC_URL environment variable is required'), { operation: 'constructor' })
      throw new Error('RPC_URL environment variable is required')
    }

    if (!privateKey) {
      logError('WEB3', new Error('PRIVATE_KEY environment variable is required'), { operation: 'constructor' })
      throw new Error('PRIVATE_KEY environment variable is required')
    }

    // * Initialize provider and signer
    try {
      logInfo('WEB3', 'Creating provider and signer')
      this.provider = new ethers.JsonRpcProvider(rpcUrl)
      this.signer = new ethers.Wallet(privateKey, this.provider)
      logSuccess('WEB3', 'Provider and signer created successfully')
    } catch (error) {
      logError('WEB3', error, { operation: 'provider-signer-init' })
      throw error
    }

    // * Get contract addresses (from env vars or deployment file)
    logInfo('WEB3', 'Retrieving contract addresses')
    const addresses = this.getContractAddresses()
    logSuccess('WEB3', 'Contract addresses retrieved', { addresses })

    // * Initialize contract instances
    logInfo('WEB3', 'Initializing contract instances')
    const didRegistryContract = new ethers.Contract(
      addresses.didRegistry,
      ContractABIs.DIDRegistry,
      this.signer
    )

    const dataLeaseContract = new ethers.Contract(
      addresses.dataLease,
      ContractABIs.DataLease,
      this.signer
    )

    const emergencyAccessContract = new ethers.Contract(
      addresses.emergencyAccess,
      ContractABIs.EmergencyAccess,
      this.signer
    )

    const marketplaceContract = new ethers.Contract(
      addresses.marketplace,
      ContractABIs.Marketplace,
      this.signer
    )

    const paymentProcessorContract = new ethers.Contract(
      addresses.paymentProcessor,
      ContractABIs.PaymentProcessor,
      this.signer
    )
    logSuccess('WEB3', 'Contract instances created successfully')

    // * Initialize blockchain services
    logInfo('WEB3', 'Initializing blockchain services')
    this.didRegistry = new DIDRegistryService(didRegistryContract)
    this.dataLease = new DataLeaseService(dataLeaseContract)
    this.emergencyAccess = new EmergencyAccessService(emergencyAccessContract)
    this.marketplace = new MarketplaceService(marketplaceContract)
    this.paymentProcessor = new PaymentProcessorService(paymentProcessorContract)
    logSuccess('WEB3', 'All blockchain services initialized successfully')
  }

  /**
   * Get contract addresses from environment or deployment file
   * @private
   * @returns Contract addresses
   */
  private getContractAddresses(): {
    didRegistry: string
    dataLease: string
    emergencyAccess: string
    marketplace: string
    paymentProcessor: string
  } {
    // Try environment variables first
    const fromEnv = {
      didRegistry: process.env.DID_REGISTRY_ADDRESS,
      dataLease: process.env.DATA_LEASE_ADDRESS,
      emergencyAccess: process.env.EMERGENCY_ACCESS_ADDRESS,
      marketplace: process.env.MARKETPLACE_ADDRESS,
      paymentProcessor: process.env.PAYMENT_PROCESSOR_ADDRESS
    }

    // If all env vars are set, use them
    if (Object.values(fromEnv).every(addr => addr)) {
      logInfo('WEB3', 'Using contract addresses from environment variables')
      return fromEnv as any
    }

    // Otherwise, throw error (deployment config loader requires fs which doesn't work in all environments)
    const error = new Error(
      'Contract addresses not found in environment variables. ' +
      'Please set DID_REGISTRY_ADDRESS, DATA_LEASE_ADDRESS, EMERGENCY_ACCESS_ADDRESS, ' +
      'MARKETPLACE_ADDRESS, and PAYMENT_PROCESSOR_ADDRESS in your .env file.'
    )
    logError('WEB3', error, { operation: 'getContractAddresses' })
    throw error
  }

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      logInfo('WEB3', 'Creating new Web3Service instance')
      Web3Service.instance = new Web3Service()
    }
    return Web3Service.instance
  }

  // ====================================================================================
  // PUBLIC HELPER METHODS
  // ====================================================================================

  /**
   * Get network information
   * @returns Network information
   */
  async getNetworkInfo(): Promise<{
    name: string
    chainId: number
    blockNumber: number
  }> {
    try {
      logInfo('WEB3', 'Getting network information')
      const network = await this.provider.getNetwork()
      const blockNumber = await this.provider.getBlockNumber()
      
      const info = {
        name: network.name,
        chainId: Number(network.chainId),
        blockNumber
      }
      
      logSuccess('WEB3', 'Network info retrieved', info)
      return info
    } catch (error) {
      logError('WEB3', error, { operation: 'getNetworkInfo' })
      throw new Error(`Failed to get network info: ${error}`)
    }
  }

  /**
   * Get signer address
   * @returns Signer's wallet address
   */
  getSignerAddress(): string {
    const address = this.signer.address
    logInfo('WEB3', 'Retrieved signer address', { address })
    return address
  }

  /**
   * Get balance of an address
   * @param address - Wallet address
   * @returns Balance in wei
   */
  async getBalance(address: string): Promise<bigint> {
    try {
      logInfo('WEB3', 'Getting balance for address', { address })
      const balance = await this.provider.getBalance(address)
      logSuccess('WEB3', 'Balance retrieved', { address, balance: balance.toString() })
      return balance
    } catch (error) {
      logError('WEB3', error, { operation: 'getBalance', address })
      throw new Error(`Failed to get balance: ${error}`)
    }
  }

  /**
   * Format ether amount
   * @param wei - Amount in wei
   * @returns Formatted ether string
   */
  formatEther(wei: bigint): string {
    const formatted = ethers.formatEther(wei)
    logInfo('WEB3', 'Formatted ether amount', { wei: wei.toString(), formatted })
    return formatted
  }

  /**
   * Parse ether amount
   * @param ether - Ether string
   * @returns Amount in wei
   */
  parseEther(ether: string): bigint {
    const parsed = ethers.parseEther(ether)
    logInfo('WEB3', 'Parsed ether amount', { ether, parsed: parsed.toString() })
    return parsed
  }

  /**
   * Health check for Web3 service
   * @returns True if service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      logInfo('WEB3', 'Performing health check')
      await this.provider.getBlockNumber()
      logSuccess('WEB3', 'Health check passed')
      return true
    } catch (error) {
      logError('WEB3', error, { operation: 'healthCheck' })
      return false
    }
  }
}

// * Export singleton instance
export const web3Service = Web3Service.getInstance()
export default web3Service

