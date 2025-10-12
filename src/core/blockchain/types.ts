// * Common blockchain types for HealthLease Hub

export interface TransactionResult {
  transactionHash: string
  blockNumber: number
  gasUsed: bigint
  effectiveGasPrice: bigint
  status: number
}

export interface ContractAddresses {
  didRegistry: string
  dataLease: string
  emergencyAccess: string
  marketplace: string
  paymentProcessor: string
}

export interface NetworkInfo {
  name: string
  chainId: number
  blockNumber: number
}

export interface BlockchainHealth {
  connected: boolean
  blockNumber: number
  networkName: string
  chainId: number
  signerAddress: string
}

// * Emergency Access Levels
export enum EmergencyAccessLevel {
  BASIC = 0,
  FULL = 1,
  CRITICAL = 2
}

// * Lease Status
export enum LeaseStatus {
  PENDING = 0,
  ACTIVE = 1,
  EXPIRED = 2,
  REVOKED = 3,
  COMPLETED = 4
}

// * Study Status
export enum StudyStatus {
  ACTIVE = 0,
  PAUSED = 1,
  CLOSED = 2,
  CANCELLED = 3
}

// * Document Categories (must match contract)
export const DOCUMENT_CATEGORIES = {
  BLOOD_TYPE: 'BLOOD_TYPE',
  ALLERGIES: 'ALLERGIES',
  CURRENT_MEDICATIONS: 'CURRENT_MEDICATIONS',
  RECENT_VISIT: 'RECENT_VISIT',
  CHRONIC_CONDITIONS: 'CHRONIC_CONDITIONS',
  EMERGENCY_CONTACT: 'EMERGENCY_CONTACT',
  LAB_RESULT: 'LAB_RESULT',
  IMAGING: 'IMAGING',
  PRESCRIPTION: 'PRESCRIPTION',
  MEDICAL_HISTORY: 'MEDICAL_HISTORY'
} as const

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[keyof typeof DOCUMENT_CATEGORIES]

