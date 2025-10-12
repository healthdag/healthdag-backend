// * Strongly typed authentication types for HealthLease Hub
import { z } from 'zod'
import type { User } from './api-schemas'
import { UserSchema } from './api-schemas'
import type { UserResponse } from './api-responses'

// ====================================================================================
// ENUMS
// ====================================================================================

export enum AuthErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong'
}

export enum JwtTokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}

export enum WalletVerificationStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  EXPIRED = 'EXPIRED',
  MALFORMED = 'MALFORMED'
}

// ====================================================================================
// STRONGLY TYPED INTERFACES
// ====================================================================================

// * User type imported from existing schema to avoid duplication

export interface UserCreateInput {
  email: string
  password: string
}

export interface UserUpdateInput {
  name?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  accessToken: string
  user: UserResponse
}

export interface JwtPayload {
  sub: string
  iat: number
  exp?: number // * Optional - jwt.sign will set this automatically based on expiresIn
  iss?: string // * Optional - jwt.sign will set this automatically based on issuer option
  aud?: string // * Optional - jwt.sign will set this automatically based on audience option
}

export interface JwtResult {
  valid: boolean
  payload?: JwtPayload
  error?: string
}

export interface JwtDecoded {
  header: Record<string, unknown>
  payload: JwtPayload
  signature: string
}

export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
  strength: PasswordStrength
  score: number
}

export interface PasswordRequirements {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxLength?: number
}

export interface WalletConnectionRequest {
  walletAddress: string
  message: string
  signature: string
}

export interface WalletVerificationResult {
  valid: boolean
  recoveredAddress?: string
  error?: string
}

export interface WalletMessage {
  message: string
  timestamp: number
  userId: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
  requestId: string
}

export interface ValidationResult<T = unknown> {
  success: boolean
  data?: T
  errors: string[]
  fieldErrors?: Record<string, string[]>
}

export interface EmailValidationResult {
  valid: boolean
  normalized?: string
  error?: string
}

export interface UserStats {
  documentCount: number
  activeLeases: number
  totalEarned: string
}

// ====================================================================================
// ZOD SCHEMAS FOR RUNTIME VALIDATION
// ====================================================================================

// * UserSchema imported from existing schema to avoid duplication

export const UserCreateInputSchema = z.object({
  email: z.string().email('Invalid email address').describe('User\'s email address for account login (e.g., "user@example.com")'),
  password: z.string().min(8, 'Password must be at least 8 characters').describe('Secure password for account access (minimum 8 characters, recommended: mix of letters, numbers, and symbols)')
})

export const UserUpdateInputSchema = z.object({
  name: z.string().min(1).max(100).optional().describe('User\'s display name for profile (e.g., "Dr. Sarah Johnson", "John Smith")')
})

export const LoginCredentialsSchema = z.object({
  email: z.string().email('Invalid email address').describe('User\'s registered email address (e.g., "user@example.com")'),
  password: z.string().min(1, 'Password is required').describe('User\'s account password')
})

export const JwtPayloadSchema = z.object({
  sub: z.string().min(1),
  iat: z.number().int().positive(),
  exp: z.number().int().positive(),
  iss: z.string(),
  aud: z.string()
})

export const WalletConnectionRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address').describe('Ethereum wallet address to connect (e.g., "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")'),
  message: z.string().min(1).describe('Signed message containing timestamp for verification (User ID optional). Examples: "Connect wallet to HealthDAG\nTimestamp: 1760275088336" or "Welcome to HealthLease Hub!\nUser ID: cmgnok9tf0000j5ra45hzchsr\nTimestamp: 1760275088336"'),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format').describe('Cryptographic signature proving wallet ownership')
})

export const PasswordValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
  strength: z.nativeEnum(PasswordStrength),
  score: z.number().min(0).max(100)
})

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.string(),
  requestId: z.string()
})

// ====================================================================================
// TYPE INFERENCE FROM SCHEMAS
// ====================================================================================

// * UserType removed - using User from api-schemas instead
export type UserCreateInputType = z.infer<typeof UserCreateInputSchema>
export type UserUpdateInputType = z.infer<typeof UserUpdateInputSchema>
export type LoginCredentialsType = z.infer<typeof LoginCredentialsSchema>
export type JwtPayloadType = z.infer<typeof JwtPayloadSchema>
export type WalletConnectionRequestType = z.infer<typeof WalletConnectionRequestSchema>
export type PasswordValidationResultType = z.infer<typeof PasswordValidationResultSchema>
export type ApiResponseType<T = unknown> = z.infer<typeof ApiResponseSchema> & { data?: T }

// ====================================================================================
// TYPE GUARDS
// ====================================================================================

export function isUser(obj: unknown): obj is User {
  return UserSchema.safeParse(obj).success
}

export function isJwtPayload(obj: unknown): obj is JwtPayload {
  return JwtPayloadSchema.safeParse(obj).success
}

export function isPasswordStrength(value: string): value is PasswordStrength {
  return Object.values(PasswordStrength).includes(value as PasswordStrength)
}

export function isAuthErrorType(value: string): value is AuthErrorType {
  return Object.values(AuthErrorType).includes(value as AuthErrorType)
}

export function isWalletVerificationStatus(value: string): value is WalletVerificationStatus {
  return Object.values(WalletVerificationStatus).includes(value as WalletVerificationStatus)
}

// ====================================================================================
// CONSTANTS
// ====================================================================================

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  maxLength: 128
}

export const JWT_ISSUER = 'healthlease-hub'
export const JWT_AUDIENCE = 'healthlease-users'

export const WALLET_MESSAGE_PREFIX = 'Welcome to HealthLease Hub! Sign this message to authenticate your wallet.'
export const WALLET_MESSAGE_SUFFIX = 'This request will not trigger a blockchain transaction or cost any gas fees.'

// ====================================================================================
// EXPORTS
// ====================================================================================

// * Re-export User type from api-schemas
export type { User } from './api-schemas'
