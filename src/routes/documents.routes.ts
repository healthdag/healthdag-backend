// * Document routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { DocumentResponseSchema } from '../core/types/api-responses'
import { UploadDocumentSchema, RecordCreationStatusEnum } from '../core/types/api-schemas'
import { DocumentsService } from '../features/documents/documents-service'
import { DocumentsController } from '../features/documents/documents-controller'
import { ipfsService } from '../core/services/ipfs-service'
import { requireAuth } from '../core/middleware/auth-middleware'

const app = new OpenAPIHono()

// * Initialize services
const prisma = new PrismaClient()
const documentsService = new DocumentsService(prisma, ipfsService as any)
const documentsController = new DocumentsController(documentsService)

// * Apply authentication middleware to all document routes
app.use('*', requireAuth)

// === UPLOAD DOCUMENT ===
const uploadDocumentRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Documents'],
  summary: 'Upload health document',
  description: 'Uploads, encrypts, and records a new health document',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File),
            category: z.enum(['LAB_RESULT', 'IMAGING', 'PRESCRIPTION', 'VISIT_NOTES']),
          }),
        },
      },
    },
  },
  responses: {
    202: {
      description: 'Document upload initiated',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string().cuid(),
            status: RecordCreationStatusEnum,
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(uploadDocumentRoute, async (c) => {
  return await documentsController.uploadDocument(c)
})

// === GET DOCUMENTS ===
const getDocumentsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Documents'],
  summary: 'List user documents',
  description: 'Lists metadata for all of the user\'s documents',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Documents retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(DocumentResponseSchema),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(getDocumentsRoute, async (c) => {
  return await documentsController.getDocuments(c)
})

// === GET DOCUMENT STATUS ===
const getDocumentStatusRoute = createRoute({
  method: 'get',
  path: '/:id/status',
  tags: ['Documents'],
  summary: 'Get document upload status',
  description: 'Retrieves the current status of a document upload',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    200: {
      description: 'Document status retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            status: RecordCreationStatusEnum,
            ipfsHash: z.string().nullable(),
            onChainId: z.string().nullable(),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(getDocumentStatusRoute, async (c) => {
  return await documentsController.getDocumentStatus(c)
})

// === DELETE DOCUMENT ===
const deleteDocumentRoute = createRoute({
  method: 'delete',
  path: '/:id',
  tags: ['Documents'],
  summary: 'Revoke document',
  description: 'Revokes a document\'s validity on the blockchain',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    200: {
      description: 'Document revoked successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.literal('Document revoked successfully.'),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            message: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(deleteDocumentRoute, async (c) => {
  return await documentsController.deleteDocument(c)
})

export default app
