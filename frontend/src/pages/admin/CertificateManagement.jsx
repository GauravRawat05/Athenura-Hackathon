import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, User, ShieldCheck, FileText, Medal, Download,
  Eye, Pencil, Trash2, UploadCloud, Plus, Palette, Sparkles, Layers,
  Settings, Info, X, Check, AlertTriangle, QrCode, Award, Calendar,
  Filter, ChevronDown, Clock, CheckCircle2, XCircle,
} from "lucide-react";

const styleTag = document.createElement("style");
styleTag.textContent =
  ".scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none} html,body,#root{overflow-x:hidden;width:100%;max-width:100%} *{box-sizing:border-box} img,svg,video,canvas{max-width:100%}";
document.head.appendChild(styleTag);

const INITIAL_TEMPLATES = [
  { id: 1, name: "Participation Certificate", desc: "Certificate for all participants", type: "Participation", usage: 1756, date: "May 18, 2026", time: "10:30 AM", color: "from-blue-200 to-blue-400" },
  { id: 2, name: "Rank Certificate", desc: "Certificate for winners with rank", type: "Rank", usage: 702, date: "May 17, 2026", time: "02:15 PM", color: "from-purple-200 to-purple-400" },
  { id: 3, name: "Runner-up Certificate", desc: "Certificate for runner-up teams", type: "Special", usage: 128, date: "May 15, 2026", time: "11:45 AM", color: "from-emerald-200 to-emerald-400" },
  { id: 4, name: "Special Award Certificate", desc: "Certificate for special awards", type: "Special", usage: 96, date: "May 14, 2026", time: "05:20 PM", color: "from-amber-200 to-yellow-400" },
];

const INITIAL_ISSUED = [
  { id: 1, recipient: "Aarav Sharma",   email: "aarav@example.com",   template: "Participation Certificate", hackathon: "HackSphere 2026",    issuedOn: "May 20, 2026", status: "Downloaded", certId: "CERT-001", avatar: "https://i.pravatar.cc/120?img=12" },
  { id: 2, recipient: "Priya Mehta",    email: "priya@example.com",   template: "Rank Certificate",          hackathon: "AI Revolution 2026", issuedOn: "May 19, 2026", status: "Sent",       certId: "CERT-002", avatar: "https://i.pravatar.cc/120?img=47" },
  { id: 3, recipient: "Rohan Das",      email: "rohan@example.com",   template: "Runner-up Certificate",     hackathon: "TechFest 2026",      issuedOn: "May 18, 2026", status: "Pending",    certId: "CERT-003", avatar: "https://i.pravatar.cc/120?img=15" },
  { id: 4, recipient: "Sneha Iyer",     email: "sneha@example.com",   template: "Participation Certificate", hackathon: "CodeJam 2026",       issuedOn: "May 17, 2026", status: "Downloaded", certId: "CERT-004", avatar: "https://i.pravatar.cc/120?img=45" },
  { id: 5, recipient: "Karan Patel",    email: "karan@example.com",   template: "Special Award Certificate", hackathon: "HackSphere 2026",    issuedOn: "May 16, 2026", status: "Sent",       certId: "CERT-005", avatar: "https://i.pravatar.cc/120?img=33" },
  { id: 6, recipient: "Meera Singh",    email: "meera@example.com",   template: "Rank Certificate",          hackathon: "DataQuest 2026",     issuedOn: "May 15, 2026", status: "Revoked",    certId: "CERT-006", avatar: "https://i.pravatar.cc/120?img=14" },
];

const VERIF_HISTORY = [
  { certId: "CERT-001", recipient: "Aarav Sharma", verifiedOn: "May 22, 2026", status: "Valid", by: "HR Team, Infosys" },
  { certId: "CERT-002", recipient: "Priya Mehta", verifiedOn: "May 21, 2026", status: "Valid", by: "Admissions, IIT-B" },
  { certId: "CERT-006", recipient: "Meera Singh", verifiedOn: "May 20, 2026", status: "Revoked", by: "Placement Cell" },
  { certId: "CERT-999", recipient: "Unknown", verifiedOn: "May 19, 2026", status: "Invalid", by: "Manual check" },
];

const TYPE_BADGE = {
  Participation: "bg-blue-100/80 text-blue-700 ring-1 ring-blue-200",
  Rank: "bg-purple-100/80 text-purple-700 ring-1 ring-purple-200",
  Special: "bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200",
};

