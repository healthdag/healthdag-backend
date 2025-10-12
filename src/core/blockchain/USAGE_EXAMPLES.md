# Blockchain Service Usage Examples

## Quick Start

```typescript
import { web3Service } from '../services/web3-service'

// All services are available through web3Service
const {
  didRegistry,
  dataLease,
  emergencyAccess,
  marketplace,
  paymentProcessor
} = web3Service
```

## DID Registry Examples

### Create a DID

```typescript
const ipfsHash = 'QmProfileHash...'
const { did, receipt } = await web3Service.didRegistry.createDID(ipfsHash)

console.log('Created DID:', did)
console.log('Transaction hash:', receipt.hash)
console.log('Block number:', receipt.blockNumber)
```

### Add Document to DID

```typescript
const { documentId, receipt } = await web3Service.didRegistry.addDocument(
  'QmDocumentHash...',
  'LAB_RESULT',
  'AES-256-CBC'
)

console.log('Document added with ID:', documentId.toString())
```

### Get User Documents

```typescript
const userAddress = '0x123...'
const metadata = await web3Service.didRegistry.getDocumentsMetadata(userAddress)

console.log('Document IDs:', metadata.documentIds)
console.log('Categories:', metadata.categories)
console.log('Active status:', metadata.activeStatus)
```

### Validate Document

```typescript
const { exists, isActive } = await web3Service.didRegistry.validateDocument(
  userAddress,
  documentId
)

if (exists && isActive) {
  console.log('Document is valid and active')
}
```

## Data Lease Examples

### Create a Lease

```typescript
const { leaseId, receipt } = await web3Service.dataLease.createLease(
  'did:healthlease:user123',
  BigInt(1), // studyId
  '0xResearcherAddress',
  BigInt(2592000), // 30 days in seconds
  ethers.parseEther('5'), // 5 ETH payment
  ['LAB_RESULT', 'IMAGING'],
  'QmTermsHash...'
)

console.log('Lease created with ID:', leaseId.toString())
```

### Activate Lease with Documents

```typescript
const { accessToken, receipt } = await web3Service.dataLease.activateLease(
  leaseId,
  [BigInt(1), BigInt(2), BigInt(3)] // document IDs
)

console.log('Lease activated, access token:', accessToken)
```

### Get Lease Details

```typescript
const lease = await web3Service.dataLease.getLease(leaseId)

console.log('User DID:', lease.userDID)
console.log('Researcher:', lease.researcher)
console.log('Payment:', ethers.formatEther(lease.paymentAmount), 'ETH')
console.log('Status:', lease.status) // 0=Pending, 1=Active, etc.
console.log('Start:', new Date(Number(lease.startTime) * 1000))
console.log('End:', new Date(Number(lease.endTime) * 1000))
```

### Check Lease Status

```typescript
const isActive = await web3Service.dataLease.isLeaseActive(leaseId)
console.log('Lease active:', isActive)

const activeCount = await web3Service.dataLease.getActiveLeaseCount(userDID)
console.log('User has', activeCount, 'active leases')
```

## Marketplace Examples

### Create Research Study

```typescript
const { studyId, receipt } = await web3Service.marketplace.createStudy(
  'COVID-19 Vaccine Efficacy Study',
  'QmStudyMetadata...', // IPFS hash with study details
  'QmIRBApproval...', // IPFS hash of IRB approval
  BigInt(100), // Need 100 participants
  ethers.parseEther('10'), // Pay 10 ETH per participant
  BigInt(7776000), // 90 days duration
  ['LAB_RESULT', 'MEDICAL_HISTORY', 'CURRENT_MEDICATIONS'],
  ethers.parseEther('1000') // 1000 ETH escrow (100 participants × 10 ETH)
)

console.log('Study created with ID:', studyId.toString())
```

### Browse Active Studies

