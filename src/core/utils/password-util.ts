// * Password utility functions for HealthLease Hub authentication
import bcrypt from 'bcrypt'
import type { 
  PasswordValidationResult, 
  PasswordRequirements
} from '../types/auth-types'
import { 
  DEFAULT_PASSWORD_REQUIREMENTS,
  PasswordStrength
} from '../types/auth-types'

// ====================================================================================
// CONFIGURATION
// ====================================================================================

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12')
const PASSWORD_MIN_LENGTH = parseInt(process.env.PASSWORD_MIN_LENGTH || '8')
const PASSWORD_MAX_LENGTH = parseInt(process.env.PASSWORD_MAX_LENGTH || '128')

// Use default requirements from types
const DEFAULT_REQUIREMENTS: PasswordRequirements = {
  ...DEFAULT_PASSWORD_REQUIREMENTS,
  minLength: PASSWORD_MIN_LENGTH,
  maxLength: PASSWORD_MAX_LENGTH
}

// ====================================================================================
// PASSWORD HASHING & VERIFICATION
// ====================================================================================

/**
 * * Hashes a password using bcrypt
 * @param password - The plaintext password to hash
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, BCRYPT_ROUNDS)
  } catch (error) {
    throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * * Compares a plaintext password with a hashed password
 * @param password - The plaintext password
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    throw new Error(`Failed to compare password: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ====================================================================================
// PASSWORD VALIDATION
// ====================================================================================

/**
 * * Validates password strength and requirements
 * @param password - The password to validate
 * @param requirements - Custom requirements (optional)
 * @returns Password validation result
 */
export function validatePasswordStrength(
  password: string, 
  requirements: PasswordRequirements = DEFAULT_REQUIREMENTS
): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // Length validation
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`)
  } else {
    score += 20
  }

  if (requirements.maxLength && password.length > requirements.maxLength) {
    errors.push(`Password must be no more than ${requirements.maxLength} characters long`)
  } else if (password.length >= requirements.minLength) {
    score += 10
  }

  // Character type validation
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else if (requirements.requireUppercase) {
    score += 15
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else if (requirements.requireLowercase) {
    score += 15
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else if (requirements.requireNumbers) {
    score += 15
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  } else if (requirements.requireSpecialChars) {
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
 * * Generates a secure random password
 * @param length - Password length (default: 16)
 * @param includeSpecialChars - Whether to include special characters (default: true)
 * @returns Generated secure password
 */
export function generateSecurePassword(length: number = 16, includeSpecialChars: boolean = true): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  let charset = lowercase + uppercase + numbers
  if (includeSpecialChars) {
    charset += specialChars
  }
  
  let password = ''
  
  // Ensure at least one character from each required type
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  
  if (includeSpecialChars) {
    password += specialChars[Math.floor(Math.random() * specialChars.length)]
  }
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * * Checks if a password meets basic security requirements
 * @param password - The password to check
 * @returns True if password meets basic requirements
 */
export function isPasswordSecure(password: string): boolean {
  const validation = validatePasswordStrength(password)
  return validation.valid && validation.strength !== 'weak'
}

// ====================================================================================
// PASSWORD STRENGTH ANALYSIS
// ====================================================================================

/**
 * * Analyzes password strength and provides feedback
 * @param password - The password to analyze
 * @returns Detailed strength analysis
 */
export function analyzePasswordStrength(password: string): {
  score: number
  strength: PasswordStrength
  feedback: string[]
  suggestions: string[]
} {
  const validation = validatePasswordStrength(password)
  const feedback: string[] = []
  const suggestions: string[] = []

  // Score-based feedback
  if (validation.score < 30) {
    feedback.push('Password is very weak')
    suggestions.push('Use a longer password with mixed characters')
  } else if (validation.score < 50) {
    feedback.push('Password is weak')
    suggestions.push('Add uppercase letters and numbers')
  } else if (validation.score < 70) {
    feedback.push('Password is moderately strong')
    suggestions.push('Consider adding special characters')
  } else if (validation.score < 90) {
    feedback.push('Password is strong')
    suggestions.push('Good password strength')
  } else {
    feedback.push('Password is very strong')
    suggestions.push('Excellent password security')
  }

  // Specific suggestions based on validation
  if (password.length < 8) {
    suggestions.push('Use at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters')
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters')
  }
  if (!/\d/.test(password)) {
    suggestions.push('Add numbers')
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    suggestions.push('Add special characters for extra security')
  }

  return {
    score: validation.score,
    strength: validation.strength,
    feedback,
    suggestions
  }
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { PasswordValidationResult, PasswordRequirements }
