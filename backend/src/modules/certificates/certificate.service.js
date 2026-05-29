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
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import {
  GENERATION_STATUS,
  canTransition,
  validateTransition,
} from './certificate.constants.js';
import Certificate from './certificate.model.js';
import Counter from './counter.model.js';
import certificateRepository from './certificate.repository.js';
import {
  buildCertificatePayload,
  buildQrCodeImage,
  generateCertificateImage,
  generateCertificateCode,
} from './certificate.template.service.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { sendEmail, EMAIL_TYPES } from '../../modules/notifications/notification.mailer.js';
import userRepository from '../users/user.repository.js';
import { verifyCertificate } from './certificate.verify.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the certificate template
const TEMPLATE_PATH = path.join(__dirname, '..', '..', 'uoload', 'certificate.png');
const TEMP_DIR = path.join(__dirname, '..', '..', 'temp', 'certificates');

// ── Retry / Backoff constants ─────────────────────────────────────────────────
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 5_000;   // 5 seconds — doubled each retry

// ── Internal helper – controlled delay ────────────────────────────────────────

/**
 * Simple non-blocking sleep using Atomics — safe in async/await chains.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates exponential backoff: delay = 5000 * 2^(retryCount)
 */
function backoffDelay(retryCount) {
  return INITIAL_DELAY_MS * 2 ** Math.min(retryCount, MAX_RETRIES);
}

// ── Stage 1 ────────────────────────────────────────────────────────────────────

/**
 * Stage 1: Immediately persist a PENDING certificate record.
 */
async function stage1_CreatePendingRecord(fields) {
  return await certificateRepository.create({
    ...fields,
    generationStatus: GENERATION_STATUS.PENDING,
  });
}

// ── Stage 2 ────────────────────────────────────────────────────────────────────

/**
 * Advance PENDING → GENERATING, render the image, then advance to UPLOADING.
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

  // ── Build user data ────────────────────────────────────────────────────
  const user = await userRepository.findUserById(certDoc.userId);
  if (!user) {
    throw new Error(`User ${certDoc.userId} not found — cannot generate certificate.`);
  }

  // Fetch hackathon title
  const HackathonModel = (await import('../admin/hackathons/hackathon.model.js')).default;
  const hackathon = await HackathonModel.findById(certDoc.hackathonId);
  const hackathonTitle = hackathon ? hackathon.title : 'Hackathon';

  // Ensure temp dir exists
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  // Generate a unique file name for this certificate generation attempt
  const imgFileName = `cert_${certDoc._id}_${Date.now()}.png`;
  const outPath = path.join(TEMP_DIR, imgFileName);

  // ── Render PNG image using Sharp ────────────────────────────────────────
  try {
    await generateCertificateImage({
      participantName: user.fullName,
      hackathonName: hackathonTitle,
      certificateCode: certDoc.certificateCode,
      templatePath: TEMPLATE_PATH,
      outputPath: outPath,
    });
  } catch (imgErr) {
    throw new Error(`Image rendering failed: ${imgErr.message}`);
  }

  // ── GENERATING → UPLOADING ─────────────────────────────────────────────────
  const toUploading = await certificateRepository.transitionStatus(
    certDoc._id,
    GENERATION_STATUS.GENERATING,
    GENERATION_STATUS.UPLOADING
  );
  if (!toUploading) {
    // Clean up the temp file
    try {
      if (outPath && fs.existsSync(outPath)) fs.unlinkSync(outPath);
    } catch { /* best effort */ }
    throw new Error(
      `Concurrent status change detected for certificate ${certDoc._id} after image render. Aborting upload.`
    );
  }

  certDoc = toUploading;
  return { outPath, certDoc };
}

/**
 * Push the rendered image up to Cloudinary and transition to COMPLETED or FAILED.
 */
