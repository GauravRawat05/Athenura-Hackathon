import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Filter,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  IdCard,
  Shield,
  Building2,
  Calendar,
  Clock,
  KeyRound,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  TrendingDown,
  X,
  Mail,
  Check,
  Trophy,
  Code2,
  Star,
} from "lucide-react";
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-blue-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl ${bgColor} px-4 py-3 text-white shadow-lg`}
    >
      {type === 'success' && <Check className="h-5 w-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
const AVATARS = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=47",
  "https://i.pravatar.cc/120?img=15",
  "https://i.pravatar.cc/120?img=45",
  "https://i.pravatar.cc/120?img=33",
  "https://i.pravatar.cc/120?img=14",
  "https://i.pravatar.cc/120?img=49",
  "https://i.pravatar.cc/120?img=8",
];

const INITIAL_USERS = [
  {
    id: "USR-2026-0001", name: "Rahul Sharma", email: "rahul@example.com", role: "Participant", team: "IIT Bombay", status: "Active", joined: "May 20, 2026", lastActive: "Jun 19, 2026, 02:15 PM", avatar: AVATARS[0], locked: false,
    hackathons: [
      { id: "HCK-001", name: "HackIndia 2026", date: "Apr 10–12, 2026", result: "Winner", track: "AI/ML" },
      { id: "HCK-004", name: "CodeSprint National", date: "Mar 05–06, 2026", result: "Participant", track: "Web Dev" },
    ],
  },
  {
    id: "USR-2026-0002", name: "Priya Verma", email: "priya@example.com", role: "Participant", team: "IIIT Hyderabad", status: "Active", joined: "May 18, 2026", lastActive: "Jun 19, 2026, 11:02 AM", avatar: AVATARS[1], locked: false,
    hackathons: [
      { id: "HCK-002", name: "DevFest Hack 2026", date: "May 03–04, 2026", result: "Runner Up", track: "FinTech" },
      { id: "HCK-005", name: "Smart India Hackathon", date: "Feb 20–22, 2026", result: "Participant", track: "GovTech" },
    ],
  },
  {
    id: "USR-2026-0003", name: "Amit Kumar", email: "amit@example.com", role: "Team Leader", team: "VIT Vellore", status: "Active", joined: "May 15, 2026", lastActive: "Jun 18, 2026, 06:48 PM", avatar: AVATARS[2], locked: false,
    hackathons: [
      { id: "HCK-001", name: "HackIndia 2026", date: "Apr 10–12, 2026", result: "Participant", track: "AI/ML" },
      { id: "HCK-003", name: "Blockchain Blitz", date: "Jan 15–16, 2026", result: "Winner", track: "Web3" },
      { id: "HCK-006", name: "ClimaTech Hack", date: "Mar 28–29, 2026", result: "Participant", track: "Climate" },
    ],
  },
  {
    id: "USR-2026-0004", name: "Sneha Iyer", email: "sneha@example.com", role: "Participant", team: "BITS Pilani", status: "Suspended", joined: "May 10, 2026", lastActive: "Jun 12, 2026, 09:30 AM", avatar: AVATARS[3], locked: true,
    hackathons: [
      { id: "HCK-002", name: "DevFest Hack 2026", date: "May 03–04, 2026", result: "Participant", track: "FinTech" },
    ],
  },
  {
    id: "USR-2026-0005", name: "Arjun Patel", email: "arjun@example.com", role: "Participant", team: "Delhi University", status: "Active", joined: "May 08, 2026", lastActive: "Jun 19, 2026, 08:10 AM", avatar: AVATARS[4], locked: false,
    hackathons: [
      { id: "HCK-004", name: "CodeSprint National", date: "Mar 05–06, 2026", result: "Runner Up", track: "Web Dev" },
      { id: "HCK-005", name: "Smart India Hackathon", date: "Feb 20–22, 2026", result: "Winner", track: "GovTech" },
    ],
  },
  {
    id: "USR-2026-0006", name: "Karan Mehta", email: "karan@example.com", role: "Judge", team: "Independent", status: "Active", joined: "May 05, 2026", lastActive: "Jun 17, 2026, 04:25 PM", avatar: AVATARS[5], locked: false,
    hackathons: [
      { id: "HCK-001", name: "HackIndia 2026", date: "Apr 10–12, 2026", result: "Judge", track: "AI/ML" },
      { id: "HCK-003", name: "Blockchain Blitz", date: "Jan 15–16, 2026", result: "Judge", track: "Web3" },
      { id: "HCK-006", name: "ClimaTech Hack", date: "Mar 28–29, 2026", result: "Judge", track: "Climate" },
    ],
  },
  {
    id: "USR-2026-0007", name: "Neha Singh", email: "neha@example.com", role: "University Admin", team: "IIT Delhi", status: "Active", joined: "May 02, 2026", lastActive: "Jun 19, 2026, 10:00 AM", avatar: AVATARS[6], locked: false,
    hackathons: [],
  },
  {
    id: "USR-2026-0008", name: "Rohan Das", email: "rohan@example.com", role: "Participant", team: "NIT Trichy", status: "Suspended", joined: "Apr 28, 2026", lastActive: "Jun 05, 2026, 03:55 PM", avatar: AVATARS[7], locked: true,
    hackathons: [
      { id: "HCK-005", name: "Smart India Hackathon", date: "Feb 20–22, 2026", result: "Participant", track: "GovTech" },
    ],
  },
];

const ROLE_STYLES = {
  Participant: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  "Team Leader": "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
  Judge: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  "University Admin": "bg-pink-100 text-pink-700 ring-1 ring-pink-200",
};

const STATUS_STYLES = {
  Active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Suspended: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
};

const HACKATHON_RESULT_STYLES = {
  Winner:      { bg: "bg-amber-50 border-amber-200",  badge: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",  icon: Trophy,  iconColor: "text-amber-500" },
  "Runner Up": { bg: "bg-purple-50 border-purple-200", badge: "bg-purple-100 text-purple-700 ring-1 ring-purple-200", icon: Star,    iconColor: "text-purple-500" },
  Judge:       { bg: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700 ring-1 ring-orange-200", icon: Shield,  iconColor: "text-orange-500" },
  Participant: { bg: "bg-slate-50 border-slate-200",   badge: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",   icon: Code2,   iconColor: "text-slate-500" },
};
function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[role]}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function Dropdown({ value, options, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white/80"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-white/60 bg-white/95 p-1 shadow-xl backdrop-blur-xl"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${opt === value ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
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
function ActionIconButton({ icon: Icon, tone, onClick, label }) {
  const tones = {
    blue: "from-blue-50 to-blue-100 text-blue-600 ring-blue-200 hover:shadow-blue-200/60",
    amber: "from-amber-50 to-amber-100 text-amber-600 ring-amber-200 hover:shadow-amber-200/60",
    emerald: "from-emerald-50 to-emerald-100 text-emerald-600 ring-emerald-200 hover:shadow-emerald-200/60",
    rose: "from-rose-50 to-rose-100 text-rose-600 ring-rose-200 hover:shadow-rose-200/60",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition hover:shadow-lg ${tones[tone]}`}
    >
      <Icon className="h-4 w-4" />
    </motion.button>
  );
}
const STATS = [
  { title: "Total Users", value: "2,846", delta: "12.5%", up: true, icon: Users, gradient: "from-blue-100 to-blue-200", iconColor: "text-blue-600" },
  { title: "Active Users", value: "2,512", delta: "10.8%", up: true, icon: UserCheck, gradient: "from-emerald-100 to-emerald-200", iconColor: "text-emerald-600" },
  { title: "Suspended Users", value: "156", delta: "3.2%", up: false, icon: UserX, gradient: "from-purple-100 to-purple-200", iconColor: "text-purple-600" },
  { title: "New Users (This Month)", value: "342", delta: "15.4%", up: true, icon: UserPlus, gradient: "from-cyan-100 to-cyan-200", iconColor: "text-cyan-600" },
];