```typescript
const studyIds = await web3Service.marketplace.getActiveStudies()

for (const id of studyIds) {
  const study = await web3Service.marketplace.getStudy(id)
  
  console.log('─'.repeat(50))
  console.log('Study:', study.title)
  console.log('Researcher:', study.researcher)
  console.log('Payment:', ethers.formatEther(study.paymentPerUser), 'ETH per participant')
  console.log('Participants:', `${study.participantsEnrolled}/${study.participantsNeeded}`)
  console.log('Required data:', study.requiredDataCategories.join(', '))
}
```

### Apply to Study

```typescript
const { leaseId, receipt } = await web3Service.marketplace.applyToStudy(
  studyId,
  'did:healthlease:user123',
  [BigInt(1), BigInt(2), BigInt(3)] // Document IDs matching required categories
)

console.log('Applied to study, lease created with ID:', leaseId.toString())
```

### Get Study Participants

```typescript
const participants = await web3Service.marketplace.getStudyParticipants(studyId)
console.log('Study has', participants.length, 'participants')

participants.forEach((did, index) => {
  console.log(`${index + 1}. ${did}`)
})
```

## Emergency Access Examples

### Grant Emergency Access

```typescript
const { grantId, receipt } = await web3Service.emergencyAccess.grantAccess(
  'did:healthlease:patient456', // Patient DID
  '0xResponderAddress', // Emergency responder wallet
  'Dr. Jane Smith', // Responder name
  'MD License #67890', // Credentials
  BigInt(3600), // 1 hour access
  0, // AccessLevel.BASIC
  'Emergency Room - St. Mary Hospital' // Location
)

console.log('Emergency access granted, ID:', grantId.toString())
console.log('Transaction hash:', receipt.hash)
```

### Verify Responder Access

```typescript
const { hasAccess, grantId } = await web3Service.emergencyAccess.verifyResponderAccess(
  patientDID,
  responderAddress
)

if (hasAccess) {
  console.log('Responder has active access, grant ID:', grantId.toString())
  
  // Get grant details
  const grant = await web3Service.emergencyAccess.getGrant(grantId)
  console.log('Expires at:', new Date(Number(grant.expiresAt) * 1000))
  console.log('Access level:', grant.accessLevel) // 0=BASIC, 1=FULL, 2=CRITICAL
}
```

### Get Emergency Access Logs

```typescript
const logs = await web3Service.emergencyAccess.getAccessLogs(grantId)

logs.forEach(log => {
  console.log('Access time:', new Date(Number(log.accessTime) * 1000))
  console.log('Responder:', log.responder)
  console.log('Data accessed:', log.dataAccessed)
  console.log('Proof:', log.ipfsProof)
})
```

### Revoke Emergency Access

```typescript
const receipt = await web3Service.emergencyAccess.revokeAccess(
  grantId,
  'Patient condition stabilized, no longer critical'
)

console.log('Emergency access revoked')
```

## Payment Examples

### Deposit Escrow for Study

```typescript
const receipt = await web3Service.paymentProcessor.depositEscrow(
  studyId,
  researcherAddress,
  ethers.parseEther('100') // 100 ETH
)

console.log('Escrow deposited')

// Check balance
const balance = await web3Service.paymentProcessor.getEscrow(studyId)
console.log('Escrow balance:', ethers.formatEther(balance), 'ETH')
```

### Release Payment to Participant

```typescript
await web3Service.paymentProcessor.releaseFromEscrow(
  studyId,
  participantAddress,
  ethers.parseEther('10') // 10 ETH
)

console.log('Payment released to participant')
```

### Withdraw Platform Fees (Admin)

```typescript
const totalFees = await web3Service.paymentProcessor.getTotalPlatformFees()
console.log('Total platform fees:', ethers.formatEther(totalFees), 'ETH')

if (totalFees > 0n) {
  await web3Service.paymentProcessor.withdrawPlatformFees()
  console.log('Platform fees withdrawn')
}
```

## Complete Workflow Example

### Patient Enrolls in Research Study

