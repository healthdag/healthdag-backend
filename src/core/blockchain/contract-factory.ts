// * Contract Factory for creating contract instances
import { ethers } from 'ethers'
import { ContractABIs, ContractBytecodes } from '../../exports/contracts'
import type { ContractName } from '../../exports/contracts'

/**
 * Create a contract instance
 * @param contractName - Name of the contract
 * @param address - Contract address
 * @param signerOrProvider - Signer or provider
 * @returns Contract instance
 */
export function createContract(
  contractName: ContractName,
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract {
  const abi = ContractABIs[contractName]
  return new ethers.Contract(address, abi, signerOrProvider)
}

/**
 * Deploy a new contract
 * @param contractName - Name of the contract to deploy
 * @param signer - Signer for deployment
 * @param constructorArgs - Constructor arguments
 * @returns Deployed contract instance
 */
export async function deployContract(
  contractName: ContractName,
  signer: ethers.Signer,
  constructorArgs: any[] = []
): Promise<ethers.BaseContract> {
  try {
    const abi = ContractABIs[contractName]
    const bytecode = ContractBytecodes[contractName]
    
    const factory = new ethers.ContractFactory(abi, bytecode, signer)
    const contract = await factory.deploy(...constructorArgs)
    await contract.waitForDeployment()
    
    return contract
  } catch (error) {
    throw new Error(`Failed to deploy ${contractName}: ${error}`)
  }
}

/**
 * Get contract interface
 * @param contractName - Name of the contract
 * @returns Contract interface
 */
export function getContractInterface(contractName: ContractName): ethers.Interface {
  const abi = ContractABIs[contractName]
  return new ethers.Interface(abi)
}

/**
 * Encode function call
 * @param contractName - Name of the contract
 * @param functionName - Function name
 * @param args - Function arguments
 * @returns Encoded function call data
 */
export function encodeFunctionCall(
  contractName: ContractName,
  functionName: string,
  args: any[]
): string {
  const contractInterface = getContractInterface(contractName)
  return contractInterface.encodeFunctionData(functionName, args)
}

/**
 * Decode function result
 * @param contractName - Name of the contract
 * @param functionName - Function name
 * @param data - Encoded result data
 * @returns Decoded result
 */
export function decodeFunctionResult(
  contractName: ContractName,
  functionName: string,
  data: string
): ethers.Result {
  const contractInterface = getContractInterface(contractName)
  return contractInterface.decodeFunctionResult(functionName, data)
}

/**
 * Parse transaction logs
 * @param contractName - Name of the contract
 * @param logs - Transaction logs
 * @returns Parsed logs
 */
export function parseTransactionLogs(
  contractName: ContractName,
  logs: ethers.Log[]
): ethers.LogDescription[] {
  const contractInterface = getContractInterface(contractName)
  const parsedLogs: ethers.LogDescription[] = []
  
  for (const log of logs) {
    try {
      const parsed = contractInterface.parseLog(log)
      if (parsed) {
        parsedLogs.push(parsed)
      }
    } catch {
      // Skip logs that don't match this contract's interface
      continue
    }
  }
  
  return parsedLogs
}

