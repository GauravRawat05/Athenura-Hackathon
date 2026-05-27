import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { certificateService } from "../../services/certificateService";
import { userService } from "../../services/userService";

// ── Scroll-reveal hook ──────────────────────────────────────────
function useIntersection(ref, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, delay = 0, dir = "up" }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const from =
    dir === "up"    ? "translateY(40px)" :
    dir === "left"  ? "translateX(-40px)" :
    dir === "right" ? "translateX(40px)" :
    dir === "scale" ? "scale(0.88)"      : "translateY(40px)";
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? (dir === "scale" ? "scale(1)" : "translate(0)") : from,
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────
const Icons = {
  Award: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  GradCap: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  QR: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="3" height="3"/>
      <line x1="17" y1="14" x2="21" y2="14"/>
      <line x1="21" y1="14" x2="21" y2="18"/>
      <line x1="17" y1="21" x2="21" y2="21"/>
    </svg>
  ),
  Hash: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="8 21 12 17 16 21"/>
      <line x1="12" y1="17" x2="12" y2="11"/>
      <path d="M7 4H4a2 2 0 0 0-2 2v2c0 2.21 1.79 4 4 4h.5"/>
      <path d="M17 4h3a2 2 0 0 1 2 2v2c0 2.21-1.79 4-4 4h-.5"/>
      <rect x="7" y="2" width="10" height="9" rx="2"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  XCircle: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  Spinner: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  Filter: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
};

// ── Mock Certificate Data (fallback) ───────────────────────────
const MOCK_CERTIFICATES = [
  {
    id: "CERT-2025-A7X9",
    hackathon: "Smart India Hackathon 2025",
    domain: "AI / ML",
    type: "Rank",
    rank: 2,
    issuedOn: "12 May 2025",
    downloadCount: 3,
    qrValue: "https://athenura.in/verify/CERT-2025-A7X9",
    prize: "₹50,000",
    color: { ribbon: "linear-gradient(90deg,#0096c7,#48cae4)", circle: "linear-gradient(135deg,#0096c7,#48cae4)", tag: "#0096c7", tagBg: "#e0f4ff", border: "#7dd3f0" },
  },
  {
    id: "CERT-2025-B3K2",
    hackathon: "HackWithInfy Spring Edition",
    domain: "Web Dev",
    type: "Rank",
    rank: 1,
    issuedOn: "08 Apr 2025",
    downloadCount: 7,
    qrValue: "https://athenura.in/verify/CERT-2025-B3K2",
    prize: "₹1,00,000",
    color: { ribbon: "linear-gradient(90deg,#03045e,#023e8a)", circle: "linear-gradient(135deg,#023e8a,#03045e)", tag: "#03045e", tagBg: "#eef0f8", border: "#03045e" },
  },
  {
    id: "CERT-2024-C9M1",
    hackathon: "CodeStorm 2024",
    domain: "Full Stack",
    type: "Rank",
    rank: 3,
    issuedOn: "20 Dec 2024",
    downloadCount: 5,
    qrValue: "https://athenura.in/verify/CERT-2024-C9M1",
    prize: "₹20,000",
    color: { ribbon: "linear-gradient(90deg,#0077b6,#0096c7)", circle: "linear-gradient(135deg,#0077b6,#0096c7)", tag: "#0077b6", tagBg: "#e8f4fd", border: "#90cdf4" },
  },
  {
    id: "CERT-2024-D5P7",
    hackathon: "HackFest 2024",
    domain: "IoT",
    type: "Participation",
    rank: null,
    issuedOn: "15 Oct 2024",
    downloadCount: 2,
    qrValue: "https://athenura.in/verify/CERT-2024-D5P7",
    prize: null,
    color: { ribbon: "linear-gradient(90deg,#4a5568,#718096)", circle: "linear-gradient(135deg,#4a5568,#718096)", tag: "#4a5568", tagBg: "#f3f4f6", border: "#d1d5db" },
  },
  {
    id: "CERT-2024-E2R4",
    hackathon: "BuildForBharat 2024",
    domain: "Blockchain",
    type: "Participation",
    rank: null,
    issuedOn: "30 Aug 2024",
    downloadCount: 1,
    qrValue: "https://athenura.in/verify/CERT-2024-E2R4",
    prize: null,
    color: { ribbon: "linear-gradient(90deg,#4a5568,#718096)", circle: "linear-gradient(135deg,#4a5568,#718096)", tag: "#4a5568", tagBg: "#f3f4f6", border: "#d1d5db" },
  },
];

