import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Icon = ({ d, size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  Trophy: (p) => <Icon {...p} d={["M6 9H4.5a2.5 2.5 0 0 1 0-5H6","M18 9h1.5a2.5 2.5 0 0 0 0-5H18","M4 22h16","M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22","M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22","M18 2H6v7a6 6 0 0 0 12 0V2z"]} />,
  PlusCircle: (p) => <Icon {...p} d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 8v8","M8 12h8"]} />,
  Save: (p) => <Icon {...p} d={["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z","M17 21v-8H7v8","M7 3v5h8"]} />,
  Plus: (p) => <Icon {...p} d={["M12 5v14","M5 12h14"]} />,
  Trash2: (p) => <Icon {...p} d={["M3 6h18","M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6","M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2","M10 11v6","M14 11v6"]} />,
  Calendar: (p) => <Icon {...p} d={["M8 2v4","M16 2v4","M3 10h18","M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"]} />,
  UploadCloud: (p) => <Icon {...p} d={["M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242","M12 12v9","M8 17l4-4 4 4"]} />,
  Lightbulb: (p) => <Icon {...p} d={["M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5","M9 18h6","M10 22h4"]} />,
  ChevronDown: (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  X: (p) => <Icon {...p} d={["M18 6 6 18","M6 6l12 12"]} />,
  Menu: (p) => <Icon {...p} d={["M3 12h18","M3 6h18","M3 18h18"]} />,
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --bg: #f0f4ff;
    --card: #ffffff;
    --border: #e2e8f0;
    --text: #0f172a;
    --muted: #64748b;
    --accent: #eff6ff;
    --accent-fg: #1d4ed8;
    --danger: #ef4444;
    --gradient: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-lg: 0 4px 24px rgba(59,130,246,0.12), 0 2px 8px rgba(0,0,0,0.06);
    --radius: 14px;
    --radius-sm: 8px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  .page-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #ecf4ff 0%, #f8ffff 50%, #dff0ff 100%);
  }

  .topbar {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

  .topbar-title { flex: 1; }
  .topbar-title h1 { font-size: clamp(16px, 3vw, 22px); font-weight: 800; color: #0b1b52; }
  .topbar-title p { font-size: 11px; color: var(--muted); margin-top: 1px; }

  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .btn-draft {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    padding: 9px 14px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    font-family: inherit;
  }
  .btn-draft:hover { background: #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

  .btn-create {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--gradient);
    padding: 9px 14px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: transform 0.15s;
    box-shadow: var(--shadow-lg);
    white-space: nowrap;
    font-family: inherit;
  }
  .btn-create:hover { transform: translateY(-1px); }
  .btn-create:active { transform: scale(0.97); }

  .btn-text { display: inline; }
  @media (max-width: 480px) { .btn-text { display: none; } }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid white;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
    flex-shrink: 0;
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }

  .main { padding: 20px 16px 40px; }
  @media (min-width: 640px) { .main { padding: 28px 24px 48px; } }
  @media (min-width: 1024px) { .main { padding: 32px 32px 60px; } }

  .grid {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  }
  @media (min-width: 1024px) {
    .grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  }

  .col-span-2 { grid-column: span 1; }
  @media (min-width: 640px) { .col-span-2 { grid-column: span 2; } }
  @media (min-width: 1024px) { .col-span-2 { grid-column: span 2; } }

  .col-span-full { grid-column: 1 / -1; }

  .card {
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--card);
    padding: 20px;
    box-shadow: var(--shadow);
    transition: box-shadow 0.2s;
    animation: fadeUp 0.35s ease forwards;
  }
  @media (min-width: 640px) { .card { padding: 24px; } }
  .card:hover { box-shadow: var(--shadow-lg); }

  .card-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  .fields { display: flex; flex-direction: column; gap: 14px; }

  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: 13px; font-weight: 600; color: var(--text); }
  .field .helper { font-size: 11px; color: var(--muted); }
  .req { color: var(--danger); }

  .input {
    width: 100%;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    padding: 9px 13px;
    font-size: 14px;
    color: var(--text);
    transition: all 0.15s;
    outline: none;
    font-family: inherit;
  }
  .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.14); }

  textarea.input { resize: none; }

  .char-wrap { position: relative; }
  .char-count {
    position: absolute;
    bottom: 8px;
    right: 10px;
    font-size: 10px;
    color: var(--muted);
    pointer-events: none;
  }

  .select-wrap { position: relative; }
  .select-wrap select {
    width: 100%;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    padding: 9px 36px 9px 13px;
    font-size: 14px;
    color: var(--text);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    outline: none;
    font-family: inherit;
    transition: all 0.15s;
  }
  .select-wrap select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.14); }
  .select-chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }

  .checkbox-group { display: flex; flex-wrap: wrap; gap: 10px; }
  .checkbox-option {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: white;
    padding: 7px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }
  .checkbox-option.active {
    border-color: rgba(59,130,246,0.4);
    background: var(--accent);
    color: var(--accent-fg);
  }
  .checkbox-option input { width: 15px; height: 15px; accent-color: var(--primary); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .date-wrap { position: relative; }
  .date-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }
  .date-wrap .input { padding-right: 36px; }

  .tag-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    padding: 6px 8px;
    min-height: 44px;
    cursor: text;
    transition: all 0.15s;
  }
  .tag-box:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.14); }
  .tag-box input {
    flex: 1;
    min-width: 100px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    font-family: inherit;
    color: var(--text);
    padding: 3px 4px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 6px;
    background: var(--accent);
    padding: 3px 9px;
    font-size: 12px;
    font-weight: 500;
    color: var(--accent-fg);
  }
  .chip-remove {
    background: none;
    border: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    padding: 1px;
    border-radius: 4px;
    color: inherit;
    transition: background 0.1s;
  }
  .chip-remove:hover { background: rgba(0,0,0,0.08); }

  .criteria-table {
    overflow: hidden;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }
  .criteria-header {
    display: grid;
    grid-template-columns: 30px 1fr 90px 36px;
    background: #f8fafc;
    padding: 7px 10px;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    gap: 8px;
  }
  @media (max-width: 400px) {
    .criteria-header { grid-template-columns: 24px 1fr 70px 32px; }
  }
  .criteria-row {
    display: grid;
    grid-template-columns: 30px 1fr 90px 36px;
    align-items: center;
    gap: 8px;
    border-top: 1px solid var(--border);
    padding: 7px 10px;
  }
  @media (max-width: 400px) {
    .criteria-row { grid-template-columns: 24px 1fr 70px 32px; }
  }
  .criteria-num { font-size: 11px; font-weight: 700; color: var(--muted); }

  .btn-add {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 7px;
    border: 1px dashed rgba(59,130,246,0.4);
    background: rgba(59,130,246,0.04);
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary);
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .btn-add:hover { background: rgba(59,130,246,0.1); }

  .btn-del {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 7px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--danger);
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .btn-del:hover { background: rgba(239,68,68,0.1); }

  .rule-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rule-num {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 7px;
    background: #f1f5f9;
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    flex-shrink: 0;
  }

  .upload-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: var(--radius-sm);
    border: 2px dashed rgba(59,130,246,0.3);
    background: rgba(59,130,246,0.02);
    padding: 32px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
  }
  .upload-zone:hover {
    border-color: rgba(59,130,246,0.6);
    background: rgba(59,130,246,0.06);
  }
  .upload-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(59,130,246,0.1);
    color: var(--primary);
  }
  .upload-label { font-size: 13px; }
  .upload-label strong { color: var(--primary); }
  .upload-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

  input[type="file"].hidden-file { display: none; }

  .notes-card {
    border-radius: var(--radius);
    border: 1px solid rgba(59,130,246,0.2);
    background: linear-gradient(135deg, rgba(59,130,246,0.04), rgba(239,246,255,0.7));
    padding: 20px;
    animation: fadeUp 0.35s ease forwards;
  }
  .notes-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .notes-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    display: grid;
    place-items: center;
    background: rgba(59,130,246,0.14);
    color: var(--primary);
    flex-shrink: 0;
  }
  .notes-title { font-size: 14px; font-weight: 700; }
  .notes-list {
    list-style: disc;
    margin-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    font-size: 13px;
    color: var(--muted);
  }

  .weight-info {
    font-size: 11px;
    font-weight: 500;
  }

  .criteria-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    flex-wrap: wrap;
    gap: 8px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function Chip({ label, onRemove }) {
  return (
    <span className="chip">
      {label}
      {onRemove && (
        <button className="chip-remove" onClick={onRemove}>
          <Icons.X size={11} />
        </button>
      )}
    </span>
  );
}

