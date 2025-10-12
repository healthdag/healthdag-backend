# 🎨 HealthLease Hub - Complete Frontend Schema Specification

**Version:** 1.0.0
**Generated:** 2025-10-12
**Purpose:** Comprehensive specification for frontend developers to implement all pages, components, and flows

---

## 📋 Table of Contents

1. [User Flow Overview](#user-flow-overview)
2. [Authentication Pages](#authentication-pages)
3. [Dashboard & Main Pages](#dashboard--main-pages)
4. [Document Management](#document-management)
5. [QR Code System](#qr-code-system)
6. [Marketplace & Research](#marketplace--research)
7. [Settings & Profile](#settings--profile)
8. [Components Library](#components-library)
9. [API Integration](#api-integration)
10. [State Management](#state-management)

---

## 🔄 User Flow Overview

### Complete User Journey

```
1. Registration → Login
2. Connect MetaMask Wallet (Signature verification)
3. DID Generation (Automatic after wallet connection)
4. Add Medical Records (Upload to IPFS)
5. Generate QR Code (For emergency access/data sharing)
6. Browse Research Studies (Marketplace)
7. Apply to Studies (Select documents, auto-payment)
8. Track Earnings & Activity (Dashboard)
```

### User Roles

- **Patient/Data Owner** - Upload records, share data, earn from research
- **Researcher** - Create studies, access consented data, pay participants

---

## 🔐 Authentication Pages

### 1. Registration Page (`/register`)

**Purpose:** New user account creation

**UI Components:**

- Full-page form with brand header
- Email input
- Password input (with strength indicator)
- Confirm password input
- Name input (optional)
- Terms & Conditions checkbox
- Submit button
- Link to login page

**Form Schema:**

```typescript
interface RegisterForm {
  email: string;         // Required, email format
  password: string;      // Min 8 chars, 1 uppercase, 1 number, 1 special
  confirmPassword: string;
  name?: string;         // Optional
  acceptTerms: boolean;  // Required
}
```

**API Integration:**

```typescript
POST /api/auth/register
Request Body: {
  email: string;
  password: string;
  name?: string;
}
Response: {
  success: true;
  data: {
    token: string;  // JWT token
    user: {
      id: string;
      email: string;
      name: string | null;
      createdAt: string;
    }
  }
}
```

**Validation Rules:**

- Email: Valid email format, unique
- Password: Min 8 characters, 1 uppercase, 1 number, 1 special char
- ConfirmPassword: Must match password
- AcceptTerms: Must be checked

**Success Flow:**

1. Store JWT token in localStorage/sessionStorage
2. Navigate to `/dashboard`
3. Show wallet connection prompt

**Error Handling:**

- Email already exists → Show error message
- Weak password → Show password requirements
- Network error → Show retry button

---

### 2. Login Page (`/login`)

**Purpose:** Existing user authentication

**UI Components:**

- Full-page form with brand header
- Email input
- Password input (with show/hide toggle)
- "Remember me" checkbox
- Submit button
- "Forgot password?" link
- Link to registration page

**Form Schema:**

```typescript
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

**API Integration:**

```typescript
POST /api/auth/login
Request Body: {
  email: string;
  password: string;
}
Response: {
  success: true;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      walletAddress: string | null;
      did: string | null;
      didCreationStatus: 'NONE' | 'PENDING' | 'CONFIRMED' | 'FAILED';
    }
  }
}
```

**Success Flow:**

1. Store JWT token
2. Check if wallet connected:
   - If yes → Navigate to `/dashboard`
   - If no → Navigate to `/onboarding/wallet`

---

### 3. Wallet Connection Page (`/onboarding/wallet`)

**Purpose:** Connect MetaMask wallet and generate DID

**UI Components:**

- Welcome message
- "Connect MetaMask" button (with MetaMask logo)
- Explanation text about DID
- Skip button (disabled - wallet required)
- Progress indicator (Step 1 of 2)

**MetaMask Integration:**

```typescript
// Connect wallet
const connectWallet = async () => {
  // 1. Check if MetaMask is installed
  if (!window.ethereum) {
    showError("Please install MetaMask");
    return;
  }

  // 2. Request account access
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  const walletAddress = accounts[0];

  // 3. Generate signature message
  const message = `Connect wallet to HealthLease Hub\nAddress: ${walletAddress}\nTimestamp: ${Date.now()}`;

  // 4. Request signature
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, walletAddress]
  });

  // 5. Send to backend for verification
  return { walletAddress, signature, message };
};
```

**API Integration:**

```typescript
POST /api/user/wallet/connect
Headers: { Authorization: 'Bearer <token>' }
Request Body: {
  walletAddress: string;
  signature: string;
  message: string;
}
Response: {
  success: true;
  data: {
    id: string;
    email: string;
    walletAddress: string;  // Now connected
    did: string | null;      // Still null
    didCreationStatus: 'NONE';
  }
}
```

**After Connection Flow:**

1. Automatically trigger DID creation
2. Navigate to DID creation status page

---

### 4. DID Creation Status Page (`/onboarding/did`)

**Purpose:** Show DID generation progress

**UI Components:**

- Loading spinner / Animation
- Status message (dynamic)
- Progress indicator (Step 2 of 2)
- Cancel button (hidden during processing)

**Status Messages:**

- `PENDING` → "Creating your digital identity..."
- `CONFIRMED` → "Identity created successfully! ✓"
- `FAILED` → "Failed to create identity. Retry?"

**API Integration:**

```typescript
// Trigger DID creation
POST /api/user/wallet/did
Headers: { Authorization: 'Bearer <token>' }
Response: {
  success: true;
  data: {
    id: string;
    status: 'PENDING';
  }
}

// Poll for status (every 3 seconds)
GET /api/user/wallet/did/status
Headers: { Authorization: 'Bearer <token>' }
Response: {
  success: true;
  data: {
    status: 'NONE' | 'PENDING' | 'CONFIRMED' | 'FAILED';
    did: string | null;
  }
}
```

**Success Flow:**

1. When status = 'CONFIRMED', store DID
2. Navigate to `/dashboard`
3. Show welcome toast

---

## 🏠 Dashboard & Main Pages

### 5. Main Dashboard (`/dashboard`)

**Purpose:** User's home page with overview

**Layout:**

- Top navigation bar (sticky)
- Sidebar menu (collapsible on mobile)
- Main content area
- Quick action buttons

**Sections:**

#### A. Stats Cards (Top Row)

```typescript
interface DashboardStats {
  totalDocuments: number;
  activeLeases: number;
  totalEarnings: string;  // In BDAG
  recentActivity: number;
}
```

**API Integration:**

```typescript
GET /api/dashboard/stats
Headers: { Authorization: 'Bearer <token>' }
Response: {
  success: true;
  data: {
    totalDocuments: number;
    activeLeases: number;
    totalEarnings: string;
  }
}
```

**UI Cards:**

1. **Documents Card**
   - Icon: Document/File icon
   - Number: `totalDocuments`
   - Label: "Medical Records"
   - Action: Link to `/documents`

2. **Active Leases Card**
   - Icon: Handshake icon
   - Number: `activeLeases`
   - Label: "Active Research Studies"
   - Action: Link to `/marketplace/my-studies`

3. **Earnings Card**
   - Icon: Wallet/Money icon
   - Number: `${totalEarnings} BDAG`
   - Label: "Total Earnings"
   - Action: Link to `/wallet`

#### B. Quick Actions (Button Grid)

- "Upload Document" → `/documents/upload`
- "Generate QR Code" → `/qr/generate`
- "Browse Studies" → `/marketplace`
- "View Profile" → `/profile`

#### C. Recent Activity Feed

```typescript
interface Activity {
  id: string;
  type: 'DOCUMENT_UPLOAD' | 'STUDY_APPLIED' | 'PAYMENT_RECEIVED' | 'QR_GENERATED';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  link?: string;
}
```

**API Integration:**

```typescript
GET /api/dashboard/activity
Headers: { Authorization: 'Bearer <token>' }
Response: {
  success: true;
  data: Activity[];
}
```

**Activity Card Design:**

- Icon (left)
- Title & Description (center)
- Time ago (right)
- Click → Navigate to related page

---

## 📄 Document Management

### 6. Documents List Page (`/documents`)

**Purpose:** View all uploaded medical records

**UI Components:**

- Page header with "Upload Document" button
- Filter dropdown (by category)
- Search bar
- Document cards grid
- Empty state (if no documents)

**Document Card Schema:**

```typescript
interface Document {
  id: string;
  category: 'LAB_RESULT' | 'IMAGING' | 'PRESCRIPTION' | 'VISIT_NOTES' | 'PROFILE';
  uploadedAt: string;
  isActive: boolean;
  creationStatus: 'PENDING' | 'CONFIRMED' | 'FAILED';
  ipfsHash?: string;
  onChainId?: string;
}
```

**API Integration:**

```typescript
GET /api/documents
Headers: { Authorization: 'Bearer <token>' }
Query: ?category=LAB_RESULT&status=CONFIRMED
Response: {
  success: true;
  data: Document[];
}
```

**Document Card UI:**

- Category icon (different for each type)
- Category label
- Upload date
- Status badge (Pending/Confirmed/Failed)
- Actions dropdown:
  - View Details
  - Download (if supported)
  - Delete
  - Share via QR

**Empty State:**

- Illustration
- "No documents yet"
- "Upload your first medical record" button

---

### 7. Document Upload Page (`/documents/upload`)

**Purpose:** Upload new medical records to IPFS

**UI Components:**

- File upload dropzone
- Category selector (dropdown)
- File preview
- Encryption toggle (always on, show for transparency)
- Upload progress bar
- Cancel button

**Form Schema:**

```typescript
interface DocumentUploadForm {
  file: File;  // PDF, JPEG, PNG (max 10MB)
  category: 'LAB_RESULT' | 'IMAGING' | 'PRESCRIPTION' | 'VISIT_NOTES' | 'PROFILE';
  encrypt: boolean;  // Default true, read-only
}
```

**API Integration:**

```typescript
POST /api/documents
Headers: {
  Authorization: 'Bearer <token>';
  Content-Type: 'multipart/form-data';
}
Request Body: FormData {
  file: File;
  category: string;
}
Response: {
  success: true;
  data: {
    id: string;
    status: 'PENDING';
  }
}
```

**Upload Flow:**

1. User selects file
2. Show file preview + category selector
3. Click "Upload"
4. Show progress bar (0-100%)
5. Poll status endpoint while PENDING
6. On CONFIRMED → Show success, navigate to `/documents`
7. On FAILED → Show error, allow retry

**Status Polling:**

```typescript
GET /api/documents/:id/status
Response: {
  success: true;
  data: {
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    ipfsHash?: string;
    onChainId?: string;
  }
}
```

**Validation:**

- File types: PDF, JPG, PNG
- Max size: 10MB
- Required: File + Category

---

### 8. Document Details Page (`/documents/:id`)

**Purpose:** View single document details

**UI Components:**

- Back button
- Document info card
- Document preview (if supported)
- Actions:
  - Download
  - Delete
  - Generate QR for this document
- Transaction details (blockchain)

**Document Details:**

```typescript
interface DocumentDetails extends Document {
  fileName?: string;
  fileSize?: number;
  ipfsHash?: string;
  onChainId?: string;
  transactionHash?: string;
  encryptionMethod: string;
}
```

**Delete Flow:**

```typescript
DELETE /api/documents/:id
Headers: { Authorization: 'Bearer <token>' }
Response: {
  success: true;
  data: { message: 'Document deleted' }
}
```

---

## 🔲 QR Code System

### 9. QR Code Generator Page (`/qr/generate`)

**Purpose:** Create shareable QR codes for emergency/controlled access

**UI Components:**

- Information selection panel (left)
- QR code preview (right)
- Configuration options
- Generate button
- Download/Share buttons

**Configuration Schema:**

```typescript
interface QRCodeConfig {
  userId: string;  // Auto-filled
  documentIds: string[];  // Selected documents
  dataFields: string[];   // Selected fields to share
  expiresIn: number;      // Hours until QR expires
  accessType: 'EMERGENCY' | 'SHARE';
  responderInfo?: {
    requireName: boolean;
    requireCredential: boolean;
    requireLocation: boolean;
  };
}
```

**Data Fields Options:**

- Personal Info (name, DOB, blood type)
- Emergency Contacts
- Allergies
- Current Medications
- Medical Conditions
- Specific Documents (checkboxes)

**API Integration:**

```typescript
POST /api/emergency/qr
Headers: { Authorization: 'Bearer <token>' }
Request Body: {
  documentIds: string[];
  expiresIn: number;  // Hours
  accessType: string;
}
Response: {
  success: true;
  data: {
    qrPayload: string;  // Signed JWT token
    expiresAt: string;
  }
}
```

**QR Code Format:**
The QR code contains a signed JWT with:

```json
{
  "userId": "user_123",
  "grantId": "grant_456",
  "expiresAt": "2024-01-15T12:00:00Z",
  "signature": "..."
}
```

**UI Flow:**

1. User selects documents/fields
2. Choose expiration (1h, 24h, 7d, 30d, custom)
3. Click "Generate QR"
4. QR code appears instantly
5. Options:
   - Download PNG
   - Print
   - Share link
   - Save configuration

---

### 10. QR Code List Page (`/qr/my-codes`)

**Purpose:** View all generated QR codes

**UI Components:**

- QR code cards grid
- Filter (Active/Expired)
- Regenerate button for expired codes

**QR Code Card:**

```typescript
interface SavedQRCode {
  id: string;
  config: QRCodeConfig;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  accessCount: number;  // How many times scanned
}
```

---

### 11. Mobile App - QR Scanner (Spec for Mobile Team)

**Purpose:** Scan QR codes to access emergency data

**UI Components:**

- Camera scanner
- Responder info form
- Data display screen

**Scan Flow:**

1. Open camera scanner
2. Scan QR code
3. Parse JWT payload
4. Show responder info form:

   ```typescript
   interface ResponderInfo {
     name: string;
     credential: string;  // Doctor ID, Nurse ID, etc.
     location: string;    // Hospital name
   }
   ```

5. Submit form → Call API
6. Display allowed data

**API Integration:**

```typescript
POST /api/emergency/access
Request Body: {
  qrPayload: string;  // JWT from QR
  responderName: string;
  responderCredential: string;
  responderLocation: string;
}
Response: {
  success: true;
  data: {
    patient: {
      name: string;
      dob: string;
      bloodType: string;
      allergies: string[];
      medications: string[];
      conditions: string[];
    };
    documents: Array<{
      category: string;
      ipfsHash: string;
      uploadedAt: string;
    }>;
    expiresAt: string;
  }
}
```

---

## 🏪 Marketplace & Research

### 12. Research Marketplace Page (`/marketplace`)

**Purpose:** Browse available research studies

**UI Components:**

- Search bar
- Filter panel (left sidebar):
  - Payment range slider
  - Required data types (checkboxes)
  - Status (Active/Closed)
- Study cards grid (main area)
- Pagination

**Study Card Schema:**

```typescript
interface Study {
  id: string;
  onChainId: string;
  title: string;
  description: string;
  researcherAddress: string;
  paymentPerUser: string;  // In BDAG
  participantsNeeded: number;
  participantsEnrolled: number;
  status: 'Active' | 'Paused' | 'Closed' | 'Cancelled';
  createdAt: string;
  metadataHash: string;
  irbApprovalHash: string;
}
```

**API Integration:**

```typescript
GET /api/marketplace/studies
Headers: { Authorization: 'Bearer <token>' }
Query: ?status=Active&minPayment=50
Response: {
  success: true;
  data: Study[];
}
```

**Study Card UI:**

- Study title (bold, 2 lines max)
- Short description (3 lines max, truncate)
- Payment badge (prominent, green)
- Progress bar (enrolled/needed)
- "View Details" button
- IRB approved badge

---

### 13. Study Details Page (`/marketplace/studies/:id`)

**Purpose:** View full study information and apply

**UI Components:**

- Study header (title, payment, researcher)
- Full description
- Requirements section:
  - Required document types
  - Eligibility criteria
  - Study duration
- IRB approval document (link)
- "Apply to Study" button (primary CTA)
- Back to marketplace button

**API Integration:**

```typescript
GET /api/marketplace/studies/:id
Headers: { Authorization: 'Bearer <token>' }
Response: {
  success: true;
  data: Study & {
    fullDescription: string;
    requirements: string[];
    duration: string;
    startDate: string;
    endDate: string;
  }
}
```

**Apply Button Logic:**

- If user has no documents → Show "Upload documents first" modal
- If user has no matching documents → Show "Upload required documents" modal
- If user already applied → Disabled, show "Already Applied"
- If study full → Disabled, show "Study Full"
- Otherwise → Open document selection modal

---

### 14. Study Application Modal (Popup)

**Purpose:** Select documents to share with researcher

**UI Components:**

- Modal overlay
- Document selection checklist
- Duration display (how long data is shared)
- Payment info (how much you'll earn)
- Confirmation checkbox ("I consent to share...")
- "Confirm & Apply" button
- Cancel button

**Required Documents Display:**
Shows categories needed with user's matching documents:

```
Required: LAB_RESULT
☑ Blood Test (Jan 15, 2024)
☐ Cholesterol Panel (Dec 10, 2023)

Required: IMAGING
☑ Chest X-Ray (Feb 1, 2024)
```

**API Integration:**

```typescript
POST /api/marketplace/studies/:id/apply
Headers: { Authorization: 'Bearer <token>' }
Request Body: {
  documentIds: string[];  // Selected documents
  durationDays: number;   // Auto-filled from study
}
Response: {
  success: true;
  data: {
    id: string;  // Lease ID
    status: 'PENDING';
  }
}
```

**After Submit:**

1. Close modal
2. Show loading toast "Processing application..."
3. Poll lease status
4. On CONFIRMED → Show success + payment notification
5. Navigate to `/marketplace/my-studies`

**Lease Status Polling:**

```typescript
GET /api/marketplace/leases/:id/status
Response: {
  success: true;
  data: {
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  }
}
```

---

### 15. My Studies Page (`/marketplace/my-studies`)

**Purpose:** View studies user has applied to

**UI Components:**

- Active studies list
- Completed studies list
- Each study shows:
  - Study name
  - Payment amount
  - Status (Active/Completed)
  - Data shared (document count)
  - Expiration date
  - Earnings status

**Study Item Schema:**

```typescript
interface UserStudy {
  leaseId: string;
  study: Study;
  appliedAt: string;
  expiresAt: string;
  paymentAmount: string;
  paymentStatus: 'PENDING' | 'PAID';
  documentsShared: number;
}
```

---

### 16. Create Research Study Page (`/researcher/create`)

**Purpose:** Researchers create new studies

**UI Components:**

- Multi-step form:
  1. Basic Info
  2. Requirements
  3. Payment & Escrow
  4. Review & Submit

**Form Schema:**

```typescript
interface CreateStudyForm {
  // Step 1: Basic Info
  title: string;
  description: string;
  fullDescription: string;
  irbApprovalDocument: File;

  // Step 2: Requirements
  requiredDataCategories: string[];  // LAB_RESULT, IMAGING, etc.
  eligibilityCriteria: string[];
  durationDays: number;

  // Step 3: Payment
  participantsNeeded: number;
  paymentPerUser: string;  // In BDAG
  totalEscrow: string;     // Auto-calculated
}
```

**Step 1 - Basic Info:**

- Title input (max 100 chars)
- Short description (max 300 chars)
- Full description (rich text editor)
- IRB approval upload

**Step 2 - Requirements:**

- Document category checkboxes
- Eligibility criteria (bullet list)
- Study duration (days selector)

**Step 3 - Payment & Escrow:**

- Participants needed (number input)
- Payment per user (BDAG input)
- Total escrow calculation: `participantsNeeded * paymentPerUser`
- MetaMask payment button

**API Integration:**

```typescript
// Upload IRB document first
POST /api/documents
Body: FormData { file: irbDocument }
Response: { data: { ipfsHash: string } }

// Create study (triggers blockchain transaction)
POST /api/marketplace/studies/create
Headers: { Authorization: 'Bearer <token>' }
Request Body: {
  title: string;
  description: string;
  metadataHash: string;  // IPFS hash of full metadata
  irbApprovalHash: string;
  participantsNeeded: number;
  paymentPerUser: string;
  durationDays: number;
  requiredDataCategories: string[];
}
Response: {
  success: true;
  data: {
    studyId: string;
    status: 'PENDING';
    transactionHash: string;
  }
}
```

**MetaMask Integration:**

```typescript
// Calculate total in wei
const totalEscrow = ethers.parseEther(
  (participantsNeeded * paymentPerUser).toString()
);

// Send transaction
const tx = await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: walletAddress,
    to: MARKETPLACE_CONTRACT_ADDRESS,
    value: totalEscrow.toString(16),
    data: createStudyCallData
  }]
});
```

---

## ⚙️ Settings & Profile

### 17. User Profile Page (`/profile`)

**Purpose:** View and edit user information

**UI Components:**

- Profile header (avatar, name, email)
- Wallet info section (address, DID)
- Personal info form
- Security settings
- Account actions

**Sections:**

#### A. Profile Header

- Avatar (placeholder or uploaded image)
- Name (editable)
- Email (read-only)
- Member since date

#### B. Wallet Information

```typescript
interface WalletInfo {
  walletAddress: string;  // Short format: 0x1234...5678
  did: string;            // Full DID
  didStatus: string;
  balance?: string;       // Optional: show BDAG balance
}
```

Display:

- Wallet Address (with copy button)
- DID (with copy button)
- "View on BlockDAG Explorer" link

#### C. Personal Information Form

```typescript
interface ProfileForm {
  name: string;
  email: string;  // Read-only
  phone?: string;
  dateOfBirth?: string;
  bloodType?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
```

**API Integration:**

```typescript
PUT /api/user/me
Headers: { Authorization: 'Bearer <token>' }
Request Body: {
  name?: string;
  phone?: string;
  // ... other fields
}
Response: {
  success: true;
  data: User;
}
```

#### D. Security Settings

- Change password button → Modal
- Two-factor authentication (future)
- Active sessions list
- Logout all devices

#### E. Account Actions

- Download my data (GDPR)
- Delete account (with confirmation)

---

### 18. Settings Page (`/settings`)

**Purpose:** App preferences and notifications

**UI Components:**

- Notifications preferences
- Privacy settings
- Display preferences
- About & Support

**Notification Settings:**

```typescript
interface NotificationSettings {
  email: {
    studyInvites: boolean;
    paymentReceived: boolean;
    documentUpdates: boolean;
    securityAlerts: boolean;
  };
  push: {
    // Same options
  };
}
```

**Privacy Settings:**

- Data sharing preferences
- QR code default expiration
- Automatic document encryption (read-only: always on)

**Display Preferences:**

- Theme (Light/Dark/Auto)
- Language (English - expandable)
- Currency display (BDAG/USD)

**API Integration:**

```typescript
GET /api/settings
PUT /api/settings
// Use same schema as /api/user/me
```

---

## 🧩 Components Library

### Reusable Components to Build

#### 1. Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
}
```

#### 2. Input Component

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}
```

#### 3. Card Component

```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

#### 4. Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size: 'sm' | 'md' | 'lg' | 'full';
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
}
```

#### 5. Toast/Notification Component

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;  // ms
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### 6. Loading Spinner Component

```typescript
interface SpinnerProps {
  size: 'sm' | 'md' | 'lg';
  color?: string;
  fullscreen?: boolean;
}
```

#### 7. Status Badge Component

```typescript
interface BadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  size: 'sm' | 'md';
  dot?: boolean;
}
```

#### 8. Dropdown/Select Component

```typescript
interface SelectProps {
  options: Array<{ value: string; label: string; }>;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  multiple?: boolean;
}
```

#### 9. File Upload Component

```typescript
interface FileUploadProps {
  accept: string;  // 'image/*', '.pdf', etc.
  maxSize: number;  // bytes
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  preview?: boolean;
  label: string;
  error?: string;
}
```

#### 10. Progress Bar Component

```typescript
interface ProgressBarProps {
  value: number;  // 0-100
  max?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}
