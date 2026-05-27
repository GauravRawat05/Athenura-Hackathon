import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hackathonService } from "../../services/hackathonService";
import { userService } from "../../services/userService";

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
    submitted: false,
    rank: null,
    score: null,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
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
  },
];

const ALL_DOMAINS = ["All","AI/ML","Web Dev","Blockchain","IoT","FinTech","Cloud","Cybersecurity","Open Innovation"];

const statusConfig = {
  ongoing:   { label: "Ongoing",   bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
  upcoming:  { label: "Upcoming",  bg: "#dbeafe", color: "#1d4ed8", dot: "#1d4ed8" },
  completed: { label: "Completed", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
};

const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ── Icons ──────────────────────────────────────────────────
const IconTrophy = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M6 3h12v8a6 6 0 0 1-12 0V3z"/></svg>);
const IconCalendar = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconUsers = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconBolt = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const IconClock = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconStar = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const IconUpload = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);
const IconCheck = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IconMedal = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>);
const IconBarChart = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IconSolo = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconClose = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconGithub = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>);
const IconLink = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const IconVideo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>);
const IconNotes = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>);
const IconSuccess = () => (<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);

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
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: hovered ? "#fff" : "#1e3a8a", fontFamily: "'Nunito',sans-serif", transition: "color 0.3s" }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 3, color: hovered ? "rgba(255,255,255,0.75)" : "#94a3b8", transition: "color 0.3s" }}>{label}</div>
      </div>
    </div>
  );
}

