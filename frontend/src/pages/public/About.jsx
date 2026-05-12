import { useState, useEffect, useRef } from "react";

const C = {
    navy: "#03045E",
    ocean: "#0077B6",
    cyan: "#00B4D8",
    sky: "#90E0EF",
    mist: "#CAF0F8",
};

/* ── tiny SVG icon wrapper ── */
function Icon({ children, size = 22, color = C.cyan, stroke = 2 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );
}

/* ── intersection-observer fade-in ── */
function useInView(threshold = 0.12) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, [threshold]);
    return [ref, vis];
}
function Fade({ children, delay = 0, y = 32, className = "" }) {
    const [ref, vis] = useInView();
    return (
        <div ref={ref} className={className} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : `translateY(${y}px)`,
            transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${delay}s, transform .75s cubic-bezier(.22,1,.36,1) ${delay}s`,
        }}>{children}</div>
    );
}

/* ── ticker counter ── */
function Counter({ to, suffix = "" }) {
    const [val, setVal] = useState(0);
    const [ref, vis] = useInView();
    useEffect(() => {
        if (!vis) return;
        let start = null;
        const dur = 1400;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            setVal(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [vis, to]);
    return <span ref={ref}>{val}{suffix}</span>;
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const features = [
    { icon: <Icon><path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" /></Icon>, title: "End-to-End Lifecycle", desc: "From hackathon creation to certificate generation — every stage in one unified platform." },
    { icon: <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></Icon>, title: "Solo & Team Modes", desc: "Flexible registration supporting individual participants and collaborative team-based entries." },
    { icon: <Icon><path d="M4 19V7l8-4 8 4v12" /><path d="M4 7l8 4 8-4M12 11v8M8 15h8" /></Icon>, title: "University Dashboards", desc: "Institutional portals for MDU, DTU and more — track performance and export analytics." },
    { icon: <Icon><path d="M12 2l2.6 5.3L20 8.2l-4 3.9 1 5.9L12 15.9 7 18l1-5.9-4-3.9 5.4-.9L12 2z" /></Icon>, title: "Judging & Scoring", desc: "Configurable rubrics, weighted scores, and automated tie-breaking for fair outcomes." },
    { icon: <Icon><path d="M6 3h12v18H6z" /><path d="M9 7h6M8 11h8M9 15h6" /></Icon>, title: "Auto Certificates", desc: "Participation and rank certificates generated as signed PDFs with QR-code verification." },
    { icon: <Icon><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 14h3" /></Icon>, title: "Payment Integration", desc: "Razorpay-powered registration fees with real-time webhook confirmation and refund tracking." },
];

const stack = [
    { name: "MongoDB", role: "Database", letter: "M" },
    { name: "Express", role: "Backend API", letter: "E" },
    { name: "React.js", role: "Frontend SPA", letter: "R" },
    { name: "Node.js", role: "Runtime", letter: "N" },
    { name: "Socket.IO", role: "Real-time", letter: "S" },
    { name: "Cloudinary", role: "File Storage", letter: "C" },
    { name: "Razorpay", role: "Payments", letter: "R" },
    { name: "Puppeteer", role: "PDF Engine", letter: "P" },
];

const roles = [
    { role: "Participant", perks: ["Browse & join hackathons", "Submit projects with demo links", "Download signed certificates", "View live leaderboard & rankings"] },
    { role: "Administrator", perks: ["Full hackathon CRUD control", "Manage users, judges & teams", "Declare winners & send notifications", "Export analytics reports"] },
    { role: "University", perks: ["Student performance dashboard", "Participation metrics & trends", "Auto domain-linked institution reports", "Download institutional summaries"] },
    { role: "Judge", perks: ["Access assigned submissions only", "Rubric-based weighted scoring", "Add qualitative review comments", "Score aggregation & tie-breaking"] },
];

const journey = [
    { n: "01", t: "Register", d: "Sign up and verify your email to activate your HackForge account." },
    { n: "02", t: "Discover", d: "Browse hackathons filtered by mode, domain, prize pool, or date." },
    { n: "03", t: "Team Up", d: "Go solo or create a team — invite members by email in real-time." },
    { n: "04", t: "Pay & Join", d: "Complete registration with Razorpay payment (if applicable)." },
    { n: "05", t: "Submit", d: "Upload GitHub repo, live demo URL, and project walkthrough video." },
    { n: "06", t: "Evaluated", d: "Judges score submissions; system aggregates weighted rubric scores." },
    { n: "07", t: "Certified", d: "Results declared — download your participation or rank certificate." },
];

const roadmap = [
    "AI-based team formation by complementary skills",
    "Real-time leaderboard with live score updates",
    "Integrated team chat & collaboration tools",
    "Online sandbox code editor for preliminary rounds",
    "GitHub API integration for repo verification",
    "Mobile app via React Native",
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AboutPage() {
    const [activeRole, setActiveRole] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <div style={{ fontFamily: "'Cabinet Grotesk','Clash Display','DM Sans',sans-serif", background: C.mist, color: C.navy, overflowX: "hidden" }}>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { -webkit-font-smoothing: antialiased; }

        ::selection { background: ${C.cyan}44; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.mist}; }
        ::-webkit-scrollbar-thumb { background: ${C.ocean}; border-radius: 4px; }

        /* ── noise overlay utility ── */
        .noise::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: .35;
          mix-blend-mode: overlay;
        }

        /* ── glass card ── */
        .glass {
          background: rgba(255,255,255,.45);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(0,119,182,.14);
        }
        .glass-dark {
          background: rgba(3,4,94,.35);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(144,224,239,.18);
        }

        /* ── nav ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; height: 66px;
          transition: background .4s, box-shadow .4s;
        }
        .nav.scrolled {
          background: rgba(3,4,94,.82);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 32px rgba(0,0,0,.22);
        }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a {
          font-size: 13px; font-weight: 600; letter-spacing: .06em;
          text-transform: uppercase; color: ${C.sky};
          text-decoration: none; opacity: .75;
          transition: opacity .2s, color .2s;
        }
        .nav-links a:hover { opacity: 1; color: ${C.cyan}; }

        /* ── buttons ── */
        .btn-primary {
          background: linear-gradient(135deg, ${C.ocean} 0%, ${C.cyan} 100%);
          color: ${C.navy}; font-weight: 700; font-size: 14px;
          border: none; border-radius: 50px; padding: 14px 38px;
          cursor: pointer; letter-spacing: .04em;
          box-shadow: 0 6px 36px ${C.cyan}44;
          transition: transform .2s, box-shadow .2s, filter .2s;
          font-family: inherit;
        }
        .btn-primary:hover { transform: translateY(-3px) scale(1.03); filter: brightness(1.08); box-shadow: 0 12px 48px ${C.cyan}55; }

        .btn-ghost {
          background: transparent; color: ${C.sky};
          border: 1.5px solid ${C.ocean}88; border-radius: 50px;
          padding: 13px 34px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background .2s, border-color .2s, color .2s;
          font-family: inherit;
        }
        .btn-ghost:hover { background: rgba(0,180,216,.12); border-color: ${C.cyan}; color: ${C.mist}; }

        /* ── feature card ── */
        .fcard {
          border-radius: 22px; padding: 34px 28px;
          transition: transform .3s, box-shadow .3s, border-color .3s;
          border: 1px solid rgba(0,180,216,.1);
          background: rgba(255,255,255,.5);
          backdrop-filter: blur(14px);
          position: relative; overflow: hidden;
        }
        .fcard::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, ${C.ocean}, ${C.cyan});
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s;
        }
        .fcard:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(0,119,182,.14); border-color: ${C.cyan}55; }
        .fcard:hover::before { transform: scaleX(1); }

        /* ── stack pill ── */
        .spill {
          border-radius: 18px; padding: 22px 16px; text-align: center;
          border: 1px solid rgba(0,119,182,.15);
          background: rgba(255,255,255,.4);
          backdrop-filter: blur(10px);
          transition: transform .25s, box-shadow .25s, background .25s;
          cursor: default;
        }
        .spill:hover { transform: translateY(-5px) scale(1.04); background: rgba(0,180,216,.1); box-shadow: 0 12px 40px rgba(0,119,182,.14); }

        /* ── role tab ── */
        .rtab {
          padding: 10px 26px; border-radius: 50px;
          font-size: 13px; font-weight: 700; letter-spacing: .04em;
          cursor: pointer; border: 1.5px solid rgba(0,119,182,.25);
          background: transparent; color: ${C.ocean};
          transition: all .25s; font-family: inherit;
        }
        .rtab.active {
          background: linear-gradient(135deg, ${C.ocean}, ${C.cyan});
          color: ${C.navy}; border-color: transparent;
          box-shadow: 0 6px 28px ${C.cyan}44;
        }
        .rtab:not(.active):hover { background: rgba(0,180,216,.1); border-color: ${C.cyan}66; }

        /* ── perk row ── */
        .perk {
          display: flex; align-items: center; gap: 14px;
          background: rgba(0,180,216,.07);
          border: 1px solid rgba(0,180,216,.12);
          border-radius: 12px; padding: 13px 18px;
          transition: background .2s, transform .2s;
        }
        .perk:hover { background: rgba(0,180,216,.14); transform: translateX(4px); }

        /* ── journey step ── */
        .jstep {
          display: flex; gap: 20px; align-items: flex-start;
          position: relative;
        }
        .jstep + .jstep { margin-top: 12px; }

        /* ── roadmap item ── */
        .ritem {
          display: flex; align-items: center; gap: 14px;
          border-radius: 14px; padding: 18px 22px;
          border: 1px solid rgba(0,119,182,.14);
          background: rgba(255,255,255,.45);
          backdrop-filter: blur(10px);
          transition: background .2s, transform .2s, box-shadow .2s;
        }
        .ritem:hover { background: rgba(0,180,216,.1); transform: translateX(6px); box-shadow: 4px 0 24px rgba(0,119,182,.1); }

        /* ── section label ── */
        .sec-label {
          font-size: 11px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: ${C.ocean};
          margin-bottom: 14px; display: block;
        }

        /* ── divider ── */
        .div {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C.ocean}22, transparent);
        }

        /* ── floating blobs (hero) ── */
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.06)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,24px) scale(1.04)} }
        .blob1 { animation: blob1 9s ease-in-out infinite; }
        .blob2 { animation: blob2 11s ease-in-out infinite; }

        /* ── number ticker font ── */
        .mono { font-family: 'DM Mono', monospace; }

        /* ── marquee band ── */
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .marquee-track { animation: marquee 22s linear infinite; display: flex; white-space: nowrap; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── heading font ── */
        h1,h2,h3 { font-family: 'Space Grotesk', sans-serif; }

        /* ── step number line ── */
        .step-line {
          position: absolute; left: 27px; top: 60px; bottom: -12px;
          width: 2px;
          background: linear-gradient(180deg, ${C.ocean}55, transparent);
        }

        @media (max-width: 600px) {
          .nav-links { display: none; }
          .stats-row > div { padding: 20px 28px !important; }
        }
      `}</style>

            {/* ══ NAV ══ */}
            <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={17} color={C.navy} stroke={2.8}><path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" /></Icon>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: C.mist, letterSpacing: "-.01em" }}>Hack<span style={{ color: C.cyan }}>Forge</span></span>
                </div>
                <nav className="nav-links">
                    {["Features", "Stack", "Roles", "Journey", "Roadmap"].map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
                    ))}
                </nav>
                <button className="btn-primary" style={{ padding: "10px 26px", fontSize: 13 }}>Get Started</button>
            </nav>

            {/* ══ HERO ══ */}
            <section className="noise" style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "130px 5% 90px",
                position: "relative", overflow: "hidden",
                background: `linear-gradient(160deg, ${C.navy} 0%, #021459 55%, #032280 100%)`,
            }}>
                {/* decorative blobs */}
                <div className="blob1" style={{ position: "absolute", top: "-80px", right: "-120px", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.cyan}22 0%, transparent 68%)`, pointerEvents: "none" }} />
                <div className="blob2" style={{ position: "absolute", bottom: "-100px", left: "-80px", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${C.ocean}28 0%, transparent 68%)`, pointerEvents: "none" }} />
                {/* grid overlay */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,180,216,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,.04) 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <div className="glass-dark" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 20px", borderRadius: 50, marginBottom: 30, fontSize: 12, fontWeight: 700, color: C.sky, letterSpacing: ".1em", textTransform: "uppercase" }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.cyan, display: "inline-block", boxShadow: `0 0 8px ${C.cyan}` }} />
                            Built on MERN · Open Platform
                        </div>
                    </Fade>

                    <Fade delay={.1}>
                        <h1 style={{ fontSize: "clamp(44px,7.5vw,96px)", fontWeight: 700, lineHeight: 1.03, letterSpacing: "-.03em", color: C.mist, maxWidth: 860, margin: "0 auto 24px" }}>
                            The Platform That{" "}
                            <span style={{ background: `linear-gradient(135deg,${C.cyan},${C.sky})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Powers Hackathons
                            </span>
                        </h1>
                    </Fade>

                    <Fade delay={.2}>
                        <p style={{ fontSize: "clamp(16px,2vw,20px)", color: `${C.sky}cc`, maxWidth: 580, lineHeight: 1.8, margin: "0 auto 48px", fontWeight: 300 }}>
                            HackForge is a complete, scalable management system for organising and running hackathons of any size — from team formation to certified winners.
                        </p>
                    </Fade>

                    <Fade delay={.3}>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <button className="btn-primary">Explore Platform</button>
                            <button className="btn-ghost">View Documentation</button>
                        </div>
                    </Fade>

                    {/* ── stats strip ── */}
                    <Fade delay={.45}>
                        <div className="stats-row glass-dark" style={{ display: "inline-flex", borderRadius: 20, overflow: "hidden", marginTop: 80, flexWrap: "wrap", justifyContent: "center" }}>
                            {[
                                { num: 4, suffix: "", label: "User Roles" },
                                { num: 12, suffix: "+", label: "Core Features" },
                                { num: 100, suffix: "%", label: "Automated Certs" },
                                { num: 8, suffix: "×", label: "Tech Stack" },
                            ].map((s, i, arr) => (
                                <div key={s.label} style={{ padding: "26px 48px", borderRight: i < arr.length - 1 ? `1px solid rgba(144,224,239,.12)` : "none", textAlign: "center" }}>
                                    <div className="mono" style={{ fontSize: 34, fontWeight: 500, color: C.cyan, lineHeight: 1 }}>
                                        <Counter to={s.num} suffix={s.suffix} />
                                    </div>
                                    <div style={{ fontSize: 11, color: C.sky, marginTop: 6, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </Fade>
                </div>
            </section>

            {/* ══ MARQUEE BAND ══ */}
            <div style={{ background: C.ocean, padding: "14px 0", overflow: "hidden", position: "relative" }}>
                <div className="marquee-track">
                    {[...Array(2)].map((_, ri) =>
                        ["Hackathon Management", "Team Formation", "Live Judging", "Auto Certificates", "Razorpay Payments", "University Dashboards", "Real-time Updates", "Role-based Access", "PDF Generation", "Socket.IO", "MongoDB", "JWT Auth"].map((t, i) => (
                            <span key={`${ri}-${i}`} style={{ color: C.mist, fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginRight: 48 }}>
                                {t} <span style={{ color: `${C.cyan}`, marginRight: 48 }}>✦</span>
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ══ FEATURES ══ */}
            <section id="features" style={{ padding: "110px 5%", background: C.mist }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 72 }}>
                        <span className="sec-label">What We Offer</span>
                        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: C.navy, letterSpacing: "-.025em", lineHeight: 1.1 }}>
                            Every Tool You <span style={{ color: C.ocean }}>Need</span>
                        </h2>
                    </div>
                </Fade>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
                    {features.map((f, i) => (
                        <Fade key={f.title} delay={i * .07}>
                            <div className="fcard">
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${C.ocean}18`, border: `1px solid ${C.ocean}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 10, letterSpacing: "-.01em" }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: C.ocean, lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            <div className="div" />

            {/* ══ STACK ══ */}
            <section id="stack" style={{ padding: "110px 5%", background: C.sky }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 68 }}>
                        <span className="sec-label">Technology</span>
                        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: C.navy, letterSpacing: "-.025em" }}>
                            Built With the <span style={{ color: C.ocean }}>Best</span>
                        </h2>
                    </div>
                </Fade>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 14, maxWidth: 920, margin: "0 auto" }}>
                    {stack.map((s, i) => (
                        <Fade key={s.name} delay={i * .06}>
                            <div className="spill">
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, fontWeight: 800, color: C.navy, fontFamily: "'Space Grotesk',sans-serif" }}>
                                    {s.letter}
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{s.name}</div>
                                <div style={{ fontSize: 11, color: C.ocean, marginTop: 4, letterSpacing: ".05em" }}>{s.role}</div>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            <div className="div" />

            {/* ══ ROLES ══ */}
            <section id="roles" style={{ padding: "110px 5%", background: C.mist }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 52 }}>
                        <span className="sec-label">Access Control</span>
                        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: C.navy, letterSpacing: "-.025em" }}>
                            Four Distinct <span style={{ color: C.ocean }}>Roles</span>
                        </h2>
                    </div>
                </Fade>

                <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
                    {roles.map((r, i) => (
                        <button key={r.role} className={`rtab ${activeRole === i ? "active" : ""}`} onClick={() => setActiveRole(i)}>
                            {r.role}
                        </button>
                    ))}
                </div>

                <Fade>
                    <div className="glass" style={{ maxWidth: 600, margin: "0 auto", borderRadius: 28, padding: "44px 48px" }}>
                        <h3 style={{ fontSize: 26, fontWeight: 700, color: C.navy, marginBottom: 28, letterSpacing: "-.02em", textAlign: "center" }}>
                            {roles[activeRole].role}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {roles[activeRole].perks.map(p => (
                                <div key={p} className="perk">
                                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: C.navy, fontWeight: 900 }}>✓</div>
                                    <span style={{ fontSize: 14, color: C.ocean, fontWeight: 400, lineHeight: 1.5 }}>{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Fade>
            </section>

            <div className="div" />

            {/* ══ JOURNEY ══ */}
            <section id="journey" style={{ padding: "110px 5%", background: C.sky }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 72 }}>
                        <span className="sec-label">Participant Journey</span>
                        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: C.navy, letterSpacing: "-.025em" }}>
                            From Sign-Up to <span style={{ color: C.ocean }}>Certificate</span>
                        </h2>
                    </div>
                </Fade>

                <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
                    {journey.map((item, i) => (
                        <Fade key={item.n} delay={i * .07}>
                            <div className="jstep" style={{ paddingBottom: i < journey.length - 1 ? 0 : 0 }}>
                                {i < journey.length - 1 && <div className="step-line" />}
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500, color: C.navy, boxShadow: `0 4px 24px ${C.cyan}44` }}>
                                    {item.n}
                                </div>
                                <div className="glass" style={{ flex: 1, borderRadius: 16, padding: "18px 24px", marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 5, letterSpacing: ".02em", textTransform: "uppercase" }}>{item.t}</div>
                                    <p style={{ fontSize: 14.5, color: C.ocean, lineHeight: 1.65, fontWeight: 300 }}>{item.d}</p>
                                </div>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            <div className="div" />

            {/* ══ ROADMAP ══ */}
            <section id="roadmap" style={{ padding: "110px 5%", background: C.mist }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 68 }}>
                        <span className="sec-label">What's Coming</span>
                        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, color: C.navy, letterSpacing: "-.025em" }}>
                            The Road <span style={{ color: C.ocean }}>Ahead</span>
                        </h2>
                    </div>
                </Fade>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))", gap: 12, maxWidth: 940, margin: "0 auto" }}>
                    {roadmap.map((item, i) => (
                        <Fade key={item} delay={i * .07}>
                            <div className="ritem">
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: C.navy }}>→</div>
                                <span style={{ fontSize: 14, color: C.ocean, lineHeight: 1.5, fontWeight: 400 }}>{item}</span>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section className="noise" style={{
                padding: "110px 5%", textAlign: "center", position: "relative", overflow: "hidden",
                background: `linear-gradient(160deg, ${C.navy} 0%, #021459 50%, ${C.ocean} 100%)`,
            }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 30% 50%, ${C.cyan}18 0%, transparent 50%), radial-gradient(circle at 70% 50%, ${C.ocean}22 0%, transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <span className="sec-label" style={{ color: C.sky }}>Ready to Hack?</span>
                        <h2 style={{ fontSize: "clamp(36px,5.5vw,70px)", fontWeight: 700, color: C.mist, letterSpacing: "-.03em", lineHeight: 1.08, marginBottom: 22 }}>
                            Build. Compete.{" "}
                            <span style={{ background: `linear-gradient(135deg,${C.cyan},${C.sky})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Certify.
                            </span>
                        </h2>
                        <p style={{ fontSize: 16, color: `${C.sky}bb`, marginBottom: 44, fontWeight: 300, maxWidth: 480, margin: "0 auto 44px" }}>
                            Join thousands of developers on a platform built for serious innovation.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <button className="btn-primary">Get Started Free</button>
                            <button className="btn-ghost">Contact Team</button>
                        </div>
                    </Fade>
                </div>
            </section>

            {/* ══ FOOTER ══ */}
            <footer style={{ background: C.navy, padding: "32px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={13} color={C.navy} stroke={2.8}><path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" /></Icon>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: C.mist }}>HackForge</span>
                </div>
                <span style={{ fontSize: 12, color: `${C.sky}88`, letterSpacing: ".06em" }}>© 2026 HackForge · Built with MERN</span>
                <div style={{ display: "flex", gap: 20 }}>
                    {["Privacy", "Terms", "Docs"].map(l => (
                        <a key={l} href="#" style={{ fontSize: 12, color: `${C.sky}77`, textDecoration: "none", fontWeight: 600, letterSpacing: ".06em", transition: "color .2s" }}
                            onMouseEnter={e => e.target.style.color = C.cyan} onMouseLeave={e => e.target.style.color = `${C.sky}77`}>{l}</a>
                    ))}
                </div>
            </footer>

        </div>
    );
}