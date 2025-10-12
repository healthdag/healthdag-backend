import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { logError, logInfo, logSuccess } from '../utils/error-logger'

// * Singleton Prisma client instance
class PrismaService {
  private static instance: PrismaService
  public prisma: PrismaClient

  private constructor() {
    logInfo('PRISMA', 'Initializing Prisma client')
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    })
    logSuccess('PRISMA', 'Prisma client initialized successfully')
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      logInfo('PRISMA', 'Creating new PrismaService instance')
      PrismaService.instance = new PrismaService()
    }
    return PrismaService.instance
  }

  public async connect(): Promise<void> {
    try {
      logInfo('PRISMA', 'Connecting to database')
      await this.prisma.$connect()
      logSuccess('PRISMA', 'Database connection established')
    } catch (error) {
      logError('PRISMA', error, { operation: 'connect' })
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    try {
      logInfo('PRISMA', 'Disconnecting from database')
      await this.prisma.$disconnect()
      logSuccess('PRISMA', 'Database disconnected successfully')
    } catch (error) {
      logError('PRISMA', error, { operation: 'disconnect' })
      throw error
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      logInfo('PRISMA', 'Performing database health check')
      await this.prisma.$queryRaw`SELECT 1`
      logSuccess('PRISMA', 'Database health check passed')
      return true
    } catch (error) {
      logError('PRISMA', error, { operation: 'healthCheck' })
      return false
    }
  }
}

// * Export singleton instance
export const prismaService = PrismaService.getInstance()
export default prismaService