```typescript
// 1. Patient creates DID (if not exists)
const userAddress = '0xPatientAddress'
const hasDID = await web3Service.didRegistry.didExists(userAddress)

let userDID: string
if (!hasDID) {
  const { did } = await web3Service.didRegistry.createDID('QmProfileHash...')
  userDID = did
} else {
  userDID = await web3Service.didRegistry.getDID(userAddress)
}

// 2. Patient uploads required documents
const { documentId: labResultId } = await web3Service.didRegistry.addDocument(
  'QmLabResult...',
  'LAB_RESULT',
  'AES-256-CBC'
)

const { documentId: imagingId } = await web3Service.didRegistry.addDocument(
  'QmImaging...',
  'IMAGING',
  'AES-256-CBC'
)

// 3. Patient browses studies
const studyIds = await web3Service.marketplace.getActiveStudies()
const study = await web3Service.marketplace.getStudy(studyIds[0])

console.log('Found study:', study.title)
console.log('Payment:', ethers.formatEther(study.paymentPerUser), 'ETH')

// 4. Patient applies to study
const { leaseId } = await web3Service.marketplace.applyToStudy(
  study.studyId,
  userDID,
  [labResultId, imagingId]
)

console.log('Application submitted, lease ID:', leaseId.toString())

// 5. Researcher activates lease
const { accessToken } = await web3Service.dataLease.activateLease(
  leaseId,
  [labResultId, imagingId]
)

console.log('Lease activated, access token:', accessToken)

// 6. After study completion, release payment
await web3Service.marketplace.releasePaymentAfterAccess(leaseId)

console.log('Payment released to participant!')
```

### Emergency Response Workflow

```typescript
// 1. QR code scanned at emergency scene
const qrPayload = scanQRCode() // Contains patient DID

// 2. Grant emergency access
const { grantId } = await web3Service.emergencyAccess.grantAccess(
  qrPayload.patientDID,
  responderWallet,
  'Dr. Emergency Smith',
  'MD #12345',
  BigInt(3600), // 1 hour
  2, // CRITICAL access level
  'Ambulance en route to St. Mary ER'
)

// 3. Access patient emergency data
const grant = await web3Service.emergencyAccess.getGrant(grantId)
const patientAddress = await web3Service.didRegistry.getAddressByDID(grant.patientDID)
const emergencyDocs = await web3Service.didRegistry.getDocumentsMetadata(patientAddress)

// Filter for emergency categories
const emergencyData = emergencyDocs.categories
  .map((cat, i) => ({ category: cat, id: emergencyDocs.documentIds[i] }))
  .filter(doc => ['ALLERGIES', 'CURRENT_MEDICATIONS', 'BLOOD_TYPE'].includes(doc.category))

console.log('Emergency data available:', emergencyData)

// 4. After emergency, revoke access
await web3Service.emergencyAccess.revokeAccess(
  grantId,
  'Patient transferred to hospital care'
)
```

## Utility Examples

### Working with BigInt

```typescript
import { BlockchainUtils } from '../core/blockchain'

// Convert for JSON
const studyIdString = BlockchainUtils.bigIntToString(studyId)

// Convert from JSON
const leaseId = BlockchainUtils.stringToBigInt('123456')

// Array conversions
const documentIds = [BigInt(1), BigInt(2), BigInt(3)]
const stringIds = BlockchainUtils.bigIntArrayToStringArray(documentIds)
```

### Formatting Ether

```typescript
import { BlockchainUtils } from '../core/blockchain'

const payment = BigInt('1500000000000000000') // 1.5 ETH in wei

// Format with custom decimals
const formatted = BlockchainUtils.formatEtherWithDecimals(payment, 2)
console.log('Payment:', formatted, 'ETH') // "1.50 ETH"

// Convert ether to wei
const wei = BlockchainUtils.etherToWei('1.5')
```

### Timestamp Handling

```typescript
import { BlockchainUtils } from '../core/blockchain'

// Convert blockchain timestamp to Date
const expiryDate = BlockchainUtils.timestampToDate(lease.endTime)
console.log('Lease expires:', expiryDate.toLocaleString())

// Check if expired
const expired = BlockchainUtils.isExpired(lease.endTime)
console.log('Expired:', expired)

// Get current blockchain timestamp
const now = BlockchainUtils.getCurrentTimestamp()
```

