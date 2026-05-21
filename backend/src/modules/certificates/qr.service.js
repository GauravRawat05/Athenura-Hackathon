/**
 * qr.service.js
 * Generates QR codes that point to certificate verification pages or signed certificate routes.
 */
import QRCode from 'qrcode';
import envConfig from '../../config/envConfig.js';

/**
 * Generates a data-URL PNG QR code that, when scanned, points to the public
 * verification page for the given certificate code.
 *
 * @param {string}  certificateCode — the unique verification code of the certificate
 * @param {object}  [options]
 * @param {string}  [options.baseUrl]   — override the base URL of the verification page
 * @param {number}  [options.width=150] — pixel width of the QR image
 * @returns {Promise<string>} — base64 data URL (e.g. `data:image/png;base64,…`)
 */
export async function generateQrDataUrl(certificateCode, options = {}) {
  const { baseUrl, width = 150 } = options;

  if (!certificateCode) {
    throw new Error('certificateCode is required to generate a QR code');
  }

  const host = baseUrl || envConfig.clientUrl || 'http://localhost:5173';
  // Canonical public verification URL:  /certificates/verify/:certificateCode
  const verificationUrl = `${host.replace(/\/+$/, '')}/certificates/verify/${certificateCode}`;

  const dataUrl = await QRCode.toDataURL(verificationUrl, {
    width,
    margin: 2,
    color: {
      dark: '#2c3e50',
      light: '#ffffff',
    },
  });

  return dataUrl;
}

/**
 * Generates a PNG Buffer instead of a data URL — useful when the caller wants
 * to embed the QR code as a binary asset directly in a PDF stream.
 *
 * @param {string}  certificateCode
 * @param {object}  [options]
 * @param {string}  [options.baseUrl]
 * @param {number}  [options.width=150]
 * @returns {Promise<Buffer>} — raw PNG buffer
 */
export async function generateQrBuffer(certificateCode, options = {}) {
  const { baseUrl, width = 150 } = options;

  if (!certificateCode) {
    throw new Error('certificateCode is required to generate a QR code');
  }

  const host = baseUrl || envConfig.clientUrl || 'http://localhost:5173';
  const verificationUrl = `${host.replace(/\/+$/, '')}/certificates/verify/${certificateCode}`;

  return await QRCode.toBuffer(verificationUrl, {
    width,
    margin: 2,
    color: {
      dark: '#2c3e50',
      light: '#ffffff',
    },
  });
}