```

#### 11. Pagination Component

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
}
```

#### 12. EmptyState Component

```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### 13. WalletConnect Component

```typescript
interface WalletConnectProps {
  onConnect: (wallet: { address: string; signature: string }) => void;
  onError: (error: Error) => void;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'secondary';
}
```

#### 14. QRCode Display Component

```typescript
interface QRCodeProps {
  data: string;  // QR code payload
  size?: number;  // px
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  logoUrl?: string;  // Center logo
}
```

---

## 🔌 API Integration

### API Client Setup

```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Functions

```typescript
// api/auth.ts
export const authAPI = {
  register: (data: RegisterForm) =>
    apiClient.post('/api/auth/register', data),

  login: (data: LoginForm) =>
    apiClient.post('/api/auth/login', data),

  logout: () =>
    apiClient.post('/api/auth/logout'),
};

// api/user.ts
export const userAPI = {
  getProfile: () =>
    apiClient.get('/api/user/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put('/api/user/me', data),

  connectWallet: (data: WalletConnectionRequest) =>
    apiClient.post('/api/user/wallet/connect', data),

  createDID: () =>
    apiClient.post('/api/user/wallet/did'),

  getDIDStatus: () =>
    apiClient.get('/api/user/wallet/did/status'),
};

// api/documents.ts
export const documentsAPI = {
  list: (params?: { category?: string }) =>
    apiClient.get('/api/documents', { params }),

  upload: (file: File, category: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return apiClient.post('/api/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getStatus: (id: string) =>
    apiClient.get(`/api/documents/${id}/status`),

  delete: (id: string) =>
    apiClient.delete(`/api/documents/${id}`),
};

// api/marketplace.ts
export const marketplaceAPI = {
  listStudies: (params?: { status?: string }) =>
    apiClient.get('/api/marketplace/studies', { params }),

  getStudy: (id: string) =>
    apiClient.get(`/api/marketplace/studies/${id}`),

  applyToStudy: (id: string, data: { documentIds: string[] }) =>
    apiClient.post(`/api/marketplace/studies/${id}/apply`, data),

  getLeaseStatus: (id: string) =>
    apiClient.get(`/api/marketplace/leases/${id}/status`),

  createStudy: (data: CreateStudyForm) =>
    apiClient.post('/api/marketplace/studies/create', data),
};

// api/qr.ts
export const qrAPI = {
  generate: (data: QRCodeConfig) =>
    apiClient.post('/api/emergency/qr', data),

  access: (data: ResponderInfo & { qrPayload: string }) =>
    apiClient.post('/api/emergency/access', data),
};

// api/dashboard.ts
export const dashboardAPI = {
  getStats: () =>
    apiClient.get('/api/dashboard/stats'),

  getActivity: () =>
    apiClient.get('/api/dashboard/activity'),
};
```

