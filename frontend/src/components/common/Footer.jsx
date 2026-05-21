import { Zap, ExternalLink, GitBranch, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-20 relative overflow-hidden"
      style={{
        background: "#03045E",
        color: "#ffffff",
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
            "linear-gradient(to right, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.7), rgba(255,255,255,0.4), transparent)",
        }}
      />

      {/* Subtle dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative glow blob */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: -60,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 24px 40px",
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: 60,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand */}
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
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 18px rgba(255,255,255,0.08)",
              }}
            >
              <Zap size={18} color="#ffffff" />
            </div>
            <span>Hackathon-Athenura</span>
          </div>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.75,
              maxWidth: 280,
              marginTop: 16,
              marginBottom: 20,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            The world's leading platform for discovering and joining hackathons.
            Build, compete, and launch your next big idea.
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            {[ExternalLink, GitBranch, Briefcase].map((Icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: 36,
                  height: 36,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.7)",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            {
              heading: "Platform",
              links: [
                "Explore Hackathons",
                "Results",
                "Blog",
                "For Organizers",
              ],
            },
            {
              heading: "Company",
              links: [
                "About Us",
                "Careers",
                "Privacy Policy",
                "Terms of Service",
              ],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h5
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
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
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: 11,
                    textDecoration: "none",
                    paddingLeft: 0,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.paddingLeft = "10px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
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

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "18px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 400,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            © 2025 Hackathon-Athenura. All rights reserved.
          </p>
          {/* Status pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ffffff",
                animation: "footerPulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.04em",
              }}
            >
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes footerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </footer>
  );
}
