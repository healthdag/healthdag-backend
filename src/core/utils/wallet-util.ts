// * Web3 wallet utility functions for HealthLease Hub authentication
import { ethers } from 'ethers'
import type { 
  WalletVerificationResult, 
  WalletMessage, 
  WalletConnectionRequest,
  WalletVerificationStatus
} from '../types/auth-types'
import { 
  WALLET_MESSAGE_PREFIX,
  WALLET_MESSAGE_SUFFIX
} from '../types/auth-types'

// ====================================================================================
// CONFIGURATION
// ====================================================================================

// * Wallet message timeout configuration
const WALLET_MESSAGE_TIMEOUT_MINUTES = parseInt(process.env.WALLET_MESSAGE_TIMEOUT_MINUTES || '15')

// Constants imported from types

// ====================================================================================
// WALLET ADDRESS VALIDATION
// ====================================================================================

/**
 * * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns True if address is valid, false otherwise
 */
export function isValidAddress(address: string): boolean {
  try {
    // * Check if it's a valid address format (including lowercase)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return false
    }
    
    // * Try to normalize it - this will work for valid addresses regardless of case
    ethers.getAddress(address.toLowerCase())
    return true
  } catch {
    return false
  }
}

/**
 * * Normalizes an Ethereum address to checksum format
 * @param address - The address to normalize
 * @returns Normalized checksum address
 */
