import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/common/Navbar";
import { hackathonService } from "../../services/hackathonService";
import api from "../../services/api";

const STEPS = ["Your Info", "Team Setup", "Confirm"];

// ── Dark page + light form card, same blue/cyan palette ──
const C = {
  // page (dark — matches HackathonDetail)
  pageBg: "linear-gradient(160deg, #0a1f6e 0%, #0e3a7a 50%, #0a2d6b 100%)",

  // outside-card text/elements (on dark bg)
  pageHeading: "#ffffff",
  pageMuted: "#90E0EF",
  badgeBg: "rgba(0,180,216,0.18)",
  badgeBorder: "#00B4D8",
  badgeText: "#CAF0F8",
  backBtnBg: "rgba(14,100,160,0.85)",
  backBtnBorder: "rgba(0,180,216,0.4)",
  backBtnText: "#CAF0F8",

  // stepper (sits on dark bg)
  stepDoneBg: "linear-gradient(135deg, #0077B6, #00B4D8)",
  stepActiveBg: "rgba(0,180,216,0.20)",
  stepActiveBorder: "#00B4D8",
  stepIdleBg: "rgba(202,240,248,0.07)",
  stepIdleBorder: "rgba(202,240,248,0.22)",
  stepDoneText: "#fff",
  stepActiveText: "#CAF0F8",
  stepIdleText: "rgba(202,240,248,0.4)",
  stepLabelActive: "#CAF0F8",
  stepLabelIdle: "rgba(202,240,248,0.4)",
  connectorDone: "linear-gradient(90deg, #0077B6, #00B4D8)",
  connectorIdle: "rgba(202,240,248,0.12)",

  // form card (light)
  cardBg: "#FFFFFF",
  cardBorder: "#B8E4F2",
  cardShadow: "0 8px 40px rgba(0,30,80,0.25)",
  sectionBg: "#F0FAFD",

  // inputs (light)
  inputBg: "#F5FBFE",
  inputBorder: "#90D4EA",
  inputText: "#0A3D5C",

  // labels/text inside card (light)
  labelText: "#1B6E95",
  mutedText: "#5A9BB5",
  headingText: "#023E5A",

  // accents (shared)
  accentBlue: "#0077B6",
  accentCyan: "#00B4D8",
  pillActiveBg: "linear-gradient(135deg, #0077B6, #00B4D8)",
  pillIdleBg: "#EBF7FC",
  pillIdleBorder: "#90D4EA",
  pillIdleText: "#1B6E95",

  // summary table (light)
  summaryEven: "#F0FAFD",
  summaryOdd: "#FAFEFF",
  summaryBorder: "#C8E9F5",

  // errors
  errorText: "#DC2626",
  errorBorder: "#FCA5A5",
};

