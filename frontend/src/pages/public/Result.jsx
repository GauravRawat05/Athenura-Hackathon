import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const NAVY = "#03045E";
const NAVY_TEXT = "rgba(3,4,94,0.62)";
const NAVY_MID = "rgba(3,4,94,0.10)";
const ACCENT = "#2962FF";
const OFF = "#f5f6ff";
const GOLD = "#f59e0b";
const SILVER = "#94a3b8";
const BRONZE = "#cd7c3f";

/* ─────────────────────────────────────────
   INTERSECTION OBSERVER FADE
───────────────────────────────────────── */
function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function Fade({ children, delay = 0, y = 24, style = {}, className = "" }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s,
                   transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   SVG ILLUSTRATIONS
───────────────────────────────────────── */
// Hero floating decorative SVG — trophy with orbiting elements
const HeroIllustration = () => (
  <svg viewBox="0 0 420 420" width="420" height="420" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.92 }}>
    <defs>
      <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2962FF" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#2962FF" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="trophyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="softShadow">
        <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#f59e0b" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Outer glow rings */}
    <circle cx="210" cy="210" r="180" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
    <circle cx="210" cy="210" r="140" stroke="rgba(245,158,11,0.12)" strokeWidth="1" strokeDasharray="8 6" />
    <circle cx="210" cy="210" r="100" fill="url(#glow1)" />

    {/* Orbiting dots */}
    <circle cx="210" cy="40" r="5" fill="#f59e0b" opacity="0.7" />
    <circle cx="380" cy="210" r="4" fill="#2962FF" opacity="0.6" />
    <circle cx="210" cy="380" r="5" fill="#f59e0b" opacity="0.5" />
    <circle cx="40" cy="210" r="4" fill="#2962FF" opacity="0.6" />
    <circle cx="335" cy="85" r="3" fill="#fff" opacity="0.5" />
    <circle cx="85" cy="335" r="3" fill="#fff" opacity="0.4" />
    <circle cx="335" cy="335" r="3" fill="#f59e0b" opacity="0.4" />
    <circle cx="85" cy="85" r="3" fill="#2962FF" opacity="0.4" />

    {/* Star burst lines */}
    {[0,45,90,135,180,225,270,315].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      const x1 = 210 + 108 * Math.cos(rad);
      const y1 = 210 + 108 * Math.sin(rad);
      const x2 = 210 + 132 * Math.cos(rad);
      const y2 = 210 + 132 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />;
    })}

    {/* Trophy base */}
    <g filter="url(#softShadow)">
      {/* Cup body */}
      <path d="M155 130 H265 V210 Q265 258 210 270 Q155 258 155 210 Z"
        fill="url(#trophyGrad)" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Handles */}
      <path d="M155 150 H128 Q112 150 112 170 V190 Q112 218 140 218 H155"
        stroke="#fde68a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M265 150 H292 Q308 150 308 170 V190 Q308 218 280 218 H265"
        stroke="#fde68a" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Stem */}
      <rect x="198" y="270" width="24" height="42" rx="4" fill="#f59e0b" />
      {/* Base */}
      <rect x="170" y="308" width="80" height="16" rx="6" fill="#fde68a" />
      <rect x="180" y="320" width="60" height="10" rx="4" fill="#f59e0b" opacity="0.6" />

      {/* Star on cup */}
      <path d="M210 160 L215 174 H230 L218 183 L223 197 L210 188 L197 197 L202 183 L190 174 H205 Z"
        fill="#fff" opacity="0.9" />

      {/* Shine lines */}
      <path d="M175 155 Q182 148 190 153" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M178 165 Q183 160 188 163" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </g>

    {/* Floating rank badges */}
    {/* Gold #1 */}
    <g transform="translate(62,150)">
      <circle cx="26" cy="26" r="26" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="26" y="31" textAnchor="middle" fontSize="18" fontWeight="800" fill="#f59e0b" fontFamily="'Poppins',sans-serif">1</text>
    </g>
    {/* Silver #2 */}
    <g transform="translate(308,100)">
      <circle cx="22" cy="22" r="22" fill="#94a3b8" opacity="0.12" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="22" y="27" textAnchor="middle" fontSize="16" fontWeight="800" fill="#94a3b8" fontFamily="'Poppins',sans-serif">2</text>
    </g>
    {/* Bronze #3 */}
    <g transform="translate(315,290)">
      <circle cx="20" cy="20" r="20" fill="#cd7c3f" opacity="0.12" stroke="#cd7c3f" strokeWidth="1.5" />
      <text x="20" y="25" textAnchor="middle" fontSize="14" fontWeight="800" fill="#cd7c3f" fontFamily="'Poppins',sans-serif">3</text>
    </g>

    {/* Sparkles */}
    <path d="M340 150 L343 157 L350 160 L343 163 L340 170 L337 163 L330 160 L337 157 Z"
      fill="#f59e0b" opacity="0.7" />
    <path d="M72 260 L74 265 L79 267 L74 269 L72 274 L70 269 L65 267 L70 265 Z"
      fill="#2962FF" opacity="0.6" />
    <path d="M370 300 L372 304 L376 306 L372 308 L370 312 L368 308 L364 306 L368 304 Z"
      fill="#fff" opacity="0.4" />
  </svg>
);

