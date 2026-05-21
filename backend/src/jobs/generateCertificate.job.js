/**
 * generateCertificate.job.js
 *
 * MIGRATION NOTICE
 * ────────────────
 * The original Puppeteer/EJS batch flow has been superseded by the
 * per-certificate React-PDF pipeline (certificate.service.js → runGeneration).
 * This file now acts as a thin batch adapter so existing call sites like
 * publishResults.job.js continue to work without any code changes.
 *
 * Migration path:
 *   1. Replace any direct `import generateCertificateJob from …generateCertificate.job.js`
 *      calls with `certificateService.issueCertificate(...)` for single-cert flows, or
 *      iterate resultsData manually in a for-of loop for batch flows.
 *   2. Once no call-sites depend on (hackathonId, resultsData) signatures, delete this file.
 *   3. Remove the `puppeteer` dependency from package.json after confirming no other files use it.
 *
 * ──── ORIGINAL IMPLEMENTATION (retained below, commented) ─────────────────────
 * src/jobs/generateCertificate.job.js (legacy — Puppeteer + EJS)
 * Uses puppeteer to screenshot EJS HTML templates and upload PDFs to Cloudinary.
 * REPLACED by: Certificate model + certificate.service.js (runGeneration)
 *              + CertificateTemplate.js (React-PDF, no JSX at runtime)
 *              + certificate.pdf.service.js (renderToFile / renderToBuffer)
 *
 * NOTE: The original implementation code has been removed to avoid parsing issues.
 * See git history for the Puppeteer version.
 */

import certificateService from '../modules/certificates/certificate.service.js';
import Hackathon from '../modules/admin/hackathons/hackathon.model.js';
import { CERTIFICATE_TYPES } from '../utils/constants/certificateTypes.js';

/**
 * Batch certificate generation adapter.
 *
 * Iterates over `resultsData` (array of result summary objects) and calls
 * `certificateService.issueCertificate()` for each entry.  Each call fires
 * the full 3-stage non-blocking pipeline independently — the loop is
 * fire-and-forget from the caller's perspective.
 *
 * @param {string}        hackathonId   — MongoDB hackathon id
 * @param {Array<object>} resultsData   — array of result objects, each must have:
 *                                        { userId, certificateType, rank?, awardCategory? }
 * @returns {Promise<void>}
 */
const generateCertificateJob = async (hackathonId, resultsData = []) => {
  console.log(`[Job] generateCertificate started for hackathon ${hackathonId} — ${resultsData.length} entries`);

  let successCount = 0;
  let failCount = 0;

  // Fetch hackathon metadata once for all entries.
  let hackathonTitle = 'Hackathon';
  try {
    const hackathon = await Hackathon.findById(hackathonId);
    if (hackathon) hackathonTitle = hackathon.title;
  } catch {
    // Non-fatal: continue with generic title if hackathon lookup fails.
  }

  for (const result of resultsData) {
    const { userId, certificateType, rank, awardCategory, submissionId } = result;

    try {
      await certificateService.issueCertificate({
        userId:              userId,
        hackathonId:         hackathonId,
        certificateType:     certificateType || CERTIFICATE_TYPES.PARTICIPATION,
        awardCategory:       awardCategory || null,
        rank:                rank || null,
        submissionId:        submissionId || null,
      });
      successCount++;
    } catch (issueErr) {
      failCount++;
      console.error(
        `[Job Error] Certificate issue failed for user ${userId}:`,
        issueErr.message
      );
    }
  }

  console.log(`[Job Finished] generateCertificate: ${successCount} succeeded, ${failCount} failed.`);
};

export default generateCertificateJob;