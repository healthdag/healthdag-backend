// * Authentication service for HealthLease Hub
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password-util'
import { generateAccessToken, verifyToken } from '../utils/jwt-util'
import { validateEmail, validatePassword } from '../utils/validation-util'
import { TokenBlacklistService } from './token-blacklist-service'
import { logger } from '../utils/logger'
import { logError, logInfo, logSuccess, logWarning } from '../utils/error-logger'
import type { 
  User, 
  UserCreateInput, 
  LoginCredentials, 
  LoginResult
} from '../types/auth-types'
import { AuthErrorType } from '../types/auth-types'

// ====================================================================================
// ERROR CLASSES
// ====================================================================================

export class ConflictError extends Error {
  public readonly type = AuthErrorType.CONFLICT_ERROR
  
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class UnauthorizedError extends Error {
  public readonly type = AuthErrorType.UNAUTHORIZED_ERROR
  
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends Error {
  public readonly type = AuthErrorType.VALIDATION_ERROR
  
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// ====================================================================================
// SERVICE CLASS
// ====================================================================================

export class AuthService {
  private prisma: PrismaClient
  private tokenBlacklistService: TokenBlacklistService

  constructor(prisma: PrismaClient) {
    logInfo('AUTH', 'Initializing AuthService')
    this.prisma = prisma
    this.tokenBlacklistService = new TokenBlacklistService(prisma)
    logSuccess('AUTH', 'AuthService initialized successfully')
  }

  // ====================================================================================
  // USER REGISTRATION
  // ====================================================================================

  /**
   * * Registers a new user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Newly created user
   */
  async register(email: string, password: string): Promise<User> {
    logInfo('AUTH', 'Starting user registration', { email })
    
    try {
      // Validate email format
      const emailValidation = validateEmail(email)
      if (!emailValidation.valid) {
        logWarning('AUTH', 'Email validation failed', { email, error: emailValidation.error })
        throw new ValidationError(emailValidation.error || 'Invalid email format')
      }

      // Validate password strength
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        logWarning('AUTH', 'Password validation failed', { email, errors: passwordValidation.errors })
        throw new ValidationError(`Password validation failed: ${passwordValidation.errors.join(', ')}`)
      }

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: emailValidation.normalized }
      })

      if (existingUser) {
        logWarning('AUTH', 'Registration attempt with existing email', { email })
        throw new ConflictError('An account with this email already exists')
      }

      // Hash password
      logInfo('AUTH', 'Hashing password for registration')
      const hashedPassword = await hashPassword(password)

      // Create user
      logInfo('AUTH', 'Creating user in database')
      const user = await this.prisma.user.create({
        data: {
          email: emailValidation.normalized!,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true,
          name: true,
          walletAddress: true,
          did: true,
          didCreationStatus: true,
          createdAt: true,
          updatedAt: true
        }
      })

      logSuccess('AUTH', 'User registered successfully', { userId: user.id, email: user.email })
      return user
    } catch (error) {
      logError('AUTH', error, { operation: 'register', email })
      throw error
    }
  }

  // ====================================================================================
  // USER LOGIN
  // ====================================================================================

  /**
   * * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Login result with access token and user data
   */
  async login(email: string, password: string): Promise<LoginResult> {
    logInfo('AUTH', 'Starting user login', { email })
    
    try {
      // Validate email format
      const emailValidation = validateEmail(email)
      if (!emailValidation.valid) {
        logWarning('AUTH', 'Login attempt with invalid email', { email })
        throw new UnauthorizedError('Invalid email or password')
    }

      // Find user by email
      logInfo('AUTH', 'Looking up user by email')
      const user = await this.prisma.user.findUnique({
        where: { email: emailValidation.normalized }
      })

      if (!user) {
        logWarning('AUTH', 'Login attempt with non-existent email', { email })
        throw new UnauthorizedError('Invalid email or password')
      }

      // Compare password
      logInfo('AUTH', 'Comparing password')
      const passwordMatch = await comparePassword(password, user.password)
      if (!passwordMatch) {
        logWarning('AUTH', 'Login attempt with incorrect password', { email, userId: user.id })
        throw new UnauthorizedError('Invalid email or password')
      }

      // Generate access token
      logInfo('AUTH', 'Generating access token')
      const accessToken = generateAccessToken(user.id)

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        walletAddress: user.walletAddress,
        did: user.did,
        didCreationStatus: user.didCreationStatus,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }

      logSuccess('AUTH', 'User login successful', { userId: user.id, email: user.email })
      return {
        accessToken,
        user: userData
      }
    } catch (error) {
      logError('AUTH', error, { operation: 'login', email })
      throw error
    }
  }

  // ====================================================================================
  // TOKEN VERIFICATION
  // ====================================================================================

  /**
   * * Verifies an access token and returns user data
   * @param token - JWT access token
   * @returns User data if token is valid
   */
  async verifyAccessToken(token: string): Promise<User> {
    logInfo('AUTH', 'Verifying access token')
    
    try {
      const verification = verifyToken(token)
      
      if (!verification.valid || !verification.payload) {
        logWarning('AUTH', 'Token verification failed', { error: verification.error })
        throw new UnauthorizedError('Invalid or expired token')
      }

      const userId = verification.payload.sub
      logInfo('AUTH', 'Token verified, looking up user', { userId })

      // Find user by ID
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          walletAddress: true,
          did: true,
          didCreationStatus: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        logWarning('AUTH', 'User not found for verified token', { userId })
        throw new UnauthorizedError('User not found')
      }

      logSuccess('AUTH', 'Access token verified successfully', { userId })
      return user
    } catch (error) {
      logError('AUTH', error, { operation: 'verifyAccessToken' })
      throw error
    }
  }

  // ====================================================================================
  // USER LOGOUT (PLACEHOLDER)
  // ====================================================================================

  /**
   * * Logs out a user by blacklisting their token
   * @param userId - User ID to log out
   * @param token - JWT token to blacklist (optional)
   */
  async logout(userId: string, token?: string): Promise<void> {
    logInfo('AUTH', 'Starting user logout', { userId })
    
    try {
      if (token) {
        // Blacklist the specific token
        logInfo('AUTH', 'Blacklisting token for logout')
        await this.tokenBlacklistService.blacklistToken(token, userId, 'User logout')
        logSuccess('AUTH', 'Token blacklisted successfully', { userId })
      } else {
        logInfo('AUTH', 'User logout without token', { userId })
      }
    } catch (error) {
      logError('AUTH', error, { operation: 'logout', userId })
      // Don't throw error - logout should not fail even if blacklisting fails
    }
  }

  // ====================================================================================
  // PASSWORD MANAGEMENT
  // ====================================================================================

  /**
   * * Changes a user's password
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    logInfo('AUTH', 'Starting password change', { userId })
    
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        logWarning('AUTH', 'Password change attempt for non-existent user', { userId })
        throw new UnauthorizedError('User not found')
      }

      // Verify current password
      logInfo('AUTH', 'Verifying current password')
      const passwordMatch = await comparePassword(currentPassword, user.password)
      if (!passwordMatch) {
        logWarning('AUTH', 'Password change with incorrect current password', { userId })
        throw new UnauthorizedError('Current password is incorrect')
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.valid) {
        logWarning('AUTH', 'Password change with invalid new password', { userId, errors: passwordValidation.errors })
        throw new ValidationError(`New password validation failed: ${passwordValidation.errors.join(', ')}`)
      }

      // Hash new password
      logInfo('AUTH', 'Hashing new password')
      const hashedNewPassword = await hashPassword(newPassword)

      // Update password
      logInfo('AUTH', 'Updating password in database')
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      })
      
      logSuccess('AUTH', 'Password changed successfully', { userId })
    } catch (error) {
      logError('AUTH', error, { operation: 'changePassword', userId })
      throw error
    }
  }

  // ====================================================================================
  // USER MANAGEMENT
  // ====================================================================================

  /**
   * * Finds a user by ID
   * @param userId - User ID
   * @returns User data or null
   */
  async findById(userId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  /**
   * * Finds a user by email
   * @param email - User's email
   * @returns User data or null
   */
  async findByEmail(email: string): Promise<User | null> {
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return null
    }

    return await this.prisma.user.findUnique({
      where: { email: emailValidation.normalized },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        did: true,
        didCreationStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  // ====================================================================================
  // HEALTH CHECK
  // ====================================================================================

  /**
   * * Checks if the authentication service is healthy
   * @returns Health status
   */
  async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`
      return { healthy: true }
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// ====================================================================================
// EXPORTS
// ====================================================================================

export type { LoginResult }
