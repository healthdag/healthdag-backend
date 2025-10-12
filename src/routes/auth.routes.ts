// * Authentication routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { PrismaClient } from '@prisma/client'
import { AuthService } from '../core/services/auth-service'
import { createAuthController } from '../features/auth/auth-controller'
import { requireAuth } from '../core/middleware/auth-middleware'
import { UserCreateInputSchema, LoginCredentialsSchema } from '../core/types/auth-types'
import type { Context } from 'hono'

// * Define the context variables interface
interface AuthContextVariables {
  userId?: string
  validatedBody?: any
}

const app = new OpenAPIHono<{ Variables: AuthContextVariables }>()

// * Initialize services
const prisma = new PrismaClient()
const authService = new AuthService(prisma)
const authController = createAuthController(authService)


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
    
    const response = await authController.register(c)
    const data = await response.json()
    return c.json(data, response.status as any) as any
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
    
    const response = await authController.login(c)
    const data = await response.json()
    return c.json(data, response.status as any) as any
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
    
    const response = await authController.logout(c)
    const data = await response.json()
    return c.json(data, response.status as any) as any
  } catch (error) {
    return c.json({ error: 'Unauthorized', message: 'Authentication failed' }, 401)
  }
})

// * OpenAPI documentation is handled by the main server.ts

export default app
