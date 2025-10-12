// * Base API schemas for HealthLease Hub application
import { z } from 'zod'

// ====================================================================================
// DATABASE ENUMS (Matching Prisma Schema)
// ====================================================================================

// Document categories from Prisma schema
export const DocumentCategoryEnum = z.enum(['LAB_RESULT', 'IMAGING', 'PRESCRIPTION', 'VISIT_NOTES', 'PROFILE'])
export type DocumentCategory = z.infer<typeof DocumentCategoryEnum>

// Study status from Prisma schema
export const StudyStatusEnum = z.enum(['Active', 'Paused', 'Closed', 'Cancelled'])
export type StudyStatus = z.infer<typeof StudyStatusEnum>

// Lease status from Prisma schema
export const LeaseStatusEnum = z.enum(['Pending', 'Active', 'Expired', 'Revoked', 'Completed'])
export type LeaseStatus = z.infer<typeof LeaseStatusEnum>

// DID creation status from Prisma schema
export const DidCreationStatusEnum = z.enum(['NONE', 'PENDING', 'CONFIRMED', 'FAILED'])
export type DidCreationStatus = z.infer<typeof DidCreationStatusEnum>

// Record creation status from Prisma schema
export const RecordCreationStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'FAILED'])
export type RecordCreationStatus = z.infer<typeof RecordCreationStatusEnum>

// ====================================================================================
// BASE ENTITY SCHEMAS (Matching Database Structure)
// ====================================================================================

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  walletAddress: z.string().nullable(),
  did: z.string().nullable(),
  didCreationStatus: DidCreationStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type User = z.infer<typeof UserSchema>

export const DocumentSchema = z.object({
  id: z.string().cuid(),
  onChainId: z.string().nullable(), // BigInt as string for JSON transport
  ipfsHash: z.string().nullable(),
  category: DocumentCategoryEnum,
  isActive: z.boolean(),
  creationStatus: RecordCreationStatusEnum,
  uploadedAt: z.date(),
  userId: z.string().cuid(),
})
export type Document = z.infer<typeof DocumentSchema>

export const StudySchema = z.object({
  id: z.string().cuid(),
  onChainId: z.string(), // BigInt as string for JSON transport
  researcherAddress: z.string(),
  title: z.string(),
  description: z.string(),
  metadataHash: z.string(),
  irbApprovalHash: z.string(),
  paymentPerUser: z.string(), // Decimal as string for JSON transport
  participantsNeeded: z.number().int(),
  participantsEnrolled: z.number().int(),
  status: StudyStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Study = z.infer<typeof StudySchema>

export const LeaseSchema = z.object({
  id: z.string().cuid(),
  onChainId: z.string(), // BigInt as string for JSON transport
  paymentAmount: z.string(), // Decimal as string for JSON transport
  startTime: z.date(),
  endTime: z.date(),
  status: LeaseStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().cuid(),
  studyId: z.string().cuid(),
})
export type Lease = z.infer<typeof LeaseSchema>

export const AccessLogSchema = z.object({
  id: z.string().cuid(),
  onChainGrantId: z.string(), // BigInt as string for JSON transport
  responderName: z.string(),
  responderCredential: z.string(),
  responderLocation: z.string(),
  dataAccessed: z.array(z.string()),
  accessTime: z.date(),
  grantExpiresAt: z.date(),
  userId: z.string().cuid(),
})
export type AccessLog = z.infer<typeof AccessLogSchema>

// * Authentication DTOs moved to auth-types.ts to avoid duplication
// * Import from auth-types.ts instead:
// import { UserCreateInputSchema, LoginCredentialsSchema, UserUpdateInputSchema, WalletConnectionRequestSchema } from './auth-types'

export const UploadDocumentSchema = z.object({
  category: z.enum(['LAB_RESULT', 'IMAGING', 'PRESCRIPTION', 'VISIT_NOTES']),
})
export type UploadDocumentDto = z.infer<typeof UploadDocumentSchema>

export const GenerateQrSchema = z.object({
  dataToInclude: z.array(z.enum(['allergies', 'medications', 'bloodType', 'conditions', 'emergencyContacts', 'medicalHistory'])).min(1, 'At least one data category must be selected.').describe('Medical data categories to include in emergency QR code (e.g., ["allergies", "medications", "bloodType"])'),
})
export type GenerateQrDto = z.infer<typeof GenerateQrSchema>

export const RequestAccessSchema = z.object({
  qrPayload: z.string().describe('QR code payload scanned from patient\'s emergency QR code'),
  responderInfo: z.object({
    name: z.string().min(1).describe('Full name of the emergency responder (e.g., "Dr. Sarah Johnson")'),
    credential: z.string().min(1).describe('Professional credentials or license number (e.g., "EMT License #EMT123456", "MD License #MD789012")'),
    location: z.string().min(1).describe('Organization or facility name (e.g., "City Emergency Services", "St. Mary\'s Hospital")'),
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address').describe('Ethereum wallet address for responder verification (e.g., "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")')
  }),
})
export type RequestAccessDto = z.infer<typeof RequestAccessSchema>

// --- Generic Response Schemas ---
export const AsyncStatusResponseSchema = z.object({
  id: z.string(),
  status: RecordCreationStatusEnum,
})
export type AsyncStatusResponse = z.infer<typeof AsyncStatusResponseSchema>

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.any().optional(),
})
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

export const SuccessMessageSchema = z.object({
  message: z.string(),
})
export type SuccessMessage = z.infer<typeof SuccessMessageSchema>

// User update schema
export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
})
export type UpdateUser = z.infer<typeof UpdateUserSchema>

// Wallet connection schema
export const ConnectWalletSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  message: z.string().min(1),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format')
})
export type ConnectWalletDto = z.infer<typeof ConnectWalletSchema>

// DID status response schema
export const DidStatusResponseSchema = z.object({
  status: DidCreationStatusEnum,
  did: z.string().nullable()
})
export type DidStatusResponse = z.infer<typeof DidStatusResponseSchema>