---

## 🗂️ State Management

### Recommended: Context API + React Query

#### Auth Context

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterForm) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null);

export const useAuth = () => useContext(AuthContext);
```

#### Wallet Context

```typescript
interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  did: string | null;
  didStatus: DidCreationStatus;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>(null);

export const useWallet = () => useContext(WalletContext);
```

#### React Query Hooks

```typescript
// hooks/useDocuments.ts
export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsAPI.list(),
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, category }: { file: File; category: string }) =>
      documentsAPI.upload(file, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

// hooks/useStudies.ts
export const useStudies = () => {
  return useQuery({
    queryKey: ['studies'],
    queryFn: () => marketplaceAPI.listStudies(),
  });
};

export const useApplyToStudy = () => {
  return useMutation({
    mutationFn: ({ studyId, documentIds }: { studyId: string; documentIds: string[] }) =>
      marketplaceAPI.applyToStudy(studyId, { documentIds }),
  });
};
```

---

## 🎨 Design System

### Colors

```typescript
const colors = {
  primary: {
    50: '#e6f2ff',
    100: '#bfddff',
    500: '#0066cc',  // Main brand color
    600: '#0052a3',
    900: '#002952',
  },
  success: {
    50: '#e6f9ed',
    500: '#00c853',
    700: '#00a143',
  },
  warning: {
    50: '#fff8e1',
    500: '#ffc107',
    700: '#f57c00',
  },
  error: {
    50: '#ffebee',
    500: '#f44336',
    700: '#d32f2f',
  },
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    500: '#9e9e9e',
    700: '#616161',
    900: '#212121',
  },
};
```

### Typography

```typescript
const typography = {
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  small: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
};
```

### Spacing

```typescript
const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};
```

### Shadows

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};
```

