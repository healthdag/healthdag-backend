import { PinataSDK } from 'pinata'

// * Singleton IPFS service using Pinata v2 SDK
class IpfsService {
  private static instance: IpfsService
  private pinata: PinataSDK

  private constructor() {
    const jwt = process.env.PINATA_JWT
    const gateway = process.env.PINATA_GATEWAY

    if (!jwt) {
      throw new Error('Pinata JWT not found in environment variables')
    }

    if (!gateway) {
      throw new Error('Pinata Gateway URL not found in environment variables')
    }

    this.pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway,
    })
  }

  public static getInstance(): IpfsService {
    if (!IpfsService.instance) {
      IpfsService.instance = new IpfsService()
    }
    return IpfsService.instance
  }

  /**
   * Upload data to IPFS via Pinata v2 SDK
   * @param data - Buffer or string data to upload
   * @param fileName - Optional filename for the upload
   * @returns IPFS hash (CID)
   */
  public async uploadToIpfs(data: Buffer | string, fileName?: string): Promise<string> {
    try {
      // * Convert Buffer/string to File object for v2 SDK
      let fileData: string | Uint8Array
      if (Buffer.isBuffer(data)) {
        fileData = new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength))
      } else {
        fileData = data
      }
      
      const file = new File([fileData], fileName || `healthlease-${Date.now()}`, {
        type: 'application/octet-stream'
      })

      const result = await this.pinata.upload.file(file)
      return result.cid
    } catch (error) {
      console.error('IPFS upload failed:', error)
      throw new Error(`Failed to upload to IPFS: ${error}`)
    }
  }

  /**
   * Upload encrypted data to IPFS
   * @param encryptedData - Encrypted buffer data
   * @param fileName - Optional filename
   * @returns IPFS hash
   */
  public async encryptAndUpload(encryptedData: Buffer, fileName?: string): Promise<string> {
    return this.uploadToIpfs(encryptedData, fileName)
  }

  /**
   * Get IPFS URL for a given hash using Pinata gateway
   * @param hash - IPFS hash (CID)
   * @returns Full IPFS URL
   */
  public async getIpfsUrl(hash: string): Promise<string> {
    try {
      // * Use gateways.get to fetch data and construct URL
      const gatewayUrl = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud'
      return `${gatewayUrl}/ipfs/${hash}`
    } catch (error) {
      console.error('Failed to construct IPFS URL:', error)
      // * Fallback to direct gateway URL construction
      const gatewayUrl = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud'
      return `${gatewayUrl}/ipfs/${hash}`
    }
  }

  /**
   * Pin a file by its IPFS hash using Pinata v2 SDK
   * @param hash - IPFS hash (CID) to pin
   * @returns Pin result
   */
  public async pinByHash(hash: string): Promise<any> {
    try {
      // * Note: Pinata v2 SDK handles pinning automatically on upload
      // * This method is kept for compatibility but may not be needed
      console.warn('pinByHash: Pinata v2 SDK handles pinning automatically on upload')
      return { hash, status: 'already_pinned' }
    } catch (error) {
      console.error('Pin by hash failed:', error)
      throw new Error(`Failed to pin hash: ${error}`)
    }
  }

  /**
   * Get pinned files list using Pinata v2 SDK
   * @param limit - Number of files to retrieve
   * @returns List of pinned files
   */
  public async getPinnedFiles(limit: number = 10): Promise<any[]> {
    try {
      const result = await this.pinata.files.list()
      // * Note: The actual filtering and pagination might need to be handled differently
      // * This is a simplified implementation based on the SDK structure
      return Array.isArray(result) ? result.slice(0, limit) : []
    } catch (error) {
      console.error('Get pinned files failed:', error)
      throw new Error(`Failed to get pinned files: ${error}`)
    }
  }

  /**
   * Health check for IPFS service using Pinata v2 SDK
   * @returns True if service is healthy
   */
  public async healthCheck(): Promise<boolean> {
    try {
      // * Test authentication by attempting to list files
      await this.pinata.files.list()
      return true
    } catch (error) {
      console.error('IPFS health check failed:', error)
      return false
    }
  }
}

// * Export singleton instance
export const ipfsService = IpfsService.getInstance()
export default ipfsService
