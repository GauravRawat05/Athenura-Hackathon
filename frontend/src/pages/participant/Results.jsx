import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const NAVY      = "#03045E";
const ACCENT    = "#00B4D8";
const GOLD      = "#f59e0b";
const SILVER    = "#94a3b8";
const BRONZE    = "#cd7c3f";
const OFF_WHITE = "#f0f4f8";

/* ─────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────── */
function useInView(threshold = 0.1) {
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

function Fade({ children, delay = 0, y = 24, className = "", style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${delay}s, transform .6s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const hackathonDetails = {
  title: "Global AI Innovators Challenge 2025",
  domain: "Artificial Intelligence",
  participants: 1240,
  teams: 310,
  prizePool: "₹10,00,000",
  status: "Final Results Announced",
  date: "May 2025",
};

/* Full leaderboard — ranks 1 through 10 */
const allLeaderboard = [
  { rank: 1,  team: "Neural Ninjas",   members: 4, score: 98.2, change: "+0", track: "Generative AI",   uni: "DTU Delhi",   prize: "₹5,00,000" },
  { rank: 2,  team: "Data Alchemists", members: 3, score: 94.5, change: "+0", track: "Computer Vision", uni: "IIT Delhi",   prize: "₹3,00,000" },
  { rank: 3,  team: "Visionaries",     members: 3, score: 91.0, change: "+0", track: "NLP",             uni: "BITS Pilani", prize: "₹1,50,000" },
  { rank: 4,  team: "Code Crafters",   members: 4, score: 88.7, change: "+2", track: "Generative AI",   uni: "NIT Trichy" },
  { rank: 5,  team: "Byte Busters",    members: 2, score: 87.1, change: "-1", track: "Computer Vision", uni: "MDU Rohtak" },
  { rank: 6,  team: "AI Titans",       members: 5, score: 85.5, change: "+1", track: "Reinforcement",   uni: "VIT Vellore" },
  { rank: 7,  team: "Quantum Logic",   members: 3, score: 84.0, change: "0",  track: "NLP",             uni: "IIT Bombay" },
  { rank: 8,  team: "Tech Pioneers",   members: 4, score: 82.3, change: "+4", track: "Generative AI",   uni: "SRM Chennai" },
  { rank: 9,  team: "Robo Minds",      members: 2, score: 81.8, change: "-2", track: "Computer Vision", uni: "NSUT Delhi" },
  { rank: 10, team: "Future Forge",    members: 5, score: 80.5, change: "0",  track: "NLP",             uni: "Amity Noida" },
];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
    <path d="M12 3v13M7 11l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 20c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
    <path d="M3 5.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconUpArrow = () => (
  <svg viewBox="0 0 24 24" width="10" height="10" fill="none">
    <path d="M7 17L17 7M7 7h10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDownArrow = () => (
  <svg viewBox="0 0 24 24" width="10" height="10" fill="none">
    <path d="M17 7L7 17M17 17H7V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────
   SCROLL TO TOP
───────────────────────────────────────── */
function ScrollToTop() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  return null;
}

/* ─────────────────────────────────────────
   LEADERBOARD ROW
───────────────────────────────────────── */
function LeaderboardRow({ row, index }) {
  const [hovered, setHovered] = useState(false);
  const isUp   = row.change.startsWith("+") && row.change !== "+0";
  const isDown = row.change.startsWith("-");

  const rankMedal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;
  const medalColor = row.rank === 1 ? GOLD : row.rank === 2 ? SILVER : row.rank === 3 ? BRONZE : null;
  const isTopThree = row.rank <= 3;

  return (
    <Fade delay={0.08 + index * 0.045} y={18}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 20,
          background: hovered
            ? "#ffffff"
            : isTopThree
              ? `linear-gradient(135deg, ${medalColor}08 0%, #fff 100%)`
              : "rgba(255,255,255,0.65)",
          border: isTopThree
            ? `1.5px solid ${medalColor}40`
            : `1px solid ${hovered ? "rgba(0,180,216,0.25)" : "rgba(3,4,94,0.07)"}`,
          borderLeft: isTopThree ? `4px solid ${medalColor}` : `4px solid transparent`,
          padding: "16px 24px", borderRadius: 16, marginBottom: 10,
          boxShadow: hovered
            ? "0 12px 36px rgba(3,4,94,0.1)"
            : isTopThree
              ? `0 4px 18px ${medalColor}15`
              : "0 2px 8px rgba(3,4,94,0.03)",
          transform: hovered ? "scale(1.012) translateX(4px)" : "scale(1) translateX(0)",
          transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
          position: "relative", overflow: "hidden", cursor: "default",
        }}
      >
        {/* Hover shimmer */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: hovered ? `${row.score}%` : "0%",
          background: "linear-gradient(90deg, rgba(0,180,216,0.04) 0%, rgba(0,180,216,0.09) 100%)",
          transition: "width 0.55s cubic-bezier(0.22,1,0.36,1)", pointerEvents: "none", zIndex: 0,
        }} />

        {/* Rank */}
        <div style={{ width: 48, textAlign: "center", flexShrink: 0, zIndex: 1 }}>
          {rankMedal ? (
            <span style={{ fontSize: 22 }}>{rankMedal}</span>
          ) : (
            <>
              <div style={{ fontSize: 17, fontWeight: 800, color: NAVY, fontFamily: "'Space Grotesk', sans-serif" }}>
                #{row.rank}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, marginTop: 1,
                color: isUp ? "#10b981" : isDown ? "#ef4444" : "#94a3b8",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
              }}>
                {isUp   && <IconUpArrow />}
                {isDown && <IconDownArrow />}
                <span>{row.change !== "0" ? row.change.replace(/[+-]/, "") : "–"}</span>
              </div>
            </>
          )}
        </div>

        {/* Team info */}
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: NAVY, fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
              {row.team}
            </h4>
            {row.prize && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: GOLD,
                background: `${GOLD}15`, border: `1px solid ${GOLD}30`,
                padding: "2px 8px", borderRadius: 50,
              }}>🏆 {row.prize}</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(3,4,94,0.45)", flexWrap: "wrap", marginTop: 3 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <IconUsers /> {row.members} Members
            </span>
            <span>·</span>
            <span>{row.uni}</span>
          </div>
        </div>

        {/* Track badge */}
        <div style={{ zIndex: 1 }}>
          <span style={{
            background: "rgba(3,4,94,0.04)", border: "1px solid rgba(3,4,94,0.08)",
            padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600, color: NAVY,
            whiteSpace: "nowrap",
          }}>{row.track}</span>
        </div>

        {/* Score */}
        <div style={{ textAlign: "right", zIndex: 1, minWidth: 72 }}>
          <div style={{
            fontSize: 21, fontWeight: 800,
            color: isTopThree ? medalColor : ACCENT,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>{row.score}</div>
          <div style={{ fontSize: 10, color: "rgba(3,4,94,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".06em" }}>pts</div>
        </div>
      </div>
    </Fade>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Results() {
  const { hackathonId } = useParams();
  const [showAll, setShowAll] = useState(false);

  const displayedRows = showAll ? allLeaderboard : allLeaderboard.slice(0, 7);

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, fontFamily: "'Nunito', sans-serif", overflowX: "hidden" }}>
      <ScrollToTop />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(0,180,216,0.25); }

        @keyframes heroFadeUp {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,180,216,0.4); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(0,180,216,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,180,216,0); }
        }

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.6); text-decoration: none; font-size: 13px;
          font-weight: 600; transition: color .2s;
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: 'Nunito', sans-serif;
        }
        .back-btn:hover { color: #fff !important; }

        .cta-btn-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .cta-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: ${NAVY};
          font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 14px;
          border-radius: 50px; padding: 14px 36px; text-decoration: none;
          box-shadow: 0 6px 30px rgba(0,0,0,0.25); letter-spacing: .04em;
          transition: transform .2s, box-shadow .2s;
        }
        .cta-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
        .cta-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: rgba(255,255,255,0.85);
          font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px;
          border-radius: 50px; padding: 12px 32px; text-decoration: none;
          border: 2px solid rgba(255,255,255,0.35);
          transition: background .2s, color .2s, border-color .2s;
        }
        .cta-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); color: #fff; }

        .cta-stats-row { display: flex; gap: 0; justify-content: center; flex-wrap: wrap; margin-bottom: 44px; }

        @media (max-width: 768px) {
          .results-header-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .results-header-meta  { flex-wrap: wrap !important; gap: 8px 14px !important; }
          .leaderboard-col-track { display: none !important; }
          .cta-btn-row { flex-wrap: nowrap !important; gap: 10px !important; }
          .cta-btn-primary { padding: 12px 20px !important; font-size: 13px !important; }
          .cta-btn-ghost   { padding: 11px 18px !important; font-size: 13px !important; }
          .cta-stats-row > div { padding-left: 16px !important; padding-right: 16px !important; }
        }
        @media (max-width: 480px) {
          .cta-btn-primary { padding: 11px 16px !important; font-size: 12px !important; }
          .cta-btn-ghost   { padding: 10px 14px !important; font-size: 12px !important; }
        }
      `}</style>

      {/* ══ COMPACT HEADER ══ */}
      <div style={{
        background: NAVY, position: "relative", overflow: "hidden",
        padding: "28px 5% 32px",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
          backgroundSize: "48px 48px", pointerEvents: "none",
        }} />
        {/* Accent blob */}
        <div style={{
          position: "absolute", top: -60, right: "10%", width: 280, height: 280,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Back link */}
          <Link to="/result" className="back-btn" style={{ marginBottom: 18, display: "inline-flex" }}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" style={{ marginRight: 4 }}>
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Results Archive
          </Link>

          <div className="results-header-inner" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Status pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "4px 14px", borderRadius: 50, marginBottom: 10,
                background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.3)",
                color: ACCENT, fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, animation: "pulse-ring 2s ease-in-out infinite", display: "inline-block" }} />
                {hackathonDetails.status}
              </div>

              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(20px, 3.5vw, 32px)",
                fontWeight: 800, color: "#fff", letterSpacing: "-.025em", lineHeight: 1.1,
                marginBottom: 12,
                background: "linear-gradient(120deg, #fff 40%, rgba(0,180,216,0.75) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "heroFadeUp .6s ease both",
              }}>
                {hackathonDetails.title}
              </h1>

              <div className="results-header-meta" style={{
                display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
              }}>
                {[
                  { icon: "🗓", label: hackathonDetails.date },
                  { icon: "🧠", label: hackathonDetails.domain },
                  { icon: "👥", label: `${hackathonDetails.participants.toLocaleString("en-IN")} Participants` },
                  { icon: "🏆", label: `Prize Pool: ${hackathonDetails.prizePool}`, highlight: true },
                ].map((m, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 12px", borderRadius: 50,
                    background: m.highlight ? `${GOLD}18` : "rgba(255,255,255,0.07)",
                    border: m.highlight ? `1px solid ${GOLD}35` : "1px solid rgba(255,255,255,0.1)",
                    color: m.highlight ? GOLD : "rgba(255,255,255,0.55)",
                    fontSize: 11.5, fontWeight: 600,
                  }}>
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick stat */}
            <div style={{
              flexShrink: 0, textAlign: "center",
              padding: "14px 22px", borderRadius: 16,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
                {hackathonDetails.teams}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 4 }}>
                Teams
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ GLOBAL LEADERBOARD ══ */}
      <section style={{ padding: "60px 5% 100px", position: "relative", background: OFF_WHITE }}>
        {/* Wave divider */}
        <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 52, overflow: "hidden", pointerEvents: "none" }}>
          <svg viewBox="0 0 1200 52" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,26 C300,52 900,0 1200,26 L1200,0 L0,0 Z" fill={NAVY} />
          </svg>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Section heading */}
          <Fade>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(3,4,94,0.4)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>
                  All Participants
                </p>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-.02em" }}>
                  🏆 Global Leaderboard
                </h2>
                <p style={{ fontSize: 13.5, color: "rgba(3,4,94,0.45)", marginTop: 5 }}>
                  Ranks 1–{allLeaderboard.length} · {hackathonDetails.teams} teams total
                </p>
              </div>
              <button
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", border: "1px solid rgba(3,4,94,0.1)", color: NAVY,
                  padding: "10px 22px", borderRadius: 50, fontSize: 13, fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(3,4,94,0.06)", cursor: "pointer",
                  transition: "all .25s", fontFamily: "'Nunito', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(3,4,94,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(3,4,94,0.06)"; }}
              >
                <IconDownload /> Export CSV
              </button>
            </div>
          </Fade>

          {/* Table header */}
          <Fade delay={0.05}>
            <div style={{
              display: "flex", padding: "0 24px 10px", marginBottom: 4,
              fontSize: 10.5, fontWeight: 700, color: "rgba(3,4,94,0.35)",
              textTransform: "uppercase", letterSpacing: ".08em",
              borderBottom: "1px solid rgba(3,4,94,0.07)",
            }}>
              <div style={{ width: 48, textAlign: "center", flexShrink: 0 }}>Rank</div>
              <div style={{ flex: 1, paddingLeft: 20 }}>Team</div>
              <div className="leaderboard-col-track" style={{ marginRight: 24, minWidth: 120, textAlign: "center" }}>Track</div>
              <div style={{ minWidth: 72, textAlign: "right" }}>Score</div>
            </div>
          </Fade>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
            {displayedRows.map((row, i) => (
              <LeaderboardRow key={row.rank} row={row} index={i} />
            ))}
          </div>

          {/* Load more / show less */}
          <Fade delay={0.5}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <button
                onClick={() => setShowAll(v => !v)}
                style={{
                  background: "transparent", border: "none", color: ACCENT,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "color .2s", fontFamily: "'Nunito', sans-serif",
                }}
                onMouseEnter={e => e.currentTarget.style.color = NAVY}
                onMouseLeave={e => e.currentTarget.style.color = ACCENT}
              >
                {showAll ? "Show Less" : `Load More Results (${allLeaderboard.length - 7} more)`}
                <div style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform .3s" }}>
                  <IconChevronDown />
                </div>
              </button>
            </div>
          </Fade>

          {/* Expanded: full export note */}
          {showAll && (
            <Fade>
              <div style={{
                marginTop: 24, padding: "24px", borderRadius: 18,
                background: "rgba(255,255,255,0.7)", border: "1px solid rgba(3,4,94,0.07)",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 13.5, color: "rgba(3,4,94,0.45)", fontStyle: "italic" }}>
                  Showing all {allLeaderboard.length} ranked teams. Full export available via CSV.
                </p>
                <button
                  style={{
                    marginTop: 14, padding: "10px 24px", borderRadius: 50,
                    background: NAVY, color: "#fff", border: "none",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Nunito', sans-serif", transition: "opacity .2s",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <IconDownload /> Download Full Results
                </button>
              </div>
            </Fade>
          )}
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section style={{ padding: "110px 5%", textAlign: "center", background: NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 25% 50%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Fade>
            <div style={{
              display: "inline-block", fontSize: 10.5, fontWeight: 800, letterSpacing: ".18em",
              textTransform: "uppercase", color: ACCENT, marginBottom: 20,
              padding: "5px 18px", borderRadius: 50,
              background: "rgba(0,180,216,0.08)", border: "1px solid rgba(0,180,216,0.22)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Ready to Compete?
            </div>

            <h2 style={{
              fontSize: "clamp(28px,5vw,58px)", fontWeight: 700, color: "#fff",
              letterSpacing: "-.03em", lineHeight: 1.08, marginBottom: 18,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Your name could be <span style={{ color: "rgba(255,255,255,0.38)" }}>on this list.</span>
            </h2>

            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)", fontWeight: 400,
              maxWidth: 460, margin: "0 auto 36px",
              fontFamily: "'Nunito', sans-serif", lineHeight: 1.75,
            }}>
              Join thousands of developers competing in upcoming hackathons. Build something extraordinary and earn your place in the Hall of Champions.
            </p>

            <div className="cta-stats-row">
              {[
                { val: "₹25L+", label: "Prize Money" },
                { val: "8+",    label: "Hackathons" },
                { val: "7,960+", label: "Developers" },
              ].map((s, i) => (
                <div key={i} style={{
                  paddingLeft: i === 0 ? 0 : 32, paddingRight: i === 2 ? 0 : 32,
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: ".08em" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="cta-btn-row">
              <Link className="cta-btn-primary" to="/hackathons">Browse Hackathons</Link>
              <Link className="cta-btn-ghost" to="/register">Create Account</Link>
            </div>
          </Fade>
        </div>
      </section>
    </div>
  );
}