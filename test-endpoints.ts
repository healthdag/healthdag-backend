#!/usr/bin/env bun

/**
 * HealthLease Hub API Endpoint Tester
 * 
 * Interactive and non-interactive testing script for all API endpoints
 * Supports authentication flow and comprehensive endpoint testing
 */

import inquirer from 'inquirer'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import chalk from 'chalk'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// * Configuration
const CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
}

// * Types
interface TestResult {
  endpoint: string
  method: string
  status: 'success' | 'error' | 'skipped'
  statusCode?: number
  responseTime?: number
  error?: string
  data?: any
}

interface AuthCredentials {
  email: string
  password: string
}

interface TestSession {
  token?: string
  user?: any
  results: TestResult[]
  startTime: Date
}

// * Global test session
let testSession: TestSession = {
  results: [],
  startTime: new Date()
}

// * Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: CONFIG.baseUrl,
  timeout: CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// * Add request interceptor for authentication
api.interceptors.request.use((config) => {
  if (testSession.token) {
    config.headers.Authorization = `Bearer ${testSession.token}`
  }
  return config
})

// * Add response interceptor for logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(chalk.red(`Request failed: ${error.message}`))
    return Promise.reject(error)
  }
)

// * Utility functions
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const formatResponseTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

const printResult = (result: TestResult): void => {
  const { endpoint, method, status, statusCode, responseTime, error } = result
  
  const methodColor = method === 'GET' ? chalk.blue : 
                     method === 'POST' ? chalk.green :
                     method === 'PUT' ? chalk.yellow : chalk.red
  
  const statusColor = status === 'success' ? chalk.green :
                     status === 'error' ? chalk.red : chalk.yellow
  
  const timeStr = responseTime ? ` (${formatResponseTime(responseTime)})` : ''
  
  console.log(`${methodColor(method.padEnd(6))} ${endpoint.padEnd(50)} ${statusColor(status.toUpperCase())} ${statusCode || 'N/A'}${timeStr}`)
  
  if (error) {
    console.log(chalk.red(`  Error: ${error}`))
  }
}

const printSummary = (): void => {
  const { results } = testSession
  const total = results.length
  const successful = results.filter(r => r.status === 'success').length
  const failed = results.filter(r => r.status === 'error').length
  const skipped = results.filter(r => r.status === 'skipped').length
  
  const duration = Date.now() - testSession.startTime.getTime()
  
  console.log(chalk.cyan('\n' + '='.repeat(60)))
  console.log(chalk.cyan('TEST SUMMARY'))
  console.log(chalk.cyan('='.repeat(60)))
  console.log(`Total Tests: ${total}`)
  console.log(chalk.green(`Successful: ${successful}`))
  console.log(chalk.red(`Failed: ${failed}`))
  console.log(chalk.yellow(`Skipped: ${skipped}`))
  console.log(`Duration: ${formatResponseTime(duration)}`)
  console.log(chalk.cyan('='.repeat(60)))
}

// * Authentication functions
const authenticate = async (credentials: AuthCredentials): Promise<boolean> => {
  try {
    console.log(chalk.blue('🔐 Authenticating...'))
    
    const response = await api.post('/api/auth/login', credentials)
    
    if (response.status === 200 && response.data.accessToken) {
      testSession.token = response.data.accessToken
      testSession.user = response.data.user
      
      console.log(chalk.green('✅ Authentication successful'))
      console.log(chalk.gray(`User: ${response.data.user.email}`))
      return true
    }
    
    console.log(chalk.red('❌ Authentication failed: Invalid response'))
    return false
  } catch (error: any) {
    console.log(chalk.red(`❌ Authentication failed: ${error.response?.data?.error || error.message}`))
    return false
  }
}

const registerUser = async (credentials: AuthCredentials): Promise<boolean> => {
  try {
    console.log(chalk.blue('📝 Registering new user...'))
    
    const response = await api.post('/api/auth/register', {
      email: credentials.email,
      password: credentials.password,
      name: 'Test User'
    })
    
    if (response.status === 201) {
      console.log(chalk.green('✅ Registration successful'))
      return true
    }
    
    console.log(chalk.red('❌ Registration failed: Invalid response'))
    return false
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log(chalk.yellow('⚠️  User already exists, attempting login...'))
      return await authenticate(credentials)
    }
    
    console.log(chalk.red(`❌ Registration failed: ${error.response?.data?.error || error.message}`))
    return false
  }
}

