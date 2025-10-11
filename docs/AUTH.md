## Definitive Authentication Requirements & Workflows

This document outlines every requirement, endpoint, and step-by-step workflow for user authentication, session management, and authorization in the HealthLease Hub backend.

### 1. Core Security Requirements & Principles

The authentication system **must** adhere to the following principles:

1.  **Secure Password Storage:** User passwords must **never** be stored in plaintext. They must be hashed using a strong, slow, and salted hashing algorithm. **Chosen Algorithm: bcrypt.**
2.  **Stateless Sessions:** The API will be stateless. User sessions will be managed via JSON Web Tokens (JWTs). The server will not need to store session information.
3.  **Short-Lived Access Tokens:** Standard JWTs (Access Tokens) must have a short expiration time to limit the window of opportunity if a token is compromised. **Chosen Expiration: 15 minutes.**
4.  **Role-Based Access (Future-Proofing):** The JWT payload will contain a user's ID. While the MVP only has one user role ("user"), this structure allows for future expansion (e.g., "researcher", "admin").
5.  **Protected Endpoints:** All endpoints that handle sensitive user data or perform state-changing actions must be protected and require a valid, unexpired JWT.
6.  **Wallet Ownership Verification:** Connecting a Web3 wallet to an account must be cryptographically verified to prove the user owns the wallet's private key. **Chosen Method: EIP-191 Personal Sign.**

### 2. Authentication Endpoints

These are the only endpoints that directly manage authentication state.

| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new user account from an email and password. | No |
| `POST` | `/api/auth/login` | Authenticates a user with email and password, returning an access token. | No |
| `POST` | `/api/auth/logout` | A placeholder for future session invalidation (e.g., blocklisting tokens). | Yes |
| `POST` | `/api/user/wallet/connect`| Securely links a Web3 wallet to the currently authenticated user's account. | Yes |

---

### 3. Complete Authentication Workflows

Here are the step-by-step sequences for every possible authentication workflow.

#### Workflow 1: New User Registration

**Objective:** A new user creates an account on the platform.

*   **Endpoint:** `POST /api/auth/register`
*   **Actor:** Unauthenticated User

**Step-by-Step Logic:**
1.  **Frontend:** The user submits a registration form with their `email` and `password`.
2.  **Backend (Controller):** The `/api/auth/register` endpoint receives the request.
    *   **Validation:** The request body is validated against the `RegisterUserSchema`. It must contain a valid email format and a password meeting minimum length requirements (e.g., 8 characters). If validation fails, a `400 Bad Request` is returned.
3.  **Backend (Service - `authService.register`):**
    *   **Check for Existing User:** The service queries the `User` table in the database to see if an account with the provided `email` already exists.
    *   **Handle Conflict:** If a user with that email is found, the service throws a `ConflictError`. The controller catches this and returns a `409 Conflict` response (`{ "error": "Conflict", "message": "An account with this email already exists." }`).
    *   **Hash Password:** If the email is unique, the service hashes the plaintext password using `bcrypt.hash()`. This operation is intentionally slow.
    *   **Create User Record:** The service creates a new `User` record in the database using Prisma, storing the `email` and the **hashed password**.
4.  **Backend (Controller):**
    *   The controller receives the newly created user object from the service.
    *   It formats the response according to the `201` schema for this endpoint.
    *   **Returns `201 Created`** with a body like `{ "id": "user_cuid", "email": "user@example.com" }`. **No token is issued at this stage.** The user must now log in.

---

#### Workflow 2: User Login

**Objective:** An existing user authenticates and starts a new session.

*   **Endpoint:** `POST /api/auth/login`
*   **Actor:** Unauthenticated User

**Step-by-Step Logic:**
1.  **Frontend:** The user submits a login form with `email` and `password`.
2.  **Backend (Controller):** The `/api/auth/login` endpoint receives the request.
    *   **Validation:** The request body is validated against the `LoginUserSchema`. If validation fails, a `400 Bad Request` is returned.
