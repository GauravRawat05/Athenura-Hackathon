/**
 * certificate.service.js
 * Contains the core business rules for certificate: this is where the
 * non-blocking, non-transactional, three-stage issuance workflow lives.
 *
 * ── Three-Stage Non-Blocking Issuance ───────────────────────────────────────
 *
 *  Stage 1 ─ sync, one short transaction:
 *    Create a Certificate record in `PENDING` status and commit immediately.
 *    Surfaces the certificate `_id` back to the caller so it can be shown
 *    in the front-end dashboard right away.
 *
 *  Stage 2 ─ async, outside any transaction (no DB locks held):
 *    Transition: PENDING → GENERATING
 *    Render the PDF using the React-PDF template service.
 *    Transition: GENERATING → UPLOADING
 *    Upload the PDF binary to Cloudinary.
 *
 *  Stage 3 ─ a fresh, short transaction:
 *    Transition: UPLOADING → COMPLETED
 *    Persist the Cloudinary URL + public_id.
 *    Commit.
 *
 *  Error path ─ any stage that fails sets status to FAILED, increments
 *  `retryCount`, records `lastFailureReason`, and triggers the retry path
 *  if retries remain.
 */
import fs from 'fs';
import {
  GENERATION_STATUS,
  canTransition,
  validateTransition,
} from './certificate.constants.js';
import Certificate from './certificate.model.js';
import certificateRepository from './certificate.repository.js';
import {
  buildCertificatePayload,
  buildQrCodeImage,
} from './certificate.template.service.js';
import { renderCertificateToFile } from './certificate.pdf.service.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { sendEmail, EMAIL_TYPES } from '../../modules/notifications/notification.mailer.js';
import userRepository from '../users/user.repository.js';
import { verifyCertificate } from './certificate.verify.service.js';

// ── Retry / Backoff constants ─────────────────────────────────────────────────
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 5_000;   // 5 seconds — doubled each retry

// ── Internal helper – controlled delay ────────────────────────────────────────

/**
 * Simple non-blocking sleep using Atomics — safe in async/await chains.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates exponential backoff: delay = 5000 * 2^(retryCount)
 *   retryCount 0 → 5 000 ms
 *   retryCount 1 → 10 000 ms
 *   retryCount 2 → 20 000 ms
 *   retryCount 3 → 40 000 ms … (stop at MAX_RETRIES)
 *
 * @param {number} retryCount — how many retries have already been attempted
 * @returns {number}          — backoff milliseconds
 */
function backoffDelay(retryCount) {
  return INITIAL_DELAY_MS * 2 ** Math.min(retryCount, MAX_RETRIES);
}

// ── Stage 1 ────────────────────────────────────────────────────────────────────

/**
 * Stage 1: Immediately persist a PENDING certificate record.
 * Returns the fresh certificate document to the caller.
 *
 * @param {object} fields — all fields needed for the Certificate document
 * @returns {Promise<Certificate>}
 */
async function stage1_CreatePendingRecord(fields) {
  return await certificateRepository.create({
    ...fields,
    generationStatus: GENERATION_STATUS.PENDING,
  });
}

// ── Stage 2 ────────────────────────────────────────────────────────────────────
// (no DB transaction — we do not hold any locks here)

/**
 * Advance PENDING → GENERATING, render the PDF, then advance to UPLOADING.
 * All transitions are guarded by validateTransition so a concurrent Stage 3
 * commit cannot unexpectedly move the status past us without being detected.
 *
 * @param {Certificate} certDoc
 * @returns {Promise<{pdfPath: string}>}
 * @throws  — re-throws to let the caller (runGeneration) handle failure
 */
