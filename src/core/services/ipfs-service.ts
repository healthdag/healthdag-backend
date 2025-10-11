import PinataSDK from '@pinata/sdk'

// * Singleton IPFS service using Pinata
class IpfsService {
  private static instance: IpfsService
  private pinata: PinataSDK

  private constructor() {
    const apiKey = process.env.PINATA_API_KEY
    const secretKey = process.env.PINATA_SECRET_KEY

    if (!apiKey || !secretKey) {
      throw new Error('Pinata API credentials not found in environment variables')
    }

    this.pinata = new PinataSDK({
      pinataApiKey: apiKey,
      pinataSecretApiKey: secretKey,
    })
  }

  public static getInstance(): IpfsService {
    if (!IpfsService.instance) {
      IpfsService.instance = new IpfsService()
    }
    return IpfsService.instance
  }

  /**
   * Upload data to IPFS via Pinata
   * @param data - Buffer or string data to upload
   * @param fileName - Optional filename for the upload
   * @returns IPFS hash
   */
  public async uploadToIpfs(data: Buffer | string, fileName?: string): Promise<string> {
    try {
      const uploadOptions = {
        pinataMetadata: {
          name: fileName || `healthlease-${Date.now()}`,
        },
        pinataOptions: {
          cidVersion: 0 as const,
        },
      }

      const result = await this.pinata.pinFileToIPFS(data, uploadOptions)
      return result.IpfsHash
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
   * Get IPFS URL for a given hash
   * @param hash - IPFS hash
   * @returns Full IPFS URL
   */
  public getIpfsUrl(hash: string): string {
    const gatewayUrl = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/'
    return `${gatewayUrl}${hash}`
  }

  /**
   * Pin a file by its IPFS hash
   * @param hash - IPFS hash to pin
   * @returns Pin result
   */
  public async pinByHash(hash: string): Promise<any> {
    try {
      return await this.pinata.pinByHash(hash)
    } catch (error) {
      console.error('Pin by hash failed:', error)
      throw new Error(`Failed to pin hash: ${error}`)
    }
  }

  /**
   * Get pinned files list
   * @param limit - Number of files to retrieve
   * @returns List of pinned files
   */
  public async getPinnedFiles(limit: number = 10): Promise<any[]> {
    try {
      const result = await this.pinata.pinList({
        pageLimit: limit,
        status: 'pinned',
      })
      return result.rows
    } catch (error) {
      console.error('Get pinned files failed:', error)
      throw new Error(`Failed to get pinned files: ${error}`)
    }
  }

  /**
   * Health check for IPFS service
   * @returns True if service is healthy
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.pinata.testAuthentication()
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
