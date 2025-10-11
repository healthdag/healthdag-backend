// * Settings routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { UserSchema, UpdateUserSchema } from '../core/types/api-schemas'

const app = new OpenAPIHono()

// === GET SETTINGS ===
const getSettingsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Settings'],
  summary: 'Get user settings',
  description: 'Retrieves the user\'s current profile settings',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Settings retrieved successfully',
      content: {
        'application/json': {
          schema: UserSchema,
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

app.openapi(getSettingsRoute, async (c) => {
  try {
    // TODO: Implement actual settings retrieval logic
    // const user = await userService.getCurrentUser(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/settings', 200, {
      id: 'user_123',
      email: 'user@example.com',
      name: 'John Doe',
      walletAddress: '0x1234...5678',
      did: 'did:example:123456789',
      didCreationStatus: 'CONFIRMED',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-15T10:30:00.000Z'),
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/settings', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === UPDATE SETTINGS ===
const updateSettingsRoute = createRoute({
  method: 'put',
  path: '/',
  tags: ['Settings'],
  summary: 'Update user settings',
  description: 'Updates the user\'s profile settings',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Settings updated successfully',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
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

app.openapi(updateSettingsRoute, async (c) => {
  try {
    const body = c.req.valid('json')
    
    // TODO: Implement actual settings update logic
    // const updatedUser = await userService.updateUser(c.get('user'), body)
    
    // Mock response for now
    const response = createApiResponse('PUT /api/settings', 200, {
      id: 'user_123',
      email: 'user@example.com',
      name: body.name || 'John Doe',
      walletAddress: '0x1234...5678',
      did: 'did:example:123456789',
      didCreationStatus: 'CONFIRMED',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date(),
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const response = createErrorResponse('PUT /api/settings', 400, 'Validation Error', 'The request body is malformed')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('PUT /api/settings', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
