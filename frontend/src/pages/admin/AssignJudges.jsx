import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, User, Users, ClipboardList, Award, Trophy,
  UserPlus, ChevronDown, Pencil, Plus, ChevronLeft, ChevronRight,
  Briefcase, GraduationCap, CheckCircle2, Clock, Star, Sparkles,
  Scale, Zap, X, Check, AlertTriangle, BarChart2, Settings,
  LogOut, FileText, Activity, Lock, Unlock
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { judgingService } from "../../services/judgingService";
import { hackathonService } from "../../services/hackathonService";

const styleTag = document.createElement('style');
styleTag.textContent = '.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}';
document.head.appendChild(styleTag);

const fontStack = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" };

const ALL_TEAMS = [
  { code: "AR", name: "AI Revolution", desc: "Revolutionizing AI for a better future", color: "from-violet-500 to-purple-600", judges: ["Dr. Neha Kapoor", "Prof. Amit Verma"], pendingScores: false },
  { code: "CI", name: "Code Infinity", desc: "Infinite possibilities in code", color: "from-sky-500 to-blue-600", judges: ["Dr. Vikram Singh", "Ms. Ananya Iyer"], pendingScores: true },
  { code: "HX", name: "HackX 5.0", desc: "The next generation hackathon", color: "from-amber-500 to-orange-600", judges: ["Dr. Pooja Nair", "Mr. Rohan Das"], pendingScores: true },
  { code: "DS", name: "DevSprint", desc: "Sprint into innovation", color: "from-emerald-500 to-teal-600", judges: ["Dr. Arjun Patel", "Ms. Priya Mehta"], pendingScores: false },
  { code: "DT", name: "DataStorm", desc: "Unleash the power of data", color: "from-rose-500 to-pink-600", judges: ["Dr. Manish Gupta", "Ms. Kavya Reddy"], pendingScores: false },
  { code: "ML", name: "MindLab", desc: "Explore the frontiers of the mind", color: "from-fuchsia-500 to-pink-600", judges: ["Dr. Aryan Roy", "Ms. Sana Sheikh"], pendingScores: false },
  { code: "QC", name: "QuantumCore", desc: "Quantum leaps in technology", color: "from-cyan-500 to-sky-600", judges: ["Dr. Preethi Nair", "Mr. Akash Kumar"], pendingScores: false },
  { code: "BR", name: "ByteRush", desc: "Rushing bytes to the future", color: "from-lime-500 to-green-600", judges: ["Dr. Sameer Dutta", "Ms. Trisha Roy"], pendingScores: false },
  { code: "NX", name: "NexGen", desc: "Next generation solutions", color: "from-orange-500 to-red-600", judges: ["Dr. Vijay Menon", "Ms. Deepa Rao"], pendingScores: false },
  { code: "IC", name: "IdeaCore", desc: "Where ideas become reality", color: "from-teal-500 to-emerald-600", judges: ["Dr. Nidhi Saxena", "Mr. Rahul Jain"], pendingScores: false },
  { code: "SP", name: "SparkPath", desc: "Igniting the path to innovation", color: "from-yellow-500 to-amber-600", judges: ["Dr. Kavita Pillai", "Ms. Meera Singh"], pendingScores: false },
  { code: "FX", name: "FluxTech", desc: "Embracing change through tech", color: "from-indigo-500 to-violet-600", judges: ["Dr. Sunil Patil", "Mr. Rajan Nair"], pendingScores: false },
  { code: "ZN", name: "ZenithLabs", desc: "Reaching the zenith of innovation", color: "from-pink-500 to-rose-600", judges: ["Dr. Arun Sharma", "Ms. Priya Rao"], pendingScores: false },
  { code: "OM", name: "OmniCode", desc: "Code for everyone, everywhere", color: "from-blue-500 to-indigo-600", judges: ["Dr. Sunita Verma", "Mr. Kiran Das"], pendingScores: false },
  { code: "PW", name: "PowerPulse", desc: "Pulsing with powerful solutions", color: "from-red-500 to-rose-600", judges: ["Dr. Rajesh Iyer", "Ms. Swati Kulkarni"], pendingScores: false },
  { code: "LM", name: "LumiTech", desc: "Illuminating the future with tech", color: "from-amber-400 to-yellow-500", judges: ["Dr. Prakash Nair", "Ms. Deepa Menon"], pendingScores: false },
  { code: "SB", name: "SkyBound", desc: "Reaching new heights in tech", color: "from-sky-400 to-cyan-500", judges: ["Dr. Vivek Sharma", "Ms. Jaya Kapoor"], pendingScores: false },
  { code: "EC", name: "EchoCraft", desc: "Crafting echoes of the future", color: "from-green-500 to-teal-600", judges: ["Dr. Pooja Das", "Mr. Aman Joshi"], pendingScores: false },
  { code: "TG", name: "TurboGrid", desc: "Powering ahead at warp speed", color: "from-violet-400 to-fuchsia-500", judges: ["Dr. Sanjay Pillai", "Ms. Anjali Gupta"], pendingScores: false },
  { code: "XP", name: "XploreTech", desc: "Exploring new horizons in tech", color: "from-rose-400 to-pink-500", judges: ["Dr. Bhavna Mehta", "Mr. Suresh Nair"], pendingScores: false },
];