// ── Verification DB (fallback) ──────────────────────────────────
const verifyDB = {
  "CERT-2025-A7X9": { name: "Arjun Mehta", hackathon: "Smart India Hackathon 2025", type: "Rank", rank: 2, issuedOn: "12 May 2025" },
  "CERT-2025-B3K2": { name: "Arjun Mehta", hackathon: "HackWithInfy Spring Edition", type: "Rank", rank: 1, issuedOn: "08 Apr 2025" },
  "CERT-2024-C9M1": { name: "Arjun Mehta", hackathon: "CodeStorm 2024", type: "Rank", rank: 3, issuedOn: "20 Dec 2024" },
  "CERT-2024-D5P7": { name: "Arjun Mehta", hackathon: "HackFest 2024", type: "Participation", rank: null, issuedOn: "15 Oct 2024" },
  "CERT-2024-E2R4": { name: "Arjun Mehta", hackathon: "BuildForBharat 2024", type: "Participation", rank: null, issuedOn: "30 Aug 2024" },
};

// ── Summary Stats will be computed from loaded certificates ────

// ── Animated Counter ───────────────────────────────────────────
function Counter({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const visible = useIntersection(ref, 0.2);
  useEffect(() => {
    if (!visible) return;
    const num = parseFloat(target);
    if (isNaN(num)) { setVal(target); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.round(num * ease));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return <span ref={ref}>{val}</span>;
}

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({ s, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={i * 0.08} dir="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#03045e" : "#fff",
          borderRadius: 16,
          padding: "10px 8px",
          border: `1.5px solid ${hovered ? "#90cdf4" : "#03045e"}`,
          boxShadow: hovered ? "0 10px 32px rgba(3,4,94,0.22)" : "0 2px 14px rgba(3,4,94,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 10,
          transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          cursor: "default",
          minWidth: 0,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: hovered ? "rgba(255,255,255,0.15)" : s.bg,
          color: hovered ? "#fff" : s.color,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.35s, color 0.35s",
          transform: hovered ? "rotate(-15deg) scale(1.15)" : "rotate(0deg) scale(1)",
        }}>
          <s.icon />
        </div>
        <div>
          <div style={{
            fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 20,
            color: hovered ? "#fff" : "#03045e", lineHeight: 1,
            transition: "color 0.35s",
          }}>
            <Counter target={s.value} />
          </div>
          <div style={{
            fontFamily: "Poppins,sans-serif", fontSize: 10.5,
            color: hovered ? "rgba(255,255,255,0.65)" : "#7b8ab8",
            marginTop: 3, transition: "color 0.35s",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {s.label}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ── QR Code (SVG pattern) ──────────────────────────────────────
function QRPattern({ value, size = 60 }) {
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = 7;
  const cell = size / cells;
  const grid = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const topLeft    = r < 3 && c < 3;
      const topRight   = r < 3 && c >= cells - 3;
      const bottomLeft = r >= cells - 3 && c < 3;
      const isCorner   = topLeft || topRight || bottomLeft;
      const isInner    = (r === 1 && c === 1) || (r === 1 && c === cells - 2) || (r === cells - 2 && c === 1);
      const filled     = isCorner ? !(isInner) : ((seed * (r + 1) * (c + 1) * 31) % 7 > 3);
      grid.push({ r, c, filled });
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff" rx="4"/>
      {grid.map(({ r, c, filled }, i) => filled ? (
        <rect key={i} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} fill="#03045e" rx="1"/>
      ) : null)}
    </svg>
  );
}

// ── Download Button ────────────────────────────────────────────
function DownloadButton({ color = "#03045e", onDownload }) {
  const [dlState, setDlState] = useState("idle");
  const handleClick = async () => {
    if (dlState !== "idle") return;
    if (!onDownload) {
      setDlState("loading");
      setTimeout(() => { setDlState("done"); setTimeout(() => setDlState("idle"), 2500); }, 2200);
      return;
    }
    try {
      setDlState("loading");
      await onDownload();
      setDlState("done");
      setTimeout(() => setDlState("idle"), 2500);
    } catch (err) {
      setDlState("error");
      setTimeout(() => setDlState("idle"), 2000);
    }
  };
  return (
    <button onClick={handleClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
      width: "100%", padding: "10px 0",
      background: dlState === "done" ? "#0096c7" : color,
      color: "#fff", border: "none", borderRadius: 10,
      fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13,
      cursor: dlState === "idle" ? "pointer" : "default",
      transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      boxShadow: `0 4px 14px ${color}44`,
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { if (dlState === "idle") e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
    >
      {dlState === "loading" ? (
        <>
          <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}><Icons.Spinner /></span>
          Preparing...
          <span style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: "rgba(255,255,255,0.5)", borderRadius: 99, animation: "btnProgress 2.2s linear forwards" }} />
        </>
      ) : dlState === "done" ? (
        <><Icons.Check /> Downloaded!</>
      ) : (
        <><Icons.Download /> Download Certificate</>
      )}
    </button>
  );
}

// ── Certificate Card ───────────────────────────────────────────
function CertCard({ cert, index }) {
  const [showQR, setShowQR] = useState(false);
  const [downloadCount, setDownloadCount] = useState(cert.downloadCount || 0);
  const isRank = cert.type === "Rank";
  const rankEmoji = cert.rank === 1 ? "🥇" : cert.rank === 2 ? "🥈" : cert.rank === 3 ? "🥉" : `#${cert.rank}`;

  const handleDownload = async () => {
    try {
      const res = await api.get(`/certificates/${cert.id}/download`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloadCount(c => c + 1);
    } catch (err) {
      
      throw err;
    }
  };

  return (
    <Reveal delay={index * 0.09} dir="up">
      <div style={{
        background: "#fff", borderRadius: 20,
        border: `1.5px solid ${cert.color.border}`,
        boxShadow: isRank ? "0 4px 24px rgba(3,4,94,0.12)" : "0 2px 14px rgba(3,4,94,0.07)",
        overflow: "hidden",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(3,4,94,0.16)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = isRank ? "0 4px 24px rgba(3,4,94,0.12)" : "0 2px 14px rgba(3,4,94,0.07)"; }}
      >
        {/* Ribbon */}
        <div style={{ background: cert.color.ribbon, height: 5 }} />

        {/* Header */}
        <div style={{ padding: "20px 22px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: cert.color.circle,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, color: "#fff",
            boxShadow: `0 4px 14px ${cert.color.tag}44`,
          }}>
            {isRank ? <Icons.Trophy /> : <Icons.GradCap />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 11, fontWeight: 800, fontFamily: "Nunito,sans-serif",
                padding: "2px 10px", borderRadius: 20,
                color: cert.color.tag, background: cert.color.tagBg,
                border: `1px solid ${cert.color.border}`,
              }}>{cert.type} Certificate</span>
              <span style={{ fontSize: 11, color: "#9aa3c2", fontFamily: "Poppins,sans-serif" }}>{cert.domain}</span>
            </div>
            <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 15, color: "#03045e", lineHeight: 1.3, marginBottom: 6 }}>
              {cert.hackathon}
            </div>
            {isRank && (
              <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 20, color: cert.color.tag }}>
                {rankEmoji} {cert.rank === 1 ? "1st Place" : cert.rank === 2 ? "2nd Place" : "3rd Place"}
              </div>
            )}
          </div>
        </div>

        {/* Prize badge */}
        {cert.prize && (
          <div style={{ padding: "0 22px 14px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12, fontFamily: "Nunito,sans-serif", fontWeight: 800,
              color: cert.color.tag, background: cert.color.tagBg,
              padding: "4px 12px", borderRadius: 20,
            }}>🏆 Prize Won: {cert.prize}</span>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "#eef0f8", margin: "0 22px" }} />

        {/* Meta row */}
        <div style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#7b8ab8", fontFamily: "Poppins,sans-serif" }}>
            <Icons.Calendar /> {cert.issuedOn}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#7b8ab8", fontFamily: "Poppins,sans-serif" }}>
            <Icons.Eye /> {downloadCount} downloads
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: "#9aa3c2", fontFamily: "Poppins,sans-serif", marginLeft: "auto" }}>
            <Icons.Hash /> {cert.id}
          </span>
        </div>

        {/* QR toggle */}
        <div style={{ padding: "0 22px 14px" }}>
          <button onClick={() => setShowQR(s => !s)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: showQR ? "#eef0f8" : "none",
            border: "1.5px solid #eef0f8", borderRadius: 8,
            padding: "6px 12px", cursor: "pointer",
            fontFamily: "Poppins,sans-serif", fontSize: 11.5, fontWeight: 600, color: "#7b8ab8",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#eef0f8"}
            onMouseLeave={e => e.currentTarget.style.background = showQR ? "#eef0f8" : "none"}
          >
            <Icons.QR /> {showQR ? "Hide QR Code" : "Show QR Code for Verification"}
          </button>
          <div style={{
            maxHeight: showQR ? 130 : 0, overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{ paddingTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ border: "2px solid #eef0f8", borderRadius: 10, padding: 6, background: "#fff", flexShrink: 0 }}>
                <QRPattern value={cert.id} size={64} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12, color: "#03045e", marginBottom: 4 }}>Scan to Verify</div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 10.5, color: "#7b8ab8", lineHeight: 1.5 }}>
                  Public verification — no login needed.<br />
                  <span style={{ color: cert.color.tag, wordBreak: "break-all" }}>{cert.qrValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download */}
        <div style={{ padding: "0 22px 20px" }}>
          <DownloadButton color={cert.color.tag} onDownload={handleDownload} />
        </div>
      </div>
    </Reveal>
  );
}

