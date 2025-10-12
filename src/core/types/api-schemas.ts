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
  dataToInclude: z.array(z.string()).min(1, 'At least one data category must be selected.'),
})
export type GenerateQrDto = z.infer<typeof GenerateQrSchema>

export const RequestAccessSchema = z.object({
  qrPayload: z.string(),
  responderInfo: z.object({
    name: z.string().min(1),
    credential: z.string().min(1),
    location: z.string().min(1),
  }),
})
export type RequestAccessDto = z.infer<typeof RequestAccessSchema>

// --- Generic Response Schemas ---
export const AsyncStatusResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']),
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
