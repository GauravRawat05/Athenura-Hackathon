/**
 * certificate.pdf.service.js
 * Renders certificate PDFs from React-PDF declaration files (CertificateTemplate.jsx)
 * and streams or writes the final file to disk before it gets uploaded to Cloudinary.
 *
 * Uses @react-pdf/renderer React 18-compatible APIs (v3.x).
 */

import React from 'react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderToFile, renderToBuffer } from '@react-pdf/renderer';
import CertificateTemplate from '../../templates/certificates/CertificateTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_DIR = path.join(__dirname, '..', '..', 'temp', 'certificates');

/**
 * Defensive defaults so callers don't need to know every field.
 */
const DEFAULT_PROPS = {
  submissionTitle: 'N/A',
  certificateType: 'participation',
  rank: null,
  awardCategory: null,
  teamName: null,
  showBadge: true,
  logoAsset: null,
  qrDataUrl: null,
};

/**
 * Renders a certificate PDF to a temporary file on disk.
 * The caller is responsible for deleting the file after upload.
 *
 * @param {object} certificatePayload  — at minimum must contain userName, hackathonTitle
 * @param {object} [options]
 * @param {string} [options.fileName]  — explicit output file name
 * @returns {Promise<string>} — absolute path to the generated PDF file
 */
export async function renderCertificateToFile(certificatePayload, options = {}) {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const props = { ...DEFAULT_PROPS, ...certificatePayload };
  const safeName = options.fileName
    || `cert_${Date.now()}_${(props.userName || 'unknown').replace(/\s+/g, '_')}.pdf`;
  const outPath = path.join(TEMP_DIR, safeName);

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
    fs.unlinkSync(outPath);
  }
}

/**
 * Renders a certificate PDF straight into a Node.js Buffer (keeps it in memory).
 * This avoids the disk-round-trip for callers that already hold the file contents
 * for streaming or attachment purposes.
 *
 * @param {object} certificatePayload
 * @returns {Promise<Buffer>} — the raw PDF bytes
 */
export async function renderCertificateToBuffer(certificatePayload) {
  const props = { ...DEFAULT_PROPS, ...certificatePayload };
  return await renderToBuffer(React.createElement(CertificateTemplate, props));
}

/**
 * Cleans up the temporary directory for stale files created more than
 * `maxAgeHours` ago.
 * This is a safety-net; regular caller-side cleanup is still expected.
 *
 * @param {number} [maxAgeHours=2]
 * @returns {Promise<number>} — number of files removed
 */
export async function cleanStaleTempFiles(maxAgeHours = 2) {
  if (!fs.existsSync(TEMP_DIR)) return 0;

  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  const files = fs.readdirSync(TEMP_DIR);
  let removed = 0;

  for (const file of files) {
    const fp = path.join(TEMP_DIR, file);
    try {
      const { mtime } = fs.statSync(fp);
      if (now - mtime.getTime() > maxAgeMs) {
        fs.unlinkSync(fp);
        removed++;
      }
    } catch {
      // File already gone — skip
    }
  }

  return removed;
}
