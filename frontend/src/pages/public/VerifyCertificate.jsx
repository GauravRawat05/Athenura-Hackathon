import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Loader2, Award, Calendar, ShieldCheck, User, Building } from "lucide-react";

export default function VerifyCertificate() {
  const { id } = useParams(); // The certificateCode parameter from URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cert, setCert] = useState(null);

  useEffect(() => {
    async function fetchVerification() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/public/certificates/verify/${id}`);
        // Endpoint returns ApiResponse(statusCode, data, message)
        setCert(res.data?.data || null);
      } catch (err) {
        
        if (err.response?.status === 404) {
          setError("Certificate not found or invalid code.");
        } else {
          setError("Unable to complete verification at this time. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchVerification();
    } else {
      setError("No certificate code provided.");
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4" />
        <p className="text-lg font-semibold tracking-wide text-slate-300">Verifying cryptographic signature...</p>
      </div>
    );
  }

  // Determine state of verification
  const isRevoked = cert?.isRevoked;
  const isCompleted = cert?.generationStatus === "COMPLETED";
  const isValid = cert && !isRevoked && isCompleted;

  return (
    <div className="min-h-screen text-white pt-24 pb-16 px-4 md:px-8 bg-gradient-to-b from-[#03045E] via-[#020138] to-[#010022] flex items-center justify-center">
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-rotate {
          animation: rotate-slow 20s linear infinite;
        }
      `}</style>

      <div className="max-w-3xl w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {error || !cert ? (
          // Invalid Certificate Page
          <div className="glass-panel rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 stroke-1 animate-pulse" />
            <h2 className="text-2xl font-extrabold text-red-200 mb-2">Verification Failed</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-8">
              {error || "The requested certificate code is invalid or has not been issued by the Hackathon platform."}
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-sm mx-auto mb-8">
              <span className="text-xs font-mono text-red-300 block mb-1">Code Queried:</span>
              <span className="text-sm font-mono text-slate-200 select-all font-bold">{id}</span>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-6 py-2.5 rounded-xl font-semibold text-sm border border-white/10"
            >
              Verify Another Code
            </Link>
          </div>
        ) : (
          // Certificate details present
          <div className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Status Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {isValid ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 absolute top-0 left-0 rounded-full border border-dashed border-emerald-400/40 animate-rotate" />
                    </>
                  ) : isRevoked ? (
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-400">
                      <XCircle className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Verification Status</div>
                  <h1 className={`text-2xl font-black ${isValid ? "text-emerald-400" : isRevoked ? "text-red-400" : "text-amber-400"}`}>
                    {isValid ? "VERIFIED AUTHENTIC" : isRevoked ? "REVOKED" : "PENDING GENERATION"}
                  </h1>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center self-start md:self-auto font-mono text-xs">
                <span className="text-slate-400">ID: </span>
                <span className="text-slate-200 font-bold select-all">{cert.certificateCode}</span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" /> Recipient Name
                  </div>
                  <div className="text-xl font-bold text-white leading-tight">
                    {cert.recipientName || "Anonymous Participant"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" /> Hackathon Event
                  </div>
                  <div className="text-lg font-bold text-slate-200 leading-tight">
                    {cert.hackathonTitle || "Athenura Hackathon Series"}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-400" /> Certificate Type / Award
                  </div>
                  <div className="text-base font-bold text-slate-200">
                    {cert.certificateType === "winner" ? (
                      <span className="text-amber-400 font-extrabold uppercase tracking-wide">
                        🏆 Champion Winner {cert.rank && `(Rank #${cert.rank})`}
                      </span>
                    ) : cert.certificateType === "finalist" ? (
                      <span className="text-blue-400 font-extrabold uppercase tracking-wide">
                        ⭐ Finalist Qualifier
                      </span>
                    ) : cert.certificateType === "judge" ? (
                      <span className="text-emerald-400 font-extrabold uppercase tracking-wide">
                        ⚖️ Official Judge
                      </span>
                    ) : (
                      <span className="text-slate-300 font-extrabold uppercase tracking-wide">
                        🏅 Official Participant
                      </span>
                    )}
                    {cert.awardCategory && (
                      <div className="text-xs font-semibold text-slate-400 mt-1 italic">
                        Category: {cert.awardCategory}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" /> Date Issued
                  </div>
                  <div className="text-sm font-semibold text-slate-300">
                    {formatDate(cert.issuedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Revocation notice or metadata details */}
            {isRevoked && cert.revokedAt && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <div className="text-sm text-red-200">
                  <strong>Notice:</strong> This certificate was officially revoked on {formatDate(cert.revokedAt)}. It is no longer valid or recognized by the platform administration.
                </div>
              </div>
            )}

            {/* Cryptographic notice */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300 block mb-1">Cryptographic Digital Verification</span>
              This record is securely stored on the Hackathon-Athenura immutable registry. The certificate ID and associated metadata have been cross-referenced with authorized issuer signatures and validated for integrity. Forgery or tampering with this validation page is protected.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
