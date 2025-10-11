# HealthLease Hub MVP: The Complete Backend Developer's Handbook

**Version:** 1.0  
**Date:** October 10, 2025  
**Maintainer:** Backend Team Lead

## 1. Introduction: Your Mission

Welcome to the HealthLease Hub backend. Your mission is to build the central nervous system of the entire platform. You are the orchestrator that connects the user-facing **Frontend** to the decentralized **Smart Contracts** and the secure **IPFS Storage**.

This document is your complete guide. It contains everything you need to build, test, and prepare the backend for deployment.

---

## 2. Core Architecture & Technology Stack

Our stack is chosen for performance, type-safety, and a superior developer experience.

| Category | Technology | Version | Why We Chose It |
| :--- | :--- | :--- | :--- |
| **Framework** | **Hono** | v4.x | Blazing fast, lightweight, and runtime-agnostic. Its minimalist, middleware-centric design enforces a clean separation of concerns. |
| **Database ORM** | **Prisma** | v5.x | Industry-standard for type-safety. The schema-first approach (`schema.prisma`) and auto-generated client eliminate mismatches between our code and the database. |
| **Database** | **PostgreSQL** | v15.x | Powerful, reliable, and battle-tested relational database. |
| **Validation** | **Zod** | v3.x | Provides powerful, static type inference from schemas. Using `@hono/zod-validator`, we get effortless, robust request validation. |
| **API Docs** | **`@hono/zod-openapi`** | - | Automatically generates OpenAPI 3.0 (Swagger) documentation from our existing Zod validation schemas. This ensures our docs are always in sync with the code. |
| **Web3 Library** | **Ethers.js** | v6.x | The most mature and widely-used library for interacting with EVM-compatible blockchains. Provides a clean, stable API for contract calls and event listening. |
| **Authentication** | **JWT + bcrypt** | - | Standard, secure approach. Short-lived JWTs for stateless authentication, with `bcrypt` for industry-standard password hashing. |
| **IPFS Client** | **Pinata SDK** | - | Provides a simple API for pinning files to IPFS, ensuring data persistence. |

### Required Libraries (`package.json`)

```json
{
  "dependencies": {
    "@hono/node-server": "^1.11.1",
    "@hono/zod-openapi": "^0.11.0",
    "@pinata/sdk": "^2.1.0",
    "@prisma/client": "^5.14.0",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.4.5",
    "ethers": "^6.12.1",
    "hono": "^4.4.6",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.5",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.12.12",
    "@types/pg": "^8.11.6",
    "prisma": "^5.14.0",
    "tsx": "^4.11.0",
    "typescript": "^5.4.5"
  }
}
```

---

## 3. Project Setup & Local Environment

Follow these steps to get a development environment running.

**Prerequisites:**
*   Node.js v20.x or later
*   Docker and Docker Compose (for PostgreSQL and Redis)

**Setup Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/healthlease/hub.git
    cd hub/backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    *   Copy the example environment file: `cp .env.example .env`
    *   Fill in the values in the `.env` file. You will need to generate a `JWT_SECRET` and get a `PINATA_JWT`. The rest can be default local values.

4.  **Start Local Database:**
    *   Ensure Docker is running.
    *   From the project root, run: `docker-compose up -d`
    *   This will start PostgreSQL and Redis containers.

5.  **Initialize and Migrate Database:**
    *   This command reads your `prisma/schema.prisma` and creates the necessary tables in your local database.
    ```bash
    npx prisma migrate dev --name init
    ```

6.  **Generate Prisma Client:**
    *   This command updates the type-safe `@prisma/client` based on your schema. Run this every time you change `schema.prisma`.
    ```bash
    npx prisma generate
    ```

7.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    *   The Hono server will now be running, typically on `http://localhost:3001`.
    *   Your interactive API documentation will be available at `http://localhost:3001/ui`.

---

## 4. Complete API Endpoint Specification (MVP)

This is the definitive list of all API endpoints required for the MVP.

