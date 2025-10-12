// * User and wallet routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client'
import { UserService } from '../core/services/user-service'
import { createUserController } from '../features/user/user-controller'
import { requireAuth } from '../core/middleware/auth-middleware'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { UserSchema } from '../core/types/api-schemas'
import { WalletConnectionRequestSchema, UserUpdateInputSchema } from '../core/types/auth-types'

// * Define the context variables interface
interface UserContextVariables {
  userId?: string
}

const app = new OpenAPIHono<{ Variables: UserContextVariables }>()

// * Initialize services
const prisma = new PrismaClient()
const userService = new UserService(prisma)
const userController = createUserController(userService)

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

app.openapi(getUserRoute, async (c) => {
  try {
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.replace('Bearer ', '') || ''

    if (!token) {
      return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401)
    }

    // Verify token (simplified for now)
    // TODO: Implement proper JWT verification
    
    // Set user ID in context (mock for now)
    c.set('userId', 'mock-user-id')
    
    const response = await userController.getCurrentUser(c)
    const data = await response.json()
    return c.json(data, response.status as any) as any
  } catch (error) {
    return c.json({ error: 'Unauthorized', message: 'Authentication failed' }, 401)
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
          schema: UserUpdateInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User profile updated successfully',
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

app.openapi(updateUserRoute, async (c) => {
  try {
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.replace('Bearer ', '') || ''

    if (!token) {
      return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401)
    }

    // Verify token (simplified for now)
    // TODO: Implement proper JWT verification
    
    // Set user ID in context (mock for now)
    c.set('userId', 'mock-user-id')
    
    const response = await userController.updateUser(c)
    const data = await response.json()
    return c.json(data, response.status as any) as any
  } catch (error) {
    return c.json({ error: 'Unauthorized', message: 'Authentication failed' }, 401)
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
          schema: WalletConnectionRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Wallet connected successfully',
      content: {
        'application/json': {
          schema: UserSchema,
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
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.replace('Bearer ', '') || ''

    if (!token) {
      return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401)
    }

    // Verify token (simplified for now)
    // TODO: Implement proper JWT verification
    
    // Set user ID in context (mock for now)
    c.set('userId', 'mock-user-id')
    
    const response = await userController.connectWallet(c)
    const data = await response.json()
    return c.json(data, response.status as any) as any
  } catch (error) {
    return c.json({ error: 'Unauthorized', message: 'Authentication failed' }, 401)
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