3.  **Backend (Service - `authService.login`):**
    *   **Find User:** The service queries the `User` table for a user with the provided `email`.
    *   **Handle Not Found:** If no user is found, the service throws an `UnauthorizedError`.
    *   **Compare Passwords:** If a user is found, the service uses `bcrypt.compare(plaintextPassword, hashedPasswordFromDb)` to securely check if the passwords match.
    *   **Handle Mismatch:** If `bcrypt.compare` returns `false`, the service throws an `UnauthorizedError`.
    *   **Generate JWT:** If the passwords match, the service generates a JWT.
        *   **Payload:** The token payload must contain `{ "sub": user.id }` (`sub` is the standard claim for subject/user ID) and expiration claims (`iat`, `exp`).
        *   **Signing:** The token is signed with the `JWT_SECRET` from the environment variables.
4.  **Backend (Controller):**
    *   The controller receives the `accessToken` and the `user` object from the service.
    *   It catches any `UnauthorizedError` and returns a `401 Unauthorized` response (`{ "error": "Unauthorized", "message": "Invalid email or password." }`).
    *   On success, it formats the response according to the `200` schema.
    *   **Returns `200 OK`** with a body like `{ "accessToken": "ey...", "user": { ...user object... } }`.

---

#### Workflow 3: Accessing a Protected Resource

**Objective:** A logged-in user requests data from an endpoint that requires authentication.

*   **Endpoint:** e.g., `GET /api/user/me`
*   **Actor:** Authenticated User

**Step-by-Step Logic:**
1.  **Frontend:** The frontend makes a request to a protected endpoint. It **must** include the `accessToken` in the `Authorization` header.
    *   Format: `Authorization: Bearer <the_jwt_token>`
2.  **Backend (Middleware - `auth-middleware.ts`):**
    *   This middleware runs before the controller for any protected route.
    *   It extracts the token from the `Authorization` header.
    *   **Handle Missing Token:** If the header is missing or malformed, it immediately returns a `401 Unauthorized`.
    *   **Verify Token:** It uses `jwt.verify(token, JWT_SECRET)` to check the token's signature and expiration.
    *   **Handle Invalid Token:** If verification fails (e.g., expired, invalid signature), it returns a `401 Unauthorized`.
    *   **Attach User to Context:** If verification is successful, the middleware decodes the payload, extracts the user ID (`sub`), and attaches it to the Hono request context (e.g., `c.set('userId', payload.sub)`).
    *   It then calls `next()` to pass control to the next middleware or the controller.
3.  **Backend (Controller):**
    *   The controller handler for `GET /api/user/me` is executed.
    *   It retrieves the `userId` from the context.
    *   It calls `userService.findById(userId)` to fetch the full user profile from the database.
    *   **Returns `200 OK`** with the user's profile data.

---

#### Workflow 4: Connecting a Web3 Wallet

**Objective:** A logged-in user proves ownership of a wallet to link it to their account.

*   **Endpoint:** `POST /api/user/wallet/connect`
*   **Actor:** Authenticated User

**Step-by-Step Logic:**
1.  **Frontend:**
    *   The user clicks "Connect Wallet."
    *   The frontend prompts the user's wallet (MetaMask) to sign a predefined, static message (e.g., `"Welcome to HealthLease Hub! Sign this message to authenticate your wallet. Timestamp: 1678886400000"`). A timestamp can be added to prevent replay attacks on the signature itself, though the JWT already protects the endpoint.
    *   The wallet returns a `signature`.
    *   The frontend sends a request to the backend with the `walletAddress` the user connected with, the original `message` that was signed, and the `signature`.
2.  **Backend (Controller):**
    *   The `auth-middleware` runs first, ensuring the user is logged in.
    *   The controller validates the request body against the `ConnectWalletSchema`.
3.  **Backend (Service - `userService.connectWallet`):**
    *   **Verify Signature:** The service uses `ethers.verifyMessage(message, signature)` to recover the wallet address that signed the message.
    *   **Compare Addresses:** It compares the recovered address with the `walletAddress` sent in the request body. Both must be converted to the same case (e.g., lowercase) for a safe comparison.
    *   **Handle Mismatch:** If the addresses do not match, the service throws a `ValidationError` (`"Signature does not match the provided address."`), and the controller returns a `400 Bad Request`.
    *   **Check for Conflicts:** The service checks if the `walletAddress` is already linked to another `User` account in the database. If so, it throws a `ConflictError` and the controller returns a `409 Conflict`.
    *   **Update User:** If everything is valid, the service updates the authenticated user's record in the database, setting their `walletAddress` field.
4.  **Backend (Controller):**
    *   **Returns `200 OK`** with the complete, updated user profile.