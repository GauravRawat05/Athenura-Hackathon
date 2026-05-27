import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Filter, Calendar, Users, Trophy, ExternalLink,
  ChevronDown, X, Search, BarChart3, TrendingUp, Clock,
  ArrowLeft, Check, AlertTriangle, Sparkles, Building2, Eye
} from "lucide-react";
import { universityService } from "../../services/universityService";

const fontStack = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" };

export default function UniversityReports() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("participation"); // participation, performance
  
  const [filters, setFilters] = useState({
    year: "all",
    hackathon: "all",
    gender: "all"
  });

  const [yearDropdown, setYearDropdown] = useState(false);
  const [hackathonDropdown, setHackathonDropdown] = useState(false);
  const [genderDropdown, setGenderDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load students
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsRes = await universityService.getMyStudents();
        setStudents(studentsRes.data?.data?.students || studentsRes.data?.students || []);
      } catch (err) {
        
        showToast("Failed to load reports data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Unique years for filters
  const uniqueYears = useMemo(() => {
    const years = new Set(students.map(s => s.graduationYear).filter(Boolean));
    return Array.from(years).sort((a, b) => a - b);
  }, [students]);

  // Unique hackathons
  const uniqueHackathons = useMemo(() => {
    const hacks = [];
    const seen = new Set();
    students.forEach(s => {
      s.hackathons?.forEach(h => {
        const id = h._id || h.slug;
        if (!seen.has(id)) {
          seen.add(id);
          hacks.push(h);
        }
      });
    });
    return hacks;
  }, [students]);

  // Filtered students for display
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesYear = filters.year === "all" || String(student.graduationYear) === String(filters.year);
      const matchesHack = filters.hackathon === "all" || student.hackathons?.some(h => (h._id === filters.hackathon || h.slug === filters.hackathon));
      const matchesGender = filters.gender === "all" || student.gender?.toLowerCase() === filters.gender.toLowerCase();
      return matchesYear && matchesHack && matchesGender;
    });
  }, [students, filters]);

  // Hackathon stats
  const hackathonStats = useMemo(() => {
    const data = {};
    students.forEach(s => {
      s.hackathons?.forEach(h => {
        const name = h.title || "Unknown Hackathon";
        data[name] = (data[name] || 0) + 1;
      });
    });
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    return { data, total };
  }, [students]);

  const handleExport = (type) => {
    let csvContent = "";
    
    if (type === "participation") {
      csvContent = "Data_Export_Participation_" + new Date().toISOString().split('T')[0] + ".csv";
      let csv = ["Student Name,Email,Grad Year,Total Participations,Skills\n"];
      filteredStudents.forEach(s => {
        const line = [
          `"${s.fullName}"`,
          `"${s.email}"`,
          s.graduationYear || "-",
          s.hackathons?.length || 0,
          `"${s.skills?.join(', ') || ''}"`
        ].join(",");
        csv.push(line);
      });
      const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", csvContent);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    
    if (type === "performance") {
      csvContent = "Data_Export_Performance_" + new Date().toISOString().split('T')[0] + ".csv";
      let csv = ["Student Name,Email,Grad Year,Hackathon Title,Timeline\n"];
      filteredStudents.forEach(s => {
        s.hackathons?.forEach(h => {
          const line = [
            `"${s.fullName}"`,
            `"${s.email}"`,
            s.graduationYear || "-",
            `"${h.title}"`,
            `"${new Date(h.startDate).toLocaleDateString()} to ${new Date(h.endDate).toLocaleDateString()}"`
          ].join(",");
          csv.push(line);
        });
      });
      const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", csvContent);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    
    showToast("Report exported successfully", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={fontStack}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-semibold animate-pulse">Loading Reports Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] text-[#0b1b52] p-6 md:p-10 flex flex-col" style={fontStack}>
      {/* Header and Back navigation */}
      <header className="max-w-7xl w-full mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate("/university")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50">
          Analytics Reports Workspace
        </span>
      </header>

      <main className="max-w-7xl w-full mx-auto flex flex-col gap-8">
        {/* Workspace Title Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-indigo-950">University Analytical Reports</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Export, filter and analyze student participation records</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport(reportType)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
            >
              <Download className="w-4 h-4" /> Export Report CSV
            </button>
          </div>
        </div>

        {/* Report Selection Tabs and Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setReportType("participation")}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
                reportType === "participation" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Participation Overview
            </button>
            <button
              onClick={() => setReportType("performance")}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
                reportType === "performance" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Enrollment Timeline
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Year Selector */}
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-2 text-xs font-bold outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Grad Years</option>
                {uniqueYears.map(y => (
                  <option key={y} value={y}>Class of {y}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Hackathon Selector */}
            <div className="relative">
              <select
                value={filters.hackathon}
                onChange={(e) => setFilters({...filters, hackathon: e.target.value})}
                className="appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-2 text-xs font-bold outline-none focus:border-indigo-500 cursor-pointer max-w-[200px]"
              >
                <option value="all">All Hackathons</option>
                {uniqueHackathons.map(h => (
                  <option key={h._id || h.slug} value={h._id || h.slug}>{h.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Cards and Distribution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Summary Statistics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Cohort Snapshot</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Filtered Students</p>
                <h4 className="text-2xl font-black text-indigo-950 mt-1">{filteredStudents.length}</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Active Participations</p>
                <h4 className="text-2xl font-black text-indigo-600 mt-1">
                  {filteredStudents.reduce((sum, s) => sum + (s.hackathons?.length || 0), 0)}
                </h4>
              </div>
            </div>
          </div>

          {/* Card 2: Distributions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Top Enrolled Hackathons</h3>
            <div className="flex flex-col gap-2">
              {Object.entries(hackathonStats.data).slice(0, 3).map(([name, count]) => {
                const pct = hackathonStats.total > 0 ? Math.round((count / hackathonStats.total) * 100) : 0;
                return (
                  <div key={name} className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 truncate max-w-[200px]">{name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{count} registrations</span>
                      <span className="font-bold text-indigo-600">{pct}%</span>
                    </div>
                  </div>
                );
              })}
              {Object.keys(hackathonStats.data).length === 0 && (
                <p className="text-xs text-slate-400">No participation records found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6">
          <h3 className="font-black text-indigo-950 text-base mb-4">Exportable Records</h3>
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-slate-400 text-xs font-semibold">No records match chosen filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Graduation Year</th>
                    <th className="px-4 py-3">Registered Hackathons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3 font-bold text-indigo-950">{student.fullName}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3 text-slate-500">Class of {student.graduationYear || "N/A"}</td>
                      <td className="px-4 py-3 text-indigo-600">
                        {student.hackathons?.map(h => h.title).join(", ") || "None"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Global Toast */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Toast component
function Toast({ message, type, onClose }) {
  const bgColors = {
    success: "bg-emerald-500",
    error: "bg-rose-500",
    info: "bg-blue-500",
    warning: "bg-amber-500"
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-2xl ${bgColors[type] || bgColors.info}`}
    >
      {type === "success" && <Check className="w-4 h-4" />}
      {type === "error" && <X className="w-4 h-4" />}
      {type === "warning" && <AlertTriangle className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}