// * Test functions
const testEndpoint = async (endpoint: string, method: string, data?: any): Promise<TestResult> => {
  const startTime = Date.now()
  
  try {
    let response: AxiosResponse
    
    switch (method.toUpperCase()) {
      case 'GET':
        response = await api.get(endpoint)
        break
      case 'POST':
        response = await api.post(endpoint, data)
        break
      case 'PUT':
        response = await api.put(endpoint, data)
        break
      case 'DELETE':
        response = await api.delete(endpoint)
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
    
    const responseTime = Date.now() - startTime
    
    return {
      endpoint,
      method: method.toUpperCase(),
      status: 'success',
      statusCode: response.status,
      responseTime,
      data: response.data
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    
    return {
      endpoint,
      method: method.toUpperCase(),
      status: 'error',
      statusCode: error.response?.status,
      responseTime,
      error: error.response?.data?.error || error.message
    }
  }
}

// * Endpoint definitions
const ENDPOINTS = {
  // * Authentication endpoints
  auth: [
    { endpoint: '/api/auth/register', method: 'POST', data: { email: 'test@example.com', password: 'password123', name: 'Test User' }, requiresAuth: false },
    { endpoint: '/api/auth/login', method: 'POST', data: { email: 'test@example.com', password: 'password123' }, requiresAuth: false },
    { endpoint: '/api/auth/logout', method: 'POST', requiresAuth: true },
  ],
  
  // * User endpoints
  user: [
    { endpoint: '/api/user/me', method: 'GET', requiresAuth: true },
    { endpoint: '/api/user/me', method: 'PUT', data: { name: 'Updated Test User' }, requiresAuth: true },
    { endpoint: '/api/user/wallet/connect', method: 'POST', data: { walletAddress: '0x1234567890123456789012345678901234567890', signature: 'mock-signature' }, requiresAuth: true },
    { endpoint: '/api/user/wallet/did', method: 'POST', requiresAuth: true },
    { endpoint: '/api/user/wallet/did/status', method: 'GET', requiresAuth: true },
  ],
  
  // * Document endpoints
  documents: [
    { endpoint: '/api/documents', method: 'GET', requiresAuth: true },
    { endpoint: '/api/documents', method: 'POST', data: { name: 'Test Document', type: 'lab_results' }, requiresAuth: true },
    { endpoint: '/api/documents/test-doc-id', method: 'GET', requiresAuth: true },
  ],
  
  // * Marketplace endpoints
  marketplace: [
    { endpoint: '/api/marketplace/studies', method: 'GET', requiresAuth: true },
    { endpoint: '/api/marketplace/studies/study_123', method: 'GET', requiresAuth: true },
    { endpoint: '/api/marketplace/studies/study_123/apply', method: 'POST', requiresAuth: true },
    { endpoint: '/api/marketplace/leases/lease_123/status', method: 'GET', requiresAuth: true },
  ],
  
  // * Emergency endpoints
  emergency: [
    { endpoint: '/api/emergency/qr', method: 'POST', data: { dataToInclude: ['allergies', 'medications'] }, requiresAuth: true },
    { endpoint: '/api/emergency/access', method: 'POST', data: { qrPayload: 'mock-qr-payload', responderInfo: { name: 'Dr. Test', credential: 'TEST-123' } }, requiresAuth: false },
  ],
  
  // * Dashboard endpoints
  dashboard: [
    { endpoint: '/api/dashboard/stats', method: 'GET', requiresAuth: true },
    { endpoint: '/api/dashboard/activity', method: 'GET', requiresAuth: true },
  ],
  
  // * Settings endpoints
  settings: [
    { endpoint: '/api/settings', method: 'GET', requiresAuth: true },
    { endpoint: '/api/settings', method: 'PUT', data: { name: 'Updated Settings User' }, requiresAuth: true },
  ],
  
  // * Access logs endpoints
  accessLogs: [
    { endpoint: '/api/access-logs', method: 'GET', requiresAuth: true },
  ],
  
  // * System endpoints
  system: [
    { endpoint: '/health', method: 'GET', requiresAuth: false },
    { endpoint: '/', method: 'GET', requiresAuth: false },
  ],
}

// * Test execution functions
const runSingleTest = async (endpoint: any): Promise<void> => {
  if (endpoint.requiresAuth && !testSession.token) {
    console.log(chalk.yellow(`⚠️  Skipping ${endpoint.endpoint} - Authentication required`))
    testSession.results.push({
      endpoint: endpoint.endpoint,
      method: endpoint.method,
      status: 'skipped',
      error: 'Authentication required'
    })
    return
  }
  
  console.log(chalk.blue(`Testing ${endpoint.method} ${endpoint.endpoint}...`))
  
  const result = await testEndpoint(endpoint.endpoint, endpoint.method, endpoint.data)
  testSession.results.push(result)
  printResult(result)
}

const runCategoryTests = async (category: string): Promise<void> => {
  const endpoints = ENDPOINTS[category as keyof typeof ENDPOINTS]
  if (!endpoints) {
    console.log(chalk.red(`❌ Unknown category: ${category}`))
    return
  }
  
  console.log(chalk.cyan(`\n🧪 Testing ${category.toUpperCase()} endpoints`))
  console.log(chalk.gray('-'.repeat(60)))
  
  for (const endpoint of endpoints) {
    await runSingleTest(endpoint)
    await delay(500) // * Small delay between requests
  }
}

const runAllTests = async (): Promise<void> => {
  console.log(chalk.cyan('\n🚀 Running all endpoint tests'))
  console.log(chalk.gray('='.repeat(60)))
  
  for (const [category, endpoints] of Object.entries(ENDPOINTS)) {
    await runCategoryTests(category)
    await delay(1000) // * Delay between categories
  }
}

// * Interactive mode functions
const showMainMenu = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🔐 Authenticate', value: 'auth' },
        { name: '🧪 Test Single Endpoint', value: 'single' },
        { name: '📁 Test Category', value: 'category' },
        { name: '🚀 Test All Endpoints', value: 'all' },
        { name: '📊 View Results', value: 'results' },
        { name: '❌ Exit', value: 'exit' },
      ],
    },
  ])
  
  switch (action) {
    case 'auth':
      await handleAuthentication()
      break
    case 'single':
      await handleSingleTest()
      break
    case 'category':
      await handleCategoryTest()
      break
    case 'all':
      await runAllTests()
      printSummary()
      break
    case 'results':
      showResults()
      break
    case 'exit':
      console.log(chalk.green('👋 Goodbye!'))
      process.exit(0)
  }
  
  // * Return to main menu
  await showMainMenu()
}

