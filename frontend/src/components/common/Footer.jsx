import {
  Zap,
  ExternalLink,
  GitBranch,
  Briefcase,
  Globe,
  Code2,
  Users,
  Mail,
} from "lucide-react";

export default function Footer() {
  const NAV_COLS = [
    {
      heading: "Platform",
      links: ["Explore Hackathons", "Results", "Blog", "For Organizers"],
    },
    {
      heading: "Company",
      links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
    },
    {
      heading: "Resources",
      links: ["Documentation", "API", "Community", "Support"],
    },
  ];

  const SOCIALS = [
    { Icon: Globe, href: "#" },
    { Icon: Code2, href: "#" },
    { Icon: Users, href: "#" },
    { Icon: Mail, href: "#" },
  ];

  return (
    <footer
      style={{
        background: "#03045E",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        margin: 0,
      }}
    >
      {/* Top border shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(to right, transparent, rgba(0,180,216,0.6), rgba(144,224,239,0.9), rgba(0,180,216,0.6), transparent)",
        }}
      />

      {/* Dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow blobs */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(144,224,239,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Stats bar ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "28px 24px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        ></div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "52px 24px 44px",
          display: "grid",
          gridTemplateColumns: "1.6fr 2.4fr",
          gap: 80,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand col */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.3px",
              cursor: "default",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(0,180,216,0.18)",
                border: "1px solid rgba(0,180,216,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={18} color="#90E0EF" />
            </div>
            <span>Hackathon-Athenura</span>
          </div>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              lineHeight: 1.8,
              maxWidth: 290,
              marginBottom: 24,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            The world's leading platform for discovering and joining hackathons.
            Build, compete, and launch your next big idea.
          </p>

          {/* Socials */}
          <div style={{ display: "flex", gap: 8 }}>
            {SOCIALS.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,180,216,0.2)";
                  e.currentTarget.style.borderColor = "rgba(0,180,216,0.5)";
                  e.currentTarget.style.color = "#90E0EF";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links grid — pushed to the far right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            justifyContent: "end",
          }}
        >
          {NAV_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h5
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "rgba(0,180,216,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 18,
                  marginTop: 0,
                }}
              >
                {heading}
              </h5>
              {links.map((label) => (
                <a
                  key={label}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 12,
                    textDecoration: "none",
                    paddingLeft: 0,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.paddingLeft = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.paddingLeft = "0";
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            © 2026 Hackathon-Athenura. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.18)",
              margin: 0,
            }}
          >
            Made with passion for hackers worldwide · Powered by innovation
          </p>
        </div>
      </div>

      <style>{`
        @keyframes footerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        footer input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </footer>
  );
}
