import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Users, Award, FileBadge, Globe,
  Eye, ChevronDown, Info, CheckCircle2, Circle, Loader2,
  FileText, Send, Medal, X, Download, Check,
  AlertCircle, Clock, UserCheck, Printer,
  ExternalLink, ChevronRight, ChevronUp, Bell,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const _style = document.createElement("style");
_style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { 
    width: 100%; 
    max-width: 100%; 
    overflow-x: hidden; 
  }
  .sb-hide::-webkit-scrollbar { display: none; }
  .sb-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  button { font-family: inherit; transition: opacity .15s, transform .15s; border:none; cursor:pointer; }
  button:hover:not(:disabled) { opacity: .88; }
  button:active:not(:disabled) { transform: scale(.97); }
  img, svg, video, canvas { max-width: 100%; height: auto; }
`;
document.head.appendChild(_style);

const WINNERS_INIT = [
  {
    pos: "Winner", rank: 1,
    gradFrom: "#f59e0b", gradTo: "#d97706",
    rankBadge: { text: "Highest", bg: "#d1fae5", color: "#065f46" },
    team: "AI Innovators", uni: "IIT Bombay",
    members: ["Rahul Sharma", "Priya Verma", "Amit Kumar", "Sneha Iyer"],
    project: "SmartAid – AI Powered Disaster Response",
    score: 89.25,
    description: "An AI-driven platform that accelerates disaster response by predicting affected zones, routing rescue teams, and automating resource allocation using satellite imagery and ML models.",
  },
  {
    pos: "Runner-up", rank: 2,
    gradFrom: "#94a3b8", gradTo: "#64748b",
    rankBadge: { text: "2nd Highest", bg: "#dbeafe", color: "#1e40af" },
    team: "Code Crafters", uni: "IIIT Hyderabad",
    members: ["Arjun Patel", "Karan Mehta", "Neha Singh", "Rohan Das"],
    project: "MediScan – AI for Early Disease Detection",
    score: 85.40,
    description: "MediScan uses deep learning on medical imaging data to detect early-stage diseases with 94% accuracy, reducing diagnosis time by 60%.",
  },
  {
    pos: "2nd Runner-up", rank: 3,
    gradFrom: "#fb923c", gradTo: "#d97706",
    rankBadge: { text: "3rd Highest", bg: "#ede9fe", color: "#5b21b6" },
    team: "Data Dynasty", uni: "BITS Pilani",
    members: ["Vikram Singh", "Ananya Iyer", "Pooja Nair", "Manish Gupta"],
    project: "InsightFlow – Data Analytics Platform",
    score: 82.15,
    description: "InsightFlow democratizes data analytics with a no-code platform that auto-generates dashboards, identifies trends, and provides natural-language query support.",
  },
];

const ALL_TEAMS = [
  "AI Innovators", "Code Crafters", "Data Dynasty",
  "TechTitans", "ByteBuilders", "NeuralNinjas",
  "CloudCoders", "QuantumLeap", "HackHeroes", "DevStorm",
];

const TABS_SHORT = ["Winners", "Certs", "Preview", "Publish"];
const TABS_LONG  = ["Winners Selection", "Certificate Mgmt", "Result Preview", "Publish Results"];

const TIMELINE_INIT = [
  { title: "Judging Completed",    sub: "May 18, 2026 · 05:30 PM", status: "done"    },
  { title: "Winners Selection",    sub: "In Progress",              status: "active"  },
  { title: "Certificate Generation", sub: "Pending",               status: "pending" },
  { title: "Results Publication",  sub: "Pending",                  status: "pending" },
];

const DONUT_DATA = [
  { name: "Winners",      value: 3,   color: "#f59e0b" },
  { name: "Participants", value: 125, color: "#6366f1" },
  { name: "Special",      value: 5,   color: "#8b5cf6" },
];

const T = {
  navy:      "#0f1f5c",
  accent:    "#3b82f6",
  accentDk:  "#1d4ed8",
  surface:   "rgba(255,255,255,0.76)",
  border:    "rgba(255,255,255,0.58)",
  bg:        "linear-gradient(135deg,#ecfcff 0%,#f5feff 50%,#dff4ff 100%)",
  font:      "'DM Sans','Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",
};

function useBreakpoint() {
  const getW = () => (typeof window !== "undefined" ? window.innerWidth : 1200);
  const [w, setW] = useState(getW);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return {
    w,
    isXS:   w < 480,
    isSM:   w >= 480 && w < 640,
    isMD:   w >= 640 && w < 900,
    isLG:   w >= 900 && w < 1100,
    isXL:   w >= 1100,
    isMobile: w < 640,
    isTablet: w >= 640 && w < 1100,
  };
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 20, boxShadow: "0 4px 24px rgba(15,31,92,.06)",
      backdropFilter: "blur(16px)", minWidth: 0, ...style,
    }}>
      {children}
    </div>
  );
}

function Badge({ children, bg = "#dbeafe", color = "#1e40af" }) {
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 600,
      padding: "2px 9px", borderRadius: 999, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function RankCircle({ rank, gradFrom, gradTo, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 4px 12px ${gradFrom}55`,
    }}>
      {rank === 1
        ? <Medal size={size * .48} color="#fff" />
        : <span style={{ color: "#fff", fontWeight: 700, fontSize: size * .38 }}>{rank}</span>}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: "clamp(14px,2vw,16px)", fontWeight: 700, color: T.navy }}>{children}</h3>
      {sub && <p style={{ marginTop: 4, fontSize: "clamp(11px,1.5vw,12px)", color: "#64748b" }}>{sub}</p>}
    </div>
  );
}