// CTA Section illustration — rocket/launch concept
const CTAIllustration = () => (
  <svg viewBox="0 0 380 340" width="380" height="340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rocketGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="60%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Grid dots background */}
    {[...Array(8)].map((_, row) =>
      [...Array(10)].map((_, col) => (
        <circle key={`${row}-${col}`}
          cx={20 + col * 38} cy={20 + row * 38} r="1.5"
          fill="rgba(255,255,255,0.08)" />
      ))
    )}

    {/* Orbit circles */}
    <ellipse cx="190" cy="180" rx="150" ry="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    <ellipse cx="190" cy="180" rx="110" ry="36" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6 4" />

    {/* Trophy at center bottom */}
    <g transform="translate(158,200) scale(0.8)">
      <path d="M10 0 H70 V46 Q70 70 40 76 Q10 70 10 46 Z"
        fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.5" />
      <path d="M10 8 H-6 Q-16 8 -16 22 V32 Q-16 48 2 48 H10"
        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M70 8 H86 Q96 8 96 22 V32 Q96 48 78 48 H70"
        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M40 35 L43 43 H50 L44.5 47 L47 55 L40 51 L33 55 L35.5 47 L30 43 H37 Z"
        fill="#f59e0b" opacity="0.9" />
    </g>

    {/* Rocket */}
    <g transform="translate(165,60) rotate(0)">
      {/* Body */}
      <path d="M25 80 Q10 80 6 65 L0 20 Q0 0 25 0 Q50 0 50 20 L44 65 Q40 80 25 80Z"
        fill="url(#rocketGrad)" />
      {/* Window */}
      <circle cx="25" cy="30" r="9" fill="rgba(41,98,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <circle cx="25" cy="30" r="5" fill="rgba(41,98,255,0.5)" />
      {/* Wings */}
      <path d="M6 60 L-12 82 L6 72 Z" fill="rgba(255,255,255,0.35)" />
      <path d="M44 60 L62 82 L44 72 Z" fill="rgba(255,255,255,0.35)" />
      {/* Flame */}
      <path d="M12 80 Q18 105 25 120 Q32 105 38 80Z" fill="url(#flameGrad)" />
      <path d="M18 80 Q22 98 25 108 Q28 98 32 80Z" fill="#fde68a" opacity="0.7" />
    </g>

    {/* Dotted flight path */}
    <path d="M190 110 Q230 80 260 60" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="5 4" />

    {/* Small floating elements */}
    <circle cx="290" cy="100" r="8" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1" />
    <text x="290" y="105" textAnchor="middle" fontSize="9" fill="#f59e0b" fontFamily="'Poppins',sans-serif" fontWeight="700">+</text>

    <circle cx="80" cy="130" r="6" fill="rgba(41,98,255,0.2)" stroke="#2962FF" strokeWidth="1" />
    <circle cx="320" cy="200" r="5" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1" />

    {/* Star sparkles */}
    <path d="M310 80 L312 86 L318 88 L312 90 L310 96 L308 90 L302 88 L308 86 Z"
      fill="#f59e0b" opacity="0.6" />
    <path d="M56 80 L57.5 84 L62 85.5 L57.5 87 L56 91 L54.5 87 L50 85.5 L54.5 84 Z"
      fill="#fff" opacity="0.3" />

    {/* Code brackets decoration */}
    <text x="30" y="280" fontSize="32" fill="rgba(255,255,255,0.05)" fontFamily="monospace">&lt;/&gt;</text>
    <text x="290" y="300" fontSize="24" fill="rgba(255,255,255,0.05)" fontFamily="monospace">{`{}`}</text>
  </svg>
);

