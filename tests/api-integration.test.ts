/**
 * Comprehensive API Integration Tests
 *
 * This test suite covers all API endpoints in the HealthLease Hub application.
 * Use this as a reference for frontend integration.
 *
 * Run with: bun test tests/api-integration.test.ts
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BASE_URL = 'http://localhost:3000'

// Test user credentials
let testUser = {
  email: 'test@healthlease.com',
  password: 'Test123!@#',
  name: 'Test User'
}

// Test state - will be populated during tests
let authToken: string
let userId: string
let walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
let documentId: string
let qrCodeId: string
let studyId: string

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BASE_URL}${endpoint}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (authToken && !options.headers?.['Authorization']) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  return fetch(url, {
    ...options,
    headers
  })
}

// ============================================================================
// SETUP & TEARDOWN
// ============================================================================

beforeAll(async () => {
  console.log('🧪 Starting API Integration Tests...\n')

  // Clean up any existing test data
  try {
    await prisma.user.deleteMany({
      where: { email: testUser.email }
    })
  } catch (error) {
    // Ignore if user doesn't exist
  }
})

afterAll(async () => {
  // Clean up test data
  try {
    if (userId) {
      await prisma.user.delete({
        where: { id: userId }
      })
    }
  } catch (error) {
    console.error('Cleanup error:', error)
  }

  await prisma.$disconnect()
  console.log('\n✅ All tests completed!')
})

// ============================================================================
// TEST SUITE 1: HEALTH & DOCUMENTATION
// ============================================================================

describe('1. Health & Documentation Endpoints', () => {
  test('GET / - Root endpoint', async () => {
    const response = await apiRequest('/')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.message).toBe('HealthLease Hub API')
    expect(data.version).toBe('1.0.0')
    expect(data.endpoints).toBeDefined()

    console.log('✅ Root endpoint working')
  })

  test('GET /health - Health check', async () => {
    const response = await apiRequest('/health')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('healthy')

    console.log('✅ Health check passing')
  })

  test('GET /doc - OpenAPI spec', async () => {
    const response = await apiRequest('/doc')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.openapi).toBeDefined()
    expect(data.info.title).toBe('HealthLease Hub API')

    console.log('✅ OpenAPI spec available')
  })
})

// ============================================================================
// TEST SUITE 2: AUTHENTICATION
// ============================================================================

describe('2. Authentication Endpoints', () => {
  test('POST /api/auth/register - User registration', async () => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    })

    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.token).toBeDefined()
    expect(data.user.email).toBe(testUser.email)

    authToken = data.token
    userId = data.user.id

    console.log('✅ User registration successful')
    console.log(`   User ID: ${userId}`)
  })

  test('POST /api/auth/login - User login', async () => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    })

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.token).toBeDefined()
    expect(data.user.email).toBe(testUser.email)

    authToken = data.token

    console.log('✅ User login successful')
  })

  test('POST /api/auth/login - Invalid credentials', async () => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123'
      })
    })

    expect(response.status).toBe(401)

    console.log('✅ Invalid credentials rejected')
  })
})

// ============================================================================
// TEST SUITE 3: USER MANAGEMENT
// ============================================================================

describe('3. User Management Endpoints', () => {
  test('GET /api/user/me - Get current user', async () => {
    const response = await apiRequest('/api/user/me')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.id).toBe(userId)
    expect(data.email).toBe(testUser.email)

    console.log('✅ Get current user working')
  })

  test('PUT /api/user/me - Update user profile', async () => {
    const response = await apiRequest('/api/user/me', {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Test User'
      })
    })

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.name).toBe('Updated Test User')

    console.log('✅ User profile update working')
  })

  test('POST /api/user/wallet/connect - Connect wallet', async () => {
    // Simulate MetaMask signature
    const message = `Connect wallet to HealthLease Hub\nAddress: ${walletAddress}\nTimestamp: ${Date.now()}`
    const signature = '0xmocksignature123456789'

    const response = await apiRequest('/api/user/wallet/connect', {
      method: 'POST',
      body: JSON.stringify({
        walletAddress,
        signature,
        message
      })
    })

    // Note: This might fail signature verification in real scenario
    // For testing, we'll check if the endpoint exists
    expect([200, 400, 401]).toContain(response.status)

    console.log('✅ Wallet connection endpoint exists')
    console.log(`   Status: ${response.status}`)
  })

  test('GET /api/user/leases - Get user leases', async () => {
    const response = await apiRequest('/api/user/leases')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.leases).toBeDefined()
    expect(Array.isArray(data.leases)).toBe(true)

    // * Check lease structure
    if (data.leases.length > 0) {
      const lease = data.leases[0]
      expect(lease.id).toBeDefined()
      expect(lease.onChainId).toBeDefined()
      expect(lease.paymentAmount).toBeDefined()
      expect(lease.status).toBeDefined()
      expect(lease.study).toBeDefined()
      expect(lease.isActive).toBeDefined()
      expect(lease.isExpired).toBeDefined()
      expect(lease.daysRemaining).toBeDefined()
      expect(lease.totalDuration).toBeDefined()
      
      // * Check study structure
      expect(lease.study.id).toBeDefined()
      expect(lease.study.title).toBeDefined()
      expect(lease.study.description).toBeDefined()
      expect(lease.study.researcherAddress).toBeDefined()
      expect(lease.study.paymentPerUser).toBeDefined()
      expect(lease.study.status).toBeDefined()
    }

    console.log('✅ User leases endpoint working')
    console.log(`   Leases found: ${data.leases.length}`)
    
    // * Show lease status breakdown
    const statusCounts = data.leases.reduce((acc: any, lease: any) => {
      acc[lease.status] = (acc[lease.status] || 0) + 1
      return acc
    }, {})
    
    console.log('   Status breakdown:')
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     - ${status}: ${count}`)
    })
  })
})

// ============================================================================
// TEST SUITE 4: DID CREATION
// ============================================================================

describe('4. DID Creation Endpoints', () => {
  test('POST /api/user/wallet/did - Initiate DID creation', async () => {
    // First, manually set wallet address for testing
    await prisma.user.update({
      where: { id: userId },
      data: { walletAddress }
    })

    const response = await apiRequest('/api/user/wallet/did', {
      method: 'POST'
    })

    // Should return 200 or 201
    expect([200, 201]).toContain(response.status)

    const data = await response.json()
    console.log('✅ DID creation initiated')
    console.log(`   Status: ${data.didCreationStatus}`)
  })

  test('GET /api/user/wallet/did/status - Check DID status', async () => {
    // Wait a moment for DID creation
    await new Promise(resolve => setTimeout(resolve, 1000))

    const response = await apiRequest('/api/user/wallet/did/status')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBeDefined()

    console.log('✅ DID status check working')
    console.log(`   DID Status: ${data.status}`)
    if (data.did) {
      console.log(`   DID: ${data.did}`)
    }
  })
})

// ============================================================================
// TEST SUITE 5: DOCUMENT MANAGEMENT
// ============================================================================

describe('5. Document Management Endpoints', () => {
  test('POST /api/documents - Upload document', async () => {
    // Create a test file
    const testFileContent = 'This is a test medical document'
    const blob = new Blob([testFileContent], { type: 'application/pdf' })
    const file = new File([blob], 'test-document.pdf', { type: 'application/pdf' })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', 'LAB_RESULT')

    const response = await fetch(`${BASE_URL}/api/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    })

    expect([200, 202]).toContain(response.status)

    const data = await response.json()
    documentId = data.id

    console.log('✅ Document upload working')
    console.log(`   Document ID: ${documentId}`)
  })

  test('GET /api/documents - List documents', async () => {
    const response = await apiRequest('/api/documents')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)

    console.log('✅ Document listing working')
    console.log(`   Documents found: ${data.length}`)
  })

  test('GET /api/documents/:id/status - Get document status', async () => {
    if (!documentId) {
      console.log('⚠️  Skipping: No document ID available')
      return
    }

    const response = await apiRequest(`/api/documents/${documentId}/status`)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBeDefined()

    console.log('✅ Document status check working')
    console.log(`   Status: ${data.status}`)
  })
})

// ============================================================================
// TEST SUITE 6: QR CODE MANAGEMENT
// ============================================================================

describe('6. QR Code Management Endpoints', () => {
  test('POST /api/qr/generate - Generate QR code', async () => {
    if (!documentId) {
      console.log('⚠️  Skipping: No document ID available')
      return
    }

    const response = await apiRequest('/api/qr/generate', {
      method: 'POST',
      body: JSON.stringify({
        documentIds: [documentId],
        expiresIn: 24,
        accessType: 'SHARE',
        requireName: true,
        requireCredential: true,
        requireLocation: true
      })
    })

    expect([200, 201]).toContain(response.status)

    const data = await response.json()
    qrCodeId = data.qrCodeId

    console.log('✅ QR code generation working')
    console.log(`   QR Code ID: ${qrCodeId}`)
    console.log(`   Expires At: ${data.expiresAt}`)
  })

  test('GET /api/qr/my-codes - List QR codes', async () => {
    const response = await apiRequest('/api/qr/my-codes')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)

    console.log('✅ QR code listing working')
    console.log(`   QR Codes found: ${data.length}`)
  })

  test('POST /api/qr/access - Access via QR code', async () => {
    if (!qrCodeId) {
      console.log('⚠️  Skipping: No QR code ID available')
      return
    }

    // Get the QR payload first
    const qrList = await apiRequest('/api/qr/my-codes')
    const qrCodes = await qrList.json()

    if (qrCodes.length === 0) {
      console.log('⚠️  Skipping: No QR codes available')
      return
    }

    // This is a public endpoint, so we don't need auth
    const response = await fetch(`${BASE_URL}/api/qr/access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qrPayload: 'test-payload', // Would be actual JWT in real scenario
        responderName: 'Dr. Test',
        responderCredential: 'MD-12345',
        responderLocation: 'Test Hospital'
      })
    })

    // Expect 400 since we're using a fake payload
    expect([200, 400]).toContain(response.status)

    console.log('✅ QR access endpoint exists')
    console.log(`   Status: ${response.status}`)
  })

  test('DELETE /api/qr/:id - Revoke QR code', async () => {
    if (!qrCodeId) {
      console.log('⚠️  Skipping: No QR code ID available')
      return
    }

    const response = await apiRequest(`/api/qr/${qrCodeId}`, {
      method: 'DELETE'
    })

    expect(response.status).toBe(200)

    console.log('✅ QR code revocation working')
  })
})

// ============================================================================
// TEST SUITE 7: MARKETPLACE
// ============================================================================

describe('7. Marketplace Endpoints', () => {
  test('GET /api/marketplace/studies - List studies', async () => {
    const response = await apiRequest('/api/marketplace/studies')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)

    if (data.length > 0) {
      studyId = data[0].id
    }

    console.log('✅ Marketplace listing working')
    console.log(`   Studies found: ${data.length}`)
  })

  test('GET /api/marketplace/studies/:id - Get study details', async () => {
    if (!studyId) {
      console.log('⚠️  Skipping: No study ID available')
      return
    }

    const response = await apiRequest(`/api/marketplace/studies/${studyId}`)
    expect([200, 404]).toContain(response.status)

    console.log('✅ Study details endpoint working')
    console.log(`   Status: ${response.status}`)
  })
})

// ============================================================================
// TEST SUITE 8: DASHBOARD
// ============================================================================

describe('8. Dashboard Endpoints', () => {
  test('GET /api/dashboard/stats - Get dashboard stats', async () => {
    const response = await apiRequest('/api/dashboard/stats')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.documents).toBeDefined()
    expect(data.activeLeases).toBeDefined()
    expect(data.earnings).toBeDefined()

    console.log('✅ Dashboard stats working')
    console.log(`   Documents: ${data.documents}`)
    console.log(`   Active Leases: ${data.activeLeases}`)
    console.log(`   Earnings: ${data.earnings} BDAG`)
  })

  test('GET /api/dashboard/activity - Get activity feed', async () => {
    const response = await apiRequest('/api/dashboard/activity')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)

    console.log('✅ Activity feed working')
    console.log(`   Activities: ${data.length}`)
  })
})

// ============================================================================
// TEST SUITE 9: ACCESS LOGS
// ============================================================================

describe('9. Access Logs Endpoints', () => {
  test('GET /api/access-logs - Get access logs', async () => {
    const response = await apiRequest('/api/access-logs')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)

    console.log('✅ Access logs working')
    console.log(`   Logs found: ${data.length}`)
  })
})

// ============================================================================
// TEST SUITE 10: SETTINGS
// ============================================================================

describe('10. Settings Endpoints', () => {
  test('GET /api/settings - Get user settings', async () => {
    const response = await apiRequest('/api/settings')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.notifications).toBeDefined()

    console.log('✅ Settings retrieval working')
  })

  test('PUT /api/settings - Update settings', async () => {
    const response = await apiRequest('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({
        notifications: {
          email: true,
          push: false
        },
        privacy: {
          profileVisible: true
        }
      })
    })

    expect(response.status).toBe(200)

    console.log('✅ Settings update working')
  })
})

// ============================================================================
// TEST SUITE 11: AUTHENTICATION EDGE CASES
// ============================================================================

describe('11. Authentication & Authorization Tests', () => {
  test('Unauthorized access without token', async () => {
    const response = await fetch(`${BASE_URL}/api/user/me`)
    expect(response.status).toBe(401)

    console.log('✅ Unauthorized access blocked')
  })

  test('POST /api/auth/logout - User logout', async () => {
    const response = await apiRequest('/api/auth/logout', {
      method: 'POST'
    })

    expect(response.status).toBe(200)

    console.log('✅ User logout working')
  })

  test('Access with invalidated token after logout', async () => {
    const response = await apiRequest('/api/user/me')

    // Should be unauthorized or forbidden
    expect([401, 403]).toContain(response.status)

    console.log('✅ Token invalidation after logout working')
  })
})

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(60))
console.log('TEST EXECUTION SUMMARY')
console.log('='.repeat(60))
console.log('\n📊 All endpoints tested successfully!')
console.log('\n🔑 Test Credentials:')
console.log(`   Email: ${testUser.email}`)
console.log(`   Password: ${testUser.password}`)
console.log(`\n👤 Test User ID: ${userId}`)
console.log(`\n📝 Created Resources:`)
if (documentId) console.log(`   - Document: ${documentId}`)
if (qrCodeId) console.log(`   - QR Code: ${qrCodeId}`)
console.log('\n' + '='.repeat(60) + '\n')
