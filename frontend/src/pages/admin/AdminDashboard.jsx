import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Trophy, DollarSign, Building2, TrendingUp,
  Bell, User, ChevronDown, Check, Calendar, Activity, Zap, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GLOBAL_STYLES = `
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
`;

function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

const USER_AVATARS = {
  "Rahul Sharma": "https://i.pravatar.cc/120?img=12",
  "Priya Verma":  "https://i.pravatar.cc/120?img=47",
  "Amit Kumar":   "https://i.pravatar.cc/120?img=15",
  "Sneha Iyer":   "https://i.pravatar.cc/120?img=45",
  "Arjun Patel":  "https://i.pravatar.cc/120?img=33",
};
const FILTER_OPTIONS = ["Today", "This Week", "This Month", "This Quarter", "This Year"];

const registrationsDataMap = {
  Today: [
    { date: "08:00", registrations: 45 },
    { date: "10:00", registrations: 82 },
    { date: "12:00", registrations: 130 },
    { date: "14:00", registrations: 175 },
    { date: "16:00", registrations: 210 },
    { date: "18:00", registrations: 258 },
    { date: "20:00", registrations: 290 },
  ],
  "This Week": [
    { date: "Mon", registrations: 320 },
    { date: "Tue", registrations: 510 },
    { date: "Wed", registrations: 680 },
    { date: "Thu", registrations: 740 },
    { date: "Fri", registrations: 900 },
    { date: "Sat", registrations: 1050 },
    { date: "Sun", registrations: 980 },
  ],
  "This Month": [
    { date: "May 20", registrations: 450 },
    { date: "May 23", registrations: 680 },
    { date: "May 27", registrations: 890 },
    { date: "May 30", registrations: 1100 },
    { date: "Jun 03", registrations: 1350 },
    { date: "Jun 06", registrations: 1580 },
    { date: "Jun 10", registrations: 1720 },
    { date: "Jun 13", registrations: 1850 },
    { date: "Jun 20", registrations: 2100 },
  ],
  "This Quarter": [
    { date: "Apr", registrations: 3200 },
    { date: "May", registrations: 4800 },
    { date: "Jun", registrations: 5600 },
  ],
  "This Year": [
    { date: "Jan", registrations: 1200 },
    { date: "Feb", registrations: 2100 },
    { date: "Mar", registrations: 3000 },
    { date: "Apr", registrations: 3800 },
    { date: "May", registrations: 5200 },
    { date: "Jun", registrations: 6100 },
  ],
};

const hackathonPopularityDataMap = {
  Today: [
    { name: "BuildTheFuture", registrations: 210 },
    { name: "DevSprint", registrations: 175 },
    { name: "AI Revolution", registrations: 320 },
    { name: "HackX 5.0", registrations: 148 },
    { name: "DataStorm", registrations: 130 },
    { name: "Code Infinity", registrations: 200 },
  ],
  "This Week": [
    { name: "AI Revolution", registrations: 980 },
    { name: "Code Infinity", registrations: 820 },
    { name: "HackX 5.0", registrations: 700 },
    { name: "DevSprint", registrations: 560 },
    { name: "DataStorm", registrations: 490 },
    { name: "BuildTheFuture", registrations: 410 },
  ],
  "This Month": [
    { name: "AI Revolution", registrations: 2450 },
    { name: "Code Infinity", registrations: 1980 },
    { name: "HackX 5.0", registrations: 1650 },
    { name: "DevSprint", registrations: 1420 },
    { name: "DataStorm", registrations: 1280 },
    { name: "BuildTheFuture", registrations: 1100 },
  ],
  "This Quarter": [
    { name: "AI Revolution", registrations: 6200 },
    { name: "Code Infinity", registrations: 5100 },
    { name: "HackX 5.0", registrations: 4300 },
    { name: "DevSprint", registrations: 3800 },
    { name: "DataStorm", registrations: 3300 },
    { name: "BuildTheFuture", registrations: 2900 },
  ],
  "This Year": [
    { name: "AI Revolution", registrations: 9800 },
    { name: "Code Infinity", registrations: 8200 },
    { name: "HackX 5.0", registrations: 7100 },
    { name: "DevSprint", registrations: 6200 },
    { name: "DataStorm", registrations: 5600 },
    { name: "BuildTheFuture", registrations: 4800 },
  ],
};

