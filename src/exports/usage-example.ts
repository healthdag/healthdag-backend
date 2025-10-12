// HealthDAG Contracts - Usage Example
// 
// How to interact with deployed contracts using ethers.js

import { ethers } from 'ethers';
import { ContractABIs, ContractAddresses } from './contracts';

// Setup provider and signer
const provider = new ethers.JsonRpcProvider('https://rpc.awakening.bdagscan.com', 1043);
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Create contract instances
const didRegistry = new ethers.Contract(
  ContractAddresses.DataLease, // * Using DataLease as placeholder for DID registry
  ContractABIs.DIDRegistry,
  signer
);

const marketplace = new ethers.Contract(
  ContractAddresses.Marketplace,
  ContractABIs.Marketplace,
  signer
);

const dataLease = new ethers.Contract(
  ContractAddresses.DataLease,
  ContractABIs.DataLease,
  signer
);

const emergencyAccess = new ethers.Contract(
  ContractAddresses.EmergencyAccess,
  ContractABIs.EmergencyAccess,
  signer
);

const paymentProcessor = new ethers.Contract(
  ContractAddresses.PaymentProcessor,
  ContractABIs.PaymentProcessor,
  signer
);

// Example: Create a DID
async function createDID() {
  const tx = await didRegistry.createDID("QmYourIPFSHash...");
  const receipt = await tx.wait();
  console.log("DID created:", receipt.hash);
  
  const did = await didRegistry.getDID(signer.address);
  console.log("Your DID:", did);
}

// Example: Create a research study
async function createStudy() {
  const tx = await marketplace.createStudy(
    "Cancer Research Study",
    "QmMetadataHash...",
    "QmIRBApprovalHash...",
    100,  // participants needed
    ethers.parseEther("10"),  // payment per user (10 BDAG)
    90 * 24 * 60 * 60,  // 90 days
    ["LAB_RESULT", "IMAGING"],
    { value: ethers.parseEther("1000") }  // total escrow
  );
  const receipt = await tx.wait();
  console.log("Study created:", receipt.hash);
}

// Example: Apply to a study
async function applyToStudy(studyId: number, userDID: string) {
  const tx = await marketplace.applyToStudy(studyId, userDID);
  const receipt = await tx.wait();
  console.log("Applied to study:", receipt.hash);
}

// Example: Listen to events
marketplace.on("StudyCreated", (studyId, researcher, title, payment, participants) => {
  console.log("New study created:", {
    studyId: studyId.toString(),
    researcher,
    title,
    payment: ethers.formatEther(payment),
    participants: participants.toString()
  });
});

// Export for use
export {
  didRegistry,
  marketplace,
  dataLease,
  emergencyAccess,
  paymentProcessor
};
