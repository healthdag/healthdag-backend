// * Validation utility functions for HealthLease Hub
import { z } from 'zod'
import { isValidAddress } from './wallet-util'
import type { 
  ValidationResult, 
  EmailValidationResult, 
  PasswordValidationResult
} from '../types/auth-types'
import { PasswordStrength } from '../types/auth-types'

// ====================================================================================
// EMAIL VALIDATION
// ====================================================================================

/**
 * * Validates and normalizes an email address
 * @param email - The email address to validate
 * @returns Email validation result
 */
export function validateEmail(email: string): EmailValidationResult {
  try {
    if (!email || typeof email !== 'string') {
      return {
        valid: false,
        error: 'Email is required'
      }
    }
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        error: 'Invalid email format'
      }
    }
    
    // Normalize email (lowercase, trim)
    const normalized = email.toLowerCase().trim()
    
    // Check length limits
    if (normalized.length > 254) {
      return {
        valid: false,
        error: 'Email address is too long'
      }
    }
    
    // Check for common invalid patterns
    if (normalized.includes('..') || normalized.startsWith('.') || normalized.endsWith('.')) {
      return {
        valid: false,
        error: 'Invalid email format'
      }
    }
    
    return {
      valid: true,
      normalized
    }
  } catch (error) {
    return {
      valid: false,
      error: `Email validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * * Checks if an email address is valid
 * @param email - The email address to check
 * @returns True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return validateEmail(email).valid
}

// ====================================================================================
// PASSWORD VALIDATION
// ====================================================================================

/**
 * * Validates password strength and requirements
 * @param password - The password to validate
 * @param minLength - Minimum password length (default: 8)
 * @returns Password validation result
 */
export function validatePassword(password: string, minLength: number = 8): PasswordValidationResult {
  const errors: string[] = []
  let score = 0
  
  // Length validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
    return { valid: false, errors, strength: PasswordStrength.WEAK, score: 0 }
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  } else {
    score += 20
  }
  
  if (password.length > 128) {
    errors.push('Password must be no more than 128 characters long')
  } else if (password.length >= minLength) {
    score += 10
  }
  
  // Character type validation
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 15
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 15
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 15
  }
  
  // Additional strength factors
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10
  if (/\d/.test(password) && /[A-Z]/.test(password) && /[a-z]/.test(password)) score += 10
  
  // Determine strength level
  let strength: PasswordStrength
  if (score >= 80) {
    strength = PasswordStrength.STRONG
  } else if (score >= 50) {
    strength = PasswordStrength.MEDIUM
  } else {
    strength = PasswordStrength.WEAK
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength,
    score: Math.min(score, 100)
  }
}

/**
 * * Checks if a password is valid
 * @param password - The password to check
 * @param minLength - Minimum password length (default: 8)
 * @returns True if password is valid, false otherwise
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  return validatePassword(password, minLength).valid
}

// ====================================================================================
// WALLET ADDRESS VALIDATION
// ====================================================================================

/**
 * * Validates a wallet address
 * @param address - The wallet address to validate
 * @returns True if address is valid, false otherwise
 */
export function validateWalletAddress(address: string): boolean {
  return isValidAddress(address)
}

/**
 * * Checks if a wallet address is valid
 * @param address - The wallet address to check
 * @returns True if address is valid, false otherwise
 */
export function isValidWalletAddress(address: string): boolean {
  return validateWalletAddress(address)
}

// ====================================================================================
// INPUT SANITIZATION
// ====================================================================================

/**
 * * Sanitizes user input to prevent XSS and other attacks
 * @param input - The input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000) // Limit length
}

/**
 * * Sanitizes email input
 * @param email - The email to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9@._-]/g, '') // Remove invalid characters
    .substring(0, 254) // Limit length
}

/**
 * * Sanitizes name input
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') return ''
  
  return name
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^a-zA-Z\s'-]/g, '') // Allow only letters, spaces, hyphens, apostrophes
    .substring(0, 100) // Limit length
}

// ====================================================================================
// GENERAL VALIDATION HELPERS
// ====================================================================================

/**
 * * Validates data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Validation result
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const result = schema.parse(data)
    return {
      success: true,
      data: result,
      errors: []
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message)
      const fieldErrors: Record<string, string[]> = {}
      
      error.errors.forEach(err => {
        const path = err.path.join('.')
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(err.message)
      })
      
      return {
        success: false,
        errors,
        fieldErrors
      }
    }
    
    return {
      success: false,
      errors: ['Validation failed']
    }
  }
}

/**
 * * Validates required fields
 * @param data - The data object to validate
 * @param requiredFields - Array of required field names
 * @returns Validation result
 */
export function validateRequiredFields(
  data: Record<string, unknown>, 
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = []
  const fieldErrors: Record<string, string[]> = {}
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`)
      fieldErrors[field] = [`${field} is required`]
    }
  })
  
  return {
    success: errors.length === 0,
    errors,
    fieldErrors
  }
}

/**
 * * Validates string length
 * @param value - The string value to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 */
export function validateStringLength(
  value: string, 
  minLength: number, 
  maxLength: number, 
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = []
  
  if (!value || typeof value !== 'string') {
    errors.push(`${fieldName} is required`)
    return { success: false, errors }
  }
  
  if (value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`)
  }
  
  if (value.length > maxLength) {
    errors.push(`${fieldName} must be no more than ${maxLength} characters long`)
  }
  
  return {
    success: errors.length === 0,
    errors
  }
}

// ====================================================================================
// COMMON VALIDATION SCHEMAS
// ====================================================================================

export const EmailSchema = z.string().email('Invalid email address').max(254, 'Email address is too long')

export const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be no more than 128 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')

export const WalletAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')

export const NameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be no more than 100 characters long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')

export const CuidSchema = z.string().cuid('Invalid ID format')

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { ValidationResult, EmailValidationResult, PasswordValidationResult }