// Podium SVG for leaderboard visual
const PodiumSVG = ({ winners }) => (
  <svg viewBox="0 0 300 200" width="100%" height="160" fill="none">
    {/* Silver - 2nd */}
    <rect x="30" y="100" width="80" height="90" rx="4" fill="rgba(148,163,184,0.15)" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
    <text x="70" y="97" textAnchor="middle" fontSize="11" fill={SILVER} fontWeight="700" fontFamily="'Poppins',sans-serif">2nd</text>
    <text x="70" y="135" textAnchor="middle" fontSize="9" fill={SILVER} fontFamily="'Poppins',sans-serif" opacity="0.8">
      {winners[1]?.team?.split(" ")[0] || ""}
    </text>
    <circle cx="70" cy="78" r="16" fill="rgba(148,163,184,0.15)" stroke={SILVER} strokeWidth="1.5" />
    <text x="70" y="83" textAnchor="middle" fontSize="13" fill={SILVER} fontWeight="800" fontFamily="'Poppins',sans-serif">2</text>

    {/* Gold - 1st */}
    <rect x="110" y="68" width="80" height="122" rx="4" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.35)" strokeWidth="1" />
    <text x="150" y="65" textAnchor="middle" fontSize="11" fill={GOLD} fontWeight="700" fontFamily="'Poppins',sans-serif">1st</text>
    <text x="150" y="112" textAnchor="middle" fontSize="9" fill={GOLD} fontFamily="'Poppins',sans-serif" opacity="0.9">
      {winners[0]?.team?.split(" ")[0] || ""}
    </text>
    {/* Crown */}
    <path d="M135 36 L140 44 L150 38 L160 44 L165 36 L168 52 H132 Z" fill={GOLD} opacity="0.8" />
    <circle cx="150" cy="26" r="14" fill="rgba(245,158,11,0.15)" stroke={GOLD} strokeWidth="1.5" />
    <text x="150" y="31" textAnchor="middle" fontSize="12" fill={GOLD} fontWeight="800" fontFamily="'Poppins',sans-serif">1</text>

    {/* Bronze - 3rd */}
    <rect x="190" y="120" width="80" height="70" rx="4" fill="rgba(205,124,63,0.12)" stroke="rgba(205,124,63,0.3)" strokeWidth="1" />
    <text x="230" y="117" textAnchor="middle" fontSize="11" fill={BRONZE} fontWeight="700" fontFamily="'Poppins',sans-serif">3rd</text>
    <text x="230" y="152" textAnchor="middle" fontSize="9" fill={BRONZE} fontFamily="'Poppins',sans-serif" opacity="0.8">
      {winners[2]?.team?.split(" ")[0] || ""}
    </text>
    <circle cx="230" cy="98" r="14" fill="rgba(205,124,63,0.12)" stroke={BRONZE} strokeWidth="1.5" />
    <text x="230" y="103" textAnchor="middle" fontSize="12" fill={BRONZE} fontWeight="800" fontFamily="'Poppins',sans-serif">3</text>

    {/* Floor line */}
    <line x1="20" y1="192" x2="280" y2="192" stroke="rgba(3,4,94,0.12)" strokeWidth="1" />
  </svg>
);

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconFilter = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconDomain = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 3c-2 3-3 5.5-3 9s1 6 3 9M12 3c2 3 3 5.5 3 9s-1 6-3 9M3 12h18"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconTeam = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 20c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19 15c1.5.5 3 1.5 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconPrize = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
    <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5l-6.2 4.4L8.2 13.7 2 9.2h7.6L12 2z"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconTrophy = ({ color = GOLD, size = 30 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
    <path d="M14 10h20v12c0 5.523-4.477 10-10 10s-10-4.477-10-10V10z"
      stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 14H8a2 2 0 00-2 2v2a8 8 0 008 8h.5M34 14h6a2 2 0 012 2v2a8 8 0 01-8 8h-.5"
      stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M24 32v7M18 39h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconChevron = ({ open }) => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none"
    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
    <path d="M3 5.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEmpty = () => (
  <svg viewBox="0 0 80 80" width="60" height="60" fill="none">
    <circle cx="40" cy="40" r="36" stroke={NAVY_MID} strokeWidth="2" strokeDasharray="6 4" />
    <path d="M28 36h24M28 44h16" stroke={NAVY_MID} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="40" cy="28" r="6" stroke={NAVY_MID} strokeWidth="2" />
  </svg>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const hackathons = [
  {
    id: 1,
    title: "Global AI Innovators Challenge 2025",
    tagline: "Build the intelligence of tomorrow",
    date: "May 2025",
    domain: "Artificial Intelligence",
    mode: "Team",
    prize: "₹5,00,000",
    participants: 1240,
    teams: 310,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "Neural Ninjas", project: "NeuroAssist – Adaptive Learning Engine", score: 98.4 },
      { rank: 2, team: "DeepMind Crew", project: "VisionGuard – Real-time Threat Detection", score: 95.1 },
      { rank: 3, team: "ByteBuilders", project: "SpeakEase – Regional Language NLP", score: 92.7 },
    ],
  },
  {
    id: 2,
    title: "FinTech Security Sprint",
    tagline: "Secure finance for a digital world",
    date: "April 2025",
    domain: "Cybersecurity",
    mode: "Team",
    prize: "₹3,00,000",
    participants: 860,
    teams: 215,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "BlockChain Titans", project: "VaultX – Zero-Trust Banking Layer", score: 97.2 },
      { rank: 2, team: "CipherSquad", project: "SecureLedger – Immutable Audit Trail", score: 94.0 },
      { rank: 3, team: "HexHackers", project: "PhishStop – AI-driven Phishing Shield", score: 90.5 },
    ],
  },
  {
    id: 3,
    title: "HealthTech Hack 2024",
    tagline: "Innovation that saves lives",
    date: "December 2024",
    domain: "Healthcare",
    mode: "Solo & Team",
    prize: "₹2,50,000",
    participants: 980,
    teams: 245,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "MediCode", project: "DiagnoAI – Symptom Triage Assistant", score: 96.6 },
      { rank: 2, team: "VitalSigns", project: "PulseWatch – IoT Vital Monitoring", score: 93.3 },
      { rank: 3, team: "CareChain", project: "MedLedger – Patient Record DApp", score: 89.8 },
    ],
  },
  {
    id: 4,
    title: "EdTech Future Builders",
    tagline: "Reimagining how the world learns",
    date: "October 2024",
    domain: "Education",
    mode: "Team",
    prize: "₹1,50,000",
    participants: 720,
    teams: 180,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "LearnFlow", project: "AdaptIQ – Personalised Study Planner", score: 95.9 },
      { rank: 2, team: "EduSpark", project: "ClassLink – Real-time Doubt Resolver", score: 92.1 },
      { rank: 3, team: "MindMesh", project: "SkillMap – Competency Graph Engine", score: 88.4 },
    ],
  },
  {
    id: 5,
    title: "Green Energy Hackathon",
    tagline: "Code for a sustainable planet",
    date: "August 2024",
    domain: "Sustainability",
    mode: "Team",
    prize: "₹2,00,000",
    participants: 640,
    teams: 160,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "EcoTech Innovators", project: "SolarSync – Community Grid Balancer", score: 97.8 },
      { rank: 2, team: "GreenGrid", project: "EcoTrace – Carbon Footprint Tracker", score: 94.5 },
      { rank: 3, team: "RenewX", project: "WindWatch – Turbine Health Monitor", score: 91.2 },
    ],
  },
  {
    id: 6,
    title: "Web3 Decentralized Jam",
    tagline: "Decentralise everything",
    date: "June 2024",
    domain: "Blockchain",
    mode: "Solo & Team",
    prize: "₹4,00,000",
    participants: 1100,
    teams: 275,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "Crypto Wizards", project: "TrustVault – Decentralized Identity", score: 96.1 },
      { rank: 2, team: "DeFi Legends", project: "YieldFlow – Automated DeFi Yield", score: 93.4 },
      { rank: 3, team: "ChainWave", project: "NFTrade – Cross-chain NFT Marketplace", score: 90.0 },
    ],
  },
  {
    id: 7,
    title: "Smart Cities Hack",
    tagline: "Build the city of tomorrow, today",
    date: "March 2024",
    domain: "IoT & Infrastructure",
    mode: "Team",
    prize: "₹3,50,000",
    participants: 890,
    teams: 222,
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "UrbanHackers", project: "CityPulse – Live Traffic Intelligence", score: 98.0 },
      { rank: 2, team: "SmartNexus", project: "WasteTrack – IoT Waste Management", score: 94.8 },
      { rank: 3, team: "GridGuard", project: "SafeZone – Disaster Alert Network", score: 91.5 },
    ],
  },
  {
    id: 8,
    title: "Open Source Sprint 2024",
    tagline: "Ship code. Help millions.",
    date: "January 2024",
    domain: "Open Source",
    mode: "Solo",
    prize: "₹1,00,000",
    participants: 530,
    teams: 0,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80&auto=format&fit=crop",
    winners: [
      { rank: 1, team: "Aryan Mehta", project: "OpenDoc – Universal API Docs Generator", score: 99.1 },
      { rank: 2, team: "Priya Sharma", project: "CliCraft – Terminal Productivity Suite", score: 96.7 },
      { rank: 3, team: "Rohit Verma", project: "PixelFlow – Open UI Component Library", score: 93.2 },
    ],
  },
];

