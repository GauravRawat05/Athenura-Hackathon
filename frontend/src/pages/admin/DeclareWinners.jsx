import { useState, useEffect, useMemo, useRef,useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Trophy,
  Users,
  Eye,
  Info,
  CheckCircle2,
  Circle,
  Loader2,
  Send,
  Medal,
  X,
  Award,
  FileBadge,
  Globe,
  ChevronDown,
  ChevronUp,

  Bell,
  AlertCircle,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { hackathonService } from "../../services/hackathonService";

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
  button { font-family: inherit; transition: opacity .15s, transform .15s; border:none; cursor:pointer; }
  button:hover:not(:disabled) { opacity: .88; }
  button:active:not(:disabled) { transform: scale(.97); }
  img, svg, video, canvas { max-width: 100%; height: auto; }
`;
if (typeof document !== "undefined" && !document.getElementById("declare-winners-style")) {
  _style.id = "declare-winners-style";
  document.head.appendChild(_style);
}

const T = {
  navy: "#0f1f5c",
  accent: "#3b82f6",
  accentDk: "#1d4ed8",
  surface: "rgba(255,255,255,0.76)",
  border: "rgba(255,255,255,0.58)",
  bg: "linear-gradient(135deg,#ecfcff 0%,#f5feff 50%,#dff4ff 100%)",
  font: "'DM Sans','Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",
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
    isXS: w < 480,
    isSM: w >= 480 && w < 640,
    isMD: w >= 640 && w < 900,
    isLG: w >= 900 && w < 1100,
    isXL: w >= 1100,
    isMobile: w < 640,
    isTablet: w >= 640 && w < 1100,
  };
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(15,31,92,.06)",
        backdropFilter: "blur(16px)",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Simple Card without blur for dropdowns to prevent them from being hidden
function SolidCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(15,31,92,.06)",
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ children, bg = "#dbeafe", color = "#1e40af" }) {
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 9px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function RankCircle({ rank, gradFrom, gradTo, size = 38 }) {
  const safeRank = Number.isFinite(rank) ? rank : 0;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: `linear-gradient(135deg,${gradFrom},${gradTo})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 12px ${gradFrom}55`,
      }}
    >
      {safeRank === 1 ? (
        <Medal size={size * 0.48} color="#fff" />
      ) : (
        <span style={{ color: "#fff", fontWeight: 700, fontSize: size * 0.38 }}>
          {safeRank || "—"}
        </span>
      )}
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

function Toast({ message, type = "success", onClose }) {
  const colors = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b",
  };
  const Icon = { success: CheckCircle2, error: X, warning: AlertCircle, info: Bell }[type] || Bell;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99998,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 16px",
        borderRadius: 14,
        background: colors[type],
        color: "#fff",
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 8px 32px rgba(0,0,0,.18)",
        whiteSpace: "nowrap",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <Icon size={16} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{message}</span>
      <button
        onClick={onClose}
        style={{ opacity: 0.75, color: "#fff", background: "none", marginLeft: 4 }}
        aria-label="Close toast"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,31,92,.28)",
        backdropFilter: "blur(6px)",
        padding: 16,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "clamp(16px,3vw,28px)",
          width: "100%",
          maxWidth: "min(95vw, 500px)",
          maxHeight: "90dvh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(15,31,92,.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.navy }}>{title}</h3>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, background: "#f1f5f9" }} aria-label="Close modal">
            <X size={15} color="#64748b" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function TeamDropdown({ value, onChange, options = [], uid, openUid, setOpenUid }) {
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const isOpen = openUid === uid;
  const [rect, setRect] = useState(null);

  // Update position on scroll (for fixed positioning) and resize
  useEffect(() => {
    if (!isOpen || !btnRef.current) return;

    const updatePosition = () => {
      const r = btnRef.current.getBoundingClientRect();
      setRect(r);
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setOpenUid(null);
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpenUid(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setOpenUid]);

  const adjustedLeft = rect
    ? Math.min(rect.left, window.innerWidth - rect.width - 8)
    : 0;

  // Normalize value to string for comparison (handles ObjectId objects from MongoDB)
  const normalizedValue = typeof value === "string" ? value : (value ? String(value) : "");

  // Find the selected option by comparing string values
  const selectedOption = options.find((opt) => {
    const optValue = typeof opt === "string" ? opt : String(opt?.value ?? "");
    return optValue === normalizedValue;
  });
  const displayLabel = typeof selectedOption === "string" ? selectedOption : (selectedOption?.label ?? normalizedValue);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            setOpenUid(null);
            return;
          }
          setOpenUid(uid);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "8px 12px",
          borderRadius: 10,
          border: `1.5px solid ${isOpen ? T.accent : "#e2e8f0"}`,
          background: "rgba(255,255,255,.85)",
          fontSize: 13,
          color: "#334155",
          gap: 8,
          outline: "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
          {displayLabel || "Select"}
        </span>
        {isOpen ? <ChevronUp size={14} color="#94a3b8" style={{ flexShrink: 0 }} /> : <ChevronDown size={14} color="#94a3b8" style={{ flexShrink: 0 }} />}
      </button>

      <AnimatePresence>
        {isOpen && rect && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: rect.bottom + 4,
              left: adjustedLeft,
              width: Math.min(rect.width, 320),
              zIndex: 99999,
              background: "#ffffff",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
              overflowY: "auto",
              maxHeight: 260,
            }}
          >
            {options.length === 0 ? (
              <div style={{ padding: 12, fontSize: 13, color: "#64748b" }}>No options available</div>
            ) : (
              options.map((opt) => {
                const optValue = typeof opt === "string" ? opt : String(opt?.value ?? "");
                const optLabel = typeof opt === "string" ? opt : (opt?.label ?? optValue);
                const selected = optValue === normalizedValue;
                return (
                  <button
                    key={optValue}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(optValue);
                      setOpenUid(null);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "9px 12px",
                      fontSize: 13,
                      background: selected ? "#eff6ff" : "#ffffff",
                      color: selected ? T.accent : "#334155",
                      fontWeight: selected ? 600 : 400,
                      transition: "background .1s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = selected ? "#eff6ff" : "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = selected ? "#eff6ff" : "#ffffff"}
                  >
                    {selected ? <CheckCircle2 size={14} /> : <span style={{ width: 14, display: "inline-block" }} />}
                    {optLabel}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function parseRank(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i <= 0) return null;
  return i;
}

function safeNumber(value) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function computeWinnerList(resultsData) {
  const list = Array.isArray(resultsData?.results) ? resultsData.results : Array.isArray(resultsData) ? resultsData : [];
  // Preserve unknown backend response shape. We'll only use submissionId, teamName/teamName-like, participantNames, score, rank, award, isOverride, comments.
  const mapped = list
    .map((r) => {
      const rank = parseRank(r?.rank);
      const score = safeNumber(r?.score);
      const submissionId = r?.submissionId ?? r?.submission?._id ?? r?._id ?? null;
      const teamName = r?.teamName ?? r?.team ?? r?.team?.name ?? "";
      const participantNames = r?.participantNames ?? r?.participantName ?? r?.participants ?? [];
      const participantArray = Array.isArray(participantNames)
        ? participantNames
        : typeof participantNames === "string"
          ? [participantNames]
          : [];
      const award = r?.award ?? r?.prize ?? null;
      const isOverride = Boolean(r?.isOverride);
      const comments = r?.comments ?? r?.overrideReason ?? r?.reason ?? "";

      // Gradients per rank for existing theme (fallbacks)
      const palette = [
        { gradFrom: "#f59e0b", gradTo: "#d97706", rankBadge: { text: "Highest", bg: "#d1fae5", color: "#065f46" } },
        { gradFrom: "#94a3b8", gradTo: "#64748b", rankBadge: { text: "2nd Highest", bg: "#dbeafe", color: "#1e40af" } },
        { gradFrom: "#fb923c", gradTo: "#d97706", rankBadge: { text: "3rd Highest", bg: "#ede9fe", color: "#5b21b6" } },
      ];
      const idx = rank ? Math.min(rank - 1, 2) : 0;
      const pal = palette[idx] ?? palette[0];

      return {
        submissionId,
        rank,
        score,
        team: teamName,
        pos: rank ? `#${rank}` : "",
        members: participantArray,
        project: r?.projectTitle ?? r?.project ?? r?.description ?? "",
        award,
        isOverride,
        overrideReason: comments,
        gradFrom: pal.gradFrom,
        gradTo: pal.gradTo,
        rankBadge: pal.rankBadge,
      };
    })
    .filter((w) => Boolean(w.rank) && w.score !== null)
    .sort((a, b) => a.rank - b.rank);

  return mapped;
}