const HACKATHONS = [
  "AI Revolution 2026",
  "TechFest 2026",
  "CodeJam 2026",
  "InnovateSphere 2026",
  "DataQuest 2026",
];

const ALL_JUDGES = [
  { initials: "NK", name: "Dr. Neha Kapoor", email: "neha.kapoor@iitb.ac.in", expertise: "AI/ML, Data Science", affiliation: "IIT Bombay", total: 18, completed: 15, pending: 3, avg: "8.7 / 10", active: true, color: "from-pink-400 to-purple-500", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { initials: "AV", name: "Prof. Amit Verma", email: "amit.verma@iitd.ac.in", expertise: "Computer Vision", affiliation: "IIT Delhi", total: 20, completed: 18, pending: 2, avg: "9.1 / 10", active: true, color: "from-blue-400 to-indigo-500", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { initials: "RS", name: "Ms. Riya Shah", email: "riya.shah@nitk.ac.in", expertise: "NLP, Chatbots", affiliation: "NIT Karnataka", total: 12, completed: 10, pending: 2, avg: "7.9 / 10", active: false, color: "from-emerald-400 to-teal-500", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { initials: "VS", name: "Dr. Vikram Singh", email: "vikram.singh@bits.ac.in", expertise: "Blockchain, Web3", affiliation: "BITS Pilani", total: 15, completed: 12, pending: 3, avg: "8.3 / 10", active: true, color: "from-amber-400 to-orange-500", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
  { initials: "AI", name: "Ms. Ananya Iyer", email: "ananya.iyer@vit.ac.in", expertise: "IoT, Embedded", affiliation: "VIT Vellore", total: 10, completed: 9, pending: 1, avg: "8.0 / 10", active: true, color: "from-rose-400 to-pink-500", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { initials: "KM", name: "Prof. Karan Mehta", email: "karan.mehta@iiit.ac.in", expertise: "Cybersecurity", affiliation: "IIIT Hyderabad", total: 14, completed: 11, pending: 3, avg: "8.5 / 10", active: true, color: "from-cyan-400 to-blue-500", avatar: "https://randomuser.me/api/portraits/men/56.jpg" },
  { initials: "PN", name: "Dr. Pooja Nair", email: "pooja.nair@iitm.ac.in", expertise: "Cloud Computing", affiliation: "IIT Madras", total: 16, completed: 14, pending: 2, avg: "8.9 / 10", active: true, color: "from-green-400 to-emerald-500", avatar: "https://randomuser.me/api/portraits/women/90.jpg" },
];

const donutData = [
  { name: "Completed", value: 72, color: "#22c55e" },
  { name: "Pending", value: 28, color: "#f59e0b" },
];

const TABS = ["Judge Assignment", "Score Review", "Tie Resolution", "Winners Declaration", "Evaluation Summary"];

const QUICK_ACTIONS = [
  { icon: Sparkles, title: "Auto Assign Judges", sub: "Distribute teams evenly", bg: "bg-blue-50", color: "text-blue-600", action: "autoAssign" },
  { icon: Scale, title: "Balance Workload", sub: "Optimize judge load", bg: "bg-emerald-50", color: "text-emerald-600", action: "balance" },
  { icon: Zap, title: "Reassign Judges", sub: "Change assignments", bg: "bg-amber-50", color: "text-amber-600", action: "reassign" },
  { icon: Bell, title: "Notify Judges", sub: "Send reminders", bg: "bg-purple-50", color: "text-purple-600", action: "notify" },
];

function GlassCard({ children, className = "" }) {
  return (
    <div className={"bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] " + className}>
      {children}
    </div>
  );
}

function JudgeBadge({ name, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 whitespace-nowrap">
      {name}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:text-red-500 transition">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

function Toast({ message, type, onClose }) {
  const colors = { success: "bg-emerald-500", error: "bg-rose-500", info: "bg-blue-500", warning: "bg-amber-500" };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-medium shadow-2xl ${colors[type]}`}>
      {type === "success" && <Check className="w-4 h-4" />}
      {type === "error" && <X className="w-4 h-4" />}
      {type === "warning" && <AlertTriangle className="w-4 h-4" />}
      {type === "info" && <Bell className="w-4 h-4" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 border border-white/60"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0b1b52]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { id: routeHackathonId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [hackathonsList, setHackathonsList] = useState([]);
  const [activeHackathon, setActiveHackathon] = useState(null);
  const [hackDropdown, setHackDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [allJudges, setAllJudges] = useState([]);
  const [assignedJudges, setAssignedJudges] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [notifPanel, setNotifPanel] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newJudgeName, setNewJudgeName] = useState("");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [addJudgeTeam, setAddJudgeTeam] = useState(null);
  const [tieWinner, setTieWinner] = useState(null);
  const [winners, setWinners] = useState([]);
  const [scores, setScores] = useState({});
  const [manageSelectedJudgeIds, setManageSelectedJudgeIds] = useState([]);

  const ITEMS_PER_PAGE = 6;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isValidHexId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

  const fetchHackathons = async () => {
  try {
    setLoading(true);

    const res = await hackathonService.adminGetHackathons();

    

    const hacks =
      res?.data?.data?.hackathons ||
      res?.data?.data ||
      res?.data?.hackathons ||
      [];

    

    if (Array.isArray(hacks)) {
      setHackathonsList(hacks);

      let initialHack = null;

      if (routeHackathonId) {
        initialHack = hacks.find(
          (h) =>
            h._id === routeHackathonId ||
            h.slug === routeHackathonId
        );
      }

      if (!initialHack && hacks.length > 0) {
        initialHack = hacks[0];
      }

      setActiveHackathon(initialHack);
    } else {
      setHackathonsList([]);
    }
  } catch (err) {
    
    showToast("Failed to load hackathons", "error");
  } finally {
    setLoading(false);
  }
};

  const fetchHackathonData = async () => {
    let hackId = activeHackathon?._id;
    if (!hackId && hackathonsList.length > 0) {
      hackId = hackathonsList[0]._id;
    }
    if (!hackId) {
      if (routeHackathonId && /^[0-9a-fA-F]{24}$/.test(routeHackathonId)) {
        hackId = routeHackathonId;
      } else {
        return;
      }
    }
    try {
      setLoading(true);
      
      const [resJudges, resAssigned, resRegs] = await Promise.all([
        judgingService.adminGetJudges(),
        judgingService.adminGetHackathonJudges(hackId),
        hackathonService.adminListRegistrations(hackId, { limit: 100 })
      ]);

      
      
      

      const colors = [
        "from-pink-400 to-purple-500",
        "from-blue-400 to-indigo-500",
        "from-emerald-400 to-teal-500",
        "from-amber-400 to-orange-500",
        "from-rose-400 to-pink-500",
        "from-cyan-400 to-blue-500",
        "from-green-400 to-emerald-500"
      ];

      // Map all system judges
      let mappedAllJudges = [];
      const judgesData =
  resJudges?.data?.data?.judges ||
  resJudges?.data?.judges ||
  resJudges?.data?.data ||
  [];
      if (Array.isArray(judgesData)) {
        mappedAllJudges = judgesData.map((u, index) => {
          const name = u.fullName || "N/A";
          const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          return {
            _realId: u._id,
            initials,
            name,
            email: u.email || "N/A",
            expertise: u.skills?.join(', ') || "AI/ML, Web Development",
            affiliation: u.collegeOrUniversity || "Independent Affiliation",
            total: 15,
            completed: 12,
            pending: 3,
            avg: "8.6 / 10",
            active: !u.isSuspended,
            color: colors[index % colors.length],
            avatar: u.profilePhoto?.url || `https://i.pravatar.cc/120?img=${(index % 50) + 1}`
          };
        });
        setAllJudges(mappedAllJudges);
      }

      // Map assigned judges
      let mappedAssigned = [];
      const assignedData =
  resAssigned?.data?.data?.judges ||
  resAssigned?.data?.judges ||
  resAssigned?.data?.data ||
  [];
      if (Array.isArray(assignedData)) {
        mappedAssigned = assignedData.map((u, index) => {
          const name = u.fullName || "N/A";
          const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          return {
            _realId: u._id,
            initials,
            name,
            email: u.email || "N/A",
            expertise: u.skills?.join(', ') || "AI/ML, Web Development",
            affiliation: u.collegeOrUniversity || "Independent Affiliation",
            total: 15,
            completed: 12,
            pending: 3,
            avg: "8.6 / 10",
            active: !u.isSuspended,
            color: colors[index % colors.length],
            avatar: u.profilePhoto?.url || `https://i.pravatar.cc/120?img=${(index % 50) + 1}`
          };
        });
        setAssignedJudges(mappedAssigned);
        if (mappedAssigned.length > 0) {
          setSelectedJudge(mappedAssigned[0]);
        }
      }

      const regsData = resRegs.data?.data?.registrations || resRegs.data?.registrations || resRegs.data?.data || [];
      if (Array.isArray(regsData)) {
        const mappedTeams = regsData.map((reg, index) => {
  const teamName =
    reg?.teamId?.teamName ||
    reg?.userId?.fullName ||
    reg?.projectTitle ||
    `Team ${index + 1}`;

  const desc =
    reg?.teamId?.description ||
    reg?.projectDescription ||
    "Project submission";

  const code = teamName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return {
    code,
    name: teamName,
    desc,
    color: colors[index % colors.length],

    // IMPORTANT
    judges: mappedAssigned.map((j) => j.name),

    pendingScores: reg?.status !== "confirmed",
  };
});
        setTeams(mappedTeams);
      } else {
        setTeams([]);
      }

    } catch (err) {
      
      showToast("Error loading judge/team data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  useEffect(() => {
    fetchHackathonData();
  }, [activeHackathon, routeHackathonId, hackathonsList]);

  const filteredTeams = useMemo(() => {
    return teams.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTeams.length / ITEMS_PER_PAGE));
  const pagedTeams = useMemo(() => {
    return filteredTeams.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredTeams, currentPage]);

  const totalJudgesCount = allJudges.length;
  const assignedJudgesCount = assignedJudges.length;
  const totalEvaluations = assignedJudges.reduce((acc, judge) => acc + judge.completed, 0);
  const pendingScoresCount = teams.filter(t => t.pendingScores).length;

  const pendingEvaluations = assignedJudges.reduce((acc, j) => acc + j.pending, 0);
  const totalEvalCount = totalEvaluations + pendingEvaluations;
  const completionRateNum = totalEvalCount === 0 ? 0 : Math.round((totalEvaluations / totalEvalCount) * 100);
  const pendingRateNum = totalEvalCount === 0 ? 0 : 100 - completionRateNum;

  const dynamicDonutData = [
    { name: "Completed", value: completionRateNum, color: "#22c55e" },
    { name: "Pending", value: pendingRateNum, color: "#f59e0b" },
  ];

  const stats = [
    { label: "Total Judges", value: totalJudgesCount.toString(), delta: "Live System Judges", deltaColor: "text-emerald-600", icon: Users, iconBg: "bg-blue-100/80", iconColor: "text-blue-600" },
    { label: "Assigned Judges", value: assignedJudgesCount.toString(), delta: "Assigned to Hackathon", deltaColor: "text-emerald-600", icon: ClipboardList, iconBg: "bg-indigo-100/80", iconColor: "text-indigo-600" },
    { label: "Evaluations Completed", value: totalEvaluations.toString(), delta: "Submitted Scores", deltaColor: "text-emerald-600", icon: Award, iconBg: "bg-purple-100/80", iconColor: "text-purple-600" },
    { label: "Pending Scores", value: pendingScoresCount.toString(), delta: "Awaiting Evaluation", deltaColor: "text-amber-600", icon: Trophy, iconBg: "bg-amber-100/80", iconColor: "text-amber-600" },
  ];

  const handleQuickAction = (action) => {
    if (action === "autoAssign") {
      setManageSelectedJudgeIds(allJudges.map(j => j._realId));
      setModal({ type: "manageJudges" });
      showToast("Pre-selected all system judges for assignment!", "info");
    } else if (action === "balance") {
      showToast("Workload balanced successfully across all assigned judges!", "success");
    } else if (action === "reassign") {
      setManageSelectedJudgeIds(assignedJudges.map(j => j._realId));
      setModal({ type: "manageJudges" });
    } else if (action === "notify") {
      showToast(`Reminder notifications sent to all ${assignedJudgesCount} assigned judges!`, "success");
    }
  };

  const openEditModal = (team) => {
    setManageSelectedJudgeIds(assignedJudges.map(j => j._realId));
    setModal({ type: "manageJudges" });
  };

  const openAddJudge = (team) => {
    setManageSelectedJudgeIds(assignedJudges.map(j => j._realId));
    setModal({ type: "manageJudges" });
  };

  const saveManageJudges = async () => {
    if (!activeHackathon?._id) return;
    try {
      setLoading(true);
      await judgingService.adminAssignJudges(activeHackathon._id, manageSelectedJudgeIds);
      showToast("Hackathon judge assignments updated successfully!", "success");
      setModal(null);
      await fetchHackathonData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to assign judges", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeJudgeFromTeam = async (teamCode, judgeName) => {
    const judgeToRemove = assignedJudges.find(j => j.name === judgeName);
    if (!judgeToRemove) return;
    const nextJudgeIds = assignedJudges.filter(j => j.name !== judgeName).map(j => j._realId);
    try {
      setLoading(true);
      await judgingService.adminAssignJudges(activeHackathon._id, nextJudgeIds);
      showToast(`${judgeName} removed from hackathon judging panel`, "warning");
      await fetchHackathonData();
    } catch (err) {
      showToast("Failed to remove judge", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitScore = (teamCode, score) => {
    setScores(prev => ({ ...prev, [teamCode]: score }));
    setTeams(prev => prev.map(t =>
      t.code === teamCode ? { ...t, pendingScores: false } : t
    ));
    showToast(`Score ${score} submitted for ${teams.find(t => t.code === teamCode)?.name}!`, "success");
  };

  const tiedTeams = teams.filter(t => t.pendingScores && (t.code === "CI" || t.code === "HX"));
  const handleResolveTies = () => { setTieWinner(null); setModal({ type: "tie" }); };
  const confirmTieWinner = () => {
    if (!tieWinner) { showToast("Select a winner first", "error"); return; }
    setWinners(prev => prev.includes(tieWinner) ? prev : [...prev, tieWinner]);
    setTeams(prev => prev.map(t =>
      t.name === tieWinner ? { ...t, pendingScores: false } : t
    ));
    setModal(null);
    showToast(`${tieWinner} declared winner of Tie Resolution!`, "success");
    setTieWinner(null);
  };

  const publishResults = () => {
    if (winners.length === 0) {
      showToast("No winners declared yet!", "warning");
      return;
    }
    showToast(`Results published! Winners: ${winners.join(", ")}`, "success");
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  const judgeInfo = useMemo(() => {
    if (!selectedJudge) return [];
    return [
      { icon: Briefcase, label: "Expertise", value: selectedJudge.expertise },
      { icon: GraduationCap, label: "Affiliation", value: selectedJudge.affiliation },
      { icon: ClipboardList, label: "Total Evaluations", value: selectedJudge.total },
      { icon: CheckCircle2, label: "Completed", value: selectedJudge.completed },
      { icon: Clock, label: "Pending", value: selectedJudge.pending },
      { icon: Star, label: "Average Score Given", value: selectedJudge.avg },
    ];
  }, [selectedJudge]);

  const pageNums = Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1);


  return (
    <div style={fontStack} className="min-h-screen bg-gradient-to-br from-[#ecfcff] via-[#f8ffff] to-[#dff7ff] text-slate-800">
      <div className="flex-1 flex flex-col min-w-0">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-white/40"
        >
          <div className="px-6 lg:px-10 py-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-2xl font-bold text-[#0b1b52]">Judge Management</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="relative">
              <button type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/80 shadow-md transition hover:ring-blue-300" aria-label="Account">
                <img src="https://i.pravatar.cc/80" alt="Account" className="h-full w-full object-cover" />
              </button>
            </div>
          </div>
        </motion.nav>

        <main className="px-6 lg:px-10 py-6 space-y-6 overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="transition-all"
              >
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.iconBg}`}>
                      <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">{s.label}</p>
                      <p className="text-3xl font-bold text-[#0b1b52] mt-1">{s.value}</p>
                      <button
                        onClick={() => s.label === "Pending Scores" && setActiveTab(1)}
                        className={`text-xs mt-2 ${s.deltaColor} ${s.label === "Pending Scores" ? "hover:underline cursor-pointer" : ""}`}
                      >
                        {s.delta}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setHackDropdown(p => !p)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 border border-white/60 shadow-sm hover:shadow-md transition"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <div className="text-left">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Hackathon</p>
                        <p className="text-sm font-semibold text-[#0b1b52]">{activeHackathon?.title || "Select Hackathon"}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform ${hackDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {hackDropdown && (
                      <div className="absolute top-14 left-0 z-20 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {hackathonsList.map(h => (
                          <button
                            key={h._id}
                            onClick={() => {
                              setActiveHackathon(h);
                              setHackDropdown(false);
                              navigate(`/admin/hackathons/${h._id}/judges`);
                              showToast(`Switched to ${h.title}`, "info");
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-blue-50 transition ${h._id === activeHackathon?._id ? "text-blue-600 font-semibold bg-blue-50/50" : "text-slate-700"}`}
                          >
                            {h._id === activeHackathon?._id ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5" />}
                            {h.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setManageSelectedJudgeIds(assignedJudges.map(j => j._realId));
                      setModal({ type: "manageJudges" });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    Manage Judges
                  </button>
                </div>
                <div className="mt-6 border-b border-slate-200/70 flex gap-6 overflow-x-auto">
                  {TABS.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(i)}
                      className={`pb-3 text-sm whitespace-nowrap transition ${activeTab === i
                        ? "text-[#0b1b52] font-semibold border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {t}
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
                    className="mt-6"
                  >
                    {activeTab === 0 && (
                      <>
                        <div>
                          <h3 className="text-base font-semibold text-[#0b1b52]">
                            Team <span className="text-blue-500">→</span> Judges Assignment
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">Assign judges to evaluate teams</p>
                        </div>
                        <div className="relative mt-4 md:hidden">
                          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            className="w-full rounded-xl border border-white/60 bg-white/60 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none ring-blue-200 backdrop-blur-xl transition focus:bg-white/90 focus:ring-2"
                            placeholder="Search teams..."
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                          />
                        </div>

                        <div className="mt-4 overflow-x-auto">
                          <div className="min-w-[720px]">
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-slate-500 border-b border-slate-200/70">
                              <div className="col-span-4">Team / Project</div>
                              <div className="col-span-7">Assigned Judges (Min. 2)</div>
                              <div className="col-span-1 text-right">Actions</div>
                            </div>

                            {pagedTeams.length === 0 ? (
                              <div className="py-12 text-center text-slate-400 text-sm">No teams found for &ldquo;{searchQuery}&rdquo;</div>
                            ) : pagedTeams.map((team, i) => (
                              <motion.div
                                key={team.code}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="grid grid-cols-12 gap-4 px-4 py-4 items-center border-b border-slate-100 hover:bg-white/60 rounded-xl transition"
                              >
                                <div className="col-span-4 flex items-center gap-3">
                                  <img
                                    src={`https://picsum.photos/seed/${team.code}/40/40`}
                                    alt={team.name}
                                    className="w-10 h-10 rounded-xl object-cover shadow-md"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0b1b52] truncate">{team.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{team.desc}</p>
                                  </div>
                                </div>
                                <div className="col-span-7 flex flex-wrap items-center gap-2">
                                  {team.judges.map((j) => (
                                    <JudgeBadge key={j} name={j} onRemove={() => removeJudgeFromTeam(team.code, j)} />
                                  ))}
                                  <button
                                    onClick={() => openAddJudge(team)}
                                    className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <button
                                    onClick={() => openEditModal(team)}
                                    className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition hover:scale-110 active:scale-95"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <p className="text-xs text-slate-500">
                            Showing {filteredTeams.length === 0 ? 0 : Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTeams.length)} to{" "}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTeams.length)} of {filteredTeams.length} teams
                          </p>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            {pageNums.map(n => (
                              <button
                                key={n}
                                onClick={() => goToPage(n)}
                                className={`w-8 h-8 rounded-lg text-xs font-medium transition ${currentPage === n
                                  ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-500/30"
                                  : "border border-slate-200 text-slate-600 hover:bg-white/70"
                                  }`}
                              >
                                {n}
                              </button>
                            ))}
                            {totalPages > 4 && <span className="px-1 text-slate-400">…</span>}
                            <button
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage >= totalPages}
                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white/70 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === 1 && (
                      <div className="py-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-[#0b1b52]">Score Review</h3>
                          <button
                            onClick={() => showToast("All scores have been reviewed", "success")}
                            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition"
                          >
                            Approve All
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">Review and submit scores for each team</p>
                        <div className="space-y-4">
                          {teams.filter(t => t.pendingScores || !scores[t.code]).slice(0, 6).map(team => (
                            <div key={team.code} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white/60">
                              <div className="flex items-center gap-3">
                                <img src={`https://picsum.photos/seed/${team.code}/40/40`} alt={team.name} className="w-10 h-10 rounded-xl object-cover shadow-md" />
                                <div>
                                  <p className="text-sm font-semibold text-[#0b1b52]">{team.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {scores[team.code] ? `Score: ${scores[team.code]}` : "Awaiting submission"}
                                  </p>
                                </div>
                              </div>
                              {!scores[team.code] && (
                                <div className="flex items-center gap-2">
                                  <select
                                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 bg-white"
                                    defaultValue=""
                                    onChange={(e) => e.target.value && submitScore(team.code, e.target.value)}
                                  >
                                    <option value="" disabled>Select score</option>
                                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(s => (
                                      <option key={s} value={s}>{s}/10</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              {scores[team.code] && (
                                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                                  Reviewed
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        {teams.filter(t => !scores[t.code]).length === 0 && (
                          <div className="text-center py-8">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">All scores have been reviewed!</p>
                            <button
                              onClick={() => setActiveTab(2)}
                              className="mt-3 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition"
                            >
                              Proceed to Tie Resolution
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div className="py-6 text-center">
                        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Tie Resolution</p>
                        <p className="text-xs text-slate-400 mt-1">2 teams are currently tied.</p>
                        <div className="mt-4 max-w-sm mx-auto space-y-2">
                          {[
                            { code: "CI", name: "Code Infinity", color: "from-sky-500 to-blue-600", score: "8.45" },
                            { code: "HX", name: "HackX 5.0", color: "from-amber-500 to-orange-600", score: "8.45" },
                          ].map(t => (
                            <div key={t.code} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/60">
                              <div className="flex items-center gap-3">
                                <img src={`https://picsum.photos/seed/${t.code}/32/32`} alt={t.name || t.code} className="w-8 h-8 rounded-lg object-cover" />
                                <span className="text-sm font-medium text-[#0b1b52]">{t.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#0b1b52]">{t.score}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">TIED</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleResolveTies}
                          className="mt-4 px-6 py-2 rounded-xl bg-amber-50 text-amber-600 text-sm font-medium hover:bg-amber-100 transition"
                        >
                          Resolve Ties Now
                        </button>
                      </div>
                    )}
                    {activeTab === 3 && (
                      <div className="py-6 text-center">
                        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Winners Declaration</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {winners.length > 0 ? `${winners.length} winner(s) declared.` : "No winners declared yet."}
                        </p>
                        {winners.length > 0 && (
                          <div className="mt-4 space-y-2 max-w-xs mx-auto">
                            {winners.map((w, i) => (
                              <div key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium w-full justify-center">
                                <Trophy className="w-4 h-4" /> {w}
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={publishResults}
                          className="mt-4 px-6 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition"
                        >
                          Publish Results
                        </button>
                      </div>
                    )}
                    {activeTab === 4 && (
                      <div className="py-6">
                        <p className="text-slate-600 font-medium mb-4">Evaluation Summary</p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {[[totalEvaluations, "Evaluations Total"], [
                            (totalEvaluations + assignedJudges.reduce((a, j) => a + j.pending, 0)) === 0 
                              ? "0%" 
                              : Math.round((totalEvaluations / (totalEvaluations + assignedJudges.reduce((a, j) => a + j.pending, 0))) * 100) + "%", 
                            "Completion Rate"
                          ], ["8.6", "Avg Score"]].map(([v, l]) => (
                            <div key={l} className="p-4 rounded-2xl bg-white/60 border border-white/60">
                              <p className="text-2xl font-bold text-[#0b1b52]">{v}</p>
                              <p className="text-xs text-slate-500 mt-1">{l}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {assignedJudges.map(j => (
                            <div key={j._realId} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/60">
                              <div className="flex items-center gap-2">
                                <img src={j.avatar} alt={j.initials} className="w-7 h-7 rounded-lg object-cover" />
                                <div>
                                  <p className="text-xs font-semibold text-[#0b1b52]">{j.name}</p>
                                  <p className="text-[10px] text-slate-400">{j.completed}/{j.total} done</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#0b1b52]">{j.avg}</span>
                            </div>
                          ))}
                          {assignedJudges.length === 0 && (
                            <p className="text-xs text-slate-400 text-center py-4 sm:col-span-2">No judges assigned to this hackathon.</p>
                          )}
                        </div>
                        <button
                          onClick={() => showToast("Summary exported!", "success")}
                          className="mt-5 w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
                        >
                          Export Summary
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </GlassCard>
            </motion.div>
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-[#0b1b52]">Judge Details</h3>
                  {assignedJudges.length > 0 && (
                    <button
                      onClick={() => setModal({ type: "judgeProfile" })}
                      className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                    >
                      View Profile
                    </button>
                  )}
                </div>

                {assignedJudges.length === 0 ? (
                  <div className="mt-6 py-8 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    No judges assigned yet.<br />
                    Click "Manage Judges" to start.
                  </div>
                ) : (
                  <>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {assignedJudges.map(j => (
                        <button
                          key={j._realId}
                          onClick={() => setSelectedJudge(j)}
                          className={`w-8 h-8 rounded-xl overflow-hidden transition ${selectedJudge?._realId === j._realId ? "ring-2 ring-offset-1 ring-blue-500 scale-110" : "opacity-60 hover:opacity-100 hover:scale-105"}`}
                        >
                          <img src={j.avatar} alt={j.initials} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    {selectedJudge && (
                      <>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                            <img src={selectedJudge.avatar} alt={selectedJudge.initials} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-[#0b1b52]">{selectedJudge.name}</p>
                            <p className="text-xs text-slate-500">{selectedJudge.email}</p>
                            <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${selectedJudge.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                              {selectedJudge.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 space-y-1">
                          {judgeInfo.map((row, i) => (
                            <div
                              key={row.label}
                              className={`flex items-center justify-between py-2.5 ${i !== judgeInfo.length - 1 ? "border-b border-slate-100" : ""}`}
                            >
                              <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                                <row.icon className="w-4 h-4" />
                                <span>{row.label}</span>
                              </div>
                              <span className="text-sm font-medium text-[#0b1b52]">{row.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Actions</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => showToast(`Viewing evaluations for ${selectedJudge.name}`, "info")}
                              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-medium shadow-md shadow-blue-500/30 hover:scale-[1.03] active:scale-[0.97] transition"
                            >
                              View Evaluations
                            </button>
                            <button
                              onClick={() => {
                                setManageSelectedJudgeIds(assignedJudges.map(j => j._realId));
                                setModal({ type: "manageJudges" });
                              }}
                              className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white/70 transition hover:scale-[1.03]"
                            >
                              Edit Assignment
                            </button>
                            <button
                              onClick={() => removeJudgeFromTeam(null, selectedJudge.name)}
                              className="px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 text-xs font-medium hover:bg-rose-100 transition hover:scale-[1.03]"
                            >
                              Remove from All
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </GlassCard>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-[#0b1b52]">Evaluation Progress</h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative w-32 h-32 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dynamicDonutData} innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                          {dynamicDonutData.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-2xl font-bold text-[#0b1b52]">{totalEvaluations}</p>
                      <p className="text-[10px] text-slate-500">Total</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {[{ label: "Completed", color: "bg-emerald-500", val: `${totalEvaluations} (${completionRateNum}%)` }, { label: "Pending", color: "bg-amber-500", val: `${pendingEvaluations} (${pendingRateNum}%)` }].map(r => (
                      <div key={r.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-600">
                          <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />{r.label}
                        </span>
                        <span className="text-sm font-semibold text-[#0b1b52]">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { setActiveTab(4); showToast("Evaluation summary opened", "info"); }}
                  className="mt-5 w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-white/70 transition"
                >
                  View Full Summary
                </button>
              </GlassCard>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-base font-semibold text-[#0b1b52]">Quick Actions</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {QUICK_ACTIONS.map((a) => (
                    <button
                      key={a.title}
                      onClick={() => handleQuickAction(a.action)}
                      className={`p-4 rounded-2xl ${a.bg} text-left transition shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95`}
                    >
                      <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center mb-3 ${a.color}`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-[#0b1b52] leading-tight">{a.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{a.sub}</p>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#0b1b52]">Tie Resolution</h3>
                  <button onClick={() => setModal({ type: "allTies" })} className="text-xs text-blue-600 hover:underline">View All</button>
                </div>
                <p className="text-xs text-slate-500 mt-1">2 teams have tied scores</p>
                <div className="mt-4 space-y-2">
                  {[
                    { code: "CI", name: "Code Infinity", color: "from-sky-500 to-blue-600", score: "8.45" },
                    { code: "HX", name: "HackX 5.0", color: "from-amber-500 to-orange-600", score: "8.45" },
                  ].map(t => (
                    <div key={t.code} className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-white/60">
                      <div className="flex items-center gap-3">
                        <img src={`https://picsum.photos/seed/${t.code}/32/32`} alt={t.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-sm font-medium text-[#0b1b52]">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#0b1b52]">{t.score}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">TIED</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleResolveTies}
                  className="mt-4 w-full py-2.5 rounded-xl bg-blue-100/70 text-blue-700 text-sm font-medium hover:bg-blue-200/70 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  Resolve Ties
                </button>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>

      {modal?.type === "tie" && (
        <Modal title="Resolve Tie" onClose={() => setModal(null)}>
          <p className="text-sm text-slate-500 mb-4">Select a winner to resolve the tie between Code Infinity and HackX 5.0.</p>
          {["Code Infinity", "HackX 5.0"].map(name => (
            <button
              key={name}
              onClick={() => setTieWinner(name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-2 border transition ${tieWinner === name ? "bg-blue-50 border-blue-400 text-blue-700" : "border-slate-200 hover:border-slate-300"}`}
            >
              <span className="text-sm font-medium">{name}</span>
              {tieWinner === name && <Check className="w-4 h-4 text-blue-500" />}
            </button>
          ))}
          <div className="flex gap-3 justify-end mt-4">
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={confirmTieWinner} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow hover:shadow-lg transition">Declare Winner</button>
          </div>
        </Modal>
      )}

      {modal?.type === "manageJudges" && (
        <Modal title="Manage Judges" onClose={() => setModal(null)}>
          <p className="text-xs text-slate-500 mb-4">Select or deselect system judges to assign them to this hackathon.</p>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide pr-1">
            {allJudges.map(j => {
              const isSelected = manageSelectedJudgeIds.includes(j._realId);
              return (
                <div 
                  key={j._realId} 
                  onClick={() => {
                    setManageSelectedJudgeIds(prev => 
                      prev.includes(j._realId)
                        ? prev.filter(id => id !== j._realId)
                        : [...prev, j._realId]
                    );
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                    isSelected 
                      ? "bg-blue-50/70 border-blue-200" 
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${j.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                      {j.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0b1b52]">{j.name}</p>
                      <p className="text-xs text-slate-400">{j.expertise}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${j.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {j.active ? "Active" : "Inactive"}
                    </span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
            {allJudges.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No system judges found.</p>
            )}
          </div>
          <div className="mt-5 flex gap-3 justify-end">
            <button 
              onClick={() => setModal(null)} 
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={saveManageJudges} 
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow hover:shadow-lg transition"
            >
              Save Assignments
            </button>
          </div>
        </Modal>
      )}

      {modal?.type === "judgeProfile" && (
        <Modal title="Judge Profile" onClose={() => setModal(null)}>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg"><img src={selectedJudge.avatar} alt={selectedJudge.initials} className="w-full h-full object-cover" /></div>
            <div>
              <p className="text-lg font-bold text-[#0b1b52]">{selectedJudge.name}</p>
              <p className="text-xs text-slate-500">{selectedJudge.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">{selectedJudge.affiliation}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mb-5">
            {[["Total", selectedJudge.total], ["Done", selectedJudge.completed], ["Pending", selectedJudge.pending]].map(([l, v]) => (
              <div key={l} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl font-bold text-[#0b1b52]">{v}</p>
                <p className="text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600">Avg Score: <span className="font-semibold text-[#0b1b52]">{selectedJudge.avg}</span></p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => { showToast("Evaluation report exported!", "success"); setModal(null); }}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
            >
              Export Report
            </button>
            <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow hover:shadow-lg transition">Close</button>
          </div>
        </Modal>
      )}
      {modal?.type === "editAssignment" && (
        <Modal title={`Edit Assignment — ${selectedJudge.name}`} onClose={() => setModal(null)}>
          <p className="text-xs text-slate-500 mb-4">Teams currently assigned to this judge:</p>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-1 mb-4">
            {teams.filter(t => t.judges.includes(selectedJudge.name)).map(t => (
              <div key={t.code} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.color} text-white text-[10px] font-bold flex items-center justify-center`}>{t.code}</div>
                  <span className="text-sm font-medium text-[#0b1b52]">{t.name}</span>
                </div>
                <button
                  onClick={() => removeJudgeFromTeam(t.code, selectedJudge.name)}
                  className="text-xs text-rose-500 hover:text-rose-700 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            {teams.filter(t => t.judges.includes(selectedJudge.name)).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No teams assigned.</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => { setModal(null); showToast("Assignment updated!", "success"); }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow hover:shadow-lg transition"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      {modal?.type === "reassign" && (
        <Modal title="Reassign Judges" onClose={() => setModal(null)}>
          <p className="text-sm text-slate-500 mb-4">Select a judge to reassign across teams automatically.</p>
          <div className="space-y-2 mb-4 max-h-72 overflow-y-auto scrollbar-hide">
            {assignedJudges.map(j => (
              <button
                key={j._realId}
                onClick={() => {
                  setModal(null);
                  const teamsWithJudge = teams.filter(t => t.judges.includes(j.name));
                  if (teamsWithJudge.length > 0) {
                    const newJudge = allJudges.find(j2 => j2.name !== j.name && !teamsWithJudge[0].judges.includes(j2.name));
                    if (newJudge) {
                      setTeams(prev => prev.map(t =>
                        t.code === teamsWithJudge[0].code
                          ? { ...t, judges: [...t.judges.filter(jn => jn !== j.name), newJudge.name] }
                          : t
                      ));
                    }
                  }
                  showToast(`${j.name} reassigned optimally!`, "success");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition text-left"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${j.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>{j.initials}</div>
                <div>
                  <p className="text-sm font-medium text-[#0b1b52]">{j.name}</p>
                  <p className="text-xs text-slate-400">{j.pending} pending · {j.completed} done</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
              </button>
            ))}
            {assignedJudges.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No judges assigned to this hackathon.</p>
            )}
          </div>
        </Modal>
      )}
      {modal?.type === "winners" && (
        <Modal title="Declared Winners" onClose={() => setModal(null)}>
          {winners.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No winners declared yet.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {winners.map((w, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-[#0b1b52]">{w}</span>
                  <span className="ml-auto text-xs text-amber-600 font-medium">#{i + 1}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow hover:shadow-lg transition">Close</button>
          </div>
        </Modal>
      )}
      {modal?.type === "allTies" && (
        <Modal title="All Tied Teams" onClose={() => setModal(null)}>
          <p className="text-xs text-slate-500 mb-4">2 active tie conflicts detected.</p>
          {[["CI", "Code Infinity", "from-sky-500 to-blue-600", "8.45"], ["HX", "HackX 5.0", "from-amber-500 to-orange-600", "8.45"]].map(([code, name, color, score]) => (
            <div key={code} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 mb-2">
              <div className="flex items-center gap-3">
                <img src={`https://picsum.photos/seed/${code}/32/32`} alt={name} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-sm font-medium text-[#0b1b52]">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#0b1b52]">{score}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">TIED</span>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600">Close</button>
            <button
              onClick={() => setModal({ type: "tie" })}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-medium shadow hover:shadow-lg transition"
            >
              Resolve Now
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}