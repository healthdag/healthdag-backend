// * Smart Contract ABIs and Bytecodes for HealthLease Hub
// * This file provides typed access to contract ABIs and bytecodes

import ABIs from './abis.json'
import Bytecodes from './bytecodes.json'

// ====================================================================================
// CONTRACT ABIs
// ====================================================================================

export const ContractABIs = {
  DIDRegistry: ABIs.DIDRegistry,
  DataLease: ABIs.DataLease,
  EmergencyAccess: ABIs.EmergencyAccess,
  Marketplace: ABIs.Marketplace,
  PaymentProcessor: ABIs.PaymentProcessor
} as const

// ====================================================================================
// CONTRACT BYTECODES
// ====================================================================================

export const ContractBytecodes = {
  DIDRegistry: Bytecodes.DIDRegistry,
  DataLease: Bytecodes.DataLease,
  EmergencyAccess: Bytecodes.EmergencyAccess,
  Marketplace: Bytecodes.Marketplace,
  PaymentProcessor: Bytecodes.PaymentProcessor
} as const

// ====================================================================================
// CONTRACT NAMES
// ====================================================================================

export const ContractNames = {
  DID_REGISTRY: 'DIDRegistry',
  DATA_LEASE: 'DataLease',
  EMERGENCY_ACCESS: 'EmergencyAccess',
  MARKETPLACE: 'Marketplace',
  PAYMENT_PROCESSOR: 'PaymentProcessor'
} as const

// ====================================================================================
// TYPE EXPORTS
// ====================================================================================

export type ContractName = keyof typeof ContractABIs
export type ContractABI = typeof ContractABIs[ContractName]
export type ContractBytecode = typeof ContractBytecodes[ContractName]

// ====================================================================================
// HELPER FUNCTIONS
// ====================================================================================

/**
 * Get ABI for a contract by name
 * @param contractName - Name of the contract
 * @returns Contract ABI
 */
export function getContractABI(contractName: ContractName): ContractABI {
  return ContractABIs[contractName]
}

/**
 * Get bytecode for a contract by name
 * @param contractName - Name of the contract
 * @returns Contract bytecode
 */
export function getContractBytecode(contractName: ContractName): ContractBytecode {
  return ContractBytecodes[contractName]
}

/**
 * Get all contract names
 * @returns Array of contract names
 */
export function getAllContractNames(): ContractName[] {
  return Object.keys(ContractABIs) as ContractName[]
}

