// * Common type definitions for HealthLease application

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  service: string
  version?: string
}

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
}

// * Environment variables type
export interface Env {
  PORT?: string
  NODE_ENV?: 'development' | 'production' | 'test'
  DATABASE_URL?: string
  JWT_SECRET?: string
}

// * Request context type
export interface Context {
  env: Env
  user?: User
}

// * User type (placeholder)
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}
