import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock Data ──────────────────────────────────────────────
const mockHackathons = [
  {
    id: 1,
    name: "Smart India Hackathon 2025",
    domain: "AI/ML",
    status: "ongoing",
    mode: "team",
    prize: "₹1,00,000",
    fee: "Free",
    startDate: "2025-05-01",
    endDate: "2025-05-30",
    submissionDeadline: "2025-05-28",
    registrationDate: "2025-04-20",
    teamName: "NeuralNinjas",
    teamSize: 4,
    submitted: true,
    rank: null,
    score: null,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    accent: "#1e3a8a",
  },
  {
    id: 2,
    name: "HackWithInfy Spring Edition",
    domain: "Web Dev",
    mode: "team",
    status: "upcoming",
    prize: "₹50,000",
    fee: "₹199",
    startDate: "2025-06-10",
    endDate: "2025-06-25",
    submissionDeadline: "2025-06-23",
    registrationDate: "2025-05-15",
    teamName: "CodeStorm",
    teamSize: 3,
    submitted: false,
    rank: null,
    score: null,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80",
    accent: "#1d4ed8",
  },
  {
    id: 3,
    name: "CodeStorm 2024",
    domain: "Blockchain",
    mode: "solo",
    status: "completed",
    prize: "₹75,000",
    fee: "Free",
    startDate: "2024-11-01",
    endDate: "2024-11-20",
    submissionDeadline: "2024-11-18",
    registrationDate: "2024-10-25",
    teamName: null,
    teamSize: 1,
    submitted: true,
    rank: 3,
    score: 87,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    accent: "#1e40af",
  },
  {
    id: 4,
    name: "DevSprint National Challenge",
    domain: "IoT",
    mode: "team",
    status: "completed",
    prize: "₹30,000",
    fee: "₹99",
    startDate: "2024-09-05",
    endDate: "2024-09-20",
    submissionDeadline: "2024-09-18",
    registrationDate: "2024-08-28",
    teamName: "ByteBusters",
    teamSize: 5,
    submitted: true,
    rank: 7,
    score: 74,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    accent: "#1e3a8a",
  },
  {
    id: 5,
    name: "HackMDU Intra-University",
    domain: "FinTech",
    mode: "solo",
    status: "completed",
    prize: "₹15,000",
    fee: "Free",
    startDate: "2024-03-12",
    endDate: "2024-03-15",
    submissionDeadline: "2024-03-14",
    registrationDate: "2024-03-01",
    teamName: null,
    teamSize: 1,
    submitted: true,
    rank: 1,
    score: 95,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    accent: "#1d4ed8",
  },
  {
    id: 6,
    name: "CloudHack by AWS",
    domain: "Cloud",
    mode: "team",
    status: "upcoming",
    prize: "₹2,00,000",
    fee: "₹299",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    submissionDeadline: "2025-07-13",
    registrationDate: "2025-06-01",
    teamName: "CloudPunks",
    teamSize: 4,
    submitted: false,
    rank: null,
    score: null,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    accent: "#1e3a8a",
  },
];

const ALL_DOMAINS = ["All", "AI/ML", "Web Dev", "Blockchain", "IoT", "FinTech", "Cloud", "Cybersecurity", "Open Innovation"];

