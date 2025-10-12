// * Centralized error logging utility for HealthLease Hub

export interface ErrorLogContext {
  endpoint?: string
  userId?: string
  method?: string
  path?: string
  [key: string]: any
}

/**
 * * Logs an error with detailed context information
 * @param category - Error category (e.g., 'AUTH', 'DATABASE', 'BLOCKCHAIN')
 * @param error - The error object
 * @param context - Additional context information
 */
export function logError(
  category: string,
  error: unknown,
  context?: ErrorLogContext
): void {
  const timestamp = new Date().toISOString()
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  console.error(`❌ [${category}] ERROR:`, {
    timestamp,
    message: errorMessage,
    stack: errorStack,
    context,
    error
  })
}

/**
 * * Logs a warning with context information
 * @param category - Warning category
 * @param message - Warning message
 * @param context - Additional context information
 */
export function logWarning(
  category: string,
  message: string,
  context?: ErrorLogContext
): void {
  const timestamp = new Date().toISOString()

  console.warn(`⚠️ [${category}] WARNING:`, {
    timestamp,
    message,
    context
  })
}

/**
 * * Logs an info message with context information
 * @param category - Info category
 * @param message - Info message
 * @param context - Additional context information
 */
export function logInfo(
  category: string,
  message: string,
  context?: Record<string, any>
): void {
  const timestamp = new Date().toISOString()

  console.log(`ℹ️ [${category}] INFO:`, {
    timestamp,
    message,
    context
  })
}

/**
 * * Logs a success message with context information
 * @param category - Success category
 * @param message - Success message
 * @param context - Additional context information
 */
export function logSuccess(
  category: string,
  message: string,
  context?: Record<string, any>
): void {
  const timestamp = new Date().toISOString()

  console.log(`✅ [${category}] SUCCESS:`, {
    timestamp,
    message,
    context
  })
}

/**
 * * Logs a debug message (only in development)
 * @param category - Debug category
 * @param message - Debug message
 * @param data - Debug data
 */
export function logDebug(
  category: string,
  message: string,
  data?: any
): void {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
    const timestamp = new Date().toISOString()
    
    console.log(`🐛 [${category}] DEBUG:`, {
      timestamp,
      message,
      data
    })
  }
}

