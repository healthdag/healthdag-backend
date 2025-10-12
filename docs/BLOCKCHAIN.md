# Blockchain Integration Documentation

## Overview

The HealthLease Hub blockchain integration has been refactored to follow a **separation of concerns** architecture. Each smart contract now has its own dedicated service class, making the codebase more maintainable, testable, and easier to understand.

## Architecture

```
src/core/
├── blockchain/                      # NEW: Blockchain service layer
│   ├── did-registry-service.ts      # DID Registry contract
│   ├── data-lease-service.ts        # Data Lease contract
│   ├── emergency-access-service.ts  # Emergency Access contract
│   ├── marketplace-service.ts       # Marketplace contract
│   ├── payment-processor-service.ts # Payment Processor contract
│   ├── deployment-config.ts         # Deployment config loader
│   ├── types.ts                     # Common blockchain types
│   ├── index.ts                     # Public exports
│   └── README.md                    # Documentation
│
└── services/
    └── web3-service.ts              # UPDATED: Main Web3 service facade
```

## What Changed

### Before
- Single monolithic `web3-service.ts` with all contract interactions
- Mixed concerns and responsibilities
- Difficult to test individual contracts

### After
- Separated blockchain services by contract
- Clean separation of concerns
- Each service is independently testable
- Main `web3-service.ts` acts as a facade/gateway

## Service Classes

### 1. DIDRegistryService

**File**: `src/core/blockchain/did-registry-service.ts`

Handles all interactions with the DID Registry smart contract.

**Key Methods**:
- `createDID(initialDocumentHash)` - Create a new DID
- `getDID(userAddress)` - Get DID for an address
- `didExists(userAddress)` - Check if DID exists
- `addDocument(ipfsHash, category, encryptionMethod)` - Add document to DID
- `revokeDocument(documentId)` - Revoke a document
- `getDocumentsMetadata(userAddress)` - Get all document metadata
- `validateDocument(userAddress, documentId)` - Validate document exists and is active

### 2. DataLeaseService

**File**: `src/core/blockchain/data-lease-service.ts`

Handles all interactions with the Data Lease smart contract.

**Key Methods**:
- `createLease(...)` - Create new data lease
- `activateLease(leaseId, documentIds)` - Activate lease with documents
- `getLease(leaseId)` - Get lease details
- `getUserLeases(userDID)` - Get all leases for a user
- `getStudyLeases(studyId)` - Get all leases for a study
- `isLeaseActive(leaseId)` - Check if lease is active
- `getAccessToken(leaseId)` - Get access token for lease
- `revokeLease(leaseId, reason)` - Revoke a lease
- `releasePayment(leaseId)` - Release payment for lease

### 3. EmergencyAccessService

**File**: `src/core/blockchain/emergency-access-service.ts`

Handles all interactions with the Emergency Access smart contract.

**Key Methods**:
- `grantAccess(...)` - Grant emergency access to responder
- `getGrant(grantId)` - Get grant details
- `getPatientGrants(patientDID)` - Get all grants for a patient
- `getActiveGrants(patientDID)` - Get active grants for a patient
- `checkAccess(grantId)` - Check if grant has access
- `verifyResponderAccess(patientDID, responder)` - Verify responder has access
- `getAccessLogs(grantId)` - Get access logs for a grant
- `revokeAccess(grantId, reason)` - Revoke emergency access
- `emergencyOverride(...)` - Admin override for critical emergencies

### 4. MarketplaceService

**File**: `src/core/blockchain/marketplace-service.ts`

Handles all interactions with the Marketplace smart contract.

**Key Methods**:
- `createStudy(...)` - Create new research study
- `getStudy(studyId)` - Get study details
- `getActiveStudies()` - Get all active studies
- `getUserStudies(userDID)` - Get studies user is enrolled in
- `getStudyParticipants(studyId)` - Get study participants
- `getRequiredDocuments(studyId, userDID)` - Get required documents for study
- `applyToStudy(studyId, userDID, documentIds)` - Apply to study
- `pauseStudy(studyId)` - Pause a study
- `resumeStudy(studyId)` - Resume a study
- `closeStudy(studyId)` - Close a study
- `releasePaymentAfterAccess(leaseId)` - Release payment after data access

### 5. PaymentProcessorService

**File**: `src/core/blockchain/payment-processor-service.ts`

Handles all interactions with the Payment Processor smart contract.

