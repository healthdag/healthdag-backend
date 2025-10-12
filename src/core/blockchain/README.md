# Blockchain Services

This folder contains all blockchain interaction services for the HealthLease Hub platform.

## Architecture

The blockchain layer follows a **separation of concerns** pattern:

```
blockchain/
├── did-registry-service.ts      # DID Registry contract interactions
├── data-lease-service.ts        # Data Lease contract interactions
├── emergency-access-service.ts  # Emergency Access contract interactions
├── marketplace-service.ts       # Marketplace contract interactions
├── payment-processor-service.ts # Payment Processor contract interactions
├── deployment-config.ts         # Deployment configuration loader
├── types.ts                     # Common blockchain types
├── index.ts                     # Public exports
└── README.md                    # This file
```

## Service Responsibilities

### DIDRegistryService

- Create and manage Decentralized Identifiers (DIDs)
- Add/revoke documents
- Validate documents and DIDs
- Get user document metadata

### DataLeaseService

- Create and manage data leases
- Activate leases with document access
- Revoke leases
- Get lease information and status
- Handle access tokens

### EmergencyAccessService

- Grant emergency access to patient data
- Revoke emergency access
- Verify responder access
- Get access logs
- Handle emergency tokens

### MarketplaceService

- Create and manage research studies
- Apply to studies
- Get study information
- Manage study lifecycle (pause/resume/close)
- Handle study payments

### PaymentProcessorService

- Manage escrow deposits
- Release payments
- Handle refunds
- Manage platform fees
- Update platform wallet

## Usage

All blockchain services are integrated through the main `Web3Service` singleton:

```typescript
import { web3Service } from '../services/web3-service'

// Access individual services
const didService = web3Service.didRegistry
const leaseService = web3Service.dataLease
const emergencyService = web3Service.emergencyAccess
const marketplaceService = web3Service.marketplace
const paymentService = web3Service.paymentProcessor

// Example: Create a DID
const result = await didService.createDID('ipfs-hash')
console.log('Created DID:', result.did)

// Example: Get active studies
const studyIds = await marketplaceService.getActiveStudies()
```

## Configuration

Contract addresses can be configured in two ways:

1. **Environment Variables** (Recommended):

   ```env
   DID_REGISTRY_ADDRESS=0x...
   DATA_LEASE_ADDRESS=0x...
   EMERGENCY_ACCESS_ADDRESS=0x...
   MARKETPLACE_ADDRESS=0x...
   PAYMENT_PROCESSOR_ADDRESS=0x...
   ```

2. **Deployment Files** (Fallback):
   - Deployment configurations are stored in `src/deployments/`
   - Format: `{network}-{timestamp}.json`
   - Example: `awakening-1760199608091.json`

## Contract ABIs and Bytecodes

- **ABIs**: `src/exports/abis.json`
- **Bytecodes**: `src/exports/bytecodes.json`
- **TypeScript Exports**: `src/exports/contracts.ts`

## Design Principles

1. **Single Responsibility**: Each service handles only one contract
2. **Type Safety**: All methods use TypeScript types and interfaces
3. **Error Handling**: Comprehensive error messages for debugging
4. **Event Parsing**: Built-in event parsing for transaction receipts
5. **No Direct Ethers Imports**: Only this layer imports ethers.js directly

## Adding New Contract Methods

To add a new contract method:

1. Add the method to the appropriate service class
2. Use the `_parseEvent` helper for transaction receipts
3. Handle errors with descriptive messages
4. Export any new types in `types.ts`
5. Document the method with JSDoc comments

## Testing

Test blockchain services with:

```bash
# Run tests
bun test blockchain

# Health check
const healthy = await web3Service.healthCheck()
```

## Notes

- All services use the same provider and signer from `Web3Service`
- BigInt is used for blockchain numbers (gas, amounts, IDs)
- Addresses are validated and normalized using ethers.js utilities
- Transaction receipts are awaited and validated before returning
