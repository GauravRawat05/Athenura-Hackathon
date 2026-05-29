# Implementation Plan - Payment Flow & Certificate Pipeline Fixes

This plan outlines the steps required to resolve the critical bugs identified in the code review, specifically focusing on the payment flow and the results -> certificate pipeline.

## User Review Required

> [!IMPORTANT]
> The primary issues causing payment failure on the webapp are:
> 1. **React-PDF Temp File Deletion**: A `finally` block in `certificate.pdf.service.js` deletes the generated certificate PDF before the service can upload it to Cloudinary. This crashes the certificate pipeline.
> 2. **Unpopulated Payment Relation**: The `/registrations/me` endpoint does not populate the `paymentId` relationship. As a result, the frontend page `Payment.jsx` receives `undefined` for `orderId`, failing to initialize Razorpay checkout.
> 3. **Uninstantiated UserRepository**: The `UserRepository` class definition is exported directly from `user.repository.js` rather than an instantiated singleton. When imported as `userRepository` and called via `userRepository.findById()`, it causes a runtime TypeError, crash, and rollback.

---

## Proposed Changes

### 1. UserRepository Instantiation Fix

#### [MODIFY] [user.repository.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/users/user.repository.js)
Export an instance of `UserRepository` to match other repository modules.

```diff
- export default UserRepository
+ const userRepository = new UserRepository();
+ export default userRepository;
```

---

### 2. Payment Verification & Frontend Flow

#### [MODIFY] [registration.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/registrations/registration.service.js)
Populate the `paymentId` relation in `getUserRegistrations` so that the frontend payment checkout page can correctly retrieve the `razorpayOrderId`.

```diff
     async getUserRegistrations(userId) {
-        return await Registration.find({ userId }).populate('hackathonId');
+        return await Registration.find({ userId }).populate('hackathonId').populate('paymentId');
     }
```

---

### 3. Certificate PDF Generation Pipeline

#### [MODIFY] [certificate.pdf.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.pdf.service.js)
Remove the immediate file deletion from the `finally` block. The cleanup is already handled by `stage3_UploadAndTransitionToCompleted` after successfully uploading to Cloudinary, or in the `catch` block on failure.

```diff
   try {
     await renderToFile(React.createElement(CertificateTemplate, props), outPath);
     return outPath;
   } catch (error) {
     // Clean up any partial file that may have been written on failure
     if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
     throw error;
   }
   finally {    // Optional: trigger cleanup of stale temp files on every render
     // (can be adjusted to run less frequently if desired)
     cleanStaleTempFiles().catch(() => { /* ignore cleanup errors */ });
-    fs.unlinkSync(outPath);
   }
```

#### [MODIFY] [certificate.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/certificates/certificate.service.js)
Ensure that the file is safely unlinked (deleted) after upload to Cloudinary inside `stage3_UploadAndTransitionToCompleted` or on error.

---

### 4. Registration Schema Field Alignment (Fixing 403 Forbidden)
For the files:
- [submission.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/submissions/submission.service.js)
- [asset.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/submissions/asset.service.js)
- [university.repository.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/universities/university.repository.js)
- [university.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/universities/university.service.js)
- [hackathon.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/hackathons/hackathon.service.js)
- [adminHackathon.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/hackathons/adminHackathon.service.js)
- [adminUniversity.service.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/universities/adminUniversity.service.js)
- [analytics.pipeline.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/analytics/analytics.pipeline.js)
- [analytics.repository.js](file:///c:/Users/USER/Documents/Hackathon-Athenura/Hackathon-Athenura/backend/src/modules/admin/analytics/analytics.repository.js)

Update the queries to use the correct fields from the Mongoose schema:
- `participantIds` ➔ `userId`
- `status` ➔ `registrationStatus` (and use uppercase values like `'CONFIRMED'`, `'CANCELLED'`, `'FAILED'`)
- `mode` ➔ `registrationType` (which holds `'solo'`, `'team'`, `'intern'`)

---

### 5. Frontend Admin Hookup
Rewrite button handlers in `DeclareWinners.jsx` and `CertificateManagement.jsx` to fetch and send data via HTTP REST calls to the corresponding `/api/v1/admin/results/*` and `/api/v1/admin/certificates/*` endpoints.
