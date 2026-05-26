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
import Team from '../modules/teams/team.model.js';
import { CERTIFICATE_TYPES } from '../utils/constants/certificateTypes.js';

/**
 * Batch certificate generation adapter.
 *
 * Iterates over `resultsData` (array of result summary objects) and calls
 * `certificateService.issueCertificate()` for each entry. 
 * Expansion: If it's a team result, it fetches all team members and issues 
 * a certificate to each.
 *
 * @param {string}        hackathonId   — MongoDB hackathon id
 * @param {Array<object>} resultsData   — array of result objects, each must have:
 *                                        { userId, teamId, rank, awardCategory, submissionId }
 * @returns {Promise<void>}
 */
const generateCertificateJob = async (hackathonId, resultsData = []) => {
  console.log(`[Job] generateCertificate started for hackathon ${hackathonId} — ${resultsData.length} result entries`);

  let successCount = 0;
  let failCount = 0;

  for (const result of resultsData) {
    const { userId, teamId, rank, awardCategory, submissionId } = result;

    // Rank-based logic: 1-3 are Winners, others are Participants
    const certificateType = (rank > 0 && rank <= 3) 
      ? CERTIFICATE_TYPES.WINNER 
      : CERTIFICATE_TYPES.PARTICIPATION;

    // Identify recipients: single user or all team members
    let recipientIds = [userId];
    let teamName = null;

    if (teamId) {
      try {
        const team = await Team.findById(teamId).populate('members.userId');
        if (team) {
          teamName = team.teamName;
          // Filter only accepted members
          recipientIds = team.members
            .filter(m => m.invitationStatus === 'accepted')
            .map(m => m.userId._id || m.userId);
        }
      } catch (teamErr) {
        console.error(`[Job Error] Failed to fetch team members for team ${teamId}:`, teamErr.message);
      }
    }

    // Issue certificates to all recipients
    for (const recipientId of recipientIds) {
      try {
        await certificateService.issueCertificate({
          userId:              recipientId,
          hackathonId:         hackathonId,
          certificateType:     certificateType,
          awardCategory:       awardCategory || null,
          rank:                rank || null,
          submissionId:        submissionId || null,
          teamName:            teamName
        });
        successCount++;
      } catch (issueErr) {
        failCount++;
        console.error(
          `[Job Error] Certificate issue failed for user ${recipientId}:`,
          issueErr.message
        );
      }
    }
  }

  console.log(`[Job Finished] generateCertificate: ${successCount} individual certificates issued, ${failCount} failed.`);
};

export default generateCertificateJob;