**Key Methods**:
- `depositEscrow(studyId, depositor, value)` - Deposit funds to escrow
- `getEscrow(studyId)` - Get escrow balance
- `releaseFromEscrow(studyId, recipient, amount)` - Release funds from escrow
- `refund(studyId, recipient, amount)` - Refund depositor
- `withdrawPlatformFees()` - Withdraw collected platform fees
- `updatePlatformWallet(newWallet)` - Update platform wallet address
- `getTotalPlatformFees()` - Get total platform fees collected

## Configuration

### Contract Addresses

Contract addresses are loaded from environment variables:

```env
# Awakening Network (Chain ID: 1043)
DID_REGISTRY_ADDRESS=0x599DA0AD70492beb6F41FB68371Df0048Ff4592f
DATA_LEASE_ADDRESS=0x05660dC688FaE10BeccBe7195f8F16041Ce6E8B4
EMERGENCY_ACCESS_ADDRESS=0x2AB757f5E983A4abe3cc24eAFd213002a8Af0690
MARKETPLACE_ADDRESS=0x1006Af1736348d7C60901F379A8D0172BFbF52d1
PAYMENT_PROCESSOR_ADDRESS=0x5C335809FCBE036Ec5862F706da35c01825c1F3B
```

### Network Configuration

```env
RPC_URL=https://rpc.awakening.bdagscan.com
PRIVATE_KEY=your_private_key_here
```

## Usage Examples

### Basic Usage

```typescript
import { web3Service } from './core/services/web3-service'

// All services are accessible through web3Service
const { didRegistry, dataLease, emergencyAccess, marketplace, paymentProcessor } = web3Service
```

### Create a DID

```typescript
const result = await web3Service.didRegistry.createDID('QmHash...')
console.log('Created DID:', result.did)
console.log('Transaction hash:', result.receipt.hash)
```

### Get Active Studies

```typescript
const studyIds = await web3Service.marketplace.getActiveStudies()

for (const studyId of studyIds) {
  const study = await web3Service.marketplace.getStudy(studyId)
  console.log('Study:', study.title)
  console.log('Payment:', ethers.formatEther(study.paymentPerUser), 'ETH')
}
```

### Apply to Study

```typescript
const userDID = 'did:healthlease:...'
const studyId = BigInt(1)
const documentIds = [BigInt(1), BigInt(2), BigInt(3)]

const result = await web3Service.marketplace.applyToStudy(
  studyId,
  userDID,
  documentIds
)

console.log('Applied to study, lease ID:', result.leaseId)
```

### Grant Emergency Access

```typescript
const result = await web3Service.emergencyAccess.grantAccess(
  'did:healthlease:patient123',
  '0x123...', // responder address
  'Dr. John Smith',
  'MD License #12345',
  BigInt(3600), // 1 hour duration
  0, // AccessLevel.BASIC
  'Emergency Room - St. Mary Hospital'
)

console.log('Emergency access granted, ID:', result.grantId)
```

### Check Lease Status

```typescript
const leaseId = BigInt(1)
const lease = await web3Service.dataLease.getLease(leaseId)

console.log('Lease status:', lease.status)
console.log('Researcher:', lease.researcher)
console.log('Payment:', ethers.formatEther(lease.paymentAmount), 'ETH')
console.log('Active:', await web3Service.dataLease.isLeaseActive(leaseId))
```

### Handle Payments

```typescript
// Deposit escrow for a study
await web3Service.paymentProcessor.depositEscrow(
  studyId,
  researcherAddress,
  ethers.parseEther('100') // 100 ETH
)

// Check escrow balance
const balance = await web3Service.paymentProcessor.getEscrow(studyId)
console.log('Escrow balance:', ethers.formatEther(balance), 'ETH')

// Release payment to participant
await web3Service.paymentProcessor.releaseFromEscrow(
  studyId,
  participantAddress,
  ethers.parseEther('5') // 5 ETH
)
```

## Network Utilities

The `web3Service` also provides useful network utilities:

```typescript
// Get network info
const networkInfo = await web3Service.getNetworkInfo()
console.log('Network:', networkInfo.name)
console.log('Chain ID:', networkInfo.chainId)
console.log('Block number:', networkInfo.blockNumber)

// Get signer address
const signerAddress = web3Service.getSignerAddress()

// Get balance
const balance = await web3Service.getBalance('0x123...')
console.log('Balance:', web3Service.formatEther(balance), 'ETH')

// Format/parse ether
const wei = web3Service.parseEther('1.5') // 1.5 ETH to wei
const eth = web3Service.formatEther(BigInt('1500000000000000000')) // wei to ETH
```

## Type Safety

All services include TypeScript interfaces for contract structs:

