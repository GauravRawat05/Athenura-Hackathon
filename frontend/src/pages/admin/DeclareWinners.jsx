import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Users, Award, FileBadge, Globe,
  Eye, ChevronDown, Info, CheckCircle2, Circle, Loader2,
  FileText, Send, Medal, X, Download, Check,
  AlertCircle, Clock, UserCheck, Printer,
  ExternalLink, ChevronRight, ChevronUp, Bell, Search,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const _s = document.createElement("style");
_s.textContent = ".sb-hide::-webkit-scrollbar{display:none}.sb-hide{-ms-overflow-style:none;scrollbar-width:none}";
document.head.appendChild(_s);
const WINNERS_INIT = [
  {
    pos: "Winner", rank: 1,
    gradFrom: "#f59e0b", gradTo: "#d97706",
    rankBadge: { text: "Highest", bg: "#d1fae5", color: "#065f46" },
    team: "AI Innovators", uni: "IIT Bombay",
    members: ["Rahul Sharma", "Priya Verma", "Amit Kumar", "Sneha Iyer"],
    project: "SmartAid - AI Powered Disaster Response",
    score: 89.25,
    description: "An AI-driven platform that accelerates disaster response by predicting affected zones, routing rescue teams, and automating resource allocation using satellite imagery and ML models.",
  },
  {
    pos: "Runner-up", rank: 2,
    gradFrom: "#94a3b8", gradTo: "#64748b",
    rankBadge: { text: "Second Highest", bg: "#dbeafe", color: "#1e40af" },
    team: "Code Crafters", uni: "IIIT Hyderabad",
    members: ["Arjun Patel", "Karan Mehta", "Neha Singh", "Rohan Das"],
    project: "MediScan - AI for Early Disease Detection",
    score: 85.40,
    description: "MediScan uses deep learning on medical imaging data to detect early-stage diseases with 94% accuracy, reducing diagnosis time by 60% and making screening accessible in rural areas.",
  },
  {
    pos: "2nd Runner-up", rank: 3,
    gradFrom: "#fb923c", gradTo: "#d97706",
    rankBadge: { text: "Third Highest", bg: "#ede9fe", color: "#5b21b6" },
    team: "Data Dynasty", uni: "BITS Pilani",
    members: ["Vikram Singh", "Ananya Iyer", "Pooja Nair", "Manish Gupta"],
    project: "InsightFlow - Data Analytics Platform",
    score: 82.15,
    description: "InsightFlow democratizes data analytics with a no-code platform that auto-generates dashboards, identifies trends, and provides natural-language query support for non-technical teams.",
  },
];

const ALL_TEAMS = [
  "AI Innovators", "Code Crafters", "Data Dynasty",
  "TechTitans", "ByteBuilders", "NeuralNinjas",
  "CloudCoders", "QuantumLeap", "HackHeroes", "DevStorm",
];

const TABS = ["Winners Selection", "Certificate Management", "Result Preview", "Publish Results"];

const TIMELINE_INIT = [
  { title: "Judging Completed", sub: "May 18, 2025 · 05:30 PM", status: "done" },
  { title: "Winners Selection", sub: "In Progress", status: "active" },
  { title: "Certificate Generation", sub: "Pending", status: "pending" },
  { title: "Results Publication", sub: "Pending", status: "pending" },
];

const DONUT_DATA = [
  { name: "Winners", value: 3, color: "#f59e0b" },
  { name: "Participants", value: 125, color: "#6366f1" },
  { name: "Special", value: 5, color: "#8b5cf6" },
];

const T = {
  navy: "#0f1f5c",
  navyLight: "#1e3a8a",
  accent: "#3b82f6",
  accentDark: "#1d4ed8",
  surface: "rgba(255,255,255,0.72)",
  border: "rgba(255,255,255,0.55)",
  bg: "linear-gradient(135deg, #ecfcff 0%, #f5feff 50%, #dff4ff 100%)",
  font: "'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
};
function Card({ children, style = {}, className = "" }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(15,31,92,0.06)",
        backdropFilter: "blur(16px)",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

function Badge({ children, bg = "#dbeafe", color = "#1e40af" }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999 }}>
      {children}
    </span>
  );
}

