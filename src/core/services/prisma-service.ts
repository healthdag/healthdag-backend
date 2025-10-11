import { PrismaClient } from '@prisma/client'

// * Singleton Prisma client instance
class PrismaService {
  private static instance: PrismaService
  public prisma: PrismaClient

  private constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    })
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService()
    }
    return PrismaService.instance
  }

  public async connect(): Promise<void> {
    await this.prisma.$connect()
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }
}

// * Export singleton instance
export const prismaService = PrismaService.getInstance()
export default prismaService