async function stage2_RenderAndTransitionToUploading(certDoc) {
  // ── PENDING → GENERATING ───────────────────────────────────────────────────
  const toGenerating = await certificateRepository.transitionStatus(
    certDoc._id,
    GENERATION_STATUS.PENDING,
    GENERATION_STATUS.GENERATING,
    { retryCount: certDoc.retryCount + 1 }
  );

  if (!toGenerating) {
    throw new Error(
      `Concurrent status change detected for certificate ${certDoc._id}. Aborting generation.`
    );
  }

  certDoc = toGenerating;

  // ── Build QR code image ────────────────────────────────────────────────────
  const qrDataUrl = await buildQrCodeImage(certDoc);

  // ── Build template payload ─────────────────────────────────────────────────
  const user = await userRepository.findUserById(certDoc.userId);
  if (!user) {
    throw new Error(`User ${certDoc.userId} not found — cannot generate certificate.`);
  }

  const templatePayload = buildCertificatePayload({
    userName: user.fullName,
    hackathonTitle: 'Hackathon',          // replaced below after fetching hackathon
    teamName: null,
    submissionTitle: null,
    certificateType: certDoc.certificateType,
    awardCategory: certDoc.awardCategory,
    rank: certDoc.rank,
  });

  // Fetch hackathon title alongside.
  const HackathonModel = (await import('../admin/hackathons/hackathon.model.js')).default;
  const hackathon = await HackathonModel.findById(certDoc.hackathonId);
  if (hackathon) {
    templatePayload.hackathonTitle = hackathon.title;
  }

  // Generate a unique file name for this certificate generation attempt
  const pdfFileName = `cert_${certDoc._id}_${Date.now()}.pdf`;

  // ── Render PDF to temp file ────────────────────────────────────────────────
  let pdfPath;
  try {
    pdfPath = await renderCertificateToFile(
      { ...templatePayload, qrDataUrl },
      { fileName: pdfFileName }
    );
  } catch (pdfErr) {
    throw new Error(`PDF rendering failed: ${pdfErr.message}`);
  }

  // ── GENERATING → UPLOADING ─────────────────────────────────────────────────
  const toUploading = await certificateRepository.transitionStatus(
    certDoc._id,
    GENERATION_STATUS.GENERATING,
    GENERATION_STATUS.UPLOADING
  );
  if (!toUploading) {
    // Clean up the temp PDF file — nobody will process it
    try {
      if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    } catch { /* best effort */ }
    throw new Error(
      `Concurrent status change detected for certificate ${certDoc._id} after PDF render. Aborting upload.`
    );
  }

  certDoc = toUploading;
  return { pdfPath, certDoc };
}

/**
 * Push the rendered PDF up to Cloudinary and transition to COMPLETED or FAILED.
 *
 * @param {Certificate} certDoc
 * @param {string}      pdfPath
 * @returns {Promise<{cloudinaryPublicId: string, certificateUrl: string}>}
 */
async function stage3_UploadAndTransitionToCompleted(certDoc, pdfPath) {
  const uploadResult = await uploadToCloudinary(pdfPath, {
    folder: `certificates/${certDoc.hackathonId}`,
    public_id: `cert_${certDoc._id}`,
    resource_type: 'raw',
  });

  // ── UPLOADING → COMPLETED ──────────────────────────────────────────────────
  const completed = await certificateRepository.transitionStatus(
    certDoc._id,
    GENERATION_STATUS.UPLOADING,
    GENERATION_STATUS.COMPLETED,
    {
      cloudinaryPublicId: uploadResult.public_id,
      certificateUrl: uploadResult.secure_url,
      retryCount: certDoc.retryCount,   // reset-or-maintain needed on retry
      lastFailureReason: null,
    }
  );

  // Best-effort: remove the PDF only after the DB write succeeds
  try {
    if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
  } catch { /* ignore cleanup errors */ }

  if (!completed) {
    throw new Error(
      `Failed to finalise certificate ${certDoc._id}. Record may already have been completed by another worker.`
    );
  }

  return {
    cloudinaryPublicId: uploadResult.public_id,
    certificateUrl: uploadResult.secure_url,
  };
}

// ── Error handling & retry ─────────────────────────────────────────────────────

/**
 * Called whenever a stage in the generation pipeline throws.
 * Transitions the certificate to FAILED and decides whether a retry is possible.
 *
 * @param {Certificate} certDoc      — the certificate document at time of failure
 * @param {Error}       failure      — the error that was thrown
 * @param {string}      [expectedStatus] — status we were in when the error occurred
 */