function Field({ label, required, children, helper }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {children}
      {helper && <p className="helper">{helper}</p>}
    </div>
  );
}

function ThemedSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="select-wrap">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
      <span className="select-chevron"><Icons.ChevronDown size={15} /></span>
    </div>
  );
}

export default function CreateHackathonPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("");
  const [allowedModes, setAllowedModes] = useState([]);
  const [minTeam, setMinTeam] = useState(1);
  const [maxTeam, setMaxTeam] = useState(4);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [regDeadline, setRegDeadline] = useState("");
  const [subDeadline, setSubDeadline] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [regFee, setRegFee] = useState("");
  const [currency, setCurrency] = useState("");
  const [domains, setDomains] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [problem, setProblem] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [rules, setRules] = useState([]);
  const [studentOnly, setStudentOnly] = useState(false);
  const [years, setYears] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem("hackathonDraft") || "null");
      if (!draft) return;
      if (draft.title) setTitle(draft.title);
      if (draft.slug) setSlug(draft.slug);
      if (draft.desc) setDesc(draft.desc);
      if (draft.status) setStatus(draft.status);
      if (draft.mode) setMode(draft.mode);
      if (draft.allowedModes) setAllowedModes(draft.allowedModes);
      if (draft.minTeam) setMinTeam(draft.minTeam);
      if (draft.maxTeam) setMaxTeam(draft.maxTeam);
      if (draft.startDate) setStartDate(draft.startDate);
      if (draft.endDate) setEndDate(draft.endDate);
      if (draft.regDeadline) setRegDeadline(draft.regDeadline);
      if (draft.subDeadline) setSubDeadline(draft.subDeadline);
      if (draft.prizePool) setPrizePool(draft.prizePool);
      if (draft.regFee) setRegFee(draft.regFee);
      if (draft.currency) setCurrency(draft.currency);
      if (draft.domains) setDomains(draft.domains);
      if (draft.problem) setProblem(draft.problem);
      if (draft.criteria) setCriteria(draft.criteria);
      if (draft.rules) setRules(draft.rules);
      if (draft.studentOnly !== undefined) setStudentOnly(draft.studentOnly);
      if (draft.years) setYears(draft.years);
    } catch {}
  }, []);

  const toggleMode = (m) => setAllowedModes((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  const totalWeight = criteria.reduce((s, c) => s + Number(c.weight || 0), 0);

  const handleFileChange = (e) => { const f = e.target.files[0]; if (f) setUploadedFile(f.name); };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.type === "application/pdf") setUploadedFile(f.name); };
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleSaveDraft = () => {
    const draft = { title, slug, desc, status, mode, allowedModes, minTeam, maxTeam, startDate, endDate, regDeadline, subDeadline, prizePool, regFee, currency, domains, problem, criteria, rules, studentOnly, years };
    localStorage.setItem("hackathonDraft", JSON.stringify(draft));
    alert("Draft saved!");
  };

 const handleCreate = () => {
    if (!title || !status || !mode) { alert("Please fill in all required fields."); return; }

    const newHackathon = {
      id: crypto.randomUUID(),
      name: title,
      subtitle: desc.slice(0, 60) || "No description",
      status: status,
      regFrom: startDate ? new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "TBD",
      regTo: regDeadline ? new Date(regDeadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "TBD",
      eventFrom: startDate ? new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "TBD",
      eventTo: endDate ? new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "TBD",
      submissionDeadline: subDeadline || "",
      resultsDate: "",
      prize: Number(prizePool) || 0,
      mode: mode,
      teamSize: `${minTeam} - ${maxTeam} Members`,
      eligibility: studentOnly ? "Students Only" : "All Students",
      organizedBy: "",
      description: desc,
      iconKey: "ai",
      iconBg: "from-blue-500 to-indigo-600",
      settings: { publiclyVisible: true, registrationOpen: true, allowTeamChanges: false, requireApproval: false, sendEmailUpdates: true, showLeaderboard: true },
    };

    const existing = JSON.parse(sessionStorage.getItem("tempHackathons") || "[]");
    sessionStorage.setItem("tempHackathons", JSON.stringify([newHackathon, ...existing]));
    localStorage.removeItem("hackathonDraft");
    navigate("/admin/hackathons");
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="page-wrapper">
        <nav className="topbar">
          <div className="topbar-title">
            <h1>Create Hackathon</h1>
          </div>
          <div className="topbar-actions">
            <button className="btn-draft" onClick={handleSaveDraft}>
              <Icons.Save size={15} />
              <span className="btn-text">Save Draft</span>
            </button>
            <button className="btn-create" onClick={handleCreate}>
              <Icons.PlusCircle size={15} />
              <span className="btn-text">Create</span>
            </button>
            <div className="avatar">
              <img src="https://i.pravatar.cc/80" alt="Account" />
            </div>
          </div>
        </nav>

        <main className="main">
          <div className="grid">

            <div className="card">
              <div className="card-title">1. Basic Information</div>
              <div className="fields">
                <Field label="Title" required>
                  <input className="input" value={title} onChange={handleTitleChange} placeholder="Enter hackathon title" />
                </Field>
                <Field label="Slug" required helper="Used in the URL">
                  <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="enter-hackathon-slug" />
                </Field>
                <Field label="Description" required>
                  <div className="char-wrap">
                    <textarea className="input" rows={4} maxLength={1000} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter detailed description" />
                    <span className="char-count">{desc.length} / 1000</span>
                  </div>
                </Field>
                <Field label="Status" required helper="Draft, Upcoming, Ongoing, Completed, Cancelled">
                  <ThemedSelect value={status} onChange={setStatus} placeholder="Select status" options={["Draft","Upcoming","Ongoing","Completed","Cancelled"]} />
                </Field>
              </div>
            </div>

            <div className="card">
              <div className="card-title">2. Participation</div>
              <div className="fields">
                <Field label="Mode" required helper="Primary mode of the hackathon">
                  <ThemedSelect value={mode} onChange={setMode} placeholder="Select mode" options={["Online","Offline","Hybrid"]} />
                </Field>
                <Field label="Allowed Modes" required helper="Select all allowed participation modes">
                  <div className="checkbox-group">
                    {["Solo","Team","Solo & Team"].map((m) => (
                      <label key={m} className={`checkbox-option${allowedModes.includes(m) ? " active" : ""}`}>
                        <input type="checkbox" checked={allowedModes.includes(m)} onChange={() => toggleMode(m)} />
                        {m}
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Team Size" required helper="Define min and max team size">
                  <div className="grid-2">
                    <div className="field">
                      <label>Min</label>
                      <input className="input" type="number" min={1} value={minTeam} onChange={(e) => setMinTeam(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Max</label>
                      <input className="input" type="number" min={1} value={maxTeam} onChange={(e) => setMaxTeam(e.target.value)} />
                    </div>
                  </div>
                </Field>
              </div>
            </div>

            <div className="card">
              <div className="card-title">3. Timeline</div>
              <div className="fields">
                {[
                  { label: "Start Date", val: startDate, set: setStartDate },
                  { label: "End Date", val: endDate, set: setEndDate },
                  { label: "Registration Deadline", val: regDeadline, set: setRegDeadline },
                  { label: "Submission Deadline", val: subDeadline, set: setSubDeadline },
                ].map(({ label, val, set }) => (
                  <Field key={label} label={label} required>
                    <div className="date-wrap">
                      <input className="input" type="datetime-local" value={val} onChange={(e) => set(e.target.value)} />
                      <span className="date-icon"><Icons.Calendar size={15} /></span>
                    </div>
                  </Field>
                ))}
                <p className="helper">All dates in your local timezone</p>
              </div>
            </div>

            <div className="card">
              <div className="card-title">4. Prize & Fees</div>
              <div className="fields">
                <Field label="Prize Pool (₹)" required>
                  <input className="input" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} placeholder="Enter prize pool amount" />
                </Field>
                <Field label="Registration Fee (₹)" required>
                  <input className="input" value={regFee} onChange={(e) => setRegFee(e.target.value)} placeholder="Enter registration fee" />
                </Field>
                <Field label="Currency" required>
                  <ThemedSelect value={currency} onChange={setCurrency} options={["INR","USD","EUR"]} />
                </Field>
                <p className="helper">Total prize money and registration fee for participants</p>
              </div>
            </div>

            <div className="card col-span-2">
              <div className="card-title">5. Technical Details</div>
              <div className="fields">
                <Field label="Technology Domains" required helper='Add domains like AI, Web, Mobile — press Enter'>
                  <div className="tag-box">
                    {domains.map((d) => <Chip key={d} label={d} onRemove={() => setDomains(domains.filter((x) => x !== d))} />)}
                    <input
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && domainInput.trim()) {
                          e.preventDefault();
                          if (!domains.includes(domainInput.trim())) setDomains([...domains, domainInput.trim()]);
                          setDomainInput("");
                        }
                      }}
                      placeholder="Type and press Enter"
                    />
                  </div>
                </Field>

                <Field label="Problem Statement" required>
                  <div className="char-wrap">
                    <textarea className="input" rows={4} maxLength={1500} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Enter the problem statement" />
                    <span className="char-count">{problem.length} / 1500</span>
                  </div>
                </Field>

                <Field label="Judging Criteria" required>
                  <div className="criteria-table">
                    <div className="criteria-header">
                      <span>#</span><span>Criterion</span><span>Weight %</span><span></span>
                    </div>
                    {criteria.map((c, i) => (
                      <div key={i} className="criteria-row">
                        <span className="criteria-num">{i + 1}</span>
                        <input className="input" value={c.name} onChange={(e) => { const n = [...criteria]; n[i] = { ...n[i], name: e.target.value }; setCriteria(n); }} style={{ padding: "7px 10px", fontSize: 13 }} />
                        <input className="input" type="number" value={c.weight} onChange={(e) => { const n = [...criteria]; n[i] = { ...n[i], weight: Number(e.target.value) }; setCriteria(n); }} style={{ padding: "7px 10px", fontSize: 13 }} />
                        <button className="btn-del" onClick={() => setCriteria(criteria.filter((_, idx) => idx !== i))}><Icons.Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="criteria-footer">
                    <button className="btn-add" onClick={() => setCriteria([...criteria, { name: "", weight: 0 }])}>
                      <Icons.Plus size={13} /> Add Criterion
                    </button>
                    <span className="weight-info" style={{ color: totalWeight === 100 ? "#059669" : "var(--muted)" }}>
                      Total: {totalWeight}% {totalWeight === 100 ? "✓" : "(must be 100%)"}
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            <div className="card">
              <div className="card-title">6. Rules & Eligibility</div>
              <div className="fields">
                <Field label="Rules">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {rules.map((r, i) => (
                      <div key={i} className="rule-row">
                        <span className="rule-num">{i + 1}</span>
                        <input className="input" value={r} onChange={(e) => { const n = [...rules]; n[i] = e.target.value; setRules(n); }} style={{ flex: 1 }} />
                        <button className="btn-del" onClick={() => setRules(rules.filter((_, idx) => idx !== i))}><Icons.Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button className="btn-add" style={{ alignSelf: "flex-start" }} onClick={() => setRules([...rules, ""])}>
                      <Icons.Plus size={13} /> Add Rule
                    </button>
                  </div>
                </Field>

                <div className="field">
                  <label>Eligibility</label>
                  <label className="checkbox-option" style={{ alignSelf: "flex-start", cursor: "pointer" }}>
                    <input type="checkbox" checked={studentOnly} onChange={(e) => setStudentOnly(e.target.checked)} />
                    Student Only
                  </label>
                  <p className="helper">Restrict participation to students only</p>
                </div>

                <Field label="Allowed Graduation Years" helper="Type a year and press Enter">
                  <div className="tag-box">
                    {years.map((y) => <Chip key={y} label={y} onRemove={() => setYears(years.filter((x) => x !== y))} />)}
                    <input
                      placeholder="e.g. 2026"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          if (!years.includes(e.target.value.trim())) setYears([...years, e.target.value.trim()]);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </Field>
              </div>
            </div>

            <div className="card col-span-full">
              <div className="card-title">7. Attachments</div>
              <div className="fields">
                <Field label="Details PDF" required>
                  <div className="upload-zone" onClick={() => fileRef.current?.click()} onDragOver={handleDragOver} onDrop={handleDrop}>
                    <div className="upload-icon"><Icons.UploadCloud size={22} /></div>
                    {uploadedFile ? (
                      <div className="upload-label">
                        <strong>✓ {uploadedFile}</strong>
                        <p className="upload-sub">Click to replace</p>
                      </div>
                    ) : (
                      <div className="upload-label">
                        <strong>Click to upload</strong> or drag & drop
                        <p className="upload-sub">PDF only · Max 10MB</p>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="application/pdf" className="hidden-file" onChange={handleFileChange} />
                  </div>
                </Field>
                <p className="helper">Upload detailed information about the hackathon</p>
              </div>
            </div>

            <div className="notes-card col-span-full">
              <div className="notes-header">
                <div className="notes-icon"><Icons.Lightbulb size={15} /></div>
                <h3 className="notes-title">Important Notes</h3>
              </div>
              <ul className="notes-list">
                <li>All fields marked with <strong style={{ color: "var(--danger)" }}>*</strong> are required.</li>
                <li>Please review all information before creating the hackathon.</li>
                <li>You can save as draft and edit later.</li>
                <li>Once published, participants will be able to see this hackathon.</li>
              </ul>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}