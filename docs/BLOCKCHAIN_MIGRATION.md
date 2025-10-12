# Blockchain Service Migration Guide

## Overview

The blockchain integration has been refactored into a **modular, service-oriented architecture**. This guide helps you migrate existing code to the new structure.

## What Changed

### Architecture Changes

**Before**: Single monolithic service
```typescript
// Old: Direct contract access
const tx = await web3Service.didRegistry.createDID(ownerAddress, ipfsHash)
const receipt = await tx.wait()
```

**After**: Specialized service classes
```typescript
// New: Service methods handle everything
const { did, receipt } = await web3Service.didRegistry.createDID(ipfsHash)
```

### Key Improvements

1. ✅ **Separation of Concerns** - Each contract has its own service
2. ✅ **Better Type Safety** - Structured return types
3. ✅ **Automatic Event Parsing** - Events extracted automatically
4. ✅ **Error Handling** - Descriptive error messages
5. ✅ **Easier Testing** - Services can be mocked individually
6. ✅ **Better Documentation** - JSDoc for all methods

## Migration Examples

### DID Registry

**Old Way**:
```typescript
const tx = await web3Service.didRegistry.createDID(ownerAddress, initialDocHash)
const receipt = await tx.wait()
const didEvent = receipt.logs.find(log => log.topics[0] === 'DIDCreated')
const did = parseEvent(didEvent)
```

**New Way**:
```typescript
const { did, receipt } = await web3Service.didRegistry.createDID(initialDocHash)
// Events are parsed automatically!
```

### Data Lease

**Old Way**:
```typescript
const leaseStruct = await web3Service.dataLease.getLease(leaseId)
const isActive = leaseStruct.status === 1 && leaseStruct.endTime > Date.now()
```

**New Way**:
```typescript
const lease = await web3Service.dataLease.getLease(leaseId)
const isActive = await web3Service.dataLease.isLeaseActive(leaseId)
```

### Marketplace

**Old Way**:
```typescript
const studies = await web3Service.marketplace.getActiveStudies()
const studyDetails = []
for (const study of studies) {
  const detail = await web3Service.marketplace.getStudy(study.id)
  studyDetails.push(detail)
}
```

**New Way** (same pattern, but with better types):
```typescript
const studyIds = await web3Service.marketplace.getActiveStudies()
const studyDetails = await Promise.all(
  studyIds.map(id => web3Service.marketplace.getStudy(id))
)
```

### Emergency Access

**Old Way**:
```typescript
const tx = await web3Service.emergencyAccess.grantEmergencyAccess(
  patientDID, 
  responderInfo
)
const receipt = await tx.wait()
const event = parseAccessGrantedEvent(receipt)
```

**New Way**:
```typescript
const { grantId, receipt } = await web3Service.emergencyAccess.grantAccess(
  patientDID,
  responderAddress,
  responderName,
  responderCredential,
  duration,
  accessLevel,
  location
)
```

## Common Migration Patterns

### Pattern 1: Transaction + Event Parsing

**Before**:
```typescript
const tx = await contract.method(args)
const receipt = await tx.wait()
const event = findEvent(receipt, 'EventName')
const id = parseEventArg(event, 'id')
```

**After**:
```typescript
const { id, receipt } = await service.method(args)
```

### Pattern 2: Status Checks

**Before**:
```typescript
const struct = await contract.getStruct(id)
const isValid = struct.field1 && struct.field2 > threshold
```

**After**:
```typescript
const isValid = await service.checkStatus(id)
// or
const struct = await service.getStruct(id)
const isValid = struct.field1 && struct.field2 > threshold
```

### Pattern 3: Array Results

**Before**:
```typescript
const results = await contract.getArray()
const processed = results.map(item => ({
  field1: item[0],
  field2: item[1]
}))
```

**After**:
```typescript
const results = await service.getArray()
// Returns properly typed array with named fields
```

## Updated API Reference

### Web3Service Main Interface

