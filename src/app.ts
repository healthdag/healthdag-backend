import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

// * Main Hono application instance
const app = new Hono()

// * Middleware setup
app.use('*', logger())
app.use('*', cors())

// * Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'healthlease'
  })
})

// * Root endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'HealthLease API', 
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      user: '/api/user/*',
      documents: '/api/documents/*',
      marketplace: '/api/marketplace/*',
      emergency: '/api/emergency/*',
      dashboard: '/api/dashboard/*',
      accessLogs: '/api/access-logs'
    }
  })
})

// === AUTHENTICATION ENDPOINTS ===
app.post('/api/auth/register', (c) => {
  return c.json({ 
    id: 'user-123', 
    email: 'user@example.com' 
  }, 201)
})

app.post('/api/auth/login', (c) => {
  return c.json({ 
    accessToken: 'jwt-token-here',
    user: {
      id: 'user-123',
      email: 'user@example.com',
      name: 'John Doe',
      walletAddress: null,
      did: null
    }
  })
})

app.post('/api/auth/logout', (c) => {
  return c.json({ 
    message: 'Logged out successfully' 
  })
})

// === USER & WALLET ENDPOINTS ===
app.get('/api/user/me', (c) => {
  return c.json({
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe',
    walletAddress: '0x1234...5678',
    did: 'did:example:123456789',
    didCreationStatus: 'CONFIRMED'
  })
})

app.put('/api/user/me', (c) => {
  return c.json({
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe Updated',
    walletAddress: '0x1234...5678',
    did: 'did:example:123456789',
    didCreationStatus: 'CONFIRMED'
  })
})

app.post('/api/user/wallet/connect', (c) => {
  return c.json({
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe',
    walletAddress: '0x1234...5678',
    did: null,
    didCreationStatus: 'NONE'
  })
})

app.post('/api/user/wallet/did', (c) => {
  return c.json({ 
    id: 'user-123', 
    status: 'PENDING' 
  }, 202)
})

app.get('/api/user/wallet/did/status', (c) => {
  return c.json({ 
    status: 'CONFIRMED', 
    did: 'did:example:123456789' 
  })
})

// === DOCUMENT ENDPOINTS ===
app.post('/api/documents', (c) => {
  return c.json({ 
    id: 'doc-123', 
    status: 'PENDING' 
  }, 202)
})

app.get('/api/documents', (c) => {
  return c.json([
    {
      id: 'doc-123',
      onChainId: '123456789',
      category: 'LAB_RESULT',
      ipfsHash: 'QmHash123...',
      creationStatus: 'CONFIRMED',
      isActive: true,
      uploadedAt: '2024-01-01T00:00:00.000Z'
    }
  ])
})

app.get('/api/documents/:id/status', (c) => {
  const id = c.req.param('id')
  return c.json({ 
    status: 'CONFIRMED', 
    ipfsHash: 'QmHash123...', 
    onChainId: '123456789' 
  })
})

app.delete('/api/documents/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ 
    message: 'Document revoked successfully' 
  })
})

// === MARKETPLACE ENDPOINTS ===
app.get('/api/marketplace/studies', (c) => {
  return c.json([
    {
      id: 'study-123',
      onChainId: '987654321',
      title: 'Cardiovascular Health Study',
      researcherAddress: '0x9876...5432',
      paymentPerUser: '100.00000000',
      participantsNeeded: 100,
      participantsEnrolled: 45,
      status: 'Active'
    }
  ])
})

app.get('/api/marketplace/studies/:id', (c) => {
  const id = c.req.param('id')
  return c.json({
    id: 'study-123',
    onChainId: '987654321',
    title: 'Cardiovascular Health Study',
    description: 'A comprehensive study on cardiovascular health patterns...',
    researcherAddress: '0x9876...5432',
    metadataHash: 'QmMetadata123...',
    irbApprovalHash: 'QmIRB123...',
    paymentPerUser: '100.00000000',
    participantsNeeded: 100,
    participantsEnrolled: 45,
    status: 'Active'
  })
})

app.post('/api/marketplace/studies/:id/apply', (c) => {
  const id = c.req.param('id')
  return c.json({ 
    id: 'lease-123', 
    status: 'PENDING' 
  }, 202)
})

app.get('/api/marketplace/leases/:id/status', (c) => {
  const id = c.req.param('id')
  return c.json({ 
    status: 'CONFIRMED' 
  })
})

// === EMERGENCY ENDPOINTS ===
app.post('/api/emergency/qr', (c) => {
  return c.json({ 
    qrPayload: 'signed-qr-payload-here' 
  })
})

app.post('/api/emergency/access', (c) => {
  return c.json({
    patientData: {
      allergies: ['Penicillin', 'Shellfish'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      emergencyContact: 'Jane Doe - 555-1234',
      bloodType: 'O+'
    },
    expiresAt: '2024-01-01T04:00:00.000Z'
  })
})

// === DASHBOARD & ACCESS LOGS ENDPOINTS ===
app.get('/api/dashboard/stats', (c) => {
  return c.json({ 
    documentCount: 5, 
    activeLeases: 2, 
    totalEarned: '250.00000000' 
  })
})

app.get('/api/access-logs', (c) => {
  return c.json([
    {
      responderName: 'Dr. Smith',
      responderCredential: 'EMT-12345',
      accessTime: '2024-01-01T02:30:00.000Z',
      dataAccessed: ['allergies', 'medications']
    }
  ])
})

// * Start server
const port = process.env.PORT || 3000

console.log(`🚀 HealthLease server starting on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