// ── Verify Section ─────────────────────────────────────────────
function VerifySection() {
  const [query, setQuery]     = useState("");
  const [result, setResult]   = useState(null);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const code = query.trim().toUpperCase();
      const res = await api.get(`/public/certificates/verify/${code}`);
      const payload = res.data && (res.data.data || res.data);
      if (payload) { setData(payload); setResult("found"); }
      else { setData(null); setResult("notfound"); }
    } catch (err) {
      if (err.response?.status === 404) {
        setData(null); setResult("notfound");
      } else {
        // fallback to local DB if backend isn't available
        const found = verifyDB[query.trim().toUpperCase()];
        if (found) { setData(found); setResult("found"); }
        else { setData(null); setResult("notfound"); }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleVerify(); };

  return (
    <Reveal delay={0.05} dir="up">
      <div style={{
        background: "#fff", borderRadius: 20,
        border: "1.5px solid #03045e",
        boxShadow: "0 4px 24px rgba(3,4,94,0.09)",
        overflow: "hidden", marginBottom: 32,
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(120deg,#03045e,#0077b6)",
          padding: "20px 28px", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            flexShrink: 0,
          }}>
            <Icons.Shield />
          </div>
          <div>
            <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 16, color: "#fff" }}>
              Certificate Verification Portal
            </div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>
              Verify any certificate using its unique ID — no login required
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: "#9aa3c2", display: "flex", alignItems: "center",
              }}>
                <Icons.Hash />
              </span>
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setResult(null); }}
                onKeyDown={handleKey}
                placeholder="Enter Certificate ID e.g. CERT-2025-A7X9"
                style={{
                  width: "100%", padding: "12px 14px 12px 38px",
                  border: "1.5px solid #dde2f0", borderRadius: 10,
                  fontFamily: "Poppins,sans-serif", fontSize: 13, color: "#03045e",
                  outline: "none", background: "#fafbff",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#0077b6"}
                onBlur={e => e.target.style.borderColor = "#dde2f0"}
              />
            </div>
            <button onClick={handleVerify} style={{
              padding: "12px 20px", borderRadius: 10,
              background: "#03045e", color: "#fff", border: "none",
              fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(3,4,94,0.22)",
              transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
              flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0077b6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#03045e"; e.currentTarget.style.transform = ""; }}
            >
              {loading
                ? <><span style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}><Icons.Spinner /></span> Verifying...</>
                : <><Icons.Search /> Verify</>
              }
            </button>
          </div>

          {/* Hints */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 11, color: "#9aa3c2" }}>Try:</span>
            {["CERT-2025-A7X9", "CERT-2025-B3K2", "CERT-2024-C9M1"].map(id => (
              <button key={id} onClick={() => { setQuery(id); setResult(null); }} style={{
                fontFamily: "Poppins,sans-serif", fontSize: 11, color: "#0077b6",
                background: "#e8f4fd", border: "none", borderRadius: 6,
                padding: "2px 8px", cursor: "pointer",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#cce4f7"}
                onMouseLeave={e => e.currentTarget.style.background = "#e8f4fd"}
              >{id}</button>
            ))}
          </div>

          {/* Result found */}
          {result === "found" && data && (
            <div style={{
              marginTop: 20, borderRadius: 14, overflow: "hidden",
              border: "1.5px solid #7dd3f0",
              animation: "fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}>
              <div style={{ background: "linear-gradient(120deg,#e0f4ff,#caf0f8)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#0096c7" }}><Icons.CheckCircle /></span>
                <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 14, color: "#0077b6" }}>
                  Certificate Verified Successfully ✓
                </span>
              </div>
              <div style={{ padding: "16px 20px", background: "#fff" }}>
                {[
                  ["Participant", data.name],
                  ["Hackathon", data.hackathon],
                  ["Certificate Type", data.type],
                  ...(data.rank ? [["Rank Achieved", `${data.rank === 1 ? "🥇 1st" : data.rank === 2 ? "🥈 2nd" : "🥉 3rd"} Place`]] : []),
                  ["Issue Date", data.issuedOn],
                ].map(([label, value], i, arr) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid #eef0f8" : "none",
                    gap: 8,
                  }}>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "#7b8ab8" }}>{label}</span>
                    <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13, color: "#03045e", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result not found */}
          {result === "notfound" && (
            <div style={{
              marginTop: 20, borderRadius: 14, overflow: "hidden",
              border: "1.5px solid #fed7d7",
              animation: "fadeSlideUp 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}>
              <div style={{ background: "linear-gradient(120deg,#fff5f5,#ffe8e8)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#e53e3e" }}><Icons.XCircle /></span>
                <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 14, color: "#c53030" }}>
                  Certificate Not Found
                </span>
              </div>
              <div style={{ padding: "12px 20px", background: "#fff" }}>
                <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 12.5, color: "#7b8ab8", margin: 0 }}>
                  No certificate found with ID <strong style={{ color: "#03045e" }}>{query}</strong>. Please check the ID and try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function Certificates() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Rank", "Participation"];

  const [certs, setCerts] = useState(null);
  const [loadingCerts, setLoadingCerts] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await userService.getUserCertificates();
        const data = res.data && (res.data.data || res.data);
        if (mounted) setCerts(Array.isArray(data) ? data : []);
      } catch (err) {
        // backend may not be implemented yet — fallback to mock
        if (mounted) setCerts(MOCK_CERTIFICATES);
      } finally {
        if (mounted) setLoadingCerts(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const available = certs || MOCK_CERTIFICATES;
  const summaryStats = [
    { label: "Total Certificates", value: available.length, icon: Icons.Award, color: "#0077b6", bg: "#e8f4fd" },
    { label: "Rank Certificates", value: available.filter(c => c.type === 'Rank').length, icon: Icons.Trophy, color: "#03045e", bg: "#eef0f8" },
    { label: "Participation", value: available.filter(c => c.type === 'Participation').length, icon: Icons.GradCap, color: "#0096c7", bg: "#e0f4ff" },
    { label: "Total Downloads", value: available.reduce((s, c) => s + (c.downloadCount || 0), 0), icon: Icons.Download, color: "#4b4ddc", bg: "#eeeefc" },
  ];

  const filtered = filter === "All"
    ? available
    : available.filter(c => c.type === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7ff", fontFamily: "Poppins,sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes btnProgress { from{width:0%} to{width:100%} }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Stats grid: 4 col desktop, 2x2 tablet, 2x2 mobile ── */
        .cert-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 700px) {
          .cert-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* ── Cards: 2 col desktop, 1 col mobile ── */
        .cert-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }
        @media (max-width: 640px) {
          .cert-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* ── Header centre on mobile ── */
        .cert-header-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        @media (max-width: 768px) {
          .cert-header-wrap {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .cert-header-wrap h1,
          .cert-header-wrap p {
            text-align: center !important;
          }
        }

        /* ── No horizontal scroll ── */
        * { box-sizing: border-box; }
        body { overflow-x: hidden; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: "#fff",
        padding: "32px 20px 52px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid #eef0f8",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle,#03045e 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        <Reveal>
          {/* Icon removed — only text */}
          <div className="cert-header-wrap">
            <div>
              <h1 style={{
                fontFamily: "Nunito,sans-serif", fontWeight: 900,
                fontSize: "clamp(22px, 5vw, 28px)", color: "#03045e", margin: 0,
              }}>
                My Certificates
              </h1>
              <p style={{
                color: "#5a7a9a", fontFamily: "Poppins,sans-serif",
                fontSize: 13.5, margin: "4px 0 0",
              }}>
                Download, verify, and share your hackathon certificates.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Content ── */}
      <div style={{
        maxWidth: "min(1040px, 100%)",
        margin: "-28px auto 0",
        padding: "0 16px",
      }}>

        {/* ── Summary Stats — always 2×2 on mobile, 4 on desktop ── */}
        <div className="cert-stats-grid" style={{ marginBottom: 28 }}>
          {summaryStats.map((s, i) => <StatCard key={i} s={s} i={i} />)}
        </div>

        {/* ── Verify Section ── */}
        <VerifySection />

        {/* ── Filter Bar ── */}
        <Reveal delay={0.05}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#7b8ab8", fontFamily: "Poppins,sans-serif", marginRight: 4 }}>
              <Icons.Filter /> Filter:
            </span>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 18px", borderRadius: 20,
                border: `1.5px solid ${filter === f ? "#03045e" : "#dde2f0"}`,
                background: filter === f ? "#03045e" : "#fff",
                color: filter === f ? "#fff" : "#7b8ab8",
                fontFamily: "Nunito,sans-serif", fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { if (filter !== f) e.currentTarget.style.borderColor = "#0077b6"; }}
                onMouseLeave={e => { if (filter !== f) e.currentTarget.style.borderColor = "#dde2f0"; }}
              >{f}</button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9aa3c2", fontFamily: "Poppins,sans-serif" }}>
              {filtered.length} certificate{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </Reveal>

        {/* ── Certificate Cards ── */}
        {filtered.length === 0 ? (
          <Reveal>
            <div style={{ background: "#fff", borderRadius: 16, padding: "52px 24px", textAlign: "center", border: "1.5px solid #eef0f8" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🎓</div>
              <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, color: "#03045e", fontSize: 16 }}>No {filter} Certificates Yet</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "#7b8ab8", marginTop: 6 }}>
                Participate in more hackathons to earn certificates.
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="cert-cards-grid">
            {filtered.map((cert, i) => <CertCard key={cert.id} cert={cert} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}