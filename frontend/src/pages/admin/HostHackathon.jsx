import { useState } from "react";

const STEPS = ["Basics", "Details", "Prizes", "Review"];

const DOMAINS = [
  "AI / ML",
  "Blockchain",
  "CleanTech",
  "HealthTech",
  "FinTech",
  "EdTech",
  "Web3",
  "Cybersecurity",
  "Open Innovation",
  "Hardware",
  "Social Impact",
  "Gaming",
];

const FORMATS = [
  { id: "online", label: "Online", icon: "🌐" },
  { id: "in-person", label: "In-Person", icon: "📍" },
  { id: "hybrid", label: "Hybrid", icon: "🔀" },
];

function StepDot({ index, current, label }) {
  const done = index < current;
  const active = index === current;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        flex: 1,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: done
            ? "linear-gradient(135deg,#03045E,#0077B6)"
            : active
              ? "linear-gradient(135deg,#0077B6,#00B4D8)"
              : "rgba(3,4,94,0.08)",
          border: active
            ? "2px solid #00B4D8"
            : done
              ? "none"
              : "2px solid rgba(3,4,94,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: done || active ? "#CAF0F8" : "rgba(3,4,94,0.35)",
          fontFamily: "'Nunito',sans-serif",
          fontWeight: 800,
          fontSize: 13,
          boxShadow: active ? "0 0 16px rgba(0,180,216,0.4)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {done ? "✓" : index + 1}
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'Poppins',sans-serif",
          color: active ? "#0077B6" : done ? "#03045E" : "rgba(3,4,94,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "'Poppins',sans-serif",
        fontWeight: 600,
        fontSize: 13,
        color: "#03045E",
        marginBottom: 7,
        letterSpacing: "0.01em",
      }}
    >
      {children}
      {required && <span style={{ color: "#0077B6", marginLeft: 3 }}>*</span>}
    </label>
  );
}

const inputBase = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid rgba(0,180,216,0.3)",
  background: "rgba(202,240,248,0.5)",
  fontFamily: "'Poppins',sans-serif",
  fontSize: 14,
  color: "#03045E",
  outline: "none",
  transition: "all 0.2s ease",
};

function Input({ label, required, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label required={required}>{label}</Label>}
      <input
        {...props}
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        style={{
          ...inputBase,
          borderColor: focus ? "#0077B6" : "rgba(0,180,216,0.3)",
          boxShadow: focus ? "0 0 0 3px rgba(0,180,216,0.18)" : "none",
          ...props.style,
        }}
      />
    </div>
  );
}

function Textarea({ label, required, rows = 4, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label required={required}>{label}</Label>}
      <textarea
        {...props}
        rows={rows}
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        style={{
          ...inputBase,
          resize: "vertical",
          borderColor: focus ? "#0077B6" : "rgba(0,180,216,0.3)",
          boxShadow: focus ? "0 0 0 3px rgba(0,180,216,0.18)" : "none",
          ...props.style,
        }}
      />
    </div>
  );
}

function Select({ label, required, children, ...props }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label required={required}>{label}</Label>}
      <select
        {...props}
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        style={{
          ...inputBase,
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230077B6' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 36,
          borderColor: focus ? "#0077B6" : "rgba(0,180,216,0.3)",
          boxShadow: focus ? "0 0 0 3px rgba(0,180,216,0.18)" : "none",
          cursor: "pointer",
        }}
      >
        {children}
      </select>
    </div>
  );
}