---

## 📱 Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// Usage in styled-components or Tailwind
const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
};
```

---

## 🚀 Routing Structure

```
/                          → Landing page (public)
/login                     → Login page
/register                  → Registration page
/onboarding/wallet         → Wallet connection
/onboarding/did            → DID creation status

/dashboard                 → Main dashboard (protected)
/profile                   → User profile
/settings                  → App settings

/documents                 → Documents list
/documents/upload          → Upload document
/documents/:id             → Document details

/qr/generate               → QR code generator
/qr/my-codes               → Saved QR codes

/marketplace               → Browse studies
/marketplace/studies/:id   → Study details
/marketplace/my-studies    → User's active studies

/researcher/create         → Create new study
/researcher/dashboard      → Researcher dashboard

/wallet                    → Wallet & earnings page
```

---

## ✅ Implementation Checklist

### Phase 1: Authentication & Onboarding

- [ ] Registration page
- [ ] Login page
- [ ] Wallet connection flow
- [ ] DID creation flow
- [ ] Auth context setup

### Phase 2: Core Features

- [ ] Dashboard page
- [ ] Document upload
- [ ] Document list
- [ ] QR code generator
- [ ] Profile page

### Phase 3: Marketplace

- [ ] Studies list page
- [ ] Study details page
- [ ] Apply to study flow
- [ ] My studies page
- [ ] Create study (researcher)

### Phase 4: Polish

- [ ] Settings page
- [ ] Activity feed
- [ ] Notifications
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states

---

## 📚 Additional Resources

### Required Libraries

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "ethers": "^6.15.0",
    "qrcode.react": "^3.1.0",
    "react-dropzone": "^14.2.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0"
  }
}
```

