# The Definitive Hono Backend Handbook (v5.1 - Final Monolith Edition)

**Version:** 5.1 (Final)
**Architecture:** Hono Monolith
**Team Size:** 2 Backend Developers

## 1. Executive Summary: The Final Architecture

We will build a **single, monolithic backend service** using the Hono framework. This architecture provides maximum development velocity and operational simplicity for the MVP. All backend logic—user authentication, database management, IPFS operations, and blockchain transactions—will reside within this single, well-structured application.

---

## 2. The Definitive, Presentation-Ready File Structure

This structure is final. It organizes the entire application by `core` foundational services and `features`, ensuring the codebase is clean, scalable, and easy for both developers to navigate.

```
healthlease-hub-backend/
├── src/
│   ├── core/
│   │   ├── middleware/
│   │   │   ├── auth-middleware.ts
│   │   │   └── validation-middleware.ts
│   │   ├── services/
│   │   │   ├── ipfs-service.ts
│   │   │   ├── prisma-service.ts
│   │   │   └── web3-service.ts
│   │   └── types/
│   │       ├── api-schemas.ts
│   │       └── domain-types.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth-controller.ts
│   │   │   ├── auth-routes.ts
│   │   │   └── auth-service.ts
│   │   ├── dashboard/
│   │   │   └── (controller, routes, service)
│   │   ├── documents/
│   │   │   └── (controller, routes, service)
│   │   ├── emergency/
│   │   │   └── (controller, routes, service)
│   │   ├── marketplace/
│   │   │   └── (controller, routes, service)
│   │   └── user/
│   │       └── (controller, routes, service)
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 3. The Complete Prisma Schema

This is the final, validated data model. It supports every required feature and is built on best practices for data integrity, security, and performance. No further changes should be needed for the MVP.

```prisma
// prisma/schema.prisma (Version 5.1 - Final)