```typescript
import { web3Service } from './core/services/web3-service'

// Access services
web3Service.didRegistry        // DIDRegistryService
web3Service.dataLease          // DataLeaseService
web3Service.emergencyAccess    // EmergencyAccessService
web3Service.marketplace        // MarketplaceService
web3Service.paymentProcessor   // PaymentProcessorService

// Network utilities
web3Service.provider          // ethers.JsonRpcProvider
web3Service.signer            // ethers.Wallet
web3Service.getNetworkInfo()  // Get network details
web3Service.getSignerAddress() // Get signer address
web3Service.getBalance(addr)  // Get address balance
web3Service.formatEther(wei)  // Format wei to ether
web3Service.parseEther(eth)   // Parse ether to wei
web3Service.healthCheck()     // Check service health
```

### DIDRegistryService Methods

```typescript
// Read methods
await didRegistry.getDID(userAddress)
await didRegistry.didExists(userAddress)
await didRegistry.getAddressByDID(did)
await didRegistry.getDocumentCount(userAddress)
await didRegistry.getDocumentsMetadata(userAddress)
await didRegistry.validateDocument(userAddress, documentId)

// Write methods
await didRegistry.createDID(initialDocumentHash)
await didRegistry.addDocument(ipfsHash, category, encryptionMethod)
await didRegistry.revokeDocument(documentId)
```

### DataLeaseService Methods

```typescript
// Read methods
await dataLease.getLease(leaseId)
await dataLease.getUserLeases(userDID)
await dataLease.getStudyLeases(studyId)
await dataLease.getActiveLeaseCount(userDID)
await dataLease.isLeaseActive(leaseId)
await dataLease.getAccessToken(leaseId)
await dataLease.getLeaseDocuments(leaseId)

// Write methods
await dataLease.createLease(userDID, studyId, researcher, duration, paymentAmount, dataCategories, termsHash)
await dataLease.activateLease(leaseId, documentIds)
await dataLease.revokeLease(leaseId, reason)
await dataLease.releasePayment(leaseId)
```

### EmergencyAccessService Methods

```typescript
// Read methods
await emergencyAccess.getGrant(grantId)
await emergencyAccess.getPatientGrants(patientDID)
await emergencyAccess.getActiveGrants(patientDID)
await emergencyAccess.checkAccess(grantId)
await emergencyAccess.verifyResponderAccess(patientDID, responder)
await emergencyAccess.getAccessLogs(grantId)
await emergencyAccess.getEmergencyToken(grantId)

// Write methods
await emergencyAccess.grantAccess(patientDID, responder, responderName, responderCredential, duration, accessLevel, location)
await emergencyAccess.revokeAccess(grantId, reason)
await emergencyAccess.emergencyOverride(patientDID, responder, duration, justification)
```

### MarketplaceService Methods

```typescript
// Read methods
await marketplace.getStudy(studyId)
await marketplace.getActiveStudies()
await marketplace.getUserStudies(userDID)
await marketplace.getStudyParticipants(studyId)
await marketplace.getRequiredDocuments(studyId, userDID)
await marketplace.getPlatformFeePercentage()
await marketplace.getTotalStudies()

// Write methods
await marketplace.createStudy(title, metadataHash, irbApprovalHash, participantsNeeded, paymentPerUser, duration, requiredDataCategories, value)
await marketplace.applyToStudy(studyId, userDID, documentIds)
await marketplace.pauseStudy(studyId)
await marketplace.resumeStudy(studyId)
await marketplace.closeStudy(studyId)
await marketplace.releasePaymentAfterAccess(leaseId)
```

### PaymentProcessorService Methods

```typescript
// Read methods
await paymentProcessor.getEscrow(studyId)
await paymentProcessor.getDepositor(studyId)
await paymentProcessor.getPlatformWallet()
await paymentProcessor.getTotalPlatformFees()

// Write methods
await paymentProcessor.depositEscrow(studyId, depositor, value)
await paymentProcessor.releaseFromEscrow(studyId, recipient, amount)
await paymentProcessor.refund(studyId, recipient, amount)
await paymentProcessor.withdrawPlatformFees()
await paymentProcessor.updatePlatformWallet(newWallet)
```

