/**
 * certificate.template.service.js
 * Builds certificate data payloads and merges participant/rank data into
 * the correct certificate template.
 */
import { CERTIFICATE_TYPES } from '../../utils/constants/certificateTypes.js';
import { generateQrDataUrl } from './qr.service.js';

/**
 * Normalises and enriches the raw fields needed to render a certificate.
 * This is the single place where the shape of the certificate template payload
 * is defined — every caller (service layer, admin routes, jobs) goes through here.
 *
 * @param {object} params
 * @param {string} params.userName         — full name of the certificate recipient
 * @param {string} params.hackathonTitle   — title of the hackathon event
 * @param {string} params.teamName         — team name (may be null for solo participants)
 * @param {string} params.submissionTitle  — project / submission title
 * @param {string} [params.certificateType=CERTIFICATE_TYPES.PARTICIPATION]
 * @param {string} [params.awardCategory]  — human-readable award name for winners/finalists
 * @param {number} [params.rank=null]      — numeric rank (1-based), null for non-rank certs
 * @param {import('./certificate.constants.js').GENERATION_STATUS} [params.status]
 * @returns {object} fully-formed template data object
 */
export function buildCertificatePayload({
  userName,
  hackathonTitle,
  teamName,
  submissionTitle,
  certificateType = CERTIFICATE_TYPES.PARTICIPATION,
  awardCategory = null,
  rank = null,
  status,
}) {
  if (!userName) throw new Error('userName is required to build a certificate payload');
  if (!hackathonTitle) throw new Error('hackathonTitle is required to build a certificate payload');

  // Normalise rank: must be a positive integer or null
  const normalisedRank = rank !== null && rank !== undefined
    ? Math.max(1, Math.floor(Number(rank)))
    : null;

  // Build a human-readable "presented to" description based on the certificate type
  const description = buildDescription({
    certificateType,
    teamName,
    submissionTitle,
  });

  // Build the award / rank badge text
  const badgeText = buildBadgeText({ certificateType, awardCategory, rank: normalisedRank });

  return {
    userName,
    hackathonTitle,
    teamName: teamName || null,
    submissionTitle: submissionTitle || 'N/A',
    certificateType,
    awardCategory: awardCategory || null,
    rank: normalisedRank,
    description,
    badgeText,
    status,
    issuedAt: new Date().toISOString(),
  };
}

/**
 * Returns the human-readable description block that goes on the certificate.
 *
 * @param {object} opts
 * @returns {string}
 */
function buildDescription({ certificateType, teamName, submissionTitle }) {
  const baseSnippet = certificateType === CERTIFICATE_TYPES.JUDGE
    ? 'For serving as a judge and contributing valuable insights'
    : 'For outstanding performance and dedication shown';

  return `${baseSnippet} in the hackathon project "${submissionTitle || 'N/A'}"${
    teamName ? ` by team ${teamName}` : ''
  }.`;
}

/**
 * Returns the text shown in the rank/award badge area.
 * Returns null when there is nothing to display in that slot.
 *
 * @param {object} opts
 * @returns {string | null}
 */
function buildBadgeText({ certificateType, awardCategory, rank }) {
  if (certificateType === CERTIFICATE_TYPES.PARTICIPATION && !awardCategory) {
    return null;           // plain participation — no badge
  }

  if (certificateType === CERTIFICATE_TYPES.WINNER) {
    if (rank === 1) return 'Winner';
    if (rank === 2) return 'Runner-Up';
    if (rank === 3) return 'Second Runner-Up';
    return `${awardCategory || 'Award'} — Rank #${rank}`;
  }

  if (certificateType === CERTIFICATE_TYPES.FINALIST) {
    return `Finalist — ${awardCategory || 'Finalist'}`;
  }

  if (certificateType === CERTIFICATE_TYPES.JUDGE) {
    return `Judge — ${awardCategory || 'Hackathon Judge'}`;
  }

  // Fallback
  return awardCategory || certificateType;
}

/**
 * Generates a signed image data-URL for the QR code embedded in the certificate PDF.
 * The QR code points back to the public verification endpoint for this certificate.
 *
 * @param {object}       certDoc     — the Certificate Mongoose document (has .certificateCode)
 * @param {object}       [pdfOptions]
 * @param {string}       [pdfOptions.baseUrl]
 * @param {Buffer|string} [pdfOptions.logoAsset] — optional logo image to distinguish certs
 * @returns {Promise<string>}  base64 PNG data URL suitable for @react-pdf Image src
 */
export async function buildQrCodeImage(certDoc, pdfOptions = {}) {
  if (!certDoc?.certificateCode) {
    throw new Error('certificateCode is required to generate a QR code image');
  }

  return await generateQrDataUrl(certDoc.certificateCode, {
    baseUrl: pdfOptions.baseUrl,
    width: 150,
  });
}
