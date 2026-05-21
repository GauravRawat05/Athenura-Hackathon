/**
 * certificate.routes.js
 * Defines Express routes for the certificate domain and maps each endpoint to a controller.
 */
import { Router } from 'express';
import asyncHandler from '../../libs/asyncHandler.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';
import certificateController from './certificate.controller.js';
import { validate, listCertificatesValidation, certificateParamsValidation, issueCertificateValidation } from './certificate.validation.js';

const router = Router();

// ── Admin routes ───────────────────────────────────────────────────────────────

/**
  * POST   /certificates
  * Issues a new certificate.
  */
 router.post(
   '/',
   verifyJWT,
   verifyAdmin,
   validate(issueCertificateValidation),
   asyncHandler(certificateController.issueCertificate)
 );

/**
 * GET    /certificates
 * Lists all certificates with optional pagination and filters.
 */
router.get(
  '/',
  verifyJWT,
  verifyAdmin,
  validate(listCertificatesValidation, 'query'),
  asyncHandler(certificateController.listCertificates)
);

/**
 * GET    /certificates/:certificateId
 * Fetches a single certificate by MongoDB id.
 */
router.get(
  '/:certificateId',
  verifyJWT,
  verifyAdmin,
  validate(certificateParamsValidation, 'params'),
  asyncHandler(certificateController.getCertificateById)
);

/**
 * PATCH  /certificates/:certificateId/revoke
 * Soft-revokes a certificate by setting isRevoked = true.
 */
router.patch(
  '/:certificateId/revoke',
  verifyJWT,
  verifyAdmin,
  validate(certificateParamsValidation, 'params'),
  asyncHandler(certificateController.revokeCertificate)
);

/**
 * POST   /certificates/:certificateId/resend-email
 * Resends the certificate-ready notification email.
 */
router.post(
  '/:certificateId/resend-email',
  verifyJWT,
  verifyAdmin,
  validate(certificateParamsValidation, 'params'),
  asyncHandler(certificateController.resendCertificateEmail)
);

// ── Public / authenticated participant routes ───────────────────────────────────

/**
 * GET   /certificates/verify/:certificateCode
 * Public verification endpoint — no authentication required.
 * Returns a public-safe snapshot without leaking PII or internal DB fields.
 */
router.get(
  '/verify/:certificateCode',
  asyncHandler(certificateController.verifyByCode)
);

/**
 * GET   /certificates/:certificateId/download
 * Authenticated download of a certificate PDF.
 * Only the certificate owner or an admin may download.
 */
router.get(
  '/:certificateId/download',
  verifyJWT,
  validate(certificateParamsValidation, 'params'),
  asyncHandler(certificateController.downloadCertificate)
);

export default router;