const ALL_DOMAINS = ["All", ...Array.from(new Set(hackathons.map(h => h.domain)))];
const ALL_MODES = ["All", "Solo", "Team", "Solo & Team"];

const DOMAIN_COLORS = {
  "Artificial Intelligence": "#7c3aed",
  "Cybersecurity": "#dc2626",
  "Healthcare": "#059669",
  "Education": "#0284c7",
  "Sustainability": "#16a34a",
  "Blockchain": "#d97706",
  "IoT & Infrastructure": "#0891b2",
  "Open Source": "#9333ea",
};
function dc(domain) { return DOMAIN_COLORS[domain] || ACCENT; }

/* ─────────────────────────────────────────
   STAT COUNTER
───────────────────────────────────────── */
function StatCounter({ to, suffix = "", dur = 1400 }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useInView(0.2);
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, to, dur]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────
   UNIQUE LEADERBOARD TABLE
───────────────────────────────────────── */
function LeaderboardTable({ winners }) {
  const rankColors = [GOLD, SILVER, BRONZE];
  const rankBg = ["rgba(245,158,11,0.06)", "rgba(148,163,184,0.05)", "rgba(205,124,63,0.05)"];
  const rankLabels = ["Champion", "Runner-up", "2nd Runner-up"];
  const rankIcons = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        display: "grid", gridTemplateColumns: "32px 1fr auto",
        gap: "0 10px", padding: "6px 14px",
        fontSize: 9, fontWeight: 800, letterSpacing: ".1em",
        color: "rgba(3,4,94,0.3)", textTransform: "uppercase",
        borderBottom: "1px solid rgba(3,4,94,0.05)",
        marginBottom: 6,
      }}>
        <span>Rank</span><span>Team & Project</span><span>Score</span>
      </div>
      {winners.map((w, i) => (
        <div key={w.rank} style={{
          display: "grid", gridTemplateColumns: "32px 1fr auto",
          gap: "0 10px", alignItems: "center",
          padding: "10px 14px",
          background: rankBg[i],
          borderRadius: i === 0 ? "12px 12px 0 0" : i === 2 ? "0 0 12px 12px" : 0,
          borderLeft: `3px solid ${rankColors[i]}`,
          marginBottom: i < 2 ? 2 : 0,
          transition: "background .2s",
          cursor: "default",
        }}
          onMouseEnter={e => e.currentTarget.style.background = `${rankColors[i]}12`}
          onMouseLeave={e => e.currentTarget.style.background = rankBg[i]}
        >
          {/* Rank indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>{rankIcons[i]}</span>
          </div>

          {/* Team + project */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: rankColors[i],
              textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 1
            }}>
              {rankLabels[i]}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>
              {w.team}
            </div>
            <div style={{ fontSize: 11, color: NAVY_TEXT, marginTop: 2, lineHeight: 1.3 }}>
              {w.project}
            </div>
          </div>

          {/* Score bar */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: rankColors[i], fontFamily: "'Poppins',sans-serif" }}>
              {w.score}
            </div>
            <div style={{ fontSize: 9, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: ".06em" }}>pts</div>
            {/* Mini score bar */}
            <div style={{ width: 42, height: 3, background: "rgba(3,4,94,0.08)", borderRadius: 2, marginTop: 4, marginLeft: "auto" }}>
              <div style={{ width: `${(w.score - 85) / 15 * 100}%`, height: "100%", borderRadius: 2, background: rankColors[i] }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   HACKATHON CARD — Magazine style
───────────────────────────────────────── */
function HackCard({ hackathon, index }) {
  const [expanded, setExpanded] = useState(false);
  const color = dc(hackathon.domain);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Fade delay={index * 0.055} style={{ height: "100%" }}>
      <div
        className="hcard"
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: "1px solid rgba(3,4,94,0.07)",
          transition: "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = `0 24px 60px rgba(3,4,94,0.1)`;
          e.currentTarget.style.borderColor = `${color}35`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "rgba(3,4,94,0.07)";
        }}
      >
        {/* Card image header */}
        <div style={{ position: "relative", height: 160, overflow: "hidden", background: `${color}12` }}>
          <img
            src={hackathon.image}
            alt={hackathon.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity .4s",
              filter: "brightness(0.82) saturate(1.1)",
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, ${color}55, ${color}cc)`,
          }} />
          {/* Domain pill */}
          <div style={{ position: "absolute", top: 14, left: 14 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 12px", borderRadius: 50,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: ".08em",
              textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.25)",
            }}>
              <IconDomain /> {hackathon.domain}
            </span>
          </div>
          {/* Prize badge */}
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "4px 11px", borderRadius: 50,
              background: GOLD, color: "#fff",
              fontSize: 11, fontWeight: 700,
            }}>
              <IconPrize /> {hackathon.prize}
            </span>
          </div>
          {/* Title overlay */}
          <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: "#fff",
              fontFamily: "'Poppins',sans-serif", lineHeight: 1.3,
              textShadow: "0 1px 8px rgba(0,0,0,0.3)",
            }}>
              {hackathon.title}
            </h3>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "16px 18px 0", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Meta row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[
              { icon: <IconCalendar />, label: hackathon.date },
              { icon: <IconTeam />, label: `${hackathon.participants.toLocaleString()} devs` },
              { icon: <IconDomain />, label: hackathon.mode },
            ].map((m, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 50,
                background: "rgba(3,4,94,0.04)", color: NAVY_TEXT,
                fontSize: 11, fontWeight: 600,
                border: "1px solid rgba(3,4,94,0.07)",
              }}>
                {m.icon} {m.label}
              </span>
            ))}
          </div>

          {/* Champion highlight */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px", borderRadius: 14, marginBottom: 12,
            background: `${GOLD}0a`, border: `1px solid ${GOLD}22`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: `${GOLD}18`, border: `2px solid ${GOLD}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🏆</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 2 }}>
                Champion
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {hackathon.winners[0].team}
              </div>
              <div style={{ fontSize: 11, color: NAVY_TEXT, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {hackathon.winners[0].project}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: GOLD, fontFamily: "'Poppins',sans-serif" }}>
                {hackathon.winners[0].score}
              </div>
              <div style={{ fontSize: 9, color: NAVY_TEXT }}>pts</div>
            </div>
          </div>

          {/* Expandable leaderboard */}
          <div style={{
            maxHeight: expanded ? 320 : 0,
            overflow: "hidden",
            transition: "max-height .45s cubic-bezier(.22,1,.36,1)",
          }}>
            {expanded && <LeaderboardTable winners={hackathon.winners} />}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 18px 18px",
          borderTop: "1px solid rgba(3,4,94,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        }}>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 11.5, fontWeight: 700, color: color,
              background: `${color}0e`, border: `1px solid ${color}22`,
              borderRadius: 50, padding: "7px 14px", cursor: "pointer",
              fontFamily: "'Poppins',sans-serif", transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}1c`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}0e`; }}
          >
            {expanded ? "Hide Leaderboard" : "View Leaderboard"}
            <IconChevron open={expanded} />
          </button>

          <Link
            to={`/results/${hackathon.id}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 700, color: NAVY,
              background: "rgba(3,4,94,0.04)", border: "1px solid rgba(3,4,94,0.1)",
              borderRadius: 50, padding: "7px 16px", textDecoration: "none",
              fontFamily: "'Poppins',sans-serif", transition: "all .22s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = NAVY;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(3,4,94,0.04)";
              e.currentTarget.style.color = NAVY;
            }}
          >
            Full Results <IconArrow />
          </Link>
        </div>
      </div>
    </Fade>
  );
}

/* ─────────────────────────────────────────
   FEATURED CARD — cinematic banner
───────────────────────────────────────── */
function FeaturedCard({ hackathon }) {
  const color = dc(hackathon.domain);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Fade delay={0.05}>
      <div style={{
        borderRadius: 24, overflow: "hidden", position: "relative",
        minHeight: 320,
        boxShadow: "0 24px 72px rgba(3,4,94,0.16)",
      }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={hackathon.image}
            alt=""
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: imgLoaded ? 1 : 0, transition: "opacity .5s",
              filter: "brightness(0.35) saturate(1.2)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${NAVY}ee 0%, ${NAVY}aa 50%, ${color}44 100%)`,
          }} />
          {/* Grid texture */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 1,
          padding: "40px 44px",
          display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap",
        }}>
          {/* Left: info */}
          <div style={{ flex: "1 1 260px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 50, marginBottom: 20,
              background: `${GOLD}18`, border: `1px solid ${GOLD}40`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: ".12em" }}>
                Featured · Most Recent
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(20px,2.4vw,32px)", fontWeight: 800, color: "#fff",
              lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 10,
              fontFamily: "'Poppins',sans-serif",
            }}>
              {hackathon.title}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 22, lineHeight: 1.7, fontWeight: 300 }}>
              {hackathon.tagline}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: hackathon.date, icon: <IconCalendar /> },
                { label: hackathon.domain, icon: <IconDomain /> },
                { label: hackathon.prize + " Prize Pool", icon: <IconPrize /> },
                { label: `${hackathon.participants.toLocaleString()} Devs`, icon: <IconTeam /> },
              ].map((m, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 50,
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)",
                  fontSize: 11.5, fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: podium + winners */}
          <div style={{ flex: "1 1 240px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 10 }}>
              Podium Finish
            </div>
            <PodiumSVG winners={hackathon.winners} />
            {/* Score rows */}
            {hackathon.winners.map((w, i) => {
              const rc = [GOLD, SILVER, BRONZE][i];
              return (
                <div key={w.rank} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 10,
                  background: `${rc}0d`, border: `1px solid ${rc}18`,
                  marginBottom: i < 2 ? 6 : 0,
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${rc}20`, border: `1.5px solid ${rc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: rc, flexShrink: 0 }}>
                    {w.rank}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.team}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.project}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: rc, fontFamily: "'Poppins',sans-serif", flexShrink: 0 }}>
                    {w.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Fade>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Result() {
  const [search, setSearch] = useState("");
  const [activeDomain, setDomain] = useState("All");
  const [activeMode, setMode] = useState("All");
  const heroRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handle = e => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      setMousePos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const filtered = hackathons.filter(h => {
    const q = search.toLowerCase();
    const matchQ = !q || h.title.toLowerCase().includes(q) || h.domain.toLowerCase().includes(q) || h.winners.some(w => w.team.toLowerCase().includes(q));
    const matchD = activeDomain === "All" || h.domain === activeDomain;
    const matchM = activeMode === "All" || h.mode === activeMode || h.mode.includes(activeMode);
    return matchQ && matchD && matchM;
  });

  const totalParticipants = hackathons.reduce((a, h) => a + h.participants, 0);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif", background: OFF, color: NAVY, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(41,98,255,.15); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${NAVY}; border-radius: 4px; }
        h1,h2,h3,h4 { font-family: 'Poppins', sans-serif; }

        .spotlight {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(circle 560px at var(--mx) var(--my),
            rgba(41,98,255,0.13) 0%, transparent 70%);
        }

        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatX { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(4deg)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .float-hero { animation: floatY 7s ease-in-out infinite; }
        .float-b { animation: floatX 11s ease-in-out infinite; }
        .pulse { animation: pulse 2.5s ease-in-out infinite; }

        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track { animation: marquee 30s linear infinite; display:flex; white-space:nowrap; width:max-content; }
        .marquee-track:hover { animation-play-state:paused; }

        /* Hero blob */
        .hero-blob { position:absolute; border-radius:50%; pointer-events:none; }

        /* Search */
        .search-wrap { position: relative; }
        .search-input {
          width: 100%; padding: 16px 22px 16px 52px;
          border-radius: 50px; border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.07); backdrop-filter: blur(12px);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 400; color: #fff;
          outline: none;
          transition: border-color .25s, background .25s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.35); }
        .search-input:focus {
          border-color: ${GOLD}; background: rgba(255,255,255,0.1);
        }
        .search-icon {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.4); pointer-events: none;
        }
        .search-clear {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.1); border: none; border-radius: 50%;
          width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.6); cursor: pointer;
        }

        /* Filter pills */
        .filter-pill {
          padding: 7px 15px; border-radius: 50px; font-size: 12px; font-weight: 600;
          font-family: 'Poppins', sans-serif; cursor: pointer; border: 1.5px solid rgba(3,4,94,0.09);
          transition: all .2s; white-space: nowrap; background: #fff; color: rgba(3,4,94,0.55);
        }
        .filter-pill:hover { border-color: rgba(3,4,94,0.22); color: ${NAVY}; }
        .filter-pill.active { background: ${NAVY}; color: #fff; border-color: ${NAVY}; }

        /* Stats */
        .stat-item {
          flex: 1; padding: 24px 20px; text-align: center;
          transition: background .2s;
        }
        .stat-item:hover { background: rgba(255,255,255,0.04); }

        /* Card grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 22px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .divider { height: 1px; background: linear-gradient(90deg,transparent,rgba(3,4,94,0.09),transparent); }

        @media(max-width:768px){
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section ref={heroRef} style={{
        background: NAVY,
        padding: "130px 6% 90px",
        position: "relative", overflow: "hidden",
      }}>
        <div className="spotlight" style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` }} />

        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />

        {/* Blobs */}
        <div style={{ position: "absolute", top: -120, left: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(41,98,255,0.15) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />

        {/* Content row */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          {/* Left: text + search */}
          <div style={{ flex: "1 1 340px" }}>
            <Fade>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 14px", borderRadius: 50, marginBottom: 24,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.55)",
                letterSpacing: ".14em", textTransform: "uppercase",
              }}>
                <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
                Hall of Champions
              </div>
            </Fade>
            <Fade delay={.07}>
              <h1 style={{
                fontSize: "clamp(36px,4.5vw,64px)", fontWeight: 900, color: "#fff",
                lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 16,
              }}>
                Every Winner.<br />
                <span style={{ color: GOLD }}>Every Story.</span>
              </h1>
            </Fade>
            <Fade delay={.13}>
              <p style={{
                fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.8,
                maxWidth: 480, marginBottom: 36, fontWeight: 300,
              }}>
                Explore the complete archive of hackathon results — from champions to rising stars — all in one place.
              </p>
            </Fade>

            {/* Search */}
            <Fade delay={.2}>
              <div className="search-wrap" style={{ maxWidth: 500 }}>
                <input
                  type="text"
                  placeholder="Search hackathon, domain or winner…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon"><IconSearch /></span>
                {search && (
                  <button className="search-clear" onClick={() => setSearch("")}>
                    <IconClose />
                  </button>
                )}
              </div>
            </Fade>
          </div>

          {/* Right: hero illustration */}
          <Fade
  delay={0.18}
  style={{
    flex: "1 1 480px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  }}
>
  <div
    style={{
      position: "relative",
      width: "100%",
      maxWidth: "580px",
    }}
  >
    {/* Main Image Card */}
    <div
      className="img-card"
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "28px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <img
        src="https://i.pinimg.com/736x/b9/b6/0e/b9b60eb215193ce939ca6721601a846b.jpg"
        alt="Hackathon participants"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(3,4,94,0.58) 0%, rgba(41,98,255,0.22) 100%)",
        }}
      />

      {/* subtle code overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 25,
          transform: "translateY(-50%)",
          fontSize: "72px",
          fontWeight: "900",
          color: "rgba(255,255,255,0.08)",
          fontFamily: "monospace",
        }}
      >
        {"{ }"}
      </div>
    </div>

    {/* Top Floating Card */}
    <div
      style={{
        position: "absolute",
        top: "28px",
        left: "24px",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "14px",
        padding: "10px 18px",
        color: "#fff",
        fontWeight: "700",
        fontSize: "13px",
        zIndex: 10,
      }}
    >
      🏆 Live Results
    </div>

    {/* Bottom Left Card */}
    <div
      style={{
        position: "absolute",
        bottom: "-24px",
        left: "-24px",
        background: NAVY,
        borderRadius: "18px",
        padding: "18px 24px",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 16px 50px rgba(3,4,94,0.35)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#fff",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        6,960+
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.65)",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          fontWeight: "700",
        }}
      >
       Developers Competed
      </div>
    </div>

    {/* Top Right Floating Card */}
    <div
      style={{
        position: "absolute",
        top: "-22px",
        right: "-22px",
        background: ACCENT,
        borderRadius: "18px",
        padding: "18px 24px",
        boxShadow: "0 16px 50px rgba(41,98,255,0.45)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#fff",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        24+
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.8)",
          textTransform: "uppercase",
          letterSpacing: ".08em",
          fontWeight: "700",
        }}
      >
        Winners Honoured
      </div>
    </div>
  </div>