### MetaMask Detection

```typescript
const isMetaMaskInstalled = () => {
  const { ethereum } = window as any;
  return Boolean(ethereum && ethereum.isMetaMask);
};
```

### IPFS Hash Display

```typescript
const formatIPFSHash = (hash: string): string => {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};
```

### Wallet Address Display

```typescript
const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
```

### Currency Formatting

```typescript
const formatBDAG = (amount: string): string => {
  return `${parseFloat(amount).toFixed(2)} BDAG`;
};
```

---

## 🔒 Security Considerations

1. **Never store private keys** in frontend
2. **Always use HTTPS** in production
3. **Validate all user inputs** client-side
4. **Sanitize displayed data** to prevent XSS
5. **Use CSP headers** to prevent injection attacks
6. **Implement rate limiting** on sensitive actions
7. **Store JWT in httpOnly cookies** (not localStorage) if possible
8. **Encrypt sensitive data** before IPFS upload
9. **Verify MetaMask signatures** on backend
10. **Use SRI** for external scripts

---

## 📞 Support

For questions or clarifications:

- Backend API docs: `/api/docs` or `/scalar`
- Smart contract docs: `healthdag-smart-contract/docs/`
- Design assets: [Link to Figma/Design files]

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-12
**Maintained By:** HealthLease Hub Team