function PrizeRow({ index, prize, onChange, onRemove }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 36px",
        gap: 10,
        alignItems: "end",
        marginBottom: 12,
      }}
    >
      <div>
        {index === 0 && <Label>Position</Label>}
        <input
          value={prize.position}
          onChange={(e) => onChange("position", e.target.value)}
          placeholder={
            index === 0
              ? "🥇 1st Place"
              : index === 1
                ? "🥈 2nd Place"
                : "🥉 3rd Place"
          }
          style={{ ...inputBase, borderColor: "rgba(0,180,216,0.3)" }}
        />
      </div>
      <div>
        {index === 0 && <Label>Prize / Reward</Label>}
        <input
          value={prize.reward}
          onChange={(e) => onChange("reward", e.target.value)}
          placeholder="$5,000 + mentorship"
          style={{ ...inputBase, borderColor: "rgba(0,180,216,0.3)" }}
        />
      </div>
      <button
        onClick={onRemove}
        style={{
          width: 36,
          height: 42,
          borderRadius: 9,
          border: "1.5px solid rgba(3,4,94,0.15)",
          background: "rgba(3,4,94,0.05)",
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(3,4,94,0.4)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(3,4,94,0.1)";
          e.currentTarget.style.color = "#03045E";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(3,4,94,0.05)";
          e.currentTarget.style.color = "rgba(3,4,94,0.4)";
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Review card ───────────────────────────────────────────
function ReviewSection({ title, children }) {
  return (
    <div
      style={{
        background: "rgba(202,240,248,0.5)",
        border: "1.5px solid rgba(0,180,216,0.25)",
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 16,
      }}
    >
      <h4
        style={{
          margin: "0 0 14px",
          fontFamily: "'Nunito',sans-serif",
          fontWeight: 800,
          fontSize: 13,
          color: "#0077B6",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
        gap: 12,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: "rgba(3,4,94,0.5)",
          fontFamily: "'Poppins',sans-serif",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#03045E",
          fontFamily: "'Poppins',sans-serif",
          textAlign: "right",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function HostHackathon() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [basics, setBasics] = useState({
    name: "",
    tagline: "",
    format: "",
    domain: "",
    website: "",
  });
  const [details, setDetails] = useState({
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxParticipants: "",
    teamSize: "",
    location: "",
    description: "",
    rules: "",
  });
  const [prizes, setPrizes] = useState([
    { position: "", reward: "" },
    { position: "", reward: "" },
    { position: "", reward: "" },
  ]);
  const [perks, setPerks] = useState("");

  const canNext = () => {
    if (step === 0) return basics.name && basics.format && basics.domain;
    if (step === 1)
      return details.startDate && details.endDate && details.description;
    return true;
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg,#CAF0F8 0%,#90E0EF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins',sans-serif",
          padding: 24,
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');`}</style>
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "56px 48px",
            textAlign: "center",
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 24px 80px rgba(3,4,94,0.12)",
            border: "1.5px solid rgba(0,180,216,0.2)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#0077B6,#00B4D8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 32,
              boxShadow: "0 0 32px rgba(0,180,216,0.4)",
            }}
          >
            🎉
          </div>
          <h2
            style={{
              fontFamily: "'Nunito',sans-serif",
              fontWeight: 800,
              fontSize: "1.7rem",
              color: "#03045E",
              margin: "0 0 12px",
            }}
          >
            Hackathon Submitted!
          </h2>
          <p
            style={{
              color: "rgba(3,4,94,0.6)",
              lineHeight: 1.7,
              margin: "0 0 32px",
              fontSize: 14,
            }}
          >
            <strong style={{ color: "#0077B6" }}>{basics.name}</strong> is under
            review. Our team will get back to you within 24–48 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setBasics({
                name: "",
                tagline: "",
                format: "",
                domain: "",
                website: "",
              });
            }}
            style={{
              padding: "12px 32px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg,#03045E,#0077B6 60%,#00B4D8)",
              color: "#CAF0F8",
              fontWeight: 700,
              fontFamily: "'Poppins',sans-serif",
              fontSize: 14,
              boxShadow: "0 4px 18px rgba(0,119,182,0.35)",
            }}
          >
            Host Another Hackathon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg,#CAF0F8 0%,#90E0EF 50%,#CAF0F8 100%)",
        fontFamily: "'Poppins',sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        input::placeholder, textarea::placeholder { color: rgba(3,4,94,0.3); }
        input:focus, textarea:focus, select:focus { outline: none; }

        .hh-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(0,180,216,0.2);
          border-radius: 20px;
          box-shadow: 0 8px 48px rgba(3,4,94,0.09), 0 1px 0 rgba(255,255,255,0.8) inset;
        }

        .hh-btn-primary {
          padding: 12px 28px;
          background: linear-gradient(135deg,#03045E,#0077B6 60%,#00B4D8);
          color: #CAF0F8;
          border: none;
          border-radius: 11px;
          font-weight: 700;
          font-family: 'Poppins',sans-serif;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(0,119,182,0.35);
          transition: all 0.2s ease;
        }
        .hh-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(0,119,182,0.45);
        }
        .hh-btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .hh-btn-ghost {
          padding: 12px 24px;
          background: rgba(202,240,248,0.6);
          color: #0077B6;
          border: 1.5px solid rgba(0,119,182,0.3);
          border-radius: 11px;
          font-weight: 600;
          font-family: 'Poppins',sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hh-btn-ghost:hover {
          background: rgba(144,224,239,0.7);
          border-color: #0077B6;
        }

        .domain-chip {
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid rgba(0,180,216,0.3);
          background: rgba(202,240,248,0.5);
          color: rgba(3,4,94,0.65);
          font-family: 'Poppins',sans-serif;
          transition: all 0.2s ease;
          user-select: none;
        }
        .domain-chip.active {
          background: linear-gradient(135deg,#0077B6,#00B4D8);
          color: #CAF0F8;
          border-color: transparent;
          box-shadow: 0 3px 12px rgba(0,119,182,0.3);
        }

        .format-card {
          flex: 1;
          padding: 16px 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(0,180,216,0.3);
          background: rgba(202,240,248,0.4);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          user-select: none;
        }
        .format-card.active {
          border-color: #0077B6;
          background: rgba(0,119,182,0.08);
          box-shadow: 0 0 0 3px rgba(0,180,216,0.18);
        }
        .format-card:hover:not(.active) {
          background: rgba(144,224,239,0.5);
        }

        .step-connector {
          height: 2px;
          background: rgba(0,180,216,0.2);
          flex: 1;
          margin-bottom: 20px;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* ── Top hero bar ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#03045E 0%,#0077B6 60%,#00B4D8 100%)",
          padding: "56px 24px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(rgba(202,240,248,0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: "20%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(0,180,216,0.25) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 14px",
              borderRadius: 20,
              background: "rgba(202,240,248,0.15)",
              border: "1px solid rgba(202,240,248,0.3)",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#90E0EF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              🚀 Organizer Portal
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Nunito',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              color: "#CAF0F8",
              margin: "0 0 12px",
              letterSpacing: "-0.5px",
            }}
          >
            Host a Hackathon
          </h1>
          <p
            style={{
              color: "rgba(202,240,248,0.7)",
              fontSize: 15,
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Launch your event, attract top builders, and make it unforgettable —
            in just a few steps.
          </p>
        </div>
      </div>

      {/* ── Main form area ── */}
      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}
      >
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: 36,
            gap: 0,
          }}
        >
          {STEPS.map((label, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
            >
              <StepDot index={i} current={step} label={label} />
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    height: 2,
                    flex: 1,
                    marginTop: 17,
                    background:
                      i < step
                        ? "linear-gradient(to right,#0077B6,#00B4D8)"
                        : "rgba(0,180,216,0.2)",
                    borderRadius: 2,
                    transition: "background 0.4s ease",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="hh-card" style={{ padding: "36px 40px" }}>
          {/* STEP 0 — BASICS */}
          {step === 0 && (
            <div>
              <h2
                style={{
                  fontFamily: "'Nunito',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  color: "#03045E",
                  margin: "0 0 6px",
                }}
              >
                Basic Information
              </h2>
              <p
                style={{
                  color: "rgba(3,4,94,0.5)",
                  fontSize: 13.5,
                  margin: "0 0 28px",
                  lineHeight: 1.6,
                }}
              >
                Tell us about your hackathon — this is what participants will
                see first.
              </p>

              <Input
                label="Hackathon Name"
                required
                placeholder="e.g. Ocean Hack 2025"
                value={basics.name}
                onChange={(e) =>
                  setBasics((p) => ({ ...p, name: e.target.value }))
                }
              />
              <Input
                label="Tagline"
                placeholder="One punchy sentence that captures the spirit"
                value={basics.tagline}
                onChange={(e) =>
                  setBasics((p) => ({ ...p, tagline: e.target.value }))
                }
              />
              <Input
                label="Official Website / Landing Page"
                placeholder="https://yourhackathon.com"
                value={basics.website}
                onChange={(e) =>
                  setBasics((p) => ({ ...p, website: e.target.value }))
                }
              />

              {/* Format */}
              <div style={{ marginBottom: 20 }}>
                <Label required>Format</Label>
                <div style={{ display: "flex", gap: 10 }}>
                  {FORMATS.map((f) => (
                    <div
                      key={f.id}
                      className={`format-card${basics.format === f.id ? " active" : ""}`}
                      onClick={() => setBasics((p) => ({ ...p, format: f.id }))}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4 }}>
                        {f.icon}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color:
                            basics.format === f.id
                              ? "#0077B6"
                              : "rgba(3,4,94,0.65)",
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        {f.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain chips */}
              <div style={{ marginBottom: 24 }}>
                <Label required>Domain / Track</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {DOMAINS.map((d) => (
                    <div
                      key={d}
                      className={`domain-chip${basics.domain === d ? " active" : ""}`}
                      onClick={() => setBasics((p) => ({ ...p, domain: d }))}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — DETAILS */}
          {step === 1 && (
            <div>
              <h2
                style={{
                  fontFamily: "'Nunito',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  color: "#03045E",
                  margin: "0 0 6px",
                }}
              >
                Event Details
              </h2>
              <p
                style={{
                  color: "rgba(3,4,94,0.5)",
                  fontSize: 13.5,
                  margin: "0 0 28px",
                }}
              >
                Dates, size limits, and everything participants need to plan
                ahead.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 20px",
                }}
              >
                <Input
                  label="Start Date"
                  required
                  type="date"
                  value={details.startDate}
                  onChange={(e) =>
                    setDetails((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
                <Input
                  label="End Date"
                  required
                  type="date"
                  value={details.endDate}
                  onChange={(e) =>
                    setDetails((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
                <Input
                  label="Registration Deadline"
                  type="date"
                  value={details.registrationDeadline}
                  onChange={(e) =>
                    setDetails((p) => ({
                      ...p,
                      registrationDeadline: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Max Participants"
                  type="number"
                  placeholder="e.g. 500"
                  value={details.maxParticipants}
                  onChange={(e) =>
                    setDetails((p) => ({
                      ...p,
                      maxParticipants: e.target.value,
                    }))
                  }
                />
              </div>

              <Select
                label="Team Size"
                value={details.teamSize}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, teamSize: e.target.value }))
                }
              >
                <option value="">Select team size…</option>
                <option value="solo">Solo only</option>
                <option value="1-3">1 – 3 members</option>
                <option value="2-4">2 – 4 members</option>
                <option value="3-5">3 – 5 members</option>
                <option value="any">Any size</option>
              </Select>

              {basics.format !== "online" && (
                <Input
                  label="Venue / Location"
                  placeholder="e.g. IIT Delhi, New Delhi"
                  value={details.location}
                  onChange={(e) =>
                    setDetails((p) => ({ ...p, location: e.target.value }))
                  }
                />
              )}

              <Textarea
                label="Description"
                required
                rows={5}
                placeholder="What's the theme? What problems will participants solve? Who should join?"
                value={details.description}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, description: e.target.value }))
                }
              />

              <Textarea
                label="Rules & Guidelines"
                rows={4}
                placeholder="Eligibility criteria, submission requirements, judging criteria…"
                value={details.rules}
                onChange={(e) =>
                  setDetails((p) => ({ ...p, rules: e.target.value }))
                }
              />
            </div>
          )}

          {/* STEP 2 — PRIZES */}
          {step === 2 && (
            <div>
              <h2
                style={{
                  fontFamily: "'Nunito',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  color: "#03045E",
                  margin: "0 0 6px",
                }}
              >
                Prizes & Perks
              </h2>
              <p
                style={{
                  color: "rgba(3,4,94,0.5)",
                  fontSize: 13.5,
                  margin: "0 0 28px",
                }}
              >
                Great prizes attract great talent. Cash, swag, mentorship — it
                all counts.
              </p>

              {/* Prize pool summary */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg,rgba(3,4,94,0.04),rgba(0,180,216,0.06))",
                  border: "1.5px solid rgba(0,180,216,0.25)",
                  borderRadius: 14,
                  padding: "16px 20px",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#0077B6,#00B4D8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🏆
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 13, color: "#03045E" }}
                  >
                    Prize Pool
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(3,4,94,0.5)",
                      marginTop: 2,
                    }}
                  >
                    Add at least one prize to attract top participants
                  </div>
                </div>
              </div>

              {prizes.map((p, i) => (
                <PrizeRow
                  key={i}
                  index={i}
                  prize={p}
                  onChange={(field, val) => {
                    const next = [...prizes];
                    next[i] = { ...next[i], [field]: val };
                    setPrizes(next);
                  }}
                  onRemove={() => {
                    if (prizes.length > 1)
                      setPrizes(prizes.filter((_, j) => j !== i));
                  }}
                />
              ))}

              <button
                onClick={() =>
                  setPrizes((p) => [...p, { position: "", reward: "" }])
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 16px",
                  borderRadius: 9,
                  border: "1.5px dashed rgba(0,180,216,0.4)",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#0077B6",
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: "'Poppins',sans-serif",
                  transition: "all 0.2s",
                  marginBottom: 28,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,180,216,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add
                another prize
              </button>

              <Textarea
                label="Additional Perks"
                rows={3}
                placeholder="e.g. Cloud credits, internship fast-tracks, swag bags, certificate of participation…"
                value={perks}
                onChange={(e) => setPerks(e.target.value)}
              />
            </div>
          )}

          {/* STEP 3 — REVIEW */}
          {step === 3 && (
            <div>
              <h2
                style={{
                  fontFamily: "'Nunito',sans-serif",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  color: "#03045E",
                  margin: "0 0 6px",
                }}
              >
                Review & Submit
              </h2>
              <p
                style={{
                  color: "rgba(3,4,94,0.5)",
                  fontSize: 13.5,
                  margin: "0 0 24px",
                }}
              >
                Everything look good? Hit submit and we'll review your hackathon
                within 24–48 hours.
              </p>

              <ReviewSection title="Basic Info">
                <ReviewRow label="Name" value={basics.name} />
                <ReviewRow label="Tagline" value={basics.tagline} />
                <ReviewRow
                  label="Format"
                  value={FORMATS.find((f) => f.id === basics.format)?.label}
                />
                <ReviewRow label="Domain" value={basics.domain} />
                <ReviewRow label="Website" value={basics.website} />
              </ReviewSection>

              <ReviewSection title="Event Details">
                <ReviewRow label="Start Date" value={details.startDate} />
                <ReviewRow label="End Date" value={details.endDate} />
                <ReviewRow
                  label="Registration Deadline"
                  value={details.registrationDeadline}
                />
                <ReviewRow
                  label="Max Participants"
                  value={details.maxParticipants}
                />
                <ReviewRow label="Team Size" value={details.teamSize} />
                {details.location && (
                  <ReviewRow label="Venue" value={details.location} />
                )}
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(3,4,94,0.45)",
                      marginBottom: 4,
                    }}
                  >
                    Description
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#03045E",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {details.description || "—"}
                  </p>
                </div>
              </ReviewSection>

              <ReviewSection title="Prizes">
                {prizes.filter((p) => p.position || p.reward).length === 0 ? (
                  <span style={{ fontSize: 13, color: "rgba(3,4,94,0.4)" }}>
                    No prizes added
                  </span>
                ) : (
                  prizes
                    .filter((p) => p.position || p.reward)
                    .map((p, i) => (
                      <ReviewRow
                        key={i}
                        label={p.position || `Prize ${i + 1}`}
                        value={p.reward}
                      />
                    ))
                )}
                {perks && <ReviewRow label="Additional Perks" value={perks} />}
              </ReviewSection>

              {/* Terms */}
              <div
                style={{
                  background: "rgba(0,180,216,0.06)",
                  border: "1px solid rgba(0,180,216,0.2)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginBottom: 8,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    color: "rgba(3,4,94,0.55)",
                    lineHeight: 1.6,
                  }}
                >
                  By submitting, you agree to HackWave's{" "}
                  <a
                    href="#"
                    style={{
                      color: "#0077B6",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Organizer Terms
                  </a>{" "}
                  and confirm that all provided information is accurate.
                </p>
              </div>
            </div>
          )}

          {/* ── Nav buttons ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid rgba(0,180,216,0.15)",
            }}
          >
            <button
              className="hh-btn-ghost"
              onClick={() =>
                step > 0 ? setStep((s) => s - 1) : (window.location.href = "/")
              }
            >
              {step === 0 ? "← Back to Home" : "← Previous"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(3,4,94,0.4)",
                  fontWeight: 500,
                }}
              >
                Step {step + 1} of {STEPS.length}
              </span>
              {step < STEPS.length - 1 ? (
                <button
                  className="hh-btn-primary"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext()}
                >
                  Next →
                </button>
              ) : (
                <button className="hh-btn-primary" onClick={handleSubmit}>
                  🚀 Submit Hackathon
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reassurance strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          {["Free to list", "24h review", "10k+ developers"].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12.5,
                fontWeight: 600,
                color: "rgba(3,4,94,0.5)",
              }}
            >
              <span style={{ color: "#00B4D8" }}>✓</span> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