async function handleGenerationFailure(certDoc, failure, expectedStatus) {
  const message = failure.message || String(failure);
  const finalize = async (finalStatus) => {
    await certificateRepository.transitionStatus(
      certDoc._id,
      expectedStatus,          // filter on this status to avoid overriding a late commit
      finalStatus,
      { lastFailureReason: message, retryCount: certDoc.retryCount + 1 }
    );
  };

  if (certDoc.retryCount >= MAX_RETRIES) {
    // Exhausted all retries — mark as permanently failed.
    await finalize(GENERATION_STATUS.FAILED);
    return { shouldRetry: false };
  }

  // Transition back to FAILED so a future queued retry can pick it up.
  await finalize(GENERATION_STATUS.FAILED);

  // Wait before the automatic retry.
  const delayMs = backoffDelay(certDoc.retryCount);
  await sleep(delayMs);

  return { shouldRetry: true, delayMs };
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Core generation loop. Drives Stage 1 → Stage 2 → Stage 3 with
 * retry + exponential backoff.
 *
 * @param {object} issueFields — the validated issue payload from the controller
 * @returns {Promise<Certificate>}
 */
async function runGeneration(issueFields) {
  const cert = await stage1_CreatePendingRecord(issueFields);
  cert.retryCount = 0;

  // Drive the 3-stage pipeline with retry
  let attempt = 0;
  let done = false;
  let pdfPath = null;

  while (!done && attempt <= MAX_RETRIES) {
    attempt = cert.retryCount;

    // ── Stage 1 is already done (we're past it on retries)
    // ── Stage 2 ──────────────────────────────────────────────────────────────
    let stage2Result;
    try {
      stage2Result = await stage2_RenderAndTransitionToUploading(cert);
      pdfPath = stage2Result.pdfPath;
      cert.generationStatus = GENERATION_STATUS.UPLOADING;
    } catch (stage2Err) {
      const failResult = await handleGenerationFailure(
        cert,
        stage2Err,
        GENERATION_STATUS.GENERATING
      );

      if (!failResult.shouldRetry) break;         // exhausted → stop
      // Re-fetch the latest doc so we have the fresh retryCount
      cert.retryCount = (await certificateRepository.findById(cert._id))?.retryCount ?? cert.retryCount;
      continue;                                   // retry loop
    }

    // ── Stage 3 ──────────────────────────────────────────────────────────────
    try {
      await stage3_UploadAndTransitionToCompleted(cert, stage2Result.pdfPath);
      done = true;                                 // success — stop retrying
    } catch (stage3Err) {
      // Attempt to clean up the PDF (orphaned file)
      try {
        if (stage2Result.pdfPath && fs.existsSync(stage2Result.pdfPath)) {
          fs.unlinkSync(stage2Result.pdfPath);
        }
      } catch { /* best-effort */ }

      // Clean up the Cloudinary file if one was uploaded
      if (cert.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(cert.cloudinaryPublicId);
        } catch { /* best-effort: do not crash on cleanup failure */ }
      }

      const failResult = await handleGenerationFailure(
        cert,
        stage3Err,
        GENERATION_STATUS.UPLOADING
      );

      if (!failResult.shouldRetry) break;
      cert.retryCount = (await certificateRepository.findById(cert._id))?.retryCount ?? cert.retryCount;
      pdfPath = null;
      continue;
    }
  }

  // ── Final state check ───────────────────────────────────────────────────────
  const finalCert = await certificateRepository.findById(cert._id);

  if (finalCert.generationStatus === GENERATION_STATUS.COMPLETED) {
    // Send the completion email to the participant
    await sendCertificateReadyEmail(finalCert);
  } else if (finalCert.generationStatus === GENERATION_STATUS.FAILED) {
    // Log the terminal failure — external monitoring / alerting layer picks this up.
    console.error(
      `[Certificate] Generation permanently failed for ${finalCert._id}:`,
      finalCert.lastFailureReason
    );
  }

  return finalCert;
}

/**
 * Sends a CERTIFICATE_READY email to the certificate recipient.
 *
 * @param {Certificate} cert
 */
async function sendCertificateReadyEmail(cert) {
  if (!cert?.userId) return;

  try {
    const [user, HackathonModel] = await Promise.all([
      userRepository.findUserById(cert.userId),
      (async () => (await import('../admin/hackathons/hackathon.model.js')).default)(),
    ]);

    if (!user?.email) return;

    const hackathon = cert.hackathonId
      ? await HackathonModel.findById(cert.hackathonId)
      : null;

    await sendEmail(user.email, EMAIL_TYPES.CERTIFICATE_READY, {
      fullName: user.fullName,
      hackathonTitle: hackathon?.title || 'the hackathon',
      certificateUrl: cert.certificateUrl,
    });
  } catch (mailErr) {
    // Never let a late email failure crash the whole generation flow.
    console.error(
      `[Certificate] Failed to send ready-email for ${cert._id}:`,
      mailErr.message
    );
  }
}

