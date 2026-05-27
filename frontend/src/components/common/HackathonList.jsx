import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hackathonService } from "../../services/hackathonService";
import { setHackathons, setLoading } from "../../store/hackathonSlice";
import HackathonCard from "./HackathonCard";
import HackathonFilters from "./HackathonFilters";
import Navbar from "./Navbar";

const domainImages = {
  "AI/ML": "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
  "Blockchain": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  "HealthTech": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  "Web3": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  "IoT": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
};

const domains = [
  "All",
  "AI/ML",
  "Blockchain",
  "HealthTech",
  "Cybersecurity",
  "Web3",
  "IoT",
  "Climate",
];
const statuses = ["all", "upcoming", "ongoing", "past"];
const modes = ["all", "solo", "team"];

const mapDbHackathon = (h) => {
  const domain = h.technologyDomains?.[0] || "AI/ML";
  const image = domainImages[domain] || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80";

  const formatYMD = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return {
    id: h._id,
    title: h.title,
    tagline: h.description ? (h.description.length > 80 ? h.description.substring(0, 77) + "..." : h.description) : "Innovative hackathon challenge",
    status: h.status === "draft" ? "upcoming" : (h.status === "judging" ? "ongoing" : h.status),
    mode: h.allowedModes?.[0]?.toLowerCase() || "team",
    prize: h.prizePool || 0,
    fee: h.registrationFee || 0,
    domain: domain,
    deadline: formatYMD(h.registrationDeadline || h.submissionDeadline),
    startDate: formatYMD(h.startDate),
    endDate: formatYMD(h.endDate),
    teamSize: { min: h.minTeamSize || 2, max: h.maxTeamSize || 4 },
    participants: 120,
    image: image,
    sponsors: h.sponsors?.map(s => typeof s === 'string' ? s : s?.name || "Sponsor") || ["Athenura"],
    tags: h.technologyDomains || [],
    description: h.description,
    rules: h.rules || [
      "All code must be original and created during the hackathon period",
      "Open-source libraries are permitted",
      "Submissions must include a working demo and GitHub repo"
    ],
    timeline: [
      { date: formatYMD(h.startDate), event: "Hackathon Kickoff" },
      { date: formatYMD(h.registrationDeadline), event: "Registration Deadline" },
      { date: formatYMD(h.submissionDeadline), event: "Submissions Deadline" },
      { date: formatYMD(h.endDate), event: "Winners Announced" }
    ]
  };
};

