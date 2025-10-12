// * Complete API Response Type Definitions for HealthLease Hub
import { z } from 'zod'
import { DidCreationStatusEnum, RecordCreationStatusEnum, DocumentCategoryEnum } from './api-schemas'

// ====================================================================================
// 1. REUSABLE CORE SCHEMAS
// These are the foundational building blocks for our API responses.
// ====================================================================================

// --- Standard Error Response ---
// Used for all 4xx and 5xx errors to ensure a consistent error format.
export const ErrorResponseSchema = z.object({
  error: z.string().describe("A high-level error category, e.g., 'Validation Error'"),
  message: z.string().describe('A detailed, human-readable error message.'),
  details: z.any().optional().describe('Optional structured data, e.g., validation issues.'),
})
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

// --- Standard Async Operation Response ---
// Used for endpoints that start a background job (e.g., DID creation, document upload).
export const AsyncAcceptedResponseSchema = z.object({
  id: z.string().cuid().describe('The ID of the resource being processed.'),
  status: DidCreationStatusEnum.describe('The current status of the operation.'),
})
export type AsyncAcceptedResponse = z.infer<typeof AsyncAcceptedResponseSchema>

// --- User Object ---
// The standard representation of a user.
export const UserResponseSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  walletAddress: z.string().nullable(),
  did: z.string().nullable(),
  didCreationStatus: DidCreationStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type UserResponse = z.infer<typeof UserResponseSchema>

// --- Document Object ---
export const DocumentResponseSchema = z.object({
  id: z.string().cuid(),
  onChainId: z.string().nullable().describe('The on-chain ID (as a string to handle BigInt).'),
  ipfsHash: z.string().nullable(),
  category: DocumentCategoryEnum,
  isActive: z.boolean(),
  creationStatus: RecordCreationStatusEnum,
  uploadedAt: z.string().datetime(),
  userId: z.string().cuid(),
})
export type DocumentResponse = z.infer<typeof DocumentResponseSchema>