export function normalizeAddress(address: string): string {
  try {
    // * First validate the address format
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid address format')
    }
    
    // * Convert to checksum format
    return ethers.getAddress(address)
  } catch (error) {
    throw new Error(`Invalid address format: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * * Converts address to lowercase for consistent comparison
 * @param address - The address to convert
 * @returns Lowercase address
 */
export function toLowerCaseAddress(address: string): string {
  return address.toLowerCase()
}

// ====================================================================================
// MESSAGE VERIFICATION
// ====================================================================================

/**
 * * Verifies a signed message and recovers the signer address
 * @param message - The original message that was signed
 * @param signature - The signature to verify
 * @returns Verification result with recovered address
 */
export function verifyMessage(message: string, signature: string): WalletVerificationResult {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return {
      valid: true,
      recoveredAddress: normalizeAddress(recoveredAddress)
    }
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * * Verifies that a signature matches the expected address
 * @param message - The original message that was signed
 * @param signature - The signature to verify
 * @param expectedAddress - The address that should have signed the message
 * @returns True if signature matches expected address
 */
export function verifySignature(
  message: string, 
  signature: string, 
  expectedAddress: string
): WalletVerificationResult {
  try {
    const verification = verifyMessage(message, signature)
    
    if (!verification.valid || !verification.recoveredAddress) {
      return {
        valid: false,
        error: 'Invalid signature'
      }
    }
    
    // Compare addresses in lowercase for consistency
    const normalizedExpected = toLowerCaseAddress(expectedAddress)
    const normalizedRecovered = toLowerCaseAddress(verification.recoveredAddress)
    
    if (normalizedExpected !== normalizedRecovered) {
      return {
        valid: false,
        error: 'Signature does not match the provided address',
        recoveredAddress: verification.recoveredAddress
      }
    }
    
    return {
      valid: true,
      recoveredAddress: verification.recoveredAddress
    }
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// ====================================================================================
// MESSAGE GENERATION
// ====================================================================================

/**
 * * Generates a wallet authentication message
 * @param userId - The user ID to include in the message
 * @param customMessage - Optional custom message (defaults to standard message)
 * @returns Generated message for signing
 */
export function generateWalletMessage(userId: string, customMessage?: string): string {
  const timestamp = Date.now()
  const message = customMessage || `${WALLET_MESSAGE_PREFIX}\n\nUser ID: ${userId}\nTimestamp: ${timestamp}\n\n${WALLET_MESSAGE_SUFFIX}`
  
  return message
}

/**
 * * Parses a wallet message to extract components
 * @param message - The message to parse
 * @returns Parsed message components
 */
export function parseWalletMessage(message: string): WalletMessage | null {
  try {
    // Extract timestamp from message
    const timestampMatch = message.match(/Timestamp:\s*(\d+)/)
    const userIdMatch = message.match(/User ID:\s*([^\n]+)/)
    
    // * Require both timestamp and User ID for production security
    if (!timestampMatch || !userIdMatch) {
      return null
    }
    
    return {
      message,
      timestamp: parseInt(timestampMatch[1]),
      userId: userIdMatch[1].trim()
    }
  } catch {
    return null
  }
}

/**
 * * Validates if a wallet message is recent (within configured timeout)
 * @param message - The message to validate
 * @param maxAgeMinutes - Maximum age in minutes (default: from environment)
 * @returns True if message is recent, false otherwise
 */
export function isMessageRecent(message: string, maxAgeMinutes: number = WALLET_MESSAGE_TIMEOUT_MINUTES): boolean {
  const parsed = parseWalletMessage(message)
  if (!parsed) return false
  
  const now = Date.now()
  const maxAge = maxAgeMinutes * 60 * 1000 // Convert to milliseconds
  
  return (now - parsed.timestamp) <= maxAge
}

// ====================================================================================
// SIGNATURE VALIDATION
// ====================================================================================

/**
 * * Validates if a signature has the correct format
 * @param signature - The signature to validate
 * @returns True if signature format is valid
 */
export function isValidSignatureFormat(signature: string): boolean {
  // Ethereum signatures should be 65 bytes (130 hex characters) + 0x prefix
  return /^0x[a-fA-F0-9]{130}$/.test(signature)
}

/**
 * * Validates if a message is suitable for signing
 * @param message - The message to validate
 * @returns True if message is valid for signing
 */
export function isValidSigningMessage(message: string): boolean {
  if (!message || typeof message !== 'string') return false
  if (message.length < 10) return false // Too short
  if (message.length > 1000) return false // Too long
  
  // * Production security: Require both User ID and Timestamp
  const timestampMatch = message.match(/Timestamp:\s*(\d+)/)
  const userIdMatch = message.match(/User ID:\s*([^\n]+)/)
  
  if (!timestampMatch || !userIdMatch) {
    return false
  }
  
  // * Validate timestamp is reasonable (not too old, not in future)
  const timestamp = parseInt(timestampMatch[1])
  const now = Date.now()
  const maxAge = 15 * 60 * 1000 // 15 minutes
  
  if (timestamp < (now - maxAge) || timestamp > (now + 60000)) { // Allow 1 minute future tolerance
    return false
  }
  
  return true
}

// ====================================================================================
// WALLET CONNECTION HELPERS
// ====================================================================================

/**
 * * Creates a complete wallet connection request
 * @param userId - The user ID
 * @param walletAddress - The wallet address to connect
 * @returns Complete connection request data
 */
export function createWalletConnectionRequest(userId: string, walletAddress: string): {
  message: string
  walletAddress: string
  userId: string
  timestamp: number
} {
  const message = generateWalletMessage(userId)
  const normalizedAddress = normalizeAddress(walletAddress)
  
  return {
    message,
    walletAddress: normalizedAddress,
    userId,
    timestamp: Date.now()
  }
}

/**
 * * Validates a complete wallet connection request
 * @param data - The connection request data
 * @returns Validation result
 */
export function validateWalletConnectionRequest(data: WalletConnectionRequest, expectedUserId?: string): WalletVerificationResult {
  // Validate inputs
  if (!isValidAddress(data.walletAddress)) {
    return {
      valid: false,
      error: 'Invalid wallet address format'
    }
  }
  
  if (!isValidSignatureFormat(data.signature)) {
    return {
      valid: false,
      error: 'Invalid signature format'
    }
  }
  
  if (!isValidSigningMessage(data.message)) {
    return {
      valid: false,
      error: 'Invalid message format - must include User ID and Timestamp'
    }
  }
  
  // * Production security: Validate User ID matches authenticated user
  if (expectedUserId) {
    const parsed = parseWalletMessage(data.message)
    if (!parsed || parsed.userId !== expectedUserId) {
      return {
        valid: false,
        error: 'Message User ID does not match authenticated user'
      }
    }
  }
  
  // Check if message is recent
  if (!isMessageRecent(data.message)) {
    const parsed = parseWalletMessage(data.message)
    const ageMinutes = parsed ? Math.floor((Date.now() - parsed.timestamp) / (60 * 1000)) : 0
    return {
      valid: false,
      error: `Message is too old (${ageMinutes} minutes), please sign a new message`
    }
  }
  
  // Verify signature
  return verifySignature(data.message, data.signature, data.walletAddress)
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { WalletVerificationResult, WalletMessage }
