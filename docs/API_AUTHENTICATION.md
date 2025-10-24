# API Authentication Guide

This guide explains how to authenticate with the HealthLease Hub API using Bearer tokens.

## Overview

The HealthLease Hub API uses **JWT (JSON Web Token)** based authentication with Bearer tokens. All protected endpoints require a valid JWT token to be included in the `Authorization` header.

## Quick Start

### 1. Register a New Account
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": null,
    "isVerified": false
  }
}
```

### 2. Login to Get Access Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": null,
      "isVerified": false
    }
  }
}
```

### 3. Use the Token for Protected Endpoints
```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json"
```

## Authentication Details

### Token Format
```
Authorization: Bearer <jwt_token>
```

### Token Structure
The JWT token contains the following payload:
```json
{
  "sub": "user_123",        // User ID
  "iat": 1640995200,        // Issued at timestamp
  "exp": 1640996100         // Expiration timestamp (15 minutes)
}
```

### Token Expiration
- **Access Token Lifetime**: 15 minutes
- **Refresh Strategy**: Re-authenticate via `/api/auth/login` when token expires
- **Security**: Tokens are stateless and contain user ID in the payload

## Protected Endpoints

The following endpoints require authentication:

### User Management
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update user profile
- `POST /api/user/wallet/connect` - Connect Web3 wallet

### Documents
- `GET /api/documents` - List user documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

### Marketplace
- `GET /api/marketplace/studies` - Browse research studies
- `POST /api/marketplace/studies/:id/apply` - Apply to study

### Dashboard
- `GET /api/dashboard/activity` - Get activity feed
- `GET /api/dashboard/stats` - Get user statistics

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### QR Codes
- `POST /api/qr/generate` - Generate QR code
- `GET /api/qr/:id` - Get QR code details

### Access Logs
- `GET /api/access-logs` - Get access history

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

### 401 Token Expired
```json
{
  "error": "Unauthorized", 
  "message": "Invalid or expired token"
}
```

### 401 Token Revoked
```json
{
  "error": "Unauthorized",
  "message": "Token has been revoked"
}
```

## Security Best Practices

### 1. Token Storage
- **Never** store tokens in localStorage or sessionStorage
- Use secure storage mechanisms (e.g., httpOnly cookies, secure memory)
- Implement token refresh logic

### 2. Token Transmission
- **Always** use HTTPS in production
- Include tokens only in the Authorization header
- Never include tokens in URL parameters or request bodies

### 3. Token Management
- Implement automatic token refresh
- Handle token expiration gracefully
- Provide clear error messages for authentication failures

## Example Implementation

### JavaScript/TypeScript
```typescript
class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    if (data.success) {
      this.token = data.data.accessToken
    }
    return data
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    })
  }
}
```

### Python
```python
import requests

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
    
    def login(self, email, password):
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={"email": email, "password": password}
        )
        data = response.json()
        if data.get("success"):
            self.token = data["data"]["accessToken"]
        return data
    
    def request(self, endpoint, method="GET", **kwargs):
        headers = kwargs.get("headers", {})
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        kwargs["headers"] = headers
        
        return requests.request(method, f"{self.base_url}{endpoint}", **kwargs)
```

## API Documentation

- **OpenAPI Spec**: `http://localhost:3000/doc`
- **Swagger UI**: `http://localhost:3000/ui`
- **Scalar API Reference**: `http://localhost:3000/scalar`

The API documentation includes interactive examples and allows you to test endpoints directly with authentication.
