import { useState, useEffect, useRef } from "react";
import { userService } from "../../services/userService";

// ── Scroll-reveal hook ──────────────────────────────────────────
function useIntersection(ref, threshold = 0.12) {
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
    dir === "up"    ? "translateY(36px)" :
    dir === "left"  ? "translateX(-36px)" :
    dir === "right" ? "translateX(36px)" : "translateY(36px)";
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0)" : from,
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────
const Icons = {
  Trophy: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="8 21 12 17 16 21"/>
      <line x1="12" y1="17" x2="12" y2="11"/>
      <path d="M7 4H4a2 2 0 0 0-2 2v2c0 2.21 1.79 4 4 4h.5"/>
      <path d="M17 4h3a2 2 0 0 1 2 2v2c0 2.21-1.79 4-4 4h-.5"/>
      <rect x="7" y="2" width="10" height="9" rx="2"/>
    </svg>
  ),
  Medal: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="15" r="6"/>
      <path d="M8.56 2.9A7 7 0 0 1 16 2.9"/>
      <path d="M6.12 8.4L4 6M17.88 8.4L20 6"/>
      <line x1="12" y1="9" x2="12" y2="12"/>
    </svg>
  ),
  Star: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Hash: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Award: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Download: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Target: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Zap: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Spinner: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

function computeSummaryStats(dashboardStats, results) {
  const totalResults = results.length;
  const avgScore = totalResults
    ? (results.reduce((sum, result) => sum + Number(result.totalScore || 0), 0) / totalResults).toFixed(1)
    : "0.0";
  const bestRankFromResults = results
    .map(r => Number(r.rank))
    .filter(rank => !Number.isNaN(rank) && rank > 0);
  const bestRank = dashboardStats?.bestRank || (bestRankFromResults.length ? Math.min(...bestRankFromResults) : null);
  const certificateCount = dashboardStats?.certificates ?? results.filter(r => r.certificateReady).length;

  return [
    { label: "Hackathons Entered",  value: dashboardStats?.hackathonsJoined ?? totalResults, icon: Icons.Hash,   color: "#0077b6", bg: "#e8f4fd" },
    { label: "Best Rank",           value: bestRank ? `#${bestRank}` : "-",               icon: Icons.Trophy, color: "#0077b6", bg: "#e8f4fd" },
    { label: "Avg Score",           value: avgScore,                                 icon: Icons.Star,   color: "#0096c7", bg: "#e0f4ff" },
    { label: "Certificates Earned", value: certificateCount,                          icon: Icons.Award,  color: "#03045e", bg: "#eef0f8" },
  ];
}

