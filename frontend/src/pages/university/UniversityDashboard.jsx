import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, GraduationCap, ClipboardList, Clock, 
  ExternalLink, LogOut, Activity, Star, ChevronDown, Check,
  X, AlertTriangle, Sparkles, Building2, Calendar
} from "lucide-react";
import { universityService } from "../../services/universityService";

const fontStack = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" };

export default function UniversityDashboard() {
  const navigate = useNavigate();

  // State
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterHackathon, setFilterHackathon] = useState("all");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Load profile and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, studentsRes] = await Promise.all([
          universityService.getMe(),
          universityService.getMyStudents()
        ]);

        setProfile(profileRes.data?.data || profileRes.data);
        
        const rawStudents = studentsRes.data?.data?.students || studentsRes.data?.students || [];
        setStudents(rawStudents);
      } catch (err) {
        
        showToast("Failed to load university portal data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute unique graduation years for filter
  const graduationYears = useMemo(() => {
    const years = new Set(students.map(s => s.graduationYear).filter(Boolean));
    return Array.from(years).sort();
  }, [students]);

  // Compute unique hackathons for filter
  const uniqueHackathons = useMemo(() => {
    const hacks = [];
    const seen = new Set();
    students.forEach(student => {
      student.hackathons?.forEach(h => {
        const id = h._id || h.slug;
        if (!seen.has(id)) {
          seen.add(id);
          hacks.push(h);
        }
      });
    });
    return hacks;
  }, [students]);

  // Compute statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    
    let totalParticipations = 0;
    students.forEach(s => {
      totalParticipations += s.hackathons?.length || 0;
    });

    const uniqueActiveHacks = new Set();
    students.forEach(s => {
      s.hackathons?.forEach(h => {
        uniqueActiveHacks.add(h._id || h.slug);
      });
    });

    return {
      totalStudents,
      totalParticipations,
      uniqueHacksJoined: uniqueActiveHacks.size
    };
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesYear = filterYear === "all" || String(student.graduationYear) === String(filterYear);

      const matchesHack = filterHackathon === "all" || student.hackathons?.some(h => (h._id === filterHackathon || h.slug === filterHackathon));

      return matchesSearch && matchesYear && matchesHack;
    });
  }, [students, searchQuery, filterYear, filterHackathon]);

  const initials = profile?.collegeOrUniversity?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "UN";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={fontStack}>
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-semibold animate-pulse">Loading University Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] text-[#0b1b52] flex flex-col" style={fontStack}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-indigo-950 flex items-center gap-1.5">
              Athenura <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">University Portal</span>
            </h1>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-slate-100/80 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {initials}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">
              {profile?.collegeOrUniversity || "University Admin"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {profileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1.5"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-xs text-slate-400">Account Type</p>
                  <p className="text-sm font-bold text-slate-700 truncate">University Representative</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{profile?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* University Profile Info Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Partner Institution
              </span>
              <h2 className="text-2xl font-black text-indigo-950 mt-1.5 mb-1">{profile?.collegeOrUniversity}</h2>
              <p className="text-xs text-slate-400 font-medium">Joined Athenura Network on {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 border border-indigo-100/40 px-3.5 py-2 rounded-2xl">
            <Sparkles className="w-4 h-4" /> Real-time Student Registration Track
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Students</p>
              <h3 className="text-2xl font-black text-indigo-950">{stats.totalStudents}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Participations</p>
              <h3 className="text-2xl font-black text-indigo-950">{stats.totalParticipations}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unique Hackathons Joined</p>
              <h3 className="text-2xl font-black text-indigo-950">{stats.uniqueHacksJoined}</h3>
            </div>
          </div>
        </div>

        {/* Student Management workspace */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px] max-w-sm">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search students name or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium transition"
                />
              </div>

              {/* Year Filter */}
              <div className="relative">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="all">All Grad Years</option>
                  {graduationYears.map(y => (
                    <option key={y} value={y}>Class of {y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Hackathon Filter */}
              <div className="relative">
                <select
                  value={filterHackathon}
                  onChange={(e) => setFilterHackathon(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-bold outline-none focus:border-indigo-500 transition cursor-pointer max-w-[200px]"
                >
                  <option value="all">All Hackathons</option>
                  {uniqueHackathons.map(h => (
                    <option key={h._id || h.slug} value={h._id || h.slug}>{h.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-xl">
              Showing {filteredStudents.length} of {students.length} Students
            </span>
          </div>

          {/* Students Table / Grid */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl py-16 text-center shadow-sm">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h4 className="font-extrabold text-indigo-950 mb-1">No matching students found</h4>
              <p className="text-slate-400 text-xs font-medium">Verify filters or broaden search queries.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      <th className="px-6 py-4">Student Details</th>
                      <th className="px-6 py-4">Class Year</th>
                      <th className="px-6 py-4">Primary Skills</th>
                      <th className="px-6 py-4">Participations</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-indigo-950">{student.fullName}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{student.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-500">
                          Class of {student.graduationYear || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {student.skills?.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/30">
                                {skill}
                              </span>
                            ))}
                            {student.skills?.length > 3 && (
                              <span className="text-[10px] font-semibold text-slate-400 px-1">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3.5 h-3.5" /> {student.hackathons?.length || 0} Joined
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedStudent(expandedStudent?._id === student._id ? null : student)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-transparent transition"
                          >
                            {expandedStudent?._id === student._id ? "Close Details" : "View Details"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Expanded Student details modal */}
      <AnimatePresence>
        {expandedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setExpandedStudent(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-2xl mx-4 border border-white/60 flex flex-col gap-6"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0b1b52]">{expandedStudent.fullName}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{expandedStudent.email} • Class of {expandedStudent.graduationYear}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedStudent(null)}
                  className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Skills list */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills & Expertise</h4>
                {expandedStudent.skills && expandedStudent.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {expandedStudent.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs font-bold px-3 py-1 bg-slate-50 border border-slate-200/50 text-slate-700 rounded-xl">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs font-medium">No skills documented.</p>
                )}
              </div>

              {/* Registered Hackathons list */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Registered Hackathons</h4>
                {expandedStudent.hackathons && expandedStudent.hackathons.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {expandedStudent.hackathons.map((hack) => (
                      <div key={hack._id || hack.slug} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-indigo-950 text-sm">{hack.title}</p>
                          <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-400 font-semibold">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Start: {new Date(hack.startDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> End: {new Date(hack.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <a
                          href={`/hackathon/${hack.slug || hack._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start sm:self-auto flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-transparent px-3 py-1.5 rounded-xl transition"
                        >
                          Details <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs font-medium">This student has not joined any hackathons yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

// Toast helper component
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
      {type === "info" && <Users className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}