export default function HackathonJoin() {
  const { id } = useParams();
  const routerNavigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [h, setH] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingTeams, setFetchingTeams] = useState(false);
  const [myTeams, setMyTeams] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [registrationResult, setRegistrationResult] = useState({});
  
  // Conditionally set STEPS based on hackathon mode
  const [STEPS, setSteps] = useState(["Your Info", "Team Setup", "Confirm"]);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.fullName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    college: user?.university || user?.college || "",
    github: "",
    teamName: "",
    teamId: "",
    teamMode: "join",
    inviteCode: "",
    teammates: [""],
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await hackathonService.getHackathonById(id);
        if (res.data && res.data.data) {
          const raw = res.data.data;
          
          const statusMap = { upcoming: 'upcoming', ongoing: 'ongoing', past: 'completed', judging: 'completed', draft: 'upcoming' };
          const status = statusMap[raw.status] || 'upcoming';
          
          // Determine fee correctly
          const fee = raw.registrationFee || (raw.soloFee || raw.teamFee || 0);
          
          const mapped = {
            id: raw._id,
            title: raw.title,
            status,
            fee: fee === 0 ? "Free" : `${raw.currency || 'INR'} ${fee}`,
            feeNum: fee,
            currency: raw.currency || 'INR',
            mode: raw.allowedModes?.[0]?.toLowerCase() || 'team', // Assuming 'solo' or 'team'
            teamSize: { min: raw.minTeamSize || 2, max: raw.maxTeamSize || 4 },
          };
          if (mounted) {
            setH(mapped);
            // Adjust steps
            if (mapped.mode === "solo") {
              setSteps(["Your Info", "Confirm"]);
              setForm(f => ({ ...f, teamMode: "solo" }));
            } else {
              setSteps(["Your Info", "Team Setup", "Confirm"]);
              setForm(f => ({ ...f, teamMode: "select" }));
            }
          }
        }
      } catch (err) {
        
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setFetchingTeams(true);
        const res = await api.get('/teams/me');
        if (res.data?.data) {
          // Filter teams for this hackathon
          const filtered = res.data.data.filter(t => t.hackathonId === id);
          setMyTeams(filtered);
          if (filtered.length > 0) {
            setForm(f => ({ ...f, teamId: filtered[0]._id, teamMode: "select" }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setFetchingTeams(false);
      }
    };
    if (id) fetchTeams();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me'); // Correct endpoint
        if (res.data?.data) {
          const u = res.data.data;
          setForm(f => ({
            ...f,
            name: u.fullName || u.name || "",
            email: u.email || "",
            college: u.university || u.college || "",
            phone: u.phone || ""
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && !form.name) {
      setForm(f => ({
        ...f,
        name: user.fullName || user.name || "",
        email: user.email || "",
        college: user.university || user.college || "",
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a1f6e 0%, #0e3a7a 50%, #0a2d6b 100%)",
        fontFamily: "'Poppins',sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          border: "4px solid rgba(255, 255, 255, 0.1)",
          borderTopColor: "#90E0EF",
          borderRadius: "50%",
          animation: "joinSpin 1s linear infinite",
          marginBottom: "20px"
        }} />
        <h3 style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.2 }}>
          Preparing Registration Form...
        </h3>
        <style>{`
          @keyframes joinSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!h) {
    return (
      <div
        style={{
          color: C.headingText,
          padding: 40,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Hackathon not found.
      </div>
    );
  }

  if (h.status === "past") {
    routerNavigate(`/hackathon/${id}`);
    return null;
  }

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
        e.email = "Valid email required";
      if (!form.college.trim()) e.college = "College/Organization is required";
    }
    if (step === 1 && h.mode === "team") {
      if (form.teamMode === "select" && !form.teamId)
        e.teamId = "Please select a team";
      if (form.teamMode === "join" && !form.inviteCode.trim())
        e.inviteCode = "Invite code is required";
    }
    if (step === 2) {
      if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    
    // Final step: submit to backend!
    setLoadingSubmit(true);
    setErrors({});
    try {
      if (form.teamMode === "solo") {
        // Solo registration
        const res = await hackathonService.register(id, { mode: "solo" });
        setRegistrationResult(res?.data?.data || {});
        setSubmitted(true);
      } else if (form.teamMode === "select") {
        // Register existing team
        const regRes = await hackathonService.register(id, {
          mode: "team",
          teamId: form.teamId
        });
        setRegistrationResult(regRes?.data?.data || {});
        setSubmitted(true);
      } else if (form.teamMode === "join") {
        // Join Team with Invite Code
        await api.post(`/teams/team-invitations/${form.inviteCode}/accept`);
        // After joining, we might need to fetch the team ID to register, 
        // but typically joining is its own step. 
        // The user probably wants to just join here.
        setSubmitted(true);
      }
    } catch (err) {
      
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0] || err.message || "Registration failed";
      setErrors({ apiError: msg });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: `1.5px solid ${hasError ? C.errorBorder : C.inputBorder}`,
    background: C.inputBg,
    color: C.inputText,
    fontSize: 14,
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  });

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: C.labelText,
    marginBottom: 6,
    fontFamily: "'Poppins', sans-serif",
  };

  const errorStyle = {
    fontSize: 11,
    color: C.errorText,
    margin: "4px 0 0",
    fontFamily: "'Poppins', sans-serif",
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(160deg, #0a1f6e 0%, #0e3a7a 50%, #0a2d6b 100%)",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 24px",
            marginTop: 56,
          }}
        >
          <div
            style={{
              textAlign: "center",
              background: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
              boxShadow: C.cardShadow,
              borderRadius: 28,
              padding: "60px 48px",
              maxWidth: 480,
              width: "100%",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
            <h2
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 30,
                color: C.headingText,
                margin: "0 0 12px",
              }}
            >
              You're Registered!
            </h2>
            
            {registrationResult.requiresPayment ? (
              <>
                <p style={{ color: C.mutedText, fontSize: 14, lineHeight: 1.7, margin: "0 0 8px" }}>
                  Your registration for <strong style={{ color: C.accentBlue }}>{h.title}</strong> is pending payment.
                </p>
                <p style={{ color: "#d97706", fontSize: 13, fontWeight: 600, margin: "0 0 36px" }}>
                  Please complete the entry fee payment of ${h.feeNum} to secure your spot.
                </p>
                <button
                  onClick={() => routerNavigate(`/payment/${registrationResult.registrationId}`)}
                  style={{
                    padding: "12px 28px", borderRadius: 12,
                    background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#fff",
                    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
                    border: "none", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(217,119,6,0.25)",
                  }}
                >
                  Proceed to Payment 💳
                </button>
              </>
            ) : (
              <>
                <p style={{ color: C.mutedText, fontSize: 14, lineHeight: 1.7, margin: "0 0 8px" }}>
                  Welcome to <strong style={{ color: C.accentBlue }}>{h.title}</strong>. A confirmation email has been sent to <strong style={{ color: C.headingText }}>{form.email}</strong>.
                </p>
                <p style={{ color: C.mutedText, fontSize: 13, margin: "0 0 36px", opacity: 0.75 }}>
                  Check your inbox for next steps and event details.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => routerNavigate(`/hackathon/${id}`)}
                    style={{
                      padding: "12px 28px", borderRadius: 12,
                      background: C.pillActiveBg, color: "#fff",
                      fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
                      border: "none", cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(0,119,182,0.25)",
                    }}
                  >
                    View Event Details
                  </button>
                  <button
                    onClick={() => routerNavigate("/dashboard")}
                    style={{
                      padding: "12px 28px", borderRadius: 12,
                      background: C.pillIdleBg, color: C.labelText,
                      fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15,
                      border: `1px solid ${C.pillIdleBorder}`, cursor: "pointer",
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #0a1f6e 0%, #0e3a7a 50%, #0a2d6b 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      

      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "100px 24px 60px" }}
      >
        {/* Back button */}
        <button
          onClick={() => routerNavigate(`/dashboard/hackathons/${id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 10,
            background: C.backBtnBg,
            border: `1px solid ${C.backBtnBorder}`,
            color: C.backBtnText,
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 28,
          }}
        >
          ← Back to Details
        </button>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: 999,
              background: C.badgeBg,
              border: `1px solid ${C.badgeBorder}`,
              color: C.badgeText,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 12,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {h.status === "ongoing"
              ? "🔴 Registering for Live Hackathon"
              : "Registering for Upcoming Hackathon"}
          </div>
          <h1
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 30,
              color: "#ffffff",
              margin: "0 0 6px",
              lineHeight: 1.2,
            }}
          >
            {h.title}
          </h1>
          <p style={{ margin: 0, color: "#90E0EF", fontSize: 14 }}>
            💳 Registration fee: 
            {h.fees?.solo > 0 && ` Solo: ${h.currency}${h.fees.solo}`}
            {h.fees?.team > 0 && ` Team: ${h.currency}${h.fees.team}`}
            {h.fees?.intern > 0 && ` Intern: ${h.currency}${h.fees.intern}`}
            {!h.fees?.solo && !h.fees?.team && !h.fees?.intern && " Free"}
          </p>
        </div>

        {/* Stepper */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 32 }}
        >
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: i < STEPS.length - 1 ? 1 : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 900,
                      fontSize: 14,
                      background: done
                        ? C.stepDoneBg
                        : active
                          ? C.stepActiveBg
                          : C.stepIdleBg,
                      border: done
                        ? "none"
                        : active
                          ? `2px solid ${C.stepActiveBorder}`
                          : `1.5px solid ${C.stepIdleBorder}`,
                      color: done
                        ? "#fff"
                        : active
                          ? "#CAF0F8"
                          : "rgba(202,240,248,0.4)",
                      boxShadow: active
                        ? "0 0 0 4px rgba(0,180,216,0.2)"
                        : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      marginTop: 5,
                      fontWeight: 600,
                      color: active ? "#CAF0F8" : "rgba(202,240,248,0.4)",
                      whiteSpace: "nowrap",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: done ? C.connectorDone : C.connectorIdle,
                      margin: "0 8px",
                      marginBottom: 20,
                      borderRadius: 2,
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div
          style={{
            borderRadius: 24,
            padding: 36,
            background: C.cardBg,
            border: `1px solid ${C.cardBorder}`,
            boxShadow: C.cardShadow,
          }}
        >
          {/* ── STEP 0: Your Info ── */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 20,
                  color: C.headingText,
                  margin: 0,
                }}
              >
                Your Information
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="John Doe"
                    style={inputStyle(errors.name)}
                  />
                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="john@example.com"
                    style={inputStyle(errors.email)}
                  />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 9876543210"
                    style={inputStyle(false)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>College / Organization *</label>
                  <input
                    value={form.college}
                    onChange={(e) => set("college", e.target.value)}
                    placeholder="IIT Delhi"
                    style={inputStyle(errors.college)}
                  />
                  {errors.college && <p style={errorStyle}>{errors.college}</p>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>GitHub Profile</label>
                <input
                  value={form.github}
                  onChange={(e) => set("github", e.target.value)}
                  placeholder="https://github.com/yourusername"
                  style={inputStyle(false)}
                />
              </div>
            </div>
          )}

          {/* ── STEP 1: Team Setup ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 20,
                  color: C.headingText,
                  margin: 0,
                }}
              >
                {h.mode === "solo" ? "Participation Details" : "Team Setup"}
              </h2>

              {h.mode === "solo" ? (
                <div
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: C.sectionBg,
                    border: `1px solid ${C.cardBorder}`,
                    color: C.inputText,
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  👤 This is a <strong>solo hackathon</strong>. You will compete
                  individually. No team setup required!
                </div>
              ) : (
                <>
                  <div>
                    <label style={labelStyle}>
                      How would you like to participate?
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { val: "select", label: "📋 Select Existing Team" },
                        { val: "join", label: "🔗 Join with Code" },
                      ].map(({ val, label }) => (
                        <button
                          key={val}
                          onClick={() => set("teamMode", val)}
                          style={{
                            flex: 1,
                            padding: "12px 0",
                            borderRadius: 12,
                            background:
                              form.teamMode === val
                                ? C.pillActiveBg
                                : C.pillIdleBg,
                            border:
                              form.teamMode === val
                                ? "none"
                                : `1.5px solid ${C.pillIdleBorder}`,
                            color:
                              form.teamMode === val ? "#fff" : C.pillIdleText,
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.teamMode === "select" ? (
                    <>
                      {fetchingTeams ? (
                        <div style={{ textAlign: "center", padding: 20, color: C.mutedText }}>
                          Loading your teams...
                        </div>
                      ) : myTeams.length > 0 ? (
                        <div>
                          <label style={labelStyle}>Select Your Team *</label>
                          <select
                            value={form.teamId}
                            onChange={(e) => set("teamId", e.target.value)}
                            style={inputStyle(errors.teamId)}
                          >
                            <option value="">-- Choose a team --</option>
                            {myTeams.map(t => (
                              <option key={t._id} value={t._id}>
                                {t.teamName} ({t.members?.length} members)
                              </option>
                            ))}
                          </select>
                          {errors.teamId && (
                            <p style={errorStyle}>{errors.teamId}</p>
                          )}
                          <p style={{ fontSize: 12, color: C.mutedText, marginTop: 8 }}>
                            Only teams created for <strong>{h.title}</strong> are shown here.
                          </p>
                          
                          {/* Show selected team details */}
                          {form.teamId && (
                            <div style={{ marginTop: 16, padding: 16, background: C.sectionBg, borderRadius: 12, border: `1px solid ${C.cardBorder}` }}>
                              <h4 style={{ margin: "0 0 8px", fontSize: 13, color: C.headingText }}>Selected Team Info:</h4>
                              <p style={{ margin: "0 0 4px", fontSize: 12, color: C.mutedText }}>
                                <strong>Leader:</strong> {myTeams.find(t => t._id === form.teamId)?.leader?.fullName || "You"}
                              </p>
                              <p style={{ margin: 0, fontSize: 12, color: C.mutedText }}>
                                <strong>Members:</strong> {myTeams.find(t => t._id === form.teamId)?.members?.map(m => m.userId?.fullName).join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ padding: 20, borderRadius: 16, background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", fontSize: 13 }}>
                          ⚠️ No teams found for this hackathon. 
                          <br />
                          <button 
                            onClick={() => routerNavigate("/dashboard/teams")}
                            style={{ background: "none", border: "none", padding: 0, color: C.accentBlue, textDecoration: "underline", cursor: "pointer", fontWeight: 600, marginTop: 8 }}
                          >
                            Go to Teams page to create one
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <label style={labelStyle}>Team Invite Code *</label>
                      <input
                        value={form.inviteCode}
                        onChange={(e) => set("inviteCode", e.target.value)}
                        placeholder="e.g. HACK-XY12"
                        style={inputStyle(errors.inviteCode)}
                      />
                      {errors.inviteCode && (
                        <p style={errorStyle}>{errors.inviteCode}</p>
                      )}
                      <p
                        style={{
                          fontSize: 12,
                          color: C.mutedText,
                          marginTop: 6,
                        }}
                      >
                        Ask your team leader for their invite code.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── STEP 2: Confirm ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 20,
                  color: C.headingText,
                  margin: 0,
                }}
              >
                Confirm Registration
              </h2>

              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${C.summaryBorder}`,
                }}
              >
                {[
                  { label: "Name", value: form.name },
                  { label: "Email", value: form.email },
                  { label: "College", value: form.college },
                  form.phone ? { label: "Phone", value: form.phone } : null,
                  form.github ? { label: "GitHub", value: form.github } : null,
                  h.mode === "team" && form.teamMode === "select"
                    ? { 
                        label: "Team Name", 
                        value: myTeams.find(t => t._id === form.teamId)?.teamName || "Selected Team" 
                      }
                    : null,
                  h.mode === "team" && form.teamMode === "join"
                    ? {
                        label: "Joining Team",
                        value: `Code: ${form.inviteCode}`,
                      }
                    : null,
                  {
                    label: "Entry Fee",
                    value: h.fee === 0 ? "Free 🎁" : `${h.fee}`,
                  },
                ]
                  .filter(Boolean)
                  .map((row, i, arr) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 18px",
                        background: i % 2 === 0 ? C.summaryEven : C.summaryOdd,
                        borderBottom:
                          i < arr.length - 1
                            ? `1px solid ${C.summaryBorder}`
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: C.mutedText,
                          fontWeight: 600,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: C.inputText,
                          fontWeight: 600,
                          maxWidth: "60%",
                          textAlign: "right",
                          wordBreak: "break-all",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
              </div>

              <label
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => set("agreeTerms", e.target.checked)}
                  style={{
                    marginTop: 2,
                    accentColor: C.accentBlue,
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: C.labelText,
                    lineHeight: 1.6,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  I agree to the{" "}
                  <span
                    style={{
                      color: C.accentBlue,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    terms and conditions
                  </span>{" "}
                  of this hackathon and confirm that all information provided is
                  accurate.
                </span>
              </label>
              {errors.agreeTerms && (
                <p style={{ ...errorStyle, marginTop: -12 }}>
                  {errors.agreeTerms}
                </p>
              )}
            </div>
          )}

          {errors.apiError && (
            <div style={{
              background: "#fef2f2",
              border: "1.5px solid #fca5a5",
              borderRadius: 12,
              padding: "12px 16px",
              color: "#dc2626",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 20,
              fontFamily: "'Poppins', sans-serif",
            }}>
              ⚠ {errors.apiError}
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              gap: 12,
            }}
          >
            {step > 0 ? (
              <button
                onClick={back}
                disabled={loadingSubmit}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  background: C.backBtnBg,
                  border: `1px solid ${C.backBtnBorder}`,
                  color: C.backBtnText,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: loadingSubmit ? "not-allowed" : "pointer",
                }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={next}
              disabled={loadingSubmit}
              onMouseEnter={(e) => {
                if (!loadingSubmit) {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,119,182,0.38)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingSubmit) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,119,182,0.28)";
                }
              }}
              style={{
                padding: "13px 32px",
                borderRadius: 12,
                background: loadingSubmit ? "#94a3b8" : C.pillActiveBg,
                color: "#fff",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 15,
                border: "none",
                cursor: loadingSubmit ? "not-allowed" : "pointer",
                boxShadow: loadingSubmit ? "none" : "0 6px 20px rgba(0,119,182,0.28)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              {loadingSubmit ? (
                "Processing..."
              ) : step === STEPS.length - 1 ? (
                h.feeNum === 0
                  ? "Complete Registration 🚀"
                  : `Pay ${h.fee} & Register 🚀`
              ) : (
                "Continue →"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
