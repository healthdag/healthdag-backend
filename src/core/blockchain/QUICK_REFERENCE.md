# Blockchain Services - Quick Reference Card

## Import

```typescript
import { web3Service } from '../services/web3-service'
```

## Services Overview

| Service | Contract | Purpose |
|---------|----------|---------|
| `didRegistry` | DIDRegistry | User identities & documents |
| `dataLease` | DataLease | Data sharing leases |
| `emergencyAccess` | EmergencyAccess | Emergency medical access |
| `marketplace` | Marketplace | Research studies |
| `paymentProcessor` | PaymentProcessor | Escrow & payments |

## Common Operations

### DID Operations

```typescript
// Create DID
const { did } = await web3Service.didRegistry.createDID(ipfsHash)

// Get DID
const did = await web3Service.didRegistry.getDID(address)

// Add document
const { documentId } = await web3Service.didRegistry.addDocument(hash, category, encryption)

// Check if DID exists
const exists = await web3Service.didRegistry.didExists(address)
```

### Lease Operations

```typescript
// Create lease
const { leaseId } = await web3Service.dataLease.createLease(...)

// Get lease
const lease = await web3Service.dataLease.getLease(leaseId)

// Activate lease
const { accessToken } = await web3Service.dataLease.activateLease(leaseId, docIds)

// Check if active
const active = await web3Service.dataLease.isLeaseActive(leaseId)
```

### Study Operations

```typescript
// Create study
const { studyId } = await web3Service.marketplace.createStudy(...)

// Get active studies
const studyIds = await web3Service.marketplace.getActiveStudies()

// Get study details
const study = await web3Service.marketplace.getStudy(studyId)

// Apply to study
const { leaseId } = await web3Service.marketplace.applyToStudy(studyId, did, docIds)
```

### Emergency Operations

```typescript
// Grant access
const { grantId } = await web3Service.emergencyAccess.grantAccess(...)

// Check access
const hasAccess = await web3Service.emergencyAccess.checkAccess(grantId)

// Get grant
const grant = await web3Service.emergencyAccess.getGrant(grantId)

// Revoke access
await web3Service.emergencyAccess.revokeAccess(grantId, reason)
```

### Payment Operations

```typescript
// Deposit escrow
await web3Service.paymentProcessor.depositEscrow(studyId, depositor, amount)

// Get escrow balance
const balance = await web3Service.paymentProcessor.getEscrow(studyId)

// Release payment
await web3Service.paymentProcessor.releaseFromEscrow(studyId, recipient, amount)
```

## Network Utilities

```typescript
// Network info
const info = await web3Service.getNetworkInfo()

// Signer address
const address = web3Service.getSignerAddress()

// Get balance
const balance = await web3Service.getBalance(address)

// Format/parse ether
const eth = web3Service.formatEther(wei)
const wei = web3Service.parseEther('1.5')

// Health check
const healthy = await web3Service.healthCheck()
```

## Common Types

```typescript
import type { 
  LeaseStruct,
  StudyStruct,
  EmergencyGrantStruct,
  AccessLogStruct
} from '../core/blockchain'
```

## Enums

```typescript
import { EmergencyAccessLevel, LeaseStatus, StudyStatus } from '../core/blockchain'

EmergencyAccessLevel.BASIC    // 0
EmergencyAccessLevel.FULL     // 1
EmergencyAccessLevel.CRITICAL // 2

LeaseStatus.PENDING   // 0
LeaseStatus.ACTIVE    // 1
LeaseStatus.EXPIRED   // 2

StudyStatus.ACTIVE    // 0
StudyStatus.PAUSED    // 1
StudyStatus.CLOSED    // 2
```

## Utilities

```typescript
import { BlockchainUtils } from '../core/blockchain'

// BigInt
BlockchainUtils.bigIntToString(value)
BlockchainUtils.stringToBigInt(str)

// Formatting
BlockchainUtils.formatEtherWithDecimals(wei, decimals)
BlockchainUtils.etherToWei(eth)

// Addresses
BlockchainUtils.isValidAddress(addr)
BlockchainUtils.isSameAddress(addr1, addr2)

// Timestamps
BlockchainUtils.timestampToDate(ts)
BlockchainUtils.isExpired(ts)

// Errors
BlockchainUtils.parseRevertReason(error)
BlockchainUtils.isInsufficientFundsError(error)
```

## Configuration

### Environment Variables

```env
RPC_URL=https://rpc.awakening.bdagscan.com
PRIVATE_KEY=your_key_here

DID_REGISTRY_ADDRESS=0x599DA0AD70492beb6F41FB68371Df0048Ff4592f
DATA_LEASE_ADDRESS=0x05660dC688FaE10BeccBe7195f8F16041Ce6E8B4
EMERGENCY_ACCESS_ADDRESS=0x2AB757f5E983A4abe3cc24eAFd213002a8Af0690
MARKETPLACE_ADDRESS=0x1006Af1736348d7C60901F379A8D0172BFbF52d1
PAYMENT_PROCESSOR_ADDRESS=0x5C335809FCBE036Ec5862F706da35c01825c1F3B
```

## Return Types

Most write methods return:

```typescript
{
  [idField]: bigint,        // e.g., did, studyId, leaseId, grantId
  receipt: TransactionReceipt
}
```

Example:

```typescript
const { studyId, receipt } = await marketplace.createStudy(...)
// studyId: bigint
// receipt: ethers.TransactionReceipt
```

## Error Handling Pattern

```typescript
try {
  const result = await web3Service.someService.someMethod(...)
} catch (error) {
  console.error('Operation failed:', error.message)
  // Error message format: "Failed to [operation]: [details]"
}
```

## Need More Help?

- 📖 Full docs: `src/core/blockchain/README.md`
- 🔄 Migration: `docs/BLOCKCHAIN_MIGRATION.md`
- 📘 Architecture: `docs/BLOCKCHAIN.md`
- 💡 Examples: `src/core/blockchain/USAGE_EXAMPLES.md`