| Category | Method | Endpoint | Auth Required? | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/register` | No | Creates a new user account with email and password. |
| | `POST` | `/api/auth/login` | No | Logs a user in, returning JWT tokens. |
| | `POST` | `/api/auth/logout` | Yes | Invalidates the user's session/refresh token. |
| | `GET` | `/api/users/me` | Yes | Retrieves the profile of the currently authenticated user. |
| **Wallet & Identity** | `POST` | `/api/wallet/connect` | Yes | Verifies a wallet signature and links a wallet address to the user's account. |
| | `POST` | `/api/wallet/create-did` | Yes | Creates the user's Decentralized Identity (DID) on the blockchain. |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Yes | Fetches aggregated stats: document count, active leases, and total earnings. |
| | `GET` | `/api/dashboard/activity` | Yes | Retrieves a feed of recent user activities (e.g., "Document Uploaded"). |
| **Documents** | `POST` | `/api/documents` | Yes | Uploads, encrypts, and records a new health document. |
| | `GET` | `/api/documents` | Yes | Lists metadata for all of the user's documents. |
| | `DELETE`| `/api/documents/:docId`| Yes | Revokes a document's validity on the blockchain. |
| **Emergency QR**| `POST` | `/api/emergency/qr` | Yes | Generates a new, signed QR code payload for emergency access. |
| | `POST` | `/api/emergency/access`| No | Public endpoint for first responders to request access using a scanned QR payload. |
| **Marketplace** | `GET` | `/api/studies` | Yes | Browses and filters all active research studies. |
| | `GET` | `/api/studies/:studyId`| Yes | Fetches the detailed information for a single research study. |
| | `POST` | `/api/studies/:studyId/apply`| Yes | Enrolls the user in a study, triggering the on-chain data lease and payment. |
| **Access Control**| `GET` | `/api/access-logs` | Yes | Provides an immutable log of who has accessed the user's data and when. |
| **Settings** | `GET` | `/api/settings` | Yes | Retrieves the user's current profile settings (name, etc.). |
| | `PUT` | `/api/settings` | Yes | Updates the user's profile settings. |

---

## 5. Data Structures & Schemas (Zod DTOs)

These schemas define the shape of our API data and are used for both validation and documentation.

```typescript
// src/types/dtos.ts
import { z } from 'zod';

// --- Authentication ---
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginDto = z.infer<typeof LoginSchema>;

// --- Wallet ---
export const ConnectWalletSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address.'),
  message: z.string(),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature.'),
});
export type ConnectWalletDto = z.infer<typeof ConnectWalletSchema>;

// --- Documents ---
export const UploadDocumentSchema = z.object({
  category: z.enum(['LAB_RESULT', 'IMAGING', 'PRESCRIPTION', 'VISIT_NOTES']),
});
// Note: File is handled by multipart parser, not Zod schema for the body.

// --- Emergency ---
export const GenerateQrSchema = z.object({
  dataToInclude: z.array(z.string()).min(1, 'At least one data category must be selected.'),
});
export type GenerateQrDto = z.infer<typeof GenerateQrSchema>;

export const RequestAccessSchema = z.object({
  qrPayload: z.string(),
  responderInfo: z.object({
    name: z.string().min(1),
    credential: z.string().min(1),
    location: z.string().min(1),
  }),
});
export type RequestAccessDto = z.infer<typeof RequestAccessSchema>;

// --- Settings ---
export const UpdateSettingsSchema = z.object({
    name: z.string().optional(),
    // Add other updatable profile fields here
});
export type UpdateSettingsDto = z.infer<typeof UpdateSettingsSchema>;
```

---

## 6. Detailed Core Workflows

These are the step-by-step logic flows for the most critical features.

### Workflow 1: Full User Onboarding (Registration to DID)

1.  **Registration (`POST /api/auth/register`):**
    *   Frontend sends `email` and `password`.
    *   Hono route validates against `RegisterSchema`.
    *   `authService.register` hashes the password with `bcrypt` and creates a user in the DB via Prisma.
    *   Returns `201 Created`.

2.  **Login (`POST /api/auth/login`):**
    *   Frontend sends `email` and `password`.
    *   `authService.login` validates credentials.
    *   If valid, it generates a short-lived JWT access token and a long-lived refresh token.
    *   Returns the tokens and user object.

3.  **Wallet Connection (`POST /api/wallet/connect`):**
    *   Frontend prompts the user to sign a static message (e.g., "Sign this message to connect your wallet to HealthLease Hub.").
    *   Frontend sends the `walletAddress`, `message`, and `signature`.
    *   `authService.connectWallet` uses `ethers.verifyMessage` to validate the signature.
    *   If valid, it updates the `walletAddress` on the user's record in Prisma.

4.  **DID Creation (`POST /api/wallet/create-did`):**
    *   Frontend calls this endpoint after the wallet is connected.
    *   `identityService.createDid` is called with the `userId`.
    *   The service generates a basic profile JSON, uploads it to IPFS via `ipfsService` to get an `initialDocumentHash`.
    *   It then calls `web3Service.createDID(userWalletAddress, initialDocumentHash)`, which executes the `createDID` function on the `DIDRegistry` smart contract.
    *   The API immediately returns a `202 Accepted` response with the transaction hash.
    *   Later, the background `DIDCreated` event listener in `web3Service` will fire, and its callback will update the `did` field for the user in the database.

### Workflow 2: Document Upload

1.  **Request:** Frontend sends a `multipart/form-data` request to `POST /api/documents` with the `file` and `category`.
2.  **Authorization:** JWT middleware verifies the user.
3.  **Service Call:** The route handler calls `documentService.uploadDocument(userId, file, category)`.
4.  **Encryption:** `documentService` derives a deterministic encryption key from a user secret (e.g., a signature). It reads the file into a buffer and encrypts it with AES-256.
5.  **IPFS Upload:** The encrypted buffer is passed to `ipfsService.upload`, which pins it to Pinata and returns the IPFS CID (hash).
6.  **Blockchain Transaction:** `documentService` calls `web3Service.addDocument(userDID, ipfsHash, category)`, which executes the `addDocument` function on the `DIDRegistry` smart contract.
7.  **Database Record:** The service creates a new record in the `documents` table using Prisma, storing the `userId`, `ipfsHash`, `category`, and the `onChainId` returned from the transaction.
8.  **Response:** The API returns a `201 Created` with the metadata of the newly created document record.

### Workflow 3: Emergency Access Request

1.  **Request:** A first responder's device scans a QR code and sends a public request to `POST /api/emergency/access` with the `qrPayload` and `responderInfo`.
2.  **Verification:** The `emergencyService` is called. It first verifies the signature within the `qrPayload` to securely identify the patient's DID. This proves the QR code is authentic.
3.  **Blockchain Transaction:** If the signature is valid, the service calls `web3Service.grantEmergencyAccess(...)`, which executes the `grantAccess` function on the `EmergencyAccess` contract. This creates an immutable, time-limited access grant on-chain.
4.  **Data Retrieval:** The service queries the Prisma `documents` table to find the CIDs of the patient's critical health documents.
5.  **IPFS Download & Decryption:** It iterates through the CIDs, downloads the encrypted files from IPFS via `ipfsService`, and decrypts them using the patient's re-derived key.
6.  **Data Parsing:** The service parses the decrypted file contents (e.g., JSON, text) to extract the relevant information (blood type, allergies, etc.).
7.  **Logging & Response:** It creates a record in the `access_logs` table via Prisma and returns the structured, decrypted patient data along with the grant's expiration time.

---

## 7. API Documentation Strategy

We will use `hono-zod-openapi` to automatically generate our API documentation.

**How it Works:**

1.  **Define a Route Object:** For each endpoint, we create a `createRoute` object that includes the `path`, `method`, and Zod schemas for the `request` and `responses`.
2.  **Implement the Handler:** We use `app.openapi(routeObject, handler)` to link our implementation logic to the documentation.
3.  **Serve the Docs:** We add a route that serves the Swagger UI.

**Example Implementation:**

```typescript
// src/routes/auth.routes.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { RegisterSchema } from '../types/dtos';
import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono();

