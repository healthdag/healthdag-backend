# HealthLease Hub Backend

> **A decentralized healthcare data marketplace platform** that empowers users to securely store, manage, and monetize their health data through blockchain technology, IPFS storage, and smart contracts.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.2-black)](https://bun.sh)
[![Hono](https://img.shields.io/badge/Hono-4.4-lightgrey)](https://hono.dev)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red)](LICENSE)

## 🎯 Overview

HealthLease Hub is a **Web3 healthcare data marketplace** that enables:

- 🔐 **Secure Document Storage**: Encrypted health documents stored on IPFS with blockchain verification
- 🆔 **Decentralized Identity**: DID (Decentralized Identifier) creation and management on BlockDAG blockchain
- 💰 **Data Monetization**: Lease health data to researchers through a transparent marketplace
- 🚨 **Emergency Access**: QR code-based emergency access system for first responders
- 📊 **Research Participation**: Browse and apply to research studies with automatic payment processing

## 📖 About HealthLease Hub

### The Problem

Traditional healthcare data management suffers from critical issues:

- **Lack of Ownership**: Patients have little to no control over their health data
- **Privacy Concerns**: Centralized systems are vulnerable to breaches and misuse
- **No Compensation**: Patients don't benefit financially when their data is used for research
- **Emergency Access Barriers**: Critical health information isn't easily accessible during emergencies
- **Research Inefficiency**: Researchers struggle to find and access consented health data

### The Solution

HealthLease Hub empowers patients to **own, control, and monetize** their health data through:

- **Decentralized Storage**: Health documents stored on IPFS (InterPlanetary File System) with blockchain verification
- **Self-Sovereign Identity**: DID (Decentralized Identifier) on BlockDAG blockchain for verifiable identity
- **Transparent Marketplace**: Direct connection between data owners and researchers with automatic payment processing
- **Emergency Access**: QR code system for instant, secure access by authorized first responders
- **Smart Contracts**: Automated data leasing, access control, and payment processing

### Target Users

#### 👤 Patients / Data Owners
- Individuals who want to securely store their health records
- People seeking to monetize their health data through research participation
- Patients who need emergency access to their medical information
- Users who value privacy and data ownership

#### 🔬 Researchers / Study Creators
- Medical researchers conducting clinical studies
- Pharmaceutical companies needing diverse health data
- Academic institutions performing health research
- Organizations requiring consented, verified health data

### How It Works

#### Complete User Journey

```
1. Registration & Login
   ↓
2. Connect Wallet (MetaMask with signature verification)
   ↓
3. DID Generation (Automatic decentralized identity creation)
   ↓
4. Upload Health Documents (Encrypted storage on IPFS)
   ↓
5. Generate QR Codes (For emergency access or data sharing)
   ↓
6. Browse Research Studies (Marketplace with study details)
   ↓
7. Apply to Studies (Select documents, automatic data lease)
   ↓
8. Earn & Track (Automatic payments via smart contracts)
```

#### Key Workflows

**Document Upload Flow:**
1. User uploads health document (lab results, imaging, prescriptions, etc.)
2. Document is encrypted before storage
3. File is uploaded to IPFS (decentralized storage)
4. Document metadata is registered on blockchain via DID Registry
5. User receives confirmation with IPFS hash and blockchain transaction ID

**Research Study Application:**
1. Researcher creates study with requirements and payment per participant
2. Study is published on marketplace with IRB approval verification
3. Patient browses studies and selects relevant ones
4. Patient applies by selecting which documents to share
5. Smart contract creates data lease with specified duration
6. Payment is escrowed and automatically released upon lease activation
7. Researcher gains access to consented, anonymized data

**Emergency Access Flow:**
1. Patient generates QR code with configurable access requirements
2. QR code contains signed JWT token with access permissions
3. First responder scans QR code during emergency
4. System verifies responder credentials (name, credential, location)
5. Access is granted for specified duration
6. All access events are logged on blockchain for audit trail

### Value Propositions

#### For Patients
- ✅ **True Data Ownership**: Your health data belongs to you, stored on decentralized IPFS
- ✅ **Monetization Opportunity**: Earn from research participation with transparent pricing
- ✅ **Privacy & Security**: End-to-end encryption with blockchain verification
- ✅ **Emergency Preparedness**: Instant access for authorized responders via QR codes
- ✅ **Transparency**: See exactly who accessed your data and when

#### For Researchers
- ✅ **Access to Quality Data**: Verified, consented health data from diverse populations
- ✅ **Streamlined Process**: Automated data leasing and payment processing
- ✅ **Compliance Ready**: Built-in consent management and audit trails
- ✅ **Cost Efficiency**: Direct marketplace eliminates intermediaries
- ✅ **Trust & Verification**: Blockchain-verified data integrity and DID-based identity

### Key Differentiators

- 🔗 **Blockchain-Powered**: Built on BlockDAG network for scalability and low transaction costs
- 🌐 **Decentralized Storage**: IPFS ensures data availability without single points of failure
- 🔐 **Privacy-First**: Per-document encryption before storage, user-controlled access
- 💎 **Self-Sovereign Identity**: DID-based identity management, no reliance on centralized providers
- ⚡ **Automated Payments**: Smart contracts handle escrow and payments automatically
- 📱 **Emergency Ready**: QR code system for critical access scenarios
- 📊 **Transparent Marketplace**: Clear pricing, study requirements, and payment terms

## ✨ Key Features

### 🔑 Authentication & User Management
- JWT-based authentication with token blacklisting
- User registration and profile management
- Wallet connection with signature verification
- DID creation and status tracking

### 📄 Document Management
- Secure document upload with IPFS integration
- Per-document encryption before storage
- Document categorization (Lab Results, Imaging, Prescriptions, Visit Notes, Profile)
- Async processing with status polling
- Document deletion and lifecycle management

### 🏪 Marketplace
- Browse active research studies
- Study details and requirements
- One-click study application
- Automatic data lease creation
- Payment processing via smart contracts

### 🚨 Emergency Access
- QR code generation for emergency access
- Configurable access requirements (name, credential, location)
- Time-limited access grants
- Comprehensive access logging

### 📊 Dashboard & Analytics
- User statistics (documents, leases, earnings)
- Activity feed with recent events
- Access logs for emergency access
- Study participation tracking

## 🏗️ Architecture

### Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Bun | 1.2+ | Fast JavaScript runtime |
| **Framework** | Hono | 4.4+ | Lightweight web framework |
| **Database** | PostgreSQL | 15+ | Relational database |
| **ORM** | Prisma | 5.14+ | Type-safe database client |
| **Blockchain** | BlockDAG (Awakening) | - | EVM-compatible blockchain |
| **Web3** | Ethers.js | 6.15+ | Blockchain interaction library |
| **Storage** | IPFS (Pinata) | - | Decentralized file storage |
| **Auth** | JWT + bcrypt | - | Authentication & password hashing |
| **Validation** | Zod | 3.23+ | Schema validation |
| **API Docs** | OpenAPI + Scalar | - | Interactive API documentation |

### Project Structure

```
healthlease-hub-backend/
├── src/
│   ├── core/                      # Core services and utilities
│   │   ├── blockchain/            # Blockchain service layer
│   │   │   ├── did-registry-service.ts
│   │   │   ├── data-lease-service.ts
│   │   │   ├── emergency-access-service.ts
│   │   │   ├── marketplace-service.ts
│   │   │   └── payment-processor-service.ts
│   │   ├── middleware/            # Custom middleware
│   │   │   ├── auth-middleware.ts
│   │   │   └── rate-limit-middleware.ts
│   │   ├── services/              # Core services
│   │   │   ├── auth-service.ts
│   │   │   ├── ipfs-service.ts
│   │   │   ├── prisma-service.ts
│   │   │   ├── qr-service.ts
│   │   │   ├── user-service.ts
│   │   │   └── web3-service.ts
│   │   ├── types/                 # TypeScript type definitions
│   │   └── utils/                 # Utility functions
│   ├── features/                  # Feature modules
│   │   ├── auth/                  # Authentication
│   │   ├── dashboard/             # Dashboard & analytics
│   │   ├── documents/             # Document management
│   │   ├── emergency/             # Emergency access
│   │   ├── marketplace/           # Research marketplace
│   │   ├── qr/                    # QR code generation
│   │   └── user/                  # User management
│   ├── routes/                    # API route definitions
│   └── server.ts                  # Application entry point
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── docs/                          # Documentation
├── tests/                         # Test files
└── dist/                          # Build output
```

## 🚀 Quick Start

### Prerequisites

- **Bun** 1.2+ ([Install Bun](https://bun.sh))
- **PostgreSQL** 15+ (or compatible database)
- **Node.js** 18+ (optional, Bun recommended)
- **BlockDAG Network** access (Awakening testnet)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd healthlease-hub-backend

# Install dependencies
bun install

# Copy environment variables template
cp env.example .env

# Configure your .env file (see Environment Variables section)
```

### Database Setup

```bash
# Generate Prisma client
bun run generate

# Run database migrations
bun run migrate:dev

# (Optional) Open Prisma Studio to view database
bun run studio
```

### Development

```bash
# Start development server with hot reload
bun run dev

# The server will start on http://localhost:3000
```

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## 📋 Environment Variables

Copy `env.example` to `.env` and configure the following variables:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Application
NODE_ENV=development
PORT=3000

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Blockchain Configuration

```env
# BlockDAG Network (Awakening Testnet)
RPC_URL=https://rpc.awakening.bdagscan.com
PRIVATE_KEY=your_private_key_here
BLOCKDAG_NETWORK=testnet

# Smart Contract Addresses
DID_REGISTRY_ADDRESS=0x599DA0AD70492beb6F41FB68371Df0048Ff4592f
DATA_LEASE_ADDRESS=0x05660dC688FaE10BeccBe7195f8F16041Ce6E8B4
PAYMENT_PROCESSOR_ADDRESS=0x5C335809FCBE036Ec5862F706da35c01825c1F3B
EMERGENCY_ACCESS_ADDRESS=0x2AB757f5E983A4abe3cc24eAFd213002a8Af0690
MARKETPLACE_ADDRESS=0x1006Af1736348d7C60901F379A8D0172BFbF52d1
```

### IPFS Configuration (Pinata)

```env
# Pinata IPFS Service
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token
PINATA_GATEWAY=https://gateway.pinata.cloud
PINATA_GATEWAY_URL=https://gateway.pinata.cloud/ipfs/
```

### Optional Configuration

```env
# Logging
LOG_LEVEL=info
DEBUG=false

# API Documentation
ENABLE_DOCS=true

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
```

See `env.example` for a complete list of all available environment variables.

## 📚 API Documentation

### Interactive Documentation

Once the server is running, access the API documentation:

- **Swagger UI**: http://localhost:3000/ui
- **Scalar API Reference**: http://localhost:3000/scalar
- **OpenAPI Spec (JSON)**: http://localhost:3000/doc

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/logout` - Logout (blacklists token)

#### User Management (`/api/user`)
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/me` - Update user profile
- `POST /api/user/wallet/connect` - Connect wallet with signature
- `POST /api/user/wallet/did` - Create DID (async)
- `GET /api/user/wallet/did/status` - Check DID creation status

#### Documents (`/api/documents`)
- `POST /api/documents` - Upload document (multipart/form-data)
- `GET /api/documents` - List user documents
- `GET /api/documents/:id/status` - Check upload status
- `DELETE /api/documents/:id` - Delete document

#### Marketplace (`/api/marketplace`)
- `GET /api/marketplace/studies` - List active studies
- `GET /api/marketplace/studies/:id` - Get study details
- `POST /api/marketplace/studies/:id/apply` - Apply to study
- `GET /api/marketplace/studies/:id/lease/status` - Check lease status

#### Emergency Access (`/api/emergency`)
- `POST /api/emergency/qr` - Generate emergency QR code
- `POST /api/emergency/access` - Grant emergency access

#### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/activity` - Get recent activity feed

#### QR Codes (`/api/qr`)
- `GET /api/qr` - List user QR codes
- `POST /api/qr` - Generate QR code
- `DELETE /api/qr/:id` - Revoke QR code

#### Access Logs (`/api/access-logs`)
- `GET /api/access-logs` - Get emergency access logs

#### Settings (`/api/settings`)
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

#### Health Check
- `GET /health` - Health check endpoint
- `GET /` - API information and endpoint list

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Example Request

```bash
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t healthlease-hub-backend:latest .

# Or use the build script
./docker-build.sh
```

### Run Container

```bash
docker run -d \
  --name healthlease-backend \
  -p 3000:3000 \
  --env-file .env \
  healthlease-hub-backend:latest
```

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

## 🧪 Testing

```bash
# Run tests
bun test

# Run type checking
bun run type-check
```

## 📖 Documentation

Additional documentation is available in the `docs/` directory:

- [API Authentication Guide](./docs/AUTH.md)
- [Blockchain Integration](./docs/BLOCKCHAIN.md)
- [Error Logging Guide](./docs/ERROR_LOGGING.md)
- [Frontend Schema Specification](./docs/FRONTEND_SCHEMA_SPECIFICATION.md)
- [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)
- [Docker Setup](./DOCKER.md)

## 🏗️ Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server with hot reload

# Production
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run generate         # Generate Prisma client
bun run migrate:dev      # Run database migrations (dev)
bun run migrate:deploy   # Run database migrations (production)
bun run studio           # Open Prisma Studio

# Testing & Quality
bun test                 # Run tests
bun run type-check       # TypeScript type checking
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: Follow TypeScript best practices
- **Comments**: Use Better Comments style (`// *`, `// !`, `// ?`, `// TODO:`)
- **Architecture**: Feature-based organization with service layer pattern

## 🔒 Security Considerations

- **JWT Tokens**: Short-lived (15 minutes) with blacklisting support
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Zod schemas for all API inputs
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Built-in rate limiting middleware
- **Sensitive Data**: Automatic redaction in logs
- **Non-root User**: Docker containers run as non-root user

## 🚧 Project Status

**Current Version**: 1.0.0

### ✅ Completed Features
- User authentication and authorization
- Document upload and management with IPFS
- DID creation and management
- Marketplace integration
- Emergency access system
- QR code generation
- Dashboard and analytics
- Comprehensive API documentation

### 🔄 In Progress
- Enhanced error handling
- Performance optimization
- Additional test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is **UNLICENSED**. All rights reserved.

## 👥 Team

**HealthLease Hub Team**

---

## 🆘 Support

For issues, questions, or contributions:

1. Check the [documentation](./docs/)
2. Review [API documentation](http://localhost:3000/ui)
3. Check container logs: `docker logs healthlease-backend`
4. Verify environment variables are correctly configured

---

**Built with ❤️ by the HealthLease Hub Team**
