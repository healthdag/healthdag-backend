// * Authentication routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { PrismaClient } from '@prisma/client'
import { AuthService } from '../core/services/auth-service'
import { createAuthController } from '../features/auth/auth-controller'
import { requireAuth } from '../core/middleware/auth-middleware'
import { authRateLimit } from '../core/middleware/rate-limit-middleware'
import { UserCreateInputSchema, LoginCredentialsSchema } from '../core/types/auth-types'
import { DidCreationStatusEnum } from '../core/types/api-schemas'
import { logError, logInfo, logSuccess } from '../core/utils/error-logger'
import type { Context } from 'hono'

// * Define the context variables interface
interface AuthContextVariables {
  userId?: string
  validatedBody?: any
}

const app = new OpenAPIHono<{ Variables: AuthContextVariables }>()

// * Initialize services
logInfo('AUTH_ROUTES', 'Initializing auth services')
try {
  const prisma = new PrismaClient()
  logSuccess('AUTH_ROUTES', 'PrismaClient initialized')
  
  const authService = new AuthService(prisma)
  logSuccess('AUTH_ROUTES', 'AuthService initialized')
  
  var authController = createAuthController(authService)
  logSuccess('AUTH_ROUTES', 'AuthController initialized')
} catch (error) {
  logError('AUTH_ROUTES', error, { operation: 'service-initialization' })
  throw error
}


// === REGISTER ROUTE ===
const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  tags: ['Authentication'],
  summary: 'Register a new user account',
  description: 'Creates a new user account with email and password for accessing HealthLease Hub services',
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
  logInfo('AUTH_ROUTES', 'Register route called')
  
  try {
    const body = await c.req.json()
    const validated = UserCreateInputSchema.parse(body)
    c.set('validatedBody', validated)
    
    logInfo('AUTH_ROUTES', 'Register request validated', { email: validated.email })
    const response = await authController.register(c)
    const data = await response.json()
    return c.json(data, response.status as any)
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('AUTH_ROUTES', error, { operation: 'register-validation', errors: error.errors })
      return c.json({ error: 'Validation Error', details: error.errors }, 400)
    }
    logError('AUTH_ROUTES', error, { operation: 'register' })
    throw error
  }
})

// === LOGIN ROUTE ===
const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['Authentication'],
  summary: 'Log in a user',
  description: 'Authenticates a user with email and password, returning JWT access token for API authorization',
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
              didCreationStatus: DidCreationStatusEnum,
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
  logInfo('AUTH_ROUTES', 'Login route called')
  
  try {
    const body = await c.req.json()
    const validated = LoginCredentialsSchema.parse(body)
    c.set('validatedBody', validated)
    
    logInfo('AUTH_ROUTES', 'Login request validated', { email: validated.email })
    const response = await authController.login(c)
    const data = await response.json()
    return c.json(data, response.status as any)
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('AUTH_ROUTES', error, { operation: 'login-validation', errors: error.errors })
      return c.json({ error: 'Validation Error', details: error.errors }, 400)
    }
    logError('AUTH_ROUTES', error, { operation: 'login' })
    throw error
  }
})

// === LOGOUT ROUTE ===
const logoutRoute = createRoute({
  method: 'post',
  path: '/logout',
  tags: ['Authentication'],
  summary: 'Log out a user',
  description: 'Invalidates the user session and JWT token, requiring re-authentication for future requests',
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
  logInfo('AUTH_ROUTES', 'Logout route called', { userId: c.get('userId') })
  const response = await authController.logout(c)
  const data = await response.json()
  return c.json(data, response.status as any)
})

// * OpenAPI documentation is handled by the main server.ts

export default app