const statusConfig = {
  ongoing:   { label: "Ongoing",   bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
  upcoming:  { label: "Upcoming",  bg: "#dbeafe", color: "#1d4ed8", dot: "#1d4ed8" },
  completed: { label: "Completed", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ── SVG Icons ──────────────────────────────────────────────
const IconTrophy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M8 21h8"/><path d="M12 17v4"/>
    <path d="M6 3h12v8a6 6 0 0 1-12 0V3z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconUpload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconMedal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconBarChart = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconSolo = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLocation = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconRupee = () => (
  <span
    style={{
      fontSize: 15,
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    ₹
  </span>
);

// ── useInView hook ─────────────────────────────────────────
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
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)" : "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex", alignItems: "center", gap: 14,
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? "translateY(-4px) scale(1.02)" : "translateY(0)") : "translateY(28px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.4s cubic-bezier(.4,0,.2,1), background 0.3s, box-shadow 0.3s, border 0.3s`,
        boxShadow: hovered ? "0 12px 32px rgba(30,58,138,0.25)" : "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "default",
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 13,
        background: hovered ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg, #eff6ff, #dbeafe)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? "#fff" : "#1e3a8a", flexShrink: 0,
        transition: "background 0.3s, color 0.3s",
        animation: inView ? `statIconBounce 0.6s ease ${delay + 200}ms both` : "none",
      }}>{icon}</div>
      <div>
        <div style={{
          fontSize: 28, fontWeight: 800, lineHeight: 1,
          color: hovered ? "#fff" : "#1e3a8a",
          fontFamily: "'Nunito', sans-serif",
          transition: "color 0.3s",
          animation: inView ? `statNumPop 0.5s ease ${delay + 100}ms both` : "none",
        }}>{value}</div>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
          textTransform: "uppercase", marginTop: 3,
          color: hovered ? "rgba(255,255,255,0.75)" : "#94a3b8",
          transition: "color 0.3s",
        }}>{label}</div>
      </div>
    </div>
  );
}

