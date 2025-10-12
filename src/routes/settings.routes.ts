// * Settings routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { UserResponseSchema } from '../core/types/api-responses'
import { UpdateUserSchema } from '../core/types/api-schemas'
import { UserService } from '../core/services/user-service'
import { createUserController } from '../features/user/user-controller'
import { logError } from '../core/utils/error-logger'

const app = new OpenAPIHono()

// * Initialize services (settings uses user service)
console.log('🔧 Initializing settings services...')
try {
  const prisma = new PrismaClient()
  console.log('✅ PrismaClient initialized')
  
  const userService = new UserService(prisma)
  console.log('✅ UserService initialized')
  
  var userController = createUserController(userService)
  console.log('✅ UserController initialized for settings')
} catch (error) {
  console.error('❌ FAILED TO INITIALIZE SETTINGS SERVICES:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    error
  })
  throw error
}

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

app.openapi(getSettingsRoute, async (c) => {
  // Settings GET is just user profile retrieval
  const response = await userController.getCurrentUser(c)
  const data = await response.json()
  return c.json(data, response.status as any) as any
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

app.openapi(updateSettingsRoute, async (c) => {
  // Settings PUT is just user profile update
  const response = await userController.updateUser(c)
  const data = await response.json()
  return c.json(data, response.status as any) as any
})

export default app
