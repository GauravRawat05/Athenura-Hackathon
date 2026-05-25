import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Send, Eye, Mail, ArrowUp, ArrowDown,
  Filter, FileDown, UserPlus, CreditCard, AlertTriangle,
  Trophy, Calendar, ChevronLeft, ChevronRight, Settings, FileText, X,
  Download, Plus, Trash2, CheckCircle, Clock, ChevronDown, Menu
} from "lucide-react";

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
    min-width: 0; /* prevent flex/grid children from overflowing */ 
  }
  
  html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  
  body { 
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  
  img, svg, canvas, video {
    max-width: 100%;
  }

  .glass {
    background: rgba(255,255,255,0.65);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.75);
  }
  .glass-soft {
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.60);
  }
  .shadow-glass { 
    box-shadow: 0 8px 32px rgba(30,64,175,0.08), 0 2px 8px rgba(30,64,175,0.04); 
  }

  .date-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.8rem;
    color: #475569;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    position: absolute;
    inset: 0;
    opacity: 0;
  }
  .date-input::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  ::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; }

  @media print {
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
  }
  
  /* Responsive helpers */
  .table-wrapper {
    width: 100%;
    overflow-x: auto;
  }
  
  .table-wrapper table {
    min-width: 100%;
  }
  
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }
    .table-wrapper table {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .filter-row {
      flex-wrap: wrap;
    }
    .filter-row > * {
      flex: 1 1 100% !important;
    }
  }