export default function HackathonList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hackathons, loading } = useSelector((state) => state.hackathon);

  const [filters, setFilters] = useState({
    status: "all",
    mode: "all",
    domain: "All",
    prizeMax: 100000,
    feeType: "all",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHackathons = async () => {
      dispatch(setLoading(true));
      try {
        const res = await hackathonService.getAllHackathons();
        if (res.data?.data) {
          const dbHacks = res.data.data.map(mapDbHackathon);
          dispatch(setHackathons(dbHacks));
        } else {
          dispatch(setHackathons([]));
        }
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        dispatch(setHackathons([]));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchHackathons();
  }, [dispatch]);

  const filtered = useMemo(() => {
    return hackathons.filter((h) => {
      if (filters.status !== "all" && h.status !== filters.status) return false;
      if (filters.mode !== "all" && h.mode !== filters.mode) return false;
      if (filters.domain !== "All" && h.domain !== filters.domain) return false;
      if (h.prize > filters.prizeMax) return false;
      if (filters.feeType === "free" && h.fee > 0) return false;
      if (filters.feeType === "paid" && h.fee === 0) return false;
      if (
        filters.search &&
        !h.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !(h.domain && h.domain.toLowerCase().includes(filters.search.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [filters, hackathons]);

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  // White pill button style for the dropdown filter panel
  const whitePill = (active) => ({
    padding: "7px 16px",
    borderRadius: 999,
    fontSize: 12,
    fontFamily: "Poppins,sans-serif",
    fontWeight: 600,
    cursor: "pointer",
    border: active ? "none" : "1.5px solid #e5e7eb",
    background: active ? "#6c63ff" : "#fff",
    color: active ? "#fff" : "#374151",
    transition: "all 0.15s",
  });
  const filterLabelStyle = {
    fontFamily: "Poppins,sans-serif",
    fontSize: 10,
    fontWeight: 700,
    color: "#9ca3af",
    letterSpacing: "0.07em",
    marginBottom: 8,
  };

  const statusColor = {
    upcoming: "#0077B6",
    ongoing: "#00B4D8",
    past: "#90E0EF",
  };
  const statusCounts = {
    all: hackathons.length,
    upcoming: hackathons.filter((h) => h.status === "upcoming").length,
    ongoing: hackathons.filter((h) => h.status === "ongoing").length,
    past: hackathons.filter((h) => h.status === "past").length,
  };

  const pill = (active, onClick, children, activeColor = "#0077B6") => ({
    onClick,
    style: {
      padding: "6px 14px",
      borderRadius: 999,
      fontSize: 12,
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      cursor: "pointer",
      border: active ? "none" : "1px solid rgba(202,240,248,0.15)",
      background: active ? activeColor : "rgba(202,240,248,0.06)",
      color: active ? "white" : "rgba(202,240,248,0.55)",
      transition: "all 0.2s",
    },
    children,
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ position: "relative", paddingTop: 56 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=70"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(160deg,rgba(3,4,94,0.92) 0%,rgba(0,119,182,0.6) 55%,rgba(0,180,216,0.4) 100%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 960,
            margin: "0 auto",
            padding: "60px 24px 72px",
            textAlign: "center",
          }}
        >
          {/* Live badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 16px",
              borderRadius: 999,
              marginBottom: 20,
              background: "rgba(202,240,248,0.1)",
              border: "1px solid rgba(202,240,248,0.22)",
              color: "#CAF0F8",
              fontFamily: "Poppins,sans-serif",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#34D399",
                display: "inline-block",
              }}
            />
            {statusCounts.ongoing} Hackathon
            {statusCounts.ongoing !== 1 ? "s" : ""} Live Now
          </span>

          <h1
            style={{
              fontFamily: "Nunito,sans-serif",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              fontSize: "clamp(1.9rem,4.5vw,3.5rem)",
              margin: "0 0 16px",
              textShadow: "0 4px 40px rgba(0,119,182,0.5)",
            }}
          >
            Build,Compete and
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,#CAF0F8,#00B4D8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Change the World.
            </span>
          </h1>

          <p
            style={{
              fontFamily: "Poppins,sans-serif",
              fontSize: 15,
              color: "rgba(202,240,248,0.78)",
              margin: "0 auto 32px",
              maxWidth: 520,
            }}
          >
            Discover world-class hackathons, compete with the best minds, and
            turn your ideas into reality.
          </p>

          {/* Search */}
          <div
            style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}
          >
            <svg
              style={{
                position: "absolute",
                left: 15,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="16"
              height="16"
              fill="none"
              stroke="#b4d2d7"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search hackathons, domains..."
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                paddingLeft: 44,
                paddingRight: 16,
                paddingTop: 13,
                paddingBottom: 13,
                borderRadius: 14,
                fontFamily: "Poppins,sans-serif",
                fontSize: 13,
                outline: "none",
                background: "rgba(21, 65, 106, 0.3)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(2, 34, 40, 0.22)",
                color: "white",
              }}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px 40px",
              marginTop: 44,
            }}
          >
            {[
              ["Hackathons", hackathons.length + "+"],
              ["Prize Pool", "$120K+"],
              ["Participants", "4,660+"],
              ["Countries", "60+"],
            ].map(([label, value]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "Nunito,sans-serif",
                    fontWeight: 900,
                    fontSize: 26,
                    color: "#f9fbfc",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "Poppins,sans-serif",
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <div
        style={{
          position: "sticky",
          top: 56,
          zIndex: 40,
          padding: "10px 24px",
          overflow: "visible",
          background: "rgba(3,4,94,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(202,240,248,0.09)",
        }}
      >
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {/* Status */}
            <div style={{ display: "flex", gap: 5 }}>
              {statuses.map((s) => (
                <button
                  key={s}
                  {...pill(
                    filters.status === s,
                    () => setFilter("status", s),
                    <>
                      {s}{" "}
                      {s !== "all" && (
                        <span style={{ opacity: 0.65 }}>
                          ({statusCounts[s]})
                        </span>
                      )}
                    </>,
                    statusColor[s] || "#0077B6",
                  )}
                />
              ))}
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
              {/* Mode */}
              {modes.map((m) => (
                <button
                  key={m}
                  {...pill(
                    filters.mode === m,
                    () => setFilter("mode", m),
                    m === "all" ? "All" : m === "solo" ? "👤 Solo" : "👥 Team",
                    "#00B4D8",
                  )}
                />
              ))}
              {/* More filters toggle */}
              <button
                {...pill(
                  showFilters,
                  () => setShowFilters(!showFilters),
                  `⚙️ Filters ${showFilters ? "▲" : "▼"}`,
                  "#0077B6",
                )}
              />
            </div>
          </div>

          {/* Click-outside overlay */}
          {showFilters && (
            <div
              onClick={() => setShowFilters(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 49,
              }}
            />
          )}
          {/* Extended filters – white card panel */}
          {showFilters && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                zIndex: 50,
                margin: "0 24px",
                borderRadius: 16,
                background: "#ffffff",
                boxShadow:
                  "0 8px 40px rgba(3,4,94,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                padding: "24px 28px 20px",
              }}
            >
              {/* Row 1: STATUS · MODE · ENTRY FEE · PRIZE POOL */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "24px 40px",
                  alignItems: "flex-start",
                  marginBottom: 22,
                }}
              >
                {/* STATUS */}
                <div>
                  <div style={filterLabelStyle}>STATUS</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilter("status", s)}
                        style={whitePill(filters.status === s)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        {s !== "all" && (
                          <span style={{ opacity: 0.55, marginLeft: 3 }}>
                            ({statusCounts[s]})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MODE */}
                <div>
                  <div style={filterLabelStyle}>MODE</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {modes.map((m) => (
                      <button
                        key={m}
                        onClick={() => setFilter("mode", m)}
                        style={whitePill(filters.mode === m)}
                      >
                        {m === "all"
                          ? "All"
                          : m === "solo"
                            ? "👤 Solo"
                            : "👥 Team"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ENTRY FEE */}
                <div>
                  <div style={filterLabelStyle}>ENTRY FEE</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      ["all", "All"],
                      ["free", "🎁 Free"],
                      ["paid", "💳 Paid"],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setFilter("feeType", val)}
                        style={whitePill(filters.feeType === val)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRIZE POOL */}
                <div style={{ minWidth: 200 }}>
                  <div style={filterLabelStyle}>
                    PRIZE POOL ·{" "}
                    <span style={{ color: "#6c63ff", fontWeight: 700 }}>
                      ${filters.prizeMax.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        fontFamily: "Poppins,sans-serif",
                      }}
                    >
                      $5K
                    </span>
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="5000"
                      value={filters.prizeMax}
                      onChange={(e) =>
                        setFilter("prizeMax", Number(e.target.value))
                      }
                      style={{
                        flex: 1,
                        accentColor: "#6c63ff",
                        cursor: "pointer",
                        height: 4,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        fontFamily: "Poppins,sans-serif",
                      }}
                    >
                      $100K
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{ height: 1, background: "#f0f0f5", margin: "0 0 18px" }}
              />

              {/* Row 2: TECHNOLOGY DOMAIN */}
              <div>
                <div style={filterLabelStyle}>TECHNOLOGY DOMAIN</div>
                <div
                  style={{
                    display: "flex",
                    gap: 7,
                    flexWrap: "wrap",
                    marginTop: 2,
                  }}
                >
                  {domains.map((d) => (
                    <button
                      key={d}
                      onClick={() => setFilter("domain", d)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontFamily: "Poppins,sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        border:
                          filters.domain === d
                            ? "2px solid #6c63ff"
                            : "1.5px solid #e5e7eb",
                        background:
                          filters.domain === d
                            ? "rgba(108,99,255,0.08)"
                            : "#fff",
                        color: filters.domain === d ? "#6c63ff" : "#374151",
                        transition: "all 0.15s",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div
        style={{ maxWidth: 1152, margin: "0 auto", padding: "36px 24px 60px" }}
      >
        <p
          style={{
            fontFamily: "Poppins,sans-serif",
            fontSize: 13,
            color: "rgba(202,240,248,0.55)",
            marginBottom: 20,
          }}
        >
          Showing <strong style={{ color: "white" }}>{filtered.length}</strong>{" "}
          hackathon{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🌊</div>
            <h3
              style={{
                fontFamily: "Nunito,sans-serif",
                fontWeight: 800,
                fontSize: 20,
                color: "white",
                margin: "0 0 8px",
              }}
            >
              No hackathons found
            </h3>
            <p
              style={{
                fontFamily: "Poppins,sans-serif",
                fontSize: 13,
                color: "rgba(202,240,248,0.45)",
              }}
            >
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%,340px),1fr))",
              gap: 22,
            }}
          >
            {filtered.map((h, i) => (
              <HackathonCard
                key={h.id}
                hackathon={h}
                navigate={navigate}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
