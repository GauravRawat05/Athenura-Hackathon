import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hackathonService } from "../../services/hackathonService";

// ── Icons ──────────────────────────────────────────────────
const IconTrophy = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M6 3h12v8a6 6 0 0 1-12 0V3z"/></svg>);
const IconCalendar = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconUsers = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconBolt = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const IconClock = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconStar = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const IconCheck = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconBarChart = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IconSolo = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconSearch = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);

const ALL_DOMAINS = ["All", "AI/ML", "Web Dev", "Blockchain", "IoT", "FinTech", "Cloud", "Cybersecurity", "Open Innovation"];

const statusConfig = {
  ongoing:   { label: "Ongoing",   bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
  upcoming:  { label: "Upcoming",  bg: "#dbeafe", color: "#1d4ed8", dot: "#1d4ed8" },
  completed: { label: "Completed", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ── useInView ──────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.08, ...options });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon, value, label, delay }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "linear-gradient(135deg,#1e3a8a,#1d4ed8)" : "#fff",
        border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 22px",
        display: "flex", alignItems: "center", gap: 14,
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? "translateY(-4px) scale(1.02)" : "translateY(0)") : "translateY(28px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.4s cubic-bezier(.4,0,.2,1), background 0.3s, box-shadow 0.3s`,
        boxShadow: hovered ? "0 12px 32px rgba(30,58,138,0.25)" : "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "default",
      }}>
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: hovered ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg,#eff6ff,#dbeafe)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? "#fff" : "#1e3a8a", flexShrink: 0,
        transition: "background 0.3s, color 0.3s",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: hovered ? "#fff" : "#1e3a8a", fontFamily: "'Nunito',sans-serif", transition: "color 0.3s" }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 4, color: hovered ? "rgba(255,255,255,0.75)" : "#94a3b8", transition: "color 0.3s" }}>{label}</div>
      </div>
    </div>
  );
}

