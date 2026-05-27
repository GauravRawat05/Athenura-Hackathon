import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, User, Users, ClipboardList, Award, Trophy,
  ChevronDown, CheckCircle2, Clock, Star, Sparkles,
  X, Check, AlertTriangle, FileText, Activity, LogOut,
  ExternalLink, Monitor, Play, FileDown, Edit3
} from "lucide-react";
import { judgingService } from "../../services/judgingService";
import { hackathonService } from "../../services/hackathonService";

const styleTag = document.createElement('style');
styleTag.textContent = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`;
document.head.appendChild(styleTag);

const fontStack = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" };

export default function JudgeDashboard() {
  const navigate = useNavigate();

  // State Variables
  const [assignments, setAssignments] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [hackathonDetails, setHackathonDetails] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, scored
  const [activeSubmission, setActiveSubmission] = useState(null);
  
  // Evaluation Scoring State
  const [criteriaScores, setCriteriaScores] = useState({}); // { criterionName: number }
  const [feedback, setFeedback] = useState("");
  const [submittingEvaluation, setSubmittingEvaluation] = useState(false);
  
  // UI Panels / dropdowns
  const [hackDropdown, setHackDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 1. Fetch Judge Assignments on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await judgingService.getAssignments();
        const data = res.data?.data || res.data || [];
        setAssignments(data);
        
        if (data.length > 0) {
          // Select first hackathon by default
          setSelectedHackathon(data[0].hackathonId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        
        showToast("Failed to load assigned hackathons", "error");
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // 2. Fetch submissions & hackathon details when selected hackathon changes
  useEffect(() => {
    if (!selectedHackathon) return;

    const fetchHackathonData = async () => {
      try {
        setSubLoading(true);
        // Fetch full hackathon details for judging criteria
        const hackRes = await hackathonService.getHackathonById(selectedHackathon._id || selectedHackathon);
        setHackathonDetails(hackRes.data?.data || hackRes.data);

        // Fetch submissions for judge
        const subRes = await judgingService.getSubmissions(selectedHackathon._id || selectedHackathon);
        setSubmissions(subRes.data?.data || subRes.data || []);
      } catch (err) {
        
        showToast(err.response?.data?.message || "Failed to load submissions", "error");
      } finally {
        setSubLoading(false);
        setLoading(false);
      }
    };

    fetchHackathonData();
  }, [selectedHackathon]);

  // Statistics Computations
  const stats = useMemo(() => {
    const total = submissions.length;
    const scored = submissions.filter(s => s.scored).length;
    const pending = total - scored;
    const percentage = total > 0 ? Math.round((scored / total) * 100) : 0;
    return { total, scored, pending, percentage };
  }, [submissions]);

  // Filter & Search submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = sub.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        sub.teamId?.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.userId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = filterStatus === "all" ||
        (filterStatus === "scored" && sub.scored) ||
        (filterStatus === "pending" && !sub.scored);
        
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, filterStatus]);

  // Setup/initialize evaluation modal
  const handleOpenEvaluate = (sub) => {
    setActiveSubmission(sub);
    
    // Determine existing scores if any
    const existing = sub.existingScore;
    const initialScores = {};
    
    // Initialize judging criteria
    const criteriaList = hackathonDetails?.judgingCriteria || [];
    criteriaList.forEach(crit => {
      const match = existing?.criterionScores?.find(cs => cs.criterionName === crit.name);
      initialScores[crit.name] = match ? match.score : 5; // Default score to 5 out of 10
    });
    
    setCriteriaScores(initialScores);
    setFeedback(existing?.feedback || "");
  };

  // Live Score Calculator
  const totalScoreLive = useMemo(() => {
    if (!hackathonDetails?.judgingCriteria) return 0;
    let sum = 0;
    hackathonDetails.judgingCriteria.forEach(crit => {
      const score = criteriaScores[crit.name] || 0;
      sum += (score * crit.weight) / 10;
    });
    return Math.round(sum * 100) / 100;
  }, [criteriaScores, hackathonDetails]);

  // Handle Score Submission / Update
  const handleSubmitEvaluation = async () => {
    try {
      setSubmittingEvaluation(true);
      const payload = {
        criterionScores: Object.keys(criteriaScores).map(name => ({
          criterionName: name,
          score: Number(criteriaScores[name])
        })),
        feedback
      };

      const hackId = selectedHackathon._id || selectedHackathon;

      if (activeSubmission.scored && activeSubmission.scoreId) {
        // Update existing score
        await judgingService.updateScore(activeSubmission.scoreId, payload);
        showToast("Evaluation updated successfully", "success");
      } else {
        // Create new score
        await judgingService.submitScore(activeSubmission._id, hackId, payload);
        showToast("Evaluation submitted successfully", "success");
      }

      // Close modal & Refresh submissions list
      setActiveSubmission(null);
      
      // Re-fetch submissions
      const subRes = await judgingService.getSubmissions(hackId);
      setSubmissions(subRes.data?.data || subRes.data || []);

    } catch (err) {
      
      showToast(err.response?.data?.message || "Failed to save evaluation", "error");
    } finally {
      setSubmittingEvaluation(false);
    }
  };

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : { fullName: "Expert Judge", email: "judge@athenura.com" };
  const initials = currentUser.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "JD";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={fontStack}>
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Judge Workspace...</p>
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
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-indigo-950 flex items-center gap-1.5">
              Athenura <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">Judge Portal</span>
            </h1>
          </div>
        </div>

        {/* Dropdown for Hackathons Selector */}
        <div className="flex items-center gap-4">
          {assignments.length > 0 && (
            <div className="relative">
              <button 
                onClick={() => setHackDropdown(!hackDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm text-sm font-semibold transition"
              >
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <span className="max-w-[200px] truncate">{selectedHackathon?.title || "Select Hackathon"}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${hackDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {hackDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2"
                  >
                    {assignments.map((asg) => (
                      <button
                        key={asg._id}
                        onClick={() => {
                          setSelectedHackathon(asg.hackathonId);
                          setHackDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${
                          selectedHackathon?._id === asg.hackathonId?._id
                            ? "bg-indigo-50 text-indigo-700"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {asg.hackathonId?.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-slate-100/80 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {initials}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block">{currentUser.fullName}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {profileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1.5"
                >
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{currentUser.email}</p>
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
        </div>
      </header>

      {assignments.length === 0 ? (
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
            <ClipboardList className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-indigo-950 mb-2">No assigned hackathons</h2>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            You are not currently assigned to evaluate submissions for any hackathons. Please check back later or contact the administrator.
          </p>
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
          {/* Dashboard Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Active Hackathon Workspace</span>
              <h2 className="text-2xl font-black text-indigo-950 mt-2">{selectedHackathon?.title}</h2>
              <div className="flex items-center gap-6 mt-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> End Date: {new Date(selectedHackathon?.endDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" /> Submissions: {stats.total}</span>
              </div>
            </div>
            
            {/* Dynamic circular summary */}
            <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                {stats.percentage}%
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scoring Progress</p>
                <h4 className="text-base font-extrabold text-slate-700">{stats.scored} / {stats.total} Evaluated</h4>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Submissions</p>
                <h3 className="text-2xl font-black text-indigo-950">{stats.total}</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluated</p>
                <h3 className="text-2xl font-black text-indigo-950">{stats.scored}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
                <h3 className="text-2xl font-black text-indigo-950">{stats.pending}</h3>
              </div>
            </div>
          </div>

          {/* Main workspace section: Filter and List */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-auto">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
                    filterStatus === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  All Projects
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
                    filterStatus === "pending" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus("scored")}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
                    filterStatus === "scored" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  Evaluated ({stats.scored})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search project title or team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium transition"
                />
              </div>
            </div>

            {/* Submissions Cards Grid */}
            {subLoading ? (
              <div className="py-20 flex items-center justify-center">
                <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl py-16 text-center shadow-sm">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h4 className="font-extrabold text-indigo-950 mb-1">No projects match criteria</h4>
                <p className="text-slate-400 text-xs font-medium">Try updating filters or adjusting search queries.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubmissions.map((sub, i) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-200/50 hover:shadow-indigo-900/[0.02] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {sub.teamId?.teamName ? "Team Project" : "Solo Submission"}
                        </span>
                        
                        {sub.scored ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Scored ({sub.existingScore?.totalScore})
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </div>

                      <h3 className="font-black text-indigo-950 text-lg leading-tight mb-2 truncate">
                        {sub.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-1">
                        By: <span className="text-slate-600">{sub.teamId?.teamName || sub.userId?.fullName}</span>
                      </p>

                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-5 font-medium">
                        {sub.description}
                      </p>

                      {/* Tech stack badges */}
                      {sub.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {sub.techStack.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50/50 text-indigo-600 border border-indigo-100/30">
                              {tech}
                            </span>
                          ))}
                          {sub.techStack.length > 3 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">
                              +{sub.techStack.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEvaluate(sub)}
                        className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                          sub.scored 
                            ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100" 
                            : "bg-indigo-600 text-white border-transparent hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/10"
                        }`}
                      >
                        {sub.scored ? <Edit3 className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                        {sub.scored ? "Edit Evaluation" : "Evaluate Project"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Slide-out evaluation & scoring Drawer */}
      <AnimatePresence>
        {activeSubmission && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSubmission(null)}
              className="fixed inset-0 z-50 bg-black"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0b1b52] text-lg">Project Evaluation</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    {activeSubmission.scored ? "Reviewing & updating submitted scores" : "Submit grading feedback"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                
                {/* Project Overview Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">Submission Details</span>
                  <h4 className="font-black text-indigo-950 text-xl mt-2 mb-2 leading-tight">{activeSubmission.title}</h4>
                  
                  <p className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-1.5">
                    Team: <span className="text-indigo-600 font-extrabold">{activeSubmission.teamId?.teamName || activeSubmission.userId?.fullName}</span>
                  </p>
                  
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-5">
                    {activeSubmission.description}
                  </p>

                  {/* Links / Deliverables */}
                  <div className="flex flex-wrap gap-3">
                    {activeSubmission.repoUrl && (
                      <a
                        href={activeSubmission.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-black transition"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> Code Repo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {activeSubmission.demoUrl && (
                      <a
                        href={activeSubmission.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                      >
                        <Monitor className="w-3.5 h-3.5" /> Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Rubric Evaluation Sliders */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h5 className="font-extrabold text-indigo-950 text-sm flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Rubric Scoring</h5>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Weighted Score</p>
                      <h4 className="font-black text-indigo-600 text-xl">{totalScoreLive} / 10</h4>
                    </div>
                  </div>

                  {hackathonDetails?.judgingCriteria?.map((crit) => {
                    const currentVal = criteriaScores[crit.name] || 0;
                    return (
                      <div key={crit.name} className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-indigo-950 flex items-center gap-1.5">
                            {crit.name} 
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold border border-slate-200/40">
                              Weight: {crit.weight}%
                            </span>
                          </span>
                          <span className="text-indigo-600 text-sm font-black">{currentVal} / 10</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={currentVal}
                            onChange={(e) => setCriteriaScores({
                              ...criteriaScores,
                              [crit.name]: Number(e.target.value)
                            })}
                            className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Judge's Written Feedback */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col gap-3">
                  <label className="font-extrabold text-indigo-950 text-xs flex items-center gap-1.5">
                    Written Feedback (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed suggestions, weaknesses or strong aspects of the submission..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500 font-medium transition"
                  />
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shadow-inner">
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  disabled={submittingEvaluation}
                  onClick={handleSubmitEvaluation}
                  className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 hover:shadow-lg hover:shadow-indigo-600/10 disabled:opacity-50"
                >
                  {submittingEvaluation ? (
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {activeSubmission.scored ? "Update Evaluation" : "Submit Evaluation"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Toast Message */}
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
      {type === "info" && <Bell className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}