`;

const stats = [
  { label: "Total Notifications", value: "1,248", delta: "18.6%", up: true, icon: Bell, iconBg: "from-blue-400/30 to-blue-600/20", iconColor: "text-blue-600" },
  { label: "Sent (This Month)", value: "842", delta: "12.4%", up: true, icon: Send, iconBg: "from-emerald-400/30 to-emerald-600/20", iconColor: "text-emerald-600" },
  { label: "Read", value: "1,032", delta: "16.8%", up: true, icon: Eye, iconBg: "from-amber-400/30 to-orange-500/20", iconColor: "text-amber-600" },
  { label: "Unread", value: "216", delta: "5.3%", up: false, icon: Mail, iconBg: "from-violet-400/30 to-purple-600/20", iconColor: "text-violet-600" },
];

const tabs = ["All Notifications", "Registration", "Payment", "Result", "System"];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Registration Confirmed", message: "Your registration for AI Revolution 2026 has been confirmed.", type: "Registration", recipient: "rahul.singh@example.com", date: "2026-05-20", displayDate: "May 20, 2026", time: "10:30 AM", status: "Read", icon: UserPlus, iconColor: "text-blue-600", iconBg: "bg-blue-100/80" },
  { id: 2, title: "Payment Successful", message: "Your payment of ₹999 for Code Infinity was successful.", type: "Payment", recipient: "priya.verma@example.com", date: "2026-05-20", displayDate: "May 20, 2026", time: "09:45 AM", status: "Read", icon: CreditCard, iconColor: "text-emerald-600", iconBg: "bg-emerald-100/80" },
  { id: 3, title: "Payment Failed", message: "Your payment for HackX 5.0 failed. Please try again.", type: "Payment", recipient: "arjun.patel@example.com", date: "2026-05-19", displayDate: "May 19, 2026", time: "08:15 PM", status: "Unread", icon: AlertTriangle, iconColor: "text-amber-600", iconBg: "bg-amber-100/80" },
  { id: 4, title: "Results Announced", message: "Results for DevSprint have been announced. Check now!", type: "Result", recipient: "team.alphacode@example.com", date: "2026-05-19", displayDate: "May 19, 2026", time: "06:00 PM", status: "Read", icon: Trophy, iconColor: "text-violet-600", iconBg: "bg-violet-100/80" },
  { id: 5, title: "Submission Deadline Reminder", message: "Hurry! Project submission deadline for AI Revolution 2026 is near.", type: "System", recipient: "all_participants@broadcast", date: "2026-05-19", displayDate: "May 19, 2026", time: "03:30 PM", status: "Read", icon: Bell, iconColor: "text-sky-600", iconBg: "bg-sky-100/80" },
  { id: 6, title: "Team Invitation", message: "You have been invited to join team Code Warriors.", type: "Registration", recipient: "neha.kapoor@example.com", date: "2026-05-19", displayDate: "May 19, 2026", time: "11:20 AM", status: "Unread", icon: UserPlus, iconColor: "text-emerald-600", iconBg: "bg-emerald-100/80" },
  { id: 7, title: "Congratulations!", message: "You secured 2nd Rank in HackX 5.0. Congratulations!", type: "Result", recipient: "binary.brains@example.com", date: "2026-05-18", displayDate: "May 18, 2026", time: "07:40 PM", status: "Read", icon: Trophy, iconColor: "text-violet-600", iconBg: "bg-violet-100/80" },
  { id: 8, title: "Profile Updated", message: "Your profile details have been updated successfully.", type: "System", recipient: "mohan.rao@example.com", date: "2026-05-18", displayDate: "May 18, 2026", time: "05:10 PM", status: "Read", icon: Bell, iconColor: "text-sky-600", iconBg: "bg-sky-100/80" },
  { id: 9, title: "New Hackathon Launched", message: "HackSphere Edition 6 is now open for registrations!", type: "Registration", recipient: "all_users@broadcast", date: "2026-05-18", displayDate: "May 18, 2026", time: "12:00 PM", status: "Unread", icon: UserPlus, iconColor: "text-blue-600", iconBg: "bg-blue-100/80" },
  { id: 10, title: "Refund Processed", message: "Your refund of ₹499 for HackFest has been processed.", type: "Payment", recipient: "sara.khan@example.com", date: "2026-05-17", displayDate: "May 17, 2026", time: "02:20 PM", status: "Read", icon: CreditCard, iconColor: "text-emerald-600", iconBg: "bg-emerald-100/80" },
  { id: 11, title: "1st Place Winner", message: "Team CodeNinjas secured 1st place in AI Revolution 2026!", type: "Result", recipient: "codeninjas@example.com", date: "2026-05-17", displayDate: "May 17, 2026", time: "09:00 AM", status: "Unread", icon: Trophy, iconColor: "text-violet-600", iconBg: "bg-violet-100/80" },
  { id: 12, title: "System Maintenance", message: "Scheduled maintenance on May 21. Platform will be down 2–4 AM.", type: "System", recipient: "all_users@broadcast", date: "2026-05-16", displayDate: "May 16, 2026", time: "06:00 PM", status: "Read", icon: Bell, iconColor: "text-sky-600", iconBg: "bg-sky-100/80" },
];

const INITIAL_TEMPLATES = [
  { id: 1, name: "Registration Confirmation", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-100/80" },
  { id: 2, name: "Payment Success", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100/80" },
  { id: 3, name: "Payment Failure", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100/80" },
  { id: 4, name: "Result Announcement", icon: Trophy, color: "text-violet-600", bg: "bg-violet-100/80" },
  { id: 5, name: "Deadline Reminder", icon: Bell, color: "text-sky-600", bg: "bg-sky-100/80" },
];

const ITEMS_PER_PAGE = 7;

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

function CustomSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {label && <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "14px", padding: "10px 14px", fontSize: "0.875rem", fontWeight: 500, color: "#334155", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s", boxShadow: open ? "0 0 0 3px rgba(59,130,246,0.15)" : "none", borderColor: open ? "rgba(59,130,246,0.5)" : "rgba(203,213,225,0.5)" }}
      >
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
        <ChevronDown size={15} color="#94a3b8" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 40px rgba(30,64,175,0.12)" }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", padding: "11px 14px", fontSize: "0.875rem", fontWeight: value === opt ? 600 : 500, background: value === opt ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "transparent", color: value === opt ? "white" : "#334155", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background 0.15s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = "rgba(239,246,255,0.9)"; }}
                onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = "transparent"; }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypeBadge({ type }) {
  const styles = {
    Registration: "bg-blue-100/80 text-blue-700 border-blue-200/60",
    Payment: "bg-emerald-100/80 text-emerald-700 border-emerald-200/60",
    Result: "bg-violet-100/80 text-violet-700 border-violet-200/60",
    System: "bg-slate-200/70 text-slate-700 border-slate-300/60",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${styles[type] || styles.System}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status, onClick }) {
  const cls = status === "Read"
    ? "bg-emerald-100/80 text-emerald-700 border-emerald-200/60"
    : "bg-orange-100/80 text-orange-700 border-orange-200/60";
  return (
    <button
      onClick={onClick}
      title="Click to toggle status"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur cursor-pointer transition-opacity hover:opacity-70 ${cls}`}
      style={{ background: "none" }}
    >
      {status === "Read" ? <CheckCircle size={11} /> : <Clock size={11} />}
      {status}
    </button>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(219,234,254,0.8)", border: "1px solid rgba(147,197,253,0.6)", borderRadius: "999px", padding: "3px 10px", fontSize: "0.72rem", fontWeight: 600, color: "#1d4ed8", whiteSpace: "nowrap" }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#60a5fa", display: "flex", alignItems: "center", padding: 0 }}>
        <X size={11} />
      </button>
    </span>
  );
}

