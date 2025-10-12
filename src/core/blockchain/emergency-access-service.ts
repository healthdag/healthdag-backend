// * EmergencyAccess Contract Service
import { ethers } from 'ethers'

export interface EmergencyGrantStruct {
  grantId: bigint
  patientDID: string
  responder: string
  responderName: string
  responderCredential: string
  grantedAt: bigint
  expiresAt: bigint
  accessLevel: number
  isActive: boolean
  location: string
  reason: string
  wasRevoked: boolean
  revokedAt: bigint
  accessToken: string
  documentIds: bigint[]
}

export interface AccessLogStruct {
  grantId: bigint
  responder: string
  accessTime: bigint
  dataAccessed: string
  ipfsProof: string
}

export class EmergencyAccessService {
  private contract: ethers.Contract

  constructor(contract: ethers.Contract) {
    this.contract = contract
  }

  // ====================================================================================
  // READ METHODS
  // ====================================================================================

  /**
   * Get emergency grant by ID
   * @param grantId - Grant ID
   * @returns Emergency grant struct
   */
  async getGrant(grantId: bigint): Promise<EmergencyGrantStruct> {
    try {
      const grant = await this.contract.getGrant(grantId)
      return {
        grantId: grant.grantId,
        patientDID: grant.patientDID,
        responder: grant.responder,
        responderName: grant.responderName,
        responderCredential: grant.responderCredential,
        grantedAt: grant.grantedAt,
        expiresAt: grant.expiresAt,
        accessLevel: grant.accessLevel,
        isActive: grant.isActive,
        location: grant.location,
        reason: grant.reason,
        wasRevoked: grant.wasRevoked,
        revokedAt: grant.revokedAt,
        accessToken: grant.accessToken,
        documentIds: grant.documentIds
      }
    } catch (error) {
      throw new Error(`Failed to get grant: ${error}`)
    }
  }

  /**
   * Get all grants for a patient
   * @param patientDID - Patient's DID
   * @returns Array of grant IDs
   */
  async getPatientGrants(patientDID: string): Promise<bigint[]> {
    try {
      return await this.contract.getPatientGrants(patientDID)
    } catch (error) {
      throw new Error(`Failed to get patient grants: ${error}`)
    }
  }

  /**
   * Get active grants for a patient
   * @param patientDID - Patient's DID
   * @returns Array of active grant IDs
   */
  async getActiveGrants(patientDID: string): Promise<bigint[]> {
    try {
      return await this.contract.getActiveGrants(patientDID)
    } catch (error) {
      throw new Error(`Failed to get active grants: ${error}`)
    }
  }

  /**
   * Check if grant has access
   * @param grantId - Grant ID
   * @returns True if grant has access
   */
  async checkAccess(grantId: bigint): Promise<boolean> {
    try {
      return await this.contract.checkAccess(grantId)
    } catch (error) {
      throw new Error(`Failed to check access: ${error}`)
    }
  }

  /**
   * Verify responder access
   * @param patientDID - Patient's DID
   * @param responder - Responder address
   * @returns Access status and grant ID
   */
  async verifyResponderAccess(
    patientDID: string, 
    responder: string
  ): Promise<{ hasAccess: boolean; grantId: bigint }> {
    try {
      const result = await this.contract.verifyResponderAccess(patientDID, responder)
      return {
        hasAccess: result[0],
        grantId: result[1]
      }
    } catch (error) {
      throw new Error(`Failed to verify responder access: ${error}`)
    }
  }

  /**
   * Get access logs for a grant
   * @param grantId - Grant ID
   * @returns Array of access logs
   */
  async getAccessLogs(grantId: bigint): Promise<AccessLogStruct[]> {
    try {
      const logs = await this.contract.getAccessLogs(grantId)
      return logs.map((log: any) => ({
        grantId: log.grantId,
        responder: log.responder,
        accessTime: log.accessTime,
        dataAccessed: log.dataAccessed,
        ipfsProof: log.ipfsProof
      }))
    } catch (error) {
      throw new Error(`Failed to get access logs: ${error}`)
    }
  }

  /**
   * Get emergency token for a grant
   * @param grantId - Grant ID
   * @returns Emergency access token
   */
  async getEmergencyToken(grantId: bigint): Promise<string> {
    try {
      return await this.contract.getEmergencyToken(grantId)
    } catch (error) {
      throw new Error(`Failed to get emergency token: ${error}`)
    }
  }

  // ====================================================================================
  // WRITE METHODS
  // ====================================================================================

  /**
   * Grant emergency access
   * @param patientDID - Patient's DID
   * @param responder - Responder address
   * @param responderName - Responder name
   * @param responderCredential - Responder credential
   * @param duration - Access duration in seconds
   * @param accessLevel - Access level (0: BASIC, 1: FULL, 2: CRITICAL)
   * @param location - Location of emergency
   * @returns Grant ID
   */
  async grantAccess(
    patientDID: string,
    responder: string,
    responderName: string,
    responderCredential: string,
    duration: bigint,
    accessLevel: number,
    location: string
  ): Promise<{ grantId: bigint; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.grantAccess(
        patientDID,
        responder,
        responderName,
        responderCredential,
        duration,
        accessLevel,
        location
      )
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse AccessGranted event
      const grantEvent = this._parseEvent(receipt, 'AccessGranted')
      const grantId = grantEvent.args.grantId

      return { grantId, receipt }
    } catch (error) {
      throw new Error(`Failed to grant access: ${error}`)
    }
  }

  /**
   * Revoke emergency access
   * @param grantId - Grant ID
   * @param reason - Reason for revocation
   * @returns Transaction receipt
   */
  async revokeAccess(grantId: bigint, reason: string): Promise<ethers.TransactionReceipt> {
    try {
      const tx = await this.contract.revokeAccess(grantId, reason)
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      return receipt
    } catch (error) {
      throw new Error(`Failed to revoke access: ${error}`)
    }
  }

  /**
   * Emergency override (admin only)
   * @param patientDID - Patient's DID
   * @param responder - Responder address
   * @param duration - Access duration in seconds
   * @param justification - Justification for override
   * @returns Grant ID
   */
  async emergencyOverride(
    patientDID: string,
    responder: string,
    duration: bigint,
    justification: string
  ): Promise<{ grantId: bigint; receipt: ethers.TransactionReceipt }> {
    try {
      const tx = await this.contract.emergencyOverride(
        patientDID,
        responder,
        duration,
        justification
      )
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction receipt is null')
      }

      // Parse EmergencyOverride event
      const overrideEvent = this._parseEvent(receipt, 'EmergencyOverride')
      const grantId = overrideEvent.args.grantId

      return { grantId, receipt }
    } catch (error) {
      throw new Error(`Failed to perform emergency override: ${error}`)
    }
  }

  // ====================================================================================
  // PRIVATE METHODS
  // ====================================================================================

  /**
   * Parse event from transaction receipt
   * @param receipt - Transaction receipt
   * @param eventName - Name of the event to parse
   * @returns Parsed event log
   */
  private _parseEvent(receipt: ethers.TransactionReceipt, eventName: string): ethers.LogDescription {
    try {
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log)
          return parsed?.name === eventName
        } catch {
          return false
        }
      })

      if (!event) {
        throw new Error(`Event ${eventName} not found in transaction logs`)
      }

      const parsed = this.contract.interface.parseLog(event)
      if (!parsed) {
        throw new Error(`Failed to parse event ${eventName}`)
      }

      return parsed
    } catch (error) {
      throw new Error(`Failed to parse event ${eventName}: ${error}`)
    }
  }
}