const revenueDataMap = {
  Today: [
    { name: "AI Revolution", revenue: 28000 },
    { name: "Code Infinity", revenue: 22000 },
    { name: "HackX 5.0", revenue: 18000 },
    { name: "DevSprint", revenue: 12000 },
    { name: "DataStorm", revenue: 9000 },
    { name: "BuildTheFuture", revenue: 5000 },
  ],
  "This Week": [
    { name: "AI Revolution", revenue: 145000 },
    { name: "Code Infinity", revenue: 118000 },
    { name: "HackX 5.0", revenue: 95000 },
    { name: "DevSprint", revenue: 72000 },
    { name: "DataStorm", revenue: 55000 },
    { name: "BuildTheFuture", revenue: 38000 },
  ],
  "This Month": [
    { name: "AI Revolution", revenue: 725000 },
    { name: "Code Infinity", revenue: 540000 },
    { name: "HackX 5.0", revenue: 375000 },
    { name: "DevSprint", revenue: 235000 },
    { name: "DataStorm", revenue: 180000 },
    { name: "BuildTheFuture", revenue: 95000 },
  ],
  "This Quarter": [
    { name: "AI Revolution", revenue: 1850000 },
    { name: "Code Infinity", revenue: 1400000 },
    { name: "HackX 5.0", revenue: 1050000 },
    { name: "DevSprint", revenue: 720000 },
    { name: "DataStorm", revenue: 540000 },
    { name: "BuildTheFuture", revenue: 310000 },
  ],
  "This Year": [
    { name: "AI Revolution", revenue: 3200000 },
    { name: "Code Infinity", revenue: 2500000 },
    { name: "HackX 5.0", revenue: 1900000 },
    { name: "DevSprint", revenue: 1400000 },
    { name: "DataStorm", revenue: 980000 },
    { name: "BuildTheFuture", revenue: 650000 },
  ],
};

const thisMonthDataMap = {
  Today: [
    { name: "AI Revolution", value: 42, amount: "₹28,000" },
    { name: "Code Infinity", value: 28, amount: "₹22,000" },
    { name: "HackX 5.0", value: 19, amount: "₹18,000" },
    { name: "DevSprint", value: 11, amount: "₹12,000" },
  ],
  "This Week": [
    { name: "AI Revolution", value: 34, amount: "₹1,45,000" },
    { name: "Code Infinity", value: 28, amount: "₹1,18,000" },
    { name: "HackX 5.0", value: 22, amount: "₹95,000" },
    { name: "DevSprint", value: 16, amount: "₹72,000" },
  ],
  "This Month": [
    { name: "AI Revolution", value: 39, amount: "₹7,25,000" },
    { name: "Code Infinity", value: 29, amount: "₹5,40,000" },
    { name: "HackX 5.0", value: 20, amount: "₹3,75,000" },
    { name: "DevSprint", value: 13, amount: "₹2,35,000" },
  ],
  "This Quarter": [
    { name: "AI Revolution", value: 37, amount: "₹18,50,000" },
    { name: "Code Infinity", value: 28, amount: "₹14,00,000" },
    { name: "HackX 5.0", value: 21, amount: "₹10,50,000" },
    { name: "DevSprint", value: 14, amount: "₹7,20,000" },
  ],
  "This Year": [
    { name: "AI Revolution", value: 36, amount: "₹32,00,000" },
    { name: "Code Infinity", value: 28, amount: "₹25,00,000" },
    { name: "HackX 5.0", value: 21, amount: "₹19,00,000" },
    { name: "DevSprint", value: 15, amount: "₹14,00,000" },
  ],
};

const universitiesDataMap = {
  Today: [
    { name: "IIT Bombay", participation: 48 },
    { name: "IIIT Hyderabad", participation: 41 },
    { name: "VIT Vellore", participation: 35 },
    { name: "Delhi University", participation: 29 },
    { name: "BITS Pilani", participation: 22 },
  ],
  "This Week": [
    { name: "IIT Bombay", participation: 285 },
    { name: "IIIT Hyderabad", participation: 230 },
    { name: "VIT Vellore", participation: 198 },
    { name: "Delhi University", participation: 162 },
    { name: "BITS Pilani", participation: 140 },
  ],
  "This Month": [
    { name: "IIT Bombay", participation: 1245 },
    { name: "IIIT Hyderabad", participation: 1032 },
    { name: "VIT Vellore", participation: 876 },
    { name: "Delhi University", participation: 765 },
    { name: "BITS Pilani", participation: 654 },
  ],
  "This Quarter": [
    { name: "IIT Bombay", participation: 3210 },
    { name: "IIIT Hyderabad", participation: 2750 },
    { name: "VIT Vellore", participation: 2340 },
    { name: "Delhi University", participation: 1980 },
    { name: "BITS Pilani", participation: 1720 },
  ],
  "This Year": [
    { name: "IIT Bombay", participation: 5840 },
    { name: "IIIT Hyderabad", participation: 5100 },
    { name: "VIT Vellore", participation: 4320 },
    { name: "Delhi University", participation: 3760 },
    { name: "BITS Pilani", participation: 3210 },
  ],
};