// ── REST helpers ────────────────────────────────────────────────────────────────

/**
 * Idempotency gate — returns an existing active certificate instead of
 * blindly creating a new one.
 */
async function findActiveCertificate({ userId, hackathonId, certificateType }) {
  return await certificateRepository.findByUserHackathonType({ userId, hackathonId, certificateType });
}

/**
 * Creates and triggers generation for a new certificate record.
 * If an active (non-deleted, non-revoked) certificate already exists for
 * the same (userId, hackathonId, certificateType) triple, it is returned
 * immediately — this is the idempotency guard.
 *
 * @param {object} issueFields
 * @returns {Promise<Certificate>}
 */
async function issueCertificate(issueFields) {
  const { userId, hackathonId, certificateType } = issueFields;

  // ① Idempotency gate — skip if one already exists
  const existing = await findActiveCertificate({ userId, hackathonId, certificateType });
  if (existing) {
    return existing;
  }

  //  If we reached here, no duplicate exists — proceed to create + enqueue
  const cert = await runGeneration(issueFields);
  return cert;
}

/**
 * Re-issues (regenerates) an existing certificate — overwrites the PDF and
 * Cloudinary asset with a fresh copy.
 *
 * The caller sets `isRegenerating = true` on the state machine validation
 * to allow the COMPLETED → GENERATING transition.
 *
 * @param {string} certificateId
 * @returns {Promise<Certificate | null>}
 */
async function regenerateCertificate(certificateId) {
  const cert = await certificateRepository.findById(certificateId);
  if (!cert) return null;

  // Reset generative fields so the pipeline looks fresh.
  cert.generationStatus = GENERATION_STATUS.GENERATING;
  cert.generationStartedAt = new Date();
  cert.generationCompletedAt = null;
  cert.cloudinaryPublicId = null;
  cert.certificateUrl = null;
  cert.retryCount = 0;
  cert.lastFailureReason = null;

  await certificateRepository.save(cert);
  return await runGeneration({
    userId: cert.userId,
    hackathonId: cert.hackathonId,
    certificateType: cert.certificateType,
    awardCategory: cert.awardCategory,
    rank: cert.rank,
    teamName: cert.teamName,
  });
}

/**
 * Revokes a certificate — sets isRevoked = true and stamps revokedAt.
 *
 * @param {string} certificateId
 * @returns {Promise<Certificate | null>}
 */
async function revokeCertificate(certificateId) {
  return await certificateRepository.updateById(certificateId, {
    isRevoked: true,
    revokedAt: new Date(),
  });
}

/**
 * Resends the certificate-ready email for an already-completed certificate.
 * Does not re-generate the PDF.
 *
 * @param {string} certificateId
 * @returns {Promise<boolean>}
 */
async function resendCertificateEmail(certificateId) {
  const cert = await certificateRepository.findById(certificateId);
  if (!cert) return false;

  if (cert.generationStatus !== GENERATION_STATUS.COMPLETED) {
    throw new Error(
      `Cannot send email for certificate ${certificateId}: status is ${cert.generationStatus}, not COMPLETED.`
    );
  }

  await sendCertificateReadyEmail(cert);
  return true;
}

/**
 * Lists certificates with optional filters and pagination.
 *
 * @param {object}  [options]
 * @param {number}  [options.page=1]
 * @param {number}  [options.limit=20]
 * @param {string}  [options.hackathonId]
 * @param {string}  [options.status]
 * @returns {Promise<{data: Array, pagination: object}>}
 */
async function listCertificates(options = {}) {
  return await certificateRepository.list(options);
}

/**
 * Fetches a single certificate by id.
 *
 * @param {string} certificateId
 * @returns {Promise<Certificate | null>}
 */
async function getCertificateById(certificateId) {
  return await certificateRepository.findById(certificateId);
}

const certificateService = {
  issueCertificate,
  regenerateCertificate,
  revokeCertificate,
  resendCertificateEmail,
  listCertificates,
  getCertificateById,
  verifyCertificate,
  canTransition,
  validateTransition,
};

export default certificateService;
