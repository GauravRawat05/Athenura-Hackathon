import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { hackathons } from "../../data/hackathons";

const statusConfig = {
  upcoming: { label: "Upcoming", color: "#0077B6", bg: "rgba(0,119,182,0.12)" },
  ongoing: {
    label: "🔴 Live Now",
    color: "#00B4D8",
    bg: "rgba(0,180,216,0.12)",
  },
  past: { label: "Ended", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
};

const TAB_ICONS = {
  overview: "◎",
  rules: "⬡",
  timeline: "◈",
  prizes: "◇",
  judging: "◉",
};

export default function HackathonDetail() {
  const { id } = useParams();
  const routerNavigate = useNavigate();
  const h = hackathons.find((hk) => String(hk.id) === String(id));
  if (!h)
    return (
      <div style={{ color: "#0077B6", padding: 40 }}>Hackathon not found.</div>
    );
  const [activeTab, setActiveTab] = useState("overview");
  const s = statusConfig[h.status];
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(h.deadline) - new Date()) / 86400000),
  );
  const tabs = ["overview", "rules", "timeline", "prizes", "judging"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #e8f4fd 0%, #f0f8ff 50%, #e0f2fe 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ── HERO ── */}
      <div
        style={{
          position: "relative",
          height: 280,
          marginTop: 56,
          overflow: "hidden",
        }}
      >
        <img
          src={h.image}
          alt={h.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10,31,110,0.05) 0%, rgba(10,31,110,0.45) 55%, rgba(10,31,110,0.85) 100%)",
          }}
        />

        <button
          onClick={() => routerNavigate("/hackathons")}
          style={{
            position: "absolute",
            top: 16,
            left: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,180,216,0.4)",
            color: "#0077B6",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 32px 28px",
            maxWidth: 1152,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <Pill bg={s.bg} border={s.color} color="#fff">
              {s.label}
            </Pill>
            <Pill bg="rgba(0,180,216,0.18)" border="#00B4D8" color="#CAF0F8">
              {h.domain}
            </Pill>
            <Pill
              bg="rgba(255,255,255,0.15)"
              border="rgba(255,255,255,0.35)"
              color="#fff"
            >
              {h.mode === "solo"
                ? "👤 Solo"
                : `👥 Team (${h.teamSize.min}–${h.teamSize.max})`}
            </Pill>
          </div>
          <h1
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 34,
              color: "#fff",
              margin: "0 0 4px",
              lineHeight: 1.2,
            }}
          >
            {h.title}
          </h1>
          <p style={{ margin: 0, color: "#e0f2fe", fontSize: 15 }}>
            {h.tagline}
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "32px 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 24,
        }}
      >
        {/* LEFT */}
        <div style={{ minWidth: 0 }}>
          {/* Tab Bar */}
          <div
            style={{
              display: "flex",
              marginBottom: 20,
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,180,216,0.25)",
              boxShadow: "0 2px 12px rgba(0,119,182,0.08)",
            }}
          >
            {tabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    background: active
                      ? "linear-gradient(135deg, #0077B6, #00B4D8)"
                      : "transparent",
                    color: active ? "#fff" : "#0077B6",
                    border: "none",
                    borderRight: "1px solid rgba(0,180,216,0.12)",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{TAB_ICONS[tab]}</span>
                  <span>{tab}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Card */}
          <div
            style={{
              borderRadius: 24,
              padding: 32,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,180,216,0.18)",
              boxShadow: "0 8px 40px rgba(0,119,182,0.08)",
            }}
          >
            {activeTab === "overview" && (
              <div>
                <SectionHeading>About This Hackathon</SectionHeading>
                <p
                  style={{
                    color: "#1e3a5f",
                    fontSize: 14,
                    lineHeight: 1.75,
                    marginBottom: 28,
                    marginTop: 0,
                  }}
                >
                  {h.description}
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    color: "#03045E",
                    fontSize: 14,
                    marginBottom: 12,
                    marginTop: 0,
                  }}
                >
                  Sponsors & Partners
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {h.sponsors.map((sp) => (
                    <div
                      key={sp}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        background: "rgba(0,180,216,0.08)",
                        border: "1px solid rgba(0,180,216,0.25)",
                        color: "#0077B6",
                      }}
                    >
                      {sp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "rules" && (
              <div>
                <SectionHeading>Rules & Guidelines</SectionHeading>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {h.rules.map((rule, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        padding: "14px 16px",
                        borderRadius: 16,
                        background: "rgba(0,180,216,0.06)",
                        border: "1px solid rgba(0,180,216,0.2)",
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #0077B6, #00B4D8)",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 900,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          color: "#1e3a5f",
                          fontSize: 14,
                          lineHeight: 1.6,
                          paddingTop: 4,
                        }}
                      >
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div>
                <SectionHeading>Event Timeline</SectionHeading>
                <div style={{ position: "relative", paddingLeft: 36 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 6,
                      bottom: 6,
                      width: 2,
                      background:
                        "linear-gradient(to bottom, #0077B6, #00B4D8, rgba(0,180,216,0.15))",
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 28,
                    }}
                  >
                    {h.timeline.map((item, i) => {
                      const isPast = new Date(item.date) < new Date();
                      return (
                        <div key={i} style={{ position: "relative" }}>
                          <div
                            style={{
                              position: "absolute",
                              left: -32,
                              top: 3,
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              background: isPast ? "#0077B6" : "#00B4D8",
                              border: `2px solid ${isPast ? "rgba(0,119,182,0.3)" : "#0077B6"}`,
                              boxShadow: `0 0 10px ${isPast ? "rgba(0,119,182,0.3)" : "rgba(0,180,216,0.5)"}`,
                            }}
                          />
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              marginBottom: 4,
                              background: "rgba(0,180,216,0.1)",
                              color: "#0077B6",
                              border: "1px solid rgba(0,180,216,0.25)",
                            }}
                          >
                            {item.date}
                          </span>
                          <div
                            style={{
                              fontFamily: "'Nunito', sans-serif",
                              fontWeight: 700,
                              fontSize: 15,
                              color: isPast ? "#64748b" : "#03045E",
                            }}
                          >
                            {item.event}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "prizes" && (
              <div>
                <SectionHeading>Prizes & Rewards</SectionHeading>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {h.prizes.map((prize, i) => {
                    const c = [
                      {
                        bg: "rgba(251,191,36,0.07)",
                        border: "rgba(251,191,36,0.3)",
                        accent: "#d97706",
                        icon: "🥇",
                      },
                      {
                        bg: "rgba(100,116,139,0.06)",
                        border: "rgba(100,116,139,0.2)",
                        accent: "#475569",
                        icon: "🥈",
                      },
                      {
                        bg: "rgba(0,180,216,0.07)",
                        border: "rgba(0,180,216,0.22)",
                        accent: "#0077B6",
                        icon: "🥉",
                      },
                    ][i] || {
                      bg: "rgba(0,180,216,0.07)",
                      border: "rgba(0,180,216,0.22)",
                      accent: "#0077B6",
                      icon: "🏅",
                    };
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 18,
                          padding: "18px 20px",
                          borderRadius: 18,
                          background: c.bg,
                          border: `1px solid ${c.border}`,
                        }}
                      >
                        <span style={{ fontSize: 36 }}>{c.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: "'Nunito', sans-serif",
                              fontWeight: 900,
                              fontSize: 24,
                              color: c.accent,
                            }}
                          >
                            {prize.amount}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                            }}
                          >
                            {prize.place} Place
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#475569",
                            textAlign: "right",
                          }}
                        >
                          {prize.perks}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "judging" && (
              <div>
                <SectionHeading>Judging Criteria</SectionHeading>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
                  {h.judging.map((j, i) => (
                    <div key={i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#1e3a5f",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {j.criterion}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 900,
                            fontSize: 14,
                            color: "#0077B6",
                          }}
                        >
                          {j.weight}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          borderRadius: 8,
                          background: "rgba(0,119,182,0.1)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: 8,
                            width: `${j.weight}%`,
                            background:
                              "linear-gradient(90deg, #0077B6, #00B4D8)",
                            boxShadow: "0 0 8px rgba(0,180,216,0.3)",
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* CTA Card */}
          <div
            style={{
              borderRadius: 24,
              padding: 24,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,180,216,0.25)",
              boxShadow: "0 8px 40px rgba(0,119,182,0.12)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 38,
                  color: "#0077B6",
                }}
              >
                ${h.prize.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 2,
                }}
              >
                Total Prize Pool
              </div>
            </div>

            {h.status !== "past" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Registration closes in
                  </span>
                  <span
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 900,
                      fontSize: 14,
                      color: daysLeft <= 3 ? "#ef4444" : "#03045E",
                    }}
                  >
                    {daysLeft}d
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 6,
                    background: "rgba(0,119,182,0.1)",
                    marginBottom: 20,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 6,
                      width: `${Math.max(5, 100 - daysLeft * 3)}%`,
                      background:
                        daysLeft <= 3
                          ? "#ef4444"
                          : "linear-gradient(90deg, #0077B6, #00B4D8)",
                    }}
                  />
                </div>
              </>
            )}

            <button
              onClick={() =>
                h.status !== "past" && routerNavigate(`/hackathons/${id}/join`)
              }
              onMouseEnter={(e) => {
                if (h.status !== "past")
                  e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 14,
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 16,
                border: "none",
                cursor: h.status === "past" ? "default" : "pointer",
                transition: "transform 0.15s",
                background:
                  h.status === "past"
                    ? "rgba(0,119,182,0.08)"
                    : "linear-gradient(135deg, #0077B6, #00B4D8)",
                color: h.status === "past" ? "#0077B6" : "#fff",
                boxShadow:
                  h.status !== "past"
                    ? "0 8px 24px rgba(0,119,182,0.35)"
                    : "none",
              }}
            >
              {h.status === "past"
                ? "View Past Results"
                : h.status === "ongoing"
                  ? "Join Now 🚀"
                  : "Register Free →"}
            </button>

            {h.fee > 0 && h.status !== "past" && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "#64748b",
                  margin: "10px 0 0",
                }}
              >
                Registration fee:{" "}
                <span style={{ color: "#d97706" }}>${h.fee}</span> per{" "}
                {h.mode === "solo" ? "person" : "team"}
              </p>
            )}
          </div>

          {/* Quick Info Card */}
          <div
            style={{
              borderRadius: 24,
              padding: "8px 20px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,180,216,0.18)",
              boxShadow: "0 4px 20px rgba(0,119,182,0.07)",
            }}
          >
            {[
              { icon: "📅", label: "Start Date", value: h.startDate },
              { icon: "🏁", label: "End Date", value: h.endDate },
              {
                icon: "👥",
                label: "Participants",
                value: h.participants.toLocaleString() + "+",
              },
              {
                icon: "💰",
                label: "Entry Fee",
                value: h.fee === 0 ? "Free" : `$${h.fee}`,
              },
              {
                icon: "🎯",
                label: "Mode",
                value:
                  h.mode === "solo"
                    ? "Solo"
                    : `Team (${h.teamSize.min}–${h.teamSize.max})`,
              },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom:
                    i < arr.length - 1
                      ? "1px solid rgba(0,180,216,0.1)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    width: 28,
                    flexShrink: 0,
                    textAlign: "center",
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      marginBottom: 1,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#03045E" }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 900,
        fontSize: 22,
        color: "#03045E",
        margin: "0 0 20px",
        letterSpacing: "-0.3px",
      }}
    >
      {children}
    </h2>
  );
}

function Pill({ bg, border, color, children }) {
  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        border: `1px solid ${border}`,
        color,
      }}
    >
      {children}
    </span>
  );
}