// --- Study Object ---
export const StudyResponseSchema = z.object({
  id: z.string().cuid(),
  onChainId: z.string(),
  title: z.string(),
  description: z.string(),
  researcherAddress: z.string(),
  paymentPerUser: z.string().describe('Payment amount as a string, e.g., "75.00"'),
  participantsNeeded: z.number().int(),
  participantsEnrolled: z.number().int(),
  status: z.enum(['Active', 'Paused', 'Closed', 'Cancelled']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  metadataHash: z.string(),
  irbApprovalHash: z.string(),
})
export type StudyResponse = z.infer<typeof StudyResponseSchema>

// ====================================================================================
// 2. THE COMPLETE API RESPONSE MAP
// This object defines every possible response for every endpoint and status code.
// ====================================================================================

export const apiResponseMap = {
  // === AUTHENTICATION ===
  'POST /api/auth/register': {
    201: z.object({ id: z.string().cuid(), email: z.string().email() }).describe('User created successfully.'),
    400: ErrorResponseSchema.describe('Validation Error: The request body is malformed.'),
    409: ErrorResponseSchema.describe('Conflict: An account with this email already exists.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Registration failed.'),
  },
  'POST /api/auth/login': {
    200: z.object({ accessToken: z.string(), user: UserResponseSchema }).describe('Login successful.'),
    400: ErrorResponseSchema.describe('Validation Error: The request body is malformed.'),
    401: ErrorResponseSchema.describe('Unauthorized: Invalid email or password.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Login failed.'),
  },
  'POST /api/auth/logout': {
    200: z.object({ message: z.literal('Logged out successfully.') }),
    401: ErrorResponseSchema.describe('Unauthorized: No active session to log out from.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Logout failed.'),
  },

  // === USER & WALLET ===
  'GET /api/user/me': {
    200: UserResponseSchema.describe('The profile of the currently authenticated user.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve user profile.'),
  },
  'PUT /api/user/me': {
    200: UserResponseSchema.describe('The updated user profile.'),
    400: ErrorResponseSchema.describe('Validation Error: The request body is malformed.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to update user profile.'),
  },
  'POST /api/user/wallet/connect': {
    200: UserResponseSchema.describe('User profile updated with the new wallet address.'),
    400: ErrorResponseSchema.describe('Bad Request: The signature is invalid or the address is malformed.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    409: ErrorResponseSchema.describe('Conflict: This wallet is already linked to another account.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to connect wallet.'),
  },
  'POST /api/user/wallet/did': {
    202: AsyncAcceptedResponseSchema.describe('DID creation has been initiated.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    409: ErrorResponseSchema.describe('Conflict: User already has a DID, or wallet is not connected.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to initiate DID creation.'),
  },
  'DELETE /api/user/wallet/connect': {
    200: UserResponseSchema.describe('User profile updated with wallet disconnected.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: No wallet connected to disconnect.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to disconnect wallet.'),
  },
  'GET /api/user/stats': {
    200: z.object({
      documentCount: z.number().int(),
      activeLeases: z.number().int(),
      totalEarned: z.string().describe('Total earnings as a formatted string, e.g., "150.00"'),
    }).describe('User statistics.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve user statistics.'),
  },
  'GET /api/user/wallet/did/status': {
    200: z.object({
      status: DidCreationStatusEnum,
      did: z.string().nullable(),
    }).describe('The current status of DID creation.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve DID status.'),
  },

  // === DOCUMENTS ===
  'POST /api/documents': {
    202: AsyncAcceptedResponseSchema.describe('Document upload has been initiated.'),
    400: ErrorResponseSchema.describe('Bad Request: Missing file, invalid category, or file too large.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to upload document.'),
  },
  'GET /api/documents': {
    200: z.array(DocumentResponseSchema).describe('A list of the user\'s documents.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve documents.'),
  },
  'GET /api/documents/:id/status': {
    200: z.object({
      status: RecordCreationStatusEnum,
      ipfsHash: z.string().nullable(),
      onChainId: z.string().nullable(),
    }).describe('The current status of the document upload.'),
    400: ErrorResponseSchema.describe('Bad Request: Document ID is required.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: No document with this ID belongs to the user.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve document status.'),
  },
  'DELETE /api/documents/:id': {
    200: z.object({ message: z.string().describe('Success message for document deletion.') }),
    400: ErrorResponseSchema.describe('Bad Request: Document ID is required.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: No document with this ID belongs to the user.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to delete document.'),
  },

  // === MARKETPLACE ===
  'GET /api/marketplace/studies': {
    200: z.array(StudyResponseSchema).describe('A list of active research studies.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
  },
  'GET /api/marketplace/studies/:id': {
    200: StudyResponseSchema.describe('Detailed information for a single study.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: No study with this ID exists.'),
  },
  'POST /api/marketplace/studies/:id/apply': {
    202: AsyncAcceptedResponseSchema.describe('Application to the study has been initiated.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: No study with this ID exists.'),
    409: ErrorResponseSchema.describe('Conflict: User has already applied, or the study is full.'),
  },
  'GET /api/marketplace/leases/:id/status': {
    200: z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']) }),
    401: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },

  // === EMERGENCY ===
  'POST /api/emergency/qr': {
    200: z.object({ qrPayload: z.string() }).describe('The signed payload to be embedded in a QR code.'),
    400: ErrorResponseSchema.describe('Bad Request: User does not have a DID or invalid request.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: User not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to generate QR payload.'),
  },
  'POST /api/emergency/access': {
    200: z.object({
      patientData: z.record(z.any()).describe('Decrypted emergency data for the patient organized by category.'),
      expiresAt: z.string().datetime(),
    }).describe('Decrypted emergency data for the patient.'),
    400: ErrorResponseSchema.describe('Bad Request: The QR payload is invalid or malformed.'),
    403: ErrorResponseSchema.describe('Forbidden: The on-chain grant could not be created or access is denied.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to process emergency access request.'),
  },
  
  // === DASHBOARD & LOGS ===
  'GET /api/dashboard/stats': {
    200: z.object({
      documentCount: z.number().int(),
      activeLeases: z.number().int(),
      totalEarned: z.string().describe('Total earnings as a formatted string, e.g., "150.00"'),
    }).describe('Aggregated statistics for the user\'s dashboard.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
  },
  'GET /api/dashboard/activity': {
    200: z.array(z.object({
      id: z.string().cuid(),
      type: z.string(),
      description: z.string(),
      timestamp: z.string().datetime(),
    })).describe('A list of recent user activities.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
  },
  'GET /api/access-logs': {
    200: z.array(z.object({
      responderName: z.string(),
      responderCredential: z.string(),
      accessTime: z.string().datetime(),
      dataAccessed: z.array(z.string()),
    })).describe('A list of all emergency access events for the user.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve access logs.'),
  },

  // === SETTINGS ===
  'GET /api/settings': {
    200: UserResponseSchema.describe('The user\'s current profile settings.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
  },
  'PUT /api/settings': {
    200: UserResponseSchema.describe('The updated user profile settings.'),
    400: ErrorResponseSchema.describe('Validation Error: The request body is malformed.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
  },

  // === QR CODES ===
  'POST /api/qr/generate': {
    201: z.object({
      qrPayload: z.string(),
      expiresAt: z.string().datetime(),
      qrCodeId: z.string(),
    }).describe('QR code generated successfully.'),
    400: ErrorResponseSchema.describe('Bad Request: Invalid request parameters.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
  },
  'GET /api/qr/my-codes': {
    200: z.array(z.object({
      id: z.string().cuid(),
      createdAt: z.string().datetime(),
      isActive: z.boolean(),
      expiresAt: z.string().datetime(),
      documentIds: z.array(z.string()),
      accessType: z.string(),
      accessCount: z.number().int(),
    })).describe('List of user\'s QR codes.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to retrieve QR codes.'),
  },
  'DELETE /api/qr/:id': {
    200: z.object({ message: z.literal('QR code revoked successfully') }),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: QR code not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to revoke QR code.'),
  },
  'PUT /api/qr/:id/regenerate': {
    200: z.object({
      qrPayload: z.string(),
      expiresAt: z.string().datetime(),
      qrCodeId: z.string(),
    }).describe('QR code regenerated successfully.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: QR code not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to regenerate QR code.'),
  },
  'POST /api/qr/access': {
    200: z.object({
      expiresAt: z.string().datetime(),
      documents: z.array(z.object({
        id: z.string().cuid(),
        ipfsHash: z.string().nullable(),
        category: z.string(),
        uploadedAt: z.string().datetime(),
      })),
      patient: z.object({
        email: z.string().email(),
        name: z.string().nullable(),
        did: z.string().nullable(),
      }),
    }).describe('QR code access granted successfully.'),
    400: ErrorResponseSchema.describe('Bad Request: Invalid QR payload.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: QR code not found or expired.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to process QR access.'),
  },

  // === DOCUMENT DOWNLOAD ===
  'GET /api/documents/:id/download': {
    200: z.object({
      file: z.string().describe('Base64 encoded file content'),
      filename: z.string(),
      mimeType: z.string(),
    }).describe('Document file downloaded successfully.'),
    400: ErrorResponseSchema.describe('Bad Request: Document ID is required.'),
    401: ErrorResponseSchema.describe('Unauthorized: Missing or invalid JWT.'),
    404: ErrorResponseSchema.describe('Not Found: Document not found.'),
    500: ErrorResponseSchema.describe('Internal Server Error: Failed to download document.'),
  },

  // === HEALTH CHECK ===
  'GET /health': {
    200: z.object({
      status: z.literal('healthy'),
      timestamp: z.string().datetime(),
      service: z.string(),
    }).describe('Service health status.'),
  },
} as const // 'as const' is crucial for strong type inference

// ====================================================================================
// 3. HELPER TYPES (For use with the Response Factory)
// These are generated from the map above. No need to modify them.
// ====================================================================================

type GetResponseSchema<
  TEndpoint extends keyof typeof apiResponseMap,
  TStatusCode extends keyof (typeof apiResponseMap)[TEndpoint]
> = (typeof apiResponseMap)[TEndpoint][TStatusCode]

export type ApiResponsePayload<
  TEndpoint extends keyof typeof apiResponseMap,
  TStatusCode extends keyof (typeof apiResponseMap)[TEndpoint]
> = z.infer<GetResponseSchema<TEndpoint, TStatusCode> extends z.ZodTypeAny ? GetResponseSchema<TEndpoint, TStatusCode> : never>

// Export endpoint and status code types for use in controllers
export type ApiEndpoint = keyof typeof apiResponseMap
export type ApiStatusCode<TEndpoint extends ApiEndpoint> = keyof (typeof apiResponseMap)[TEndpoint]
