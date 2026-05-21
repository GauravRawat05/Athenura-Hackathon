import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Trophy, Medal, ChevronLeft, Download, Zap, Users, Star, ArrowUpRight } from "lucide-react";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const NAVY = "#03045E";
const OFF_WHITE = "#f8fafc";
const ACCENT = "#00B4D8"; // Cyan
const GOLD = "#f59e0b";
const SILVER = "#94a3b8";
const BRONZE = "#cd7c3f";

/* ─────────────────────────────────────────
   ANIMATION HOOK
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

function Fade({ children, delay = 0, y = 30, className = "", style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
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
  status: "Final Results Announced",
};

const topWinners = [
  { rank: 2, name: "Data Alchemists", score: 94.5, prize: "₹3,00,000", uni: "IIT Delhi", color: SILVER, height: 160 },
  { rank: 1, name: "Neural Ninjas", score: 98.2, prize: "₹5,00,000", uni: "DTU Delhi", color: GOLD, height: 210 },
  { rank: 3, name: "Visionaries", score: 91.0, prize: "₹1,50,000", uni: "BITS Pilani", color: BRONZE, height: 130 },
];

const leaderboard = [
  { rank: 4, team: "Code Crafters", members: 4, score: 88.7, change: "+2", track: "Generative AI", uni: "NIT Trichy" },
  { rank: 5, team: "Byte Busters", members: 2, score: 87.1, change: "-1", track: "Computer Vision", uni: "MDU Rohtak" },
  { rank: 6, team: "AI Titans", members: 5, score: 85.5, change: "+1", track: "Reinforcement", uni: "VIT Vellore" },
  { rank: 7, team: "Quantum Logic", members: 3, score: 84.0, change: "0", track: "NLP", uni: "IIT Bombay" },
  { rank: 8, team: "Tech Pioneers", members: 4, score: 82.3, change: "+4", track: "Generative AI", uni: "SRM Chennai" },
  { rank: 9, team: "Robo Minds", members: 2, score: 81.8, change: "-2", track: "Computer Vision", uni: "NSUT Delhi" },
  { rank: 10, team: "Future Forge", members: 5, score: 80.5, change: "0", track: "NLP", uni: "Amity Noida" },
];

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function PodiumWinner({ winner, delay }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Fade delay={delay} y={40}>
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="podium-wrap"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 380, position: "relative", cursor: "default" }}
      >
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 120, height: 120, borderRadius: "50%", background: winner.color,
          filter: "blur(40px)", opacity: hovered ? 0.4 : 0, transition: "opacity 0.5s"
        }} />

        <div style={{
          background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)",
          border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 16,
          padding: "16px 20px", display: "flex", flexDirection: "column", alignItems: "center",
          marginBottom: 16, zIndex: 10, minWidth: 160,
          transform: hovered ? "translateY(-12px) scale(1.05)" : "translateY(0) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.4s",
          borderColor: hovered ? winner.color : "rgba(255,255,255,0.1)",
        }}>
          {winner.rank === 1 ? <Trophy size={32} color={winner.color} style={{ marginBottom: 8, filter: "drop-shadow(0 0 8px rgba(245,158,11,0.5))" }}/> 
                             : <Medal size={28} color={winner.color} style={{ marginBottom: 8 }}/>}
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 2, fontFamily: "'Poppins', sans-serif", textAlign: "center" }}>{winner.name}</h3>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>{winner.uni}</p>
          
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700, color: winner.color }}>{winner.score} pts</span>
          </div>
        </div>

        <div style={{
          width: 110, height: winner.height, position: "relative",
          background: `linear-gradient(180deg, ${winner.color}15 0%, rgba(255,255,255,0.02) 100%)`,
          borderTop: `2px solid ${winner.color}`, borderLeft: `1px solid ${winner.color}40`, borderRight: `1px solid ${winner.color}40`,
          borderTopLeftRadius: 12, borderTopRightRadius: 12,
          display: "flex", justifyContent: "center", paddingTop: 16,
          boxShadow: `inset 0 20px 40px -10px ${winner.color}25`,
        }}>
          <span style={{ fontSize: 54, fontWeight: 900, color: winner.color, opacity: 0.15, fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>
            {winner.rank}
          </span>
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: 40,
            background: `linear-gradient(180deg, ${winner.color} 0%, transparent 100%)`,
            opacity: hovered ? 0.15 : 0.05, transition: "opacity 0.4s"
          }} />
        </div>
      </div>
    </Fade>
  );
}

function LeaderboardRow({ row, index }) {
  const [hovered, setHovered] = useState(false);
  const isUp = row.change.includes("+");
  const isDown = row.change.includes("-");

  return (
    <Fade delay={0.2 + (index * 0.05)} y={20}>
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 20,
          background: hovered ? "#fff" : "rgba(255,255,255,0.6)",
          border: "1px solid rgba(3,4,94,0.06)",
          padding: "16px 24px", borderRadius: 16, marginBottom: 12,
          boxShadow: hovered ? "0 12px 32px rgba(3,4,94,0.08)" : "0 4px 12px rgba(3,4,94,0.02)",
          transform: hovered ? "scale(1.01) translateX(4px)" : "scale(1) translateX(0)",
          transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
          position: "relative", overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: hovered ? `${row.score}%` : "0%",
          background: `linear-gradient(90deg, ${ACCENT}08 0%, ${ACCENT}15 100%)`,
          transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none", zIndex: 0
        }} />

        <div style={{ width: 40, textAlign: "center", zIndex: 1 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: NAVY, fontFamily: "'Poppins', sans-serif" }}>#{row.rank}</span>
          <div style={{ 
            fontSize: 10, fontWeight: 700, marginTop: 2,
            color: isUp ? "#10b981" : isDown ? "#ef4444" : "#94a3b8",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2
          }}>
            {isUp && <ArrowUpRight size={10} />}
            {isDown && <ArrowUpRight size={10} style={{ transform: "rotate(90deg)" }} />}
            {row.change !== "0" ? row.change.replace(/[+-]/,"") : "-"}
          </div>
        </div>

        <div style={{ flex: 1, zIndex: 1 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{row.team}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "rgba(3,4,94,0.5)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12}/> {row.members} Members</span>
            <span>•</span>
            <span>{row.uni}</span>
          </div>
        </div>

        <div style={{ zIndex: 1, display: { xs: "none", md: "block" } }}>
          <span style={{
            background: "rgba(3,4,94,0.04)", border: "1px solid rgba(3,4,94,0.08)",
            padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600, color: NAVY
          }}>
            {row.track}
          </span>
        </div>

        <div style={{ textAlign: "right", zIndex: 1, minWidth: 80 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT, fontFamily: "'Poppins', sans-serif" }}>
            {row.score}
          </div>
          <div style={{ fontSize: 10, color: "rgba(3,4,94,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".05em" }}>Points</div>
        </div>
      </div>
    </Fade>
  );
}

export default function Results() {
  const { hackathonId } = useParams();
  
  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, fontFamily: "'Nunito', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(0, 180, 216, 0.2); }
        
        .ambient-bg {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
        }
        .ambient-blob {
          position: absolute; filter: blur(90px); opacity: 0.5; border-radius: 50%;
          animation: float 20s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 30px) scale(1.1); }
        }
      `}</style>

      <section style={{ position: "relative", background: NAVY, padding: "120px 5% 60px" }}>
        <div className="ambient-bg">
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="ambient-blob" style={{ top: "-10%", left: "-5%", width: 400, height: 400, background: ACCENT }} />
          <div className="ambient-blob" style={{ bottom: "-10%", right: "-10%", width: 500, height: 500, background: "#4338ca", animationDelay: "-5s" }} />
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link to="/hackathons" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13, fontWeight: 600, marginBottom: 40, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color="#fff"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.6)"}>
            <ChevronLeft size={16} /> Back to Directory
          </Link>

          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <Fade>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, background: "rgba(0,180,216,0.1)", border: `1px solid rgba(0,180,216,0.3)`, color: ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 24 }}>
                <Zap size={14} fill={ACCENT} /> {hackathonDetails.status}
              </div>
            </Fade>
            <Fade delay={0.1}>
              <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, color: "#fff", fontFamily: "'Poppins', sans-serif", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 20 }}>
                {hackathonDetails.title}
              </h1>
            </Fade>
            <Fade delay={0.2}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={16} color={ACCENT} /> {hackathonDetails.domain}</span>
                <span>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={16} color={ACCENT} /> {hackathonDetails.participants} Participants</span>
              </div>
            </Fade>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, minHeight: 400, flexWrap: "wrap" }}>
            <PodiumWinner winner={topWinners[0]} delay={0.3} />
            <PodiumWinner winner={topWinners[1]} delay={0.5} />
            <PodiumWinner winner={topWinners[2]} delay={0.7} />
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 5% 100px", position: "relative" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          
          <Fade>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontFamily: "'Poppins', sans-serif", letterSpacing: "-.02em" }}>
                  Global Leaderboard
                </h2>
                <p style={{ fontSize: 14, color: "rgba(3,4,94,0.5)", marginTop: 4 }}>Ranks 4 to 10 out of 310 teams</p>
              </div>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", border: "1px solid rgba(3,4,94,0.1)", color: NAVY,
                padding: "10px 20px", borderRadius: 50, fontSize: 13, fontWeight: 700,
                boxShadow: "0 4px 12px rgba(3,4,94,0.04)", cursor: "pointer", transition: "all 0.2s"
              }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(3,4,94,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(3,4,94,0.04)"; }}>
                <Download size={16} /> Export CSV
              </button>
            </div>
          </Fade>

          <Fade delay={0.1}>
            <div style={{ display: "flex", padding: "0 24px", marginBottom: 12, fontSize: 11, fontWeight: 700, color: "rgba(3,4,94,0.4)", textTransform: "uppercase", letterSpacing: ".05em" }}>
              <div style={{ width: 40, textAlign: "center" }}>Rank</div>
              <div style={{ flex: 1, paddingLeft: 20 }}>Team</div>
              <div style={{ display: { xs: "none", md: "block" } }}>Track</div>
              <div style={{ minWidth: 80, textAlign: "right" }}>Score</div>
            </div>
          </Fade>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {leaderboard.map((row, i) => (
              <LeaderboardRow key={i} row={row} index={i} />
            ))}
          </div>

          <Fade delay={0.6}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button style={{
                background: "transparent", border: "none", color: ACCENT, fontSize: 14, fontWeight: 700,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s"
              }} onMouseEnter={e => e.currentTarget.style.color = NAVY} onMouseLeave={e => e.currentTarget.style.color = ACCENT}>
                Load More Results <ChevronLeft size={16} style={{ transform: "rotate(-90deg)" }} />
              </button>
            </div>
          </Fade>

        </div>
      </section>
    </div>
  );
}