function StatCard({ stat, i }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card group relative overflow-hidden rounded-3xl p-5 transition-shadow hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)]"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient}`}>
          <Icon className={`h-7 w-7 ${stat.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{stat.title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[#0b1b52]">{stat.value}</p>
          <div className="mt-1 flex items-center gap-1 text-xs">
            {stat.up ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            )}
            <span className={stat.up ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>
              {stat.delta}
            </span>
            <span className="text-slate-400">from last month</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-white/60 to-white/0 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
function UserDetailsPanel({ user, onViewProfile, onResetPassword, onToggleSuspend }) {
  const rows = [
    { icon: IdCard, label: "User ID", value: user.id },
    { icon: Shield, label: "Role", value: user.role },
    { icon: Building2, label: "University/Team", value: user.team },
    { icon: Calendar, label: "Joined On", value: user.joined + ", 10:30 AM" },
    { icon: Clock, label: "Last Active", value: user.lastActive },
  ];

  return (
    <motion.aside
      key={user.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card sticky top-6 rounded-3xl p-6"
    >
      <h3 className="text-lg font-bold text-[#0b1b52]">User Details</h3>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow"
          />
          <span
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-white ${user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
              }`}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#0b1b52]">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <div className="mt-1.5">
            <StatusBadge status={user.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={r.label}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5 text-sm text-slate-500">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span>{r.label}</span>
                </div>
                <span className="max-w-[55%] truncate text-right text-sm font-medium text-[#0b1b52]">
                  {r.value}
                </span>
              </div>
              {i < rows.length - 1 && <div className="h-px bg-slate-200/70" />}
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#0b1b52] flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-blue-500" />
            Hackathons Participated
          </h4>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {user.hackathons?.length || 0}
          </span>
        </div>
        {user.hackathons && user.hackathons.length > 0 ? (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
            {user.hackathons.map((h) => {
              const style = HACKATHON_RESULT_STYLES[h.result] || HACKATHON_RESULT_STYLES["Participant"];
              const ResultIcon = style.icon;
              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${style.bg}`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 shadow-sm">
                    <ResultIcon className={`h-4 w-4 ${style.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#0b1b52]">{h.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{h.date} · {h.track}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badge}`}>
                    {h.result}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-5 text-center">
            <Code2 className="h-6 w-6 text-slate-300 mb-1.5" />
            <p className="text-xs text-slate-400">No hackathons joined yet</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <motion.button
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200/60 bg-blue-50/80 px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-xl transition hover:bg-blue-100/80 hover:shadow-md"
        >
          <Eye className="h-4 w-4" /> View Profile
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onResetPassword}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200/60 bg-amber-50/80 px-4 py-3 text-sm font-semibold text-amber-700 shadow-sm backdrop-blur-xl transition hover:bg-amber-100/80 hover:shadow-md"
        >
          <RefreshCw className="h-4 w-4" /> Reset Password
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleSuspend}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm backdrop-blur-xl transition hover:shadow-md ${user.status === "Active"
            ? "border-rose-200/60 bg-rose-50/80 text-rose-700 hover:bg-rose-100/80"
            : "border-emerald-200/60 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80"
            }`}
        >
          {user.status === "Active" ? (
            <><PauseCircle className="h-4 w-4" /> Suspend User</>
          ) : (
            <><PlayCircle className="h-4 w-4" /> Reactivate User</>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
export default function UserManagementDashboard() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [selectedId, setSelectedId] = useState(INITIAL_USERS[0].id);
  const [page, setPage] = useState(1);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [tempRole, setTempRole] = useState("All Roles");
  const [tempStatus, setTempStatus] = useState("All Status");
  const [tempTeam, setTempTeam] = useState("All Teams");

  const filtersRef = useRef(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };
  useEffect(() => {
    if (filtersOpen) {
      setTempRole(roleFilter);
      setTempStatus(statusFilter);
      setTempTeam(teamFilter);
    }
  }, [filtersOpen, roleFilter, statusFilter, teamFilter]);
  useEffect(() => {
    if (!filtersOpen) return;
    const onClick = (e) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [filtersOpen]);

  const teamOptions = useMemo(
    () => ["All Teams", ...Array.from(new Set(users.map((u) => u.team)))],
    [users],
  );

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.team.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All Status" || u.status === statusFilter;
      const matchesTeam = teamFilter === "All Teams" || u.team === teamFilter;
      return matchesQ && matchesRole && matchesStatus && matchesTeam;
    });
  }, [users, query, roleFilter, statusFilter, teamFilter]);

  const selected = users.find((u) => u.id === selectedId) ?? users[0];

  const activeFilterCount =
    (roleFilter !== "All Roles" ? 1 : 0) +
    (statusFilter !== "All Status" ? 1 : 0) +
    (teamFilter !== "All Teams" ? 1 : 0);

  const liveStats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    return [
      { ...STATS[0], value: total.toLocaleString() },
      { ...STATS[1], value: active.toLocaleString() },
      { ...STATS[2], value: suspended.toLocaleString() },
      STATS[3],
    ];
  }, [users]);

  const totalPages = 356;
  const pageNumbers = [1, 2, 3];

  const handleSelect = (u) => {
    setSelectedId(u.id);
    setMobileDetailsOpen(true);
  };
  const toggleLock = (u) => {
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, locked: !x.locked } : x)),
    );
    showToast(`${u.name} ${u.locked ? "unlocked" : "locked"}`, 'success');
  };

  const refreshUser = (u) => {
    const now = new Date();
    const stamp = now.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, lastActive: stamp } : x)),
    );
    showToast(`Refreshed ${u.name}'s data`, 'success');
  };

  const toggleSuspend = (u) => {
    const next = u.status === "Active" ? "Suspended" : "Active";
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)),
    );
    showToast(
      next === "Suspended" ? `${u.name} suspended` : `${u.name} reactivated`,
      'success'
    );
  };

  const resetPassword = (u) => {
    showToast(`Password reset link sent to ${u.email}`, 'success');
  };

  const applyFilters = () => {
    setRoleFilter(tempRole);
    setStatusFilter(tempStatus);
    setTeamFilter(tempTeam);
    setFiltersOpen(false);
    showToast("Filters applied", 'success');
  };

  const clearAllFilters = () => {
    setTempRole("All Roles");
    setTempStatus("All Status");
    setTempTeam("All Teams");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
    setTeamFilter("All Teams");
    setQuery("");
    showToast("Filters cleared", 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff]" style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1650px] px-6 lg:px-10">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-white/40"
        >
          <div className="py-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-bold text-[#0b1b52]">User Management</p>
              </div>
            </div>
            <div className="flex-1" />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80 shadow-md transition hover:ring-blue-300"
              aria-label="Account"
            >
              <img src="https://i.pravatar.cc/80" alt="Account" className="h-full w-full object-cover" />
            </button>
          </div>
        </motion.nav>
        <section className="py-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {liveStats.map((s, i) => (
            <StatCard key={s.title} stat={s} i={i} />
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-3xl p-4 sm:p-6"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users by name, email, or role..."
                  className="w-full rounded-xl border border-white/60 bg-white/60 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none ring-blue-200 backdrop-blur-xl transition focus:bg-white/90 focus:ring-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
                <Dropdown
                  value={roleFilter}
                  options={["All Roles", "Participant", "Team Leader", "Judge", "University Admin"]}
                  onChange={setRoleFilter}
                  className="lg:w-44"
                />
                <Dropdown
                  value={statusFilter}
                  options={["All Status", "Active", "Suspended"]}
                  onChange={setStatusFilter}
                  className="lg:w-40"
                />
                <div ref={filtersRef} className="relative col-span-2 lg:col-span-1">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((o) => !o)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-xl transition hover:bg-white/80"
                  >
                    <Filter className="h-4 w-4" /> Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {filtersOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-xl"
                      >
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Advanced Filters
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">University / Team</label>
                            <Dropdown value={tempTeam} options={teamOptions} onChange={setTempTeam} />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Role</label>
                            <Dropdown
                              value={tempRole}
                              options={["All Roles", "Participant", "Team Leader", "Judge", "University Admin"]}
                              onChange={setTempRole}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                            <Dropdown
                              value={tempStatus}
                              options={["All Status", "Active", "Suspended"]}
                              onChange={setTempStatus}
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition"
                          >
                            Clear all
                          </button>
                          <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow-md transition"
                          >
                            <Check className="h-3.5 w-3.5" /> Apply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="mt-5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>
              <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="rounded-l-xl bg-slate-50/70 px-4 py-3 w-48">User</th>
                    <th className="bg-slate-50/70 px-4 py-3 w-52">Email</th>
                    <th className="bg-slate-50/70 px-4 py-3 w-36">Role</th>
                    <th className="bg-slate-50/70 px-4 py-3 w-44">University/Team</th>
                    <th className="bg-slate-50/70 px-4 py-3 w-28">Status</th>
                    <th className="bg-slate-50/70 px-4 py-3 w-36">Joined On</th>
                    <th className="rounded-r-xl bg-slate-50/70 px-4 py-3 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {filtered.map((u, i) => {
                      const isSelected = u.id === selectedId;
                      return (
                        <motion.tr
                          key={u.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                          onClick={() => handleSelect(u)}
                          className={`cursor-pointer text-sm transition ${isSelected ? "bg-blue-50/70" : "bg-white/50 hover:bg-white/80"
                            }`}
                        >
                          <td className="rounded-l-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-white" />
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-[#0b1b52]">{u.name}</p>
                                <p className="truncate text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{u.email}</td>
                          <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                          <td className="px-4 py-3 text-slate-700">{u.team}</td>
                          <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                          <td className="px-4 py-3 text-slate-600">{u.joined}</td>
                          <td className="rounded-r-xl px-4 py-3">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <ActionIconButton
                                icon={Eye}
                                tone="blue"
                                label="View"
                                onClick={() => handleSelect(u)}
                              />
                              <ActionIconButton
                                icon={u.locked ? Lock : Unlock}
                                tone={u.locked ? "rose" : "amber"}
                                label={u.locked ? "Unlock user" : "Lock user"}
                                onClick={() => toggleLock(u)}
                              />
                              <ActionIconButton
                                icon={RefreshCw}
                                tone="emerald"
                                label="Refresh"
                                onClick={() => refreshUser(u)}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                        No users match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-slate-500">
                Showing 1 to {filtered.length} of 2,846 results
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/60 bg-white/60 text-slate-600 transition hover:bg-white/90"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${page === n
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                      : "border border-white/60 bg-white/60 text-slate-700 hover:bg-white/90"
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-1 text-slate-400">…</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/60 bg-white/60 px-3 text-sm font-medium text-slate-700 transition hover:bg-white/90"
                >
                  356
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/60 bg-white/60 text-slate-600 transition hover:bg-white/90"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
      <AnimatePresence>
        {mobileDetailsOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setMobileDetailsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff] p-4"
            >
              <button
                onClick={() => setMobileDetailsOpen(false)}
                className="mb-3 ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-slate-600 shadow"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <UserDetailsPanel
                user={selected}
                onViewProfile={() => { setMobileDetailsOpen(false); setProfileOpen(true); }}
                onResetPassword={() => resetPassword(selected)}
                onToggleSuspend={() => toggleSuspend(selected)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="glass-card relative w-full max-w-lg overflow-hidden rounded-3xl"
            >
              <div className="relative h-28 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/30 text-white backdrop-blur transition hover:bg-white/50"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-6 pb-6">
                <div className="-mt-12 flex items-end gap-4">
                  <img
                    src={selected.avatar}
                    alt={selected.name}
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-[#0b1b52]">{selected.name}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <RoleBadge role={selected.role} />
                      <StatusBadge status={selected.status} />
                      {selected.locked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { icon: Mail, label: "Email", value: selected.email },
                    { icon: IdCard, label: "User ID", value: selected.id },
                    { icon: Building2, label: "University/Team", value: selected.team },
                    { icon: Calendar, label: "Joined", value: selected.joined },
                    { icon: Clock, label: "Last Active", value: selected.lastActive },
                    { icon: Shield, label: "Role", value: selected.role },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <div key={r.label} className="rounded-xl border border-white/70 bg-white/50 p-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Icon className="h-3.5 w-3.5" />
                          {r.label}
                        </div>
                        <p className="mt-1 truncate text-sm font-medium text-[#0b1b52]">{r.value}</p>
                      </div>
                    );
                  })}
                </div>
                {selected.hackathons && selected.hackathons.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-[#0b1b52] flex items-center gap-1.5 mb-3">
                      <Code2 className="h-4 w-4 text-blue-500" />
                      Hackathons Participated
                      <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {selected.hackathons.length}
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selected.hackathons.map((h) => {
                        const style = HACKATHON_RESULT_STYLES[h.result] || HACKATHON_RESULT_STYLES["Participant"];
                        const ResultIcon = style.icon;
                        return (
                          <div key={h.id} className={`flex items-center gap-3 rounded-xl border p-3 ${style.bg}`}>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 shadow-sm">
                              <ResultIcon className={`h-4 w-4 ${style.iconColor}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-[#0b1b52]">{h.name}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{h.date} · {h.track}</p>
                            </div>
                            <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badge}`}>
                              {h.result}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => { resetPassword(selected); }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition"
                  >
                    <KeyRound className="h-4 w-4" /> Reset Password
                  </button>
                  <button
                    onClick={() => { toggleSuspend(selected); setProfileOpen(false); }}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${selected.status === "Active"
                      ? "border-rose-200/60 bg-rose-50 text-rose-700 hover:bg-rose-100"
                      : "border-emerald-200/60 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                  >
                    {selected.status === "Active" ? (
                      <><PauseCircle className="h-4 w-4" /> Suspend</>
                    ) : (
                      <><PlayCircle className="h-4 w-4" /> Reactivate</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}