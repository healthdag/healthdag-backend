// * Authentication routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { PrismaClient } from '@prisma/client'
import { AuthService } from '../core/services/auth-service'
import { createAuthController } from '../features/auth/auth-controller'
import { requireAuth } from '../core/middleware/auth-middleware'
import { authRateLimit } from '../core/middleware/rate-limit-middleware'
import { UserCreateInputSchema, LoginCredentialsSchema } from '../core/types/auth-types'
import type { Context } from 'hono'

// * Define the context variables interface
interface AuthContextVariables {
  userId?: string
  validatedBody?: any
}

const app = new OpenAPIHono<{ Variables: AuthContextVariables }>()

// * Initialize services
console.log('🔧 Initializing auth services...')
try {
  const prisma = new PrismaClient()
  console.log('✅ PrismaClient initialized')
  
  const authService = new AuthService(prisma)
  console.log('✅ AuthService initialized')
  
  var authController = createAuthController(authService)
  console.log('✅ AuthController initialized')
} catch (error) {
  console.error('❌ FAILED TO INITIALIZE AUTH SERVICES:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    error
  })
  throw error
}


// === REGISTER ROUTE ===
const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  tags: ['Authentication'],
  summary: 'Register a new user account',
  description: 'Creates a new user account with email and password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserCreateInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            email: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    409: {
      description: 'Email already exists',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(registerRoute, async (c) => {
  try {
    const body = await c.req.json()
    const validated = UserCreateInputSchema.parse(body)
    c.set('validatedBody', validated)

    return await authController.register(c)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation Error', message: 'Invalid request body', details: error.errors }, 400)
    }
    throw error
  }
})

// === LOGIN ROUTE ===
const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['Authentication'],
  summary: 'Log in a user',
  description: 'Authenticates a user and returns JWT tokens',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginCredentialsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: z.object({
            accessToken: z.string(),
            user: z.object({
              id: z.string(),
              email: z.string(),
              name: z.string().nullable(),
              walletAddress: z.string().nullable(),
              did: z.string().nullable(),
              didCreationStatus: z.enum(['NONE', 'PENDING', 'CONFIRMED', 'FAILED']),
              createdAt: z.string().datetime(),
              updatedAt: z.string().datetime(),
            }),
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
    401: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(loginRoute, async (c) => {
  try {
    const body = await c.req.json()
    const validated = LoginCredentialsSchema.parse(body)
    c.set('validatedBody', validated)

    return await authController.login(c)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation Error', message: 'Invalid request body', details: error.errors }, 400)
    }
    throw error
  }
})

// === LOGOUT ROUTE ===
const logoutRoute = createRoute({
  method: 'post',
  path: '/logout',
  tags: ['Authentication'],
  summary: 'Log out a user',
  description: 'Invalidates the user session',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Logout successful',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
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
            details: z.any().optional(),
          }),
        },
      },
    },
  },
})

app.openapi(logoutRoute, async (c) => {
  return await authController.logout(c)
})

// * OpenAPI documentation is handled by the main server.ts

export default app
