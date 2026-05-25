import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Icon = ({ d, size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  menu: "M3 12h18M3 6h18M3 18h18",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  fileText: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  trophy: ["M6 9H2v-1a1 1 0 0 1 1-1h1", "M18 9h4v-1a1 1 0 0 0-1-1h-1", "M12 17c-3.87 0-7-3.13-7-7V4h14v6c0 3.87-3.13 7-7 7z", "M9 21h6", "M12 17v4"],
  dollar: ["M12 1v22", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  building: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  calendar: ["M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M8 2v4", "M16 2v4", "M1 10h22"],
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  chevronDown: "M6 9l6 6 6-6",
  fileSpreadsheet: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M8 13h8", "M8 17h8", "M8 9h2"],
};

const stats = [
  { title: "Total Reports Generated", value: "128", growth: "18.7%", icon: "users", gradient: "from-blue-400 to-blue-500", bg: "bg-blue-100", iconColor: "text-blue-600" },
  { title: "Exports (This Month)", value: "64", growth: "12.4%", icon: "download", gradient: "from-emerald-400 to-emerald-500", bg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { title: "CSV Exports", value: "38", growth: "11.3%", icon: "fileSpreadsheet", gradient: "from-purple-400 to-purple-500", bg: "bg-purple-100", iconColor: "text-purple-600" },
  { title: "PDF Exports", value: "26", growth: "9.8%", icon: "fileText", gradient: "from-sky-400 to-sky-500", bg: "bg-sky-100", iconColor: "text-sky-600" },
];

const reports = [
  {
    icon: "users", iconBg: "bg-blue-100", iconColor: "text-blue-600",
    name: "Participant List",
    description: "Complete list of all participants across all hackathons",
    data: ["Participant details", "Team information", "Registration status", "University / College"],
    date: "May 20, 2026", time: "10:30 AM",
  },
  {
    icon: "trophy", iconBg: "bg-amber-100", iconColor: "text-amber-600",
    name: "Winners List",
    description: "List of winners and runner-ups from all hackathons",
    data: ["Winner details", "Team information", "Prize details", "Hackathon name"],
    date: "May 19, 2026", time: "04:15 PM",
  },
  {
    icon: "dollar", iconBg: "b g-emerald-100", iconColor: "text-emerald-600",
    name: "Revenue Summary",
    description: "Financial summary of registration fees and payments",
    data: ["Total revenue", "Payment status", "Refunds", "Revenue by period"],
    date: "May 20, 2026", time: "09:45 AM",
  },
  {
    icon: "building", iconBg: "bg-orange-100", iconColor: "text-orange-600",
    name: "University-wise Performance",
    description: "Performance and participation analysis by university",
    data: ["University stats", "Teams participated", "Winners count", "Performance metrics"],
    date: "May 18, 2026", time: "11:20 AM",
  },
  {
    icon: "trending", iconBg: "bg-cyan-100", iconColor: "text-cyan-600",
    name: "Hackathon Overview",
    description: "Overall hackathon statistics and insights",
    data: ["Total hackathons", "Participation stats", "Completion rate", "Popularity metrics"],
    date: "May 17, 2026", time: "02:10 PM",
  },
];

const recentExports = [
  { type: "CSV", name: "Participant List - May 20, 2026", date: "May 20, 2026 10:30 AM", color: "bg-emerald-100 text-emerald-700" },
  { type: "PDF", name: "Revenue Summary - May 19, 2026", date: "May 19, 2026 04:15 PM", color: "bg-rose-100 text-rose-700" },
  { type: "CSV", name: "University Performance - May 18, 2026", date: "May 18, 2026 11:20 AM", color: "bg-emerald-100 text-emerald-700" },
  { type: "PDF", name: "Winners List - May 17, 2026", date: "May 17, 2026 02:10 PM", color: "bg-rose-100 text-rose-700" },
];

const hackathons = ["All Hackathons", "HackSphere 2026", "CodeStorm 2024", "BuildFest 2024"];
const universities = ["All Universities", "IIT Bombay", "NIT Nagpur", "BITS Pilani", "VIT Vellore"];

const glass = "bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)]";
const fontStack = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" };
const fontStyle = document.createElement('style');
fontStyle.textContent = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');";
document.head.appendChild(fontStyle);

function Toast({ msg, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0b1b52] text-white text-sm font-medium shadow-2xl"
    >
      <Icon d={Icons.check} size={16} className="text-emerald-400" />
      {msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <Icon d={Icons.x} size={14} />
      </button>
    </motion.div>
  );
}

function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-white/40"
    >
      <div className="px-6 lg:px-10 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-2xl font-bold text-[#0b1b52]">Reports & Export</p>
          </div>
        </div>
        <div className="flex-1" />
        <button type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80 shadow-md transition hover:ring-blue-300">
          <img src="https://i.pravatar.cc/80" alt="Account" className="h-full w-full object-cover" />
        </button>
      </div>
    </motion.nav>
  );
}
function StatCard({ stat, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`${glass} rounded-3xl p-5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all cursor-default`}
    >
      <div className="flex items-start gap-4">
        <div className={`${stat.bg} rounded-2xl p-3.5`}>
          <Icon d={Icons[stat.icon]} size={22} className={stat.iconColor} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{stat.title}</p>
          <p className="text-3xl font-bold text-[#0b1b52] mt-1">{stat.value}</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <Icon d={Icons.trending} size={12} /> {stat.growth} from last month
          </p>
        </div>
      </div>
    </motion.div>
  );
}
function ReportsTable({ onExport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${glass} rounded-3xl p-6`}
    >
      <h2 className="text-xl font-bold text-[#0b1b52]">Available Reports</h2>
      <p className="text-sm text-gray-500 mt-1">Select a report type to generate and export data.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <th className="py-3 pr-4 font-semibold">Report Name</th>
              <th className="py-3 pr-4 font-semibold">Description</th>
              <th className="py-3 pr-4 font-semibold">Data Included</th>
              <th className="py-3 pr-4 font-semibold">Last Generated</th>
              <th className="py-3 pr-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <motion.tr
                key={r.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="border-b border-gray-50 hover:bg-white/50 transition"
              >
                <td className="py-5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className={`${r.iconBg} rounded-xl p-2.5`}>
                      <Icon d={Icons[r.icon]} size={18} className={r.iconColor} />
                    </div>
                    <span className="font-semibold text-[#0b1b52] text-sm whitespace-nowrap">{r.name}</span>
                  </div>
                </td>
                <td className="py-5 pr-4 text-sm text-gray-600 max-w-[200px]">{r.description}</td>
                <td className="py-5 pr-4">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {r.data.map(d => (
                      <li key={d} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />{d}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-5 pr-4 text-sm whitespace-nowrap">
                  <div className="text-[#0b1b52] font-medium">{r.date}</div>
                  <div className="text-xs text-gray-500">{r.time}</div>
                </td>
                <td className="py-5 pr-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => onExport(r.name, "CSV")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 hover:shadow-[0_0_12px_rgba(34,197,94,0.25)] transition-all"
                    >
                      CSV <Icon d={Icons.download} size={12} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => onExport(r.name, "PDF")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all"
                    >
                      PDF <Icon d={Icons.download} size={12} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 text-xs text-gray-400">Showing 1 to 5 of 5 reports</div>
    </motion.div>
  );
}
function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <button
        onClick={() => setOpen(o => !o)}
        className="mt-1.5 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/70 border border-white/60 text-sm text-[#0b1b52] hover:border-blue-200 transition"
      >
        {value} <Icon d={Icons.chevronDown} size={15} className="text-gray-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-20 mt-1 w-full rounded-xl bg-white border border-gray-100 shadow-xl overflow-hidden text-sm"
          >
            {options.map(opt => (
              <li key={opt}>
                <button
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition ${value === opt ? "text-blue-600 font-semibold" : "text-[#0b1b52]"}`}
                >
                  {value === opt && <Icon d={Icons.check} size={12} className="inline mr-2 text-blue-600" />}
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function FiltersPanel({ onGenerate }) {
  const [hackathon, setHackathon] = useState("All Hackathons");
  const [dateRange, setDateRange] = useState("Custom Range");
  const [university, setUniversity] = useState("All Universities");
  const [format, setFormat] = useState("CSV");
  const [from, setFrom] = useState("May 01, 2026");
  const [to, setTo] = useState("May 20, 2026");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGenerate({ hackathon, dateRange, university, format, from, to });
    }, 1500);
  };

  const handleReset = () => {
    setHackathon("All Hackathons");
    setDateRange("Custom Range");
    setUniversity("All Universities");
    setFormat("CSV");
    setFrom("May 01, 2026");
    setTo("May 20, 2026");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 }}
      className={`${glass} rounded-3xl p-6`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0b1b52]">Report Filters</h3>
        <button onClick={handleReset} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
          <Icon d={Icons.refresh} size={12} /> Reset Filters
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">Customize your report data</p>

      <div className="mt-5 space-y-4">
        <Dropdown label="Hackathon" options={hackathons} value={hackathon} onChange={setHackathon} />
        <Dropdown label="Date Range" options={["Custom Range", "Last 7 Days", "Last 30 Days", "This Year"]} value={dateRange} onChange={setDateRange} />

        <div className="grid grid-cols-2 gap-3">
          {[{ val: from, set: setFrom }, { val: to, set: setTo }].map(({ val, set }, i) => (
            <div key={i} className="relative">
              <input
                value={val}
                onChange={e => set(e.target.value)}
                className="w-full px-3 py-2.5 pr-8 rounded-xl bg-white/70 border border-white/60 text-sm text-[#0b1b52] focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <Icon d={Icons.calendar} size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          ))}
        </div>

        <Dropdown label="University" options={universities} value={university} onChange={setUniversity} />

        <div>
          <label className="text-xs font-medium text-gray-600">Export Format</label>
          <div className="mt-1.5 flex gap-2">
            {["CSV", "PDF"].map(f => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormat(f)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-sm font-semibold transition-all ${
                  format === f
                    ? f === "CSV"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_18px_rgba(34,197,94,0.4)]"
                      : "bg-rose-500 text-white border-rose-500 shadow-[0_0_18px_rgba(239,68,68,0.4)]"
                    : "bg-white/60 text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon d={format === f ? Icons.check : Icons.x} size={13} className={format === f ? "" : "opacity-40"} />
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading}
          className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold text-sm shadow-[0_8px_20px_rgba(37,99,235,0.35)] flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Icon d={Icons.refresh} size={16} />
            </motion.div>
          ) : (
            <Icon d={Icons.fileText} size={16} />
          )}
          {loading ? "Generating..." : "Generate Report"}
        </motion.button>
      </div>
    </motion.div>
  );
}
function RecentExports({ exports, onDownload }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? exports : exports.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 }}
      className={`${glass} rounded-3xl p-6`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0b1b52]">Recent Exports</h3>
        <button onClick={() => setShowAll(s => !s)} className="text-xs text-blue-600 hover:underline">
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <AnimatePresence>
          {visible.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition group"
            >
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${e.color} shrink-0`}>{e.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0b1b52] truncate">{e.name}</p>
                <p className="text-xs text-gray-500">{e.date}</p>
              </div>
              <button
                onClick={() => onDownload(e.name)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition"
              >
                <Icon d={Icons.download} size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ReportsDashboard() {
  const [toast, setToast] = useState(null);
  const [exportHistory, setExportHistory] = useState(recentExports);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = (name, type) => {
    const newEntry = {
      type,
      name: `${name} - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      color: type === "CSV" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
    };
    setExportHistory(h => [newEntry, ...h]);
    showToast(`${type} export started for "${name}"`);
  };

  const handleGenerate = (filters) => {
    showToast(`Report generated: ${filters.hackathon} · ${filters.format} · ${filters.university}`);
  };

  const handleDownload = name => showToast(`Downloading "${name}"...`);

  return (
    <div style={fontStack} className="min-h-screen bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff]">
      <div className="max-w-[1700px] mx-auto">

        <Navbar />

        <div className="px-6 lg:px-10 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={s.title} stat={s} i={i} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-8">
          <div className="lg:col-span-7">
            <ReportsTable onExport={handleExport} />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <FiltersPanel onGenerate={handleGenerate} />
            <RecentExports exports={exportHistory} onDownload={handleDownload} />
          </div>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}