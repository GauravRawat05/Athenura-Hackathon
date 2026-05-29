# 📄 Hackathon Management Platform — Master Detailed Code Review

This report presents a thorough, file-by-file senior-level code review of the Hackathon Management Platform. It compiles every defect, stub, mismatch, and architectural issue identified across both the backend (Express) and frontend (React/Vite).

---

## 🎯 Executive Summary
The platform contains all required database schemas and endpoints, but suffers from several **fatal runtime crashes** and **cross-module schema inconsistencies** that render the core flows (Registration, Payment, Submission, Judging, Results, and Certification) completely broken in the main codebase.

---

## 📂 File-by-File Code Review

### 1. Backend: Payments Module
- **[`payment.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/payments/payment.service.js)**:
  - 🔴 **Fatal Bug**: Imports `userRepository` from `../users/user.repository.js` (which is a raw class definition, not an instance) and calls `userRepository.findById(registration.userId)`. This throws a `TypeError` and crashes the signature verification flow mid-transaction.
  - 🟡 **Defect**: Razorpay API credentials are read from `envConfig.razorpayKeyId` and `envConfig.razorpayKeySecret`. If they are not mapped correctly to the environment variables, order creation fails.
- **[`payment.controller.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/payments/payment.controller.js)**:
  - 🟢 **Note**: Handles parsing signature parameters and calling `verifyAndConfirmPayment` correctly.
- **[`payment.model.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/payments/payment.model.js)**:
  - 🟢 **Note**: Schema defines proper statuses matching `PAYMENT_STATUSES`.
- **[`razorpay.util.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/libs/razorpay.util.js)**:
  - 🟢 **Note**: The HMAC SHA256 payment signature and webhook signature verification logic are mathematically correct.

---

### 2. Backend: Registrations Module
- **[`registration.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.service.js)**:
  - 🔴 **Fatal Bug**: `getUserRegistrations(userId)` (for the `/registrations/me` endpoint) does not populate the `paymentId` relation.
  - 🟡 **Design Flaw**: Checks if a registration deadline is passed but doesn't check if the hackathon is already completed or cancelled before initiating.
- **[`registration.routes.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.routes.js)**:
  - 🟡 **Inconsistency**: Includes a comment that it is designed to be mounted under `/hackathons` but it is actually mounted under `/registrations` in `api.js`.

---

### 3. Backend: Certificates Module
- **[`certificate.pdf.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.pdf.service.js)**:
  - 🔴 **Fatal Bug**: The `finally` block in `renderCertificateToFile` calls `fs.unlinkSync(outPath)`. This deletes the newly rendered PDF file before the caller (`runGeneration` in `certificate.service.js`) can upload it to Cloudinary, crashing the pipeline.
- **[`certificate.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.service.js)**:
  - 🔴 **Fatal Bug**: Imports `userRepository` directly as a class and calls `userRepository.findUserById(certDoc.userId)`, causing a runtime crash.
- **[`certificate.template.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.template.service.js)**:
  - 🟢 **Note**: Correctly maps certificate types and award categories.

---

### 4. Backend: Submissions & Assets Modules
- **[`submission.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/submissions/submission.service.js)**:
  - 🔴 **Fatal Mismatch**: Query for checking user registration looks like:
    ```javascript
    const registration = await Registration.findOne({
      hackathonId,
      participantIds: userId,
      status: "confirmed"
    });
    ```
    Since the schema uses `userId` (not `participantIds`), `registrationStatus` (not `status`), and holds uppercase `'CONFIRMED'` (not `'confirmed'`), this query returns `null`. This prevents participants from submitting projects (returns 403).
- **[`asset.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/submissions/asset.service.js)**:
  - 🔴 **Fatal Mismatch**: Has the exact same registration query mismatch, blocking users from uploading screenshots or demo assets to their submissions (returns 403).

---

### 5. Backend: Universities Module
- **[`university.repository.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/universities/university.repository.js)**:
  - 🔴 **Fatal Mismatch**: `findStudentRegistrationsByStudentIds` queries using `participantIds` and `status: { $ne: 'cancelled' }`. It always returns an empty array.