// 1. Define the route object with metadata
const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  tags: ['Authentication'],
  request: {
    body: {
      content: { 'application/json': { schema: RegisterSchema } },
    },
  },
  responses: {
    201: {
      description: 'User created successfully.',
      content: { 'application/json': { schema: z.object({ id: z.number(), email: z.string() }) } },
    },
  },
});

// 2. Implement the handler using the route object
app.openapi(registerRoute, async (c) => {
  const { email, password } = c.req.valid('json');
  const newUser = await authService.register(email, password); // Your service logic
  return c.json({ id: newUser.id, email: newUser.email }, 201);
});

// 3. Serve the documentation UI
app.get('/ui', swaggerUI({ url: '/doc' }));
app.doc('/doc', {
    openapi: '3.0.0',
    info: { version: '1.0.0', title: 'HealthLease Hub API' },
});

export default app;
```
This approach ensures your API documentation is always 100% accurate and in sync with your validation logic.

---

## 8. Developer Interaction Model & Responsibilities

Clear communication depends on understanding the "API contracts" between team members.

### vs. Web3/Smart Contract Developer

*   **Your Role:** You are the **exclusive consumer**.
*   **What You PROVIDE them:** Requirements and feedback (e.g., "This function needs to emit an event.").
*   **What You CONSUME from them:**
    1.  **Contract ABIs:** JSON files describing the contract functions. You need these for Ethers.js.
    2.  **Deployed Contract Addresses:** The `0x...` addresses for your `.env` file.
    3.  **Event Definitions:** The exact signatures of events for your listeners.

### vs. Frontend Developer

*   **Your Role:** You are the **producer**. Your API is their entire backend.
*   **What You PROVIDE them:**
    1.  **The OpenAPI/Swagger UI (`/ui`):** This is your contract with them. It's their single source of truth.
    2.  **A Stable Dev Server:** A running API for them to develop against.
    3.  **Clear, Standardized Error Messages.**
*   **What You CONSUME from them:** API requests, bug reports, and feedback.

### vs. DevOps Engineer

*   **Your Role:** You **produce the application package**.
*   **What You PROVIDE them:**
    1.  **A `Dockerfile`:** A recipe to build a portable image of your Hono app.
    2.  **An `.env.example` file:** A complete list of all required environment variables.
    3.  **Migration Commands:** `npx prisma migrate deploy`.
    4.  **A `/health` check endpoint.**
*   **What You CONSUME from them:** Production environment variables, access to production logs, and a CI/CD pipeline.

---

## 9. Conclusion

This handbook provides the complete architectural and implementation blueprint for the HealthLease Hub backend. By following this guide, you have everything you need to build a secure, performant, and scalable API that fulfills all requirements of the MVP.

**Happy Building!**