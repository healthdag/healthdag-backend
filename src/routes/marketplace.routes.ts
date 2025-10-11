// * Marketplace routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { StudyResponseSchema } from '../core/types/api-responses'

const app = new OpenAPIHono()

// === GET STUDIES ===
const getStudiesRoute = createRoute({
  method: 'get',
  path: '/studies',
  tags: ['Marketplace'],
  summary: 'Browse research studies',
  description: 'Browses and filters all active research studies',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Studies retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(StudyResponseSchema),
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

app.openapi(getStudiesRoute, async (c) => {
  try {
    // TODO: Implement actual studies retrieval logic
    // const studies = await marketplaceService.getActiveStudies()
    
    // Mock response for now
    const response = createApiResponse('GET /api/marketplace/studies', 200, [
      {
        id: 'study_123',
        onChainId: '987654321',
        title: 'Cardiovascular Health Study',
        description: 'A comprehensive study on cardiovascular health patterns and risk factors.',
        researcherAddress: '0x9876...5432',
        paymentPerUser: '100.00',
        participantsNeeded: 100,
        participantsEnrolled: 45,
        status: 'Active',
      },
      {
        id: 'study_456',
        onChainId: '123456789',
        title: 'Diabetes Management Research',
        description: 'Research on effective diabetes management strategies and outcomes.',
        researcherAddress: '0x5432...9876',
        paymentPerUser: '75.00',
        participantsNeeded: 50,
        participantsEnrolled: 30,
        status: 'Active',
      },
    ])
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/marketplace/studies', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === GET STUDY DETAILS ===
const getStudyRoute = createRoute({
  method: 'get',
  path: '/studies/:id',
  tags: ['Marketplace'],
  summary: 'Get study details',
  description: 'Fetches detailed information for a single research study',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    200: {
      description: 'Study details retrieved successfully',
      content: {
        'application/json': {
          schema: StudyResponseSchema,
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

app.openapi(getStudyRoute, async (c) => {
  try {
    const { id } = c.req.valid('param')
    
    // TODO: Implement actual study retrieval logic
    // const study = await marketplaceService.getStudyById(id)
    
    // Mock response for now
    const response = createApiResponse('GET /api/marketplace/studies/:id', 200, {
      id: 'study_123',
      onChainId: '987654321',
      title: 'Cardiovascular Health Study',
      description: 'A comprehensive study on cardiovascular health patterns and risk factors. This study aims to understand the relationship between lifestyle factors and cardiovascular health outcomes.',
      researcherAddress: '0x9876...5432',
      paymentPerUser: '100.00',
      participantsNeeded: 100,
      participantsEnrolled: 45,
      status: 'Active',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'StudyNotFoundError') {
      const response = createErrorResponse('GET /api/marketplace/studies/:id', 404, 'Not Found', 'No study with this ID exists')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('GET /api/marketplace/studies/:id', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === APPLY TO STUDY ===
const applyToStudyRoute = createRoute({
  method: 'post',
  path: '/studies/:id/apply',
  tags: ['Marketplace'],
  summary: 'Apply to research study',
  description: 'Enrolls the user in a study, triggering the on-chain data lease and payment',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    202: {
      description: 'Application initiated',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string().cuid(),
            status: z.literal('PENDING'),
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
    409: {
      description: 'Conflict',
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

app.openapi(applyToStudyRoute, async (c) => {
  try {
    const { id } = c.req.valid('param')
    
    // TODO: Implement actual study application logic
    // const result = await marketplaceService.applyToStudy(c.get('user'), id)
    
    // Mock response for now
    const response = createApiResponse('POST /api/marketplace/studies/:id/apply', 202, {
      id: 'lease_123',
      status: 'PENDING',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'StudyNotFoundError') {
      const response = createErrorResponse('POST /api/marketplace/studies/:id/apply', 404, 'Not Found', 'No study with this ID exists')
      return c.json(response.payload, response.statusCode as any)
    }
    
    if (error.name === 'AlreadyAppliedError' || error.name === 'StudyFullError') {
      const response = createErrorResponse('POST /api/marketplace/studies/:id/apply', 409, 'Conflict', 'User has already applied, or the study is full')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/marketplace/studies/:id/apply', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === GET LEASE STATUS ===
const getLeaseStatusRoute = createRoute({
  method: 'get',
  path: '/leases/:id/status',
  tags: ['Marketplace'],
  summary: 'Get lease status',
  description: 'Retrieves the current status of a data lease',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().cuid(),
    }),
  },
  responses: {
    200: {
      description: 'Lease status retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']),
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

app.openapi(getLeaseStatusRoute, async (c) => {
  try {
    const { id } = c.req.valid('param')
    
    // TODO: Implement actual lease status retrieval logic
    // const status = await marketplaceService.getLeaseStatus(c.get('user'), id)
    
    // Mock response for now
    const response = createApiResponse('GET /api/marketplace/leases/:id/status', 200, {
      status: 'CONFIRMED',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'LeaseNotFoundError') {
      const response = createErrorResponse('GET /api/marketplace/leases/:id/status', 404, 'Not Found', 'No lease with this ID exists')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('GET /api/marketplace/leases/:id/status', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
