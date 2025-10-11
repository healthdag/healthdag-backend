# HealthDAG Contract ABIs & Exports

This folder contains all the necessary files to interact with the deployed HealthDAG smart contracts.

---

## 📦 Available Files

| File                 | Description             | Use Case                                    |
| -------------------- | ----------------------- | ------------------------------------------- |
| **abis.json**        | All contract ABIs       | Required for ethers.js contract interaction |
| **bytecodes.json**   | All contract bytecodes  | For deployment or verification              |
| **contracts.ts**     | TypeScript exports      | Direct import in TypeScript projects        |
| **usage-example.ts** | Complete usage examples | Learn how to interact with contracts        |

---

## 🚀 Quick Start - Using the Contracts

### Method 1: Direct JSON Import

```javascript
import { ethers } from "ethers";
import abis from "./exports/abis.json";
import deployment from "./deployments/awakening-1760199608091.json";

// Setup
const provider = new ethers.JsonRpcProvider(
  "https://rpc.awakening.bdagscan.com",
  1043,
);
const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// Create contract instance
const didRegistry = new ethers.Contract(
  deployment.contracts.didRegistry,
  abis.DIDRegistry,
  signer,
);

// Call contract functions
const tx = await didRegistry.createDID("QmIPFSHash...");
await tx.wait();
```

### Method 2: TypeScript Import

```typescript
import { ethers } from "ethers";
import {
  ContractABIs,
  ContractAddresses,
  getContractInterface,
  getContractAddress,
} from "./exports/contracts";

// Setup
const provider = new ethers.JsonRpcProvider(
  "https://rpc.awakening.bdagscan.com",
  1043,
);
const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// Create contract instance
const marketplace = new ethers.Contract(
  getContractAddress("marketplace"),
  getContractInterface("Marketplace"),
  signer,
);

// Interact with contract
const activeStudies = await marketplace.getActiveStudies();
```

---

## 📋 Contract Addresses (Awakening Testnet)

```json
{
  "didRegistry": "0x599DA0AD70492beb6F41FB68371Df0048Ff4592f",
  "paymentProcessor": "0x5C335809FCBE036Ec5862F706da35c01825c1F3B",
  "dataLease": "0x05660dC688FaE10BeccBe7195f8F16041Ce6E8B4",
  "emergencyAccess": "0x2AB757f5E983A4abe3cc24eAFd213002a8Af0690",
  "marketplace": "0x1006Af1736348d7C60901F379A8D0172BFbF52d1"
}
```

---

## 🔧 Common Operations

### 1. Create a DID

```typescript
import { ethers } from "ethers";
import abis from "./exports/abis.json";

const didRegistry = new ethers.Contract(
  "0x599DA0AD70492beb6F41FB68371Df0048Ff4592f",
  abis.DIDRegistry,
  signer,
);

// Create DID with initial document
const tx = await didRegistry.createDID("QmInitialDocumentHash...");
const receipt = await tx.wait();

// Get your DID
const myDID = await didRegistry.getDID(signer.address);
console.log("My DID:", myDID);
```

### 2. Add a Medical Document

```typescript
const tx = await didRegistry.addDocument(
  "QmDocumentHash...",
  "LAB_RESULT",
  "AES-256-CBC",
);
await tx.wait();
```

### 3. Create a Research Study

```typescript
const marketplace = new ethers.Contract(
  "0x1006Af1736348d7C60901F379A8D0172BFbF52d1",
  abis.Marketplace,
  signer,
);

const tx = await marketplace.createStudy(
  "Cancer Research Study",
  "QmMetadataHash...",
  "QmIRBApprovalHash...",
  100, // participants needed
  ethers.parseEther("10"), // 10 BDAG per participant
  90 * 24 * 60 * 60, // 90 days
  ["LAB_RESULT", "IMAGING"],
  { value: ethers.parseEther("1000") }, // total escrow (100 * 10 BDAG)
);
await tx.wait();
```

### 4. Apply to a Study

```typescript
const myDID = await didRegistry.getDID(signer.address);
const tx = await marketplace.applyToStudy(0, myDID); // Study ID 0
await tx.wait();
```

### 5. Listen to Events

```typescript
// Listen for new studies
marketplace.on(
  "StudyCreated",
  (studyId, researcher, title, payment, participants) => {
    console.log("New study:", {
      id: studyId.toString(),
      title,
      payment: ethers.formatEther(payment) + " BDAG",
      participants: participants.toString(),
    });
  },
);

// Listen for DIDs created
didRegistry.on("DIDCreated", (owner, did, timestamp) => {
  console.log("New DID created:", did);
});
```

---

## 📖 Full Usage Example

See **[usage-example.ts](usage-example.ts)** for a complete, production-ready example.

---

## 🔄 Updating After Redeployment

If you redeploy contracts:

```bash
# 1. Deploy contracts
npm run deploy

# 2. Re-export ABIs and addresses
npm run export:abis

# 3. Update your frontend imports
```

---

## 🌐 Network Configuration

```typescript
const networkConfig = {
  name: "Awakening Testnet",
  rpcUrl: "https://rpc.awakening.bdagscan.com",
  chainId: 1043,
  explorer: "https://awakening.bdagscan.com",
  currency: "BDAG",
};
```

---

## 📚 ABI Structure

Each contract ABI includes:

- **Functions**: All public/external functions
- **Events**: All contract events
- **Constructor**: Constructor parameters
- **State Variables**: Public state variables

Example ABI structure:

```json
{
  "DIDRegistry": [
    {
      "type": "function",
      "name": "createDID",
      "inputs": [{ "name": "initialDocumentHash", "type": "string" }],
      "outputs": [{ "name": "", "type": "string" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "DIDCreated",
      "inputs": [
        { "name": "owner", "type": "address", "indexed": true },
        { "name": "did", "type": "string", "indexed": false },
        { "name": "timestamp", "type": "uint256", "indexed": false }
      ]
    },
    ...
  ]
}
```

---

## 🔗 Useful Links

- **Explorer**: https://awakening.bdagscan.com
- **Your Contracts**: Check deployments/ folder
- **Documentation**: See docs/ folder
- **Usage Example**: exports/usage-example.ts

---

**Generated**: ${new Date().toISOString()}  
**Network**: BlockDAG Awakening Testnet (Chain ID: 1043)
