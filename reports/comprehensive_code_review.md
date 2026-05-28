# 🔍 Hackathon Management Platform — Comprehensive Code Review

> [!CAUTION]
> This senior-level review found **90+ issues** across the entire codebase. These include **fatal backend crashes**, **broken pipelines**, **stubs**, **schema mismatches**, and **security vulnerabilities**.

---

## 🚨 CRITICAL PATH: Payment Flow Bugs

The Razorpay payment succeeds in test mode, but the webapp displays "Payment Failed" or blocks checkout entirely. Here is the exact root-cause analysis:

### 1. Uninstantiated `UserRepository` (Fatal Backend Crash)
- **File**: [`backend/src/modules/users/user.repository.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/users/user.repository.js)
- **Issue**: The file exports the raw class definition (`export default UserRepository`) instead of an instance of the class (`export default new UserRepository()`).
- **Impact**: When [`payment.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/payments/payment.service.js) attempts to send a registration confirmation email (after successful payment signature verification), it executes:
  ```javascript
  const user = await userRepository.findById(registration.userId);
  ```
  Since `userRepository` is the class constructor, this throws `TypeError: userRepository.findById is not a function`. The transaction aborts/rolls back, the registration is never confirmed in the DB, and the backend returns a 500 error, causing the frontend to report "Payment Failed".

### 2. Missing `paymentId` Population in User Registrations
- **File**: [`backend/src/modules/registrations/registration.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.service.js)
- **Issue**: In `getUserRegistrations(userId)`, the database query only populates `hackathonId`:
  ```javascript
  async getUserRegistrations(userId) {
      return await Registration.find({ userId }).populate('hackathonId');
  }
  ```
- **Impact**: On the frontend in [`Payment.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/participant/Payment.jsx), the code reads the order details directly from the registration:
  ```javascript
  const orderId = registration?.paymentId?.razorpayOrderId;
  ```
  Since `paymentId` is not populated, it is just a raw ObjectId string (or undefined), making `registration.paymentId.razorpayOrderId` throw or resolve to `undefined`. This triggers the error check:
  ```javascript
  if (!orderId) {
    throw new Error("Payment order not found for this registration. Please contact support.");
  }
  ```
  This immediately blocks the participant from launching Razorpay checkout.

---

## 🚨 CRITICAL PATH: Judging → Results → Certificate Pipeline

### 3. Immediate Temp PDF Deletion (Fatal Backend Crash)
- **File**: [`backend/src/modules/certificates/certificate.pdf.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.pdf.service.js)
- **Issue**: In `renderCertificateToFile`, the `finally` block executes `fs.unlinkSync(outPath)` before returning:
  ```javascript
  finally {
    cleanStaleTempFiles().catch(() => {});
    fs.unlinkSync(outPath);
  }
  ```
- **Impact**: The generated PDF is deleted *before* the caller (`stage3_UploadAndTransitionToCompleted` in [`certificate.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.service.js)) can upload it to Cloudinary. The upload function throws an error, causing certificate generation to permanently fail.

### 4. Mocked Admin Pages on Frontend (Critical Stubs)
- **Files**: 
  - [`frontend/src/pages/admin/DeclareWinners.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/admin/DeclareWinners.jsx)
  - [`frontend/src/pages/admin/CertificateManagement.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/admin/CertificateManagement.jsx)
- **Issue**: All main functions (Result Compilation, Draft Ranking Override, Results Publishing, and Certificate Generation) are mocked using local state and `setTimeout` simulations.
  - E.g., `handlePublish` simulates publishing using `await new Promise(r => setTimeout(r, 2500));`.
  - There are no API hookups to backend admin endpoints like `/admin/results/publish/:hackathonId` or `/admin/results/draft/:hackathonId`.

---

## 🔴 Schema Mismatches on the `Registration` Model

The database fields in [`registration.model.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.model.js) are `userId` and `registrationStatus` (containing uppercase values like `'CONFIRMED'`), and there is **no** `participantIds` array. However, multiple service layers query it incorrectly, leading to silent failures or crashes:

| Module / File | Code Location | Invalid Field Query / Logic | Impact |
| :--- | :--- | :--- | :--- |
| **Submissions**<br>[submission.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/submissions/submission.service.js) | Line 40, 108 | Queries `{ participantIds: userId, status: "confirmed" }` | Returns `null` for confirmed registrations. Blocks project submission (throws 403 Forbidden). |
| **Assets**<br>[asset.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/submissions/asset.service.js) | Line 39 | Queries `{ participantIds: userId, status: "confirmed" }` | Blocks uploading assets to project submissions (throws 403). |
| **Universities Repository**<br>[university.repository.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/universities/university.repository.js) | Line 28 | Queries `{ participantIds: { $in: studentIds }, status: { $ne: 'cancelled' } }` | Queries fail, returning empty array. |
| **Universities Service**<br>[university.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/universities/university.service.js) | Line 45 | Executes `reg.participantIds.forEach(...)` | Throws `TypeError: Cannot read properties of undefined` and crashes the university dashboard API. |
| **Hackathons Service**<br>[hackathon.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/hackathons/hackathon.service.js) | Line 39, 47, 68, 76 | Queries `{ status: { $ne: 'cancelled' } }` and reads `reg.mode`, `reg.participantIds` | Public participant and team counts are computed as 0. |
| **Admin Hackathons**<br>[adminHackathon.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/hackathons/adminHackathon.service.js) | Line 409, 481 | Queries `{ status: 'confirmed' }` and populates `participantIds` | Mismatched fields cause sync of ongoing hackathons and list endpoints to fail. |
| **Admin Universities**<br>[adminUniversity.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/universities/adminUniversity.service.js) | Line 161 | Queries `{ participantIds: { $in: studentIds }, status: { $ne: 'cancelled' } }` | Registry stats count shows 0 registrations for universities. |
| **Analytics Pipelines**<br>[analytics.pipeline.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/analytics/analytics.pipeline.js) | Line 183, 196 | Groups/counts by `$isArray: "$participantIds"` and checks `status` | Time-series trends and overview counts are broken. |

---

## 🟡 Other Backend Module & Infrastructure Issues

### Auth & Middleware
- **JWT Middleware**: Expired token checking relies entirely on default `jwt.verify` exceptions. If custom session validations are needed, there are no checks for user account status (e.g. suspension) on cached tokens.
- **Empty Middleware files (Stubs)**:
  - [`csrf.middleware.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/middleware/csrf.middleware.js) - No CSRF protection implemented.
  - [`ownership.middleware.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/middleware/ownership.middleware.js) - No object-level ownership check. Any user could edit or view other users' submissions or payments if routes aren't manually checked.
  - [`rateLimit.middleware.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/middleware/rateLimit.middleware.js) - Rate limiting is a placeholder. Vulnerable to brute force.

### Background Jobs (Stubs)
The following files in `backend/src/jobs/` contain only documentation headers with no code logic:
- `cleanExpiredTokens.job.js`
- `registrationConfirmation.job.js`
- `sendInvitationEmail.job.js`
- `sendVerificationEmail.job.js`