</Fade>
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <div style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap" }}>
          {[
            { val: hackathons.length, suffix: "", label: "Hackathons Archived" },
            { val: totalParticipants, suffix: "+", label: "Developers Competed" },
            { val: hackathons.length * 3, suffix: "", label: "Winners Recognised" },
            { val: 50, suffix: "+", label: "Partner Universities" },
          ].map((s, i, arr) => (
            <div key={s.label} className="stat-item"
              style={{ borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                <StatCounter to={s.val} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 600, marginTop: 6 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MARQUEE ══ */}
      <div style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "11px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) =>
            hackathons.map((h, i) => (
              <span key={`${ri}-${i}`} style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", marginRight: 40 }}>
                {h.winners[0].team} <span style={{ color: "rgba(255,255,255,0.1)", marginRight: 40 }}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <section style={{ padding: "64px 6% 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* ── Featured ── */}
          <div style={{ marginBottom: 60 }}>
            <Fade>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>Spotlight</p>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: "-.02em" }}>Featured Hackathon</h2>
                </div>
                <span style={{ fontSize: 12, color: NAVY_TEXT, fontWeight: 500 }}>Most recently concluded</span>
              </div>
            </Fade>
            <FeaturedCard hackathon={hackathons[0]} />
          </div>

          <div className="divider" style={{ marginBottom: 52 }} />

          {/* ── Filter bar ── */}
          <Fade>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: ".1em", minWidth: 70 }}>
                  <IconFilter /> Domain
                </span>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {ALL_DOMAINS.map(d => (
                    <button key={d} className={`filter-pill ${activeDomain === d ? "active" : ""}`} onClick={() => setDomain(d)}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: ".1em", minWidth: 70 }}>
                  <IconTeam /> Mode
                </span>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {ALL_MODES.map(m => (
                    <button key={m} className={`filter-pill ${activeMode === m ? "active" : ""}`} onClick={() => setMode(m)}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Fade>

          {/* Results bar */}
          <Fade>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26, flexWrap: "wrap", gap: 10 }}>
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 3 }}>Archive</p>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: "-.02em" }}>All Hackathons</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: NAVY_TEXT, fontWeight: 500 }}>
                  Showing <strong style={{ color: NAVY }}>{filtered.length}</strong> of {hackathons.length}
                </span>
                {(search || activeDomain !== "All" || activeMode !== "All") && (
                  <button
                    onClick={() => { setSearch(""); setDomain("All"); setMode("All"); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 50, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", color: "#dc2626", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
                  >
                    <IconClose /> Clear filters
                  </button>
                )}
              </div>
            </div>
          </Fade>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="cards-grid">
              {filtered.map((h, i) => <HackCard key={h.id} hackathon={h} index={i} />)}
            </div>
          ) : (
            <Fade>
              <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(3,4,94,0.04)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <IconEmpty />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>No results found</h3>
                <p style={{ fontSize: 14, color: NAVY_TEXT, marginBottom: 24 }}>Try adjusting your filters or search terms.</p>
                <button onClick={() => { setSearch(""); setDomain("All"); setMode("All"); }}
                  style={{ padding: "11px 28px", borderRadius: 50, background: NAVY, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, fontFamily: "'Poppins',sans-serif", cursor: "pointer" }}>
                  Reset Filters
                </button>
              </div>
            </Fade>
          )}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background: NAVY, padding: "80px 6%", position: "relative", overflow: "hidden" }}>
        {/* bg texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -100, left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(41,98,255,0.12) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.09) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 56, flexWrap: "wrap" }}>
          {/* Left: text */}
          <Fade style={{ flex: "1 1 300px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: ".18em", marginBottom: 14 }}>
              Ready to compete?
            </div>
            <h2 style={{
              fontSize: "clamp(26px,3.5vw,48px)", fontWeight: 900, color: "#fff",
              letterSpacing: "-.025em", lineHeight: 1.1, marginBottom: 16,
            }}>
              Your name could<br />
              <span style={{ color: GOLD }}>be on this list.</span>
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 34, maxWidth: 400 }}>
              Join thousands of developers competing in upcoming hackathons. Build something extraordinary, earn your place in the Hall of Champions.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 28, marginBottom: 36, flexWrap: "wrap" }}>
              {[
                { val: "₹25L+", label: "Prize Money Distributed" },
                { val: "8", label: "Hackathons Hosted" },
                { val: "7,960+", label: "Developers Participated" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                to="/hackathons"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: NAVY,
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  borderRadius: 50, padding: "14px 30px", textDecoration: "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                  transition: "transform .2s, box-shadow .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.32)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
              >
                Browse Hackathons <IconArrow />
              </Link>
              <Link
                to="/register"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: "rgba(255,255,255,0.75)",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
                  borderRadius: 50, padding: "13px 26px", textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              >
                Create Account
              </Link>
            </div>
          </Fade>

          {/* Right: rocket illustration */}
          <Fade delay={.12} style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
            <div className="float-b">
              <CTAIllustration />
            </div>
          </Fade>
        </div>
      </section>
    </div>
  );
}