// * Authentication routes with OpenAPI documentation
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { createApiResponse, createErrorResponse } from '../core/services/response-factory'
import { RegisterUserSchema, LoginUserSchema } from '../core/types/api-schemas'

const app = new OpenAPIHono()

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
          schema: RegisterUserSchema,
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
    const body = c.req.valid('json')
    
    // TODO: Implement actual registration logic
    // const newUser = await authService.register(body)
    
    // Mock response for now
    const response = createApiResponse('POST /api/auth/register', 201, {
      id: 'user_123',
      email: body.email,
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'ConflictError') {
      const response = createErrorResponse('POST /api/auth/register', 409, 'Conflict', error.message)
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/auth/register', 400, 'Validation Error', 'The request body is malformed')
    return c.json(response.payload, response.statusCode as any)
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
          schema: LoginUserSchema,
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
    const body = c.req.valid('json')
    
    // TODO: Implement actual login logic
    // const result = await authService.login(body)
    
    // Mock response for now
    const response = createApiResponse('POST /api/auth/login', 200, {
      accessToken: 'jwt-token-here',
      user: {
        id: 'user_123',
        email: body.email,
        name: 'John Doe',
        walletAddress: null,
        did: null,
        didCreationStatus: 'NONE',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    if (error.name === 'InvalidCredentialsError') {
      const response = createErrorResponse('POST /api/auth/login', 401, 'Unauthorized', 'Invalid email or password')
      return c.json(response.payload, response.statusCode as any)
    }
    
    const response = createErrorResponse('POST /api/auth/login', 400, 'Validation Error', 'The request body is malformed')
    return c.json(response.payload, response.statusCode as any)
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
    // TODO: Implement actual logout logic
    // await authService.logout(c.get('user'))
    
    const response = createApiResponse('POST /api/auth/logout', 200, {
      message: 'Logged out successfully.',
    })
    
    return c.json(response.payload, response.statusCode as any)
  } catch (error: any) {
    const response = createErrorResponse('POST /api/auth/logout', 401, 'Unauthorized', 'No active session to log out from')
    return c.json(response.payload, response.statusCode as any)
  }
})

// === OPENAPI DOCUMENTATION ===
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'HealthLease Hub API',
    description: 'The complete backend API for HealthLease Hub MVP',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