datasource db { provider = "postgresql", url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

// --- ENUMS ---
enum DocumentCategory { LAB_RESULT, IMAGING, PRESCRIPTION, VISIT_NOTES, PROFILE }
enum StudyStatus { Active, Paused, Closed, Cancelled }
enum LeaseStatus { Pending, Active, Expired, Revoked, Completed }
enum DidCreationStatus { NONE, PENDING, CONFIRMED, FAILED }
enum RecordCreationStatus { PENDING, CONFIRMED, FAILED }

// --- MODELS ---
model User {
  id                String            @id @default(cuid())
  email             String            @unique
  name              String?
  password          String
  walletAddress     String?           @unique
  did               String?           @unique
  didCreationStatus DidCreationStatus @default(NONE)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  documents         Document[]
  leases            Lease[]
  accessLogs        AccessLog[]
}

model Document {
  id             String               @id @default(cuid())
  onChainId      BigInt?
  ipfsHash       String?
  category       DocumentCategory
  isActive       Boolean              @default(true)
  creationStatus RecordCreationStatus @default(PENDING)
  uploadedAt     DateTime             @default(now())
  userId         String
  user           User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

model Study {
  id                   String      @id @default(cuid())
  onChainId            BigInt      @unique
  researcherAddress    String
  title                String
  description          String      @db.Text
  metadataHash         String
  irbApprovalHash      String
  paymentPerUser       Decimal     @db.Decimal(20, 8)
  participantsNeeded   Int
  participantsEnrolled Int         @default(0)
  status               StudyStatus @default(Active)
  createdAt            DateTime    @default(now())
  updatedAt            DateTime    @updatedAt
  leases               Lease[]
}

model Lease {
  id            String      @id @default(cuid())
  onChainId     BigInt      @unique
  paymentAmount Decimal     @db.Decimal(20, 8)
  startTime     DateTime
  endTime       DateTime
  status        LeaseStatus @default(Pending)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  studyId       String
  study         Study       @relation(fields: [studyId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@index([studyId])
}

model AccessLog {
  id                  String   @id @default(cuid())
  onChainGrantId      BigInt
  responderName       String
  responderCredential String
  responderLocation   String
  dataAccessed        String[]
  accessTime          DateTime @default(now())
  grantExpiresAt      DateTime
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}
```
---

## 4. Parallel Development Plan for Two Developers

This plan breaks down the work into two logical phases based on dependencies. Within each phase, two developers can work on separate features in parallel.

### **Phase 1: Foundational Layer & Read-Only Features**

**Objective:** To establish the core services and build all features that do not require on-chain write transactions. This creates a stable base for the more complex transactional logic.

| **Developer A: Core Services & Identity** | **Developer B: Data & Read APIs** |
| :--- | :--- |
| **Domain Ownership:** `core/*`, `features/auth/*`, `features/user/*` | **Domain Ownership:** `features/dashboard/*`, `features/marketplace/*`, `features/documents/*` (read parts) |
| **Prerequisites:** None. This work can start immediately. | **Prerequisites:** Completion of Core `PrismaService` and `Web3Service` by Developer A. |
| **Tasks:** | **Tasks:** |
| 1.  **Set up the project:** Initialize the Hono app, file structure, and Prisma. | 1.  **Implement `MarketplaceService`:** Focus on the logic to read study data from the blockchain cache (the `Study` table). |
| 2.  **Implement Core Services:** Build the foundational `PrismaService`, `Web3Service` (including contract loading and read-only functions), and `IpfsService`. | 2.  **Build Marketplace Read Endpoints:** Implement the `GET /api/studies` and `GET /api/studies/:studyId` routes and controllers. |
| 3.  **Implement Auth Feature:** Build the complete `auth` feature for user registration and login (no Web3 needed). | 3.  **Implement `DashboardService`:** Build the logic to aggregate user stats from the database. |
| 4.  **Implement User Feature:** Build the `user` feature for profile management and the **orchestration logic** for connecting a wallet and initiating DID creation. | 4.  **Build Dashboard Endpoint:** Implement the `GET /api/dashboard/stats` endpoint. |
| 5.  **Implement Core Middleware:** Build the JWT `auth-middleware`. | 5.  **Build Document Read Endpoint:** Implement the `GET /api/documents` endpoint. |
| **Phase 1 Deliverable:** A running application where a user can register, log in, connect their wallet, and view marketplace/dashboard data. | **Phase 1 Deliverable:** All read-only API endpoints are functional and serving data. |

### **Phase 2: Transactional Layer & Write Features**

**Objective:** To implement all features that create on-chain transactions and modify state. This phase builds directly on top of the completed foundational layer.

| **Developer A: Core Transactions** | **Developer B: User-Centric Transactions** |
| :--- | :--- |
| **Domain Ownership:** `features/documents/*`, `features/marketplace/*` (write parts) | **Domain Ownership:** `features/emergency/*`, `features/access-logs/*` |
| **Prerequisites:** Completion of all Phase 1 tasks. | **Prerequisites:** Completion of all Phase 1 tasks. |
| **Tasks:** | **Tasks:** |
| 1.  **Implement Document Upload:** Build the complete asynchronous workflow in `DocumentService` for `POST /api/documents` (encryption, IPFS upload, on-chain transaction). | 1.  **Implement Emergency QR Generation:** Build the `EmergencyService` logic for creating the signed QR payload for `POST /api/emergency/qr`. |
| 2.  **Implement Document Revoke:** Build the logic for `DELETE /api/documents/:docId`. | 2.  **Implement Emergency Access:** Build the public `POST /api/emergency/access` endpoint logic, including on-chain grant creation and off-chain access logging. |
| 3.  **Implement Study Application:** Build the `MarketplaceService` logic for `POST /api/studies/:studyId/apply`. | 3.  **Implement Access Log Endpoint:** Build the `GET /api/access-logs` endpoint. |
| 4.  **Implement Status Endpoints:** Build all `.../status` polling endpoints. | 4.  **Finalize API Docs & Testing:** Review all Zod schemas, ensure the OpenAPI documentation is complete, and write comprehensive unit/integration tests for owned features. |
| 5.  **Comprehensive Testing:** Write integration tests for the complex, asynchronous transaction workflows you own. |
| **Phase 2 Deliverable:** All document and marketplace write operations are functional. | **Phase 2 Deliverable:** The complete emergency access feature is functional and secure. |

### The Asynchronous Workflow Pattern (To be used by both developers)

This is the **non-negotiable pattern** for all on-chain write operations:
1.  **Controller:** Receives request.
2.  **Service:** Creates a `PENDING` record in the database.
3.  **Controller:** Immediately responds `202 Accepted` to the frontend with the record's ID.
4.  **Service (Background):** The controller triggers the long-running process (e.g., `processUpload`) without `await`. This background task `await`s the transaction confirmation.
5.  **Service (Background):** Upon completion, it updates the database record to `CONFIRMED` or `FAILED`.
6.  **Frontend:** Polls a `.../status` endpoint to get the final result.