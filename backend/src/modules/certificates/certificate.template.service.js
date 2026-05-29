/**
 * certificate.template.service.js
 * Builds certificate data payloads and merges participant/rank data into
 * the correct certificate template.
 */
import { CERTIFICATE_TYPES } from '../../utils/constants/certificateTypes.js';
import { generateQrDataUrl } from './qr.service.js';
import sharp from 'sharp';
import fs from 'fs/promises';

/**
 * Normalises and enriches the raw fields needed to render a certificate.
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

  const normalisedRank = rank !== null && rank !== undefined
    ? Math.max(1, Math.floor(Number(rank)))
    : null;

  const description = buildDescription({
    certificateType,
    teamName,
    submissionTitle,
  });

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
 * Generates the certificate PNG image using sharp and SVG overlay.
 */
export async function generateCertificateImage({
  participantName,
  hackathonName,
  certificateCode,
  templatePath,
  outputPath,
}) {
  const safeName = participantName
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");

  const safeHackathon = hackathonName
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");

  const safeCode = certificateCode
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");

  const svg = `
  <svg width="1440" height="1020">
      <!-- participant name -->
      <text
          x="720"
          y="455"
          text-anchor="middle"
          font-size="${participantName.length > 20 ? 60 : 78}"
          font-family="Georgia, serif"
          font-weight="bold"
          fill="white">
          ${safeName}
      </text>

      <!-- hackathon name -->
      <text
          x="720"
          y="620"
          text-anchor="middle"
          font-size="45"
          font-family="Georgia, serif"
          fill="#222">
          ${safeHackathon}
      </text>

      <!-- certificate code -->
      <text
          x="1150"
          y="920"
          font-size="22"
          font-family="Arial, sans-serif"
          fill="#555">
          ${safeCode}
      </text>
  </svg>
  `;

  await sharp(templatePath)
    .composite([
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(outputPath);

  return outputPath;
}

/**
 * Generates a random suffix for certificate codes.
 */
function randomSuffix(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Generates a unique certificate code in the format: CERT-YEAR-SEQUENCE-RANDOM
 */
export function generateCertificateCode(sequenceNumber) {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(6, "0");
  return `CERT-${year}-${padded}-${randomSuffix()}`;
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
