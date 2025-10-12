// * Authentication service for HealthLease Hub
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password-util'
import { generateAccessToken, verifyToken } from '../utils/jwt-util'
import { validateEmail, validatePassword } from '../utils/validation-util'
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

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
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
    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      throw new ValidationError(emailValidation.error || 'Invalid email format')
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      throw new ValidationError(`Password validation failed: ${passwordValidation.errors.join(', ')}`)
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: emailValidation.normalized }
    })

    if (existingUser) {
      throw new ConflictError('An account with this email already exists')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
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

    return user
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
    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: emailValidation.normalized }
    })

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Compare password
    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate access token
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

    return {
      accessToken,
      user: userData
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
    const verification = verifyToken(token)
    
    if (!verification.valid || !verification.payload) {
      throw new UnauthorizedError('Invalid or expired token')
    }

    const userId = verification.payload.sub

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
      throw new UnauthorizedError('User not found')
    }

    return user
  }

  // ====================================================================================
  // USER LOGOUT (PLACEHOLDER)
  // ====================================================================================

  /**
   * * Logs out a user (placeholder for future token blacklisting)
   * @param userId - User ID to log out
   */
  async logout(userId: string): Promise<void> {
    // TODO: Implement token blacklisting in the future
    // For now, this is a placeholder as the system is stateless
    // In a production system, you might want to:
    // 1. Add tokens to a blacklist
    // 2. Store logout events for audit purposes
    // 3. Implement refresh token rotation
    
    console.log(`User ${userId} logged out`)
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
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    // Verify current password
    const passwordMatch = await comparePassword(currentPassword, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedError('Current password is incorrect')
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      throw new ValidationError(`New password validation failed: ${passwordValidation.errors.join(', ')}`)
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })
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
