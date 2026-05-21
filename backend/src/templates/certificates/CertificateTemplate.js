/**
 * CertificateTemplate.js — React-PDF v4 certificate document.
 *
 * Uses only React.createElement so it is valid Node.js with no JSX/build step.
 *
 * Usage:
 *   import CertificateTemplate from '…/CertificateTemplate.js'
 *   import { renderToFile, renderToBuffer } from '@react-pdf/renderer'
 *
 *   await renderToFile(
 *     React.createElement(CertificateTemplate, { userName: '…', hackathonTitle: '…' }),
 *     '/tmp/out.pdf'
 *   )
 */

import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';

// ── Style library ──────────────────────────────────────────────────────────────

/**
 * Flat style sheet. Section-grouped here for readability.
 * All numeric dimensions are raw React-PDF units (1 pt).
 */
const S = {
  // ── Page & container ────────────────────────────────────────────────────
  outerBorder: {
    width: '100%', height: '100%',
    border: '18 solid #2c3e50',
    boxSizing: 'border-box',
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center',
    padding: '18 18 18 18',
  },
  innerBorder: {
    position: 'absolute', width: '91%', height: '91%',
    border: '2 solid #34495e',
    top: '4.5%', left: '4.5%',
    zIndex: 0,
  },
  watermark: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%) rotate(-20deg)',
    fontSize: 110, fontFamily: 'Helvetica', color: '#7f8c8d',
    opacity: 0.07, whiteSpace: 'nowrap', zIndex: 0,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    marginTop: 20, marginBottom: 0, flex: 0, zIndex: 1,
  },
  logo: { width: 90, height: 90, marginBottom: 14, objectFit: 'contain' },
  title: {
    fontSize: 50, fontFamily: 'Helvetica-Bold', color: '#2c3e50',
    textTransform: 'uppercase', letterSpacing: 5, margin: 0, marginBottom: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17, fontFamily: 'Helvetica-Oblique', color: '#7f8c8d',
    margin: 0, marginBottom: 22, textAlign: 'center',
  },

  // ── Body column ──────────────────────────────────────────────────────────
  bodyCol: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', zIndex: 1,
  },
  presentText: {
    fontSize: 13, fontFamily: 'Helvetica', color: '#555',
    letterSpacing: 4, marginBottom: '8',
    textAlign: 'center', textTransform: 'uppercase',
  },
  recipientName: {
    fontSize: 38, fontFamily: 'Helvetica-Bold', color: '#e67e22',
    textAlign: 'center', padding: '0 16 10 16',
    borderBottom: '1.5 solid #bdc3c7', marginBottom: 18,
  },
  description: {
    fontSize: 14, fontFamily: 'Helvetica', color: '#333',
    textAlign: 'center', lineHeight: 1.4, maxWidth: 740, marginBottom: 18,
  },

  badge: { marginBottom: 6 },
  badgeMain: {
    fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#27ae60',
    textTransform: 'uppercase', textAlign: 'center', marginBottom: 2,
  },
  badgeSub: {
    fontSize: 14, fontFamily: 'Helvetica', color: '#7f8c8d',
    textAlign: 'center', fontWeight: 'bold', letterSpacing: 2,
  },

  qrWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 },
  qrImage: { width: 90, height: 90, marginBottom: 3 },
  qrLabel: { fontSize: 8, fontFamily: 'Helvetica', color: '#999', textAlign: 'center' },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
    width: '65%', marginTop: 14, marginBottom: 8,
    flex: 0, alignItems: 'center', zIndex: 1,
  },
  sigBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '44%' },
  sigLine: { width: '100%', borderTop: '0.8 solid #34495e', marginTop: 5, marginBottom: 3 },
  sigName: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#2c3e50', textAlign: 'center' },
  sigRole: { fontSize: 10, fontFamily: 'Helvetica', color: '#7f8c8d', textAlign: 'center' },
};

// ── Pure helpers ───────────────────────────────────────────────────────────────

function describe({ certificateType, teamName, submissionTitle }) {
  if (certificateType === 'judge') {
    return `In recognition of dedicated service as a judge and for contributing valuable insights during the evaluation of the hackathon project "${submissionTitle || 'N/A'}"${teamName ? ` by team ${teamName}` : ''}.`;
  }
  const conj = teamName ? ' submitted by team ' : '';
  return `For outstanding performance and dedication shown in the project "${submissionTitle || 'N/A'}"${conj}${teamName || ''}.`;
}