```typescript
import type { 
  LeaseStruct,
  EmergencyGrantStruct,
  StudyStruct,
  AccessLogStruct
} from './core/blockchain'

const lease: LeaseStruct = await dataLease.getLease(leaseId)
const study: StudyStruct = await marketplace.getStudy(studyId)
```

## Error Handling

All methods throw descriptive errors:

```typescript
try {
  const result = await web3Service.didRegistry.createDID('ipfs-hash')
} catch (error) {
  // Error message includes context: "Failed to create DID: ..."
  console.error(error.message)
}
```

## Event Parsing

All write methods automatically parse relevant events:

```typescript
// Events are parsed automatically
const { did, receipt } = await didRegistry.createDID('ipfs-hash')

// Access transaction details
console.log('Transaction hash:', receipt.hash)
console.log('Block number:', receipt.blockNumber)
console.log('Gas used:', receipt.gasUsed.toString())
```

## Health Check

```typescript
const isHealthy = await web3Service.healthCheck()
console.log('Web3 service healthy:', isHealthy)
```

## Deployment Information

Current deployment on **Awakening Network** (Chain ID: 1043):

| Contract | Address |
|----------|---------|
| DIDRegistry | `0x599DA0AD70492beb6F41FB68371Df0048Ff4592f` |
| DataLease | `0x05660dC688FaE10BeccBe7195f8F16041Ce6E8B4` |
| EmergencyAccess | `0x2AB757f5E983A4abe3cc24eAFd213002a8Af0690` |
| Marketplace | `0x1006Af1736348d7C60901F379A8D0172BFbF52d1` |
| PaymentProcessor | `0x5C335809FCBE036Ec5862F706da35c01825c1F3B` |

Deployed by: `0xcFF3Dd4FaD8919DC2d2101CA0d34a8c12958f8F1`  
Timestamp: `2025-10-11T16:20:08.087Z`

## Best Practices

1. **Always use BigInt for blockchain numbers** (IDs, amounts, timestamps)
2. **Handle transaction failures** with try-catch blocks
3. **Wait for confirmations** - all write methods return receipts
4. **Validate inputs** before sending transactions
5. **Use ethers utilities** for formatting (formatEther, parseEther)
6. **Check gas prices** before expensive operations
7. **Never expose private keys** in code or logs

## Common Patterns

### Creating Resources with Events

```typescript
// Pattern: Create resource and parse event for ID
const { resourceId, receipt } = await service.createResource(...)

// Use the ID immediately
const resource = await service.getResource(resourceId)
```

### Checking Status Before Operations

```typescript
// Pattern: Check status before performing action
const isActive = await dataLease.isLeaseActive(leaseId)
if (!isActive) {
  throw new Error('Lease is not active')
}

await dataLease.releasePayment(leaseId)
```

### Handling Multiple Contracts

```typescript
// Pattern: Coordinate across contracts
const userDID = await didRegistry.getDID(userAddress)
const userLeases = await dataLease.getUserLeases(userDID)
const userStudies = await marketplace.getUserStudies(userDID)
```

## Migration Notes

If you're updating existing code:

**Old way**:
```typescript
const study = await web3Service.marketplace.getStudy(studyId)
```

**New way** (same!):
```typescript
const study = await web3Service.marketplace.getStudy(studyId)
```

The API remains the same, but now `marketplace` is a `MarketplaceService` instance instead of an `ethers.Contract`.

## Troubleshooting

### "Contract addresses not found"
- Ensure all 5 contract addresses are in your `.env` file
- Check that `.env` is loaded before Web3Service initializes

### "RPC_URL environment variable is required"
- Set `RPC_URL` in your `.env` file
- For Awakening network: `https://rpc.awakening.bdagscan.com`

### "PRIVATE_KEY environment variable is required"
- Set `PRIVATE_KEY` in your `.env` file
- Never commit private keys to version control

### Transaction Failures
- Check that the signer has sufficient balance
- Verify contract method parameters are correct
- Ensure the contract is not paused
- Check that the caller has the required permissions

## Resources

- **Ethers.js Docs**: https://docs.ethers.org/v6/
- **Contract ABIs**: `src/exports/abis.json`
- **Deployment Info**: `src/deployments/awakening-*.json`
- **Type Definitions**: `src/core/blockchain/types.ts`

## Future Enhancements

Potential improvements:

- [ ] Add transaction retry logic with exponential backoff
- [ ] Implement gas price optimization
- [ ] Add transaction queuing for rate limiting
- [ ] Create mock services for testing
- [ ] Add event listeners for real-time updates
- [ ] Implement multi-signature support
- [ ] Add contract upgrade detection
- [ ] Create deployment scripts for new networks

