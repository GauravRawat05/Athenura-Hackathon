/**
 * certificate.verify.service.js
 * Implements public certificate verification by unique code and controls what
 * information can be shown publicly.
 */
import certificateRepository from './certificate.repository.js';

/**
 * Public-safe fields that may be returned to an unauthenticated caller so
 * that certificate forgery is detectable but no private PII is leaked.
 */
export const PUBLIC_FIELDS = [
  'certificateCode',
  'certificateType',
  'awardCategory',
  'rank',
  'generationStatus',
  'hackathonId',
  'isRevoked',
  'revokedAt',
  'issuedAt',
];

/**
 * Verifies a certificate by its unique public code and returns only the
 * fields that are safe to expose publicly.
 *
 * @param {string} certificateCode
 * @returns {Promise<object|null>}  — public-safe snapshot or null if not found
 */
export async function verifyCertificate(certificateCode) {
  if (!certificateCode) return null;

  // Find the raw document — do not project here because revokedAt and
  // generationStatus are also needed to build a meaningful response.
  const cert = await certificateRepository.findByCode(certificateCode);

  if (!cert) return null;

  return toPublicSnapshot(cert);
}

/**
 * Converts a raw Mongoose document into a stripped-down public snapshot object.
 *
 * @param {object} cert  — Mongoose certificate document
 * @returns {object}     — lean, public-safe object
 */
export function toPublicSnapshot(cert) {
  return {
    certificateCode: cert.certificateCode,
    certificateType: cert.certificateType,
    awardCategory: cert.awardCategory,
    rank: cert.rank,
    generationStatus: cert.generationStatus,
    isRevoked: cert.isRevoked,
    revokedAt: cert.revokedAt,
    issuedAt: cert.createdAt?.toISOString?.() || null,
    hackathonId: cert.hackathonId?.toString?.() || null,
  };
}

/**
 * Checks whether a certificate is still considered valid for public
 * verification purposes (not revoked and generation completed).
 *
 * @param {object} publicSnapshot — result from toPublicSnapshot
 * @returns {boolean}
 */
export function isCertificateValid(publicSnapshot) {
  if (!publicSnapshot) return false;
  if (publicSnapshot.isRevoked) return false;
  if (publicSnapshot.generationStatus !== 'COMPLETED') return false;
  return true;
}
