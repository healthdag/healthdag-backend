// * Blockchain utility functions
import { ethers } from 'ethers'

// ====================================================================================
// BIGINT UTILITIES
// ====================================================================================

/**
 * Convert BigInt to string for JSON serialization
 * @param value - BigInt value
 * @returns String representation
 */
export function bigIntToString(value: bigint): string {
  return value.toString()
}

/**
 * Convert string to BigInt
 * @param value - String value
 * @returns BigInt value
 */
export function stringToBigInt(value: string): bigint {
  return BigInt(value)
}

/**
 * Convert BigInt array to string array
 * @param values - BigInt array
 * @returns String array
 */
export function bigIntArrayToStringArray(values: bigint[]): string[] {
  return values.map(v => v.toString())
}

/**
 * Convert string array to BigInt array
 * @param values - String array
 * @returns BigInt array
 */
export function stringArrayToBigIntArray(values: string[]): bigint[] {
  return values.map(v => BigInt(v))
}

// ====================================================================================
// ETHER CONVERSION UTILITIES
// ====================================================================================

/**
 * Convert wei to ether string
 * @param wei - Amount in wei
 * @param decimals - Number of decimals to show (default: 4)
 * @returns Formatted ether string
 */
export function formatEtherWithDecimals(wei: bigint, decimals: number = 4): string {
  const ether = ethers.formatEther(wei)
  const num = parseFloat(ether)
  return num.toFixed(decimals)
}

/**
 * Convert ether to wei
 * @param ether - Amount in ether
 * @returns Amount in wei
 */
export function etherToWei(ether: string | number): bigint {
  return ethers.parseEther(ether.toString())
}

/**
 * Convert gwei to wei
 * @param gwei - Amount in gwei
 * @returns Amount in wei
 */
export function gweiToWei(gwei: string | number): bigint {
  return ethers.parseUnits(gwei.toString(), 'gwei')
}

// ====================================================================================
// ADDRESS UTILITIES
// ====================================================================================

/**
 * Check if address is valid
 * @param address - Address to check
 * @returns True if valid
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}

/**
 * Get checksum address
 * @param address - Address to format
 * @returns Checksum address
 */
export function getChecksumAddress(address: string): string {
  return ethers.getAddress(address)
}

/**
 * Compare addresses (case-insensitive)
 * @param address1 - First address
 * @param address2 - Second address
 * @returns True if addresses match
 */
export function isSameAddress(address1: string, address2: string): boolean {
  try {
    return getChecksumAddress(address1) === getChecksumAddress(address2)
  } catch {
    return false
  }
}

// ====================================================================================
// TIMESTAMP UTILITIES
// ====================================================================================

/**
 * Convert blockchain timestamp to Date
 * @param timestamp - Blockchain timestamp (seconds)
 * @returns Date object
 */
export function timestampToDate(timestamp: bigint): Date {
  return new Date(Number(timestamp) * 1000)
}

/**
 * Convert Date to blockchain timestamp
 * @param date - Date object
 * @returns Blockchain timestamp (seconds)
 */
export function dateToTimestamp(date: Date): bigint {
  return BigInt(Math.floor(date.getTime() / 1000))
}

/**
 * Get current blockchain timestamp
 * @returns Current timestamp in seconds
 */
export function getCurrentTimestamp(): bigint {
  return BigInt(Math.floor(Date.now() / 1000))
}

/**
 * Add duration to timestamp
 * @param timestamp - Starting timestamp
 * @param durationSeconds - Duration in seconds
 * @returns New timestamp
 */
export function addDuration(timestamp: bigint, durationSeconds: bigint): bigint {
  return timestamp + durationSeconds
}

/**
 * Check if timestamp is in the past
 * @param timestamp - Timestamp to check
 * @returns True if in the past
 */
export function isExpired(timestamp: bigint): boolean {
  return timestamp < getCurrentTimestamp()
}

