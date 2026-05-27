const statusConfig = {
  upcoming: { label: "Upcoming", color: "#0077B6", dot: "#0077B6" },
  ongoing: { label: "🔴 Live", color: "#00B4D8", dot: "#34D399" },
  past: { label: "Ended", color: "#90E0EF", dot: "#94A3B8" },
};

export default function HackathonCard({ hackathon: h, navigate, index }) {
  const s = statusConfig[h.status];
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(h.deadline) - new Date()) / 86400000),
  );

  return (
    <div
      onClick={() => navigate(`/dashboard/hackathons/${h.id}`)}      style={{
        borderRadius: 24,
        overflow: "hidden",
        cursor: "pointer",
        background: "#ffffff",
        border: "1px solid rgba(0,119,182,0.12)",
        boxShadow: "0 4px 20px rgba(0,119,182,0.08)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 18px 50px rgba(0,119,182,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,119,182,0.08)";
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img
          src={h.image}
          alt={h.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        {/* subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(3,4,94,0.1) 0%, rgba(3,4,94,0.55) 100%)",
          }}
        />

        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            border: `1.5px solid ${s.color}`,
            backdropFilter: "blur(8px)",
            color: s.color,
            fontFamily: "Poppins,sans-serif",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: s.dot,
              display: "inline-block",
            }}
          />
          {s.label}
        </div>

        {/* Mode badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(0,119,182,0.2)",
            backdropFilter: "blur(8px)",
            color: "#0077B6",
            fontFamily: "Poppins,sans-serif",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {h.mode === "solo"
            ? "👤 Solo"
            : `👥 ${h.teamSize.min}–${h.teamSize.max}`}
        </div>

        {/* Domain tag */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            padding: "3px 10px",
            borderRadius: 6,
            background: "rgba(0,180,216,0.85)",
            color: "#ffffff",
            fontFamily: "Poppins,sans-serif",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {h.domain}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "20px 22px 22px", background: "#ffffff" }}>
        <h3
          style={{
            fontFamily: "Nunito,sans-serif",
            fontWeight: 900,
            fontSize: 18,
            color: "#03045E",
            margin: "0 0 4px",
          }}
        >
          {h.title}
        </h3>
        <p
          style={{
            fontFamily: "Poppins,sans-serif",
            fontSize: 12,
            color: "rgba(3,4,94,0.5)",
            margin: "0 0 12px",
          }}
        >
          {h.tagline}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {h.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "2px 8px",
                borderRadius: 6,
                fontFamily: "Poppins,sans-serif",
                fontSize: 10,
                background: "rgba(0,119,182,0.07)",
                color: "#0077B6",
                border: "1px solid rgba(0,119,182,0.15)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            paddingTop: 14,
            marginBottom: 18,
            borderTop: "1px solid rgba(0,119,182,0.1)",
          }}
        >
          {[
            {
              value: `$${h.prize.toLocaleString()}`,
              label: "Prize Pool",
              color: "#0077B6",
            },
            {
              value: h.fee === 0 ? "Free" : `$${h.fee}`,
              label: "Entry",
              color: h.fee === 0 ? "#059669" : "#D97706",
            },
            {
              value: h.participants.toLocaleString(),
              label: "Joined",
              color: "#03045E",
            },
          ].map(({ value, label, color }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "Nunito,sans-serif",
                  fontWeight: 900,
                  fontSize: 16,
                  color,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontSize: 10,
                  color: "rgba(3,4,94,0.4)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: "Poppins,sans-serif",
              fontSize: 11,
              color: "rgba(3,4,94,0.45)",
            }}
          >
            {h.status === "past" ? (
              `Ended ${h.endDate}`
            ) : (
              <span>
                ⏰{" "}
                <span
                  style={{
                    color: daysLeft <= 3 ? "#DC2626" : "#0077B6",
                    fontWeight: 600,
                  }}
                >
                  {daysLeft}d left
                </span>
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent double-firing with card onClick
              navigate(`/dashboard/hackathons/${h.id}`);
            }}
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              fontFamily: "Poppins,sans-serif",
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              background:
                h.status === "past"
                  ? "rgba(0,119,182,0.08)"
                  : "linear-gradient(135deg,#0077B6,#00B4D8)",
              color: h.status === "past" ? "#0077B6" : "white",
              border:
                h.status === "past" ? "1px solid rgba(0,119,182,0.2)" : "none",
              boxShadow:
                h.status !== "past" ? "0 4px 16px rgba(0,180,216,0.3)" : "none",
            }}
          >
            {h.status === "past" ? "View Results" : "Details →"}
          </button>
        </div>
      </div>
    </div>
  );
}
