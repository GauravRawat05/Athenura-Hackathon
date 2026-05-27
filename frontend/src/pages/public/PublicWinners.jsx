import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { Trophy, Medal, Video, Award, ArrowLeft, Loader2, Calendar, Users, ExternalLink, Sparkles } from "lucide-react";

const Github = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function PublicWinners() {
  const { hackathonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hackathon, setHackathon] = useState(null);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch winners
        const winnersRes = await api.get(`/public/hackathons/${hackathonId}/winners`);
        const winnersData = winnersRes.data?.data?.winners || [];
        setWinners(winnersData);

        // Fetch hackathon details
        const hackathonRes = await api.get(`/public/hackathons/${hackathonId}`);
        setHackathon(hackathonRes.data?.data || null);
      } catch (err) {
        
        setError("Could not load winners data. Please check back later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [hackathonId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4" />
        <p className="text-lg font-semibold tracking-wide text-slate-300">Loading championship winners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 pt-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-md w-full text-center backdrop-blur-xl">
          <Award className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-200 mb-2">Error Loading Results</h2>
          <p className="text-slate-300 text-sm mb-6">{error}</p>
          <Link
            to="/hackathons"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hackathons
          </Link>
        </div>
      </div>
    );
  }

  // Sort winners by rank just in case they aren't pre-sorted
  const sortedWinners = [...winners].sort((a, b) => a.rank - b.rank);

  // Group into podium and standard lists
  const podiumWinners = sortedWinners.filter(w => w.rank <= 3);
  const remainingWinners = sortedWinners.filter(w => w.rank > 3);

  // Arrange podium: 2nd place, 1st place, 3rd place for standard left-to-right podium styling
  const firstPlace = podiumWinners.find(w => w.rank === 1);
  const secondPlace = podiumWinners.find(w => w.rank === 2);
  const thirdPlace = podiumWinners.find(w => w.rank === 3);

  const hasWinners = sortedWinners.length > 0;

  return (
    <div className="min-h-screen text-white pt-24 pb-16 px-4 md:px-8 bg-gradient-to-b from-[#03045E] via-[#020138] to-[#010022]">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 2s;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .podium-card-gold {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.03) 100%);
          border: 1px solid rgba(251, 191, 36, 0.3);
          box-shadow: 0 10px 40px -10px rgba(251, 191, 36, 0.2);
        }
        .podium-card-silver {
          background: linear-gradient(135deg, rgba(203, 213, 225, 0.1) 0%, rgba(148, 163, 184, 0.03) 100%);
          border: 1px solid rgba(203, 213, 225, 0.25);
          box-shadow: 0 10px 30px -10px rgba(203, 213, 225, 0.1);
        }
        .podium-card-bronze {
          background: linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(180, 83, 9, 0.03) 100%);
          border: 1px solid rgba(217, 119, 6, 0.25);
          box-shadow: 0 10px 30px -10px rgba(217, 119, 6, 0.1);
        }
      `}</style>

      <div className="max-w-6xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/hackathons"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hackathons
          </Link>
        </div>

        {/* Header Banner */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex-1">
            {hackathon?.technologyDomains && (
              <div className="flex flex-wrap gap-2 mb-3">
                {hackathon.technologyDomains.map((domain, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30">
                    {domain}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
              {hackathon?.title || "Hackathon Winners"}
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl">
              {hackathon?.description || "Meet the creators and innovators who stood out in this hackathon sprint."}
            </p>
          </div>

          <div className="flex gap-4 md:self-center shrink-0">
            {hackathon?.prizePool && (
              <div className="glass-panel px-4 py-3 rounded-2xl text-center">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Prize Pool</div>
                <div className="text-lg font-bold text-amber-400">
                  {hackathon.currency === "DOLLAR" ? "$" : "₹"}
                  {hackathon.prizePool.toLocaleString()}
                </div>
              </div>
            )}
            <div className="glass-panel px-4 py-3 rounded-2xl text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Winners Published</div>
              <div className="text-lg font-bold text-emerald-400">Official</div>
            </div>
          </div>
        </div>

        {!hasWinners ? (
          // Empty State
          <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto mt-8">
            <Award className="w-16 h-16 text-slate-500 mx-auto mb-4 stroke-1 animate-pulse" />
            <h3 className="text-xl font-bold mb-2">Leaderboard Pending</h3>
            <p className="text-slate-400 text-sm mb-6">
              The submissions are currently being evaluated by the judging panel. Results and certificates will be published shortly!
            </p>
            <Link
              to="/hackathons"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              Explore Other Events
            </Link>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Podium Finishers
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-100">Top Three Innovators</h2>
              </div>

              {/* Responsive Podium Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
                
                {/* 2nd Place (Silver) */}
                <div className="order-2 md:order-1 flex flex-col items-center">
                  {secondPlace ? (
                    <div className="w-full text-center">
                      <div className="mb-3 relative inline-block animate-float-delayed">
                        <div className="w-16 h-16 rounded-full bg-slate-700/60 border border-slate-400 flex items-center justify-center text-slate-200 shadow-lg text-2xl font-black">2</div>
                        <Medal className="w-6 h-6 text-slate-300 absolute -top-1 -right-1 drop-shadow" />
                      </div>
                      <div className="podium-card-silver glass-panel rounded-2xl p-5 mb-2 hover:scale-[1.02] transition duration-300">
                        <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-widest">2nd Place</div>
                        <h3 className="text-lg font-bold text-slate-200 truncate">
                          {secondPlace.team?.teamName || secondPlace.user?.fullName}
                        </h3>
                        {secondPlace.team?.teamName && secondPlace.user?.fullName && (
                          <p className="text-xs text-slate-400 truncate mb-2">by {secondPlace.user.fullName}</p>
                        )}
                        <div className="h-px bg-white/5 my-3" />
                        <h4 className="text-sm font-semibold text-slate-300 truncate mb-1">
                          {secondPlace.submission?.title || "No Title"}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mb-4">
                          {secondPlace.submission?.description || "Innovative project build."}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Score: <strong className="text-slate-200">{secondPlace.score} pts</strong></span>
                          <div className="flex gap-2">
                            {secondPlace.submission?.githubLink && (
                              <a href={secondPlace.submission.githubLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {secondPlace.submission?.videoLink && (
                              <a href={secondPlace.submission.videoLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
                                <Video className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-24 h-12 bg-slate-800/40 rounded-t-xl mx-auto border-t border-slate-700/50 hidden md:block" />
                    </div>
                  ) : (
                    <div className="w-full p-4 glass-panel rounded-2xl text-slate-500 text-sm text-center border-dashed">No runner-up</div>
                  )}
                </div>

                {/* 1st Place (Gold) */}
                <div className="order-1 md:order-2 flex flex-col items-center">
                  {firstPlace ? (
                    <div className="w-full text-center">
                      <div className="mb-4 relative inline-block animate-float">
                        <div className="w-20 h-20 rounded-full bg-amber-600/60 border-2 border-amber-400 flex items-center justify-center text-amber-200 shadow-lg text-3xl font-black">1</div>
                        <Trophy className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 drop-shadow" />
                      </div>
                      <div className="podium-card-gold glass-panel rounded-2xl p-6 mb-2 hover:scale-[1.03] transition duration-300 relative">
                        <div className="absolute inset-0 bg-amber-400/5 rounded-2xl pointer-events-none blur" />
                        <div className="text-xs text-amber-400 font-bold mb-1 uppercase tracking-widest">Champion</div>
                        <h3 className="text-xl font-bold text-amber-200 truncate">
                          {firstPlace.team?.teamName || firstPlace.user?.fullName}
                        </h3>
                        {firstPlace.team?.teamName && firstPlace.user?.fullName && (
                          <p className="text-xs text-slate-400 truncate mb-2">by {firstPlace.user.fullName}</p>
                        )}
                        <div className="h-px bg-white/5 my-3" />
                        <h4 className="text-base font-semibold text-slate-200 truncate mb-1">
                          {firstPlace.submission?.title || "No Title"}
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-2 min-h-[32px] mb-4">
                          {firstPlace.submission?.description || "Winner of the championship sprint."}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Score: <strong className="text-amber-300 font-bold">{firstPlace.score} pts</strong></span>
                          <div className="flex gap-2">
                            {firstPlace.submission?.githubLink && (
                              <a href={firstPlace.submission.githubLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 transition">
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {firstPlace.submission?.videoLink && (
                              <a href={firstPlace.submission.videoLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 transition">
                                <Video className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-28 h-20 bg-slate-800/60 rounded-t-xl mx-auto border-t border-slate-700 hidden md:block" />
                    </div>
                  ) : (
                    <div className="w-full p-4 glass-panel rounded-2xl text-slate-500 text-sm text-center border-dashed">No champion declared</div>
                  )}
                </div>

                {/* 3rd Place (Bronze) */}
                <div className="order-3 md:order-3 flex flex-col items-center">
                  {thirdPlace ? (
                    <div className="w-full text-center">
                      <div className="mb-3 relative inline-block animate-float-delayed">
                        <div className="w-14 h-14 rounded-full bg-amber-800/60 border border-amber-700 flex items-center justify-center text-amber-600 shadow-lg text-xl font-black">3</div>
                        <Medal className="w-5 h-5 text-amber-600 absolute -top-1 -right-1 drop-shadow" />
                      </div>
                      <div className="podium-card-bronze glass-panel rounded-2xl p-5 mb-2 hover:scale-[1.02] transition duration-300">
                        <div className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-widest">3rd Place</div>
                        <h3 className="text-lg font-bold text-amber-700 truncate">
                          {thirdPlace.team?.teamName || thirdPlace.user?.fullName}
                        </h3>
                        {thirdPlace.team?.teamName && thirdPlace.user?.fullName && (
                          <p className="text-xs text-slate-400 truncate mb-2">by {thirdPlace.user.fullName}</p>
                        )}
                        <div className="h-px bg-white/5 my-3" />
                        <h4 className="text-sm font-semibold text-slate-300 truncate mb-1">
                          {thirdPlace.submission?.title || "No Title"}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mb-4">
                          {thirdPlace.submission?.description || "Innovative project build."}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Score: <strong className="text-slate-200">{thirdPlace.score} pts</strong></span>
                          <div className="flex gap-2">
                            {thirdPlace.submission?.githubLink && (
                              <a href={thirdPlace.submission.githubLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {thirdPlace.submission?.videoLink && (
                              <a href={thirdPlace.submission.videoLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
                                <Video className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-24 h-8 bg-slate-800/30 rounded-t-xl mx-auto border-t border-slate-700/30 hidden md:block" />
                    </div>
                  ) : (
                    <div className="w-full p-4 glass-panel rounded-2xl text-slate-500 text-sm text-center border-dashed">No 3rd place</div>
                  )}
                </div>

              </div>
            </div>

            {/* Other Winners / Participants List */}
            {remainingWinners.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-200 border-b border-white/10 pb-2">Remaining Rank Standings</h3>
                <div className="space-y-4">
                  {remainingWinners.map((w) => (
                    <div
                      key={w._id}
                      className="glass-panel rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.06] transition duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300 font-bold shrink-0">
                          #{w.rank}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-200 truncate">
                            {w.team?.teamName || w.user?.fullName}
                          </h4>
                          {w.team?.teamName && w.user?.fullName && (
                            <p className="text-xs text-slate-400">by {w.user.fullName}</p>
                          )}
                          <p className="text-sm font-semibold text-slate-300 truncate mt-1">
                            {w.submission?.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-nowrap items-center gap-6 self-end md:self-auto">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Award Category</div>
                          <div className="text-sm font-bold text-amber-400">{w.awardCategory || w.award || "Honorary Mention"}</div>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <div className="text-xs text-slate-400">Evaluation</div>
                          <div className="text-sm font-bold text-slate-200">{w.score} pts</div>
                        </div>

                        <div className="flex gap-2">
                          {w.submission?.githubLink && (
                            <a
                              href={w.submission.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
                            >
                              <Github className="w-3.5 h-3.5" /> Code
                            </a>
                          )}
                          {w.submission?.videoLink && (
                            <a
                              href={w.submission.videoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
                            >
                              <Video className="w-3.5 h-3.5" /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}