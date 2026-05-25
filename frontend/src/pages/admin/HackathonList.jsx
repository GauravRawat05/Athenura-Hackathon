import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, FileEdit, CalendarDays, PlayCircle,
  CheckCircle2, TrendingUp, Pencil, Copy, Trash2, ChevronLeft,
  ChevronRight, Activity, Calendar, Globe, Users, GraduationCap,
  Trophy, Building2, FileText, Code2, Database, Zap, Hexagon,
  Sparkles, X, CheckCircle, ChevronDown, Clock, AlertCircle,
  Flag, Shield, Settings, Eye, EyeOff, ToggleLeft, ToggleRight,
  Mail, UserCheck, Lock, Unlock, Star, Medal, Award,
  BookOpen, ListChecks, SlidersHorizontal,
} from "lucide-react";

const SCROLLBAR_STYLE = `
  html, body, #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  * {
    box-sizing: border-box;
  }
  img, svg, canvas, video {
    max-width: 100%;
  }
  .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
  .hide-scroll::-webkit-scrollbar { display: none; }
`;
function GlobalStyle() {
  return <style>{SCROLLBAR_STYLE}</style>;
}

const iconMap = { ai: Sparkles, code: Code2, hex: Hexagon, infinity: Zap, data: Database };

const statusBadge = {
  Upcoming: "bg-blue-100/70 text-blue-700 border border-blue-200/60",
  Ongoing:  "bg-emerald-100/70 text-emerald-700 border border-emerald-200/60",
  Completed:"bg-purple-100/70 text-purple-700 border border-purple-200/60",
};

const formatINR = (n) => "₹" + n.toLocaleString("en-IN");

const DEFAULT_SETTINGS = {
  publiclyVisible: true,
  registrationOpen: true,
  allowTeamChanges: false,
  requireApproval: false,
  sendEmailUpdates: true,
  showLeaderboard: true,
};

const emptyHackathon = {
  name: "", subtitle: "", status: "Upcoming",
  regFrom: "", regTo: "", eventFrom: "", eventTo: "",
  submissionDeadline: "", resultsDate: "",
  prize: 0, mode: "Online", teamSize: "2 - 5 Members",
  eligibility: "All Students", organizedBy: "", description: "",
  settings: { ...DEFAULT_SETTINGS },
};

const HACKATHON_RULES = [
  "Teams must register before the registration deadline to participate.",
  "Each participant can only be part of one team.",
  "All code must be written during the hackathon period — no pre-built solutions.",
  "Projects must be original work and not infringe on any intellectual property.",
  "Teams must submit their project via the official submission portal before the deadline.",
  "Use of open-source libraries and APIs is allowed and encouraged.",
  "Teams must present their project to judges during the evaluation round.",
  "Judges' decisions are final and binding.",
  "Any form of plagiarism or misconduct will result in immediate disqualification.",
  "Participants must adhere to the code of conduct throughout the event.",
];