const STATUS_BADGE = {
  Downloaded: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Sent: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Revoked: "bg-red-100 text-red-700 ring-1 ring-red-200",
};

const VERIF_BADGE = {
  Valid: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Invalid: "bg-red-100 text-red-700 ring-1 ring-red-200",
  Revoked: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

const TABS = ["Certificate Templates", "Issued Certificates", "Certificate Verification"];

function Toast({ message, type, onClose }) {
  const colors = { success: "bg-emerald-500", error: "bg-rose-500", info: "bg-blue-500", warning: "bg-amber-500" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-medium shadow-2xl ${colors[type]}`}
    >
      {type === "success" && <Check className="w-4 h-4" />}
      {type === "error" && <X className="w-4 h-4" />}
      {type === "warning" && <AlertTriangle className="w-4 h-4" />}
      {type === "info" && <Bell className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-3xl shadow-2xl p-6 w-full mx-2 sm:mx-4 border border-white/60 max-h-[90vh] overflow-y-auto ${wide ? "max-w-lg" : "max-w-md"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0b1b52]">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-xl hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#0b1b52]">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function inputCls(extra = "") {
  return `w-full rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm text-[#0b1b52] outline-none focus:border-blue-400 transition placeholder:text-slate-400 ${extra}`;
}
function CustomDropdown({ value, onChange, options, placeholder = "Select...", error = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useState(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  });

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : null;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border shadow-sm hover:shadow-md transition text-left ${error ? "border-red-400" : "border-slate-200"}`}
      >
        <span className={`text-sm ${label ? "text-[#0b1b52]" : "text-slate-400"}`}>
          {label ?? placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+6px)] left-0 z-50 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {options.map(o => {
              const val = o.value ?? o;
              const lbl = o.label ?? o;
              const isSelected = val === value;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => { onChange(val); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-blue-50 transition ${isSelected ? "text-blue-600 font-semibold bg-blue-50/50" : "text-slate-700"}`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 shrink-0" />}
                  {lbl}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CertificatesDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [issued, setIssued] = useState(INITIAL_ISSUED);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [verifInput, setVerifInput] = useState("");
  const [verifResult, setVerifResult] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: "", type: "", desc: "", file: null });
  const [formError, setFormError] = useState({});
  const [editForm, setEditForm] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const totalIssued = templates.reduce((a, t) => a + t.usage, 0);
  const participation = templates.filter(t => t.type === "Participation").reduce((a, t) => a + t.usage, 0);
  const rank = templates.filter(t => t.type === "Rank").reduce((a, t) => a + t.usage, 0);
  const downloads = 1032;

  const stats = [
    { label: "Total Certificates Issued", value: totalIssued.toLocaleString(), growth: "18.6%", icon: ShieldCheck, gradient: "from-blue-400 to-blue-600", bg: "bg-blue-100/70" },
    { label: "Participation Certificates", value: participation.toLocaleString(), growth: "14.3%", icon: FileText, gradient: "from-emerald-400 to-emerald-600", bg: "bg-emerald-100/70" },
    { label: "Rank Certificates", value: rank.toLocaleString(), growth: "22.1%", icon: Medal, gradient: "from-violet-400 to-purple-600", bg: "bg-violet-100/70" },
    { label: "Downloads (This Month)", value: downloads.toLocaleString(), growth: "16.8%", icon: Download, gradient: "from-sky-400 to-indigo-600", bg: "bg-sky-100/70" },
  ];

  const quickActions = [
    { title: "Design Templates", desc: "Create with editor", icon: Palette, color: "text-blue-600 bg-blue-100", action: "design" },
    { title: "Preview Template", desc: "See how it looks", icon: Eye, color: "text-sky-600 bg-sky-100", action: "preview" },
    { title: "Bulk Generate", desc: "Generate many certificates", icon: Layers, color: "text-violet-600 bg-violet-100", action: "bulkGen" },
    { title: "Certificate Settings", desc: "Configure preferences", icon: Settings, color: "text-amber-600 bg-amber-100", action: "settings" },
  ];

  const filteredTemplates = templates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const filteredIssued = issued.filter(i =>
    i.recipient.toLowerCase().includes(search.toLowerCase()) ||
    i.certId.toLowerCase().includes(search.toLowerCase())
  );

  function validateForm(f) {
    const e = {};
    if (!f.name.trim()) e.name = "Required";
    if (!f.type) e.type = "Required";
    return e;
  }

  function handleCreateTemplate() {
    const e = validateForm(form);
    setFormError(e);
    if (Object.keys(e).length) return;
    const newT = {
      id: Date.now(),
      name: form.name,
      desc: form.desc || `Certificate for ${form.type.toLowerCase()}`,
      type: form.type,
      usage: 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      color: form.type === "Participation" ? "from-blue-200 to-blue-400" : form.type === "Rank" ? "from-purple-200 to-purple-400" : "from-emerald-200 to-emerald-400",
    };
    setTemplates(prev => [newT, ...prev]);
    setForm({ name: "", type: "", desc: "", file: null });
    setModal(null);
    showToast("Template created successfully!");
  }

  function handleEditSave() {
    const e = validateForm(editForm);
    if (Object.keys(e).length) { showToast("Please fill required fields", "error"); return; }
    setTemplates(prev => prev.map(t => t.id === editForm.id ? { ...t, ...editForm } : t));
    setModal(null);
    showToast("Template updated!");
  }

  function handleDeleteTemplate(id) {
    setTemplates(prev => prev.filter(t => t.id !== id));
    setModal(null);
    showToast("Template deleted", "warning");
  }

  function handleDeleteIssued(id) {
    setIssued(prev => prev.filter(i => i.id !== id));
    setModal(null);
    showToast("Certificate revoked", "warning");
  }

  function handleVerify() {
    if (!verifInput.trim()) { showToast("Enter a Certificate ID", "error"); return; }
    const found = issued.find(i => i.certId.toLowerCase() === verifInput.trim().toLowerCase());
    if (!found) { setVerifResult({ status: "Invalid", certId: verifInput.trim() }); return; }
    setVerifResult({ ...found, status: found.status === "Revoked" ? "Revoked" : "Valid" });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff] font-sans text-[#0b1b52] scrollbar-hide overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1850px] px-4 sm:px-6 lg:px-10 pb-6 pt-0">

        <motion.nav
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="border-b border-white/40 -mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 pt-4 pb-4 flex flex-wrap items-center gap-4 gap-y-3"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="min-w-0">
              <p className="text-2xl font-bold text-[#0b1b52]">Certificates</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="w-[90px] sm:w-[110px] md:w-[140px] shrink-0">
            <CustomDropdown
              value={typeFilter}
              onChange={v => setTypeFilter(v)}
              options={["All", "Participation", "Rank", "Special"]}
            />
          </div>
          <button type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80 shadow-md transition hover:ring-blue-300 shrink-0" aria-label="Account">
            <img src="https://i.pravatar.cc/80" alt="Account" className="h-full w-full object-cover rounded-full" />
          </button>
        </motion.nav>

        <motion.section
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {stats.map(s => (
            <motion.div
              key={s.label}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(37,99,235,0.15)" }}
              className="rounded-[28px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(13,38,103,0.05)] p-6 transition"
            >
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 rounded-2xl ${s.bg} grid place-items-center shrink-0`}>
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.gradient} grid place-items-center shadow-md`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-[#0b1b52]">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">↑ {s.growth} <span className="text-slate-400 font-normal">from last month</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[72%_28%] gap-6">
          <div className="space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(13,38,103,0.05)] px-6 pt-4"
            >
              <div className="flex gap-8 border-b border-slate-100 overflow-x-auto scrollbar-hide whitespace-nowrap">
                {TABS.map((t, i) => (
                  <button
                    key={t} onClick={() => setActiveTab(i)}
                    className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition ${activeTab === i ? "text-[#0b1b52]" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {t}
                    {activeTab === i && <motion.span layoutId="tab-underline" className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>

              {activeTab === 0 && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[#0b1b52]">Certificate Templates</h3>
                      <p className="text-sm text-slate-500 break-words">Manage certificate templates for different types.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setForm({ name: "", type: "", desc: "", file: null }); setFormError({}); setModal({ type: "create" }); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition shrink-0"
                    >
                      <Plus className="h-4 w-4" /> Create New Template
                    </motion.button>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide pb-6 w-full">
                    <table className="w-full min-w-[700px] text-left">
                      <thead>
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                          <th className="px-4 py-3 rounded-l-xl">Template Name</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Usage</th>
                          <th className="px-4 py-3">Last Updated</th>
                          <th className="px-4 py-3 rounded-r-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTemplates.map((t, i) => (
                          <motion.tr
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="h-12 w-16 rounded-lg ring-1 ring-white shadow-sm shrink-0 overflow-hidden">
                                  <img
                                    src={`/src/assets/${t.id === 1 ? "certificate1" :
                                        t.id === 2 ? "certificate2" :
                                          t.id === 3 ? "certificate3" :
                                            "certificate4"
                                      }.png`}
                                    alt={t.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#0b1b52] text-sm truncate">{t.name}</p>
                                  <p className="text-xs text-slate-500 truncate">{t.desc}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${TYPE_BADGE[t.type]}`}>{t.type}</span>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-[#0b1b52]">{t.usage.toLocaleString()} issued</td>
                            <td className="px-4 py-4 text-sm">
                              <p className="text-[#0b1b52] font-medium">{t.date}</p>
                              <p className="text-xs text-slate-400">{t.time}</p>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                {[
                                  { Icon: Eye, color: "text-blue-600 bg-blue-50 hover:bg-blue-100", onClick: () => setModal({ type: "view", data: t }) },
                                  { Icon: Pencil, color: "text-amber-600 bg-amber-50 hover:bg-amber-100", onClick: () => { setEditForm({ ...t }); setModal({ type: "edit" }); } },
                                  { Icon: Trash2, color: "text-red-600 bg-red-50 hover:bg-red-100", onClick: () => setModal({ type: "delete", data: t }) },
                                ].map(({ Icon, color, onClick }, k) => (
                                  <motion.button
                                    key={k} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={onClick}
                                    className={`grid place-items-center h-9 w-9 rounded-lg ring-1 ring-white/80 transition ${color}`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </motion.button>
                                ))}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                        {filteredTemplates.length === 0 && (
                          <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No templates found.</td></tr>
                        )}
                      </tbody>
                    </table>
                    <p className="mt-4 text-xs text-slate-500">Showing 1 to {filteredTemplates.length} of {filteredTemplates.length} templates</p>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[#0b1b52]">Issued Certificates</h3>
                      <p className="text-sm text-slate-500 break-words">View and manage all issued certificates.</p>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">{filteredIssued.length} records</span>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide pb-6 w-full">
                    <table className="w-full min-w-[760px] text-left">
                      <thead>
                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                          <th className="px-4 py-3 rounded-l-xl">Recipient</th>
                          <th className="px-4 py-3">Template</th>
                          <th className="px-4 py-3">Hackathon</th>
                          <th className="px-4 py-3">Issued On</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 rounded-r-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIssued.map((cert, i) => (
                          <motion.tr
                            key={cert.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-full shrink-0 overflow-hidden ring-2 ring-white shadow">
                                  <img src={cert.avatar} alt={cert.recipient} className="h-full w-full object-cover rounded-full" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-[#0b1b52] truncate">{cert.recipient}</p>
                                  <p className="text-xs text-slate-400 truncate">{cert.certId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600 truncate">{cert.template}</td>
                            <td className="px-4 py-4 text-sm text-slate-600 truncate">{cert.hackathon}</td>
                            <td className="px-4 py-4 text-sm text-[#0b1b52] font-medium">{cert.issuedOn}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[cert.status]}`}>{cert.status}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                  onClick={() => setModal({ type: "viewIssued", data: cert })}
                                  className="grid place-items-center h-9 w-9 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 ring-1 ring-white/80 transition"
                                >
                                  <Eye className="h-4 w-4" />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                  onClick={() => { showToast(`Certificate sent to ${cert.email}`, "info"); }}
                                  className="grid place-items-center h-9 w-9 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-white/80 transition"
                                >
                                  <Download className="h-4 w-4" />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                  onClick={() => setModal({ type: "deleteIssued", data: cert })}
                                  className="grid place-items-center h-9 w-9 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 ring-1 ring-white/80 transition"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                        {filteredIssued.length === 0 && (
                          <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">No certificates found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="py-6 pb-8">
                  <h3 className="text-lg font-bold text-[#0b1b52]">Certificate Verification</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Verify the authenticity of any issued certificate by its ID.</p>

                  <div className="flex gap-3 max-w-xl">
                    <div className="relative flex-1 min-w-0">
                      <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        value={verifInput}
                        onChange={e => { setVerifInput(e.target.value); setVerifResult(null); }}
                        placeholder="Enter Certificate ID (e.g. CERT-001)"
                        className="w-full rounded-xl bg-white border border-slate-200 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-300 transition"
                        onKeyDown={e => e.key === "Enter" && handleVerify()}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleVerify}
                      className="px-5 py-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition shrink-0"
                    >
                      Verify
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {verifResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`mt-6 rounded-2xl p-5 border max-w-xl ${verifResult.status === "Valid" ? "bg-emerald-50 border-emerald-200" :
                            verifResult.status === "Revoked" ? "bg-amber-50 border-amber-200" :
                              "bg-red-50 border-red-200"
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {verifResult.status === "Valid" && <CheckCircle2 className="h-6 w-6 text-emerald-600" />}
                          {verifResult.status === "Revoked" && <AlertTriangle className="h-6 w-6 text-amber-600" />}
                          {verifResult.status === "Invalid" && <XCircle className="h-6 w-6 text-red-600" />}
                          <span className={`text-base font-bold ${verifResult.status === "Valid" ? "text-emerald-700" :
                              verifResult.status === "Revoked" ? "text-amber-700" : "text-red-700"
                            }`}>
                            Certificate {verifResult.status}
                          </span>
                        </div>
                        {verifResult.status !== "Invalid" && (
                          <div className="space-y-2 text-sm">
                            {[
                              ["Certificate ID", verifResult.certId],
                              ["Recipient", verifResult.recipient],
                              ["Template", verifResult.template],
                              ["Hackathon", verifResult.hackathon],
                              ["Issued On", verifResult.issuedOn],
                              ["Status", verifResult.status],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span className="text-slate-500">{k}</span>
                                <span className="font-medium text-[#0b1b52]">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {verifResult.status === "Invalid" && (
                          <p className="text-sm text-red-600">No certificate found with ID <strong>{verifResult.certId}</strong>. It may be fake or never issued.</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="mt-8">
                    <h4 className="text-sm font-bold text-[#0b1b52] mb-3">Recent Verifications</h4>
                    <div className="space-y-2">
                      {VERIF_HISTORY.map((v, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center shrink-0">
                              <Award className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0b1b52] truncate">{v.certId}</p>
                              <p className="text-xs text-slate-400 truncate">{v.recipient} · {v.by}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{v.verifiedOn}</span>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${VERIF_BADGE[v.status]}`}>{v.status}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-[28px] bg-gradient-to-br from-blue-50/90 to-indigo-50/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(13,38,103,0.05)] p-6"
            >
            </motion.div>
          </div>

          <div className="space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(13,38,103,0.05)] p-6"
            >
              <h3 className="text-lg font-bold text-[#0b1b52]">Quick Actions</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map(a => (
                  <motion.button
                    key={a.title} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setModal({ type: a.action })}
                    className="text-left rounded-xl bg-white/80 border border-white/70 p-3 hover:shadow-md transition"
                  >
                    <div className={`h-9 w-9 rounded-lg grid place-items-center ${a.color}`}>
                      <a.icon className="h-4 w-4" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#0b1b52] break-words">{a.title}</p>
                    <p className="text-xs text-slate-500 break-words">{a.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_rgba(13,38,103,0.05)] p-6"
            >
              <h3 className="text-lg font-bold text-[#0b1b52] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {issued.slice(0, 4).map((cert, i) => (
                  <div key={cert.id} className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full shrink-0 overflow-hidden ring-2 ring-white shadow">
                      <img src={cert.avatar} alt={cert.recipient} className="h-full w-full object-cover rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0b1b52] truncate">{cert.recipient}</p>
                      <p className="text-xs text-slate-400 truncate">{cert.template}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[cert.status]}`}>{cert.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal?.type === "create" && (
          <Modal title="Create New Template" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Template Name" required>
                <input
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Enter template name"
                  className={inputCls(formError.name ? "border-red-400 focus:ring-red-300" : "")}
                />
                {formError.name && <p className="text-xs text-red-500 mt-1">{formError.name}</p>}
              </Field>
              <Field label="Certificate Type" required>
                <CustomDropdown
                  value={form.type}
                  onChange={v => setForm(f => ({ ...f, type: v }))}
                  options={["Participation", "Rank", "Special"]}
                  placeholder="Select type"
                  error={!!formError.type}
                />
                {formError.type && <p className="text-xs text-red-500 mt-1">{formError.type}</p>}
              </Field>
              <Field label="Description (Optional)">
                <input
                  value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Enter description"
                  className={inputCls()}
                />
              </Field>
              <div>
                <label className="text-xs font-semibold text-[#0b1b52]">Upload Template (HTML/PDF)</label>
                <input ref={fileRef} type="file" accept=".html,.pdf" className="hidden"
                  onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
                />
                <motion.div whileHover={{ scale: 1.01 }}
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 transition py-8 px-4 text-center cursor-pointer"
                >
                  <UploadCloud className="h-8 w-8 mx-auto text-blue-400" />
                  <p className="mt-2 text-sm font-medium text-[#0b1b52]">
                    {form.file ? form.file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-400">HTML, PDF up to 5MB</p>
                </motion.div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(null)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCreateTemplate}
                  className="flex-1 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition">
                  Create Template
                </motion.button>
              </div>
            </div>
          </Modal>
        )}
        {modal?.type === "edit" && editForm && (
          <Modal title="Edit Template" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Template Name" required>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={inputCls()} />
              </Field>
              <Field label="Certificate Type" required>
                <CustomDropdown
                  value={editForm.type}
                  onChange={v => setEditForm(f => ({ ...f, type: v }))}
                  options={["Participation", "Rank", "Special"]}
                />
              </Field>
              <Field label="Description">
                <input value={editForm.desc} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} className={inputCls()} />
              </Field>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(null)} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleEditSave}
                  className="flex-1 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition">
                  Save Changes
                </motion.button>
              </div>
            </div>
          </Modal>
        )}
        {modal?.type === "view" && modal.data && (
          <Modal title="Template Details" onClose={() => setModal(null)}>
            <div className="h-32 rounded-2xl overflow-hidden mb-5 ring-1 ring-slate-200 shadow">
              <img
                src={`/src/assets/${modal.data.id === 1 ? "certificate1" :
                    modal.data.id === 2 ? "certificate2" :
                      modal.data.id === 3 ? "certificate3" :
                        "certificate4"
                  }.png`}
                alt={modal.data.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-3 text-sm">
              {[["Name", modal.data.name], ["Type", modal.data.type], ["Description", modal.data.desc],
              ["Usage", `${modal.data.usage.toLocaleString()} issued`], ["Last Updated", `${modal.data.date} at ${modal.data.time}`]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-semibold text-[#0b1b52]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Close</button>
              <button onClick={() => { setEditForm({ ...modal.data }); setModal({ type: "edit" }); }}
                className="flex-1 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition">
                Edit
              </button>
            </div>
          </Modal>
        )}
        {modal?.type === "delete" && modal.data && (
          <Modal title="Delete Template" onClose={() => setModal(null)}>
            <div className="text-center py-2">
              <div className="h-14 w-14 rounded-2xl bg-red-100 grid place-items-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Are you sure you want to delete</p>
              <p className="font-bold text-[#0b1b52] break-words">"{modal.data.name}"</p>
              <p className="text-xs text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDeleteTemplate(modal.data.id)}
                className="flex-1 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 py-2.5 text-sm font-semibold text-white shadow transition">
                Delete
              </button>
            </div>
          </Modal>
        )}

        {modal?.type === "viewIssued" && modal.data && (
          <Modal title="Certificate Details" onClose={() => setModal(null)}>
            <div className="space-y-3 text-sm">
              {[["Certificate ID", modal.data.certId], ["Recipient", modal.data.recipient], ["Email", modal.data.email],
              ["Template", modal.data.template], ["Hackathon", modal.data.hackathon],
              ["Issued On", modal.data.issuedOn], ["Status", modal.data.status]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  {k === "Status"
                    ? <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[v]}`}>{v}</span>
                    : <span className="font-semibold text-[#0b1b52]">{v}</span>
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Close</button>
              <button onClick={() => { showToast(`Downloading ${modal.data.certId}...`, "info"); setModal(null); }}
                className="flex-1 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition flex items-center justify-center gap-2">
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </Modal>
        )}

        {modal?.type === "deleteIssued" && modal.data && (
          <Modal title="Revoke Certificate" onClose={() => setModal(null)}>
            <div className="text-center py-2">
              <div className="h-14 w-14 rounded-2xl bg-red-100 grid place-items-center mx-auto mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-sm text-slate-600 mb-1">Revoke certificate for</p>
              <p className="font-bold text-[#0b1b52] break-words">{modal.data.recipient}</p>
              <p className="text-xs text-slate-400 mt-1">{modal.data.certId} · This cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDeleteIssued(modal.data.id)}
                className="flex-1 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 py-2.5 text-sm font-semibold text-white shadow transition">
                Revoke
              </button>
            </div>
          </Modal>
        )}
        {modal?.type === "bulkGen" && (
          <Modal title="Bulk Generate Certificates" onClose={() => setModal(null)} wide>
            <div className="space-y-4">
              <Field label="Select Template" required>
                <CustomDropdown
                  value=""
                  onChange={() => { }}
                  options={templates.map(t => ({ value: t.name, label: t.name }))}
                  placeholder="Select template"
                />
              </Field>
              <Field label="Select Hackathon" required>
                <CustomDropdown
                  value=""
                  onChange={() => { }}
                  options={["HackSphere 2026", "AI Revolution 2026", "TechFest 2026", "CodeJam 2026", "DataQuest 2026"]}
                  placeholder="Select hackathon"
                />
              </Field>
              <Field label="Upload Participant List (CSV)">
                <motion.div whileHover={{ scale: 1.01 }}
                  className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 transition py-6 px-4 text-center cursor-pointer"
                >
                  <UploadCloud className="h-7 w-7 mx-auto text-blue-400" />
                  <p className="mt-2 text-sm font-medium text-[#0b1b52]">Click to upload CSV</p>
                  <p className="text-xs text-slate-400">CSV with name, email columns</p>
                </motion.div>
              </Field>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(null)} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { setModal(null); showToast("Bulk generation started!", "success"); }}
                  className="flex-1 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition">
                  Generate All
                </motion.button>
              </div>
            </div>
          </Modal>
        )}
        {modal?.type === "design" && (
          <Modal title="Design Templates" onClose={() => setModal(null)}>
            <p className="text-sm text-slate-500 mb-4">Choose a design approach for your certificate.</p>
            <div className="space-y-3">
              {[
                { label: "HTML Editor", desc: "Write custom HTML/CSS template", icon: FileText, color: "bg-blue-50 text-blue-600" },
                { label: "Visual Builder", desc: "Drag & drop elements", icon: Layers, color: "bg-violet-50 text-violet-600" },
                { label: "Upload PDF", desc: "Upload a ready-made PDF", icon: UploadCloud, color: "bg-emerald-50 text-emerald-600" },
              ].map(o => (
                <button key={o.label} onClick={() => { setModal(null); showToast(`Opening ${o.label}...`, "info"); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition text-left">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${o.color}`}><o.icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#0b1b52]">{o.label}</p>
                    <p className="text-xs text-slate-400 truncate">{o.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Modal>
        )}
        {modal?.type === "preview" && (
          <Modal title="Preview Template" onClose={() => setModal(null)} wide>
            <p className="text-sm text-slate-500 mb-4">Select a template to preview.</p>
            <div className="space-y-2 mb-4">
              {templates.map(t => (
                <button key={t.id}
                  onClick={() => { setModal({ type: "view", data: t }); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition text-left">
                  <div className={`h-10 w-14 rounded-lg bg-gradient-to-br ${t.color} grid place-items-center shrink-0`}>
                    <div className="h-5 w-8 rounded-sm bg-white/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#0b1b52]">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.usage.toLocaleString()} issued</p>
                  </div>
                  <span className={`ml-auto text-xs px-2.5 py-1 rounded-full shrink-0 ${TYPE_BADGE[t.type]}`}>{t.type}</span>
                </button>
              ))}
            </div>
          </Modal>
        )}
        {modal?.type === "settings" && (
          <Modal title="Certificate Settings" onClose={() => setModal(null)}>
            <div className="space-y-4">
              {[
                { label: "Auto-send on Issue", desc: "Automatically email certificates on generation" },
                { label: "Enable Verification Page", desc: "Allow public certificate verification" },
                { label: "Watermark Certificates", desc: "Add HackSphere watermark to all certificates" },
                { label: "Allow Re-downloads", desc: "Participants can re-download anytime" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="min-w-0 mr-2">
                    <p className="text-sm font-semibold text-[#0b1b52]">{s.label}</p>
                    <p className="text-xs text-slate-400 break-words">{s.desc}</p>
                  </div>
                  <ToggleSwitch defaultOn={i % 2 === 0} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={() => { setModal(null); showToast("Settings saved!"); }}
                  className="flex-1 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition">
                  Save Settings
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>
    </div>
  );
}

function ToggleSwitch({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}