### Address Comparisons

```typescript
import { BlockchainUtils } from '../core/blockchain'

const addr1 = '0xabc...'
const addr2 = '0xABC...' // Same address, different case

if (BlockchainUtils.isSameAddress(addr1, addr2)) {
  console.log('Same address')
}
```

### Error Handling

```typescript
import { BlockchainUtils } from '../core/blockchain'

try {
  await web3Service.marketplace.createStudy(...)
} catch (error) {
  const reason = BlockchainUtils.parseRevertReason(error)
  console.error('Transaction failed:', reason)
  
  if (BlockchainUtils.isInsufficientFundsError(error)) {
    console.error('Not enough funds to complete transaction')
  }
  
  if (BlockchainUtils.isUserRejectedError(error)) {
    console.log('User rejected the transaction')
  }
}
```

## Advanced Examples

### Batch Operations

```typescript
// Get all user data in parallel
const [did, documentCount, leases, studies] = await Promise.all([
  web3Service.didRegistry.getDID(userAddress),
  web3Service.didRegistry.getDocumentCount(userAddress),
  web3Service.dataLease.getUserLeases(userDID),
  web3Service.marketplace.getUserStudies(userDID)
])

console.log('User summary:', { did, documentCount, leases: leases.length, studies: studies.length })
```

### Transaction Monitoring

```typescript
const { studyId, receipt } = await web3Service.marketplace.createStudy(...)

console.log('Transaction details:')
console.log('  Hash:', receipt.hash)
console.log('  Block:', receipt.blockNumber)
console.log('  Gas used:', receipt.gasUsed.toString())
console.log('  Status:', receipt.status === 1 ? 'Success' : 'Failed')
```

### Complete Study Lifecycle

```typescript
// 1. Researcher creates study
const { studyId } = await web3Service.marketplace.createStudy(
  'Sleep Quality Study',
  'QmMetadata...',
  'QmIRB...',
  BigInt(50), // 50 participants
  ethers.parseEther('5'),
  BigInt(5184000), // 60 days
  ['LAB_RESULT', 'MEDICAL_HISTORY'],
  ethers.parseEther('250') // 50 × 5 ETH
)

// 2. Multiple patients apply
const applications = await Promise.all([
  web3Service.marketplace.applyToStudy(studyId, 'did:patient1', [docId1, docId2]),
  web3Service.marketplace.applyToStudy(studyId, 'did:patient2', [docId3, docId4]),
  // ... more applications
])

console.log('Received', applications.length, 'applications')

// 3. Get study progress
const study = await web3Service.marketplace.getStudy(studyId)
const progress = Number(study.participantsEnrolled) / Number(study.participantsNeeded) * 100
console.log('Study progress:', progress.toFixed(1), '%')

// 4. Pause study if needed
if (needsToPause) {
  await web3Service.marketplace.pauseStudy(studyId)
  console.log('Study paused')
}

// 5. Resume study
await web3Service.marketplace.resumeStudy(studyId)
console.log('Study resumed')

// 6. Close study when complete
await web3Service.marketplace.closeStudy(studyId)
console.log('Study closed')
```

### Emergency Access with Logging

```typescript
// 1. Grant access
const { grantId } = await web3Service.emergencyAccess.grantAccess(
  patientDID,
  responderAddress,
  responderName,
  responderCredential,
  BigInt(7200), // 2 hours
  1, // FULL access
  emergencyLocation
)

// 2. Check access is valid
const isValid = await web3Service.emergencyAccess.checkAccess(grantId)
console.log('Access valid:', isValid)

// 3. Get grant details
const grant = await web3Service.emergencyAccess.getGrant(grantId)
console.log('Access expires:', new Date(Number(grant.expiresAt) * 1000))

// 4. Later - check access logs
const logs = await web3Service.emergencyAccess.getAccessLogs(grantId)
console.log('Data was accessed', logs.length, 'times')

logs.forEach((log, i) => {
  console.log(`Access ${i + 1}:`)
  console.log('  Time:', new Date(Number(log.accessTime) * 1000))
  console.log('  Data:', log.dataAccessed)
  console.log('  Proof:', log.ipfsProof)
})
```