- **[`university.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/universities/university.service.js)**:
  - 🔴 **Fatal Crash**: Iterates over registrations using `reg.participantIds.forEach()`. Since `participantIds` is undefined, it throws `TypeError: Cannot read properties of undefined (reading 'forEach')` and crashes the server.

---

### 6. Backend: Admin & Analytics Modules
- **[`adminHackathon.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/hackathons/adminHackathon.service.js)**:
  - 🔴 **Fatal Mismatch**: Populates `participantIds` and filters on `status: 'confirmed'`. This breaks the ongoing sync job and emails are never dispatched.
- **[`adminUniversity.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/universities/adminUniversity.service.js)**:
  - 🔴 **Fatal Mismatch**: Queries using `participantIds` and `status: { $ne: 'cancelled' }`, making dashboard registry stats always show 0.
- **[`analytics.pipeline.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/analytics/analytics.pipeline.js)**:
  - 🔴 **Fatal Mismatch**: Uses `$isArray: "$participantIds"` and `status` queries, rendering admin analytics dashboards blank or inaccurate.

---

### 7. Backend: Infrastructure & Middleware Stubs
- **[`csrf.middleware.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/middleware/csrf.middleware.js)**: Empty file. No CSRF protection.
- **[`ownership.middleware.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/middleware/ownership.middleware.js)**: Empty file. No resource-ownership validation.
- **[`rateLimit.middleware.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/middleware/rateLimit.middleware.js)**: Empty file. No brute-force protection.
- **[`cleanExpiredTokens.job.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/jobs/cleanExpiredTokens.job.js)**: Empty background worker.
- **[`registrationConfirmation.job.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/jobs/registrationConfirmation.job.js)**: Empty background worker.
- **[`sendInvitationEmail.job.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/jobs/sendInvitationEmail.job.js)**: Empty background worker.
- **[`sendVerificationEmail.job.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/jobs/sendVerificationEmail.job.js)**: Empty background worker.

---

### 8. Frontend: Core & Pages
- **[`Payment.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/participant/Payment.jsx)**:
  - 🔴 **Fatal Defect**: Reads order information from `registration?.paymentId?.razorpayOrderId`. Since `paymentId` is not populated by the backend `/registrations/me` response, it yields `undefined` and throws an alert blocking checkout.
- **[`DeclareWinners.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/admin/DeclareWinners.jsx)**:
  - 🔴 **Stub**: All result computations, draft overrides, results publishing, and certificate generations are mock routines using `setTimeout` (2-2.5 seconds) and updating only local state. They do not send requests to the server.
- **[`CertificateManagement.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/admin/CertificateManagement.jsx)**:
  - 🔴 **Stub**: Built completely on mocked templates, logs, and histories (`INITIAL_TEMPLATES`, `INITIAL_ISSUED`, `VERIF_HISTORY`). It does not import or use any API service layer.

---

## 🛠️ Schema Mapping Correction Reference

To align queries with the actual schema defined in [`registration.model.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.model.js), make the following replacements across all backend query files:

| Query Pattern (Incorrect) | Correct Pattern (Fix) |
| :--- | :--- |
| `participantIds: userId` | `userId: userId` (or resolve through team model) |
| `status: 'confirmed'` | `registrationStatus: 'CONFIRMED'` |
| `status: { $ne: 'cancelled' }` | `registrationStatus: { $ne: 'CANCELLED' }` |
| `reg.mode === 'team'` | `reg.registrationType === 'team'` |

---

## 📋 Recommended Priorities & Steps

### Phase 1: Payment Flow Fixes (Immediate)
1. Instantiate `UserRepository` in [`user.repository.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/users/user.repository.js).
2. Add `.populate('paymentId')` to the registration query in [`registration.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.service.js).
3. Test a mock solo/team registration checkout to confirm Razorpay launches and completes signature verification client-side.

### Phase 2: Submission and Dashboard Corrections (Medium)
1. Align schema queries in submissions, assets, hackathon services, and analytics pipelines.
2. Verify project submission succeeds and assets upload correctly to Cloudinary without returning 403.

### Phase 3: Results & Certification Wiring (High)
1. Remove `fs.unlinkSync(outPath)` from the `finally` block in [`certificate.pdf.service.js`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.pdf.service.js) and let `stage3` clean up the file after uploading to Cloudinary.
2. Hook up frontend admin pages [`DeclareWinners.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/admin/DeclareWinners.jsx) and [`CertificateManagement.jsx`](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/frontend/src/pages/admin/CertificateManagement.jsx) to hit actual backend admin endpoints.
3. Test publishing results and verify certificates are auto-generated, uploaded, and emails sent.