const initialData = [
  {
    id: "1", name: "AI Revolution 2026", subtitle: "Revolutionizing AI for a better future",
    status: "Upcoming", regFrom: "May 01, 2026", regTo: "May 31, 2026",
    eventFrom: "Jun 15, 2026", eventTo: "Jun 17, 2026",
    submissionDeadline: "Jun 16, 2026, 11:59 PM", resultsDate: "Jun 20, 2026",
    prize: 500000,
    mode: "Online", teamSize: "2 - 5 Members", eligibility: "All Students",
    organizedBy: "HackSphere",
    description: "AI Revolution 2026 aims to bring together the brightest minds to solve real-world problems using artificial intelligence and machine learning.",
    iconKey: "ai", iconBg: "from-blue-500 to-indigo-600",
    settings: { publiclyVisible: true, registrationOpen: true, allowTeamChanges: false, requireApproval: false, sendEmailUpdates: true, showLeaderboard: true },
  },
  {
    id: "2", name: "Code Infinity", subtitle: "Infinite possibilities in code",
    status: "Ongoing", regFrom: "Apr 15, 2026", regTo: "May 25, 2026",
    eventFrom: "May 30, 2026", eventTo: "Jun 01, 2026",
    submissionDeadline: "Jun 01, 2026, 11:59 PM", resultsDate: "Jun 05, 2026",
    prize: 300000,
    mode: "Hybrid", teamSize: "3 - 6 Members", eligibility: "Open to All",
    organizedBy: "CodeWorks",
    description: "A 48-hour sprint where teams build innovative solutions pushing the boundaries of modern software engineering.",
    iconKey: "code", iconBg: "from-emerald-500 to-teal-600",
    settings: { publiclyVisible: true, registrationOpen: false, allowTeamChanges: true, requireApproval: false, sendEmailUpdates: true, showLeaderboard: true },
  },
  {
    id: "3", name: "HackX 5.0", subtitle: "The next generation hackathon",
    status: "Upcoming", regFrom: "Jun 01, 2026", regTo: "Jun 30, 2026",
    eventFrom: "Jul 15, 2026", eventTo: "Jul 17, 2026",
    submissionDeadline: "Jul 16, 2026, 11:59 PM", resultsDate: "Jul 21, 2026",
    prize: 400000,
    mode: "Offline", teamSize: "2 - 4 Members", eligibility: "College Students",
    organizedBy: "HackX Foundation",
    description: "HackX returns with its fifth edition focused on building products that matter for the next billion users.",
    iconKey: "hex", iconBg: "from-purple-500 to-fuchsia-600",
    settings: { publiclyVisible: true, registrationOpen: true, allowTeamChanges: false, requireApproval: true, sendEmailUpdates: true, showLeaderboard: false },
  },
  {
    id: "4", name: "DevSprint", subtitle: "Sprint into innovation",
    status: "Completed", regFrom: "Feb 01, 2026", regTo: "Feb 28, 2026",
    eventFrom: "Mar 15, 2026", eventTo: "Mar 17, 2026",
    submissionDeadline: "Mar 16, 2026, 11:59 PM", resultsDate: "Mar 20, 2026",
    prize: 250000,
    mode: "Online", teamSize: "1 - 4 Members", eligibility: "All Developers",
    organizedBy: "DevHub",
    description: "A high-energy weekend sprint focused on shipping production-ready features in record time.",
    iconKey: "infinity", iconBg: "from-orange-400 to-amber-500",
    settings: { publiclyVisible: true, registrationOpen: false, allowTeamChanges: false, requireApproval: false, sendEmailUpdates: false, showLeaderboard: true },
  },
  {
    id: "5", name: "DataStorm", subtitle: "Unleash the power of data",
    status: "Completed", regFrom: "Jan 01, 2026", regTo: "Jan 31, 2026",
    eventFrom: "Feb 15, 2026", eventTo: "Feb 17, 2026",
    submissionDeadline: "Feb 16, 2026, 11:59 PM", resultsDate: "Feb 22, 2026",
    prize: 200000,
    mode: "Online", teamSize: "2 - 5 Members", eligibility: "Data Scientists",
    organizedBy: "DataMinds",
    description: "A data-driven hackathon where teams tackle massive datasets to extract insights that drive real impact.",
    iconKey: "data", iconBg: "from-sky-500 to-cyan-600",
    settings: { publiclyVisible: false, registrationOpen: false, allowTeamChanges: false, requireApproval: false, sendEmailUpdates: false, showLeaderboard: true },
  },
];

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };
  return { toasts, success: (msg) => show(msg, "success"), error: (msg) => show(msg, "error") };
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl px-4 py-3 text-sm font-medium text-navy pointer-events-auto"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function CustomDropdown({ value, onValueChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = normalised.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/60 bg-white/60 px-3 py-2.5 text-xs sm:text-sm text-[#0b1b52] shadow-sm backdrop-blur-xl transition hover:bg-white/80 focus:outline-none"
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-40 mt-1.5 overflow-hidden rounded-xl border border-white/60 bg-white/95 p-1 shadow-2xl backdrop-blur-xl"
          >
            {normalised.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onValueChange(opt.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm transition ${
                    opt.value === value
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-[#0b1b52] hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                  {opt.value === value && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl mx-2 sm:mx-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-4 sm:p-6 z-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#0b1b52] font-bold text-base sm:text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center hover:bg-white/60 transition-colors">
            <X className="w-4 h-4 text-[#0b1b52]" />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </motion.div>
    </div>
  );
}

function ActionBtn({ color, children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow`}
    >
      {children}
    </motion.button>
  );
}

function PageBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 text-[#0b1b52] flex items-center justify-center hover:scale-105 transition-all"
    >
      {children}
    </button>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start justify-between py-2 sm:py-2.5 border-b border-white/40 last:border-0 gap-2 min-w-0">
      <div className="flex items-center gap-2 sm:gap-2.5 text-slate-500 flex-shrink-0">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      <div className="text-xs sm:text-sm text-[#0b1b52] font-medium text-right truncate min-w-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/40 last:border-0 gap-3 min-w-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-[#0b1b52] truncate">{label}</p>
        {description && <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all duration-200 focus:outline-none ${
          checked ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-200" : "bg-slate-200"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-sm ${
            checked ? "left-[calc(100%-18px)] sm:left-[calc(100%-22px)]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

const inputCls = "w-full mt-1 bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-sm text-[#0b1b52] outline-none focus:ring-2 focus:ring-blue-400/40 placeholder:text-slate-400 min-w-0";
const labelCls = "text-[#0b1b52] text-xs sm:text-sm font-medium";

function FormFields({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[55vh] overflow-y-auto hide-scroll pr-1 min-w-0">
      <div className="sm:col-span-2 min-w-0">
        <label className={labelCls}>Name</label>
        <input value={value.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
      </div>
      <div className="sm:col-span-2 min-w-0">
        <label className={labelCls}>Subtitle</label>
        <input value={value.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Status</label>
        <CustomDropdown
          value={value.status}
          onValueChange={(v) => set("status", v)}
          options={["Upcoming", "Ongoing", "Completed"]}
          className="mt-1"
        />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Mode</label>
        <CustomDropdown
          value={value.mode}
          onValueChange={(v) => set("mode", v)}
          options={["Online", "Offline", "Hybrid"]}
          className="mt-1"
        />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Registration From</label>
        <input value={value.regFrom} onChange={(e) => set("regFrom", e.target.value)} placeholder="May 01, 2026" className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Registration To</label>
        <input value={value.regTo} onChange={(e) => set("regTo", e.target.value)} placeholder="May 31, 2026" className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Event From</label>
        <input value={value.eventFrom} onChange={(e) => set("eventFrom", e.target.value)} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Event To</label>
        <input value={value.eventTo} onChange={(e) => set("eventTo", e.target.value)} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Submission Deadline</label>
        <input value={value.submissionDeadline} onChange={(e) => set("submissionDeadline", e.target.value)} placeholder="Jun 16, 2026, 11:59 PM" className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Results Date</label>
        <input value={value.resultsDate} onChange={(e) => set("resultsDate", e.target.value)} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Prize Pool (₹)</label>
        <input type="number" value={value.prize} onChange={(e) => set("prize", Number(e.target.value))} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Team Size</label>
        <input value={value.teamSize} onChange={(e) => set("teamSize", e.target.value)} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Eligibility</label>
        <input value={value.eligibility} onChange={(e) => set("eligibility", e.target.value)} className={inputCls} />
      </div>
      <div className="min-w-0">
        <label className={labelCls}>Organized By</label>
        <input value={value.organizedBy} onChange={(e) => set("organizedBy", e.target.value)} className={inputCls} />
      </div>
      <div className="sm:col-span-2 min-w-0">
        <label className={labelCls}>Description</label>
        <textarea
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputCls + " resize-none"}
        />
      </div>
    </div>
  );
}

function OverviewContent({ selected }) {
  return (
    <div className="space-y-1 min-w-0">
      <DetailRow icon={Activity} label="Status">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge[selected.status]}`}>
          {selected.status}
        </span>
      </DetailRow>
      <DetailRow icon={Calendar} label="Registration">
        <span className="text-right truncate">{selected.regFrom} – {selected.regTo}</span>
      </DetailRow>
      <DetailRow icon={CalendarDays} label="Event Dates">
        <span className="text-right truncate">{selected.eventFrom} – {selected.eventTo}</span>
      </DetailRow>
      <DetailRow icon={Globe} label="Mode"><span className="truncate">{selected.mode}</span></DetailRow>
      <DetailRow icon={Users} label="Team Size"><span className="truncate">{selected.teamSize}</span></DetailRow>
      <DetailRow icon={GraduationCap} label="Eligibility"><span className="truncate">{selected.eligibility}</span></DetailRow>
      <DetailRow icon={Trophy} label="Prize Pool"><span className="truncate">{formatINR(selected.prize)}</span></DetailRow>
      <DetailRow icon={Building2} label="Organized By"><span className="truncate">{selected.organizedBy}</span></DetailRow>
      <div className="pt-3 sm:pt-4 border-t border-white/60 mt-2 sm:mt-3 min-w-0">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm">Description</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">{selected.description}</p>
      </div>
    </div>
  );
}

function DeadlinesContent({ selected }) {
  const milestones = [
    {
      icon: UserCheck,
      label: "Registration Opens",
      date: selected.regFrom,
      sub: "Participants can start signing up",
      color: "bg-blue-100 text-blue-600",
      bar: "bg-blue-400",
    },
    {
      icon: Flag,
      label: "Registration Closes",
      date: selected.regTo,
      sub: "Last date to register your team",
      color: "bg-amber-100 text-amber-600",
      bar: "bg-amber-400",
    },
    {
      icon: PlayCircle,
      label: "Event Starts",
      date: selected.eventFrom,
      sub: "Kickoff and problem statement release",
      color: "bg-emerald-100 text-emerald-600",
      bar: "bg-emerald-400",
    },
    {
      icon: AlertCircle,
      label: "Submission Deadline",
      date: selected.submissionDeadline || "TBA",
      sub: "All project submissions due by this time",
      color: "bg-rose-100 text-rose-600",
      bar: "bg-rose-400",
    },
    {
      icon: CheckCircle2,
      label: "Event Ends",
      date: selected.eventTo,
      sub: "Presentations and demos conclude",
      color: "bg-purple-100 text-purple-600",
      bar: "bg-purple-400",
    },
    {
      icon: Trophy,
      label: "Results Announced",
      date: selected.resultsDate || "TBA",
      sub: "Winners and prizes declared",
      color: "bg-indigo-100 text-indigo-600",
      bar: "bg-indigo-400",
    },
  ];

  return (
    <div className="space-y-2.5 min-w-0">
      {milestones.map((m, i) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/40 px-3 py-2.5 backdrop-blur-sm min-w-0"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${m.color} flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#0b1b52] truncate">{m.label}</p>
              <p className="text-[10px] text-slate-400 truncate">{m.sub}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs font-medium text-[#0b1b52] whitespace-nowrap">{m.date}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PrizePoolContent({ selected }) {
  const total = selected.prize;
  const tiers = [
    { rank: "1st Place", icon: Trophy,  pct: 0.50, color: "from-amber-400 to-yellow-500",   bg: "bg-amber-50 border-amber-200",   text: "text-amber-700",  label: "Winner" },
    { rank: "2nd Place", icon: Medal,   pct: 0.30, color: "from-slate-400 to-slate-500",     bg: "bg-slate-50 border-slate-200",   text: "text-slate-600",  label: "Runner Up" },
    { rank: "3rd Place", icon: Award,   pct: 0.20, color: "from-orange-300 to-amber-400",   bg: "bg-orange-50 border-orange-200", text: "text-orange-700", label: "Second Runner Up" },
  ];

  const extras = [
    { label: "Best UI/UX Design",       prize: Math.round(total * 0.03) },
    { label: "Most Innovative Idea",    prize: Math.round(total * 0.03) },
    { label: "Best Use of AI/ML",       prize: Math.round(total * 0.02) },
    { label: "Community Choice Award",  prize: Math.round(total * 0.02) },
  ];

  return (
    <div className="space-y-4 min-w-0">
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 truncate">Top Prize Distribution</p>
        {tiers.map((t, i) => {
          const Icon = t.icon;
          const amount = Math.round(total * t.pct);
          return (
            <motion.div
              key={t.rank}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${t.bg} min-w-0`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${t.text} truncate`}>{t.rank}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.label}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${t.text} whitespace-nowrap`}>{formatINR(amount)}</p>
                <p className="text-[10px] text-slate-400 whitespace-nowrap">{Math.round(t.pct * 100)}% of pool</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 px-4 py-3 flex items-center justify-between min-w-0">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">Total Prize Pool</p>
          <p className="text-lg font-bold text-[#0b1b52] truncate">{formatINR(total)}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <Star className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 truncate">Special Awards</p>
        <div className="space-y-1.5">
          {extras.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-white/50 bg-white/40 px-3 py-2 min-w-0"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-xs text-[#0b1b52] truncate">{e.label}</span>
              </div>
              <span className="text-xs font-semibold text-indigo-700 whitespace-nowrap flex-shrink-0 ml-2">{formatINR(e.prize)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RulesContent() {
  return (
    <div className="space-y-3 min-w-0">
      <div className="flex items-center gap-2 text-slate-500 mb-3">
        <BookOpen className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">Rules & Guidelines</span>
      </div>
      <div className="space-y-2">
        {HACKATHON_RULES.map((rule, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-2.5 rounded-xl border border-white/50 bg-white/40 px-3 py-2.5 backdrop-blur-sm min-w-0"
          >
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              {i + 1}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed break-words">{rule}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-2.5 flex items-start gap-2 min-w-0">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 break-words">Violation of any rule may result in disqualification without prior notice. The organizer's decision is final.</p>
      </div>
    </div>
  );
}

function SettingsContent({ selected, onUpdateSettings }) {
  const s = selected.settings ?? DEFAULT_SETTINGS;
  const update = (k, v) => onUpdateSettings({ ...s, [k]: v });

  const toggles = [
    {
      key: "publiclyVisible",
      label: "Publicly Visible",
      description: "Show this hackathon on the public listing page",
      icon: Eye,
    },
    {
      key: "registrationOpen",
      label: "Registration Open",
      description: "Allow new participants to register",
      icon: UserCheck,
    },
    {
      key: "requireApproval",
      label: "Require Approval",
      description: "Manually approve each team before they join",
      icon: Shield,
    },
    {
      key: "allowTeamChanges",
      label: "Allow Team Changes",
      description: "Let participants modify team members after registration",
      icon: Users,
    },
    {
      key: "sendEmailUpdates",
      label: "Send Email Updates",
      description: "Notify registered participants about announcements",
      icon: Mail,
    },
    {
      key: "showLeaderboard",
      label: "Show Leaderboard",
      description: "Display public leaderboard during the event",
      icon: ListChecks,
    },
  ];

  return (
    <div className="space-y-1 min-w-0">
      <div className="flex items-center gap-2 text-slate-500 mb-3">
        <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">Hackathon Settings</span>
      </div>
      {toggles.map((t, i) => (
        <motion.div
          key={t.key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="min-w-0"
        >
          <Toggle
            checked={s[t.key] ?? false}
            onChange={(v) => update(t.key, v)}
            label={t.label}
            description={t.description}
          />
        </motion.div>
      ))}

      <div className="mt-3 rounded-xl border border-white/50 bg-white/30 px-3 py-2.5 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 truncate">Current Status</p>
        <div className="flex flex-wrap gap-1.5">
          {s.publiclyVisible ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700 whitespace-nowrap">
              <Eye className="w-3 h-3" /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600 whitespace-nowrap">
              <EyeOff className="w-3 h-3" /> Hidden
            </span>
          )}
          {s.registrationOpen ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2 py-0.5 text-[10px] font-medium text-blue-700 whitespace-nowrap">
              <Unlock className="w-3 h-3" /> Reg. Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-2 py-0.5 text-[10px] font-medium text-rose-700 whitespace-nowrap">
              <Lock className="w-3 h-3" /> Reg. Closed
            </span>
          )}
          {s.requireApproval && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-700 whitespace-nowrap">
              <Shield className="w-3 h-3" /> Approval Required
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const tabs = ["Overview", "Deadlines", "Prize Pool", "Rules", "Settings"];

function DetailPanel({ selected, activeTab, setActiveTab, openEdit, onUpdateSettings }) {
  if (!selected) return null;

  return (
    <>
      <div className="flex items-start justify-between mb-2 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b52] truncate mr-2">Hackathon Details</h3>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => openEdit(selected)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex-shrink-0"
        >
          Edit
        </motion.button>
      </div>
      <p className="text-base sm:text-xl font-semibold text-[#0b1b52] mb-4 sm:mb-5 truncate">{selected.name}</p>

      <div className="flex gap-3 sm:gap-5 border-b border-white/60 mb-4 sm:mb-5 overflow-x-auto hide-scroll min-w-0 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm whitespace-nowrap transition-colors relative flex-shrink-0 ${
              activeTab === tab ? "text-[#0b1b52] font-semibold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="overflow-y-auto hide-scroll max-h-[420px] pr-0.5 min-w-0 w-full"
        >
          {activeTab === "Overview"   && <OverviewContent selected={selected} />}
          {activeTab === "Deadlines"  && <DeadlinesContent selected={selected} />}
          {activeTab === "Prize Pool" && <PrizePoolContent selected={selected} />}
          {activeTab === "Rules"      && <RulesContent />}
          {activeTab === "Settings"   && (
            <SettingsContent selected={selected} onUpdateSettings={onUpdateSettings} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function HackathonDashboard() {
const [hackathons, setHackathons] = useState(() => {
    try {
      const temp = JSON.parse(sessionStorage.getItem("tempHackathons") || "[]");
      return [...temp, ...initialData];
    } catch {
      return initialData;
    }
  });
  const [selectedId, setSelectedId] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("Overview");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({ ...emptyHackathon });
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const filtered = useMemo(() => hackathons.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || h.status === statusFilter;
    return matchSearch && matchStatus;
  }), [hackathons, searchQuery, statusFilter]);

  const selected = hackathons.find((h) => h.id === selectedId) ?? hackathons[0];

  const stats = useMemo(() => {
    const upcoming  = hackathons.filter((h) => h.status === "Upcoming").length;
    const ongoing   = hackathons.filter((h) => h.status === "Ongoing").length;
    const completed = hackathons.filter((h) => h.status === "Completed").length;
    return [
      { label: "Total Hackathons", value: hackathons.length, change: "+12.0%", icon: FileEdit,     iconBg: "from-blue-400 to-indigo-500" },
      { label: "Upcoming",         value: upcoming,          change: "+5.6%",  icon: CalendarDays, iconBg: "from-sky-400 to-cyan-500" },
      { label: "Ongoing",          value: ongoing,           change: "+8.3%",  icon: PlayCircle,   iconBg: "from-emerald-400 to-teal-500" },
      { label: "Completed",        value: completed,         change: "+15.2%", icon: CheckCircle2, iconBg: "from-purple-400 to-fuchsia-500" },
    ];
  }, [hackathons]);

  const handleDelete = (id) => {
    setHackathons((prev) => prev.filter((h) => h.id !== id));
    if (selectedId === id) {
      const next = hackathons.find((h) => h.id !== id);
      if (next) setSelectedId(next.id);
    }
    toast.success("Hackathon deleted");
  };

  const handleDuplicate = (h) => {
    const copy = { ...h, id: crypto.randomUUID(), name: `${h.name} (Copy)`, settings: { ...h.settings } };
    setHackathons((prev) => [copy, ...prev]);
    toast.success("Hackathon duplicated");
  };

  const openEdit = (h) => { setEditTarget({ ...h, settings: { ...h.settings } }); setEditOpen(true); };

  const saveEdit = () => {
    if (!editTarget) return;
    setHackathons((prev) => prev.map((h) => (h.id === editTarget.id ? editTarget : h)));
    setEditOpen(false);
    toast.success("Hackathon updated");
  };

  const createHackathon = () => {
    if (!createData.name) return;
    const newH = { ...createData, id: crypto.randomUUID(), iconKey: "ai", iconBg: "from-blue-500 to-indigo-600", settings: { ...DEFAULT_SETTINGS } };
    setHackathons((prev) => [newH, ...prev]);
    setCreateOpen(false);
    setCreateData({ ...emptyHackathon });
    toast.success("Hackathon created");
  };

  const handleUpdateSettings = (newSettings) => {
    setHackathons((prev) =>
      prev.map((h) => h.id === selectedId ? { ...h, settings: newSettings } : h)
    );
  };

  const btnBlue  = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl px-4 py-2 text-sm transition-all";
  const btnGhost = "bg-white/40 border border-white/50 text-[#0b1b52] rounded-xl px-4 py-2 text-sm hover:bg-white/60 transition-all";

  const statusOptions = [
    { value: "all",       label: "All Status" },
    { value: "Upcoming",  label: "Upcoming" },
    { value: "Ongoing",   label: "Ongoing" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <>
      <GlobalStyle />
      <ToastContainer toasts={toast.toasts} />
      <div
        className="min-h-screen bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff] overflow-x-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6 min-w-0">
          <motion.nav
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-6 sm:mb-8 gap-2 flex-wrap min-w-0"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0b1b52] truncate">Hackathon Management</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/hackathons/create')}
                className={`${btnBlue} flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm whitespace-nowrap`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create New</span>
                <span className="sm:hidden">Create</span>
              </motion.button>
            </div>
          </motion.nav>

          <motion.div
            initial="hidden" animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4 }}
                  className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all min-w-0"
                >
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${s.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">{s.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-[#0b1b52] mt-0.5 sm:mt-1">{s.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 sm:mt-4 text-[10px] sm:text-xs min-w-0">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-emerald-600 font-semibold truncate">{s.change}</span>
                    <span className="text-slate-400 hidden sm:inline truncate">from last month</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-7 bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 min-w-0 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-0 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-[#0b1b52] truncate">All Hackathons</h2>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-[220px] md:w-[260px] min-w-0">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full rounded-xl border border-white/60 bg-white/60 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none ring-blue-200 backdrop-blur-xl transition focus:bg-white/90 focus:ring-2 min-w-0"
                    />
                  </div>
                  <CustomDropdown
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    options={statusOptions}
                    className="w-[130px] sm:w-[150px] flex-shrink-0"
                  />
                </div>
              </div>

              <div className="w-full overflow-x-auto hide-scroll min-w-0">
                <table className="w-full text-sm min-w-[520px] table-fixed">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs font-semibold border-b border-white/60">
                      <th className="py-3 pr-4 w-[30%]">Hackathon Name</th>
                      <th className="py-3 px-2 w-[15%]">Status</th>
                      <th className="py-3 px-2 hidden md:table-cell w-[20%]">Registration</th>
                      <th className="py-3 px-2 hidden md:table-cell w-[20%]">Event Dates</th>
                      <th className="py-3 px-2 w-[15%]">Prize Pool</th>
                      <th className="py-3 pl-2 w-[10%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((h, i) => {
                        const Icon = iconMap[h.iconKey];
                        return (
                          <motion.tr
                            key={h.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => { setSelectedId(h.id); setActiveTab("Overview"); }}
                            className={`border-b border-white/40 cursor-pointer transition-colors hover:bg-white/40 ${selectedId === h.id ? "bg-white/50" : ""}`}
                          >
                            <td className="py-3 sm:py-4 pr-4 min-w-0">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${h.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
                                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#0b1b52] text-xs sm:text-sm truncate">{h.name}</p>
                                  <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">{h.subtitle}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-2">
                              <span className={`inline-flex px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium backdrop-blur-sm whitespace-nowrap ${statusBadge[h.status]}`}>
                                {h.status}
                              </span>
                            </td>
                            <td className="py-3 sm:py-4 px-2 text-slate-600 hidden md:table-cell">
                              <div className="text-xs sm:text-sm truncate">{h.regFrom}</div>
                              <div className="text-[10px] sm:text-xs text-slate-400 truncate">to {h.regTo}</div>
                            </td>
                            <td className="py-3 sm:py-4 px-2 text-slate-600 hidden md:table-cell">
                              <div className="text-xs sm:text-sm truncate">{h.eventFrom}</div>
                              <div className="text-[10px] sm:text-xs text-slate-400 truncate">to {h.eventTo}</div>
                            </td>
                            <td className="py-3 sm:py-4 px-2 font-semibold text-[#0b1b52] text-xs sm:text-sm whitespace-nowrap">
                              {formatINR(h.prize)}
                            </td>
                            <td className="py-3 sm:py-4 pl-2">
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <ActionBtn color="from-blue-400 to-indigo-500" onClick={(e) => { e.stopPropagation(); openEdit(h); }}>
                                  <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </ActionBtn>
                                <ActionBtn color="from-emerald-400 to-teal-500" onClick={(e) => { e.stopPropagation(); handleDuplicate(h); }}>
                                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </ActionBtn>
                                <ActionBtn color="from-rose-400 to-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(h.id); }}>
                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </ActionBtn>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-10 sm:py-12 text-slate-400 text-sm">No hackathons found.</div>
                )}
              </div>

              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mt-4 sm:mt-6 min-w-0">
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                  Showing 1–{filtered.length} of {hackathons.length}
                </p>
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  <PageBtn onClick={() => setPage(Math.max(1, page - 1))}>
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </PageBtn>
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        page === n
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                          : "bg-white/40 border border-white/50 text-[#0b1b52] hover:scale-105"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-slate-400 px-1 text-xs">...</span>
                  <button
                    onClick={() => setPage(6)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      page === 6
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white/40 border border-white/50 text-[#0b1b52] hover:scale-105"
                    }`}
                  >
                    6
                  </button>
                  <PageBtn onClick={() => setPage(page + 1)}>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </PageBtn>
                </div>
              </div>
            </motion.section>

            <motion.aside
              key={selected?.id}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-3 bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6 h-fit lg:sticky lg:top-6 min-w-0 w-full"
            >
              <DetailPanel
                selected={selected}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                openEdit={openEdit}
                onUpdateSettings={handleUpdateSettings}
              />
            </motion.aside>
          </div>
        </div>

        <AnimatePresence>
          {createOpen && (
            <Modal
              open={createOpen}
              onClose={() => setCreateOpen(false)}
              title="Create New Hackathon"
              footer={
                <button onClick={createHackathon} disabled={!createData.name} className={`${btnBlue} disabled:opacity-50`}>
                  Create Hackathon
                </button>
              }
            >
              <FormFields value={createData} onChange={setCreateData} />
            </Modal>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editOpen && editTarget && (
            <Modal
              open={editOpen}
              onClose={() => setEditOpen(false)}
              title="Edit Hackathon"
              footer={
                <>
                  <button onClick={() => setEditOpen(false)} className={btnGhost}>Cancel</button>
                  <button onClick={saveEdit} className={btnBlue}>Save Changes</button>
                </>
              }
            >
              <FormFields value={editTarget} onChange={setEditTarget} />
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}