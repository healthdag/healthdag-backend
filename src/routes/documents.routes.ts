// * Document routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { DocumentSchema, UploadDocumentSchema } from '../core/types/api-schemas'

const app = new OpenAPIHono()

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
            status: z.literal('PENDING'),
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
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    
    if (!file || !category) {
      const response = createErrorResponse('POST /api/documents', 400, 'Bad Request', 'Missing file or category')
      return c.json(response.payload, response.statusCode as any)
    }
    
    // TODO: Implement actual document upload logic
    // const result = await documentService.uploadDocument(c.get('user'), file, category)
    
    // Mock response for now
    const response = createApiResponse('POST /api/documents', 202, {
      id: 'doc_123',
      status: 'PENDING',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('POST /api/documents', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
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
          schema: z.array(DocumentSchema),
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
  try {
    // TODO: Implement actual document retrieval logic
    // const documents = await documentService.getUserDocuments(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/documents', 200, [
      {
        id: 'doc_123',
        onChainId: '123456789',
        ipfsHash: 'QmHash123...',
        category: 'LAB_RESULT',
        isActive: true,
        creationStatus: 'CONFIRMED',
        uploadedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
      {
        id: 'doc_456',
        onChainId: '987654321',
        ipfsHash: 'QmHash456...',
        category: 'IMAGING',
        isActive: true,
        creationStatus: 'CONFIRMED',
        uploadedAt: new Date('2024-01-02T00:00:00.000Z'),
      },
    ])
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/documents', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
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
            status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']),
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
  try {
    const { id } = c.req.valid('param')
    
    // TODO: Implement actual document status retrieval logic
    // const status = await documentService.getDocumentStatus(c.get('user'), id)
    
    // Mock response for now
    const response = createApiResponse('GET /api/documents/:id/status', 200, {
      status: 'CONFIRMED',
      ipfsHash: 'QmHash123...',
      onChainId: '123456789',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'DocumentNotFoundError') {
      const response = createErrorResponse('GET /api/documents/:id/status', 404, 'Not Found', 'No document with this ID belongs to the user')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('GET /api/documents/:id/status', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
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
  try {
    const { id } = c.req.valid('param')
    
    // TODO: Implement actual document deletion logic
    // await documentService.revokeDocument(c.get('user'), id)
    
    // Mock response for now
    const response = createApiResponse('DELETE /api/documents/:id', 200, {
      message: 'Document revoked successfully.',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'DocumentNotFoundError') {
      const response = createErrorResponse('DELETE /api/documents/:id', 404, 'Not Found', 'No document with this ID belongs to the user')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('DELETE /api/documents/:id', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
