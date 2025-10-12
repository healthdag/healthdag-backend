// * Deployment configuration loader
import * as fs from 'fs'
import * as path from 'path'

export interface DeploymentConfig {
  network: string
  chainId: number
  timestamp: string
  deployer: string
  contracts: {
    didRegistry: string
    paymentProcessor: string
    dataLease: string
    emergencyAccess: string
    marketplace: string
  }
}

/**
 * Load deployment configuration from JSON file
 * @param network - Network name (e.g., 'awakening')
 * @returns Deployment configuration
 */
export function loadDeploymentConfig(network?: string): DeploymentConfig {
  try {
    const networkName = network || process.env.NETWORK || 'awakening'
    const deploymentsDir = path.join(__dirname, '../../deployments')
    
    // Read all deployment files
    const files = fs.readdirSync(deploymentsDir)
    
    // Find deployment file for the network
    const deploymentFile = files.find(file => 
      file.startsWith(networkName) && file.endsWith('.json')
    )
    
    if (!deploymentFile) {
      throw new Error(`No deployment found for network: ${networkName}`)
    }
    
    const deploymentPath = path.join(deploymentsDir, deploymentFile)
    const deploymentData = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'))
    
    return deploymentData as DeploymentConfig
  } catch (error) {
    throw new Error(`Failed to load deployment config: ${error}`)
  }
}

/**
 * Get contract addresses from environment or deployment file
 * @returns Contract addresses
 */
export function getContractAddresses(): {
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
    return fromEnv as any
  }

  // Otherwise, load from deployment file
  try {
    const deployment = loadDeploymentConfig()
    return deployment.contracts
  } catch (error) {
    throw new Error(
      'Contract addresses not found in environment variables or deployment files. ' +
      'Please set DID_REGISTRY_ADDRESS, DATA_LEASE_ADDRESS, EMERGENCY_ACCESS_ADDRESS, ' +
      'MARKETPLACE_ADDRESS, and PAYMENT_PROCESSOR_ADDRESS in your .env file.'
    )
  }
}

/**
 * Get RPC URL for the network
 * @returns RPC URL
 */
export function getRpcUrl(): string {
  const rpcUrl = process.env.RPC_URL
  
  if (!rpcUrl) {
    throw new Error('RPC_URL environment variable is required')
  }
  
  return rpcUrl
}

/**
 * Get private key for signing transactions
 * @returns Private key
 */
export function getPrivateKey(): string {
  const privateKey = process.env.PRIVATE_KEY
  
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is required')
  }
  
  return privateKey
}

