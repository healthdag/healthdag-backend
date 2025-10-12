// * Universal Response Factory for HealthLease Hub API
import { apiResponseMap } from '../types/api-responses'
import type { ApiResponsePayload, ApiEndpoint, ApiStatusCode, ErrorResponse } from '../types/api-responses'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/**
 * A type-safe factory for creating standardized API responses.
 * This function guarantees that the returned object matches the predefined
 * schema for the given endpoint and status code.
 *
 * @param endpoint - The API endpoint identifier (e.g., 'POST /api/auth/register').
 * @param statusCode - The HTTP status code for the response (e.g., 201, 400).
 * @param payload - The data for the response body. Must match the schema for the endpoint/code.
 * @returns A structured object with the status code and the typed, validated payload.
 */
export function createApiResponse<
  TEndpoint extends ApiEndpoint,
  TStatusCode extends ApiStatusCode<TEndpoint>
>(
  endpoint: TEndpoint,
  statusCode: TStatusCode,
  payload: ApiResponsePayload<TEndpoint, TStatusCode>
): { statusCode: ContentfulStatusCode; payload: ApiResponsePayload<TEndpoint, TStatusCode> } {
  // 1. Get the Zod schema for this specific endpoint and status code.
  const schema = apiResponseMap[endpoint][statusCode] as any

  // 2. Runtime validation to catch development errors.
  // This ensures that even if TypeScript is bypassed, the payload is correct.
  const validationResult = schema.safeParse(payload)
  if (!validationResult.success) {
    // This should ideally never happen in a type-safe codebase, but it's a great safeguard.
    console.error(`[ResponseFactory] Mismatch for ${endpoint} [${String(statusCode)}]`, validationResult.error)
    // In development, we might want to throw an error to fail fast.
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Response payload does not match schema for ${endpoint} [${String(statusCode)}]`)
    }
    // In production, return a generic error response
    return {
      statusCode: 500 as ContentfulStatusCode,
      payload: { error: 'Internal server error' },
    }
  }

  // 3. Return the structured, typed response object.
  return {
    statusCode: statusCode as ContentfulStatusCode,
    payload: validationResult.data,
  }
}

/**
 * Helper function to create error responses with consistent structure
 * @param endpoint - The API endpoint identifier
 * @param statusCode - The HTTP status code (must be an error status)
 * @param error - The high-level error category
 * @param message - The detailed error message
 * @param details - Optional error details
 * @returns A structured error response
 */
export function createErrorResponse<
  TEndpoint extends ApiEndpoint,
  TStatusCode extends ApiStatusCode<TEndpoint>
>(
  endpoint: TEndpoint,
  statusCode: TStatusCode,
  error: string,
  message: string,
  details?: any
): { statusCode: ContentfulStatusCode; payload: ErrorResponse } {
  return createApiResponse(endpoint, statusCode, {
    error,
    message,
    ...(details && { details }),
  } as ApiResponsePayload<TEndpoint, TStatusCode>)
}

/**
 * Helper function to create success responses with consistent structure
 * @param endpoint - The API endpoint identifier
 * @param statusCode - The HTTP status code (must be a success status)
 * @param payload - The success payload data
 * @returns A structured success response
 */
export function createSuccessResponse<
  TEndpoint extends ApiEndpoint,
  TStatusCode extends ApiStatusCode<TEndpoint>
>(
  endpoint: TEndpoint,
  statusCode: TStatusCode,
  payload: ApiResponsePayload<TEndpoint, TStatusCode>
) {
  return createApiResponse(endpoint, statusCode, payload)
}

// --- EXAMPLE USAGE ---

// This function simulates a controller handler.
function exampleControllerUsage() {
  // Happy path
  const successResponse = createApiResponse(
    'POST /api/auth/register',
    201, // TypeScript knows only 201, 400, 409 are valid here
    { id: 'user_123', email: 'test@example.com' } // Payload is type-checked
  )
  // successResponse is now: { statusCode: 201, payload: { id: '...', email: '...' } }

  // Error path
  const errorResponse = createApiResponse(
    'POST /api/auth/register',
    409, // Valid status code for this endpoint
    { 
      error: 'Conflict',
      message: 'An account with this email already exists.' 
    } // Payload is type-checked
  )
  // errorResponse is now: { statusCode: 409, payload: { error: '...', message: '...' } }

  // Using helper functions
  const errorResponse2 = createErrorResponse(
    'POST /api/auth/login',
    401,
    'Unauthorized',
    'Invalid email or password'
  )

  const successResponse2 = createSuccessResponse(
    'GET /api/user/me',
    200,
    {
      id: 'user_123',
      email: 'test@example.com',
      name: 'John Doe',
      walletAddress: null,
      did: null,
      didCreationStatus: 'NONE',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }
  )

  // --- This will cause a TypeScript error, preventing mistakes! ---
  // const mistake1 = createApiResponse(
  //   'POST /api/auth/register',
  //   404, // Error: 404 is not a valid status code for this endpoint
  //   { error: 'Not found' }
  // )

  // const mistake2 = createApiResponse(
  //   'POST /api/auth/register',
  //   201,
  //   { message: 'Success!' } // Error: Payload doesn't match the schema for status 201
  // )
}