## Configuration Changes

### Environment Variables

Update your `.env` file with the deployment addresses:

```env
# Awakening Network (Chain ID: 1043)
DID_REGISTRY_ADDRESS=0x599DA0AD70492beb6F41FB68371Df0048Ff4592f
DATA_LEASE_ADDRESS=0x05660dC688FaE10BeccBe7195f8F16041Ce6E8B4
EMERGENCY_ACCESS_ADDRESS=0x2AB757f5E983A4abe3cc24eAFd213002a8Af0690
MARKETPLACE_ADDRESS=0x1006Af1736348d7C60901F379A8D0172BFbF52d1
PAYMENT_PROCESSOR_ADDRESS=0x5C335809FCBE036Ec5862F706da35c01825c1F3B
```

### Deployment Files

Deployment configurations are stored in `src/deployments/`:
- Format: `{network}-{timestamp}.json`
- Current: `awakening-1760199608091.json`

## Testing Migration

### Before
```typescript
// Mock the entire web3Service
jest.mock('../services/web3-service')
```

### After
```typescript
// Mock individual services
jest.mock('../blockchain/did-registry-service')
jest.mock('../blockchain/marketplace-service')
// etc.
```

## Breaking Changes

### None!

The public API of `web3Service` remains largely the same. The main changes are:

1. Services now return structured objects instead of raw contract results
2. Events are automatically parsed and returned with method results
3. Some method signatures simplified (removed redundant parameters)

### Deprecated Methods

The following methods from the old `web3Service` have been removed:

- `_waitForTransaction()` - Now internal to each service
- `_parseEvent()` - Now internal to each service
- Direct contract property access - Use service methods instead

## Common Issues & Solutions

### Issue: "Cannot access contract property"

**Before**:
```typescript
const result = await web3Service.didRegistry.someMethod()
```

**Solution**: Update to service method:
```typescript
const result = await web3Service.didRegistry.someMethod()
// (No change needed - this should work!)
```

### Issue: "Method not found on service"

**Check**: Is it in the right service?
- DID operations → `didRegistry`
- Lease operations → `dataLease`
- Emergency → `emergencyAccess`
- Studies → `marketplace`
- Payments → `paymentProcessor`

### Issue: "Event parsing failed"

**Before**: Manual event parsing
```typescript
const event = receipt.logs.find(...)
```

**After**: Automatic in method results
```typescript
const { id, receipt } = await service.method()
// id is automatically extracted from events
```

## Utilities Available

Import blockchain utilities:

```typescript
import { BlockchainUtils } from './core/blockchain'

// BigInt conversions
BlockchainUtils.bigIntToString(value)
BlockchainUtils.stringToBigInt(value)

// Ether formatting
BlockchainUtils.formatEtherWithDecimals(wei, 4)
BlockchainUtils.etherToWei('1.5')

// Address utilities
BlockchainUtils.isValidAddress(address)
BlockchainUtils.isSameAddress(addr1, addr2)

// Timestamp utilities
BlockchainUtils.timestampToDate(timestamp)
BlockchainUtils.isExpired(timestamp)

// Error parsing
BlockchainUtils.parseRevertReason(error)
BlockchainUtils.isInsufficientFundsError(error)
```

## Next Steps

1. ✅ Review the new service files in `src/core/blockchain/`
2. ✅ Update your `.env` file with contract addresses
3. ✅ Test existing functionality
4. ✅ Update any direct contract calls to use service methods
5. ✅ Enjoy cleaner, more maintainable code!

## Questions?

- Check `src/core/blockchain/README.md` for detailed documentation
- Review `docs/BLOCKCHAIN.md` for architecture overview
- Look at service files for method signatures and examples

## Support

If you encounter issues during migration:

1. Check the error message - they're now more descriptive
2. Verify your `.env` has all required addresses
3. Ensure you're using the correct service for your operation
4. Review the method signature in the service file

