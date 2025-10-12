// * Blockchain services index file
export { DIDRegistryService } from './did-registry-service'
export { DataLeaseService, type LeaseStruct } from './data-lease-service'
export { EmergencyAccessService, type EmergencyGrantStruct, type AccessLogStruct } from './emergency-access-service'
export { MarketplaceService, type StudyStruct } from './marketplace-service'
export { PaymentProcessorService } from './payment-processor-service'

// * Configuration and types
export { loadDeploymentConfig, getContractAddresses, getRpcUrl, getPrivateKey, type DeploymentConfig } from './deployment-config'
export * from './types'

// * Factory and utilities
export * from './contract-factory'
export * as BlockchainUtils from './utils'