async function stage3_UploadAndTransitionToCompleted(certDoc, outPath) {
  const uploadResult = await uploadToCloudinary(outPath, {
    folder: `certificates/${certDoc.hackathonId}`,
    public_id: `cert_${certDoc._id}`,
    resource_type: 'image',
  });

  // ── UPLOADING → COMPLETED ──────────────────────────────────────────────────
  const completed = await certificateRepository.transitionStatus(
    certDoc._id,
    GENERATION_STATUS.UPLOADING,
    GENERATION_STATUS.COMPLETED,
    {
      cloudinaryPublicId: uploadResult.public_id,
      certificateUrl: uploadResult.secure_url,
      retryCount: certDoc.retryCount,
      lastFailureReason: null,
    }
  );

  // Best-effort cleanup
  try {
    if (outPath && fs.existsSync(outPath)) fs.unlinkSync(outPath);
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
  let outPath = null;

  while (!done && attempt <= MAX_RETRIES) {
    attempt = cert.retryCount;

    // ── Stage 2 ──────────────────────────────────────────────────────────────
    let stage2Result;
    try {
      stage2Result = await stage2_RenderAndTransitionToUploading(cert);
      outPath = stage2Result.outPath;
      cert.generationStatus = GENERATION_STATUS.UPLOADING;
    } catch (stage2Err) {
      const failResult = await handleGenerationFailure(
        cert,
        stage2Err,
        GENERATION_STATUS.GENERATING
      );

      if (!failResult.shouldRetry) break;
      cert.retryCount = (await certificateRepository.findById(cert._id))?.retryCount ?? cert.retryCount;
      continue;
    }

    // ── Stage 3 ──────────────────────────────────────────────────────────────
    try {
      await stage3_UploadAndTransitionToCompleted(cert, stage2Result.outPath);
      done = true;
    } catch (stage3Err) {
      // Attempt to clean up the image
      try {
        if (stage2Result.outPath && fs.existsSync(stage2Result.outPath)) {
          fs.unlinkSync(stage2Result.outPath);
        }
      } catch { /* best-effort */ }

      // Clean up Cloudinary if needed
      if (cert.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(cert.cloudinaryPublicId);
        } catch { /* best-effort */ }
      }

      const failResult = await handleGenerationFailure(
        cert,
        stage3Err,
        GENERATION_STATUS.UPLOADING
      );

      if (!failResult.shouldRetry) break;
      cert.retryCount = (await certificateRepository.findById(cert._id))?.retryCount ?? cert.retryCount;
      outPath = null;
      continue;
    }
  }

  // ── Final state check ───────────────────────────────────────────────────────
  const finalCert = await certificateRepository.findById(cert._id);

  if (finalCert.generationStatus === GENERATION_STATUS.COMPLETED) {
    await sendCertificateReadyEmail(finalCert);
  } else if (finalCert.generationStatus === GENERATION_STATUS.FAILED) {
    console.error(`[Certificate] Generation permanently failed for ${finalCert._id}:`, finalCert.lastFailureReason);
  }

  return finalCert;
}

/**
 * Sends a CERTIFICATE_READY email to the certificate recipient.
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

    // Download the certificate to attach it to the email
    let attachment = null;
    try {
      if (cert.certificateUrl) {
        const response = await axios.get(cert.certificateUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        attachment = {
          name: `Certificate_${cert.certificateCode}.png`,
          content: buffer.toString('base64'),
          contentType: 'image/png'
        };
      }
    } catch (downloadErr) {
      console.error(`[Certificate] Failed to download certificate for attachment:`, downloadErr.message);
    }

    await sendEmail(user.email, EMAIL_TYPES.CERTIFICATE_READY, {
      fullName: user.fullName,
      hackathonTitle: hackathon?.title || 'the hackathon',
      certificateUrl: cert.certificateUrl,
    }, attachment);
  } catch (mailErr) {
    console.error(`[Certificate] Failed to send ready-email for ${cert._id}:`, mailErr.message);
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
 */
async function issueCertificate(issueFields) {
  const { userId, hackathonId, certificateType } = issueFields;

  // ① Idempotency gate — skip if one already exists
  const existing = await findActiveCertificate({ userId, hackathonId, certificateType });
  if (existing) {
    return existing;
  }

  // ② Get atomic sequence and generate code
  const year = new Date().getFullYear();
  const counterKey = `certificate-${year}`;
  const counter = await Counter.findOneAndUpdate(
    { key: counterKey },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const sequence = counter.value;
  const certificateCode = generateCertificateCode(sequence);

  // ③ Proceed to create + enqueue
  const cert = await runGeneration({
    ...issueFields,
    certificateCode
  });
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

/**
 * Get certificates for a specific user (participant view).
 * Returns completed certificates that belong to the user.
 *
 * @param {string} userId - The user ID to fetch certificates for
 * @param {object} [options] - Pagination options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=20] - Results per page
 * @returns {Promise<object>} - Certificates data with pagination
 */
async function getUserCertificates(userId, options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    certificateRepository.findByUserId(userId, { limit, skip }),
    certificateRepository.countByUserId(userId)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

const certificateService = {
   issueCertificate,
   regenerateCertificate,
   revokeCertificate,
   resendCertificateEmail,
   listCertificates,
   getCertificateById,
   getUserCertificates,
   verifyCertificate,
   canTransition,
   validateTransition,
};

export default certificateService;