function RankCircle({ rank, gradFrom, gradTo, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 4px 12px ${gradFrom}55`,
    }}>
      {rank === 1
        ? <Medal size={size * 0.48} color="#fff" />
        : <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.38 }}>{rank}</span>}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.navy }}>{children}</h3>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>{sub}</p>}
    </div>
  );
}

function TeamDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "8px 12px", borderRadius: 10,
          border: "1.5px solid #e2e8f0", background: "rgba(255,255,255,0.8)",
          fontSize: 13, color: "#334155", cursor: "pointer", gap: 8,
        }}
      >
        <span style={{ fontWeight: 500 }}>{value}</span>
        {open ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            style={{
              position: "absolute", zIndex: 40, top: "calc(100% + 4px)", left: 0, right: 0,
              background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
            }}
          >
            {ALL_TEAMS.map(t => (
              <button
                key={t}
                onClick={() => { onChange(t); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "9px 12px", fontSize: 13, cursor: "pointer",
                  background: value === t ? "#eff6ff" : "transparent",
                  color: value === t ? T.accent : "#334155",
                  fontWeight: value === t ? 600 : 400, border: "none",
                }}
              >
                {value === t && <Check size={13} />}
                <span style={{ paddingLeft: value === t ? 0 : 20 }}>{t}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "rgba(15,31,92,0.25)", backdropFilter: "blur(6px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24, boxShadow: "0 24px 64px rgba(15,31,92,0.18)",
          padding: 28, width: "100%", maxWidth: 440, margin: "0 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.navy }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ padding: 6, borderRadius: 8, border: "none", background: "#f1f5f9", cursor: "pointer" }}
          >
            <X size={15} color="#64748b" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
function Toast({ message, type = "success", onClose }) {
  const map = { success: "#10b981", error: "#ef4444", info: "#3b82f6", warning: "#f59e0b" };
  const Icon = type === "success" ? Check : type === "error" ? X : type === "warning" ? AlertCircle : Bell;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 100,
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px", borderRadius: 14,
        background: map[type], color: "#fff",
        fontSize: 13, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <Icon size={15} />
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 6, opacity: 0.75, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
        <X size={13} />
      </button>
    </motion.div>
  );
}
function WinnersTab({ winners, onWinnerChange, onViewDetails }) {
  return (
    <div>
      <SectionTitle sub="Choose the winning teams for each position.">Select Winners</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {winners.map((w, idx) => (
          <motion.div
            key={w.pos}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            style={{
              border: "1.5px solid #e8eef8", borderRadius: 16, overflow: "hidden",
              background: "rgba(255,255,255,0.65)",
            }}
          >
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: 16, padding: "16px 20px", alignItems: "center",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <RankCircle rank={w.rank} gradFrom={w.gradFrom} gradTo={w.gradTo} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.navy }}>{w.pos}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>1 Position</div>
                </div>
              </div>

              <TeamDropdown value={w.team} onChange={val => onWinnerChange(idx, val)} />

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: -0.5 }}>
                  {w.score.toFixed(2)}
                </span>
                <Badge bg={w.rankBadge.bg} color={w.rankBadge.color}>{w.rankBadge.text}</Badge>
              </div>
              <button
                onClick={() => onViewDetails(w)}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: "1.5px solid #dbeafe",
                  background: "#eff6ff", color: T.accent, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Eye size={15} />
              </button>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 16, padding: "14px 20px", background: "#f8fafc",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Team Members
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {w.members.map(m => (
                    <span
                      key={m}
                      style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 999,
                        background: "#fff", border: "1px solid #e2e8f0", color: "#475569",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Project
                  </span>
                  <button
                    onClick={() => onViewDetails(w)}
                    style={{ fontSize: 11, color: T.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}
                  >
                    View Details <ChevronRight size={12} />
                  </button>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, lineHeight: 1.4 }}>{w.project}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{
        marginTop: 16, display: "flex", alignItems: "flex-start", gap: 10,
        padding: "12px 16px", borderRadius: 12, background: "#eff6ff",
        border: "1px solid #bfdbfe", fontSize: 13, color: "#1e40af",
      }}>
        <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Scores are calculated based on the evaluation criteria and judge reviews.</span>
      </div>
    </div>
  );
}

function CertificateTab({ certCount, onGenerate, generating }) {
  return (
    <div>
      <SectionTitle sub="Generate and manage certificates for all participants and winners.">
        Certificate Management
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Winner Certificates", count: 3, bg: "#fffbeb", border: "#fde68a", badge: "#d97706" },
          { label: "Participation Certificates", count: 125, bg: "#eff6ff", border: "#bfdbfe", badge: "#2563eb" },
          { label: "Special Awards", count: 5, bg: "#f5f3ff", border: "#ddd6fe", badge: "#7c3aed" },
        ].map(c => (
          <div
            key={c.label}
            style={{
              padding: "18px 16px", borderRadius: 14,
              background: c.bg, border: `1.5px solid ${c.border}`,
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.navy, lineHeight: 1 }}>{c.count}</div>
            <div style={{ marginTop: 10 }}>
              <Badge bg={c.bg} color={c.badge}>{certCount > 0 ? "Generated" : "Pending"}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "14px 16px", borderRadius: 12, border: "1px solid #e2e8f0",
        background: "rgba(255,255,255,0.7)", marginBottom: 12,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>Certificate Template</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>HackSphere 2025 — AI Revolution</div>
        </div>
        <Badge bg="#d1fae5" color="#065f46">Active</Badge>
      </div>

      <button
        onClick={onGenerate}
        disabled={generating}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "14px", borderRadius: 14,
          background: generating ? "#d1fae5" : "#10b981",
          color: "#fff", fontSize: 14, fontWeight: 600,
          border: "none", cursor: generating ? "default" : "pointer",
          boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
        }}
      >
        {generating
          ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating...</>
          : <><FileText size={16} /> Generate All Certificates (133)</>}
      </button>

      {certCount > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "12px", borderRadius: 14, marginTop: 10,
            background: "#eff6ff", color: T.accent, fontSize: 13, fontWeight: 600,
            border: "1.5px solid #bfdbfe", cursor: "pointer",
          }}
        >
          <Download size={15} /> Download All ({certCount})
        </motion.button>
      )}
    </div>
  );
}
function PreviewTab({ winners, published }) {
  return (
    <div>
      <SectionTitle sub="Preview how results will appear publicly before publishing.">
        Result Preview
      </SectionTitle>
      <div style={{ border: "2px dashed #cbd5e1", borderRadius: 16, padding: 20, background: "#f8fafc" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
          <Eye size={13} /> Public Preview
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.navy }}>AI Revolution 2025</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Official Results</div>
            {published && <Badge bg="#d1fae5" color="#065f46">Published</Badge>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {winners.map((w, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 14px", borderRadius: 12, background: "#f8fafc",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${w.gradFrom}, ${w.gradTo})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>{w.team}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.project}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>{w.score.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{w.pos}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {[{ icon: Printer, label: "Print Preview" }, { icon: ExternalLink, label: "Open Full Preview" }].map(({ icon: Icon, label }) => (
          <button
            key={label}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px", borderRadius: 12, border: "1.5px solid #e2e8f0",
              background: "rgba(255,255,255,0.8)", fontSize: 13, color: "#475569",
              cursor: "pointer", fontWeight: 500,
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PublishTab({ published, onPublish, publishing }) {
  const checks = [
    { label: "Winners finalized", done: true },
    { label: "Certificates generated", done: false },
    { label: "Results previewed", done: true },
  ];
  return (
    <div>
      <SectionTitle sub="Make the results visible to all participants and the public.">
        Publish Results
      </SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {checks.map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: item.done ? "#f0fdf4" : "#fffbeb" }}>
            {item.done
              ? <CheckCircle2 size={18} color="#10b981" />
              : <AlertCircle size={18} color="#f59e0b" />}
            <span style={{ fontSize: 13, color: item.done ? "#15803d" : "#92400e", fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{
        padding: "14px 16px", borderRadius: 12, background: "#fffbeb",
        border: "1px solid #fde68a", marginBottom: 20,
        display: "flex", alignItems: "flex-start", gap: 10,
        fontSize: 13, color: "#78350f",
      }}>
        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Publishing results is <strong>irreversible</strong>. Please ensure all information is correct before proceeding.</span>
      </div>

      <button
        onClick={onPublish}
        disabled={published || publishing}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "15px",
          borderRadius: 14, fontSize: 14, fontWeight: 700, border: "none",
          cursor: published || publishing ? "default" : "pointer",
          background: published
            ? "#d1fae5"
            : `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
          color: published ? "#065f46" : "#fff",
          boxShadow: published ? "none" : "0 6px 20px rgba(59,130,246,0.35)",
        }}
      >
        {publishing
          ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Publishing...</>
          : published
            ? <><CheckCircle2 size={16} /> Results Published!</>
            : <><Send size={16} /> Publish Results Now</>}
      </button>
    </div>
  );
}
function ResultSummary({ winners, certCount, published, onViewDetails, onReset, onGenerateCerts, onPreview, onPublish }) {
  const rows = [
    { icon: Users, label: "Total Teams", value: "128" },
    { icon: Award, label: "Winners Selected", value: "3 / 3" },
    { icon: FileBadge, label: "Certs Generated", value: certCount > 0 ? String(certCount) : "0" },
    { icon: Clock, label: "Deadline", value: "May 20, 2025" },
  ];
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Result Summary</span>
        <button
          onClick={onReset}
          style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, border: "1px solid #e2e8f0", color: "#64748b", background: "#f8fafc", cursor: "pointer" }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {winners.map(w => (
          <button
            key={w.rank}
            onClick={() => onViewDetails(w)}
            title={w.team}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${w.gradFrom}, ${w.gradTo})`,
              border: "none", cursor: "pointer", color: "#fff",
              fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 3px 10px ${w.gradFrom}44`,
            }}
          >
            {w.rank}
          </button>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
        borderRadius: 14, background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
        border: "1.5px solid #fde68a", marginBottom: 16,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${winners[0].gradFrom}, ${winners[0].gradTo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 14px ${winners[0].gradFrom}55`,
        }}>
          <Medal size={22} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>{winners[0].team}</div>
          <div style={{ fontSize: 11, color: "#92400e", marginTop: 2 }}>{winners[0].uni}</div>
          <Badge bg="#fef9c3" color="#713f12">Winner</Badge>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 0", borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12 }}>
              <row.icon size={14} />
              <span>{row.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{row.value}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12 }}>
            <Globe size={14} /><span>Status</span>
          </div>
          <Badge bg={published ? "#d1fae5" : "#fef3c7"} color={published ? "#065f46" : "#92400e"}>
            {published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={onGenerateCerts}
            style={{
              padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff", fontSize: 12, fontWeight: 600,
              boxShadow: "0 3px 10px rgba(16,185,129,0.3)",
            }}
          >
            Generate Certs
          </button>
          <button
            onClick={onPreview}
            style={{
              padding: "9px 0", borderRadius: 10, border: "1.5px solid #e2e8f0",
              cursor: "pointer", background: "rgba(255,255,255,0.8)",
              color: "#475569", fontSize: 12, fontWeight: 600,
            }}
          >
            Preview
          </button>
          <button
            onClick={onReset}
            style={{
              gridColumn: "1 / -1", padding: "9px 0", borderRadius: 10,
              border: "1.5px solid #fecaca", cursor: "pointer",
              background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 600,
            }}
          >
            Reset All
          </button>
        </div>
      </div>
    </Card>
  );
}

function CertificateProgress({ certCount, onManage }) {
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 16 }}>Certificate Progress</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DONUT_DATA} innerRadius={32} outerRadius={48} paddingAngle={3} dataKey="value" stroke="none">
                {DONUT_DATA.map(d => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={v => v} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", pointerEvents: "none",
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>133</span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>Total</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Winners", color: "#f59e0b", val: "3 (2%)" },
            { label: "Participants", color: "#6366f1", val: "125 (94%)" },
            { label: "Special", color: "#8b5cf6", val: "5 (4%)" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>{r.label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onManage}
        style={{
          marginTop: 14, width: "100%", padding: "9px 0", borderRadius: 10,
          border: "1.5px solid #e2e8f0", background: "rgba(255,255,255,0.8)",
          fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer",
        }}
      >
        Manage Certificates
      </button>
    </Card>
  );
}

function ResultTimeline({ timeline, onExport }) {
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 16 }}>Result Timeline</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {timeline.map((t, i) => (
          <div key={t.title} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {t.status === "done"
                ? <CheckCircle2 size={18} color="#10b981" />
                : t.status === "active"
                  ? <Loader2 size={18} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
                  : <Circle size={18} color="#cbd5e1" />}
              {i < timeline.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 20, background: i === 0 ? "#10b981" : "#e2e8f0", margin: "4px 0 4px" }} />
              )}
            </div>
            <div style={{ paddingBottom: i < timeline.length - 1 ? 14 : 0, paddingTop: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{t.title}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{t.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onExport}
        style={{
          marginTop: 14, width: "100%", padding: "9px 0", borderRadius: 10,
          background: "#eff6ff", color: T.accent, fontSize: 12, fontWeight: 600,
          border: "1.5px solid #bfdbfe", cursor: "pointer",
        }}
      >
        Export Timeline
      </button>
    </Card>
  );
}

function TopScores({ winners, onViewAll, onPublish }) {
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Top Scores</span>
        <button onClick={onViewAll} style={{ fontSize: 11, color: T.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View All</button>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>Leaderboard — Top 3 teams</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {winners.map(w => (
          <div
            key={w.rank}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 12, background: "#f8fafc",
              border: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: `linear-gradient(135deg, ${w.gradFrom}, ${w.gradTo})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, fontWeight: 700,
              }}>
                {w.rank}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{w.team}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score.toFixed(2)}</span>
              <Badge bg={w.rankBadge.bg} color={w.rankBadge.color}>{w.pos}</Badge>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onPublish}
        style={{
          marginTop: 12, width: "100%", padding: "10px 0", borderRadius: 10,
          background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
          color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
          boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
        }}
      >
        Publish Results
      </button>
    </Card>
  );
}
export default function ResultDeclaration() {
  const [activeTab, setActiveTab] = useState(0);
  const [winners, setWinners] = useState(WINNERS_INIT);
  const [timeline, setTimeline] = useState(TIMELINE_INIT);
  const [certCount, setCertCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const resultStatus = published ? "Published" : "Draft";

  const stats = [
    { label: "Hackathon", value: "AI Revolution 2025", delta: "Active", deltaOk: true, icon: Trophy, iconBg: "#dbeafe", iconColor: "#2563eb" },
    { label: "Total Teams", value: "128", delta: "Teams participated", deltaOk: null, icon: Users, iconBg: "#ccfbf1", iconColor: "#0f766e" },
    { label: "Winners", value: "3", delta: "Positions filled", deltaOk: null, icon: Award, iconBg: "#ede9fe", iconColor: "#7c3aed" },
    { label: "Certificates", value: String(certCount), delta: certCount > 0 ? "Certificates ready" : "Not generated", deltaOk: certCount > 0, icon: FileBadge, iconBg: "#e0f2fe", iconColor: "#0284c7" },
    { label: "Result Status", value: resultStatus, delta: published ? "Visible to all" : "Not published", deltaOk: published, icon: Globe, iconBg: "#dcfce7", iconColor: "#15803d" },
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleWinnerChange = (idx, teamName) => {
    setWinners(prev => prev.map((w, i) => i === idx ? { ...w, team: teamName } : w));
    showToast(`Winner updated: ${teamName}`, "info");
  };

  const handleViewDetails = (w) => setModal({ type: "details", data: w });

  const handleGenerateCerts = async () => {
    setGenerating(true);
    setActiveTab(1);
    await new Promise(r => setTimeout(r, 2000));
    setCertCount(133);
    setGenerating(false);
    setTimeline(prev => prev.map(t =>
      t.title === "Certificate Generation" ? { ...t, sub: "Completed", status: "done" } : t
    ));
    showToast("133 certificates generated successfully!");
  };

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 2500));
    setPublishing(false);
    setPublished(true);
    setTimeline(prev => prev.map(t =>
      t.title === "Winners Selection" ? { ...t, sub: "Completed", status: "done" } :
      t.title === "Results Publication" ? { ...t, sub: new Date().toLocaleString(), status: "done" } : t
    ));
    showToast("Results published successfully! 🎉");
  };

  const handleReset = () => {
    setWinners(WINNERS_INIT);
    setTimeline(TIMELINE_INIT);
    setPublished(false);
    setCertCount(0);
    setActiveTab(0);
    showToast("Reset to defaults", "info");
  };

  return (
    <div style={{
      minHeight: "100vh", fontFamily: T.font,
      background: T.bg, color: "#334155",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        button { font-family: inherit; transition: opacity 0.15s, transform 0.15s; }
        button:hover:not(:disabled) { opacity: 0.88; }
        button:active:not(:disabled) { transform: scale(0.97); }
      `}</style>

      <div style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.navy }}>Result Declaration</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Select winners, generate certificates, and publish results.</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={15} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              style={{
                padding: "9px 14px 9px 34px", borderRadius: 24, border: "1.5px solid #e2e8f0",
                background: "rgba(255,255,255,0.8)", fontSize: 13, color: "#334155",
                outline: "none", width: 240,
              }}
            />
          </div>
          <button style={{ padding: 8, borderRadius: 10, border: "1px solid #e2e8f0", background: "rgba(255,255,255,0.8)", cursor: "pointer", position: "relative" }}>
            <Bell size={18} color="#64748b" />
            <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", border: "2px solid #fff" }} />
          </button>
          <img src="https://i.pravatar.cc/80" alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <s.icon size={20} color={s.iconColor} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: T.navy, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
                    <div style={{ fontSize: 11, marginTop: 4, color: s.deltaOk === true ? "#10b981" : s.deltaOk === false ? "#f59e0b" : "#94a3b8", fontWeight: 500 }}>{s.delta}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 20 }}>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
                  borderRadius: 12, background: "rgba(255,255,255,0.9)", border: "1.5px solid #e2e8f0",
                }}>
                  <Trophy size={15} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: "#94a3b8", fontWeight: 600 }}>Hackathon</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>AI Revolution 2025</div>
                  </div>
                  <Badge bg="#d1fae5" color="#065f46">Active</Badge>
                </div>
                <button
                  onClick={() => setActiveTab(3)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                    borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
                    color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                  }}
                >
                  <Send size={14} /> Publish Results
                </button>
              </div>

              <div style={{ display: "flex", borderBottom: "2px solid #f1f5f9", gap: 0, marginBottom: 24 }}>
                {TABS.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(i)}
                    style={{
                      padding: "10px 16px", fontSize: 13, fontWeight: activeTab === i ? 700 : 500,
                      color: activeTab === i ? T.accent : "#94a3b8",
                      borderBottom: activeTab === i ? `2.5px solid ${T.accent}` : "2.5px solid transparent",
                      marginBottom: -2, background: "none", border: "none",
                      borderBottomStyle: "solid",
                      cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {activeTab === 0 && <WinnersTab winners={winners} onWinnerChange={handleWinnerChange} onViewDetails={handleViewDetails} />}
                  {activeTab === 1 && <CertificateTab certCount={certCount} onGenerate={handleGenerateCerts} generating={generating} />}
                  {activeTab === 2 && <PreviewTab winners={winners} published={published} />}
                  {activeTab === 3 && <PublishTab published={published} onPublish={handlePublish} publishing={publishing} />}
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <ResultSummary
              winners={winners}
              certCount={certCount}
              published={published}
              onViewDetails={handleViewDetails}
              onReset={handleReset}
              onGenerateCerts={handleGenerateCerts}
              onPreview={() => setActiveTab(2)}
              onPublish={() => setActiveTab(3)}
            />
          </motion.div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <CertificateProgress certCount={certCount} onManage={() => setActiveTab(1)} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <ResultTimeline timeline={timeline} onExport={() => showToast("Timeline exported!", "success")} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <TopScores
              winners={winners}
              onViewAll={() => setModal({ type: "allScores" })}
              onPublish={() => setActiveTab(3)}
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {modal?.type === "details" && (
          <Modal title="Team Details" onClose={() => setModal(null)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <RankCircle rank={modal.data.rank} gradFrom={modal.data.gradFrom} gradTo={modal.data.gradTo} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: T.navy }}>{modal.data.team}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{modal.data.uni}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: T.navy }}>{modal.data.score.toFixed(2)}</div>
                  <Badge bg={modal.data.rankBadge.bg} color={modal.data.rankBadge.color}>{modal.data.pos}</Badge>
                </div>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Project</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 8 }}>{modal.data.project}</div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{modal.data.description}</p>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Team Members</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {modal.data.members.map(m => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, color: "#475569" }}>
                      <UserCheck size={12} color={T.accent} /> {m}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setModal(null)}
                style={{
                  padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
                  color: "#fff", fontSize: 14, fontWeight: 700,
                }}
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {modal?.type === "allScores" && (
          <Modal title="Leaderboard" onClose={() => setModal(null)}>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Final scores for all top teams.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {winners.map(w => (
                <div key={w.rank} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${w.gradFrom}, ${w.gradTo})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>{w.rank}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{w.team}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score.toFixed(2)}</span>
                    <Badge bg={w.rankBadge.bg} color={w.rankBadge.color}>{w.pos}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModal(null)}
              style={{ float: "right", padding: "9px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Close
            </button>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}