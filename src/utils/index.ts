// * Utility functions for HealthLease application

import type { ApiResponse, ErrorResponse } from '../types/index.js'

/**
 * Creates a standardized success response
 * @param data - Response data
 * @param message - Optional success message
 * @returns Standardized API response
 */
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message })
  }
}

/**
 * Creates a standardized error response
 * @param error - Error message
 * @param code - Optional error code
 * @param details - Optional error details
 * @returns Standardized error response
 */
export function createErrorResponse(
  error: string, 
  code?: string, 
  details?: any
): ErrorResponse {
  return {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details })
  }
}

/**
 * Validates if a string is a valid email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generates a random string of specified length
 * @param length - Length of the string to generate
 * @returns Random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Safely parses JSON string
 * @param jsonString - JSON string to parse
 * @returns Parsed object or null if invalid
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return null
  }
}