const handleAuthentication = async (): Promise<void> => {
  const { email, password } = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Email:',
      default: 'test@example.com',
      validate: (input) => input.includes('@') || 'Please enter a valid email',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
      default: 'password123',
      mask: '*',
    },
  ])
  
  // * Try to register first, then login
  const success = await registerUser({ email, password })
  
  if (success) {
    console.log(chalk.green('✅ Ready to test authenticated endpoints!'))
  } else {
    console.log(chalk.red('❌ Authentication failed. Some endpoints will be skipped.'))
  }
}

const handleSingleTest = async (): Promise<void> => {
  // * Flatten all endpoints for selection
  const allEndpoints = Object.entries(ENDPOINTS).flatMap(([category, endpoints]) =>
    endpoints.map(endpoint => ({
      name: `${endpoint.method} ${endpoint.endpoint} (${category})`,
      value: endpoint,
    }))
  )
  
  const { endpoint } = await inquirer.prompt([
    {
      type: 'list',
      name: 'endpoint',
      message: 'Select endpoint to test:',
      choices: allEndpoints,
    },
  ])
  
  await runSingleTest(endpoint)
}

const handleCategoryTest = async (): Promise<void> => {
  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: 'Select category to test:',
      choices: Object.keys(ENDPOINTS).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
      })),
    },
  ])
  
  await runCategoryTests(category)
  printSummary()
}

const showResults = (): void => {
  if (testSession.results.length === 0) {
    console.log(chalk.yellow('No test results available yet.'))
    return
  }
  
  console.log(chalk.cyan('\n📊 Test Results'))
  console.log(chalk.gray('-'.repeat(60)))
  
  testSession.results.forEach(printResult)
  printSummary()
}

// * Non-interactive mode
const runNonInteractiveMode = async (): Promise<void> => {
  console.log(chalk.cyan('🤖 Running in non-interactive mode'))
  console.log(chalk.gray('='.repeat(60)))
  
  // * Try to authenticate with default credentials
  const authSuccess = await registerUser({ email: 'test@example.com', password: 'password123' })
  
  if (!authSuccess) {
    console.log(chalk.yellow('⚠️  Authentication failed, testing only public endpoints'))
  }
  
  // * Run all tests
  await runAllTests()
  printSummary()
  
  // * Exit with appropriate code
  const failedTests = testSession.results.filter(r => r.status === 'error').length
  process.exit(failedTests > 0 ? 1 : 0)
}

// * Main function
const main = async (): Promise<void> => {
  console.log(chalk.cyan('🏥 HealthLease Hub API Endpoint Tester'))
  console.log(chalk.gray('='.repeat(60)))
  console.log(`Base URL: ${CONFIG.baseUrl}`)
  console.log(`Timeout: ${CONFIG.timeout}ms`)
  console.log(chalk.gray('='.repeat(60)))
  
  // * Check if running in non-interactive mode
  const isNonInteractive = process.argv.includes('--non-interactive') || process.argv.includes('-n')
  
  if (isNonInteractive) {
    await runNonInteractiveMode()
  } else {
    await showMainMenu()
  }
}

// * Handle errors
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled rejection:'), error)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught exception:'), error)
  process.exit(1)
})

// * Start the application
if (import.meta.main) {
  main().catch((error) => {
    console.error(chalk.red('Fatal error:'), error)
    process.exit(1)
  })
}

export { main, testEndpoint, authenticate, ENDPOINTS }