// ── Hackathon Card ─────────────────────────────────────────
function HackathonCard({ h, index, onViewResult, onSubmission }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const st = statusConfig[h.status];
  const dl = daysLeft(h.submissionDeadline);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#ffffff",
        border: `1.5px solid ${hovered ? "#bfdbfe" : "#0f1f33"}`,
        borderRadius: 20,
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView
          ? (hovered ? "translateY(-6px)" : "translateY(0)")
          : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 90}ms, transform 0.4s cubic-bezier(.4,0,.2,1), border 0.3s, box-shadow 0.3s`,
        boxShadow: hovered
          ? "0 20px 50px rgba(30,58,138,0.18), 0 4px 16px rgba(30,58,138,0.1)"
          : "0 4px 16px rgba(0,0,0,0.07)",
        cursor: "pointer",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 170, overflow: "hidden" }}>
        <img
          src={h.image}
          alt={h.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
          }}
        />
        {/* Overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 60%)",
        }} />
        {/* Status badge on image */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 20,
          fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6,
          color: st.color,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: st.dot,
            boxShadow: h.status === "ongoing" ? `0 0 6px ${st.dot}` : "none",
            animation: h.status === "ongoing" ? "mhPulse 1.8s ease-in-out infinite" : "none",
          }} />
          {st.label}
        </div>
        {/* Domain badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(30,58,138,0.9)",
          backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 20,
          fontSize: 10.5, fontWeight: 600, color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>{h.domain}</div>
        {/* Prize on image bottom */}
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          padding: "5px 11px", borderRadius: 20,
          fontSize: 13, fontWeight: 800, color: "#1e3a8a",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <IconTrophy /> {h.prize}
        </div>
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        {/* Title + mode */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontWeight: 800, fontSize: 15, color: "#0f172a", lineHeight: 1.3,
            marginBottom: 5, fontFamily: "'Nunito', sans-serif",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{h.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, color: "#64748b", fontWeight: 500,
            }}>
              {h.mode === "solo" ? <IconSolo /> : <IconUsers />}
              {h.mode === "solo" ? "Solo" : `Team · ${h.teamName || ""}`}
              {h.mode === "team" && h.teamSize && (
                <span style={{
                  marginLeft: 2, fontSize: 10, background: "#f1f5f9",
                  padding: "1px 6px", borderRadius: 8, color: "#475569", fontWeight: 600,
                }}>{h.teamSize} members</span>
              )}
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: 11, color: "#64748b",
            }}>
              <IconRupee /> Fee: <strong style={{ color: h.fee === "Free" ? "#16a34a" : "#1e3a8a" }}>{h.fee}</strong>
            </span>
          </div>
        </div>

        {/* Info row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 8, marginBottom: 12,
        }}>
          {[
            { icon: <IconCalendar />, label: "Registered", value: formatDate(h.registrationDate) },
            { icon: <IconClock />,    label: "Ends",        value: formatDate(h.endDate) },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#f8fafc", borderRadius: 10, padding: "8px 10px",
              border: "1px solid #e2e8f0",
            }}>
              <span style={{ color: "#1e3a8a", opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.7, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 11.5, color: "#334155", fontWeight: 600, marginTop: 1 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Result row (completed) */}
        {h.status === "completed" && h.rank && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            borderRadius: 12, padding: "10px 14px", marginBottom: 12,
            border: "1px solid #bfdbfe",
          }}>
            <span style={{ color: "#f59e0b" }}><IconMedal /></span>
            <div>
              <div style={{ fontSize: 9.5, color: "#64748b", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Final Result</div>
              <div style={{ fontSize: 13.5, color: "#1e3a8a", fontWeight: 800 }}>Rank #{h.rank}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 9.5, color: "#64748b", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Score</div>
              <div style={{ fontSize: 13.5, color: "#1d4ed8", fontWeight: 800 }}>{h.score}/100</div>
            </div>
          </div>
        )}

        {/* Deadline info */}
        {h.status === "ongoing" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#fefce8", border: "1px solid #fde68a",
            borderRadius: 10, padding: "7px 12px", marginBottom: 12,
            fontSize: 11.5, color: "#92400e", fontWeight: 600,
          }}>
            <IconClock /> Submission deadline in {dl} days
          </div>
        )}

        {/* Footer: submission status + action */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>

          {/* Submission Status — clickable */}
          <button
            onClick={() => onSubmission(h)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 20, border: "none",
              cursor: "pointer",
              background: h.submitted ? "#dcfce7" : "#fef2f2",
              color: h.submitted ? "#16a34a" : "#dc2626",
              fontSize: 11.5, fontWeight: 700,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            title="Go to My Submissions"
          >
            {h.submitted
              ? <><IconCheck /> Submitted</>
              : <><IconUpload /> Not Submitted</>
            }
          </button>

          {/* Action button */}
          {h.status === "ongoing" && !h.submitted && (
            <button
              onClick={() => onSubmission(h)}
              style={{
                background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
                border: "none", borderRadius: 12,
                padding: "8px 18px", color: "#fff",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 14px rgba(30,58,138,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,58,138,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,58,138,0.3)"; }}
            >
              <IconUpload /> Submit Now
            </button>
          )}

          {h.status === "upcoming" && (
            <span style={{
              fontSize: 11.5, color: "#1d4ed8", fontWeight: 700,
              background: "#dbeafe", padding: "6px 12px", borderRadius: 20,
            }}>
              Starts in {daysLeft(h.startDate)}d
            </span>
          )}

          {h.status === "completed" && (
            <button
              onClick={() => onViewResult(h)}
              style={{
                background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
                border: "none", borderRadius: 12,
                padding: "8px 18px", color: "#fff",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 14px rgba(30,58,138,0.25)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,58,138,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,58,138,0.25)"; }}
            >
              <IconTrophy /> View Result
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function MyHackathons() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("All");
  const [headerRef, headerInView] = useInView();
  const navigate = useNavigate();

  const filtered = mockHackathons.filter(h => {
    const matchStatus = statusFilter === "all" || h.status === statusFilter;
    const matchDomain = domainFilter === "All" || h.domain === domainFilter;
    return matchStatus && matchDomain;
  });

  const stats = {
    total: mockHackathons.length,
    ongoing: mockHackathons.filter(h => h.status === "ongoing").length,
    completed: mockHackathons.filter(h => h.status === "completed").length,
    bestRank: Math.min(...mockHackathons.filter(h => h.rank).map(h => h.rank)),
  };

  const statusFilters = [
    { key: "all",       label: "All",       count: mockHackathons.length },
    { key: "ongoing",   label: "Ongoing",   count: stats.ongoing },
    { key: "upcoming",  label: "Upcoming",  count: mockHackathons.filter(h => h.status === "upcoming").length },
    { key: "completed", label: "Completed", count: stats.completed },
  ];

  const handleViewResult = (h) => {
    navigate("/my-results", { state: { hackathon: h } });
  };

  const handleSubmission = (h) => {
    navigate("/my-submissions", { state: { hackathon: h } });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Poppins', sans-serif",
      padding: "36px 32px 72px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes mhPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes statIconBounce { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes statNumPop { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        .domain-chip:hover { background: #1e3a8a !important; color: #fff !important; border-color: #1e3a8a !important; }

        @media (max-width: 768px) {
  .hackathon-header {
    text-align: center;
    justify-content: center;
  }
}
      `}</style>

      {/* ── Page Header ── */}
      <div
        ref={headerRef}
        style={{
          marginBottom: 32,
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        
        <div   className="hackathon-header" style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div>
            
            <h1 style={{
              margin: 0,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 32,
              color: "#03045E",
              lineHeight: 1.1,
              letterSpacing: -0.5,
            }}>
              My Hackathons
            </h1>
            <p style={{
              margin: "5px 0 0",
              fontSize: 13,
              color: "#94a3b8",
              fontWeight: 500,
            }}>
              Track your complete hackathon journey
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 14, marginBottom: 32,
      }}>
        <StatCard icon={<IconBolt />}     value={stats.total}          label="Total Joined"  delay={0}   />
        <StatCard icon={<IconStar />}     value={stats.ongoing}        label="Ongoing"       delay={80}  />
        <StatCard icon={<IconCheck />}    value={stats.completed}      label="Completed"     delay={160} />
        <StatCard icon={<IconTrophy />}   value={`#${stats.bestRank}`} label="Best Rank"     delay={240} />
      </div>

      {/* ── Status Filter Tabs ── */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginRight: 4 }}>Status:</span>
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            style={{
              padding: "7px 16px", borderRadius: 20, cursor: "pointer",
              fontSize: 12, fontWeight: 600, border: "1.5px solid",
              transition: "all 0.25s",
              background: statusFilter === f.key ? "linear-gradient(135deg, #03045E, #03045e)" : "#fff",
              borderColor: statusFilter === f.key ? "#03045E" : "#e2e8f0",
              color: statusFilter === f.key ? "#fff" : "#64748b",
              boxShadow: statusFilter === f.key ? "0 4px 14px rgba(30,58,138,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
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

      {/* ── Domain Filter Chips ── */}
      <div style={{
        display: "flex", gap: 7, marginBottom: 28, flexWrap: "wrap",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginRight: 4 }}>Domain:</span>
        {ALL_DOMAINS.map(d => (
          <button
            key={d}
            className="domain-chip"
            onClick={() => setDomainFilter(d)}
            style={{
              padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              fontSize: 11.5, fontWeight: 600, border: "1.5px solid",
              transition: "all 0.22s",
              background: domainFilter === d ? "#03045E" : "#fff",
              borderColor: domainFilter === d ? "#03045E" : "#e2e8f0",
              color: domainFilter === d ? "#fff" : "#475569",
              boxShadow: domainFilter === d ? "0 3px 10px rgba(30,58,138,0.25)" : "none",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          color: "#94a3b8", background: "#fff",
          borderRadius: 20, border: "1.5px dashed #e2e8f0",
        }}>
          <div style={{ marginBottom: 12 }}><IconBarChart /></div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#64748b" }}>No hackathons found</p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Try changing your filters</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {filtered.map((h, i) => (
            <HackathonCard
              key={h.id}
              h={h}
              index={i}
              onViewResult={handleViewResult}
              onSubmission={handleSubmission}
            />
          ))}
        </div>
      )}
    </div>
  );
}