## Testing Examples

### Mock Services for Unit Tests

```typescript
import { DIDRegistryService } from '../blockchain'

// Mock the service
jest.mock('../blockchain/did-registry-service')

const mockDIDRegistry = {
  createDID: jest.fn().mockResolvedValue({
    did: 'did:healthlease:test123',
    receipt: { hash: '0x...', blockNumber: 12345 }
  }),
  getDID: jest.fn().mockResolvedValue('did:healthlease:test123')
}

// Use in tests
const { did } = await mockDIDRegistry.createDID('hash')
expect(did).toBe('did:healthlease:test123')
```

### Integration Tests

```typescript
describe('Blockchain Integration', () => {
  it('should create DID and add document', async () => {
    // Create DID
    const { did } = await web3Service.didRegistry.createDID('QmProfile...')
    expect(did).toMatch(/^did:healthlease:/)
    
    // Add document
    const { documentId } = await web3Service.didRegistry.addDocument(
      'QmDoc...',
      'LAB_RESULT',
      'AES-256-CBC'
    )
    expect(documentId).toBeGreaterThan(0n)
    
    // Verify document
    const { exists, isActive } = await web3Service.didRegistry.validateDocument(
      userAddress,
      documentId
    )
    expect(exists).toBe(true)
    expect(isActive).toBe(true)
  })
})
```

## Best Practices

### Always Use Try-Catch

```typescript
try {
  const result = await web3Service.marketplace.createStudy(...)
} catch (error) {
  console.error('Failed to create study:', error.message)
  // Handle error appropriately
}
```

### Check Status Before Operations

```typescript
const isActive = await web3Service.dataLease.isLeaseActive(leaseId)
if (!isActive) {
  throw new Error('Cannot perform operation on inactive lease')
}

await web3Service.dataLease.releasePayment(leaseId)
```

### Use Proper Types

```typescript
import type { StudyStruct, LeaseStruct } from '../core/blockchain'

const study: StudyStruct = await web3Service.marketplace.getStudy(id)
const lease: LeaseStruct = await web3Service.dataLease.getLease(id)
```

### Format BigInt for Display

```typescript
const payment = lease.paymentAmount
console.log('Payment:', web3Service.formatEther(payment), 'ETH')
// Not: payment.toString() (shows wei, hard to read)
```

## Performance Tips

### Parallel Queries

```typescript
// Good: Run in parallel
const [study, participants, leases] = await Promise.all([
  web3Service.marketplace.getStudy(studyId),
  web3Service.marketplace.getStudyParticipants(studyId),
  web3Service.dataLease.getStudyLeases(studyId)
])

// Avoid: Sequential (slower)
const study = await web3Service.marketplace.getStudy(studyId)
const participants = await web3Service.marketplace.getStudyParticipants(studyId)
const leases = await web3Service.dataLease.getStudyLeases(studyId)
```

### Cache Contract Addresses

```typescript
// The service caches addresses, but you can too
const signerAddress = web3Service.getSignerAddress() // No async, very fast
```

## Debugging

### Check Network Connection

```typescript
const healthy = await web3Service.healthCheck()
if (!healthy) {
  console.error('Web3 service is not healthy')
  
  // Get more details
  try {
    const network = await web3Service.getNetworkInfo()
    console.log('Network:', network)
  } catch (error) {
    console.error('Cannot connect to network:', error.message)
  }
}
```

### Inspect Transactions

```typescript
const { receipt } = await web3Service.didRegistry.createDID(...)

console.log('Transaction:', {
  hash: receipt.hash,
  blockNumber: receipt.blockNumber,
  gasUsed: receipt.gasUsed.toString(),
  status: receipt.status,
  from: receipt.from,
  to: receipt.to
})
```