function SkeletonRow({ compact }) {
  return (
    <div
      style={{
        border: "1.5px solid #e8eef8",
        borderRadius: 16,
        background: "rgba(255,255,255,.7)",
        overflow: "hidden",
        marginBottom: compact ? 10 : 14,
        padding: compact ? "12px 14px" : "14px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: compact ? 34 : 38, height: compact ? 34 : 38, borderRadius: 999, background: "#e2e8f0" }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, width: "55%", background: "#e2e8f0", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 10, width: "40%", background: "#eef2f7", borderRadius: 8 }} />
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#e2e8f0" }} />
      </div>
    </div>
  );
}

function WinnersTable({
  resultsData,
  loading,
  error,
  onOpenDetails,
  openUid,
  setOpenUid,
  onEditOverride,
  draftOverrides,
  onSaveOverride,
  savingOverride,
  awardOptions,
}) {
  const winners = useMemo(() => computeWinnerList(resultsData), [resultsData]);

  if (loading) {
    return (
      <div>
        <SectionTitle sub="Loading results...">Winners Selection</SectionTitle>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonRow key={i} compact />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SectionTitle sub="Failed to load results.">Winners Selection</SectionTitle>
        <div style={{ padding: "12px 14px", borderRadius: 12, background: "#fff1f2", border: "1px solid #fecaca", color: "#9f1239" }}>
          {error}
        </div>
      </div>
    );
  }

  if (!winners.length) {
    return (
      <div>
        <SectionTitle sub="No drafted results found yet.">Winners Selection</SectionTitle>
        <div style={{ padding: "12px 14px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af" }}>
          Draft rankings are empty. Click <strong>Generate Draft</strong> first.
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle sub="Adjust ranks and awards for winners (draft).">Winners Selection</SectionTitle>

      {winners.map((w, idx) => {
        const override = draftOverrides?.[w.submissionId] ?? {};
        const draftRank = override.finalRank ?? w.rank;
        const draftAward = override.award ?? w.award ?? "";
        const draftReason = override.reason ?? w.overrideReason ?? "";

        const rankInputId = `rank-${w.submissionId}`;

        return (
          <motion.div
            key={w.submissionId || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            style={{ border: "1.5px solid #e8eef8", borderRadius: 16, background: "rgba(255,255,255,.7)", overflow: "visible", marginBottom: 14, minWidth: 0 }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "1 1 160px" }}>
                <RankCircle rank={w.rank} gradFrom={w.gradFrom} gradTo={w.gradTo} size={38} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.navy, whiteSpace: "nowrap" }}>{w.pos || "Rank"}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {w.team || "Team"}
                  </div>
                </div>
              </div>

              <div style={{ flex: "1 1 240px", minWidth: 220 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                  Rank (final)
                </label>
                <input
                  id={rankInputId}
                  inputMode="numeric"
                  type="number"
                  min={1}
                  value={draftRank ?? ""}
                  onChange={(e) => onEditOverride(w.submissionId, { finalRank: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    outline: "none",
                    fontSize: 13,
                    color: "#334155",
                  }}
                />
              </div>

              <div style={{ flex: "1 1 220px", minWidth: 200 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                  Award (optional)
                </label>
                <TeamDropdown
                  uid={`award-${w.submissionId}`}
                  value={draftAward}
                  openUid={openUid}
                  setOpenUid={setOpenUid}
                  onChange={(val) => onEditOverride(w.submissionId, { award: val })}
                  options={awardOptions}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  {w.isOverride && (
                    <Badge bg="#dbeafe" color="#1e40af">Override</Badge>
                  )}
                  <button
                    onClick={() => onOpenDetails(w)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      flexShrink: 0,
                      border: "1.5px solid #dbeafe",
                      background: "#eff6ff",
                      color: T.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="View details"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 18px", display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
                  Override reason
                </label>
                <textarea
                  value={draftReason}
                  onChange={(e) => onEditOverride(w.submissionId, { reason: e.target.value })}
                  placeholder="Add reason for this override..."
                  style={{
                    width: "100%",
                    minHeight: 78,
                    resize: "vertical",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    outline: "none",
                    fontSize: 13,
                    color: "#334155",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <Badge bg="#f1f5f9" color="#334155">Score</Badge>
                  <span style={{ fontWeight: 800, color: T.navy, fontSize: 14 }}>{w.score !== null ? w.score.toFixed(2) : "—"}</span>
                  <Badge bg="#fffbeb" color="#92400e">Team members: {w.members.length}</Badge>
                </div>

                <button
                  onClick={() => onSaveOverride(w.submissionId)}
                  disabled={savingOverride}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: savingOverride ? "#dbeafe" : `linear-gradient(135deg,${T.accent},${T.accentDk})`,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    boxShadow: savingOverride ? "none" : "0 4px 14px rgba(59,130,246,.3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {savingOverride ? (
                    <>
                      <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} /> Save Draft
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "11px 14px",
          borderRadius: 12,
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          fontSize: "clamp(12px,2vw,13px)",
          color: "#1e40af",
        }}
      >
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Edits are saved to the draft using the override PATCH endpoint. Publishing is a separate step.</span>
      </div>
    </div>
  );
}

function PublishControls({
  progress,
  resultsData,
  published,
  generatingDraft,
  publishing,
  onPublish,
  hackathonTitle,
}) {
  const list = Array.isArray(resultsData?.results) ? resultsData.results : Array.isArray(resultsData) ? resultsData : [];
  const hasResults = list.length > 0;
  const draftGenerated = Boolean(progress?.draftGenerated ?? progress?.resultsGenerated ?? progress?.isDraftGenerated);
  const progressComplete = Boolean(progress?.completionPercent ?? progress?.completion?.isComplete ?? progress?.isComplete ?? progress?.scoring?.isComplete);

  const canPublish = !published && hasResults && (draftGenerated || progressComplete);

  const missing = [];
  if (!hasResults) missing.push("draft results");
  if (!draftGenerated && !progressComplete) missing.push("completed draft generation");

  return (
    <div>
      <SectionTitle sub="Make results visible to all participants and the public.">Publish Results</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: hasResults ? "#f0fdf4" : "#fffbeb", flexWrap: "wrap", minWidth: 0 }}>
          {hasResults ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#f59e0b" />}
          <span style={{ fontSize: 13, color: hasResults ? "#15803d" : "#92400e", fontWeight: 500 }}>
            {hasResults ? "Draft results available" : "No draft results yet"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: (draftGenerated || progressComplete) ? "#f0fdf4" : "#fffbeb", flexWrap: "wrap", minWidth: 0 }}>
          {(draftGenerated || progressComplete) ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#f59e0b" />}
          <span style={{ fontSize: 13, color: (draftGenerated || progressComplete) ? "#15803d" : "#92400e", fontWeight: 500 }}>
            {(draftGenerated || progressComplete) ? "Draft computed" : "Draft not generated"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 13, color: "#78350f", flexWrap: "wrap" }}>
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Publishing is <strong>irreversible</strong>. Ensure {missing.length ? missing.join(", ") : "all requirements"}.
          </span>
        </div>
      </div>

      <button
        onClick={() => onPublish()}
        disabled={!canPublish || publishing || generatingDraft}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          fontSize: 14,
          fontWeight: 700,
          background: published ? "#d1fae5" : `linear-gradient(135deg,${T.accent},${T.accentDk})`,
          color: published ? "#065f46" : "#fff",
          boxShadow: published ? "none" : "0 6px 20px rgba(59,130,246,.35)",
          whiteSpace: "nowrap",
          opacity: !canPublish ? 0.7 : 1,
          cursor: !canPublish ? "not-allowed" : "pointer",
        }}
      >
        {publishing ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Publishing...
          </>
        ) : published ? (
          <>
            <CheckCircle2 size={16} /> Results Published!
          </>
        ) : (
          <>
            <Send size={16} /> Publish Results Now
          </>
        )}
      </button>
    </div>
  );
}

function CertificateProgress() {
  // Backend contract doesn’t define certificate generation. Keep UI as placeholder based on existing theme.
  const DONUT_DATA = [
    { name: "Winners", value: 3, color: "#f59e0b" },
    { name: "Participants", value: 125, color: "#6366f1" },
    { name: "Special", value: 5, color: "#8b5cf6" },
  ];
  return (
    <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 14 }}>Certificate Progress</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DONUT_DATA} innerRadius={26} outerRadius={40} paddingAngle={3} dataKey="value" stroke="none">
                {DONUT_DATA.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.navy }}>—</span>
            <span style={{ fontSize: 9, color: "#94a3b8" }}>Total</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
          {[
            { label: "Winners", color: "#f59e0b", val: "—" },
            { label: "Participants", color: "#6366f1", val: "—" },
            { label: "Special", color: "#8b5cf6", val: "—" },
          ].map((r) => (
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
      <button
        style={{
          marginTop: 14,
          width: "100%",
          padding: "9px 0",
          borderRadius: 10,
          border: "1.5px solid #e2e8f0",
          background: "rgba(255,255,255,.8)",
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
          whiteSpace: "nowrap",
        }}
        disabled
      >
        Certificates (info unavailable)
      </button>
    </Card>
  );
}

function PreviewTab({ winners, published }) {
  return (
    <div>
      <SectionTitle sub="Preview the draft/public result view before publishing.">Result Preview</SectionTitle>
      <div
        style={{
          border: "2px dashed #cbd5e1",
          borderRadius: 16,
          padding: 16,
          background: "#f8fafc",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
          <Eye size={13} /> Public Preview
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)", minWidth: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.navy }}>Official Results</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{published ? "Published" : "Draft"}</div>
            {published && <div style={{ marginTop: 6 }}><Badge bg="#d1fae5" color="#065f46">Published</Badge></div>}
          </div>
          {winners.length ? (
            winners.map((w, i) => (
              <div
                key={w.submissionId || i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#f8fafc",
                  marginBottom: i < winners.length - 1 ? 8 : 0,
                  flexWrap: "wrap",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {["🥇", "🥈", "🥉"][i] ?? "🏆"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.team || "Team"}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.project || ""}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score !== null ? w.score.toFixed(2) : "—"}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{w.pos || ""}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: 10, color: "#64748b", fontSize: 13 }}>No winners to preview.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultTimeline({ progress, onExport }) {
  const timeline = [
    { title: "Draft computed", sub: "", status: "pending", done: Boolean(progress?.draftGenerated ?? progress?.resultsGenerated ?? progress?.isDraftGenerated) },
    { title: "Scoring progress", sub: "", status: "pending", done: Boolean(progress?.isComplete ?? progress?.scoring?.isComplete) },
    { title: "Ready to publish", sub: "", status: "pending", done: false },
  ];

  return (
    <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 14 }}>Result Timeline</div>
      {timeline.map((t, i) => (
        <div key={t.title} style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {t.done ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : (
              <Circle size={18} color="#cbd5e1" />
            )}
            {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 18, background: i === 0 ? "#10b981" : "#e2e8f0", margin: "4px 0" }} />}
          </div>
          <div style={{ paddingBottom: i < timeline.length - 1 ? 14 : 0, paddingTop: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{t.title}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{t.done ? "Completed" : "Pending"}</div>
          </div>
        </div>
      ))}
      <button
        onClick={onExport}
        style={{
          marginTop: 14,
          width: "100%",
          padding: "9px 0",
          borderRadius: 10,
          background: "#eff6ff",
          color: T.accent,
          fontSize: 12,
          fontWeight: 600,
          border: "1.5px solid #bfdbfe",
          whiteSpace: "nowrap",
        }}
      >
        Export Timeline
      </button>
    </Card>
  );
}

export default function DeclareWinners() {
  const { id: routeHackathonId } = useParams();

  // Backend expects a 24-char Mongo ObjectId for :hackathonId.
  // Guard against undefined/invalid params to prevent Joi "must be exactly 24 characters long".
  const isValidRouteHackathonId =
    typeof routeHackathonId === "string" && /^[a-fA-F0-9]{24}$/.test(routeHackathonId);

  const bp = useBreakpoint();

  const [hackathonsList, setHackathonsList] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(
    isValidRouteHackathonId ? routeHackathonId : ""
  );

  const isValidHackathonId =
    typeof selectedHackathonId === "string" && /^[a-fA-F0-9]{24}$/.test(selectedHackathonId);

// Review Queue Tab Component
   function ReviewQueueTab({ queueItems, progress, loading, resolvingId, queueComments, onResolve, onCommentChange }) {
     // Ensure queueItems is always an array for safe iteration
     const safeQueueItems = Array.isArray(queueItems) ? queueItems : [];
     const queueData = [
       { name: "Pending", value: progress?.reviewQueue?.pending || 0, color: "#f59e0b" },
       { name: "Approved", value: progress?.reviewQueue?.approved || 0, color: "#10b981" },
       { name: "Rejected", value: progress?.reviewQueue?.rejected || 0, color: "#ef4444" },
     ];

    const totalQueued = (progress?.reviewQueue?.pending || 0) + (progress?.reviewQueue?.approved || 0) + (progress?.reviewQueue?.rejected || 0);

    // Score breakdown component for showing criterion scores
    function QueueScoreBreakdown({ criterionScores }) {
      if (!criterionScores || criterionScores.length === 0) return null;

      return (
        <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.navy, marginBottom: 8 }}>Score Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {criterionScores.map((c, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>{c.criterionName || c.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>{c.score || c.scoreValue}/{c.weight || 10}</span>
                  <div style={{ width: 60, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${((c.score || c.scoreValue || 0) / (c.weight || 10)) * 100}%`,
                        height: "100%",
                        background: T.accent,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Action buttons for approve/reject
    function QueueActionButtons({ itemId, onResolve, resolvingId, comment, setComment }) {
      const [showComment, setShowComment] = useState(false);

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 180 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onResolve(itemId, "approved", comment)}
              disabled={resolvingId === itemId}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                background: resolvingId === itemId ? "#dbeafe" : "#10b981",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {resolvingId === itemId ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <ThumbsUp size={14} />}
              Approve
            </button>
            <button
              onClick={() => onResolve(itemId, "rejected", comment)}
              disabled={resolvingId === itemId}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                background: resolvingId === itemId ? "#fee2e2" : "#ef4444",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {resolvingId === itemId ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <ThumbsDown size={14} />}
              Reject
            </button>
          </div>
          <button
            onClick={() => setShowComment(!showComment)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "#f1f5f9",
              color: "#64748b",
              fontSize: 11,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <MessageSquare size={12} />
            {showComment ? "Hide" : "Add"} Comment
          </button>
          {showComment && (
            <textarea
              value={comment || ""}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add admin comment (optional)..."
              style={{
                width: "100%",
                minHeight: 60,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                color: "#334155",
                resize: "vertical",
              }}
            />
          )}
        </div>
      );
    }

    // Queue item card component
    function QueueItemCard({ item, onResolve, resolvingId, comment, setComment }) {
      const judgeName = item.judgeId?.fullName || "Unknown Judge";
      const submissionTitle = item.submissionId?.title || "Untitled";
      const feedback = item.scoreRecommendation?.feedback || "";

      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            border: "1.5px solid #e8eef8",
            borderRadius: 16,
            background: "rgba(255,255,255,.7)",
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
            {/* Left side - Submission info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <FileText size={16} color={T.accent} />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>
                  {submissionTitle}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <User size={14} color="#94a3b8" />
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Judge: {judgeName}
                </span>
              </div>
              {feedback && (
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
                  <strong>Feedback:</strong> {feedback}
                </div>
              )}
            </div>

            {/* Middle - Score breakdown */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <QueueScoreBreakdown criterionScores={item.scoreRecommendation?.criterionScores} />
            </div>

            {/* Right side - Actions */}
            <QueueActionButtons
              itemId={item._id}
              onResolve={onResolve}
              resolvingId={resolvingId}
              comment={comment}
              setComment={setComment}
            />
          </div>
        </motion.div>
      );
    }

    const canGenerateDraft = (progress?.reviewQueue?.pending || 0) === 0 && (progress?.reviewQueue?.approved || 0) > 0;

    return (
      <>
        {/* Progress indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 4 }}>
              Review Queue Progress
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {progress?.reviewQueue?.pending || 0} pending items need review
            </div>
          </div>

          {/* Donut chart for queue status */}
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={queueData} innerRadius={24} outerRadius={36} paddingAngle={2} dataKey="value" stroke="none">
                  {queueData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: T.navy }}>{totalQueued}</span>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>Total</span>
            </div>
          </div>
        </div>

        {/* Queue items list */}
{loading ? (
           <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
             <Loader2 size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
             Loading review queue...
           </div>
         ) : safeQueueItems.length === 0 ? (
           <div style={{ padding: 24, textAlign: "center" }}>
             {progress?.reviewQueue?.pending === 0 && progress?.reviewQueue?.approved > 0 ? (
               <div>
                 <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: 12 }} />
                 <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 8 }}>
                   All scores reviewed!
                 </div>
                 <div style={{ fontSize: 12, color: "#64748b" }}>
                   All judge scores have been approved/rejected. You can now generate draft results.
                 </div>
               </div>
             ) : (
               <div>
                 <Circle size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
                 <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 8 }}>
                   No pending scores to review
                 </div>
                 <div style={{ fontSize: 12, color: "#64748b" }}>
                   All scores are up to date or no scores have been submitted yet.
                 </div>
               </div>
             )}
           </div>
         ) : (
           <>
             <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: T.navy }}>
               Pending Reviews ({safeQueueItems.length})
             </div>
             <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
               <AnimatePresence>
                 {safeQueueItems.map(item => (
                   <QueueItemCard
                     key={item._id}
                     item={item}
                     onResolve={onResolve}
                     resolvingId={resolvingId}
                     comment={queueComments?.[item._id] || ""}
                     setComment={(val) => onCommentChange(item._id, val)}
                   />
                 ))}
               </AnimatePresence>
             </div>
           </>
         )}

        {/* Generate Draft button */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => {
              if (!selectedHackathonId) return;
              setModal({ type: "confirmGenerate" });
            }}
            disabled={!canGenerateDraft || published}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 12,
              background: canGenerateDraft && !published ? `linear-gradient(135deg,${T.accent},${T.accentDk})` : "#e2e8f0",
              color: canGenerateDraft && !published ? "#fff" : "#64748b",
              fontSize: 14,
              fontWeight: 700,
              boxShadow: canGenerateDraft && !published ? "0 4px 14px rgba(59,130,246,.3)" : "none",
              cursor: canGenerateDraft && !published ? "pointer" : "not-allowed",
            }}
          >
            <Trophy size={16} />
            Generate Draft
          </button>
          {!canGenerateDraft && !published && (
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
              Review all pending scores to enable draft generation
            </div>
          )}
          {published && (
            <div style={{ fontSize: 12, color: "#10b981", marginTop: 8, fontWeight: 600 }}>
              Results already published for this hackathon
            </div>
          )}
        </div>
        </>
      );
    }

  useEffect(() => {
    // Load hackathons for dropdown once.
    const loadHackathons = async () => {
      try {
        const res = await hackathonService.adminGetHackathons();
        const data = res?.data ?? res;
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setHackathonsList(list);

// If route id isn't valid, preselect the first available hackathon.
         if (!isValidRouteHackathonId && list.length) {
           const first = list[0]?._id ? String(list[0]._id) : (list[0]?.id ?? list[0]?.hackathonId ?? "");
           if (typeof first === "string" && /^[a-fA-F0-9]{24}$/.test(first)) {
             setSelectedHackathonId(first);
           }
         }
      } catch (e) {
        // Silent fail; user can still use route-based hackathon when available.
        console.error("Failed to load hackathons list", e);
      }
    };
    loadHackathons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [progress, setProgress] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [hackathon, setHackathon] = useState(null);

  const [published, setPublished] = useState(false);

  // Judge scores state


  // Draft edits stored locally keyed by submissionId to avoid duplicating state across ranks.

  const [draftOverrides, setDraftOverrides] = useState({});
  const [savingOverride, setSavingOverride] = useState(false);

  // Review Queue state
  const [queueItems, setQueueItems] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [queueComments, setQueueComments] = useState({});

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [openUid, setOpenUid] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3400);
  };

  useEffect(() => {
    if (!openUid) return;
    const h = () => setOpenUid(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [openUid]);

  const winners = useMemo(() => computeWinnerList(resultsData), [resultsData]);

  const awardOptions = useMemo(() => {
    // Avoid assumptions: build options from existing draft results awards + common presets.
    const awards = new Set();
    const list = Array.isArray(resultsData?.results)
      ? resultsData.results
      : Array.isArray(resultsData)
        ? resultsData
        : [];

    list.forEach((r) => {
      const a = r?.award ?? r?.prize;
      if (typeof a === "string" && a.trim()) awards.add(a.trim());
    });

    // Provide some common award slots without assuming backend; user can also leave blank.
    ["Best Innovation", "Best Design", "Best Impact", "Best Presentation", "Special Award"].forEach((a) => awards.add(a));

    const arr = Array.from(awards);
    return [{ value: "", label: "No award" }, ...arr.map((a) => ({ value: a, label: a }))];
  }, [resultsData]);

  const loadData = async () => {
    if (!isValidHackathonId) return;
    setLoading(true);
    setError("");
    try {
      const [pRes, rRes, queueRes] = await Promise.all([
        hackathonService.adminGetResultProgress(selectedHackathonId),
        hackathonService.adminGetHackathonResults(selectedHackathonId),
        hackathonService.adminGetReviewQueue(selectedHackathonId, "pending"),
      ]);


setProgress(pRes?.data ?? pRes);
       setResultsData(rRes?.data ?? rRes);
       // Ensure queueItems is always an array - handle cases where API returns object instead of array
       const queueData = queueRes?.data?.data;
       setQueueItems(Array.isArray(queueData) ? queueData : []);

      const draftPublishedFlag = Boolean(
        (pRes?.data ?? pRes)?.resultsPublished ?? (pRes?.data ?? pRes)?.published ?? (pRes?.data ?? pRes)?.isPublished
      );
      setPublished(draftPublishedFlag);

      setHackathon((rRes?.data ?? rRes)?.hackathon ?? (pRes?.data ?? pRes)?.hackathon ?? null);

      // Clear local override buffer when reloading authoritative backend state.
      setDraftOverrides({});
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to load draft/results";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHackathonId]);

  useEffect(() => {
    setActiveTab(0);
  }, [selectedHackathonId]);


  // Handle resolution of queue item
  const handleResolveQueueItem = async (queueId, status) => {
    setResolvingId(queueId);
    try {
      const response = await hackathonService.adminResolveQueueItem(queueId, {
        status,
        adminComment: queueComments?.[queueId] || "",
        expectedResolvedQueueVersion: 0,
      });

      showToast(`Score ${status} successfully`, "success");

      // Remove the resolved item from the list and update progress
      setQueueItems(prev => prev.filter(item => item._id !== queueId));

      if (progress) {
        setProgress(prev => ({
          ...prev,
          reviewQueue: {
            ...prev.reviewQueue,
            pending: (prev.reviewQueue?.pending || 0) - 1,
            [status === "approved" ? "approved" : "rejected"]:
              (prev.reviewQueue?.[status === "approved" ? "approved" : "rejected"] || 0) + 1,
          },
        }));
      }
    } catch (e) {
      showToast(e?.response?.data?.message || e?.message || `Failed to ${status} score`, "error");
    } finally {
      setResolvingId(null);
      // Clear comment for this item
      setQueueComments(prev => {
        const next = { ...prev };
        delete next[queueId];
        return next;
      });
    }
  };

  const handleQueueCommentChange = (itemId, comment) => {
    setQueueComments(prev => ({ ...prev, [itemId]: comment }));
  };

  const refreshQueue = async () => {
    if (!selectedHackathonId) return;
    try {
      const res = await hackathonService.adminGetReviewQueue(selectedHackathonId, "pending");
      // Ensure queueItems is always an array - handle cases where API returns object instead of array
      const queueData = res?.data?.data;
      setQueueItems(Array.isArray(queueData) ? queueData : []);
    } catch (e) {
      showToast("Failed to refresh queue", "error");
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedHackathonId) return;
    setGeneratingDraft(true);

    setError("");
    try {
      await hackathonService.adminComputeResults(selectedHackathonId, { tieBreakerRule: "earlier_submission" });
      showToast("Draft generated successfully.", "success");
      await loadData();
      setActiveTab(0);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to compute draft";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setGeneratingDraft(false);
    }
  };

  const handleEditOverride = (submissionId, patch) => {
    setDraftOverrides((prev) => {
      const curr = prev?.[submissionId] ?? {};
      return { ...prev, [submissionId]: { ...curr, ...patch } };
    });
  };

  const validateDraftOverrides = (nextOverrides) => {
    // Validate duplicate ranks and rank format.
    const entries = Object.entries(nextOverrides || {});
    const parsed = entries
      .map(([sid, o]) => ({
        submissionId: sid,
        finalRank: parseRank(o?.finalRank),
      }))
      .filter((x) => x.finalRank !== null);

    const rankSet = new Set();
    for (const p of parsed) {
      if (rankSet.has(p.finalRank)) {
        return { ok: false, message: `Duplicate rank detected: ${p.finalRank}` };
      }
      rankSet.add(p.finalRank);
    }
    return { ok: true };
  };

  const handleSaveOverride = async (submissionId) => {
    if (!selectedHackathonId) return;
    const next = { ...draftOverrides };
    const o = next?.[submissionId] ?? {};

    const finalRank = parseRank(o?.finalRank ?? null);
    if (!finalRank) {
      showToast("Please provide a valid positive integer rank.", "warning");
      return;
    }

    const nextOverrides = {
      ...draftOverrides,
      [submissionId]: {
        ...(draftOverrides?.[submissionId] ?? {}),
        finalRank,
        award: o?.award ?? null,
        reason: (o?.reason ?? "").toString(),
      },
    };

    const validation = validateDraftOverrides(nextOverrides);
    if (!validation.ok) {
      showToast(validation.message, "error");
      return;
    }

    // Build minimal override payload and call the override endpoint.
    const overridesPayload = Object.entries(nextOverrides).map(([sid, ov]) => {
      const fr = parseRank(ov?.finalRank ?? null);
      return {
        submissionId: sid,
        finalRank: fr,
        reason: (ov?.reason ?? "").toString(),
        award: ov?.award ?? null,
      };
    }).filter((x) => Number.isFinite(x.finalRank));

    setSavingOverride(true);
    try {
      // Use the override endpoint which handles the frontend payload format
      await hackathonService.adminSaveDraftOverrides(selectedHackathonId, overridesPayload);
      showToast("Draft updated successfully.", "success");
      await loadData();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to save draft";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSavingOverride(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedHackathonId) return;
    setPublishing(true);
    try {
      const payload = {
        // Contract example: winnerCount, runnerUpCount, notifyParticipants, specialAwards.
        // We must not assume counts; compute from winners if possible.
        winnerCount: Math.max(1, winners?.length ? Math.min(1, winners.length) : 0),
        runnerUpCount: Math.max(0, winners?.length ? Math.min(2, winners.length - 1) : 0),
        notifyParticipants: true,
        specialAwards: [],
      };

      await hackathonService.adminPublishResults(selectedHackathonId, payload);
      showToast("Results published successfully!", "success");
      await loadData();
      setActiveTab(3);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Failed to publish results";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setPublishing(false);
    }
  };

  const { isMobile, isTablet, isXS, isMD } = bp;


  const statsGrid = isXS || isMobile ? "repeat(2,1fr)" : isMD ? "repeat(3,1fr)" : isTablet ? "repeat(3,1fr)" : "repeat(5,1fr)";
  const showSidebar = bp.w >= 900;
  const mainGrid = showSidebar ? "1fr 290px" : "1fr";
  const bottomGrid = isXS || isMobile ? "1fr" : isMD ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";
  const TABS_SHORT = ["Review", "Winners", "Preview", "Publish"];
  const TABS_LONG = ["Review Queue", "Winners Selection", "Result Preview", "Publish Results"];
  const tabLabels = bp.w < 760 ? TABS_SHORT : TABS_LONG;

  const topWinners = winners.slice(0, 3);

  const openDetails = (w) => {
    setModal({ type: "details", data: w });
  };

  const resetDraftBuffer = () => setDraftOverrides({});

  return (
    <div style={{ minHeight: "100vh", fontFamily: T.font, background: T.bg, color: "#334155", overflowX: "hidden" }} onClick={() => setOpenUid(null)}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: `${isXS ? 14 : isMobile ? 16 : isMD ? 16 : 24}px ${isXS ? 12 : isMobile ? 16 : isMD ? 18 : 28}px`,
          paddingBottom: isMobile ? 0 : isXS ? 14 : isMobile ? 16 : isMD ? 16 : 24,
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap", minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 800, color: T.navy, lineHeight: 1.2 }}>
              Result Declaration
            </div>
          </div>
          {!isMobile && (
            <button
              onClick={() => {
                setActiveTab(2);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: `${isTablet ? "8px" : "10px"} ${isTablet ? "14px" : "18px"}`,
                borderRadius: 12,
                background: `linear-gradient(135deg,${T.accent},${T.accentDk})`,
                color: "#fff",
                fontSize: "clamp(12px,1.2vw,13px)",
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(59,130,246,.35)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Send size={13} /> Publish Results
            </button>
          )}
          <img
            src="https://i.pravatar.cc/80"
            alt="avatar"
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.12)", flexShrink: 0 }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: statsGrid, gap: isXS ? 8 : 12, marginBottom: 18 }}>
          {/* Hackathon selector (admin context switch) */}
<motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.01 }}
            style={{ minWidth: 0, gridColumn: isXS ? "1 / -1" : "1 / -1" }}
          >
            <SolidCard style={{ padding: isXS ? "10px 11px" : 14, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ position: "relative", zIndex: 1, minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Hackathon</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: T.navy, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {hackathonsList.length ? (hackathon?.title ?? "Select a hackathon") : "Loading hackathons..."}
                  </div>
                </div>

                <div style={{ position: "relative", zIndex: 100001, minWidth: 260, flex: "0 0 auto" }}>
                  <TeamDropdown
                    uid="hackathon-select"
                    value={selectedHackathonId}
                    openUid={openUid}
                    setOpenUid={setOpenUid}
                    onChange={(val) => {
                      setSelectedHackathonId(val);
                      setActiveTab(0);
                      setModal(null);
                    }}
                    options={hackathonsList
                      .map((h) => {
                        // Convert _id to string to handle both ObjectId objects and strings
                        const id = h?._id ? String(h._id) : (h?.id ?? h?.hackathonId ?? "");
                        const label = h?.title ?? h?.name ?? `Hackathon ${id ? id.slice(-4) : ""}`;
                        return { value: id, label };
                      })
                      .filter((o) => typeof o?.value === "string" && /^[a-fA-F0-9]{24}$/.test(o.value))}
                  />
                </div>
              </div>

{hackathonsList.length > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
                  Switching this dropdown will update draft/results and the "Publish Results" panel below.
                </div>
              )}
            </SolidCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }} style={{ minWidth: 0 }}>
            <Card style={{ padding: isXS ? "10px 11px" : "13px 15px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: isXS ? 8 : 11, minWidth: 0 }}>
                <div style={{ width: isXS ? 30 : 36, height: isXS ? 30 : 36, borderRadius: isXS ? 8 : 10, flexShrink: 0, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trophy size={isXS ? 14 : 17} color="#2563eb" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Hackathon</div>
                  <div style={{ fontSize: "clamp(12px,1.6vw,17px)", fontWeight: 800, color: T.navy, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hackathon?.title ?? "—"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ minWidth: 0 }}>
            <Card style={{ padding: isXS ? "10px 11px" : "13px 15px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: isXS ? 8 : 11, minWidth: 0 }}>
                <div style={{ width: isXS ? 30 : 36, height: isXS ? 30 : 36, borderRadius: isXS ? 8 : 10, flexShrink: 0, background: "#ccfbf1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={isXS ? 14 : 17} color="#0f766e" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Results</div>
                  <div style={{ fontSize: "clamp(12px,1.6vw,17px)", fontWeight: 800, color: T.navy, marginTop: 2 }}>
                    {winners.length ? winners.length : 0} ranked
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} style={{ minWidth: 0 }}>
            <Card style={{ padding: isXS ? "10px 11px" : "13px 15px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: isXS ? 8 : 11, minWidth: 0 }}>
                <div style={{ width: isXS ? 30 : 36, height: isXS ? 30 : 36, borderRadius: isXS ? 8 : 10, flexShrink: 0, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Award size={isXS ? 14 : 17} color="#7c3aed" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Status</div>
                  <div style={{ fontSize: "clamp(12px,1.6vw,17px)", fontWeight: 800, color: T.navy, marginTop: 2 }}>
                    {published ? "Published" : "Draft"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ minWidth: 0 }}>
            <Card style={{ padding: isXS ? "10px 11px" : "13px 15px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: isXS ? 8 : 11, minWidth: 0 }}>
                <div style={{ width: isXS ? 30 : 36, height: isXS ? 30 : 36, borderRadius: isXS ? 8 : 10, flexShrink: 0, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileBadge size={isXS ? 14 : 17} color="#0284c7" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Draft</div>
                  <div style={{ fontSize: "clamp(12px,1.6vw,17px)", fontWeight: 800, color: T.navy, marginTop: 2 }}>
                    {progress?.draftGenerated || progress?.resultsGenerated || progress?.isDraftGenerated ? "Ready" : "Not generated"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {showSidebar && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} style={{ minWidth: 0 }}>
              <Card style={{ padding: isXS ? "10px 11px" : "13px 15px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: isXS ? 8 : 11, minWidth: 0 }}>
                  <div style={{ width: isXS ? 30 : 36, height: isXS ? 30 : 36, borderRadius: isXS ? 8 : 10, flexShrink: 0, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Globe size={isXS ? 14 : 17} color="#15803d" />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Visibility</div>
                    <div style={{ fontSize: "clamp(12px,1.6vw,17px)", fontWeight: 800, color: T.navy, marginTop: 2 }}>
                      {published ? "Public" : "Hidden"}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mainGrid, gap: 20, alignItems: "start", marginBottom: 18, minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ minWidth: 0 }}>
            <Card style={{ padding: isXS ? 14 : isMD ? 16 : "clamp(16px,2.5vw,24px)", minWidth: 0 }}>
              <div className="sb-hide" style={{ display: "flex", borderBottom: "2px solid #f1f5f9", marginBottom: 20, overflowX: "auto", minWidth: 0, width: "100%" }}>
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
                      marginBottom: -2,
                      background: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.17 }} style={{ minWidth: 0 }}>
                  {activeTab === 0 && (
                    <ReviewQueueTab
                      queueItems={queueItems}
                      progress={progress}
                      loading={loading}
                      resolvingId={resolvingId}
                      queueComments={queueComments}
                      onResolve={handleResolveQueueItem}
                      onCommentChange={handleQueueCommentChange}
                    />
                  )}

                  {activeTab === 1 && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ fontWeight: 800, color: T.navy, fontSize: 14 }}>Draft generation</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Compute rankings and load draft results</div>
                        </div>
                        <button
                          onClick={() => {
                            setModal({ type: "confirmGenerate" });
                          }}
                          disabled={generatingDraft || published}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "10px 14px",
                            borderRadius: 12,
                            background: published ? "#dbeafe" : generatingDraft ? "#dbeafe" : `linear-gradient(135deg,${T.accent},${T.accentDk})`,
                            color: published ? "#1e40af" : "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                            boxShadow: published || generatingDraft ? "none" : "0 4px 14px rgba(59,130,246,.3)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {generatingDraft ? (
                            <>
                              <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Generating...
                            </>
                          ) : (
                            <>
                              <Trophy size={15} /> Generate Draft
                            </>
                          )}
                        </button>
                      </div>

                      <WinnersTable
                        resultsData={resultsData}
                        loading={loading}
                        error={error}
                        onOpenDetails={openDetails}
                        openUid={openUid}
                        setOpenUid={setOpenUid}
                        onEditOverride={handleEditOverride}
                        draftOverrides={draftOverrides}
                        onSaveOverride={handleSaveOverride}
                        savingOverride={savingOverride}
                        awardOptions={awardOptions}
                      />

                      {Object.keys(draftOverrides || {}).length > 0 && (
                        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => {
                              resetDraftBuffer();
                              showToast("Unsaved changes cleared.", "info");
                            }}
                            style={{
                              padding: "10px 14px",
                              borderRadius: 12,
                              border: "1.5px solid #e2e8f0",
                              background: "#f8fafc",
                              color: "#475569",
                              fontSize: 13,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Clear edits
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 2 && <PreviewTab winners={winners} published={published} />}

                  {activeTab === 3 && (
                    <PublishControls
                      progress={progress}
                      resultsData={resultsData}
                      draftOverridesPending={Object.keys(draftOverrides || {}).length > 0}
                      published={published}
                      generatingDraft={generatingDraft}
                      publishing={publishing}
                      onPublish={() => setModal({ type: "confirmPublish" })}
                      hackathonTitle={hackathon?.title || ""}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>

          {showSidebar && (
            <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} style={{ minWidth: 0, maxWidth: "100%" }}>
              <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Result Summary</span>
                  <button
                    onClick={() => {
                      loadData();
                      showToast("State refreshed.", "info");
                    }}
                    style={{
                      fontSize: 12,
                      padding: "4px 11px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      color: "#64748b",
                      background: "#f8fafc",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Refresh
                  </button>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  {topWinners.length ? (
                    topWinners.map((w) => (
                      <button
                        key={w.submissionId}
                        onClick={() => openDetails(w)}
                        title={w.team}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          flexShrink: 0,
                          background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`,
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 3px 10px ${w.gradFrom}44`,
                        }}
                      >
                        {w.rank}
                      </button>
                    ))
                  ) : (
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>No ranked winners yet.</div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: 14, background: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "1.5px solid #fde68a", marginBottom: 14, flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 11,
                      flexShrink: 0,
                      background: topWinners[0] ? `linear-gradient(135deg,${topWinners[0].gradFrom},${topWinners[0].gradTo})` : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: topWinners[0] ? `0 4px 14px ${topWinners[0].gradFrom}55` : "none",
                    }}
                  >
                    <Medal size={20} color={topWinners[0] ? "#fff" : "#334155"} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topWinners[0]?.team || "—"}</div>
                    <div style={{ fontSize: 11, color: "#92400e", marginTop: 1 }}>{topWinners[0]?.members?.length ? `${topWinners[0].members.length} members` : ""}</div>
                    <Badge bg="#fef9c3" color="#713f12">{published ? "Published" : "Draft"}</Badge>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                  {[
                    { icon: Users, label: "Winners", value: String(winners.length) },
                    { icon: Trophy, label: "Top 3", value: String(topWinners.length) },
                    { icon: Globe, label: "Visibility", value: published ? "Public" : "Draft" },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", gap: 6, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12, minWidth: 0 }}>
                        <row.icon size={13} />
                        <span style={{ whiteSpace: "nowrap" }}>{row.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{row.value}</span>
                    </div>
                  ))}
                </div>

<div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                   <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>
                     Quick Actions
                   </div>
                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                     <button
                       onClick={() => {
                         setActiveTab(1);
                         showToast("View winners.", "info");
                       }}
                       style={{ padding: "9px 0", borderRadius: 10, background: "#eff6ff", color: T.accent, fontSize: 12, fontWeight: 700, border: "1.5px solid #bfdbfe" }}
                       disabled={published}
                     >
                       Winners
                     </button>
                     <button
                       onClick={() => setActiveTab(2)}
                       style={{ padding: "9px 0", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "rgba(255,255,255,.8)", color: "#475569", fontSize: 12, fontWeight: 700 }}
                     >
                       Preview
                     </button>
                     <button
                       onClick={() => setActiveTab(3)}
                       style={{ gridColumn: "1 / -1", padding: "9px 0", borderRadius: 10, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 12, fontWeight: 800 }}
                       disabled={published}
                     >
                       Publish
                     </button>
                   </div>
                 </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: bottomGrid, gap: isXS ? 10 : 18, minWidth: 0 }}>
          <CertificateProgress />
          <ResultTimeline progress={progress} onExport={() => showToast("Timeline exported!", "success")} />
          <Card style={{ padding: "clamp(14px,2vw,20px)", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>Top Scores</span>
              <button onClick={() => setModal({ type: "allWinners" })} style={{ fontSize: 11, color: T.accent, fontWeight: 700, background: "none", whiteSpace: "nowrap" }}>
                View All
              </button>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>Leaderboard — Top ranked teams</div>
            {topWinners.length ? (
              topWinners.map((w) => (
                <div key={w.submissionId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", marginBottom: 8, gap: 8, flexWrap: "wrap", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                      {w.rank}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.team || "Team"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: T.navy }}>{w.score !== null ? w.score.toFixed(2) : "—"}</span>
                    <Badge bg={w.rankBadge?.bg ?? "#dbeafe"} color={w.rankBadge?.color ?? "#1e40af"}>{w.pos || `#${w.rank}`}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 13 }}>Generate draft to populate leaderboard.</div>
            )}
<button onClick={() => setActiveTab(3)} style={{ marginTop: 4, width: "100%", padding: "10px 0", borderRadius: 10, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", boxShadow: "0 4px 14px rgba(59,130,246,.3)" }} disabled={published}>
               Publish Results
             </button>
          </Card>
        </div>
      </div>

      {modal?.type === "confirmGenerate" && (
        <Modal
          title="Generate Draft"
          onClose={() => {
            setModal(null);
          }}
        >
          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 14 }}>
            This will compute ranking results for this hackathon using tieBreakerRule "earlier_submission".
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setModal(null)}
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 13, fontWeight: 800 }}
              disabled={generatingDraft}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setModal(null);
                await handleGenerateDraft();
              }}
              style={{ flex: 1, padding: "12px", borderRadius: 12, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 14px rgba(59,130,246,.3)" }}
              disabled={generatingDraft || published}
            >
              {generatingDraft ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "confirmPublish" && (
        <Modal
          title="Publish Results"
          onClose={() => {
            setModal(null);
          }}
        >
          <div style={{ color: "#64748b", fontSize: 13, marginBottom: 14 }}>
            Publishing locks results and notifies participants. This action is irreversible.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setModal(null)}
              style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 13, fontWeight: 800 }}
              disabled={publishing}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setModal(null);
                await handlePublish();
              }}
              style={{ flex: 1, padding: "12px", borderRadius: 12, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 13, fontWeight: 800, boxShadow: "0 4px 14px rgba(59,130,246,.3)" }}
              disabled={publishing || published}
            >
              {publishing ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Publishing...
                </>
              ) : (
                <>Publish</>
              )}
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "details" && (
        <Modal title="Winner Details" onClose={() => setModal(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <RankCircle rank={modal.data?.rank} gradFrom={modal.data?.gradFrom} gradTo={modal.data?.gradTo} size={48} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.navy }}>{modal.data?.team || "—"}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Submission: {modal.data?.submissionId || "—"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: T.navy }}>{modal.data?.score !== null ? modal.data.score.toFixed(2) : "—"}</div>
              <div style={{ marginTop: 6 }}>
                <Badge bg={modal.data?.rankBadge?.bg ?? "#dbeafe"} color={modal.data?.rankBadge?.color ?? "#1e40af"}>

                  {modal.data?.pos || `#${modal.data?.rank}`}
                </Badge>
              </div>
            </div>
          </div>

          <div style={{ padding: "13px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9", minWidth: 0, marginTop: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Project</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.navy, marginBottom: 8, overflowWrap: "break-word" }}>{modal.data?.project || ""}</div>
            {modal.data?.award && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Badge bg="#eff6ff" color={T.accent}>Award</Badge>
                <span style={{ color: "#1e40af", fontWeight: 700, fontSize: 13 }}>{modal.data.award}</span>
              </div>
            )}
            {modal.data?.isOverride && (
              <div style={{ marginTop: 10, color: "#334155", fontSize: 13 }}>
                <strong>Override reason:</strong> {modal.data?.overrideReason || "—"}
              </div>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Team Members</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {(modal.data?.members ?? []).map((m) => (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, color: "#475569" }}>
                  <UserCheck size={12} color={T.accent} /> {m}
                </div>
              ))}
              {!(modal.data?.members ?? []).length && <div style={{ color: "#64748b", fontSize: 13 }}>No members listed.</div>}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <button
              onClick={() => setModal(null)}
              style={{ padding: "12px 16px", borderRadius: 12, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 14, fontWeight: 800 }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "allWinners" && (
        <Modal title="Leaderboard" onClose={() => setModal(null)}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Final drafted results (ranked)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {winners.map((w) => (
              <div
                key={w.submissionId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${w.gradFrom},${w.gradTo})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>
                    {w.rank}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.team || "Team"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: T.navy }}>{w.score !== null ? w.score.toFixed(2) : "—"}</span>
                  <Badge bg={w.rankBadge?.bg ?? "#dbeafe"} color={w.rankBadge?.color ?? "#1e40af"}>{w.pos || `#${w.rank}`}</Badge>
                </div>
              </div>
            ))}
            {!winners.length && <div style={{ color: "#64748b", fontSize: 13 }}>No winners available.</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button onClick={() => setModal(null)} style={{ padding: "9px 20px", borderRadius: 10, background: `linear-gradient(135deg,${T.accent},${T.accentDk})`, color: "#fff", fontSize: 13, fontWeight: 900 }}>
              Close
            </button>
          </div>
        </Modal>
      )}

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}