// ====================================================================================
// TRANSACTION UTILITIES
// ====================================================================================

/**
 * Wait for transaction with timeout
 * @param tx - Transaction response
 * @param confirmations - Number of confirmations to wait for
 * @param timeoutMs - Timeout in milliseconds
 * @returns Transaction receipt
 */
export async function waitForTransaction(
  tx: ethers.TransactionResponse,
  confirmations: number = 1,
  timeoutMs: number = 120000 // 2 minutes
): Promise<ethers.TransactionReceipt> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs)
  })

  const receiptPromise = tx.wait(confirmations)

  const receipt = await Promise.race([receiptPromise, timeoutPromise])
  
  if (!receipt) {
    throw new Error('Transaction receipt is null')
  }

  return receipt
}

/**
 * Estimate gas for transaction
 * @param contract - Contract instance
 * @param method - Method name
 * @param args - Method arguments
 * @returns Estimated gas
 */
export async function estimateGas(
  contract: ethers.Contract,
  method: string,
  args: any[]
): Promise<bigint> {
  try {
    return await contract[method].estimateGas(...args)
  } catch (error) {
    throw new Error(`Failed to estimate gas: ${error}`)
  }
}

/**
 * Get transaction cost
 * @param receipt - Transaction receipt
 * @returns Cost in wei
 */
export function getTransactionCost(receipt: ethers.TransactionReceipt): bigint {
  return receipt.gasUsed * (receipt.gasPrice || BigInt(0))
}

// ====================================================================================
// ERROR HANDLING
// ====================================================================================

/**
 * Parse revert reason from error
 * @param error - Error object
 * @returns Revert reason or generic message
 */
export function parseRevertReason(error: any): string {
  if (error?.reason) {
    return error.reason
  }
  
  if (error?.error?.reason) {
    return error.error.reason
  }
  
  if (error?.data?.message) {
    return error.data.message
  }
  
  if (error?.message) {
    // Try to extract revert reason from message
    const match = error.message.match(/reason="([^"]+)"/)
    if (match) {
      return match[1]
    }
    return error.message
  }
  
  return 'Unknown error'
}

/**
 * Check if error is due to insufficient funds
 * @param error - Error object
 * @returns True if insufficient funds error
 */
export function isInsufficientFundsError(error: any): boolean {
  const message = parseRevertReason(error).toLowerCase()
  return message.includes('insufficient funds') || 
         message.includes('insufficient balance')
}

/**
 * Check if error is due to user rejection
 * @param error - Error object
 * @returns True if user rejected transaction
 */
export function isUserRejectedError(error: any): boolean {
  const message = parseRevertReason(error).toLowerCase()
  return message.includes('user rejected') || 
         message.includes('user denied')
}

// ====================================================================================
// ENCODING/DECODING UTILITIES
// ====================================================================================

/**
 * Hash string using keccak256
 * @param text - Text to hash
 * @returns Hash
 */
export function keccak256(text: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(text))
}

/**
 * Convert string to bytes32
 * @param text - Text to convert
 * @returns Bytes32 representation
 */
export function stringToBytes32(text: string): string {
  return ethers.encodeBytes32String(text)
}

/**
 * Convert bytes32 to string
 * @param bytes32 - Bytes32 to convert
 * @returns String representation
 */
export function bytes32ToString(bytes32: string): string {
  return ethers.decodeBytes32String(bytes32)
}

/**
 * ABI encode parameters
 * @param types - Parameter types
 * @param values - Parameter values
 * @returns Encoded data
 */
export function abiEncode(types: string[], values: any[]): string {
  return ethers.AbiCoder.defaultAbiCoder().encode(types, values)
}

/**
 * ABI decode parameters
 * @param types - Parameter types
 * @param data - Encoded data
 * @returns Decoded values
 */
export function abiDecode(types: string[], data: string): ethers.Result {
  return ethers.AbiCoder.defaultAbiCoder().decode(types, data)
}