function badgeLines({ certificateType, awardCategory, rank }) {
  let main = '', sub = '';
  if (certificateType === 'winner') {
    const labels = ['', 'Winner', 'Runner-Up', 'Second Runner-Up'];
    main = rank <= 3 ? labels[rank] : (awardCategory || 'Winner');
    if (rank) sub = `Rank #${rank}`;
  } else if (certificateType === 'finalist') {
    main = 'Finalist'; sub = awardCategory || '';
  } else if (certificateType === 'judge') {
    main = 'Judge'; sub = awardCategory || 'Hackathon Judge';
  } else if (awardCategory) {
    main = awardCategory;
  }
  return { badgeMain: main || null, badgeSub: sub || null };
}

// ── Component primitives ───────────────────────────────────────────────────────

const T  = (style, children) => React.createElement(Text,   { style }, children);
const V  = (style, ...children) => React.createElement(View,  { style }, ...children);
const Im = (style, src)      => React.createElement(Image, { style, src });

// ── Page sub-components ────────────────────────────────────────────────────────

function Header({ logoAsset }) {
  const el = [
    T(S.title,      'CERTIFICATE'),
    T(S.subtitle,   'of Achievement'),
  ];
  return V(S.header, ...(logoAsset
    ? [Im(S.logo, logoAsset), ...el]
    : el
  ));
}

function Body({ userName, teamName, submissionTitle, certificateType, awardCategory, rank, qrDataUrl }) {
  const desc  = describe({ certificateType, teamName, submissionTitle });
  const { badgeMain, badgeSub } = badgeLines({ certificateType, awardCategory, rank });

  // Index children so we can conditionally insert the badge block later
  const children = [
    T(S.presentText,   'This certificate is proudly presented to'),
    T(S.recipientName, userName),
    T(S.description,   desc),
  ];

  // ── Optional badge ──────────────────────────────────────────────────────
  if (badgeMain || badgeSub) {
    const badgeChildren = [];
    if (badgeMain) badgeChildren.push(T(S.badgeMain, badgeMain));
    if (badgeSub)  badgeChildren.push(T(S.badgeSub, badgeSub));
    children.push(V(S.badge, ...badgeChildren));
  }

  // ── QR code ─────────────────────────────────────────────────────────────
  if (qrDataUrl) {
    children.push(
      V(S.qrWrapper,
        Im(S.qrImage, qrDataUrl),
        T(S.qrLabel, 'Scan to verify'),
      )
    );
  }

  return V(S.bodyCol, ...children);
}

function Footer() {
  const dateStr = new Date().toLocaleDateString('en-GB');
  return V(S.footer,
    V(S.sigBlock,
      T(S.sigName, 'Athenura'),
      V(S.sigLine),
      T(S.sigRole, 'Organising Committee'),
    ),
    V(S.sigBlock,
      T(S.sigName, dateStr),
      V(S.sigLine),
      T(S.sigRole, 'Date of Issue'),
    ),
  );
}

// ── Named component ────────────────────────────────────────────────────────────

/**
 * React-PDF Document component for a hackathon certificate.
 *
 * Accepts these props:
 *   userName        (string,  required)
 *   hackathonTitle  (string,  required)
 *   teamName        (string | null)
 *   submissionTitle (string,  default 'N/A')
 *   certificateType(string,   default 'participation')
 *   awardCategory   (string | null)
 *   rank            (number | null)
 *   qrDataUrl       (string   data URL from qr.service)
 *   logoAsset       (string   data URL or null)
 *   showBadge       (boolean, default true)
 *
 * @param {CertificateTemplateProps} props
 * @returns {React.ReactElement}
 */
function CertificateTemplate(props) {
  const { userName, hackathonTitle, teamName, submissionTitle = 'N/A', certificateType = 'participation', awardCategory, rank, qrDataUrl, logoAsset, showBadge = true } = props;

  const inner = V(S.outerBorder,
    T(S.watermark, 'ATHENURA'),   // z-index 0 — decorative
    V(S.innerBorder),              // z-index 0 — decorative inner border
    Header({ logoAsset }),
    Body({ userName, teamName, submissionTitle, certificateType, awardCategory, rank, qrDataUrl }),
    Footer(),
  );

  return React.createElement(
    Document,
    {
      title:     `Certificate — ${userName} — ${hackathonTitle}`,
      author:    'Hackathon Platform',
      subject:   'Certificate of Achievement',
      keywords:  ['hackathon', 'certificate', 'Athenura'],
    },
    React.createElement(Page, { size: 'A4', orientation: 'landscape' }, inner),
  );
}

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
