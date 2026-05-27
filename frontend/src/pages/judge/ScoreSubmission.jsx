import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Trophy, Award, CheckCircle2, Clock, X, Check,
  AlertTriangle, ArrowLeft, Monitor, ExternalLink, Activity
} from "lucide-react";
import { judgingService } from "../../services/judgingService";
import { hackathonService } from "../../services/hackathonService";

const styleTag = document.createElement('style');
styleTag.textContent = `
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

export default function ScoreSubmission() {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [hackathon, setHackathon] = useState(null);
  const [criteriaScores, setCriteriaScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const resolveSubmission = async () => {
      try {
        setLoading(true);
        // 1. Fetch assignments
        const assignmentsRes = await judgingService.getAssignments();
        const assignments = assignmentsRes.data?.data || assignmentsRes.data || [];
        
        let foundSubmission = null;
        let foundHackathon = null;

        // 2. Scan through hackathons to find the matching submissionId
        for (const asg of assignments) {
          const hackId = asg.hackathonId?._id || asg.hackathonId;
          const subRes = await judgingService.getSubmissions(hackId);
          const subs = subRes.data?.data || subRes.data || [];
          
          const match = subs.find(s => s._id === submissionId);
          if (match) {
            foundSubmission = match;
            
            // Fetch complete hackathon info for judging criteria
            const hackRes = await hackathonService.getHackathonById(hackId);
            foundHackathon = hackRes.data?.data || hackRes.data;
            break;
          }
        }

        if (foundSubmission && foundHackathon) {
          setSubmission(foundSubmission);
          setHackathon(foundHackathon);

          // 3. Initialize scores
          const existing = foundSubmission.existingScore;
          const initialScores = {};
          const criteriaList = foundHackathon.judgingCriteria || [];
          
          criteriaList.forEach(crit => {
            const match = existing?.criterionScores?.find(cs => cs.criterionName === crit.name);
            initialScores[crit.name] = match ? match.score : 5; // Default score is 5
          });
          
          setCriteriaScores(initialScores);
          setFeedback(existing?.feedback || "");
        } else {
          showToast("Submission not found in your assigned hackathons", "error");
        }
      } catch (err) {
        
        showToast("Error loading evaluation page", "error");
      } finally {
        setLoading(false);
      }
    };

    resolveSubmission();
  }, [submissionId]);

  // Live total score calculation
  const totalScoreLive = useMemo(() => {
    if (!hackathon?.judgingCriteria) return 0;
    let sum = 0;
    hackathon.judgingCriteria.forEach(crit => {
      const score = criteriaScores[crit.name] || 0;
      sum += (score * crit.weight) / 10;
    });
    return Math.round(sum * 100) / 100;
  }, [criteriaScores, hackathon]);

  const handleSubmitEvaluation = async () => {
    try {
      setSubmitting(true);
      const payload = {
        criterionScores: Object.keys(criteriaScores).map(name => ({
          criterionName: name,
          score: Number(criteriaScores[name])
        })),
        feedback
      };

      const hackId = hackathon._id;

      if (submission.scored && submission.scoreId) {
        // Update existing score
        await judgingService.updateScore(submission.scoreId, payload);
        showToast("Evaluation updated successfully", "success");
      } else {
        // Create new score
        await judgingService.submitScore(submission._id, hackId, payload);
        showToast("Evaluation submitted successfully", "success");
      }

      // Return to dashboard after successful submit
      setTimeout(() => {
        navigate("/judge");
      }, 1500);

    } catch (err) {
      
      showToast(err.response?.data?.message || "Failed to save evaluation", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={fontStack}>
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Resolving Submission Details...</p>
        </div>
      </div>
    );
  }

  if (!submission || !hackathon) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center" style={fontStack}>
        <AlertTriangle className="w-14 h-14 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-indigo-950 mb-2">Submission Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm max-w-md">
          This project could not be found or you may not be assigned as a judge for its corresponding hackathon.
        </p>
        <button
          onClick={() => navigate("/judge")}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] text-[#0b1b52] p-6 md:p-10 flex flex-col" style={fontStack}>
      {/* Header and Back navigation */}
      <header className="max-w-4xl w-full mx-auto mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate("/judge")}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50">
          Evaluation Workspace
        </span>
      </header>

      <main className="max-w-4xl w-full mx-auto flex flex-col gap-6">
        {/* Project info card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase border border-indigo-100/30">
            {hackathon.title}
          </span>
          <h2 className="text-2xl font-black text-indigo-950 mt-3 mb-2">{submission.title}</h2>
          <p className="text-xs font-bold text-slate-400 mb-5 flex items-center gap-1">
            Submitted by: <span className="text-slate-700 font-extrabold">{submission.teamId?.teamName || submission.userId?.fullName}</span>
          </p>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
            {submission.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {submission.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl bg-slate-900 text-white hover:bg-black transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> Code Repository <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {submission.demoUrl && (
              <a
                href={submission.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <Monitor className="w-4 h-4" /> Live Demo <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Rubric evaluation sliders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-indigo-950 text-base flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Rubric Assessment
            </h3>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weighted Score</p>
              <h4 className="font-black text-indigo-600 text-2xl">{totalScoreLive} / 10</h4>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {hackathon.judgingCriteria?.map(crit => {
              const currentVal = criteriaScores[crit.name] || 0;
              return (
                <div key={crit.name} className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-950 flex items-center gap-2">
                      {crit.name}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold border border-slate-200/30">
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
        </div>

        {/* Written feedback input */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-3">
          <label className="font-extrabold text-indigo-950 text-xs">Written feedback (Optional)</label>
          <textarea
            rows={4}
            placeholder="Provide recommendations, areas of improvement, or general remarks for the team..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500 font-medium transition"
          />
        </div>

        {/* Action button bar */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            onClick={() => navigate("/judge")}
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={handleSubmitEvaluation}
            className="px-7 py-3 rounded-2xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 hover:shadow-lg hover:shadow-indigo-600/10 disabled:opacity-50"
          >
            {submitting ? (
              <Activity className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            {submission.scored ? "Update Evaluation" : "Submit Evaluation"}
          </button>
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
      {type === "info" && <Star className="w-4 h-4 animate-spin" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}