export default function NotificationsDashboard() {
  // ── Responsive state ──
  const isMobile = useMediaQuery('(max-width: 1024px)');  // tablet & below
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterHackathon, setFilterHackathon] = useState("All Hackathons");
  const [appliedFilters, setAppliedFilters] = useState({
    type: "All Types",
    status: "All Status",
    hackathon: "All Hackathons",
    dateFrom: "",
    dateTo: ""
  });
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [dateFrom, setDateFrom] = useState("2026-05-01");
  const [dateTo, setDateTo] = useState("2026-05-20");
  const [detailNotif, setDetailNotif] = useState(null);
  const [showViewAll, setShowViewAll] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [notifData, setNotifData] = useState(INITIAL_NOTIFICATIONS);
  const [templatesList, setTemplatesList] = useState(INITIAL_TEMPLATES);
  const [newTplName, setNewTplName] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const hackathons = useMemo(() => {
    const set = new Set(notifData.map(n => {
      const m = n.message.match(/for (.+?) (was|is|has|failed|have)/);
      return m ? m[1] : null;
    }).filter(Boolean));
    return ["All Hackathons", ...set];
  }, [notifData]);

  const tabFiltered = useMemo(() => {
    if (activeTab === 0) return notifData;
    return notifData.filter(n => n.type === tabs[activeTab]);
  }, [activeTab, notifData]);

  const filtered = useMemo(() => {
    return tabFiltered.filter(n => {
      const q = search.toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || n.recipient.toLowerCase().includes(q);
      const matchType = appliedFilters.type === "All Types" || n.type === appliedFilters.type;
      const matchStatus = appliedFilters.status === "All Status" || n.status === appliedFilters.status;
      const matchHackathon = appliedFilters.hackathon === "All Hackathons" || n.message.includes(appliedFilters.hackathon);
      const matchDateFrom = !appliedFilters.dateFrom || n.date >= appliedFilters.dateFrom;
      const matchDateTo = !appliedFilters.dateTo || n.date <= appliedFilters.dateTo;
      return matchSearch && matchType && matchStatus && matchHackathon && matchDateFrom && matchDateTo;
    });
  }, [tabFiltered, search, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  const handleTabChange = (i) => { setActiveTab(i); setActivePage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setActivePage(1); };

  const handleApplyFilters = () => {
    setAppliedFilters({ type: filterType, status: filterStatus, hackathon: filterHackathon, dateFrom, dateTo });
    setActivePage(1);
    setShowFilterBar(false);
    showToast("Filters applied!");
  };

  const handleClearFilters = () => {
    setFilterType("All Types"); setFilterStatus("All Status");
    setFilterHackathon("All Hackathons"); setDateFrom(""); setDateTo("");
    setAppliedFilters({ type: "All Types", status: "All Status", hackathon: "All Hackathons", dateFrom: "", dateTo: "" });
    setActivePage(1);
    showToast("Filters cleared", "info");
  };

  const hasActiveFilters = appliedFilters.type !== "All Types" || appliedFilters.status !== "All Status" || appliedFilters.hackathon !== "All Hackathons" || appliedFilters.dateFrom || appliedFilters.dateTo;

  const toggleStatus = (id) => {
    setNotifData(prev => prev.map(n =>
      n.id === id ? { ...n, status: n.status === "Read" ? "Unread" : "Read" } : n
    ));
    showToast("Status updated", "info");
  };

  const handleExportPDF = () => {
    const rows = filtered.map(n =>
      `<tr style="border-bottom:1px solid #e2e8f0">
        <td style="padding:10px 12px;font-weight:600;color:#0b1b52">${n.title}</td>
        <td style="padding:10px 12px;color:#64748b">${n.type}</td>
        <td style="padding:10px 12px;color:#64748b;font-size:0.8rem">${n.recipient}</td>
        <td style="padding:10px 12px;color:#64748b">${n.displayDate} ${n.time}</td>
        <td style="padding:10px 12px"><span style="padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:600;background:${n.status === "Read" ? "#d1fae5" : "#fed7aa"};color:${n.status === "Read" ? "#065f46" : "#9a3412"}">${n.status}</span></td>
      </tr>`
    ).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Notifications Export</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#0b1b52}h1{font-size:1.5rem;margin-bottom:4px}p{color:#64748b;font-size:0.875rem;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 12px;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;border-bottom:2px solid #e2e8f0}@media print{button{display:none}}</style>
    </head><body>
    <h1>Admin Notifications</h1><p>Exported on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · ${filtered.length} records</p>
    <table><thead><tr><th>Title</th><th>Type</th><th>Recipient</th><th>Sent On</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    <script>window.onload=()=>{window.print();}<\/script></body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
    else showToast("Allow popups to export PDF", "warning");
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ecfcff 0%, #f8ffff 50%, #dff7ff 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0b1b52" }}>
        <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-160px", left: "-160px", height: "500px", width: "500px", borderRadius: "50%", background: "rgba(147,197,253,0.2)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: "33%", right: "-160px", height: "500px", width: "500px", borderRadius: "50%", background: "rgba(196,181,253,0.2)", filter: "blur(80px)" }} />
        </div>

        <div style={{ maxWidth: "1800px", margin: "0 auto", padding: "0 16px" }}>
          <Navbar onSidebarToggle={() => setMobileSidebarOpen(true)} isMobile={isMobile} />
          <div style={{ padding: "24px 0" }}>
            <StatsGrid />

            <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: "24px" }}>
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="glass shadow-glass"
                style={{ overflow: "hidden", borderRadius: "28px", padding: "24px", minWidth: 0 }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", borderBottom: "1px solid rgba(226,232,240,0.7)", overflowX: "auto" }}>
                  {tabs.map((t, i) => (
                    <button key={t} onClick={() => handleTabChange(i)}
                      style={{ position: "relative", padding: "12px 16px", fontSize: "0.875rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer", color: activeTab === i ? "#0b1b52" : "#64748b", transition: "color 0.2s", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>
                      {t}
                      {activeTab === i && (
                        <motion.span layoutId="tab-underline" style={{ position: "absolute", left: "8px", right: "8px", bottom: "-1px", height: "2px", borderRadius: "9999px", background: "#2563eb" }} />
                      )}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: "20px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div className="glass-soft" style={{ flex: "1 1 260px", minWidth: "200px", display: "flex", alignItems: "center", gap: "8px", borderRadius: "16px", padding: "10px 16px" }}>
                    <Search size={16} color="#94a3b8" />
                    <input value={search} onChange={handleSearch} placeholder="Search by title, message or recipient..."
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.875rem", color: "#475569", fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 0 }} />
                    {search && (
                      <button onClick={() => { setSearch(""); setActivePage(1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <motion.button
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowFilterBar(p => !p)}
                      style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "16px", padding: "10px 16px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", border: showFilterBar ? "1.5px solid #2563eb" : "1.5px solid rgba(203,213,225,0.5)", background: showFilterBar ? "rgba(239,246,255,0.9)" : "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)", color: showFilterBar ? "#2563eb" : "#475569", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                      <Filter size={16} /> Filters {hasActiveFilters && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />}
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                      onClick={handleExportPDF}
                      style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "16px", padding: "10px 16px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "1.5px solid rgba(203,213,225,0.5)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)", color: "#475569", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                      <FileDown size={16} /> Export PDF
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {showFilterBar && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ marginTop: "16px", padding: "20px", background: "rgba(239,246,255,0.6)", borderRadius: "18px", border: "1.5px solid rgba(147,197,253,0.3)", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
                        <div style={{ flex: "1 1 160px", minWidth: "140px" }}>
                          <CustomSelect label="Type" value={filterType} onChange={setFilterType}
                            options={["All Types", "Registration", "Payment", "Result", "System"]} />
                        </div>
                        <div style={{ flex: "1 1 140px", minWidth: "130px" }}>
                          <CustomSelect label="Status" value={filterStatus} onChange={setFilterStatus}
                            options={["All Status", "Read", "Unread"]} />
                        </div>
                        <div style={{ flex: "1 1 180px", minWidth: "160px" }}>
                          <CustomSelect label="Hackathon" value={filterHackathon} onChange={setFilterHackathon}
                            options={hackathons} />
                        </div>
                        <div style={{ flex: "1 1 260px", minWidth: "240px" }}>
                          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Custom Range</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "14px", padding: "9px 12px" }}>
                              <Calendar size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: "0.8rem", color: dateFrom ? "#475569" : "#94a3b8", whiteSpace: "nowrap" }}>{dateFrom || "Start date"}</span>
                              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="date-input" />
                            </div>
                            <span style={{ color: "#94a3b8", fontSize: "0.8rem", flexShrink: 0 }}>to</span>
                            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "14px", padding: "9px 12px" }}>
                              <Calendar size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: "0.8rem", color: dateTo ? "#475569" : "#94a3b8", whiteSpace: "nowrap" }}>{dateTo || "End date"}</span>
                              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="date-input" />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
                          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleApplyFilters}
                            style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "14px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", padding: "10px 18px", fontSize: "0.875rem", fontWeight: 600, color: "white", border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(37,99,235,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>
                            <Filter size={15} /> Apply
                          </motion.button>
                          <button onClick={handleClearFilters}
                            style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "14px", border: "1.5px solid rgba(203,213,225,0.6)", background: "rgba(255,255,255,0.5)", padding: "10px 14px", fontSize: "0.8rem", fontWeight: 500, color: "#64748b", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>
                            <X size={13} /> Clear
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasActiveFilters && (
                  <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>Active:</span>
                    {appliedFilters.type !== "All Types" && <FilterPill label={appliedFilters.type} onRemove={() => { const nf = { ...appliedFilters, type: "All Types" }; setAppliedFilters(nf); setFilterType("All Types"); setActivePage(1); }} />}
                    {appliedFilters.status !== "All Status" && <FilterPill label={appliedFilters.status} onRemove={() => { const nf = { ...appliedFilters, status: "All Status" }; setAppliedFilters(nf); setFilterStatus("All Status"); setActivePage(1); }} />}
                    {appliedFilters.hackathon !== "All Hackathons" && <FilterPill label={appliedFilters.hackathon} onRemove={() => { const nf = { ...appliedFilters, hackathon: "All Hackathons" }; setAppliedFilters(nf); setFilterHackathon("All Hackathons"); setActivePage(1); }} />}
                    {appliedFilters.dateFrom && <FilterPill label={`From ${appliedFilters.dateFrom}`} onRemove={() => { setAppliedFilters(p => ({ ...p, dateFrom: "" })); setDateFrom(""); setActivePage(1); }} />}
                    {appliedFilters.dateTo && <FilterPill label={`To ${appliedFilters.dateTo}`} onRemove={() => { setAppliedFilters(p => ({ ...p, dateTo: "" })); setDateTo(""); setActivePage(1); }} />}
                    <button onClick={handleClearFilters} style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}>Clear all</button>
                  </div>
                )}

                <div id="print-area" style={{ marginTop: "20px", width: "100%", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", textAlign: "left", fontSize: "0.875rem", minWidth: "700px" }}>
                    <thead>
                      <tr style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" }}>
                        <th style={{ width: "40px", padding: "8px 12px" }}><input type="checkbox" style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: "#2563eb" }} /></th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Title</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Type</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Recipient</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Sent On</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Status</th>
                        <th style={{ padding: "8px 12px", fontWeight: 600 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="wait">
                        {paginated.length === 0 ? (
                          <tr key="empty">
                            <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
                              <Bell size={32} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
                              <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>No notifications found</div>
                              <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>Try adjusting your filters or search query</div>
                            </td>
                          </tr>
                        ) : (
                          paginated.map((n, idx) => (
                            <motion.tr key={n.id}
                              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.3, delay: idx * 0.04 }}
                              style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", transition: "background 0.2s, box-shadow 0.2s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.8)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,64,175,0.08)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.4)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                              <td style={{ borderRadius: "16px 0 0 16px", padding: "16px 12px" }}>
                                <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "#2563eb" }} />
                              </td>
                              <td style={{ padding: "16px 12px" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                                  <span style={{ display: "flex", height: "40px", width: "40px", flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: "12px" }} className={n.iconBg}>
                                    <n.icon size={18} className={n.iconColor} />
                                  </span>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, color: "#0b1b52" }}>{n.title}</div>
                                    <div className="line-clamp-1" style={{ marginTop: "2px", maxWidth: "280px", fontSize: "0.75rem", color: "#64748b" }}>{n.message}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "16px 12px" }}><TypeBadge type={n.type} /></td>
                              <td style={{ padding: "16px 12px", color: "#475569" }}>{n.recipient}</td>
                              <td style={{ padding: "16px 12px" }}>
                                <div style={{ color: "#334155" }}>{n.displayDate}</div>
                                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{n.time}</div>
                              </td>
                              <td style={{ padding: "16px 12px" }}>
                                <StatusBadge status={n.status} onClick={() => toggleStatus(n.id)} />
                              </td>
                              <td style={{ borderRadius: "0 16px 16px 0", padding: "16px 12px" }}>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => setDetailNotif(n)}
                                    title="View detail"
                                    className="glass-soft"
                                    style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", color: "#2563eb" }}>
                                    <Eye size={15} />
                                  </motion.button>
                                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      const text = `Title: ${n.title}\nType: ${n.type}\nRecipient: ${n.recipient}\nDate: ${n.displayDate} ${n.time}\nStatus: ${n.status}\n\nMessage:\n${n.message}`;
                                      const blob = new Blob([text], { type: "text/plain" });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url; a.download = `notification-${n.id}.txt`;
                                      a.click(); URL.revokeObjectURL(url);
                                      showToast("Notification downloaded!");
                                    }}
                                    title="Download"
                                    className="glass-soft"
                                    style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", color: "#f43f5e" }}>
                                    <Download size={15} />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    Showing {filtered.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} notifications
                  </p>
                  <Pagination active={activePage} total={totalPages} onChange={setActivePage} />
                </div>
              </motion.section>

              {!isMobile ? (
                <aside style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: 0 }}>
                  <FiltersPanel
                    filterType={filterType} setFilterType={setFilterType}
                    filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                    filterHackathon={filterHackathon} setFilterHackathon={setFilterHackathon}
                    hackathons={hackathons}
                    dateFrom={dateFrom} setDateFrom={setDateFrom}
                    dateTo={dateTo} setDateTo={setDateTo}
                    onApply={handleApplyFilters} onClear={handleClearFilters}
                  />
                  <TemplatesPanel
                    templates={templatesList}
                    onViewAll={() => setShowViewAll(true)}
                    onManage={() => setShowManage(true)}
                  />
                </aside>
              ) : (
                null
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobile && mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,23,42,0.35)", backdropFilter: "blur(6px)" }}
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                style={{ position: "fixed", top: 0, right: 0, zIndex: 210, height: "100vh", width: "min(85vw, 360px)", overflowY: "auto", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(24px)", borderLeft: "1px solid rgba(255,255,255,0.7)", padding: "24px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 24px 60px rgba(15,23,42,0.2)" }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setMobileSidebarOpen(false)} style={{ background: "rgba(241,245,249,0.8)", border: "none", borderRadius: "10px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
                    <X size={16} />
                  </button>
                </div>
                <FiltersPanel
                  filterType={filterType} setFilterType={setFilterType}
                  filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                  filterHackathon={filterHackathon} setFilterHackathon={setFilterHackathon}
                  hackathons={hackathons}
                  dateFrom={dateFrom} setDateFrom={setDateFrom}
                  dateTo={dateTo} setDateTo={setDateTo}
                  onApply={() => { handleApplyFilters(); setMobileSidebarOpen(false); }}
                  onClear={handleClearFilters}
                />
                <TemplatesPanel
                  templates={templatesList}
                  onViewAll={() => { setShowViewAll(true); setMobileSidebarOpen(false); }}
                  onManage={() => { setShowManage(true); setMobileSidebarOpen(false); }}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {detailNotif && (
            <Modal title="Notification Detail" onClose={() => setDetailNotif(null)} wide={false}>
              {/* ... same content as original, no changes needed beyond modal itself ... */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                <span style={{ width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px", flexShrink: 0 }} className={detailNotif.iconBg}>
                  <detailNotif.icon size={24} className={detailNotif.iconColor} />
                </span>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0b1b52" }}>{detailNotif.title}</h3>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                    <TypeBadge type={detailNotif.type} />
                    <StatusBadge status={detailNotif.status} onClick={() => { toggleStatus(detailNotif.id); setDetailNotif(p => ({ ...p, status: p.status === "Read" ? "Unread" : "Read" })); }} />
                  </div>
                </div>
              </div>
              <div style={{ background: "rgba(241,245,249,0.7)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
                <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>{detailNotif.message}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                {[
                  { label: "Recipient", value: detailNotif.recipient },
                  { label: "Sent On", value: `${detailNotif.displayDate} · ${detailNotif.time}` },
                ].map(r => (
                  <div key={r.label} style={{ background: "rgba(248,250,252,0.8)", borderRadius: "12px", padding: "12px 14px" }}>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{r.label}</p>
                    <p style={{ fontSize: "0.8rem", color: "#334155", fontWeight: 500 }}>{r.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => setDetailNotif(null)}
                  style={{ padding: "9px 18px", borderRadius: "12px", border: "1.5px solid rgba(203,213,225,0.6)", background: "rgba(255,255,255,0.5)", fontSize: "0.875rem", fontWeight: 500, color: "#64748b", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Close
                </button>
                <button
                  onClick={() => {
                    const text = `Title: ${detailNotif.title}\nType: ${detailNotif.type}\nRecipient: ${detailNotif.recipient}\nDate: ${detailNotif.displayDate} ${detailNotif.time}\nStatus: ${detailNotif.status}\n\nMessage:\n${detailNotif.message}`;
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `notification-${detailNotif.id}.txt`;
                    a.click(); URL.revokeObjectURL(url);
                    showToast("Downloaded!");
                  }}
                  style={{ padding: "9px 18px", borderRadius: "12px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", fontSize: "0.875rem", fontWeight: 600, color: "white", cursor: "pointer", boxShadow: "0 6px 18px rgba(37,99,235,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Download size={15} /> Download
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showViewAll && (
            <Modal title="All Notification Templates" onClose={() => setShowViewAll(false)} wide>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", maxHeight: "50vh", overflowY: "auto" }}>
                {templatesList.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "16px", background: "rgba(248,250,252,0.7)", border: "1px solid rgba(226,232,240,0.6)", flexWrap: "wrap" }}>
                    <span style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", flexShrink: 0 }} className={t.bg}>
                      <t.icon size={18} className={t.color} />
                    </span>
                    <span style={{ flex: 1, fontSize: "0.9rem", fontWeight: 600, color: "#0b1b52", minWidth: "120px" }}>{t.name}</span>
                    <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "10px", background: "rgba(239,246,255,0.8)", border: "1.5px solid rgba(147,197,253,0.4)", color: "#2563eb", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <FileText size={13} /> Use Template
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <button onClick={() => { setShowViewAll(false); setShowManage(true); }}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "12px", border: "1.5px solid rgba(203,213,225,0.6)", background: "rgba(255,255,255,0.5)", color: "#64748b", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Settings size={15} /> Manage
                </button>
                <button onClick={() => setShowViewAll(false)}
                  style={{ padding: "9px 20px", borderRadius: "12px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Close
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showManage && (
            <Modal title="Manage Templates" onClose={() => setShowManage(false)} wide>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "50vh", overflowY: "auto", marginBottom: "20px" }}>
                {templatesList.map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "14px", background: "rgba(248,250,252,0.7)", border: "1px solid rgba(226,232,240,0.5)", flexWrap: "wrap" }}>
                    <span style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", flexShrink: 0 }} className={t.bg}>
                      <t.icon size={16} className={t.color} />
                    </span>
                    <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600, color: "#0b1b52", minWidth: "120px" }}>{t.name}</span>
                    <button onClick={() => { setTemplatesList(prev => prev.filter(x => x.id !== t.id)); showToast("Template removed", "info"); }}
                      style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", background: "rgba(254,226,226,0.7)", border: "1px solid rgba(252,165,165,0.4)", color: "#ef4444", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {templatesList.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8", fontSize: "0.875rem" }}>No templates yet.</div>
                )}
              </div>
              <div style={{ borderTop: "1px solid rgba(226,232,240,0.6)", paddingTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  value={newTplName} onChange={e => setNewTplName(e.target.value)}
                  placeholder="New template name..."
                  style={{ flex: 1, background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "12px", padding: "10px 14px", fontSize: "0.875rem", color: "#334155", fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none", minWidth: "180px" }}
                />
                <button
                  onClick={() => {
                    if (!newTplName.trim()) return;
                    const colors = [
                      { color: "text-blue-600", bg: "bg-blue-100/80", icon: Bell },
                      { color: "text-emerald-600", bg: "bg-emerald-100/80", icon: CheckCircle },
                      { color: "text-violet-600", bg: "bg-violet-100/80", icon: Trophy },
                    ];
                    const c = colors[templatesList.length % colors.length];
                    setTemplatesList(prev => [...prev, { id: Date.now(), name: newTplName.trim(), ...c }]);
                    setNewTplName("");
                    showToast("Template added!");
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "12px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>
                  <Plus size={15} /> Add
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <button onClick={() => setShowManage(false)}
                  style={{ padding: "9px 20px", borderRadius: "12px", border: "1.5px solid rgba(203,213,225,0.6)", background: "rgba(255,255,255,0.5)", color: "#64748b", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Done
                </button>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{
                position: "fixed", bottom: "24px", right: "24px", zIndex: 999, display: "flex", alignItems: "center", gap: "10px", padding: "13px 20px", borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500,
                background: toast.type === "success" ? "#10b981" : toast.type === "info" ? "#2563eb" : toast.type === "warning" ? "#f59e0b" : "#ef4444",
                color: "white"
              }}>
              {toast.msg}
              <button onClick={() => setToast(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "white", opacity: 0.7, display: "flex" }}><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function Modal({ title, children, onClose, wide }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.35)", backdropFilter: "blur(6px)", padding: "24px" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: "28px", padding: "28px", width: "min(95vw, " + (wide ? "520px" : "440px") + ")", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(15,23,42,0.15)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0b1b52", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: "none", background: "rgba(241,245,249,0.8)", cursor: "pointer", color: "#64748b" }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Navbar({ onSidebarToggle, isMobile }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.4)", padding: "16px 0", display: "flex", alignItems: "center", gap: "16px" }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#0b1b52" }}>Admin Notifications</p>
      </div>
      <div style={{ flex: 1 }} />
      {isMobile && (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onSidebarToggle}
          className="glass-soft"
          style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "none", cursor: "pointer", color: "#2563eb" }}>
          <Menu size={20} />
        </motion.button>
      )}
      <motion.button whileHover={{ scale: 1.05 }}
        style={{ width: "40px", height: "40px", overflow: "hidden", borderRadius: "9999px", border: "none", cursor: "pointer", boxShadow: "0 0 0 2px rgba(255,255,255,0.8), 0 4px 12px rgba(37,99,235,0.2)" }}>
        <img src="https://i.pravatar.cc/80" alt="Account" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.button>
    </motion.nav>
  );
}

function StatsGrid() {
  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
      className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
      {stats.map(s => (
        <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="glass shadow-glass" style={{ borderRadius: "28px", padding: "20px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px", flexShrink: 0 }}
              className={`bg-gradient-to-br ${s.iconBg}`}>
              <s.icon size={24} className={s.iconColor} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{s.label}</p>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0b1b52", lineHeight: 1.1 }}>{s.value}</p>
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}>
            {s.up ? <ArrowUp size={14} color="#059669" /> : <ArrowDown size={14} color="#f43f5e" />}
            <span style={{ fontWeight: 600, color: s.up ? "#059669" : "#f43f5e" }}>{s.delta}</span>
            <span style={{ color: "#94a3b8" }}>from last month</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function Pagination({ active, total, onChange }) {
  const getPages = () => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (active <= 3) return [1, 2, 3, "…", total];
    if (active >= total - 2) return [1, "…", total - 2, total - 1, total];
    return [1, "…", active, "…", total];
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button onClick={() => onChange(Math.max(1, active - 1))} className="glass-soft"
        style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: "none", cursor: active === 1 ? "not-allowed" : "pointer", color: "#475569", opacity: active === 1 ? 0.5 : 1 }}>
        <ChevronLeft size={16} />
      </button>
      {getPages().map((p, i) =>
        typeof p === "number" ? (
          <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => onChange(p)}
            style={{
              width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: active === p ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "rgba(255,255,255,0.45)",
              color: active === p ? "white" : "#475569",
              boxShadow: active === p ? "0 4px 14px rgba(37,99,235,0.35)" : "none",
              backdropFilter: "blur(10px)"
            }}>
            {p}
          </motion.button>
        ) : (
          <span key={i} style={{ padding: "0 4px", color: "#94a3b8", fontSize: "0.875rem" }}>{p}</span>
        )
      )}
      <button onClick={() => onChange(Math.min(total, active + 1))} className="glass-soft"
        style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: "none", cursor: active === total ? "not-allowed" : "pointer", color: "#475569", opacity: active === total ? 0.5 : 1 }}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function FiltersPanel({ filterType, setFilterType, filterStatus, setFilterStatus, filterHackathon, setFilterHackathon, hackathons, dateFrom, setDateFrom, dateTo, setDateTo, onApply, onClear }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
      className="glass shadow-glass" style={{ borderRadius: "30px", padding: "24px", width: "100%" }}>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0b1b52", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Filters</h3>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <CustomSelect label="Type" value={filterType} onChange={setFilterType}
          options={["All Types", "Registration", "Payment", "Result", "System"]} />
        <CustomSelect label="Status" value={filterStatus} onChange={setFilterStatus}
          options={["All Status", "Read", "Unread"]} />
        <CustomSelect label="Hackathon" value={filterHackathon} onChange={setFilterHackathon}
          options={hackathons} />

        <div>
          <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Custom Range</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "14px", padding: "9px 12px" }}>
              <Calendar size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: dateFrom ? "#334155" : "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dateFrom || "Start"}</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
            </div>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", flexShrink: 0 }}>–</span>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(203,213,225,0.5)", borderRadius: "14px", padding: "9px 12px" }}>
              <Calendar size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: dateTo ? "#334155" : "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dateTo || "End"}</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>

        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onApply}
          style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "16px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", padding: "12px 16px", fontSize: "0.875rem", fontWeight: 600, color: "white", border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Filter size={16} /> Apply Filters
        </motion.button>
        <button onClick={onClear}
          style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "16px", border: "1.5px solid rgba(226,232,240,0.8)", background: "rgba(255,255,255,0.5)", padding: "10px 16px", fontSize: "0.8rem", fontWeight: 500, color: "#64748b", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <X size={14} /> Clear Filters
        </button>
      </div>
    </motion.div>
  );
}

function TemplatesPanel({ templates, onViewAll, onManage }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
      className="glass shadow-glass" style={{ borderRadius: "30px", padding: "24px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0b1b52", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Templates</h3>
        <button onClick={onViewAll} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>View All</button>
      </div>
      <ul style={{ marginTop: "16px", listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
        {templates.slice(0, 5).map((t, i) => (
          <motion.li key={t.id || t.name}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }}
            style={{ display: "flex", alignItems: "center", gap: "12px", borderRadius: "14px", padding: "8px 10px", transition: "background 0.2s", cursor: "pointer", minWidth: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.6)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", flexShrink: 0 }} className={t.bg}>
              <t.icon size={16} className={t.color} />
            </span>
            <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 500, color: "#0b1b52", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
            <button className="glass-soft" style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", cursor: "pointer", color: "#f43f5e", flexShrink: 0 }}>
              <FileText size={13} />
            </button>
          </motion.li>
        ))}
      </ul>
      <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onManage}
        style={{ marginTop: "16px", display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "14px", border: "1.5px solid rgba(147,197,253,0.5)", background: "rgba(255,255,255,0.5)", padding: "10px 16px", fontSize: "0.875rem", fontWeight: 600, color: "#1d4ed8", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Settings size={16} /> Manage Templates
      </motion.button>
    </motion.div>
  );
}