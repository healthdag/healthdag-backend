// * Emergency routes for HealthLease application
import { Hono } from 'hono'
import { createApiResponse, createErrorResponse } from '../../core/services/response-factory'
import { GenerateQrSchema, RequestAccessSchema } from '../../core/types/api-schemas'
import { createEmergencyController } from './emergency-controller'
import EmergencyService from './emergency-service'
import { prismaService } from '../../core/services/prisma-service'
import { web3Service } from '../../core/services/web3-service'
import { ipfsService } from '../../core/services/ipfs-service'
import { requireAuth } from '../../core/middleware/auth-middleware'

// ====================================================================================
// SERVICE INSTANTIATION
// ====================================================================================

const emergencyService = new EmergencyService(prismaService.prisma, web3Service, ipfsService)
const emergencyController = createEmergencyController(emergencyService)

// ====================================================================================
// ROUTE DEFINITIONS
// ====================================================================================

const app = new Hono()

// === GENERATE QR CODE ===
app.post('/qr', requireAuth, async (c) => {
  return await emergencyController.generateQrPayload(c)
})

// === REQUEST EMERGENCY ACCESS ===
app.post('/access', async (c) => {
  return await emergencyController.grantAndRetrieveData(c)
})

// ====================================================================================
// EXPORTS
// ====================================================================================

export default app