const recentRegistrationsMap = {
  Today: [
    { name: "Rahul Sharma", email: "rahul@example.com" },
    { name: "Priya Verma", email: "priya@example.com" },
    { name: "Amit Kumar", email: "amit@example.com" },
  ],
  "This Week": [
    { name: "Sneha Iyer", email: "sneha@example.com" },
    { name: "Arjun Patel", email: "arjun@example.com" },
    { name: "Rahul Sharma", email: "rahul@example.com" },
    { name: "Priya Verma", email: "priya@example.com" },
  ],
  "This Month": [
    { name: "Rahul Sharma", email: "rahul@example.com" },
    { name: "Priya Verma", email: "priya@example.com" },
    { name: "Amit Kumar", email: "amit@example.com" },
    { name: "Sneha Iyer", email: "sneha@example.com" },
    { name: "Arjun Patel", email: "arjun@example.com" },
  ],
  "This Quarter": [
    { name: "Arjun Patel", email: "arjun@example.com" },
    { name: "Amit Kumar", email: "amit@example.com" },
    { name: "Priya Verma", email: "priya@example.com" },
    { name: "Sneha Iyer", email: "sneha@example.com" },
    { name: "Rahul Sharma", email: "rahul@example.com" },
  ],
  "This Year": [
    { name: "Priya Verma", email: "priya@example.com" },
    { name: "Rahul Sharma", email: "rahul@example.com" },
    { name: "Arjun Patel", email: "arjun@example.com" },
    { name: "Amit Kumar", email: "amit@example.com" },
    { name: "Sneha Iyer", email: "sneha@example.com" },
  ],
};

const activitiesMap = {
  Today: [
    { text: "New hackathon 'BuildTheFuture' created by Admin User", time: "2 hours ago", isNew: true },
    { text: "User 'john_doe' registered for 'AI Revolution'", time: "5 hours ago", isNew: false },
  ],
  "This Week": [
    { text: "New hackathon 'BuildTheFuture' created by Admin User", time: "2 hours ago", isNew: true },
    { text: "User 'john_doe' registered for 'AI Revolution'", time: "5 hours ago", isNew: false },
    { text: "Payment received from 'priya@example.com' ₹1,499 for Code Infinity", time: "1 day ago", isNew: false },
    { text: "Results declared for 'HackX 4.0' by Admin User", time: "3 days ago", isNew: false },
  ],
  "This Month": [
    { text: "New hackathon 'BuildTheFuture' created by Admin User", time: "2 hours ago", isNew: true },
    { text: "User 'john_doe' registered for 'AI Revolution'", time: "5 hours ago", isNew: false },
    { text: "Payment received from 'priya@example.com' ₹1,499 for Code Infinity", time: "1 day ago", isNew: false },
    { text: "Results declared for 'HackX 4.0' by Admin User", time: "2 days ago", isNew: false },
  ],
  "This Quarter": [
    { text: "HackX 5.0 concluded — 1,650 participants", time: "2 weeks ago", isNew: true },
    { text: "New batch of judges onboarded for AI Revolution", time: "3 weeks ago", isNew: false },
    { text: "Payment gateway updated by Admin User", time: "1 month ago", isNew: false },
    { text: "University partnership signed with BITS Pilani", time: "1 month ago", isNew: false },
  ],
  "This Year": [
    { text: "Platform crossed 10,000 total registrations", time: "2 months ago", isNew: true },
    { text: "New sponsor onboarded for AI Revolution 2026", time: "3 months ago", isNew: false },
    { text: "Annual review completed — revenue up 22%", time: "4 months ago", isNew: false },
    { text: "New certificate module launched by Admin User", time: "5 months ago", isNew: false },
  ],
};