// ── Hackathon Explore Card ─────────────────────────────────
function HackathonExploreCard({ h, index, isRegistered }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  
  const st = statusConfig[h.status] || statusConfig.upcoming;
  const dl = daysLeft(h.registrationDeadline);
  const isPastDeadline = new Date(h.registrationDeadline) < new Date();

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
            fontWeight: 800, fontSize: 16, color: "#0f172a", lineHeight: 1.3,
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
          {isRegistered ? (
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "6px 12px", borderRadius: 10,
                background: "#dcfce7", color: "#16a34a",
                fontSize: 11, fontWeight: 700,
              }}><IconCheck /> Registered</div>
              <button
                onClick={() => navigate("/my-hackathons")}
                style={{
                  background: "#f1f5f9", border: "1px solid #cbd5e1",
                  borderRadius: 10, padding: "6px 12px", color: "#475569",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Poppins',sans-serif", transition: "background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}
              >Workspace</button>
            </div>
          ) : isPastDeadline ? (
            <button disabled style={{
              background: "#e2e8f0", border: "none", borderRadius: 10,
              padding: "7px 16px", color: "#94a3b8", fontSize: 11,
              fontWeight: 600, cursor: "not-allowed", fontFamily: "'Poppins',sans-serif",
            }}>Registration Closed</button>
          ) : (
            <button
              onClick={() => navigate(`/hackathon/${h.id}`)}
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

// ── Main Component ─────────────────────────────────────────
export default function ExploreHackathons() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [hackathonsList, setHackathonsList] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch all hackathons
        const allRes = await hackathonService.getAllHackathons();
        const rawHacks = allRes?.data?.data || [];

        // Fetch my registrations
        const regRes = await hackathonService.getMyRegistrations();
        const regs = regRes?.data?.data || [];
        const regIds = new Set(regs.map(r => r.hackathonId?._id || r.hackathonId));

        const mapped = rawHacks.map(hack => {
          const statusMap = { upcoming: 'upcoming', ongoing: 'ongoing', past: 'completed', judging: 'completed', draft: 'upcoming' };
          const status = statusMap[hack.status] || 'upcoming';
          const prize = hack.prizePool != null ? `${hack.currency === 'INR' ? '₹' : '$'}${Number(hack.prizePool).toLocaleString('en-IN')}` : '₹0';
          const fee = hack.registrationFee === 0 ? 'Free' : `${hack.currency === 'INR' ? '₹' : '$'}${Number(hack.registrationFee).toLocaleString('en-IN')}`;
          
          return {
            id: hack._id,
            title: hack.title,
            domain: (hack.technologyDomains && hack.technologyDomains[0]) || 'General',
            status,
            minTeamSize: hack.minTeamSize || 2,
            maxTeamSize: hack.maxTeamSize || 4,
            mode: hack.allowedModes?.[0]?.toLowerCase() || 'team',
            prize,
            fee,
            feeNum: hack.registrationFee || 0,
            prizeNum: hack.prizePool || 0,
            startDate: hack.startDate,
            endDate: hack.endDate,
            registrationDeadline: hack.registrationDeadline || hack.startDate,
            image: hack.bannerUrl || `https://picsum.photos/seed/${hack._id}/800/400`,
            technologyDomains: hack.technologyDomains || [],
          };
        });

        if (mounted) {
          setHackathonsList(mapped);
          setRegisteredIds(regIds);
        }
      } catch (err) {
        
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Filter computations
  const filtered = hackathonsList.filter(h => {
    const matchStatus = statusFilter === "all" || h.status === statusFilter;
    const matchDomain = domainFilter === "All" || h.domain === domainFilter;
    const matchSearch = searchQuery.trim() === "" || 
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.technologyDomains.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchStatus && matchDomain && matchSearch;
  });

  // Dynamic statistics
  const stats = {
    totalActive: hackathonsList.filter(h => h.status !== 'completed').length,
    joinedCount: registeredIds.size,
    totalPrizePool: (() => {
      const sum = hackathonsList.filter(h => h.status !== 'completed').reduce((acc, curr) => acc + curr.prizeNum, 0);
      return `₹${sum.toLocaleString('en-IN')}`;
    })(),
    freeOpportunities: hackathonsList.filter(h => h.status !== 'completed' && h.feeNum === 0).length,
  };

  const statusFilters = [
    { key: "all",      label: "All",      count: hackathonsList.length },
    { key: "ongoing",  label: "Ongoing",  count: hackathonsList.filter(h => h.status === "ongoing").length },
    { key: "upcoming", label: "Upcoming", count: hackathonsList.filter(h => h.status === "upcoming").length },
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Poppins',sans-serif",
        padding: "36px 32px 72px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          border: "4px solid rgba(3, 4, 94, 0.1)",
          borderTopColor: "#03045E",
          borderRadius: "50%",
          animation: "mhSpin 1s linear infinite",
          marginBottom: "20px"
        }} />
        <h3 style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "#03045E", letterSpacing: -0.2 }}>
          Finding Hackathons...
        </h3>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
          Retrieving live hackathons and active challenges from our databases
        </p>
        <style>{`
          @keyframes mhSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Poppins',sans-serif", padding: "36px 32px 72px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes mhPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes mhSlideUp { from{opacity:0;transform:translateY(32px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        .domain-chip:hover { background: #1e3a8a !important; color: #fff !important; border-color: #1e3a8a !important; }
        @media (max-width: 768px) { .explore-header { text-align:center; justify-content:center; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="explore-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: "#03045E", lineHeight: 1.1, letterSpacing: -0.5 }}>
              Explore Hackathons
            </h1>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
              Discover exciting hackathons, register teams, and win prizes!
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: "relative", minWidth: 260 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex", alignItems: "center" }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search hackathons..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px 10px 38px",
                borderRadius: 12, outline: "none", border: "1.5px solid #e2e8f0",
                background: "#fff", fontSize: 13.5, color: "#1e293b",
                fontFamily: "'Poppins',sans-serif", boxSizing: "border-box",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "#1d4ed8"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 32 }}>
        <StatCard icon={<IconBolt />}   value={stats.totalActive}        label="Active Events" delay={0}   />
        <StatCard icon={<IconCheck />}  value={stats.joinedCount}        label="My Registrations" delay={80}  />
        <StatCard icon={<IconTrophy />} value={stats.totalPrizePool}      label="Active Prize Pool" delay={160} />
        <StatCard icon={<IconStar />}   value={stats.freeOpportunities}  label="Free Challenges" delay={240} />
      </div>

      {/* Filters Row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginRight: 4 }}>Status:</span>
        {statusFilters.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: "7px 16px", borderRadius: 20, cursor: "pointer",
            fontSize: 12, fontWeight: 600, border: "1.5px solid",
            transition: "all 0.25s",
            background: statusFilter === f.key ? "linear-gradient(135deg,#03045E,#03045e)" : "#fff",
            borderColor: statusFilter === f.key ? "#03045E" : "#e2e8f0",
            color: statusFilter === f.key ? "#fff" : "#64748b",
            boxShadow: statusFilter === f.key ? "0 4px 14px rgba(30,58,138,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            {f.label}
            <span style={{
              marginLeft: 6, fontSize: 10, fontWeight: 700,
              background: statusFilter === f.key ? "rgba(255,255,255,0.2)" : "#f1f5f9",
              color: statusFilter === f.key ? "#fff" : "#94a3b8",
              padding: "1px 6px", borderRadius: 10,
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Domain Filters */}
      <div style={{ display: "flex", gap: 7, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginRight: 4 }}>Domain:</span>
        {ALL_DOMAINS.map(d => (
          <button key={d} className="domain-chip" onClick={() => setDomainFilter(d)} style={{
            padding: "6px 14px", borderRadius: 20, cursor: "pointer",
            fontSize: 11.5, fontWeight: 600, border: "1.5px solid",
            transition: "all 0.22s",
            background: domainFilter === d ? "#03045E" : "#fff",
            borderColor: domainFilter === d ? "#03045E" : "#e2e8f0",
            color: domainFilter === d ? "#fff" : "#475569",
          }}>{d}</button>
        ))}
      </div>

      {/* Cards list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8", background: "#fff", borderRadius: 20, border: "1.5px dashed #e2e8f0" }}>
          <div style={{ marginBottom: 12 }}><IconBarChart /></div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#64748b" }}>No hackathons found</p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Try changing your search query or filters</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
          {filtered.map((h, i) => (
            <HackathonExploreCard
              key={h.id}
              h={h}
              index={i}
              isRegistered={registeredIds.has(h.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