const results = [
  {
    id: 1,
    hackathon: "Smart India Hackathon 2025",
    domain: "AI / ML", mode: "Team", teamName: "Neural Ninjas",
    submittedAt: "2025-05-10 14:32", rank: 2, totalParticipants: 312,
    status: "Winner", totalScore: 91.5,
    // Card 1 — light sky blue theme
    cardTheme: "light",
    criteria: [
      { name: "Innovation",           score: 94, weight: 30, maxScore: 100 },
      { name: "Technical Complexity", score: 88, weight: 25, maxScore: 100 },
      { name: "Presentation",         score: 92, weight: 20, maxScore: 100 },
      { name: "Impact",               score: 90, weight: 25, maxScore: 100 },
    ],
    judgeComment: "Exceptional use of generative AI in a real-world context. Clean architecture and excellent presentation.",
    prize: "₹50,000", certificateReady: true,
  },
  {
    id: 2,
    hackathon: "DevSprint National Challenge",
    domain: "Blockchain", mode: "Solo", teamName: null,
    submittedAt: "2025-04-18 10:15", rank: 7, totalParticipants: 198,
    status: "Ranked", totalScore: 78.2,
    cardTheme: "default",
    criteria: [
      { name: "Innovation",           score: 75, weight: 30, maxScore: 100 },
      { name: "Technical Complexity", score: 82, weight: 25, maxScore: 100 },
      { name: "Presentation",         score: 74, weight: 20, maxScore: 100 },
      { name: "Impact",               score: 80, weight: 25, maxScore: 100 },
    ],
    judgeComment: "Solid implementation. Could improve on UX and documentation.",
    prize: null, certificateReady: true,
  },
  {
    id: 3,
    hackathon: "HackWithInfy Spring Edition",
    domain: "Web Dev", mode: "Team", teamName: "ByteBuilders",
    submittedAt: "2025-03-05 16:44", rank: 1, totalParticipants: 450,
    status: "Winner", totalScore: 96.0,
    // Card 3 — deep navy/midnight blue theme
    cardTheme: "dark",
    criteria: [
      { name: "Innovation",           score: 97, weight: 30, maxScore: 100 },
      { name: "Technical Complexity", score: 95, weight: 25, maxScore: 100 },
      { name: "Presentation",         score: 96, weight: 20, maxScore: 100 },
      { name: "Impact",               score: 96, weight: 25, maxScore: 100 },
    ],
    judgeComment: "Outstanding project. Best submission of the season — innovative, polished, and impactful.",
    prize: "₹1,00,000", certificateReady: true,
  },
  {
    id: 4,
    hackathon: "MDU TechFest Hack 2024",
    domain: "IoT", mode: "Team", teamName: "Circuit Crew",
    submittedAt: "2024-11-22 09:00", rank: 14, totalParticipants: 120,
    status: "Participated", totalScore: 61.3,
    cardTheme: "default",
    criteria: [
      { name: "Innovation",           score: 60, weight: 30, maxScore: 100 },
      { name: "Technical Complexity", score: 65, weight: 25, maxScore: 100 },
      { name: "Presentation",         score: 58, weight: 20, maxScore: 100 },
      { name: "Impact",               score: 62, weight: 25, maxScore: 100 },
    ],
    judgeComment: "Good hardware integration. Needs more polish on the software side.",
    prize: null, certificateReady: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────
function rankLabel(rank) {
  if (rank === 1) return "🥇 1st";
  if (rank === 2) return "🥈 2nd";
  if (rank === 3) return "🥉 3rd";
  return `#${rank}`;
}

function statusConfig(status) {
  if (status === "Winner")  return { color: "#0077b6", bg: "#e8f4fd", border: "#90cdf4" };
  if (status === "Ranked")  return { color: "#0096c7", bg: "#e0f4ff", border: "#7dd3f0" };
  return                           { color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db" };
}

function normalizeResult(result) {
  const isWinner = result.isWinner || result.status === "Winner";
  const rank = result.rank ?? null;
  const score = result.score ?? result.totalScore ?? 0;
  const criteria = result.criteria || [{ name: "Final Score", score, weight: 100, maxScore: 100 }];

  return {
    id: result._id || result.id,
    hackathon: result.hackathonId?.title || result.hackathon || "Untitled Hackathon",
    domain: result.awardCategory || result.domain || "General",
    mode: result.teamId ? "Team" : result.mode || "Solo",
    teamName: result.teamId?.name || result.teamName || null,
    submittedAt: result.date ? new Date(result.date).toLocaleString() : result.submittedAt || "Unknown date",
    rank,
    totalParticipants: result.totalParticipants || "-",
    status: result.status || (isWinner ? "Winner" : rank ? "Ranked" : "Participated"),
    totalScore: score,
    cardTheme: result.cardTheme || (isWinner ? "light" : "default"),
    criteria,
    judgeComment: result.judgeComment || result.feedback || result.award || "Judge feedback not available.",
    prize: result.prize || result.award || result.awardCategory || null,
    certificateReady: result.certificateStatus === "completed" || result.certificateReady || false,
  };
}

// Card theme configs
function cardThemeConfig(theme) {
  if (theme === "light") return {
    border: "#7dd3f0",
    ribbon: "linear-gradient(90deg,#0096c7,#48cae4)",
    scoreBg: "linear-gradient(135deg,#0096c7,#48cae4)",
    scoreShadow: "0 4px 14px rgba(0,150,199,0.35)",
    barColor: "#0096c7",
    accentColor: "#0096c7",
    feedbackBg: "linear-gradient(120deg,#e0f4ff,#caf0f8)",
    feedbackBorder: "#0096c7",
  };
  if (theme === "dark") return {
    border: "#03045e",
    ribbon: "linear-gradient(90deg,#023e8a,#03045e)",
    scoreBg: "linear-gradient(135deg,#023e8a,#03045e)",
    scoreShadow: "0 4px 14px rgba(2,62,138,0.4)",
    barColor: "#023e8a",
    accentColor: "#023e8a",
    feedbackBg: "linear-gradient(120deg,#eef0f8,#dbe4f5)",
    feedbackBorder: "#023e8a",
  };
  // default
  return {
    border: "#90cdf4",
    ribbon: "linear-gradient(90deg,#03045e,#0077b6)",
    scoreBg: "linear-gradient(135deg,#03045e,#0077b6)",
    scoreShadow: "0 4px 14px rgba(3,4,94,0.28)",
    barColor: "#0077b6",
    accentColor: "#0077b6",
    feedbackBg: "linear-gradient(120deg,#eef0f8,#e8f4fd)",
    feedbackBorder: "#0077b6",
  };
}

// ── Score Bar ──────────────────────────────────────────────────
function ScoreBar({ score, color = "#03045e", delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const visible = useIntersection(ref, 0.1);
  useEffect(() => {
    if (visible) setTimeout(() => setWidth(score), delay * 1000 + 100);
  }, [visible, score, delay]);
  return (
    <div ref={ref} style={{ background: "#eef0f8", borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 99,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        width: `${width}%`,
        transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        boxShadow: `0 0 8px ${color}55`,
      }} />
    </div>
  );
}

// ── Animated Counter ───────────────────────────────────────────
function Counter({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const visible = useIntersection(ref, 0.2);
  useEffect(() => {
    if (!visible) return;
    const isNum = !isNaN(parseFloat(target));
    if (!isNum) { setVal(target); return; }
    const num = parseFloat(target);
    const dec = (target.toString().split(".")[1] || "").length;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal((num * ease).toFixed(dec));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return <span ref={ref}>{val}</span>;
}

// ── Stat Card with hover tilt + color invert ───────────────────
function StatCard({ s, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={i * 0.08} dir="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#03045e" : "#fff",
          borderRadius: 16, padding: "20px 22px",
          border: `1.5px solid ${hovered ? "#90cdf4" : "#03045e"}`,
          boxShadow: hovered ? "0 10px 32px rgba(3,4,94,0.22)" : "0 2px 14px rgba(3,4,94,0.07)",
          display: "flex", alignItems: "center", gap: 14,
          transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s, background 0.35s, border-color 0.35s",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          cursor: "default",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12,
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
            fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 22,
            color: hovered ? "#fff" : "#03045e", lineHeight: 1,
            transition: "color 0.35s",
          }}>
            <Counter target={s.value} />
          </div>
          <div style={{
            fontFamily: "Poppins,sans-serif", fontSize: 11.5,
            color: hovered ? "rgba(255,255,255,0.65)" : "#7b8ab8", marginTop: 3,
            transition: "color 0.35s",
          }}>
            {s.label}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ── Download Button with loading state ─────────────────────────
function DownloadButton() {
  const [dlState, setDlState] = useState("idle"); // idle | loading | done
  const handleClick = () => {
    if (dlState !== "idle") return;
    setDlState("loading");
    setTimeout(() => {
      setDlState("done");
      setTimeout(() => setDlState("idle"), 2500);
    }, 2200);
  };
  const configs = {
    idle:    { bg: "#03045e", text: "Download Certificate", icon: <Icons.Download />, hover: "#0077b6" },
    loading: { bg: "#0077b6", text: "Preparing...",         icon: null,               hover: "#0077b6" },
    done:    { bg: "#0096c7", text: "Downloaded!",          icon: <Icons.Check />,    hover: "#0096c7" },
  };
  const cfg = configs[dlState];
  return (
    <button
      onClick={handleClick}
      style={{
        marginTop: 16,
        display: "flex", alignItems: "center", gap: 7,
        background: cfg.bg, color: "#fff",
        border: "none", borderRadius: 10,
        padding: "10px 20px", cursor: dlState === "idle" ? "pointer" : "default",
        fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13,
        boxShadow: "0 4px 14px rgba(3,4,94,0.22)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        minWidth: 200, justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { if (dlState === "idle") { e.currentTarget.style.background = cfg.hover; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.background = cfg.bg; e.currentTarget.style.transform = ""; }}
    >
      {dlState === "loading" ? (
        <>
          <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>
            <Icons.Spinner />
          </span>
          {cfg.text}
          {/* progress bar inside button */}
          <span style={{
            position: "absolute", bottom: 0, left: 0, height: 3,
            background: "rgba(255,255,255,0.5)", borderRadius: 99,
            animation: "btnProgress 2.2s linear forwards",
          }} />
        </>
      ) : (
        <>
          {cfg.icon}
          {cfg.text}
        </>
      )}
    </button>
  );
}

// ── Result Card ────────────────────────────────────────────────
function ResultCard({ result, index }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const sc = statusConfig(result.status);
  const isWinner = result.status === "Winner";
  const tc = cardThemeConfig(result.cardTheme);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  return (
    <Reveal delay={index * 0.1} dir="up">
      <div
        ref={cardRef}
        style={{
          background: "#fff",
          borderRadius: 18,
          border: `1.5px solid ${isWinner ? tc.border : "#e2e8f0"}`,
          boxShadow: isWinner
            ? "0 4px 24px rgba(3,4,94,0.13)"
            : "0 2px 16px rgba(3,4,94,0.07)",
          marginBottom: 20,
          overflow: "hidden",
          transition: "box-shadow 0.25s, transform 0.25s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(3,4,94,0.13)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = isWinner
            ? "0 4px 24px rgba(3,4,94,0.13)"
            : "0 2px 16px rgba(3,4,94,0.07)";
        }}
      >
        {isWinner && (
          <div style={{ background: tc.ribbon, height: 4 }} />
        )}

        <div style={{ padding: "22px 26px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, fontFamily: "Nunito,sans-serif",
                  padding: "2px 10px", borderRadius: 20,
                  color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                }}>{result.status}</span>
                <span style={{ fontSize: 11, color: "#7b8ab8", fontFamily: "Poppins,sans-serif" }}>
                  {result.domain} · {result.mode}
                </span>
              </div>
              <h3 style={{
                fontFamily: "Nunito,sans-serif", fontWeight: 900,
                fontSize: 17, color: "#03045e", margin: "0 0 4px",
              }}>{result.hackathon}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                {result.teamName && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7b8ab8", fontFamily: "Poppins,sans-serif" }}>
                    <Icons.Users /> {result.teamName}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#7b8ab8", fontFamily: "Poppins,sans-serif" }}>
                  <Icons.Clock /> {result.submittedAt}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 22, color: "#03045e", lineHeight: 1 }}>
                  {rankLabel(result.rank)}
                </div>
                <div style={{ fontSize: 10, color: "#9aa3c2", fontFamily: "Poppins,sans-serif", marginTop: 2 }}>
                  of {result.totalParticipants}
                </div>
              </div>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: tc.scoreBg,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                boxShadow: tc.scoreShadow,
              }}>
                <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 16, color: "#fff", lineHeight: 1 }}>
                  {result.totalScore}
                </span>
                <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 9, color: "rgba(255,255,255,0.75)" }}>/ 100</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "16px 0 0" }}>
            {result.prize && (
              <span style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 12, fontFamily: "Nunito,sans-serif", fontWeight: 800,
                color: tc.accentColor, background: "#e8f4fd",
                padding: "4px 12px", borderRadius: 20,
              }}>
                 Prize: {result.prize}
              </span>
            )}
            {result.certificateReady && (
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 12, fontFamily: "Poppins,sans-serif",
                color: tc.accentColor, background: "#e8f4fd",
                padding: "4px 12px", borderRadius: 20,
              }}>
                <Icons.CheckCircle /> Certificate Ready
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            width: "100%", background: "none", border: "none",
            borderTop: "1.5px solid #eef0f8", marginTop: 18,
            padding: "12px 26px", cursor: "pointer",
            fontFamily: "Poppins,sans-serif", fontSize: 12, fontWeight: 600,
            color: "#7b8ab8", textAlign: "left",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <Icons.BarChart />
          {expanded ? "Hide Score Breakdown" : "View Score Breakdown & Judge Feedback"}
          <svg
            style={{ marginLeft: "auto", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}
            width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div style={{
          maxHeight: expanded ? 560 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <div style={{ padding: "20px 26px 24px" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13, color: "#03045e", marginBottom: 14 }}>
                Score Breakdown by Criterion
              </div>
              {result.criteria.map((c, ci) => (
                <div key={ci} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, fontWeight: 600, color: "#4a5568" }}>
                      {c.name}
                      <span style={{ color: "#9aa3c2", fontWeight: 400, marginLeft: 4 }}>({c.weight}% weight)</span>
                    </span>
                    <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13, color: "#03045e" }}>
                      {c.score} / {c.maxScore}
                    </span>
                  </div>
                  <ScoreBar score={c.score} color={tc.barColor} delay={ci * 0.08} />
                </div>
              ))}
            </div>

            <div style={{
              background: tc.feedbackBg,
              borderRadius: 12, padding: "14px 18px",
              borderLeft: `4px solid ${tc.feedbackBorder}`,
            }}>
              <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12, color: "#03045e", marginBottom: 5 }}>
                Judge's Feedback
              </div>
              <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 12.5, color: "#4a5568", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>
                "{result.judgeComment}"
              </p>
            </div>

            {result.certificateReady && <DownloadButton />}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function MyResults() {
  const [filter, setFilter] = useState("All");
  const [results, setResults] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filters = ["All", "Winner", "Ranked", "Participated"];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([userService.getDashboardStats(), userService.getMyResults()])
      .then(([statsRes, resultsRes]) => {
        if (!isMounted) return;

        const statsData = statsRes?.data?.data ?? statsRes?.data ?? {};
        const responseData = resultsRes?.data;
        const data = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];

        setDashboardStats(statsData);
        setResults(data.map(normalizeResult));
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err.message || "Failed to load results.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filtered = filter === "All"
    ? results
    : results.filter(r => r.status === filter);

  const summaryStats = computeSummaryStats(dashboardStats, results);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7ff", fontFamily: "Poppins,sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes popIn { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes btnProgress { from{width:0%} to{width:100%} }
        .mr-filter-btn { transition: all 0.2s; }
        .mr-filter-btn:hover { transform: translateY(-1px); }
        @media (max-width: 768px) {
          .mr-header-text { text-align: center; }
          .mr-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .mr-main-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .mr-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: "#fff", padding: "32px 36px 52px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid #eef0f8",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle,#03045e 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        <Reveal>
          <h1 className="mr-header-text" style={{
            fontFamily: "Nunito,sans-serif", fontWeight: 900,
            fontSize: 28, color: "#03045e", margin: 0, position: "relative",
          }}>My Results</h1>
          <p className="mr-header-text" style={{
            color: "#5a7a9a", fontFamily: "Poppins,sans-serif",
            fontSize: 13.5, margin: "6px 0 0", position: "relative",
          }}>Track your hackathon performance, scores, rankings, and judge feedback.</p>
        </Reveal>
      </div>

      <div style={{ maxWidth: "min(1040px, calc(100% - 40px))", margin: "-28px auto 0" }}>

        {/* ── Summary Stats ── */}
        <div className="mr-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {summaryStats.map((s, i) => (
            <StatCard key={i} s={s} i={i} />
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="mr-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, alignItems: "start" }}>

          {/* ── Left: Result Cards ── */}
          <div>
            <Reveal delay={0.05}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#7b8ab8", fontFamily: "Poppins,sans-serif", marginRight: 4 }}>
                  <Icons.Filter /> Filter:
                </span>
                {filters.map(f => (
                  <button key={f} className="mr-filter-btn" onClick={() => setFilter(f)} style={{
                    padding: "6px 16px", borderRadius: 20,
                    border: `1.5px solid ${filter === f ? "#03045e" : "#dde2f0"}`,
                    background: filter === f ? "#03045e" : "#fff",
                    color: filter === f ? "#fff" : "#7b8ab8",
                    fontFamily: "Nunito,sans-serif", fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                  }}>{f}</button>
                ))}
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#9aa3c2", fontFamily: "Poppins,sans-serif" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </Reveal>

            {loading ? (
              <Reveal>
                <div style={{ background: "#fff", borderRadius: 16, padding: "48px 24px", textAlign: "center", border: "1.5px solid #eef0f8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                  <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, color: "#03045e", fontSize: 16 }}>Loading your results...</div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "#7b8ab8", marginTop: 6 }}>Fetching data from the backend.</div>
                </div>
              </Reveal>
            ) : error ? (
              <Reveal>
                <div style={{ background: "#fff", borderRadius: 16, padding: "48px 24px", textAlign: "center", border: "1.5px solid #fde2e8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                  <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, color: "#b91c1c", fontSize: 16 }}>Unable to load results</div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "#7b8ab8", marginTop: 6 }}>{error}</div>
                </div>
              </Reveal>
            ) : filtered.length === 0 ? (
              <Reveal>
                <div style={{ background: "#fff", borderRadius: 16, padding: "48px 24px", textAlign: "center", border: "1.5px solid #eef0f8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, color: "#03045e", fontSize: 16 }}>No results for "{filter}"</div>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "#7b8ab8", marginTop: 6 }}>Try a different filter.</div>
                </div>
              </Reveal>
            ) : (
              filtered.map((r, i) => <ResultCard key={r.id} result={r} index={i} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}