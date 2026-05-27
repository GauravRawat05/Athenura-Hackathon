import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hackathons as mockHackathons, domains, statuses, modes } from "../../data/hackathons";
import { hackathonService } from "../../services/hackathonService";
import { setHackathons, setLoading } from "../../store/hackathonSlice";

/* ─────────────────────────────────────────
   DESIGN TOKENS
   Cohesive premium palette matching About/Contact/Result
   ───────────────────────────────────────── */
const NAVY = "#03045E";
const WHITE = "#ffffff";
const OFF = "#f0f2ff";
const ACCENT = "#2962FF";
const NAVY_TEXT = "rgba(3,4,94,0.62)";
const NAVY_MID = "rgba(3,4,94,0.14)";

const domainImages = {
  "AI/ML": "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
  "Blockchain": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  "HealthTech": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  "Web3": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  "IoT": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
};

const DOMAIN_COLORS = {
  "AI/ML": "#7c3aed",
  "Cybersecurity": "#dc2626",
  "HealthTech": "#059669",
  "Blockchain": "#d97706",
  "Web3": "#2563eb",
  "IoT": "#0891b2",
};
function getDomainColor(domain) {
  return DOMAIN_COLORS[domain] || ACCENT;
}

const statusConfig = {
  ongoing:   { label: "Ongoing",   bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
  upcoming:  { label: "Upcoming",  bg: "#dbeafe", color: "#1d4ed8", dot: "#1d4ed8" },
  past:      { label: "Completed", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  completed: { label: "Completed", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

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
      transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${delay}s, transform .75s cubic-bezier(.22,1,.36,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   STATS COUNTER
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
   ICONS
   ───────────────────────────────────────── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconSparkles = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
  </svg>
);
const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
    <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M8 21h8"/>
    <path d="M12 17v4"/>
    <path d="M6 3h12v8a6 6 0 0 1-12 0V3z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ─────────────────────────────────────────
   DB TO FRONTEND MAPPING
   ───────────────────────────────────────── */
const mapDbHackathon = (h) => {
  const domain = h.technologyDomains?.[0] || "AI/ML";
  const image = domainImages[domain] || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80";

  const formatCurrency = (val, currency) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "Free";
    const symbol = currency === 'DOLLAR' ? '$' : '₹';
    return `${symbol}${num.toLocaleString('en-IN')}`;
  };

  const statusMap = { upcoming: 'upcoming', ongoing: 'ongoing', past: 'past', judging: 'past', draft: 'upcoming' };
  const mappedStatus = statusMap[h.status] || 'upcoming';

  return {
    id: h._id,
    title: h.title,
    tagline: h.description ? (h.description.length > 80 ? h.description.substring(0, 77) + "..." : h.description) : "Innovative hackathon challenge",
    status: mappedStatus,
    mode: (h.allowedModes?.[0] || h.mode?.[0] || "Team").toLowerCase(),
    prize: formatCurrency(h.prizePool, h.currency),
    fee: formatCurrency(h.registrationFee, h.currency),
    prizeNum: h.prizePool || 0,
    feeNum: h.registrationFee || 0,
    domain: domain,
    registrationDeadline: h.registrationDeadline || h.startDate,
    startDate: h.startDate,
    endDate: h.endDate,
    minTeamSize: h.minTeamSize || 2,
    maxTeamSize: h.maxTeamSize || 4,
    participants: h.participantsCount || 120,
    image: h.bannerUrl || h.image || `https://picsum.photos/seed/${h._id}/800/400`,
    sponsors: h.sponsors?.map(s => s.name) || ["Athenura"],
    tags: h.technologyDomains || [],
    description: h.description,
  };
};

/* ─────────────────────────────────────────
   FEATURED HACKATHON CARD (Cinematic Banner)
   ───────────────────────────────────────── */
function FeaturedHackathon({ hackathon, onDetails }) {
  const color = getDomainColor(hackathon.domain);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Fade delay={0.06}>
      <div style={{
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
        minHeight: 300,
        boxShadow: "0 24px 60px rgba(3,4,94,0.12)",
        background: NAVY,
        cursor: "pointer",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch"
      }} onClick={onDetails}>
        {/* Cinematic Background Image Layer */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src={hackathon.image}
            alt=""
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 0.35 : 0,
              transition: "opacity .5s",
              filter: "brightness(0.4) saturate(1.2)"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${NAVY}f0 0%, ${NAVY}a0 60%, ${color}20 100%)`
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
            backgroundSize: "36px 36px"
          }} />
        </div>

        {/* Content Section */}
        <div style={{
          position: "relative",
          zIndex: 1,
          padding: "36px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          gap: 20
        }}>
          <div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 50,
                background: "rgba(245,158,11,0.18)",
                border: "1px solid rgba(245,158,11,0.35)",
                color: "#f59e0b",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".12em",
                textTransform: "uppercase"
              }}>
                ⭐ FEATURED HACKATHON
              </span>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 50,
                background: `${color}25`,
                border: `1px solid ${color}50`,
                color: color,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".12em",
                textTransform: "uppercase"
              }}>
                {hackathon.domain}
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(22px,3vw,34px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              letterSpacing: "-.025em",
              marginBottom: 10,
              fontFamily: "'Poppins',sans-serif"
            }}>
              {hackathon.title}
            </h2>
            <p style={{
              fontSize: 14.5,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: 620,
              fontWeight: 400,
              marginBottom: 20
            }}>
              {hackathon.tagline}
            </p>
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 20,
            gap: 16
          }}>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { label: "PRIZE POOL", value: hackathon.prizeNum === 0 ? "Recognition" : hackathon.prize, color: "#f59e0b" },
                { label: "PARTICIPANTS", value: `${hackathon.participants.toLocaleString()} devs`, color: "#fff" },
                { label: "FEE", value: hackathon.fee, color: "#22c55e" },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: stat.color, fontFamily: "'Poppins',sans-serif" }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <button style={{
              background: WHITE,
              color: NAVY,
              border: "none",
              borderRadius: 50,
              padding: "12px 28px",
              fontFamily: "'Poppins',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              transition: "transform .2s, box-shadow .2s",
              display: "flex",
              alignItems: "center",
              gap: 8
            }} onClick={(e) => { e.stopPropagation(); onDetails(); }}
               onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.25)"; }}
               onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)"; }}
            >
              Explore Challenge →
            </button>
          </div>
        </div>
      </div>
    </Fade>
  );
}

/* ─────────────────────────────────────────
   HACKATHON EXPLORE CARD (Matching user request exactly)
   ───────────────────────────────────────── */
function PublicHackathonExploreCard({ h, index }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const st = statusConfig[h.status] || statusConfig.upcoming;
  const dl = daysLeft(h.registrationDeadline);
  const isPastDeadline = new Date(h.registrationDeadline) < new Date();

  const handleParticipate = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/hackathon/${h.id}`);
    }
  };

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#bfdbfe" : "#e2e8f0"}`,
        borderRadius: 20, overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? "translateY(-6px)" : "translateY(0)") : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 90}ms, transform 0.4s cubic-bezier(.4,0,.2,1), border 0.3s, box-shadow 0.3s`,
        boxShadow: hovered ? "0 20px 50px rgba(30,58,138,0.18)" : "0 4px 16px rgba(0,0,0,0.05)",
        fontFamily: "'Poppins',sans-serif",
      }}
    >
      {/* Banner */}
      <div style={{ position: "relative", height: 165, overflow: "hidden" }}>
        <img src={h.image} alt={h.title} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.5) 0%,transparent 60%)" }} />
        
        {/* Status */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 20,
          fontSize: 10.5, fontWeight: 700, color: st.color,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: st.dot,
            animation: h.status === "ongoing" ? "mhPulse 1.8s ease-in-out infinite" : "none",
          }} />
          {st.label}
        </div>

        {/* Domain */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(30,58,138,0.9)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 20,
          fontSize: 10.5, fontWeight: 600, color: "#fff",
        }}>{h.domain}</div>

        {/* Prize */}
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          padding: "5px 11px", borderRadius: 20,
          fontSize: 13, fontWeight: 800, color: "#1e3a8a",
        }}>
          <IconTrophy /> {h.prize}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontWeight: 800, fontSize: 18, color: "#0f172a", lineHeight: 1.3,
            marginBottom: 5, fontFamily: "'Nunito',sans-serif",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{h.title}</div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
              <IconUsers /> {h.mode === "solo" ? "Solo Mode allowed" : `Team Size: ${h.minTeamSize}-${h.maxTeamSize}`}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              Fee: <strong style={{ color: h.fee === "Free" ? "#16a34a" : "#1e3a8a" }}>{h.fee}</strong>
            </span>
          </div>
        </div>

        {/* Timeline details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { icon: <IconCalendar />, label: "Starts", value: formatDate(h.startDate) },
            { icon: <IconClock />,    label: "Deadline", value: formatDate(h.registrationDeadline) },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#f8fafc", borderRadius: 10, padding: "8px 10px", border: "1px solid #e2e8f0",
            }}>
              <span style={{ color: "#1e3a8a", opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.7, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#334155", fontWeight: 600, marginTop: 1 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 6 }}>
          {/* Deadline label */}
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
            {isPastDeadline ? (
              <span style={{ color: "#dc2626" }}>Closed</span>
            ) : (
              <span>⏰ <strong style={{ color: dl <= 3 ? "#dc2626" : "#1e3a8a" }}>{dl} days</strong> left</span>
            )}
          </div>

          {/* Action triggers */}
          {isPastDeadline ? (
            <button disabled style={{
              background: "#e2e8f0", border: "none", borderRadius: 10,
              padding: "7px 16px", color: "#94a3b8", fontSize: 11,
              fontWeight: 600, cursor: "not-allowed", fontFamily: "'Poppins',sans-serif",
            }}>Registration Closed</button>
          ) : (
            <button
              onClick={handleParticipate}
              style={{
                background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
                border: "none", borderRadius: 12, padding: "8px 18px", color: "#fff",
                fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(30,58,138,0.25)",
                display: "flex", alignItems: "center", gap: 4,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,58,138,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,58,138,0.25)"; }}
            >
              Participate Now →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────── */
export default function Hackathons() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Read state from Redux store for true realtime updates
  const hackathonsList = useSelector((state) => state.hackathon.hackathons);
  const loading = useSelector((state) => state.hackathon.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showFilters, setShowFilters] = useState(false);
  const heroRef = useRef(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    mode: "all",
    domain: "All",
    feeType: "all",
    prizeMax: 100000,
  });

  // Track Mouse Spotlight Movement
  useEffect(() => {
    const handle = e => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      setMousePos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Fetch Hackathons with safe mock mapping fallback
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await hackathonService.getAllHackathons();
        if (res.data?.data) {
          const dbHacks = res.data.data.map(mapDbHackathon);
          dispatch(setHackathons(dbHacks));
        } else {
          dispatch(setHackathons([]));
        }
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        dispatch(setHackathons([]));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [dispatch]);

  // Compute dynamic counters in realtime based on active list
  const totalPrizePool = useMemo(() => {
    return hackathonsList.reduce((sum, h) => sum + (h.prizeNum || 0), 0);
  }, [hackathonsList]);

  const totalParticipants = useMemo(() => {
    return hackathonsList.reduce((sum, h) => sum + (h.participants || 0), 0);
  }, [hackathonsList]);

  // Filter keys helper
  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  // Computed Values & Filter Logic
  const filteredHackathons = useMemo(() => {
    return hackathonsList.filter(h => {
      // Search
      const searchMatch = !filters.search || 
        h.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        h.tagline.toLowerCase().includes(filters.search.toLowerCase()) ||
        h.domain.toLowerCase().includes(filters.search.toLowerCase()) ||
        h.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Status
      const statusMatch = filters.status === "all" || h.status === filters.status;

      // Mode
      const modeMatch = filters.mode === "all" || h.mode === filters.mode;

      // Domain
      const domainMatch = filters.domain === "All" || h.domain === filters.domain;

      // Fee Type
      const feeMatch = filters.feeType === "all" || 
        (filters.feeType === "free" && h.feeNum === 0) ||
        (filters.feeType === "paid" && h.feeNum > 0);

      // Max Prize Pool
      const prizeMatch = h.prizeNum <= filters.prizeMax;

      return searchMatch && statusMatch && modeMatch && domainMatch && feeMatch && prizeMatch;
    });
  }, [filters, hackathonsList]);

  // Featured hackathon selector (Highest active prize pool)
  const featuredHackathon = useMemo(() => {
    const activeList = hackathonsList.filter(h => h.status !== "past");
    if (activeList.length === 0) return hackathonsList[0];
    return activeList.reduce((max, h) => h.prizeNum > max.prizeNum ? h : max, activeList[0]);
  }, [hackathonsList]);

  // Count helper statistics
  const statusCounts = useMemo(() => {
    return {
      all: hackathonsList.length,
      upcoming: hackathonsList.filter(h => h.status === "upcoming").length,
      ongoing: hackathonsList.filter(h => h.status === "ongoing").length,
      past: hackathonsList.filter(h => h.status === "past").length,
    };
  }, [hackathonsList]);

  // Unique list of domains
  const uniqueDomains = useMemo(() => {
    return ["All", ...Array.from(new Set(hackathonsList.map(h => h.domain)))];
  }, [hackathonsList]);

  // Sticky Bar styles
  const pillStyle = (active, color) => ({
    padding: "7px 16px",
    borderRadius: 50,
    fontSize: 12.5,
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 700,
    cursor: "pointer",
    border: active ? "none" : "1.5px solid rgba(3,4,94,0.12)",
    background: active ? color : "#ffffff",
    color: active ? "#ffffff" : "rgba(3,4,94,0.55)",
    transition: "all .25s",
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  });

  const filterLabelStyle = {
    fontSize: 10,
    fontWeight: 800,
    color: NAVY,
    opacity: 0.45,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    marginBottom: 8,
    fontFamily: "'Nunito',sans-serif"
  };

  const whitePillStyle = (active) => ({
    padding: "6px 14px",
    borderRadius: 50,
    fontSize: 12,
    fontWeight: 800,
    fontFamily: "'Nunito',sans-serif",
    cursor: "pointer",
    border: active ? "none" : `1.5px solid ${NAVY_MID}`,
    background: active ? ACCENT : "#ffffff",
    color: active ? "#ffffff" : NAVY,
    transition: "all .2s"
  });

  if (loading) {
    return (
      <div style={{
        background: NAVY,
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          width: 50,
          height: 50,
          border: "4px solid rgba(255,255,255,0.15)",
          borderTopColor: ACCENT,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: 20
        }} />
        <h3 style={{ fontWeight: 600 }}>Loading Cyber Arena...</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Nunito','Poppins',sans-serif", background: OFF, color: NAVY, overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{-webkit-font-smoothing:antialiased;}
        ::selection{background:rgba(41,98,255,.18);}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${NAVY};border-radius:4px;}
        h1,h2,h3{font-family:'Poppins',sans-serif;}
        
        .spotlight{
          position:absolute;inset:0;pointer-events:none;z-index:0;
          background:radial-gradient(circle 500px at var(--mx) var(--my),rgba(41,98,255,0.13) 0%,transparent 70%);
          transition:background .1s;
        }
        
        .pulse{animation:pulse 2s infinite;}
        @keyframes pulse{
          0%,100%{opacity:0.5;transform:scale(1)}
          50%{opacity:1;transform:scale(1.05)}
        }
        
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(3,4,94,0.1),transparent);}
        .dot-bg{background-image:radial-gradient(circle,rgba(3,4,94,0.08) 1px,transparent 1px);background-size:26px 26px;}

        /* Immersive search controls */
        .search-wrap { position: relative; max-width: 500px; margin: 0 auto; width: 100%; }
        .search-input {
          width: 100%; padding: 14px 20px 14px 50px;
          border-radius: 50px; border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
          font-family: 'Nunito', sans-serif;
          font-size: 14.5px; font-weight: 600; color: #fff;
          outline: none;
          transition: border-color .22s, background .22s, box-shadow .22s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.4); }
        .search-input:focus {
          border-color: ${ACCENT}; background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 4px rgba(41,98,255,0.15);
        }
        .search-icon {
          position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.45); pointer-events: none;
        }
        .search-clear {
          position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.15); border: none; border-radius: 50%;
          width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7); cursor: pointer; transition: background .2s, color .2s;
        }
        .search-clear:hover { background: rgba(255,255,255,0.25); color: #fff; }

        @keyframes mhPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

        @media(max-width:768px){
          .hero-grid{flex-direction:column!important;gap:36px!important;}
          .stats-wrap{justify-content:space-between!important;gap:12px!important;}
          .filter-sticky-row { flex-direction:column!important; align-items:stretch!important; gap:12px!important;}
          .filter-right-group { justify-content:space-between!important;}
          .filter-panel-content { grid-template-columns:1fr!important; gap:16px!important;}
        }
      `}</style>

      {/* ══ HERO BANNER WITH SPOTLIGHT ══ */}
      <section ref={heroRef} style={{
        background: NAVY,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "110px 5% 90px"
      }}>
        <div className="spotlight" style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle,rgba(41,98,255,0.16) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 50, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div style={{ flex: 1.1, minWidth: 280 }}>
            <Fade>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 50,
                marginBottom: 24,
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.07)"
              }}>
                <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                EXPLORE HACKATHONS
              </div>
            </Fade>

            <Fade delay={0.08}>
              <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.03em", color: "white", marginBottom: 12 }}>
                Where Code Meets
              </h1>
              <h1 style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.03em", color: ACCENT, marginBottom: 20 }}>
                Infinite Innovation.
              </h1>
            </Fade>

            <Fade delay={0.16}>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 500, marginBottom: 32, fontWeight: 400 }}>
                Discover global developer sprints, form collaborative squads, deploy smart prototypes, and capture ultimate prizes.
              </p>
            </Fade>

            {/* Interactive Search Bar */}
            <Fade delay={0.24}>
              <div className="search-wrap">
                <span className="search-icon"><IconSearch /></span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Find hacker sprints, domains, or topics..."
                  value={filters.search}
                  onChange={e => setFilter("search", e.target.value)}
                />
                {filters.search && (
                  <button className="search-clear" onClick={() => setFilter("search", "")}>
                    <IconX />
                  </button>
                )}
              </div>
            </Fade>

            {/* Dynamic statistics */}
            <Fade delay={0.32}>
              <div className="stats-wrap" style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>
                {[
                  { value: hackathonsList.length, suffix: "+", label: "Hacker Arenas" },
                  { value: totalPrizePool, suffix: "+", label: "Global Prize Pools", prefix: "₹" },
                  { value: totalParticipants, suffix: "+", label: "Devs Registrations" }
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif", lineHeight: 1.1 }}>
                      {stat.prefix}
                      <StatCounter to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginTop: 4 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Right Cinematic Hero Card */}
          {featuredHackathon && (
            <div style={{ flex: 0.9, minWidth: 280 }}>
              <FeaturedHackathon hackathon={featuredHackathon} onDetails={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                } else {
                  navigate(`/hackathon/${featuredHackathon.id}`);
                }
              }} />
            </div>
          )}
        </div>
      </section>

      {/* ══ STICKY DYNAMIC FILTER BAR ══ */}
      <div style={{
        position: "sticky",
        top: 56,
        zIndex: 10,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1.5px solid rgba(3,4,94,0.06)",
        padding: "12px 5%",
        boxShadow: "0 4px 20px rgba(3,4,94,0.02)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div className="filter-sticky-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            
            {/* Status Pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", "ongoing", "upcoming", "past"].map(s => {
                const colors = { all: ACCENT, ongoing: "#00B4D8", upcoming: "#0077B6", past: "#94a3b8" };
                const count = statusCounts[s];
                return (
                  <button
                    key={s}
                    onClick={() => setFilter("status", s)}
                    style={pillStyle(filters.status === s, colors[s])}
                  >
                    <span>{s === "all" ? "🌐 All Stages" : s === "ongoing" ? "🔴 Live Sprint" : s === "upcoming" ? "📅 Upcoming" : "🏁 Finished"}</span>
                    <span style={{
                      fontSize: 10.5,
                      padding: "2px 7px",
                      borderRadius: 50,
                      background: filters.status === s ? "rgba(255,255,255,0.22)" : "rgba(3,4,94,0.06)",
                      color: filters.status === s ? "#fff" : NAVY,
                      fontWeight: 800
                    }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Groups & Filters Toggle */}
            <div className="filter-right-group" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Solo/Team modes */}
              <div style={{ display: "flex", background: "rgba(3,4,94,0.04)", padding: 4, borderRadius: 50 }}>
                {["all", "solo", "team"].map(m => (
                  <button
                    key={m}
                    onClick={() => setFilter("mode", m)}
                    style={{
                      border: "none",
                      background: filters.mode === m ? ACCENT : "transparent",
                      color: filters.mode === m ? WHITE : "rgba(3,4,94,0.6)",
                      padding: "5px 12px",
                      borderRadius: 50,
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all .2s"
                    }}
                  >
                    {m === "all" ? "All Mode" : m === "solo" ? "👤 Solo" : "👥 Team"}
                  </button>
                ))}
              </div>

              {/* Filters Toggle button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 50,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  border: showFilters ? "none" : `1.5px solid ${NAVY_MID}`,
                  background: showFilters ? NAVY : WHITE,
                  color: showFilters ? WHITE : NAVY,
                  transition: "all .2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                ⚙️ Filters {showFilters ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* Click-outside backdrop */}
          {showFilters && (
            <div onClick={() => setShowFilters(false)} style={{ position: "fixed", inset: 0, zIndex: 11 }} />
          )}

          {/* Extended Glassmorphic Filters Overlay */}
          {showFilters && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              zIndex: 12,
              background: "#ffffff",
              borderRadius: 20,
              boxShadow: "0 20px 48px rgba(3,4,94,0.12), 0 2px 10px rgba(0,0,0,0.06)",
              border: "1.5px solid rgba(3,4,94,0.07)",
              padding: "24px 28px 20px",
              animation: "slideDown .25s ease-out"
            }}>
              <div className="filter-panel-content" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.9fr 1.1fr", gap: 32 }}>
                
                {/* Domain Selector */}
                <div>
                  <div style={filterLabelStyle}>Tech Domain</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {uniqueDomains.map(d => {
                      const active = filters.domain === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setFilter("domain", d)}
                          style={{
                            ...whitePillStyle(active),
                            borderColor: active ? getDomainColor(d) : NAVY_MID,
                            background: active ? getDomainColor(d) : "#ffffff"
                          }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Entry fee type */}
                <div>
                  <div style={filterLabelStyle}>Entry Fee</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { val: "all", label: "All Sprints" },
                      { val: "free", label: "🎁 Free" },
                      { val: "paid", label: "💳 Paid" },
                    ].map(f => (
                      <button
                        key={f.val}
                        onClick={() => setFilter("feeType", f.val)}
                        style={whitePillStyle(filters.feeType === f.val)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prize range selector */}
                <div>
                  <div style={filters.prizeMax === 100000 ? filterLabelStyle : { ...filterLabelStyle, color: ACCENT, opacity: 1 }}>
                    Max Prize: <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800 }}>₹{filters.prizeMax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: NAVY_TEXT }}>₹0</span>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="5000"
                      value={filters.prizeMax}
                      onChange={e => setFilter("prizeMax", Number(e.target.value))}
                      style={{ flex: 1, accentColor: ACCENT, cursor: "pointer", height: 4 }}
                    />
                    <span style={{ fontSize: 11, color: NAVY_TEXT }}>₹100K</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CARDS GRID SECTION ── */}
      <section className="dot-bg" style={{ padding: "48px 5% 80px", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: NAVY_TEXT, fontWeight: 700 }}>
              HACKER ARENAS FOUND: <span style={{ color: NAVY, fontSize: 14 }}>{filteredHackathons.length}</span>
            </p>
            {filters.search || filters.status !== "all" || filters.mode !== "all" || filters.domain !== "All" || filters.feeType !== "all" || filters.prizeMax !== 100000 ? (
              <button
                onClick={() => setFilters({ search: "", status: "all", mode: "all", domain: "All", feeType: "all", prizeMax: 100000 })}
                style={{
                  border: "none",
                  background: "transparent",
                  color: ACCENT,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif"
                }}
              >
                Clear all filters
              </button>
            ) : null}
          </div>

          {filteredHackathons.length === 0 ? (
            <Fade delay={0.05}>
              <div style={{
                textAlign: "center",
                padding: "80px 40px",
                background: WHITE,
                borderRadius: 24,
                border: `1.5px solid ${NAVY_MID}`
              }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: OFF, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <IconSparkles />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: NAVY, marginBottom: 8 }}>No Hacker Arenas Match</h3>
                <p style={{ fontSize: 13.5, color: NAVY_TEXT, maxWidth: 360, margin: "0 auto" }}>
                  Try relaxing your search terms or filters to find standard hacker challenges.
                </p>
              </div>
            </Fade>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: 20
            }}>
              {filteredHackathons.map((h, i) => (
                <PublicHackathonExploreCard
                  key={h.id}
                  h={h}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
