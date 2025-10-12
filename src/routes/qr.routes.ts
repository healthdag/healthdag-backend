// * QR Code routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client'
import { QRService } from '../core/services/qr-service'
import { QRController } from '../features/qr/qr-controller'
import { requireAuth } from '../core/middleware/auth-middleware'

const app = new OpenAPIHono()

// * Initialize services
const prisma = new PrismaClient()
const qrService = new QRService(prisma)
const qrController = new QRController(qrService)

// * Apply authentication middleware to all QR routes except /access
app.use('*', async (c, next) => {
  if (c.req.path === '/access') {
    // Skip auth for public QR access endpoint
    return await next()
  }
  return await requireAuth(c, next)
})

// === GENERATE QR CODE ===
const generateQRCodeRoute = createRoute({
  method: 'post',
  path: '/generate',
  tags: ['QR Codes'],
  summary: 'Generate QR code for document sharing',
  description: 'Creates a QR code with JWT token for controlled document access',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            documentIds: z.array(z.string().cuid()).min(1, 'At least one document required'),
            expiresIn: z.number().int().min(1).max(168).optional().default(24), // Max 1 week
            accessType: z.enum(['EMERGENCY', 'SHARE']).default('SHARE'),
            requireName: z.boolean().optional().default(true),
            requireCredential: z.boolean().optional().default(true),
            requireLocation: z.boolean().optional().default(true)
          })
        }
      }
    }
  },
  responses: {
    201: {
      description: 'QR code generated successfully',
      content: {
        'application/json': {
          schema: z.object({
            qrPayload: z.string().describe('JWT token to encode in QR'),
            qrCodeId: z.string().cuid(),
            expiresAt: z.string().datetime()
          })
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional()
          })
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    }
  }
})

app.openapi(generateQRCodeRoute, async (c) => {
  return await qrController.generateQRCode(c)
})

// === GET MY QR CODES ===
const getMyQRCodesRoute = createRoute({
  method: 'get',
  path: '/my-codes',
  tags: ['QR Codes'],
  summary: 'List user QR codes',
  description: 'Retrieves all QR codes created by the authenticated user',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'QR codes retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(z.object({
            id: z.string().cuid(),
            accessType: z.string(),
            expiresAt: z.string().datetime(),
            isActive: z.boolean(),
            accessCount: z.number(),
            documentIds: z.array(z.string()),
            createdAt: z.string().datetime()
          }))
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    }
  }
})

app.openapi(getMyQRCodesRoute, async (c) => {
  return await qrController.getMyQRCodes(c)
})

// === REVOKE QR CODE ===
const revokeQRCodeRoute = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['QR Codes'],
  summary: 'Revoke QR code',
  description: 'Deactivates a QR code to prevent further access',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid()
    })
  },
  responses: {
    200: {
      description: 'QR code revoked successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.literal('QR code revoked successfully')
          })
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    }
  }
})

app.openapi(revokeQRCodeRoute, async (c) => {
  return await qrController.revokeQRCode(c)
})

// === REGENERATE QR CODE ===
const regenerateQRCodeRoute = createRoute({
  method: 'put',
  path: '/:id/regenerate',
  tags: ['QR Codes'],
  summary: 'Regenerate QR code',
  description: 'Creates a new QR code with the same configuration, revoking the old one',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid()
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            expiresIn: z.number().int().min(1).max(168).optional().default(24)
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'QR code regenerated successfully',
      content: {
        'application/json': {
          schema: z.object({
            qrPayload: z.string().describe('New JWT token'),
            qrCodeId: z.string().cuid(),
            expiresAt: z.string().datetime()
          })
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    }
  }
})

app.openapi(regenerateQRCodeRoute, async (c) => {
  return await qrController.regenerateQRCode(c)
})

// === PROCESS QR ACCESS (PUBLIC) ===
const processQRAccessRoute = createRoute({
  method: 'post',
  path: '/access',
  tags: ['QR Codes'],
  summary: 'Process QR code access',
  description: 'Validates QR code and returns patient data (public endpoint for scanning)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            qrPayload: z.string().describe('JWT token from scanned QR'),
            responderName: z.string().optional(),
            responderCredential: z.string().optional(),
            responderLocation: z.string().optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Access granted',
      content: {
        'application/json': {
          schema: z.object({
            patient: z.object({
              name: z.string().nullable(),
              email: z.string(),
              did: z.string().nullable()
            }),
            documents: z.array(z.object({
              id: z.string(),
              category: z.string(),
              uploadedAt: z.string(),
              ipfsHash: z.string().nullable()
            })),
            expiresAt: z.string()
          })
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string()
          })
        }
      }
    }
  }
})

app.openapi(processQRAccessRoute, async (c) => {
  return await qrController.processQRAccess(c)
})

export default app
