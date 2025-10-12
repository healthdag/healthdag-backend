// * User and wallet routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client'
import { UserService } from '../core/services/user-service'
import { createUserController } from '../features/user/user-controller'
import { requireAuth } from '../core/middleware/auth-middleware'
import { userRateLimit } from '../core/middleware/rate-limit-middleware'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { UserResponseSchema } from '../core/types/api-responses'
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
  const response = await userController.getCurrentUser(c)
  const data = await response.json()
  return c.json(data, response.status as any)
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
  const response = await userController.updateUser(c)
  const data = await response.json()
  return c.json(data, response.status as any)
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
  const response = await userController.connectWallet(c)
  const data = await response.json()
  return c.json(data, response.status as any)
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
  const response = await userController.createDid(c)
  const data = await response.json()
  return c.json(data, response.status as any)
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
  const response = await userController.getDidStatus(c)
  const data = await response.json()
  return c.json(data, response.status as any)
})

export default app