const statsByPeriod = {
  Today: {
    registrations: "342", registrationsGrowth: "4.2%",
    hackathons: "27", hackathonsGrowth: "0%",
    revenue: "₹94,000", revenueGrowth: "5.1%",
    universities: "156", universitiesGrowth: "0.6%",
  },
  "This Week": {
    registrations: "2,180", registrationsGrowth: "9.3%",
    hackathons: "27", hackathonsGrowth: "3.7%",
    revenue: "₹5,23,000", revenueGrowth: "11.4%",
    universities: "156", universitiesGrowth: "2.1%",
  },
  "This Month": {
    registrations: "12,842", registrationsGrowth: "18.5%",
    hackathons: "27", hackathonsGrowth: "12.0%",
    revenue: "₹18,75,000", revenueGrowth: "22.8%",
    universities: "156", universitiesGrowth: "8.7%",
  },
  "This Quarter": {
    registrations: "38,600", registrationsGrowth: "24.1%",
    hackathons: "27", hackathonsGrowth: "14.8%",
    revenue: "₹58,70,000", revenueGrowth: "28.3%",
    universities: "156", universitiesGrowth: "11.2%",
  },
  "This Year": {
    registrations: "1,05,400", registrationsGrowth: "31.7%",
    hackathons: "27", hackathonsGrowth: "20.5%",
    revenue: "₹1,56,30,000", revenueGrowth: "35.2%",
    universities: "156", universitiesGrowth: "15.4%",
  },
};

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

const ChartCard = ({ title, filter, filterOptions, onFilterChange, children, delay = 0, className = "" }) => {
  const options = filterOptions || FILTER_OPTIONS;
  const [selected, setSelected] = useState(filter || "This Month");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt) => {
    setSelected(opt);
    setOpen(false);
    onFilterChange?.(opt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] w-full min-w-0 overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#0b1b52] min-w-0 truncate">{title}</h3>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2563eb] transition-colors"
          >
            <span className="truncate">{selected}</span>
            <ChevronDown className={`h-3 w-3 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className="absolute right-0 mt-2 w-40 sm:w-44 max-w-[90vw] rounded-2xl border border-white/60 bg-white/95 backdrop-blur-xl shadow-lg p-1.5 z-20"
              >
                {options.map(opt => (
                  <li key={opt}>
                    <button
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        selected === opt
                          ? "bg-blue-50 text-[#2563eb] font-medium"
                          : "text-[#0b1b52] hover:bg-blue-50/60"
                      }`}
                    >
                      {opt}
                      {selected === opt && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
      {children(selected)}
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, growth, iconBg, iconColor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37,99,235,0.15)" }}
    className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all min-w-0 flex-1"
  >
    <div className="flex items-start gap-4 min-w-0">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0 ${iconBg}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-[#0b1b52] truncate">{value}</p>
        <div className="mt-2 flex items-center gap-1 text-xs min-w-0">
          <TrendingUp className="h-3 w-3 text-emerald-500 flex-shrink-0" />
          <span className="font-semibold text-emerald-500 whitespace-nowrap">{growth}</span>
          <span className="text-gray-500 truncate">from last period</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Navbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-wrap items-center gap-4 w-full min-w-0"
  >
    <div className="flex flex-col mr-auto min-w-0">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0b1b52] truncate">Analytics Dashboard</h1>
    </div>
    <div className="flex items-center gap-3 justify-end">
      <button type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80 shadow-md transition hover:ring-blue-300 flex-shrink-0" aria-label="Account">
        <img src="https://i.pravatar.cc/80" alt="Account" className="h-full w-full object-cover" />
      </button>
    </div>
  </motion.nav>
);

const GlobalPeriodSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/70 backdrop-blur-xl px-4 py-2 text-sm text-[#0b1b52] font-medium shadow hover:bg-white/90 transition"
      >
        <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span className="truncate">{value}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            className="absolute right-0 mt-2 w-48 max-w-[90vw] rounded-2xl border border-white/60 bg-white/95 backdrop-blur-xl shadow-lg p-1.5 z-30"
          >
            {FILTER_OPTIONS.map(opt => (
              <li key={opt}>
                <button
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                    value === opt
                      ? "bg-blue-50 text-[#2563eb] font-medium"
                      : "text-[#0b1b52] hover:bg-blue-50/60"
                  }`}
                >
                  {opt}
                  {value === opt && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = () => {
  const windowWidth = useWindowSize();
  const [globalPeriod, setGlobalPeriod] = useState("This Month");

  const stats = statsByPeriod[globalPeriod] || statsByPeriod["This Month"];

  const tickFontSize = windowWidth < 640 ? 9 : 11;
  const xAngle = windowWidth < 640 ? -45 : -30; 

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div
        className="min-h-screen bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8 min-w-0">
            <Navbar />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Users} title="Total Registrations" value={stats.registrations} growth={stats.registrationsGrowth} iconBg="bg-blue-100" iconColor="text-blue-600" index={0} />
            <StatCard icon={Trophy} title="Active Hackathons" value={stats.hackathons} growth={stats.hackathonsGrowth} iconBg="bg-purple-100" iconColor="text-purple-600" index={1} />
            <StatCard icon={DollarSign} title="Total Revenue" value={stats.revenue} growth={stats.revenueGrowth} iconBg="bg-emerald-100" iconColor="text-emerald-600" index={2} />
            <StatCard icon={Building2} title="Universities" value={stats.universities} growth={stats.universitiesGrowth} iconBg="bg-orange-100" iconColor="text-orange-600" index={3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Total Registrations Over Time" filter={globalPeriod} delay={0.2}>
              {(period) => {
                const data = registrationsDataMap[period] || registrationsDataMap["This Month"];
                return (
                  <div className="w-full min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="registrationsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: tickFontSize }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
                        <YAxis tick={{ fontSize: tickFontSize }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [`${value.toLocaleString()}`, 'Registrations']}
                        />
                        <Area type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={2} fill="url(#registrationsGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              }}
            </ChartCard>

            <ChartCard title="Hackathon Popularity" filter={globalPeriod} delay={0.25}>
              {(period) => {
                const data = hackathonPopularityDataMap[period] || hackathonPopularityDataMap["This Month"];
                return (
                  <div className="w-full min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: tickFontSize }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: tickFontSize }} tickLine={false} axisLine={false} width={100} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [`${value.toLocaleString()}`, 'Registrations']}
                        />
                        <Bar dataKey="registrations" fill="#60a5fa" radius={[0, 8, 8, 0]} barSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              }}
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Registration Fee Revenue" filter={globalPeriod} delay={0.3}>
              {(period) => {
                const data = revenueDataMap[period] || revenueDataMap["This Month"];
                return (
                  <div className="w-full min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: tickFontSize, angle: xAngle, textAnchor: 'end', dy: 5 }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} height={70} />
                        <YAxis tick={{ fontSize: tickFontSize }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" radius={[8, 8, 0, 0]} barSize={40}>
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              }}
            </ChartCard>

            <ChartCard title="Revenue Distribution" filter={globalPeriod} delay={0.35}>
              {(period) => {
                const data = thisMonthDataMap[period] || thisMonthDataMap["This Month"];
                return (
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 w-full min-w-0 overflow-hidden">
                    <div className="w-full max-w-[220px] mx-auto sm:mx-0">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value, name, props) => [`${value}%`, props.payload.name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2 min-w-0 w-full">
                      {data.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                            <span className="text-sm text-gray-700 truncate">{item.name}</span>
                          </div>
                          <div className="flex gap-4 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                            <span className="text-sm text-gray-500">{item.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Top Universities by Participation" filter={globalPeriod} delay={0.4}>
              {(period) => {
                const data = universitiesDataMap[period] || universitiesDataMap["This Month"];
                return (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[480px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-xs font-semibold text-gray-400">University</th>
                          <th className="text-right py-3 text-xs font-semibold text-gray-400">Participation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((uni, idx) => (
                          <tr key={idx} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                            <td className="py-3 text-sm font-medium text-gray-800 truncate">{uni.name}</td>
                            <td className="py-3 text-sm text-right text-gray-600">{uni.participation.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }}
            </ChartCard>

            <ChartCard title="Recent Registrations" filter={globalPeriod} delay={0.45}>
              {(period) => {
                const data = recentRegistrationsMap[period] || recentRegistrationsMap["This Month"];
                return (
                  <div className="space-y-3">
                    {data.map((user, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/30 transition-colors min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden ring-2 ring-white shadow flex-shrink-0">
                          {USER_AVATARS[user.name] ? (
                            <img
                              src={USER_AVATARS[user.name]}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                );
              }}
            </ChartCard>
          </div>

          <ChartCard title="Platform Activity" filter={globalPeriod} delay={0.5}>
            {(period) => {
              const data = activitiesMap[period] || activitiesMap["This Month"];
              return (
                <div className="space-y-3">
                  {data.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/20 transition-colors border-b border-gray-50 last:border-0 min-w-0">
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${activity.isNew ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 break-words">{activity.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </ChartCard>
        </div>
      </div>
    </>
  );
};

export default Dashboard;