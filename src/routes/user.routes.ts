// * User and wallet routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { UserResponseSchema, ConnectWalletSchema, UpdateUserSchema } from '../core/types/api-responses'

const app = new OpenAPIHono()

// === GET USER PROFILE ===
const getUserRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['User & Wallet'],
  summary: 'Get current user profile',
  description: 'Retrieves the profile of the currently authenticated user',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'User profile retrieved successfully',
      content: {
        'application/json': {
          schema: UserResponseSchema,
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

app.openapi(getUserRoute, async (c) => {
  try {
    // TODO: Implement actual user retrieval logic
    // const user = await userService.getCurrentUser(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/user/me', 200, {
      id: 'user_123',
      email: 'user@example.com',
      name: 'John Doe',
      walletAddress: '0x1234...5678',
      did: 'did:example:123456789',
      didCreationStatus: 'CONFIRMED',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/user/me', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === UPDATE USER PROFILE ===
const updateUserRoute = createRoute({
  method: 'put',
  path: '/me',
  tags: ['User & Wallet'],
  summary: 'Update user profile',
  description: 'Updates the user profile settings',
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
      description: 'User profile updated successfully',
      content: {
        'application/json': {
          schema: UserResponseSchema,
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

app.openapi(updateUserRoute, async (c) => {
  try {
    const body = c.req.valid('json')
    
    // TODO: Implement actual user update logic
    // const updatedUser = await userService.updateUser(c.get('user'), body)
    
    // Mock response for now
    const response = createApiResponse('PUT /api/user/me', 200, {
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
      const response = createErrorResponse('PUT /api/user/me', 400, 'Validation Error', 'The request body is malformed')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('PUT /api/user/me', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === CONNECT WALLET ===
const connectWalletRoute = createRoute({
  method: 'post',
  path: '/wallet/connect',
  tags: ['User & Wallet'],
  summary: 'Connect wallet to user account',
  description: 'Verifies wallet signature and links wallet address to user account',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ConnectWalletSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Wallet connected successfully',
      content: {
        'application/json': {
          schema: UserResponseSchema,
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

app.openapi(connectWalletRoute, async (c) => {
  try {
    const body = c.req.valid('json')
    
    // TODO: Implement actual wallet connection logic
    // const updatedUser = await walletService.connectWallet(c.get('user'), body)
    
    // Mock response for now
    const response = createApiResponse('POST /api/user/wallet/connect', 200, {
      id: 'user_123',
      email: 'user@example.com',
      name: 'John Doe',
      walletAddress: body.walletAddress,
      did: null,
      didCreationStatus: 'NONE',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date(),
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'InvalidSignatureError') {
      const response = createErrorResponse('POST /api/user/wallet/connect', 400, 'Bad Request', 'The signature is invalid or the address is malformed')
      return c.json(response.payload, response.statusCode as any)
    }
    
    if (error.name === 'WalletAlreadyLinkedError') {
      const response = createErrorResponse('POST /api/user/wallet/connect', 409, 'Conflict', 'This wallet is already linked to another account')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/user/wallet/connect', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === CREATE DID ===
const createDidRoute = createRoute({
  method: 'post',
  path: '/wallet/did',
  tags: ['User & Wallet'],
  summary: 'Create decentralized identity',
  description: 'Creates the user\'s Decentralized Identity (DID) on the blockchain',
  security: [{ bearerAuth: [] }],
  responses: {
    202: {
      description: 'DID creation initiated',
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

app.openapi(createDidRoute, async (c) => {
  try {
    // TODO: Implement actual DID creation logic
    // const result = await identityService.createDid(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('POST /api/user/wallet/did', 202, {
      id: 'did_123',
      status: 'PENDING',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'DidAlreadyExistsError') {
      const response = createErrorResponse('POST /api/user/wallet/did', 409, 'Conflict', 'User already has a DID, or wallet is not connected')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/user/wallet/did', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === GET DID STATUS ===
const getDidStatusRoute = createRoute({
  method: 'get',
  path: '/wallet/did/status',
  tags: ['User & Wallet'],
  summary: 'Get DID creation status',
  description: 'Retrieves the current status of DID creation',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'DID status retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['NONE', 'PENDING', 'CONFIRMED', 'FAILED']),
            did: z.string().nullable(),
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

app.openapi(getDidStatusRoute, async (c) => {
  try {
    // TODO: Implement actual DID status retrieval logic
    // const status = await identityService.getDidStatus(c.get('user'))
    
    // Mock response for now
    const response = createApiResponse('GET /api/user/wallet/did/status', 200, {
      status: 'CONFIRMED',
      did: 'did:example:123456789',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('GET /api/user/wallet/did/status', 401, 'Unauthorized', 'Missing or invalid JWT')
    return c.json(response.payload, response.statusCode as any)
  }
})

export default app
