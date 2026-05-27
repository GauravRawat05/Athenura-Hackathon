import { useState, useEffect, useRef } from "react";
import { hackathonService } from "../../services/hackathonService";
// ... (rest of the file content)

function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    }}>{children}</div>
  );
}

function useTilt() {
  const [tilt, setTilt] = useState(false);
  return { tilt, onMouseEnter: () => setTilt(true), onMouseLeave: () => setTilt(false) };
}

const Icons = {
  Github: () => (
    <svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  Link: () => (
    <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  Video: () => (
    <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  Image: () => (
    <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  FileText: () => (
    <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="8 21 12 17 16 21"/>
      <line x1="12" y1="17" x2="12" y2="11"/>
      <path d="M7 4H4a2 2 0 0 0-2 2v2c0 2.21 1.79 4 4 4h.5"/>
      <path d="M17 4h3a2 2 0 0 1 2 2v2c0 2.21-1.79 4-4 4h-.5"/>
      <rect x="7" y="2" width="10" height="9" rx="2"/>
    </svg>
  ),
  History: () => (
    <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Send: () => (
    <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Alert: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

function Countdown({ deadline }) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) return setTime({ expired: true });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [deadline]);

  if (time.expired) return (
    <span style={{ color: "#e63946", fontFamily: "Nunito,sans-serif", fontWeight: 700, fontSize: 14 }}>
      Deadline passed
    </span>
  );

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[["d","Days"],["h","Hrs"],["m","Min"],["s","Sec"]].map(([k, label]) => (
        <div key={k} style={{ textAlign: "center" }}>
          <div style={{
            background: "#03045e", color: "#fff",
            fontFamily: "Nunito,sans-serif", fontWeight: 800,
            fontSize: 16, borderRadius: 7, padding: "3px 9px", minWidth: 32,
          }}>{String(time[k] ?? 0).padStart(2,"0")}</div>
          <div style={{ fontSize: 9, color: "#7b8ab8", fontFamily: "Poppins,sans-serif", marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ icon: IconComp, title, children, extra }) {
  const { tilt, onMouseEnter, onMouseLeave } = useTilt();
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: "#fff", borderRadius: 16, padding: "24px 28px",
        boxShadow: "0 2px 18px rgba(3,4,94,0.07)", marginBottom: 20,
        border: "1.5px solid #3b3dd8",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: "#eef0f8", display: "flex",
          alignItems: "center", justifyContent: "center", color: "#03045e",
          transform: tilt ? "rotate(-12deg) scale(1.13)" : "rotate(0deg) scale(1)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          flexShrink: 0,
        }}>
          <IconComp />
        </div>
        <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 17, color: "#03045e" }}>
          {title}
        </span>
        {extra && <div style={{ marginLeft: "auto" }}>{extra}</div>}
      </div>
      {children}
    </div>
  );
}

export default function ProjectSubmission() {
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [form, setForm] = useState({ repo: "", demo: "", video: "", notes: "" });
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [historySpinning, setHistorySpinning] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(true);
  const fileRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  // Calculate dropdown menu height for pushing content down
  useEffect(() => {
    if (dropdownOpen && dropdownMenuRef.current) {
      setDropdownHeight(dropdownMenuRef.current.offsetHeight + 6);
    } else {
      setDropdownHeight(0);
    }
  }, [dropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const inp = {
    width: "100%", boxSizing: "border-box",
    border: "1.5px solid #dde2f0", borderRadius: 10,
    padding: "11px 14px", fontSize: 14,
    fontFamily: "Poppins,sans-serif", color: "#1a1a2e",
    background: "#fafbff", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const errStyle = {
    color: "#e63946", fontSize: 11.5,
    fontFamily: "Poppins,sans-serif", marginTop: 4,
    display: "flex", alignItems: "center", gap: 4,
  };

  const labelStyle = {
    display: "block", fontFamily: "Poppins,sans-serif",
    fontWeight: 600, fontSize: 12.5, color: "#03045e", marginBottom: 6,
  };

  const badge = (color, bg) => ({
    display: "inline-block", padding: "3px 11px",
    borderRadius: 20, fontSize: 11,
    fontFamily: "Nunito,sans-serif", fontWeight: 800,
    color, background: bg,
  });

  const validate = () => {
    const e = {};
    if (!selectedHackathon) e.hackathon = "Please select a hackathon";
    if (!form.repo.trim()) e.repo = "Repository link is required";
    else if (!form.repo.startsWith("http")) e.repo = "Enter a valid URL";
    if (form.demo && !form.demo.startsWith("http")) e.demo = "Enter a valid URL";
    if (form.video && !form.video.startsWith("http")) e.video = "Enter a valid URL";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageDrop = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    const previews = valid.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages(prev => [...prev, ...previews].slice(0, 8));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 2000);
  };

  const handleHistoryRefresh = () => {
    if (historySpinning) return;
    setHistorySpinning(true);
    setHistoryVisible(false);
    setTimeout(() => { setHistoryVisible(true); setHistorySpinning(false); }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Poppins,sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes popIn { from{transform:scale(0.75);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .ps-input:focus { border-color:#0077b6!important; box-shadow:0 0 0 3px rgba(0,119,182,0.11)!important; }
        .ps-submit:hover:not(:disabled){ background:#0077b6!important; transform:translateY(-2px); box-shadow:0 8px 26px rgba(3,4,94,0.28)!important; }
        .ps-hov:hover{ background:#eef0f8!important; }
        .ps-hist:hover{ box-shadow:0 4px 18px rgba(3,4,94,0.09)!important; }
        .ps-link:hover{ background:#daeefa!important; }

        @media (max-width: 768px) {
  .ps-header-text { text-align: center; }
}
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: "white",
        padding: "32px 36px 52px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize: "38px 38px",
        }}/>
        <AnimatedSection>
          {/* ── Title dark blue ── */}
        <h1 className="ps-header-text" style={{
  fontFamily: "Nunito,sans-serif", fontWeight: 900,
  fontSize: 28, color: "#03045e",
  margin: 0, position: "relative",
  WebkitTextStroke: "0px",
  textShadow: "0 1px 0 rgba(255,255,255,0.18)",
}}>Project Submission</h1>
<p className="ps-header-text" style={{
  color: "#5a7a9a", fontFamily: "Poppins,sans-serif",
  fontSize: 13.5, margin: "6px 0 0", position: "relative",
}}>Submit your project for evaluation. Multiple versions allowed — last one counts.</p>
</AnimatedSection>
</div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "min(960px, calc(100% - 48px))", margin: "0 auto", marginTop: -28 }}>

        {/* ── Select Hackathon ── */}
        <AnimatedSection delay={0.05}>
          <SectionCard icon={Icons.Trophy} title="Select Hackathon">
            {/* Dropdown wrapper — NOT relative, so dropdown is in-flow */}
            <div ref={dropdownRef}>
              <label style={labelStyle}>Active Hackathon *</label>

              {/* Trigger */}
              <div
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  ...inp, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderColor: errors.hackathon ? "#e63946" : dropdownOpen ? "#0077b6" : "#dde2f0",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(0,119,182,0.11)" : "none",
                  userSelect: "none", position: "relative", zIndex: 2,
                }}
              >
                <span style={{ color: selectedHackathon ? "#1a1a2e" : "#9aa3c2", fontSize: 14 }}>
                  {selectedHackathon ? selectedHackathon.name : "Choose a hackathon to submit for…"}
                </span>
                <span style={{
                  color: "#7b8ab8",
                  transform: dropdownOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s", display: "flex",
                }}>
                  <Icons.ChevronDown />
                </span>
              </div>

              {/* In-flow dropdown — pushes content down, no blur */}
              <div style={{
                maxHeight: dropdownOpen ? 300 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <div
                  ref={dropdownMenuRef}
                  style={{
                    background: "#fff", borderRadius: "0 0 12px 12px",
                    border: "1.5px solid #dde2f0", borderTop: "none",
                    boxShadow: "0 10px 30px rgba(3,4,94,0.12)",
                    overflow: "hidden",
                    marginBottom: 2,
                  }}
                >
                  {hackathons.map((h, idx) => (
                    <div
                      key={h.id}
                      className="ps-hov"
                      onClick={() => {
                        setSelectedHackathon(h);
                        setDropdownOpen(false);
                        setErrors(er => ({ ...er, hackathon: null }));
                      }}
                      style={{
                        padding: "13px 16px", cursor: "pointer",
                        borderBottom: idx < hackathons.length - 1 ? "1px solid #f0f2f8" : "none",
                        transition: "background 0.15s", background: "#fff",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 13.5, color: "#03045e" }}>{h.name}</div>
                          <div style={{ fontSize: 11.5, color: "#7b8ab8", marginTop: 2 }}>{h.domain} · Deadline: {h.deadline}</div>
                        </div>
                        <span style={badge("#fff","#03045e")}>{h.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errors.hackathon && <p style={errStyle}><Icons.Alert /> {errors.hackathon}</p>}
            </div>

            {selectedHackathon && (
              <div style={{
                marginTop: 14,
                background: "linear-gradient(120deg,#eef0f8,#e8f4fd)",
                borderRadius: 12, padding: "14px 18px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#03045e" }}><Icons.Clock /></span>
                  <div>
                    <div style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 12.5, color: "#03045e" }}>Submission Deadline</div>
                    <div style={{ fontSize: 11.5, color: "#7b8ab8" }}>{selectedHackathon.deadline}</div>
                  </div>
                </div>
                <Countdown deadline={selectedHackathon.deadline} />
              </div>
            )}
          </SectionCard>
        </AnimatedSection>

        {/* ── Project Links ── */}
        <AnimatedSection delay={0.1}>
          <SectionCard icon={Icons.Link} title="Project Links">
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icons.Github /> Source Code Repository *
                </span>
              </label>
              <input
                className="ps-input"
                style={{ ...inp, ...(errors.repo ? { borderColor: "#e63946" } : {}) }}
                placeholder="https://github.com/username/project-name"
                value={form.repo}
                onChange={e => { setForm(f => ({ ...f, repo: e.target.value })); setErrors(er => ({ ...er, repo: null })); }}
              />
              {errors.repo && <p style={errStyle}><Icons.Alert /> {errors.repo}</p>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Icons.Link /> Live Demo URL
                  </span>
                </label>
                <input
                  className="ps-input"
                  style={{ ...inp, ...(errors.demo ? { borderColor: "#e63946" } : {}) }}
                  placeholder="https://your-demo.vercel.app"
                  value={form.demo}
                  onChange={e => { setForm(f => ({ ...f, demo: e.target.value })); setErrors(er => ({ ...er, demo: null })); }}
                />
                {errors.demo && <p style={errStyle}><Icons.Alert /> {errors.demo}</p>}
              </div>
              <div>
                <label style={labelStyle}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Icons.Video /> Video Demo URL
                  </span>
                </label>
                <input
                  className="ps-input"
                  style={{ ...inp, ...(errors.video ? { borderColor: "#e63946" } : {}) }}
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.video}
                  onChange={e => { setForm(f => ({ ...f, video: e.target.value })); setErrors(er => ({ ...er, video: null })); }}
                />
                {errors.video && <p style={errStyle}><Icons.Alert /> {errors.video}</p>}
              </div>
            </div>
          </SectionCard>
        </AnimatedSection>

        {/* ── Project Screenshots ── */}
        <AnimatedSection delay={0.15}>
          <SectionCard
            icon={Icons.Image}
            title="Project Screenshots"
            extra={<span style={badge("#7b8ab8","#eef0f8")}>{images.length}/8 uploaded</span>}
          >
            <div
              style={{
                border: `2px dashed ${dragOver ? "#0077b6" : "#c5cce8"}`,
                borderRadius: 12, padding: "30px 20px",
                textAlign: "center", cursor: "pointer",
                background: dragOver ? "#eaf4fd" : "#fafbff",
                transition: "all 0.22s",
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleImageDrop(e.dataTransfer.files); }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <svg width="38" height="38" fill="none" stroke="#0077b6" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, color: "#03045e", margin: "0 0 4px", fontSize: 14 }}>
                Drop images here or click to browse
              </p>
              <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "#7b8ab8", margin: 0 }}>
                PNG, JPG, GIF · Max 8 images
              </p>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                onChange={e => handleImageDrop(e.target.files)} />
            </div>

            {images.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
                gap: 10, marginTop: 14,
              }}>
                {images.map((img, i) => (
                  <div key={i} style={{
                    borderRadius: 9, overflow: "hidden",
                    position: "relative", aspectRatio: "1", background: "#eef0f8",
                  }}>
                    <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      style={{
                        position: "absolute", top: 3, right: 3,
                        background: "rgba(3,4,94,0.72)", color: "#fff",
                        border: "none", borderRadius: "50%",
                        width: 20, height: 20, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                      onClick={() => setImages(imgs => imgs.filter((_,j) => j !== i))}
                    >
                      <Icons.X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </AnimatedSection>

        {/* ── Notes for Judges ── */}
        <AnimatedSection delay={0.2}>
          <SectionCard icon={Icons.FileText} title="Notes for Judges">
            <label style={labelStyle}>Additional Information</label>
            <textarea
              className="ps-input"
              style={{ ...inp, resize: "vertical", minHeight: 110, lineHeight: 1.7 }}
              placeholder="Describe your project — key features, tech stack used, challenges solved, what makes it innovative…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
              <span style={{ fontSize: 11.5, color: "#9aa3c2", fontFamily: "Poppins,sans-serif" }}>
                {form.notes.length} / 2000
              </span>
            </div>
          </SectionCard>
        </AnimatedSection>

        {/* ── Submit Button ── */}
        <AnimatedSection delay={0.25}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button
              className="ps-submit"
              style={{
                background: loading ? "#7b8ab8" : "#03045e",
                color: "#fff", border: "none", borderRadius: 11,
                padding: "13px 32px", fontSize: 14.5,
                fontFamily: "Nunito,sans-serif", fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 9,
                transition: "all 0.22s",
                boxShadow: "0 4px 18px rgba(3,4,94,0.22)",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg style={{ animation: "spin 0.8s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Submitting…
                </>
              ) : (
                <><Icons.Send /> Submit Project</>
              )}
            </button>
          </div>
        </AnimatedSection>

        {/* ── Submission History ── */}
        <AnimatedSection delay={0.3}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: "24px 28px",
            boxShadow: "0 2px 18px rgba(3,4,94,0.07)", marginBottom: 20,
            border: "1.5px solid #03045e",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <button
                onClick={handleHistoryRefresh}
                title="Refresh history"
                style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: "#eef0f8", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#03045e", cursor: "pointer",
                  transform: historySpinning ? "rotate(360deg)" : "rotate(0deg)",
                  transition: historySpinning
                    ? "transform 0.65s cubic-bezier(0.4,0,0.2,1)"
                    : "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  flexShrink: 0,
                }}
              >
                <Icons.History />
              </button>
              <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: 17, color: "#03045e" }}>
                Submission History
              </span>
              <span style={{ marginLeft: "auto", ...badge("#7b8ab8","#eef0f8") }}>
                {previousSubmissions.length} versions
              </span>
            </div>

            <div style={{
              opacity: historyVisible ? 1 : 0,
              transform: historyVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}>
              {previousSubmissions.map((s, i) => (
                <div
                  key={i}
                  className="ps-hist"
                  style={{
                    border: "1.5px solid #eef0f8", borderRadius: 13,
                    padding: "16px 18px", marginBottom: 12,
                    background: "#fafbff", transition: "box-shadow 0.2s",
                    animation: historyVisible ? `fadeSlideUp 0.4s ease ${i * 0.08}s both` : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                        <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, color: "#03045e", fontSize: 13.5 }}>
                          Version {s.version}
                        </span>
                        <span style={badge(
                          s.status === "Latest" ? "#fff" : "#7b8ab8",
                          s.status === "Latest" ? "#03045e" : "#eef0f8"
                        )}>{s.status}</span>
                      </div>
                      <div style={{
                        fontSize: 12, color: "#7b8ab8", fontFamily: "Poppins,sans-serif",
                        marginBottom: 10, display: "flex", alignItems: "center", gap: 5,
                      }}>
                        <Icons.Clock /> {s.submittedAt}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        <a href={s.repo} target="_blank" rel="noreferrer" className="ps-link"
                          style={{
                            display: "flex", alignItems: "center", gap: 5, fontSize: 12,
                            color: "#0077b6", fontFamily: "Poppins,sans-serif",
                            background: "#eaf4fd", padding: "5px 12px",
                            borderRadius: 20, textDecoration: "none", transition: "background 0.15s",
                          }}>
                          <Icons.Github /> Repository
                        </a>
                        <a href={s.demo} target="_blank" rel="noreferrer" className="ps-link"
                          style={{
                            display: "flex", alignItems: "center", gap: 5, fontSize: 12,
                            color: "#0077b6", fontFamily: "Poppins,sans-serif",
                            background: "#eaf4fd", padding: "5px 12px",
                            borderRadius: 20, textDecoration: "none", transition: "background 0.15s",
                          }}>
                          <Icons.Link /> Live Demo
                        </a>
                      </div>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#9aa3c2", fontFamily: "Poppins,sans-serif", textAlign: "right" }}>
                      {s.hackathon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* ── Success Modal ── */}
      {submitted && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(3,4,94,0.52)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999, backdropFilter: "blur(5px)",
          }}
          onClick={() => setSubmitted(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 22, padding: "48px 44px",
              textAlign: "center", maxWidth: 380, width: "90%",
              boxShadow: "0 24px 60px rgba(3,4,94,0.22)",
              animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: 76, height: 76, borderRadius: "50%",
              background: "#eaf8f0", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 22px", color: "#2d9e6b",
            }}>
              <svg width="38" height="38" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "Nunito,sans-serif", fontWeight: 900, color: "#03045e", fontSize: 23, margin: "0 0 10px" }}>
              Submitted! 🎉
            </h2>
            <p style={{ fontFamily: "Poppins,sans-serif", color: "#7b8ab8", fontSize: 13.5, margin: "0 0 26px" }}>
              Your project has been submitted successfully. Judges will review it after the deadline.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                background: "#03045e", color: "#fff", border: "none",
                borderRadius: 11, padding: "12px 32px",
                fontSize: 14, fontFamily: "Nunito,sans-serif", fontWeight: 800,
                cursor: "pointer", display: "flex", alignItems: "center",
                gap: 8, margin: "0 auto",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}