function TeamDropdown({ value, onChange, uid, openUid, setOpenUid }) {
  const btnRef = useRef(null);
  const isOpen = openUid === uid;
  const [rect, setRect] = useState(null);

  const toggle = (e) => {
    e.stopPropagation();
    if (isOpen) { setOpenUid(null); return; }
    setOpenUid(uid);
  };

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setRect(r);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = () => setOpenUid(null);
    window.addEventListener("scroll", h, true);
    return () => window.removeEventListener("scroll", h, true);
  }, [isOpen]);

  const adjustedLeft = rect
    ? Math.min(rect.left, window.innerWidth - rect.width - 8)
    : 0;

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "8px 12px", borderRadius: 10,
          border: `1.5px solid ${isOpen ? T.accent : "#e2e8f0"}`,
          background: "rgba(255,255,255,.85)", fontSize: 13, color: "#334155",
          gap: 8, outline: "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
          {value}
        </span>
        {isOpen
          ? <ChevronUp size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
          : <ChevronDown size={14} color="#94a3b8" style={{ flexShrink: 0 }} />}
      </button>

      <AnimatePresence>
        {isOpen && rect && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: .95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: .95 }}
            transition={{ duration: .15 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "fixed",
              top: rect.bottom + 4,
              left: adjustedLeft,
              width: Math.min(rect.width, 320),
              zIndex: 99999,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 40px rgba(0,0,0,.15)",
              overflow: "hidden",
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {ALL_TEAMS.map(t => (
              <button
                key={t}
                onClick={() => { onChange(t); setOpenUid(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: "9px 12px",
                  fontSize: 13, background: t === value ? "#eff6ff" : "transparent",
                  color: t === value ? T.accent : "#334155",
                  fontWeight: t === value ? 600 : 400,
                  transition: "background .1s",
                }}
              >
                {t === value
                  ? <Check size={13} style={{ flexShrink: 0 }} />
                  : <span style={{ width: 13, flexShrink: 0 }} />}
                {t}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(15,31,92,.28)", backdropFilter: "blur(6px)", padding: 16,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: .96 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24,
          padding: "clamp(16px,3vw,28px)",
          width: "100%", maxWidth: "min(95vw, 500px)", maxHeight: "90dvh",
          overflowY: "auto", boxShadow: "0 24px 64px rgba(15,31,92,.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.navy }}>{title}</h3>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, background: "#f1f5f9" }}>
            <X size={15} color="#64748b" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  const colors = { success: "#10b981", error: "#ef4444", info: "#3b82f6", warning: "#f59e0b" };
  const Icon = { success: Check, error: X, warning: AlertCircle, info: Bell }[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 99998, display: "flex", alignItems: "center", gap: 10,
        padding: "11px 16px", borderRadius: 14, background: colors[type],
        color: "#fff", fontSize: 13, fontWeight: 500,
        boxShadow: "0 8px 32px rgba(0,0,0,.18)", whiteSpace: "nowrap",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <Icon size={15} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{message}</span>
      <button onClick={onClose} style={{ opacity: .75, color: "#fff", background: "none", marginLeft: 4 }}>
        <X size={13} />
      </button>
    </motion.div>
  );
}

function WinnerCard({ w, idx, onWinnerChange, onViewDetails, openUid, setOpenUid, compact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * .06 }}
      style={{
        border: "1.5px solid #e8eef8", borderRadius: 16,
        background: "rgba(255,255,255,.7)", overflow: "visible",
        marginBottom: compact ? 10 : 14, minWidth: 0,
      }}
    >
      {/* Top row */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        gap: 12, padding: compact ? "12px 14px" : "14px 18px",
        borderBottom: "1px solid #f1f5f9",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "1 1 120px" }}>
          <RankCircle rank={w.rank} gradFrom={w.gradFrom} gradTo={w.gradTo} size={compact ? 34 : 38} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: compact ? 13 : 14, color: T.navy, whiteSpace: "nowrap" }}>{w.pos}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>1 position</div>
          </div>
        </div>

        <div style={{ flex: "1 1 140px", minWidth: 130, maxWidth: 260 }}>
          <TeamDropdown
            value={w.team}
            onChange={val => onWinnerChange(idx, val)}
            uid={`wc-${idx}`}
            openUid={openUid}
            setOpenUid={setOpenUid}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: compact ? 18 : 22, fontWeight: 800, color: T.navy, lineHeight: 1 }}>
              {w.score.toFixed(2)}
            </div>
            <div style={{ marginTop: 4 }}>
              <Badge bg={w.rankBadge.bg} color={w.rankBadge.color}>{w.rankBadge.text}</Badge>
            </div>
          </div>
          <button
            onClick={() => onViewDetails(w)}
            style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              border: "1.5px solid #dbeafe", background: "#eff6ff", color: T.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "minmax(0,1fr) minmax(0,1fr)",
        gap: 14, padding: compact ? "12px 14px" : "12px 18px",
        background: "#f8fafc", borderRadius: "0 0 14px 14px",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .6, marginBottom: 7 }}>
            Team Members
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {w.members.map(m => (
              <span key={m} style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 999,
                background: "#fff", border: "1px solid #e2e8f0", color: "#475569",
                whiteSpace: "nowrap",
              }}>{m}</span>
            ))}
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .6 }}>
              Project
            </span>
            <button
              onClick={() => onViewDetails(w)}
              style={{ fontSize: 11, color: T.accent, fontWeight: 600, background: "none", display: "flex", alignItems: "center", gap: 2 }}
            >
              Details <ChevronRight size={11} />
            </button>
          </div>
          <div style={{
            fontSize: compact ? 12 : 13, fontWeight: 600, color: T.navy, lineHeight: 1.45,
            overflowWrap: "break-word", wordBreak: "break-word",
          }}>
            {w.project}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WinnersTab({ winners, onWinnerChange, onViewDetails, compact, openUid, setOpenUid }) {
  return (
    <div>
      <SectionTitle sub="Choose the winning team for each position.">Select Winners</SectionTitle>
      {winners.map((w, idx) => (
        <WinnerCard
          key={w.pos} w={w} idx={idx}
          onWinnerChange={onWinnerChange}
          onViewDetails={onViewDetails}
          compact={compact}
          openUid={openUid}
          setOpenUid={setOpenUid}
        />
      ))}
      <div style={{
        marginTop: 8, display: "flex", alignItems: "flex-start", gap: 10,
        padding: "11px 14px", borderRadius: 12, background: "#eff6ff",
        border: "1px solid #bfdbfe", fontSize: "clamp(12px,2vw,13px)", color: "#1e40af",
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Scores are calculated based on evaluation criteria and judge reviews.</span>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Winner Certs",  count: 3,   bg: "#fffbeb", border: "#fde68a", badge: "#d97706" },
          { label: "Participation", count: 125, bg: "#eff6ff", border: "#bfdbfe", badge: "#2563eb" },
          { label: "Special",       count: 5,   bg: "#f5f3ff", border: "#ddd6fe", badge: "#7c3aed" },
        ].map(c => (
          <div key={c.label} style={{
            padding: "12px 10px", borderRadius: 14, background: c.bg,
            border: `1.5px solid ${c.border}`, minWidth: 0,
          }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.navy, lineHeight: 1 }}>{c.count}</div>
            <div style={{ marginTop: 8 }}>
              <Badge bg={c.bg} color={c.badge}>{certCount > 0 ? "Generated" : "Pending"}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "13px 14px", borderRadius: 12, border: "1px solid #e2e8f0",
        background: "rgba(255,255,255,.7)", marginBottom: 12,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        flexWrap: "wrap", minWidth: 0,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>Certificate Template</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>HackSphere 2026 — AI Revolution</div>
        </div>
        <Badge bg="#d1fae5" color="#065f46">Active</Badge>
      </div>

      <button
        onClick={onGenerate} disabled={generating}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "13px", borderRadius: 14,
          background: generating ? "#d1fae5" : "#10b981", color: "#fff",
          fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(16,185,129,.3)",
          whiteSpace: "nowrap",
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
            width: "100%", padding: "11px", borderRadius: 14, marginTop: 10,
            background: "#eff6ff", color: T.accent, fontSize: 13, fontWeight: 600,
            border: `1.5px solid #bfdbfe`, whiteSpace: "nowrap",
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
      <SectionTitle sub="Preview how results appear publicly before publishing.">Result Preview</SectionTitle>
      <div style={{
        border: "2px dashed #cbd5e1", borderRadius: 16, padding: 16,
        background: "#f8fafc", minWidth: 0, overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
          <Eye size={13} /> Public Preview
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)", minWidth: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>AI Revolution 2026</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Official Results</div>
            {published && <div style={{ marginTop: 6 }}><Badge bg="#d1fae5" color="#065f46">Published</Badge></div>}
          </div>
          {winners.map((w, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12, background: "#f8fafc",
              marginBottom: i < winners.length - 1 ? 8 : 0, flexWrap: "wrap",
              minWidth: 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>
                {["🥇","🥈","🥉"][i]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.team}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.project}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{w.pos}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        {[{ icon: Printer, label: "Print Preview" }, { icon: ExternalLink, label: "Full Preview" }].map(({ icon: Icon, label }) => (
          <button key={label} style={{
            flex: "1 1 120px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "10px", borderRadius: 12, border: "1.5px solid #e2e8f0",
            background: "rgba(255,255,255,.8)", fontSize: 12, color: "#475569", fontWeight: 500,
            whiteSpace: "nowrap",
          }}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PublishTab({ published, onPublish, publishing }) {
  const checks = [
    { label: "Winners finalized",      done: true  },
    { label: "Certificates generated", done: false },
    { label: "Results previewed",      done: true  },
  ];
  return (
    <div>
      <SectionTitle sub="Make results visible to all participants and the public.">Publish Results</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {checks.map(item => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            borderRadius: 10, background: item.done ? "#f0fdf4" : "#fffbeb",
            flexWrap: "wrap", minWidth: 0,
          }}>
            {item.done
              ? <CheckCircle2 size={18} color="#10b981" />
              : <AlertCircle size={18} color="#f59e0b" />}
            <span style={{ fontSize: 13, color: item.done ? "#15803d" : "#92400e", fontWeight: 500 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        padding: "13px 14px", borderRadius: 12, background: "#fffbeb",
        border: "1px solid #fde68a", marginBottom: 18,
        display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#78350f",
        flexWrap: "wrap",
      }}>
        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Publishing is <strong>irreversible</strong>. Ensure all info is correct before proceeding.</span>
      </div>
      <button
        onClick={onPublish} disabled={published || publishing}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 700,
          background: published ? "#d1fae5" : `linear-gradient(135deg,${T.accent},${T.accentDk})`,
          color: published ? "#065f46" : "#fff",
          boxShadow: published ? "none" : "0 6px 20px rgba(59,130,246,.35)",
          whiteSpace: "nowrap",
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
    { icon: Users,     label: "Total Teams",     value: "128" },
    { icon: Award,     label: "Winners",          value: "3 / 3" },
    { icon: FileBadge, label: "Certs Generated",  value: certCount > 0 ? String(certCount) : "0" },
    { icon: Clock,     label: "Deadline",         value: "May 20, 2026" },
  ];
  return (
    <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0, maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Result Summary</span>
        <button onClick={onReset} style={{
          fontSize: 12, padding: "4px 11px", borderRadius: 8,
          border: "1px solid #e2e8f0", color: "#64748b", background: "#f8fafc",
          whiteSpace: "nowrap",
        }}>Reset</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {winners.map(w => (
          <button key={w.rank} onClick={() => onViewDetails(w)} title={w.team} style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`,
            color: "#fff", fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 3px 10px ${w.gradFrom}44`,
          }}>{w.rank}</button>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 13px", borderRadius: 14,
        background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
        border: "1.5px solid #fde68a", marginBottom: 14,
        flexWrap: "wrap", minWidth: 0,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: `linear-gradient(135deg,${winners[0].gradFrom},${winners[0].gradTo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 14px ${winners[0].gradFrom}55`,
        }}>
          <Medal size={20} color="#fff" />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{winners[0].team}</div>
          <div style={{ fontSize: 11, color: "#92400e", marginTop: 1 }}>{winners[0].uni}</div>
          <Badge bg="#fef9c3" color="#713f12">Winner</Badge>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px solid #f1f5f9" : "none",
            minWidth: 0, flexWrap: "wrap", gap: 4,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12, minWidth: 0 }}>
              <row.icon size={13} /><span style={{ whiteSpace: "nowrap" }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{row.value}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", flexWrap: "wrap", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12 }}>
            <Globe size={13} /><span>Status</span>
          </div>
          <Badge bg={published ? "#d1fae5" : "#fef3c7"} color={published ? "#065f46" : "#92400e"}>
            {published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .6, marginBottom: 10 }}>
          Quick Actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={onGenerateCerts} style={{
            padding: "9px 0", borderRadius: 10,
            background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff",
            fontSize: 12, fontWeight: 600, boxShadow: "0 3px 10px rgba(16,185,129,.3)",
            whiteSpace: "nowrap",
          }}>Generate</button>
          <button onClick={onPreview} style={{
            padding: "9px 0", borderRadius: 10,
            border: "1.5px solid #e2e8f0", background: "rgba(255,255,255,.8)",
            color: "#475569", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
          }}>Preview</button>
          <button onClick={onReset} style={{
            gridColumn: "1 / -1", padding: "9px 0", borderRadius: 10,
            border: "1.5px solid #fecaca", background: "#fef2f2", color: "#dc2626",
            fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
          }}>Reset All</button>
        </div>
      </div>
    </Card>
  );
}

function CertificateProgress({ certCount, onManage }) {
  return (
    <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 14 }}>Certificate Progress</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DONUT_DATA} innerRadius={26} outerRadius={40} paddingAngle={3} dataKey="value" stroke="none">
                {DONUT_DATA.map(d => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={v => v} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>133</span>
            <span style={{ fontSize: 9, color: "#94a3b8" }}>Total</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
          {[
            { label: "Winners",      color: "#f59e0b", val: "3 (2%)"   },
            { label: "Participants", color: "#6366f1", val: "125 (94%)" },
            { label: "Special",      color: "#8b5cf6", val: "5 (4%)"   },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>{r.label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onManage} style={{
        marginTop: 14, width: "100%", padding: "9px 0", borderRadius: 10,
        border: "1.5px solid #e2e8f0", background: "rgba(255,255,255,.8)",
        fontSize: 12, fontWeight: 600, color: "#475569", whiteSpace: "nowrap",
      }}>Manage Certificates</button>
    </Card>
  );
}

function ResultTimeline({ timeline, onExport }) {
  return (
    <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 14 }}>Result Timeline</div>
      {timeline.map((t, i) => (
        <div key={t.title} style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {t.status === "done"
              ? <CheckCircle2 size={18} color="#10b981" />
              : t.status === "active"
                ? <Loader2 size={18} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
                : <Circle size={18} color="#cbd5e1" />}
            {i < timeline.length - 1 && (
              <div style={{ width: 2, flex: 1, minHeight: 18, background: i === 0 ? "#10b981" : "#e2e8f0", margin: "4px 0" }} />
            )}
          </div>
          <div style={{ paddingBottom: i < timeline.length - 1 ? 14 : 0, paddingTop: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{t.title}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{t.sub}</div>
          </div>
        </div>
      ))}
      <button onClick={onExport} style={{
        marginTop: 14, width: "100%", padding: "9px 0", borderRadius: 10,
        background: "#eff6ff", color: T.accent, fontSize: 12, fontWeight: 600,
        border: `1.5px solid #bfdbfe`, whiteSpace: "nowrap",
      }}>Export Timeline</button>
    </Card>
  );
}

function TopScores({ winners, onViewAll, onPublish }) {
  return (
    <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Top Scores</span>
        <button onClick={onViewAll} style={{ fontSize: 11, color: T.accent, fontWeight: 600, background: "none", whiteSpace: "nowrap" }}>View All</button>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>Leaderboard — Top 3 teams</div>
      {winners.map(w => (
        <div key={w.rank} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 12px", borderRadius: 12, background: "#f8fafc",
          border: "1px solid #f1f5f9", marginBottom: 8,
          flexWrap: "wrap", gap: 8, minWidth: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{w.rank}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.team}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score.toFixed(2)}</span>
            <Badge bg={w.rankBadge.bg} color={w.rankBadge.color}>{w.pos}</Badge>
          </div>
        </div>
      ))}
      <button onClick={onPublish} style={{
        marginTop: 4, width: "100%", padding: "10px 0", borderRadius: 10,
        background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff",
        fontSize: 13, fontWeight: 600, boxShadow: "0 4px 14px rgba(59,130,246,.3)",
        whiteSpace: "nowrap",
      }}>Publish Results</button>
    </Card>
  );
}

function MobileSheet({ winners, certCount, published, onReset, onGenerateCerts, onPreview, onPublish }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: T.surface, backdropFilter: "blur(16px)",
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -4px 24px rgba(15,31,92,.09)",
      border: `1px solid ${T.border}`, minWidth: 0,
    }}>
      <div onClick={() => setOpen(p => !p)} style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "10px 18px 8px", cursor: "pointer",
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: "#cbd5e1", marginBottom: 8 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: `linear-gradient(135deg,${winners[0].gradFrom},${winners[0].gradTo})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Medal size={16} color="#fff" /></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{winners[0].team}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Winner · {winners[0].score.toFixed(2)}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge bg={published ? "#d1fae5" : "#fef3c7"} color={published ? "#065f46" : "#92400e"}>
              {published ? "Published" : "Draft"}
            </Badge>
            {open ? <ChevronDown size={15} color="#94a3b8" /> : <ChevronUp size={15} color="#94a3b8" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {[
                  { label: "Total Teams", value: "128" },
                  { label: "Winners", value: "3 / 3" },
                  { label: "Certs", value: certCount > 0 ? String(certCount) : "0" },
                  { label: "Deadline", value: "May 20" },
                ].map(r => (
                  <div key={r.label} style={{ padding: "9px 11px", borderRadius: 11, background: "#f8fafc", border: "1px solid #f1f5f9", minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>{r.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.navy, marginTop: 2 }}>{r.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Generate Certs", action: onGenerateCerts, bg: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", bdr: "none" },
                  { label: "Preview",        action: onPreview,        bg: "rgba(255,255,255,.8)",                  color: "#475569", bdr: "1.5px solid #e2e8f0" },
                  { label: "Publish",        action: onPublish,        bg: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", bdr: "none" },
                  { label: "Reset All",      action: onReset,          bg: "#fef2f2",                               color: "#dc2626", bdr: "1.5px solid #fecaca" },
                ].map(b => (
                  <button key={b.label} onClick={b.action} style={{
                    padding: "10px 0", borderRadius: 10,
                    background: b.bg, color: b.color,
                    fontSize: 12, fontWeight: 600, border: b.bdr,
                    whiteSpace: "nowrap",
                  }}>{b.label}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResultDeclaration() {
  const bp = useBreakpoint();

  const [activeTab, setActiveTab]   = useState(0);
  const [winners, setWinners]       = useState(WINNERS_INIT);
  const [timeline, setTimeline]     = useState(TIMELINE_INIT);
  const [certCount, setCertCount]   = useState(0);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished]   = useState(false);
  const [modal, setModal]           = useState(null);
  const [toast, setToast]           = useState(null);
  const [openUid, setOpenUid]       = useState(null);

  useEffect(() => {
    if (!openUid) return;
    const h = (e) => { setOpenUid(null); };
    const t = setTimeout(() => document.addEventListener("click", h), 0);
    return () => { clearTimeout(t); document.removeEventListener("click", h); };
  }, [openUid]);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3400);
  };

  const handleWinnerChange = (idx, team) => {
    setWinners(p => p.map((w, i) => i === idx ? { ...w, team } : w));
    showToast(`Winner updated: ${team}`, "info");
  };

  const handleGenerateCerts = async () => {
    setGenerating(true); setActiveTab(1);
    await new Promise(r => setTimeout(r, 2000));
    setCertCount(133); setGenerating(false);
    setTimeline(p => p.map(t => t.title === "Certificate Generation" ? { ...t, sub: "Completed", status: "done" } : t));
    showToast("133 certificates generated successfully!");
  };

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 2500));
    setPublishing(false); setPublished(true);
    setTimeline(p => p.map(t =>
      t.title === "Winners Selection"   ? { ...t, sub: "Completed", status: "done" } :
      t.title === "Results Publication" ? { ...t, sub: new Date().toLocaleString(), status: "done" } : t
    ));
    showToast("Results published successfully! 🎉");
  };

  const handleReset = () => {
    setWinners(WINNERS_INIT); setTimeline(TIMELINE_INIT);
    setPublished(false); setCertCount(0); setActiveTab(0);
    showToast("Reset to defaults", "info");
  };

  const { isMobile, isTablet, isXL, isXS, isMD } = bp;

  const cardCompact = isXS || isMD;

  const statsGrid = isXS || isMobile
    ? "repeat(2,1fr)"
    : isMD
      ? "repeat(3,1fr)"
      : isTablet
        ? "repeat(3,1fr)"
        : "repeat(5,1fr)";

  const showSidebar = bp.w >= 900;

  const mainGrid = showSidebar ? "1fr 290px" : "1fr";

  const bottomGrid = isXS || isMobile
    ? "1fr"
    : isMD
      ? "1fr"
      : isTablet
        ? "repeat(2,1fr)"
        : "repeat(3,1fr)";

  const tabLabels = bp.w < 760 ? TABS_SHORT : TABS_LONG;

  const px = isXS ? 12 : isMobile ? 16 : isMD ? 18 : 28;
  const py = isXS ? 14 : isMobile ? 16 : isMD ? 16 : 24;

  const stats = [
    { label: "Hackathon",    value: "AI Revolution 2026", delta: "Active",         deltaOk: true,  icon: Trophy,    iconBg: "#dbeafe", iconColor: "#2563eb" },
    { label: "Total Teams",  value: "128",                delta: "Participated",    deltaOk: null,  icon: Users,     iconBg: "#ccfbf1", iconColor: "#0f766e" },
    { label: "Winners",      value: "3",                  delta: "Positions filled",deltaOk: null,  icon: Award,     iconBg: "#ede9fe", iconColor: "#7c3aed" },
    { label: "Certificates", value: String(certCount),    delta: certCount ? "Ready" : "Not generated", deltaOk: certCount > 0, icon: FileBadge, iconBg: "#e0f2fe", iconColor: "#0284c7" },
    { label: "Status",       value: published ? "Published" : "Draft", delta: published ? "Visible to all" : "Not published", deltaOk: published, icon: Globe, iconBg: "#dcfce7", iconColor: "#15803d" },
  ];

  return (
    <div
      style={{ minHeight: "100vh", fontFamily: T.font, background: T.bg, color: "#334155", overflowX: "hidden" }}
      onClick={() => setOpenUid(null)}
    >
      <div style={{
        maxWidth: 1440, margin: "0 auto",
        padding: `${py}px ${px}px`,
        paddingBottom: isMobile ? 0 : py,
        minWidth: 0,
      }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: py * .7, flexWrap: "wrap", minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 800, color: T.navy, lineHeight: 1.2 }}>
              Result Declaration
            </div>
          </div>
          {!isMobile && (
            <button
              onClick={() => setActiveTab(3)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: `${isTablet ? "8px" : "10px"} ${isTablet ? "14px" : "18px"}`,
                borderRadius: 12,
                background: `linear-gradient(135deg,${T.accent},${T.accentDk})`,
                color: "#fff", fontSize: "clamp(12px,1.2vw,13px)", fontWeight: 700,
                boxShadow: "0 4px 16px rgba(59,130,246,.35)", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              <Send size={13} /> Publish Results
            </button>
          )}
          <img
            src="https://i.pravatar.cc/80" alt="avatar"
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.12)", flexShrink: 0 }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: statsGrid, gap: isXS ? 8 : 12, marginBottom: py * .7 }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }} style={{ minWidth: 0 }}>
              <Card style={{ padding: isXS ? "10px 11px" : "13px 15px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: isXS ? 8 : 11, minWidth: 0 }}>
                  <div style={{
                    width: isXS ? 30 : 36, height: isXS ? 30 : 36,
                    borderRadius: isXS ? 8 : 10, flexShrink: 0,
                    background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <s.icon size={isXS ? 14 : 17} color={s.iconColor} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{s.label}</div>
                    <div style={{
                      fontSize: "clamp(12px,1.6vw,17px)", fontWeight: 800, color: T.navy,
                      marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{s.value}</div>
                    <div style={{ fontSize: 10, marginTop: 3, fontWeight: 500, color: s.deltaOk === true ? "#10b981" : s.deltaOk === false ? "#f59e0b" : "#94a3b8" }}>
                      {s.delta}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mainGrid, gap: 20, alignItems: "start", marginBottom: py * .7, minWidth: 0 }}>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }} style={{ minWidth: 0 }}>
            <Card style={{ padding: isXS ? 14 : isMD ? 16 : "clamp(16px,2.5vw,24px)", minWidth: 0 }}>

              {bp.w >= 1100 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "7px 13px", borderRadius: 12,
                    background: "rgba(255,255,255,.9)", border: "1.5px solid #e2e8f0",
                    flexWrap: "wrap", minWidth: 0,
                  }}>
                    <Trophy size={14} color="#f59e0b" />
                    <div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: .8, color: "#94a3b8", fontWeight: 600 }}>Hackathon</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>AI Revolution 2026</div>
                    </div>
                    <Badge bg="#d1fae5" color="#065f46">Active</Badge>
                  </div>
                </div>
              )}

              <div
                className="sb-hide"
                style={{ display: "flex", borderBottom: "2px solid #f1f5f9", marginBottom: 20, overflowX: "auto", minWidth: 0, width: "100%" }}
              >
                {tabLabels.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(i)}
                    style={{
                      padding: isXS ? "9px 11px" : "10px 14px",
                      fontSize: isXS ? 11 : isMD ? 12 : 13,
                      fontWeight: activeTab === i ? 700 : 500,
                      color: activeTab === i ? T.accent : "#94a3b8",
                      borderBottom: activeTab === i ? `2.5px solid ${T.accent}` : "2.5px solid transparent",
                      marginBottom: -2, background: "none", whiteSpace: "nowrap", flexShrink: 0,
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
                  transition={{ duration: .17 }}
                  style={{ minWidth: 0 }}
                >
                  {activeTab === 0 && (
                    <WinnersTab
                      winners={winners}
                      onWinnerChange={handleWinnerChange}
                      onViewDetails={w => setModal({ type: "details", data: w })}
                      compact={cardCompact}
                      openUid={openUid}
                      setOpenUid={setOpenUid}
                    />
                  )}
                  {activeTab === 1 && <CertificateTab certCount={certCount} onGenerate={handleGenerateCerts} generating={generating} />}
                  {activeTab === 2 && <PreviewTab winners={winners} published={published} />}
                  {activeTab === 3 && <PublishTab published={published} onPublish={handlePublish} publishing={publishing} />}
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>

          {showSidebar && (
            <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .38 }} style={{ minWidth: 0, maxWidth: "100%" }}>
              <ResultSummary
                winners={winners} certCount={certCount} published={published}
                onViewDetails={w => setModal({ type: "details", data: w })}
                onReset={handleReset}
                onGenerateCerts={handleGenerateCerts}
                onPreview={() => setActiveTab(2)}
                onPublish={() => setActiveTab(3)}
              />
            </motion.div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: bottomGrid, gap: isXS ? 10 : 18, minWidth: 0 }}>
          {[
            <CertificateProgress certCount={certCount} onManage={() => setActiveTab(1)} />,
            <ResultTimeline timeline={timeline} onExport={() => showToast("Timeline exported!", "success")} />,
            <TopScores winners={winners} onViewAll={() => setModal({ type: "allScores" })} onPublish={() => setActiveTab(3)} />,
          ].map((el, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 + i * .08 }} style={{ minWidth: 0 }}>
              {el}
            </motion.div>
          ))}
        </div>

      </div>

      {isMobile && (
        <div style={{ position: "sticky", bottom: 0, zIndex: 30 }}>
          <MobileSheet
            winners={winners} certCount={certCount} published={published}
            onReset={handleReset}
            onGenerateCerts={handleGenerateCerts}
            onPreview={() => setActiveTab(2)}
            onPublish={() => setActiveTab(3)}
          />
        </div>
      )}
      <AnimatePresence>
        {modal?.type === "details" && (
          <Modal title="Team Details" onClose={() => setModal(null)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <RankCircle rank={modal.data.rank} gradFrom={modal.data.gradFrom} gradTo={modal.data.gradTo} size={48} />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: T.navy }}>{modal.data.team}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{modal.data.uni}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.navy }}>{modal.data.score.toFixed(2)}</div>
                  <Badge bg={modal.data.rankBadge.bg} color={modal.data.rankBadge.color}>{modal.data.pos}</Badge>
                </div>
              </div>
              <div style={{ padding: "13px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Project</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 8, overflowWrap: "break-word" }}>{modal.data.project}</div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{modal.data.description}</p>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Team Members</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {modal.data.members.map(m => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, color: "#475569" }}>
                      <UserCheck size={12} color={T.accent} /> {m}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setModal(null)}
                style={{ padding: "12px", borderRadius: 12, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 14, fontWeight: 700 }}
              >Close</button>
            </div>
          </Modal>
        )}

        {modal?.type === "allScores" && (
          <Modal title="Leaderboard" onClose={() => setModal(null)}>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Final scores for all top teams.</p>
            {winners.map(w => (
              <div key={w.rank} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 12, background: "#f8fafc",
                border: "1px solid #f1f5f9", marginBottom: 8, flexWrap: "wrap", gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>{w.rank}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{w.team}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score.toFixed(2)}</span>
                  <Badge bg={w.rankBadge.bg} color={w.rankBadge.color}>{w.pos}</Badge>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={() => setModal(null)}
                style={{ padding: "9px 20px", borderRadius: 10, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 13, fontWeight: 700 }}
              >Close</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}