// ── Submission Modal ───────────────────────────────────────
function SubmissionModal({ hackathon, onClose, onSubmitted }) {
  const [form, setForm] = useState({ title: "", description: "", github: "", demo: "", video: "", notes: "" });
  const [submissionId, setSubmissionId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Lock body scroll and load existing submission details if any
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    let mounted = true;
    const hid = hackathon.hackathonId || hackathon.id;
    
    if (hackathon.submitted) {
      (async () => {
        try {
          const res = await hackathonService.getMySubmission(hid);
          if (res.data?.data && mounted) {
            const s = res.data.data;
            setForm({
              title: s.title || "",
              description: s.description || "",
              github: s.repoUrl || "",
              demo: s.demoUrl || "",
              video: s.videoUrl || "",
              notes: (s.techStack && s.techStack[0]) || ""
            });
            setSubmissionId(s._id);
          }
        } catch (err) {
          
        }
      })();
    }

    return () => {
      document.body.style.overflow = "";
      mounted = false;
    };
  }, [hackathon]);

  const validate = () => {
    const e = {};
    if (!form.title || !form.title.trim()) e.title = "Project title is required";
    if (!form.description || !form.description.trim()) e.description = "Project description is required";
    if (!form.github.trim()) e.github = "GitHub repo link is required";
    else if (!form.github.startsWith("http")) e.github = "Enter a valid URL";
    if (form.demo && !form.demo.startsWith("http")) e.demo = "Enter a valid URL";
    if (form.video && !form.video.startsWith("http")) e.video = "Enter a valid URL";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        repoUrl: form.github,
        demoUrl: form.demo,
        techStack: form.notes ? [form.notes] : [],
      };
      const hid = hackathon.hackathonId || hackathon.id;
      if (submissionId) {
        await hackathonService.updateSubmission(submissionId, payload);
      } else {
        await hackathonService.createSubmission(hid, payload);
      }
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onSubmitted(hackathon.id || hid);
        onClose();
      }, 1400);
    } catch (err) {
      setSubmitting(false);
      const msg = err?.response?.data?.message || err.message || "Submission failed";
      setErrors(p => ({ ...p, submit: msg }));
    }
  };

  const fields = [
    { key: "github", icon: <IconGithub />, label: "GitHub Repository *", placeholder: "https://github.com/your-repo", required: true },
    { key: "demo",   icon: <IconLink />,   label: "Live Demo URL",        placeholder: "https://your-demo.vercel.app" },
    { key: "video",  icon: <IconVideo />,  label: "Video Demo URL",       placeholder: "https://youtube.com/watch?v=..." },
  ];

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(3,4,30,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "16px",
        animation: "mhFadeIn 0.25s ease",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 24,
        width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(3,4,94,0.28)",
        animation: "mhSlideUp 0.35s cubic-bezier(.34,1.56,.64,1)",
        position: "relative",
      }}>

        {/* Success State */}
        {success ? (
          <div style={{ padding: "52px 32px", textAlign: "center" }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
              border: "2px solid #86efac",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", color: "#16a34a",
              animation: "mhSuccessPop 0.5s cubic-bezier(.34,1.56,.64,1)",
            }}>
              <IconSuccess />
            </div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 900, color: "#03045e", marginBottom: 8 }}>
              Submitted Successfully! 
            </div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
              Your project for <strong>{hackathon.name}</strong> has been submitted. Good luck!
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg,#03045e,#1d4ed8)",
              borderRadius: "24px 24px 0 0",
              padding: "24px 28px 22px",
              position: "relative",
            }}>
              <button onClick={onClose} style={{
                position: "absolute", top: 16, right: 16,
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", border: "none",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.transform = "rotate(90deg)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "rotate(0)"; }}
              ><IconClose /></button>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 13,
                  background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                }}><IconUpload /></div>
                <div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>
                    Submit Project
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(144,224,239,0.85)", marginTop: 2, fontWeight: 500 }}>
                    {hackathon.name}
                  </div>
                </div>
              </div>

              {/* Deadline chip */}
              <div style={{
                marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20, padding: "5px 12px",
                fontSize: 11.5, color: "rgba(255,255,255,0.85)", fontWeight: 600,
              }}>
                <IconClock /> Deadline: {formatDate(hackathon.submissionDeadline)} · {daysLeft(hackathon.submissionDeadline)}d left
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: "24px 28px 28px" }}>

              {/* Link fields */}
              {/* Project Title */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 11, fontWeight: 700, color: "#64748b",
                  letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 7,
                }}>
                  Project Title *
                </label>
                <input
                  value={form.title}
                  onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setErrors(p => ({ ...p, title: "" })); }}
                  placeholder="My Awesome Project"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 11, outline: "none", border: `1.5px solid ${errors.title ? "#fca5a5" : "#e2e8f0"}`, background: errors.title ? "#fef2f2" : "#f8fafc", fontSize: 13, color: "#1e293b", fontFamily: "'Poppins',sans-serif", transition: "border 0.2s, box-shadow 0.2s", boxSizing: "border-box" }}
                />
                {errors.title && (<div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 5, fontWeight: 500 }}>⚠ {errors.title}</div>)}
              </div>

              {/* Project Description */}
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 11, fontWeight: 700, color: "#64748b",
                  letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 7,
                }}>
                  Project Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={e => { setForm(p => ({ ...p, description: e.target.value })); setErrors(p => ({ ...p, description: "" })); }}
                  placeholder="Describe your project, key features..."
                  rows={4}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 11, outline: "none", border: `1.5px solid ${errors.description ? "#fca5a5" : "#e2e8f0"}`, background: errors.description ? "#fef2f2" : "#f8fafc", fontSize: 13, color: "#1e293b", fontFamily: "'Poppins',sans-serif", resize: "vertical", lineHeight: 1.6, transition: "border 0.2s, box-shadow 0.2s", boxSizing: "border-box" }}
                />
                {errors.description && (<div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 5, fontWeight: 500 }}>⚠ {errors.description}</div>)}
              </div>

              {fields.map(f => (
                <div key={f.key} style={{ marginBottom: 18 }}>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 11, fontWeight: 700, color: "#64748b",
                    letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 7,
                  }}>
                    <span style={{ color: "#03045e" }}>{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    value={form[f.key]}
                    onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setErrors(p => ({ ...p, [f.key]: "" })); }}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", padding: "11px 14px",
                      borderRadius: 11, outline: "none",
                      border: `1.5px solid ${errors[f.key] ? "#fca5a5" : "#e2e8f0"}`,
                      background: errors[f.key] ? "#fef2f2" : "#f8fafc",
                      fontSize: 13, color: "#1e293b",
                      fontFamily: "'Poppins',sans-serif",
                      transition: "border 0.2s, box-shadow 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#1d4ed8"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = errors[f.key] ? "#fca5a5" : "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = errors[f.key] ? "#fef2f2" : "#f8fafc"; }}
                  />
                  {errors[f.key] && (
                    <div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 5, fontWeight: 500 }}>
                      ⚠ {errors[f.key]}
                    </div>
                  )}
                </div>
              ))}

              {/* Notes */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 11, fontWeight: 700, color: "#64748b",
                  letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 7,
                }}>
                  <span style={{ color: "#03045e" }}><IconNotes /></span>
                  Additional Notes for Judges
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Describe your project, tech stack used, key features, challenges faced..."
                  rows={4}
                  style={{
                    width: "100%", padding: "11px 14px",
                    borderRadius: 11, outline: "none",
                    border: "1.5px solid #e2e8f0",
                    background: "#f8fafc",
                    fontSize: 13, color: "#1e293b",
                    fontFamily: "'Poppins',sans-serif",
                    resize: "vertical", lineHeight: 1.6,
                    transition: "border 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#1d4ed8"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: "12px", borderRadius: 12,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  color: "#64748b", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#03045e"; e.currentTarget.style.color = "#03045e"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
                >
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting} style={{
                  flex: 2, padding: "12px",
                  borderRadius: 12, border: "none",
                  background: submitting ? "#94a3b8" : "linear-gradient(135deg,#03045e,#1d4ed8)",
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "'Poppins',sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: submitting ? "none" : "0 4px 16px rgba(3,4,94,0.3)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(3,4,94,0.4)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(3,4,94,0.3)"; }}
                >
                  {submitting ? (
                    <>
                      <div style={{
                        width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff", borderRadius: "50%",
                        animation: "mhSpin 0.7s linear infinite",
                      }} />
                      Submitting...
                    </>
                  ) : (
                    <><IconUpload /> Submit Project</>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Result Modal ───────────────────────────────────────────
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
    idle:    { bg: "#03045e", text: "Download Certificate", icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, hover: "#0077b6" },
    loading: { bg: "#0077b6", text: "Preparing...",         icon: null,               hover: "#0077b6" },
    done:    { bg: "#0096c7", text: "Downloaded!",          icon: <IconCheck />,    hover: "#0096c7" },
  };
  const cfg = configs[dlState];
  return (
    <button
      onClick={handleClick}
      style={{
        marginTop: 8,
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
          <span style={{ display: "inline-block", animation: "mhSpin 0.8s linear infinite", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}>
          </span>
          &nbsp;&nbsp;{cfg.text}
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

function ResultModal({ hackathon, onClose }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await userService.getMyResults();
        const responseData = res?.data;
        const data = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        
        // Find matching result
        const normalized = data.map(r => {
          const isWinner = r.isWinner || r.status === "Winner";
          const rank = r.rank ?? null;
          const score = r.score ?? r.totalScore ?? 0;
          const criteria = r.criteria || [{ name: "Final Score", score, weight: 100, maxScore: 100 }];
          return {
            id: r._id || r.id,
            hackathonId: r.hackathonId?._id || r.hackathonId,
            hackathon: r.hackathonId?.title || r.hackathon || "Untitled Hackathon",
            domain: r.awardCategory || r.domain || "General",
            mode: r.teamId ? "Team" : r.mode || "Solo",
            teamName: r.teamId?.name || r.teamName || null,
            submittedAt: r.date ? new Date(r.date).toLocaleString() : r.submittedAt || "Unknown date",
            rank,
            totalParticipants: r.totalParticipants || "-",
            status: r.status || (isWinner ? "Winner" : rank ? "Ranked" : "Participated"),
            totalScore: score,
            cardTheme: r.cardTheme || (isWinner ? "light" : "default"),
            criteria,
            judgeComment: r.judgeComment || r.feedback || r.award || "Judge feedback not available.",
            prize: r.prize || r.award || r.awardCategory || null,
            certificateReady: r.certificateStatus === "completed" || r.certificateReady || false,
          };
        });

        const found = normalized.find(r => 
          (r.id === hackathon.id || r.id === hackathon.hackathonId || r.hackathonId === hackathon.id || r.hackathonId === hackathon.hackathonId) ||
          (r.hackathon.toLowerCase().trim() === hackathon.name.toLowerCase().trim())
        );

        if (mounted) {
          if (found) {
            setResult(found);
          } else {
            if (hackathon.rank || hackathon.score) {
              setResult({
                id: hackathon.id,
                hackathon: hackathon.name,
                domain: hackathon.domain,
                mode: hackathon.mode === "team" ? "Team" : "Solo",
                teamName: hackathon.teamName,
                submittedAt: formatDate(hackathon.registrationDate),
                rank: hackathon.rank,
                totalParticipants: "N/A",
                status: hackathon.rank === 1 ? "Winner" : hackathon.rank ? "Ranked" : "Participated",
                totalScore: hackathon.score || 0,
                cardTheme: hackathon.rank === 1 ? "light" : "default",
                criteria: [{ name: "Final Score", score: hackathon.score || 0, weight: 100, maxScore: 100 }],
                judgeComment: "Excellent work! Your contribution is highly appreciated.",
                prize: hackathon.prize || null,
                certificateReady: true,
              });
            } else {
              setError("Result details not available yet.");
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || err.message || "Failed to load result.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [hackathon]);

  const sc = result ? (result.status === "Winner" ? { color: "#0077b6", bg: "#e8f4fd", border: "#90cdf4" } : result.status === "Ranked" ? { color: "#0096c7", bg: "#e0f4ff", border: "#7dd3f0" } : { color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db" }) : null;
  const isWinner = result?.status === "Winner";
  
  const tc = result ? (result.cardTheme === "light" ? {
    border: "#7dd3f0",
    ribbon: "linear-gradient(90deg,#0096c7,#48cae4)",
    scoreBg: "linear-gradient(135deg,#0096c7,#48cae4)",
    scoreShadow: "0 4px 14px rgba(0,150,199,0.35)",
    barColor: "#0096c7",
    accentColor: "#0096c7",
    feedbackBg: "linear-gradient(120deg,#e0f4ff,#caf0f8)",
    feedbackBorder: "#0096c7",
  } : result.cardTheme === "dark" ? {
    border: "#03045e",
    ribbon: "linear-gradient(90deg,#023e8a,#03045e)",
    scoreBg: "linear-gradient(135deg,#023e8a,#03045e)",
    scoreShadow: "0 4px 14px rgba(2,62,138,0.4)",
    barColor: "#023e8a",
    accentColor: "#023e8a",
    feedbackBg: "linear-gradient(120deg,#eef0f8,#dbe4f5)",
    feedbackBorder: "#023e8a",
  } : {
    border: "#90cdf4",
    ribbon: "linear-gradient(90deg,#03045e,#0077b6)",
    scoreBg: "linear-gradient(135deg,#03045e,#0077b6)",
    scoreShadow: "0 4px 14px rgba(3,4,94,0.28)",
    barColor: "#0077b6",
    accentColor: "#0077b6",
    feedbackBg: "linear-gradient(120deg,#eef0f8,#e8f4fd)",
    feedbackBorder: "#0077b6",
  }) : null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.45)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "mhFadeIn 0.3s ease-out",
    }}>
      <div style={{
        background: "#fff", width: "100%", maxWidth: 640,
        borderRadius: 24, overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.8)",
        animation: "mhSlideUp 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        position: "relative",
      }}>
        {/* Header Gradient */}
        <div style={{
          background: isWinner ? (tc?.ribbon || "linear-gradient(90deg,#0096c7,#48cae4)") : "linear-gradient(135deg,#03045e,#1d4ed8)",
          padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
          color: "#fff", position: "relative",
        }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: -0.3 }}>
              Hackathon Performance
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.85, fontWeight: 500 }}>
              {hackathon.name}
            </p>
          </div>
          <button onClick={onClose} style={{
            position: "absolute", top: 22, right: 22,
            background: "rgba(255,255,255,0.15)", border: "none",
            borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <IconClose />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "28px", maxHeight: "calc(85vh - 120px)", overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 42, height: 42, border: "3.5px solid rgba(3, 4, 94, 0.1)",
                borderTopColor: "#03045E", borderRadius: "50%",
                animation: "mhSpin 0.9s linear infinite", margin: "0 auto 16px",
              }} />
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: "#03045E", fontSize: 16 }}>Loading performance details...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: "#03045E", fontSize: 16, marginBottom: 6 }}>{error}</div>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>The detailed scorecard will be updated as soon as the evaluation is complete.</p>
            </div>
          ) : result ? (
            <div>
              {/* Top Summary */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24, borderBottom: "1.5px solid #f1f5f9", paddingBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 800, fontFamily: "Nunito,sans-serif",
                      padding: "2px 10px", borderRadius: 20,
                      color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                    }}>{result.status}</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      {result.domain} · {result.mode}
                    </span>
                  </div>
                  {result.teamName && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#475569", fontWeight: 500 }}>
                      <IconUsers /> Team: <strong style={{ color: "#0f172a" }}>{result.teamName}</strong>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 24, color: "#03045e", lineHeight: 1 }}>
                      {result.rank === 1 ? "🥇 1st" : result.rank === 2 ? "🥈 2nd" : result.rank === 3 ? "🥉 3rd" : `#${result.rank}`}
                    </div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontWeight: 600 }}>
                      Rank out of {result.totalParticipants}
                    </div>
                  </div>
                  <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: tc.scoreBg,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    boxShadow: tc.scoreShadow,
                  }}>
                    <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, fontSize: 16, color: "#fff", lineHeight: 1 }}>
                      {result.totalScore}
                    </span>
                    <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.75)" }}>/ 100</span>
                  </div>
                </div>
              </div>

              {/* Prize & Certificate chips */}
              {(result.prize || result.certificateReady) && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                  {result.prize && (
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 12, fontFamily: "Nunito,sans-serif", fontWeight: 800,
                      color: tc.accentColor, background: "#eff6ff",
                      padding: "6px 14px", borderRadius: 20, border: "1px dashed #bfdbfe",
                    }}>
                      🏆 Prize Winner: {result.prize}
                    </span>
                  )}
                  {result.certificateReady && (
                    <span style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 12, fontWeight: 600,
                      color: "#16a34a", background: "#f0fdf4",
                      padding: "6px 14px", borderRadius: 20, border: "1px dashed #bbf7d0",
                    }}>
                      ✓ Performance Certificate Issued
                    </span>
                  )}
                </div>
              )}

              {/* Criteria details */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13.5, color: "#03045e", margin: "0 0 16px" }}>
                  Criteria Evaluation Breakdown
                </h4>
                {result.criteria.map((c, ci) => (
                  <div key={ci} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
                        {c.name}
                        <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: 4 }}>({c.weight}% weight)</span>
                      </span>
                      <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12.5, color: "#03045e" }}>
                        {c.score} / {c.maxScore}
                      </span>
                    </div>
                    {/* Score bar */}
                    <div style={{ background: "#eef2f6", borderRadius: 99, height: 6, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        background: tc.barColor,
                        width: `${c.score}%`,
                        boxShadow: `0 0 6px ${tc.barColor}44`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Judge Feedback */}
              <div style={{
                background: tc.feedbackBg,
                borderRadius: 16, padding: "16px 20px",
                borderLeft: `4px solid ${tc.feedbackBorder}`,
                marginBottom: 20,
              }}>
                <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12, color: tc.accentColor, marginBottom: 5 }}>
                  Evaluation Feedback & Suggestions
                </div>
                <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
                  "{result.judgeComment}"
                </p>
              </div>

              {/* Download Certificate */}
              {result.certificateReady && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                  <DownloadButton />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Hackathon Card ─────────────────────────────────────────
function HackathonCard({ h, index, onViewResult, onOpenSubmit }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const st = statusConfig[h.status];
  const dl = daysLeft(h.submissionDeadline);
  const isEnded = h.status === "completed" || (h.endDate && new Date(h.endDate) < new Date());

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#bfdbfe" : "#0f1f33"}`,
        borderRadius: 20, overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? "translateY(-6px)" : "translateY(0)") : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 90}ms, transform 0.4s cubic-bezier(.4,0,.2,1), border 0.3s, box-shadow 0.3s`,
        boxShadow: hovered ? "0 20px 50px rgba(30,58,138,0.18)" : "0 4px 16px rgba(0,0,0,0.07)",
        cursor: "pointer", fontFamily: "'Poppins',sans-serif",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 170, overflow: "hidden" }}>
        <img src={h.image} alt={h.name} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.55) 0%,transparent 60%)" }} />
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
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(30,58,138,0.9)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 20,
          fontSize: 10.5, fontWeight: 600, color: "#fff",
        }}>{h.domain}</div>
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

      <div style={{ padding: "16px 18px 18px" }}>
        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontWeight: 800, fontSize: 15, color: "#0f172a", lineHeight: 1.3,
            marginBottom: 5, fontFamily: "'Nunito',sans-serif",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{h.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
              {h.mode === "solo" ? <IconSolo /> : <IconUsers />}
              {h.mode === "solo" ? "Solo" : `Team · ${h.teamName || ""}`}
              {h.mode === "team" && h.teamSize && (
                <span style={{ marginLeft: 2, fontSize: 10, background: "#f1f5f9", padding: "1px 6px", borderRadius: 8, color: "#475569", fontWeight: 600 }}>{h.teamSize} members</span>
              )}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              Fee: <strong style={{ color: h.fee === "Free" ? "#16a34a" : "#1e3a8a" }}>{h.fee}</strong>
            </span>
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { icon: <IconCalendar />, label: "Registered", value: formatDate(h.registrationDate) },
            { icon: <IconClock />,    label: "Ends",        value: formatDate(h.endDate) },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#f8fafc", borderRadius: 10, padding: "8px 10px", border: "1px solid #e2e8f0",
            }}>
              <span style={{ color: "#1e3a8a", opacity: 0.7, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.7, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 11.5, color: "#334155", fontWeight: 600, marginTop: 1 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Result row */}
        {h.status === "completed" && h.rank && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
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

        {/* Deadline */}
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

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>

          {/* Submitted status badge */}
          {h.submitted && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 20,
              background: "#dcfce7",
              color: "#16a34a",
              fontSize: 11.5, fontWeight: 700,
            }}>
              <IconCheck /> Submitted
            </div>
          )}

          {/* Action button */}
          {!isEnded && !h.submitted && (
            <button onClick={() => onOpenSubmit(h)} style={{
              background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
              border: "none", borderRadius: 12, padding: "8px 18px", color: "#fff",
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

          {!isEnded && h.submitted && (
            <button onClick={() => onOpenSubmit(h)} style={{
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              border: "none", borderRadius: 12, padding: "8px 18px", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <IconUpload /> Update Submission
            </button>
          )}

          {!isEnded && h.status === "upcoming" && (
            <span style={{
              fontSize: 11.5, color: "#1d4ed8", fontWeight: 700,
              background: "#dbeafe", padding: "6px 12px", borderRadius: 20,
            }}>
              Starts in {daysLeft(h.startDate)}d
            </span>
          )}

          {isEnded && (
            <button onClick={() => onViewResult(h)} style={{
              background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
              border: "none", borderRadius: 12, padding: "8px 18px", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 14px rgba(30,58,138,0.25)",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
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
  const [hackathons, setHackathons] = useState([]);
  const [modalHackathon, setModalHackathon] = useState(null);
  const [resultModalHackathon, setResultModalHackathon] = useState(null);
  const [headerRef, headerInView] = useInView();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await hackathonService.getMyRegistrations();
        const regs = res?.data?.data || [];
        const mapped = regs.map(r => {
          const hack = r.hackathonId || {};
          const statusMap = { upcoming: 'upcoming', ongoing: 'ongoing', past: 'completed', judging: 'completed', draft: 'upcoming' };
          const status = statusMap[hack.status] || 'upcoming';
          const prize = hack.prizePool != null ? `${hack.currency === 'INR' ? '₹' : '$'}${Number(hack.prizePool).toLocaleString('en-IN')}` : '';
          const fee = hack.registrationFee === 0 ? 'Free' : `${hack.currency === 'INR' ? '₹' : '$'}${Number(hack.registrationFee).toLocaleString('en-IN')}`;
          return {
            id: hack._id || r._id,
            hackathonId: hack._id || r.hackathonId,
            name: hack.title || hack.name,
            domain: (hack.technologyDomains && hack.technologyDomains[0]) || 'General',
            status,
            mode: r.mode || (Array.isArray(hack.mode) ? hack.mode[0].toLowerCase() : (hack.mode && hack.mode.toLowerCase())),
            prize,
            fee,
            startDate: hack.startDate,
            endDate: hack.endDate,
            submissionDeadline: hack.submissionDeadline || hack.submissionDeadline,
            registrationDate: r.createdAt || r.confirmedAt || new Date().toISOString(),
            teamName: r.teamId?.name || (r.teamId ? r.teamId : null),
            teamSize: (r.participantIds && r.participantIds.length) || (hack.minTeamSize || 1),
            submitted: false,
            rank: hack.result?.rank || null,
            score: hack.result?.score || null,
            image: hack.bannerUrl || hack.image || `https://picsum.photos/seed/${hack._id || Math.random()}/800/400`,
          };
        });

        // Check existing submissions for the mapped hackathons
        const withSubmission = await Promise.all(mapped.map(async m => {
          try {
            const r = await hackathonService.getMySubmission(m.hackathonId);
            if (r?.data?.data) m.submitted = true;
          } catch (e) {
            // ignore
          }
          return m;
        }));

        if (mounted) {
          setHackathons(withSubmission);
        }
      } catch (err) {
        
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = hackathons.filter(h => {
    const matchStatus = statusFilter === "all" || h.status === statusFilter;
    const matchDomain = domainFilter === "All" || h.domain === domainFilter;
    return matchStatus && matchDomain;
  });

  const stats = {
    total: hackathons.length,
    ongoing: hackathons.filter(h => h.status === "ongoing").length,
    completed: hackathons.filter(h => h.status === "completed").length,
    bestRank: (() => {
      const ranks = hackathons.filter(h => typeof h.rank === 'number').map(h => h.rank);
      return ranks.length ? Math.min(...ranks) : null;
    })(),
  };

  const statusFilters = [
    { key: "all",       label: "All",       count: hackathons.length },
    { key: "ongoing",   label: "Ongoing",   count: stats.ongoing },
    { key: "upcoming",  label: "Upcoming",  count: hackathons.filter(h => h.status === "upcoming").length },
    { key: "completed", label: "Completed", count: stats.completed },
  ];

  // Mark hackathon as submitted
  const handleSubmitted = (id) => {
    setHackathons(prev => prev.map(h => h.id === id ? { ...h, submitted: true } : h));
  };

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
          Loading your hackathons...
        </h3>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
          Fetching your personalized registrations from the server
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
        @keyframes mhFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes mhSlideUp { from{opacity:0;transform:translateY(32px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes mhSuccessPop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes mhSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        .domain-chip:hover { background: #1e3a8a !important; color: #fff !important; border-color: #1e3a8a !important; }
        @media (max-width: 768px) { .hackathon-header { text-align:center; justify-content:center; } }
      `}</style>

      {/* Modal */}
      {modalHackathon && (
        <SubmissionModal
          hackathon={modalHackathon}
          onClose={() => setModalHackathon(null)}
          onSubmitted={handleSubmitted}
        />
      )}

      {resultModalHackathon && (
        <ResultModal
          hackathon={resultModalHackathon}
          onClose={() => setResultModalHackathon(null)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="hackathon-header" style={{ display: "flex", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: "#03045E", lineHeight: 1.1, letterSpacing: -0.5 }}>
              My Hackathons
            </h1>
            <p style={{ margin: "5px 0 0", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
              Track your complete hackathon journey
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 32 }}>
        <StatCard icon={<IconBolt />}   value={stats.total}          label="Total Joined" delay={0}   />
        <StatCard icon={<IconStar />}   value={stats.ongoing}        label="Ongoing"      delay={80}  />
        <StatCard icon={<IconCheck />}  value={stats.completed}      label="Completed"    delay={160} />
        <StatCard icon={<IconTrophy />} value={stats.bestRank ? `#${stats.bestRank}` : "N/A"} label="Best Rank"    delay={240} />
      </div>

      {/* Status Filters */}
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

      {/* Cards */}
      {hackathons.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 40px",
          background: "#fff",
          borderRadius: 24,
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 620,
          margin: "0 auto",
          animation: "mhSlideUp 0.6s cubic-bezier(.34,1.56,.64,1)"
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1e3a8a",
            marginBottom: 20,
            boxShadow: "0 8px 24px rgba(30,58,138,0.1)"
          }}>
            <IconTrophy />
          </div>
          <h2 style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "#03045E" }}>
            Start Your Hackathon Journey!
          </h2>
          <p style={{ margin: "10px 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 460 }}>
            You have not participated in any hackathons yet. Register for upcoming events, build innovative projects, and earn certificates!
          </p>
          <button
            onClick={() => navigate("/hackathons")}
            style={{
              background: "linear-gradient(135deg,#03045E,#1d4ed8)",
              border: "none",
              borderRadius: 14,
              padding: "12px 28px",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 16px rgba(3,4,94,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(3,4,94,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(3,4,94,0.3)";
            }}
          >
            <IconBolt /> Browse Hackathons
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "#fff",
          borderRadius: 20,
          border: "1.5px dashed #e2e8f0"
        }}>
          <div style={{ marginBottom: 12, color: "#94a3b8" }}><IconBarChart /></div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#64748b" }}>No hackathons match the filters</p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>Try changing your status or domain selection</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
          {filtered.map((h, i) => (
            <HackathonCard
              key={h.id}
              h={h}
              index={i}
              onViewResult={(h) => setResultModalHackathon(h)}
              onOpenSubmit={(h) => setModalHackathon(h)}
            />
          ))}
        </div>
      )}
    </div>
  );
}