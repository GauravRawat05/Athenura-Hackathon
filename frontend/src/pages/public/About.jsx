import { useState, useEffect, useRef } from "react";

const NAVY = "#03045E";
const WHITE = "#ffffff";
const WHITE_OFF = "#f0f2ff";
const NAVY_LIGHT = "rgba(3,4,94,0.07)";
const NAVY_MID = "rgba(3,4,94,0.14)";
const NAVY_TEXT = "rgba(3,4,94,0.62)";
const ACCENT = "#2962FF";

/* ── Intersection-observer fade helper ── */
function useInView(threshold = 0.1) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
            { threshold }
        );
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, [threshold]);
    return [ref, vis];
}

function Fade({ children, delay = 0, y = 30, className = "", style = {} }) {
    const [ref, vis] = useInView();
    return (
        <div ref={ref} className={className} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : `translateY(${y}px)`,
            transition: `opacity .75s cubic-bezier(.22,1,.36,1) ${delay}s, transform .75s cubic-bezier(.22,1,.36,1) ${delay}s`,
            ...style,
        }}>{children}</div>
    );
}

function Counter({ to, suffix = "" }) {
    const [val, setVal] = useState(0);
    const [ref, vis] = useInView();
    useEffect(() => {
        if (!vis) return;
        let start = null;
        const dur = 1600;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            setVal(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [vis, to]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ── SVG Icons ── */
const IconLifecycle = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <rect x="6" y="8" width="36" height="32" rx="4" stroke={NAVY} strokeWidth="2" />
        <path d="M14 18h20M14 24h14M14 30h10" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="30" r="5" fill={ACCENT} opacity=".15" stroke={ACCENT} strokeWidth="1.5" />
        <path d="M34 30l1.5 1.5L37.5 28" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconTeam = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <circle cx="18" cy="18" r="6" stroke={NAVY} strokeWidth="2" />
        <circle cx="32" cy="18" r="6" stroke={NAVY} strokeWidth="2" />
        <path d="M6 38c0-6.627 5.373-10 12-10M26 28c6.627 0 12 3.373 12 10" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
        <path d="M18 28c3.314 0 6 1.343 6 3" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
    </svg>
);
const IconUniversity = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <path d="M24 8L6 18l18 10 18-10L24 8z" stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 23v10c0 3 5.373 6 12 6s12-3 12-6V23" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="18" x2="42" y2="32" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
    </svg>
);
const IconJudging = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <path d="M24 6l4.5 9 10 1.5-7.25 7 1.75 10L24 29l-9 4.5 1.75-10L9.5 16.5l10-1.5L24 6z" stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="24" cy="20" r="4" fill={ACCENT} opacity=".2" />
    </svg>
);
const IconCert = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <rect x="8" y="10" width="32" height="24" rx="3" stroke={NAVY} strokeWidth="2" />
        <path d="M16 18h16M16 23h10" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="36" r="6" fill={ACCENT} opacity=".15" stroke={ACCENT} strokeWidth="1.5" />
        <path d="M29.5 36l2 2 3-3" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconPayment = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <rect x="6" y="12" width="36" height="26" rx="4" stroke={NAVY} strokeWidth="2" />
        <path d="M6 20h36" stroke={NAVY} strokeWidth="2" />
        <rect x="12" y="26" width="8" height="5" rx="1.5" fill={NAVY} opacity=".2" />
        <rect x="24" y="26" width="12" height="5" rx="1.5" fill={NAVY} opacity=".1" />
    </svg>
);

const features = [
    { Icon: IconLifecycle, title: "End-to-End Lifecycle", desc: "From hackathon creation to certificate generation — every stage in one unified platform." },
    { Icon: IconTeam, title: "Solo & Team Modes", desc: "Flexible registration supporting individual participants and collaborative team-based entries." },
    { Icon: IconUniversity, title: "University Dashboards", desc: "Institutional portals for MDU, DTU and more — track performance and export analytics." },
    { Icon: IconJudging, title: "Judging & Scoring", desc: "Configurable rubrics, weighted scores, and automated tie-breaking for fair outcomes." },
    { Icon: IconCert, title: "Auto Certificates", desc: "Participation and rank certificates generated as signed PDFs with QR-code verification." },
    { Icon: IconPayment, title: "Payment Integration", desc: "Razorpay-powered registration fees with real-time webhook confirmation and refund tracking." },
];

/* ── Tech Stack ── */
const MongoSVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <path d="M20 3C13 3 8 9 8 16c0 5.5 3.2 10.3 8 12.5v6.5c0 .5.4.8.8.8h6.4c.4 0 .8-.3.8-.8V28.5C28.8 26.3 32 21.5 32 16 32 9 27 3 20 3z" fill="#599636" />
        <path d="M20 3v34c.3 0 .5-.1.6-.2 4.8-2.2 8-7 8-12.8C28.6 9 24 3.5 20 3z" fill="#6cac48" />
        <path d="M19.2 35.5c0 .4.3.7.6.7h.4V30c-.4.1-.7.2-1 .3v5.2z" fill="#c2bfbf" />
    </svg>
);
const ExpressSVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36">
        <text x="3" y="27" fontSize="16" fontWeight="800" fill={NAVY} fontFamily="monospace">EX</text>
    </svg>
);
const ReactSVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <circle cx="20" cy="20" r="3" fill="#61DAFB" />
        <ellipse cx="20" cy="20" rx="17" ry="6.5" stroke="#61DAFB" strokeWidth="1.5" />
        <ellipse cx="20" cy="20" rx="17" ry="6.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="17" ry="6.5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 20 20)" />
    </svg>
);
const NodeSVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <path d="M20 3L6 11v18l14 8 14-8V11L20 3z" fill="#689F63" />
        <text x="11" y="25" fontSize="11" fontWeight="700" fill="#fff" fontFamily="monospace">JS</text>
    </svg>
);
const SocketSVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <circle cx="20" cy="20" r="16" fill={NAVY} />
        <path d="M13 13l12 5-12 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M27 22L15 17l12-4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
    </svg>
);
const CloudinarySVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <path d="M30 26a7.5 7.5 0 00-1.25-14.9A11.25 11.25 0 1010 26" stroke="#3448C5" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 30l5-6 5 6" stroke="#3448C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" y1="24" x2="20" y2="36" stroke="#3448C5" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
const RazorpaySVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <rect width="40" height="40" rx="8" fill="#2C64F4" />
        <path d="M11 28l6.5-15h5l-4 9h7.5l-10 11 2.5-5H11z" fill="white" />
    </svg>
);
const PuppeteerSVG = () => (
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <circle cx="20" cy="20" r="16" fill="#00D8A2" opacity=".12" stroke="#00D8A2" strokeWidth="1.5" />
        <circle cx="15" cy="18" r="2.5" fill="#00D8A2" />
        <circle cx="25" cy="18" r="2.5" fill="#00D8A2" />
        <path d="M14 25c1.5 2.5 11 2.5 12 0" stroke="#00D8A2" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const stack = [
    { SVG: MongoSVG, name: "MongoDB", role: "Database" },
    { SVG: ExpressSVG, name: "Express.js", role: "Backend API" },
    { SVG: ReactSVG, name: "React.js", role: "Frontend SPA" },
    { SVG: NodeSVG, name: "Node.js", role: "Runtime" },
    { SVG: SocketSVG, name: "Socket.IO", role: "Real-time" },
    { SVG: CloudinarySVG, name: "Cloudinary", role: "File Storage" },
    { SVG: RazorpaySVG, name: "Razorpay", role: "Payments" },
    { SVG: PuppeteerSVG, name: "Puppeteer", role: "PDF Engine" },
];

/* ── Vision / Mission / About ── */
const pillars = [
    {
        icon: (
            <svg viewBox="0 0 48 48" width="38" height="38" fill="none">
                <circle cx="24" cy="24" r="16" stroke={ACCENT} strokeWidth="2" opacity=".3" />
                <circle cx="24" cy="24" r="8" fill={ACCENT} opacity=".15" stroke={ACCENT} strokeWidth="1.5" />
                <path d="M24 12v4M24 32v4M12 24h4M32 24h4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="24" r="3" fill={ACCENT} />
            </svg>
        ),
        tag: "Our Vision",
        title: "Innovation Without Barriers",
        desc: "We envision a world where every developer — from top-tier institutions to remote villages — gets equal access to hackathon opportunities. HackForge exists to level the playing field, removing friction from ideation to recognition so that raw talent rises to the top."
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" width="38" height="38" fill="none">
                <path d="M24 8l4.5 9.5 10.5 1.5-7.5 7.5L33 38l-9-4.5L15 38l1.5-11.5L9 19l10.5-1.5L24 8z" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" />
                <path d="M24 18v6M24 27v1" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        tag: "Our Mission",
        title: "Empower Every Innovator",
        desc: "Our mission is to build the most comprehensive, fair, and scalable hackathon platform on earth. We automate the administrative burden — registrations, judging, certifications, analytics — so organisers can focus on inspiring participants and participants can focus on building."
    },
    {
        icon: (
            <svg viewBox="0 0 48 48" width="38" height="38" fill="none">
                <rect x="8" y="8" width="14" height="14" rx="3" stroke={ACCENT} strokeWidth="2" />
                <rect x="26" y="8" width="14" height="14" rx="3" stroke={ACCENT} strokeWidth="2" />
                <rect x="8" y="26" width="14" height="14" rx="3" stroke={ACCENT} strokeWidth="2" />
                <rect x="26" y="26" width="14" height="14" rx="3" stroke={ACCENT} strokeWidth="2" />
                <path d="M15 22v4M33 22v4M22 15h4M22 33h4" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        tag: "About Us",
        title: "Built by Hackers, for Hackers",
        desc: "HackForge was born in a 48-hour hackathon. Our founding team experienced first-hand the chaos of spreadsheet-driven judging, lost certificates, and payment headaches. We channelled that frustration into a MERN-stack platform that handles 10,000+ participants across universities like MDU and DTU — and keeps growing."
    },
];

/* ── Journey steps ── */
const journey = [
    {
        n: "01", t: "Ideation", d: "Identifying challenges in traditional hackathon management.", icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="9" r="5" stroke="white" strokeWidth="1.5" /><path d="M9 15v1a3 3 0 006 0v-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="2" x2="12" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
        )
    },
    {
        n: "02", t: "Development", d: "Building a unified platform with modern technologies and real-time features.", icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="14" y1="4" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
        )
    },
    {
        n: "03", t: "Launch", d: "Onboarding universities and hosting impactful hackathons across institutions.", icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 2C6 9 4 14 4 18a8 8 0 0016 0c0-4-2-9-8-16z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 18c0-2 1.8-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
        )
    },
    {
        n: "04", t: "Impact", d: "Empowering innovators and shaping the future of hackathon culture together.", icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5l-6.2 4.4 2.4-7.2L2 9.2h7.6L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        )
    },
];

/* ── Roadmap ── */
const roadmapItems = [
    { num: 1, title: "Platform Core", desc: "Build the core platform with hackathon creation, registration, and submission features.", status: "completed" },
    { num: 2, title: "Judging Engine", desc: "Advanced judging, rubrics, scoring, and leaderboard system.", status: "completed" },
    { num: 3, title: "Certificates & Payments", desc: "Auto certificate generation, Razorpay integration, and notifications.", status: "completed" },
    { num: 4, title: "University Portals", desc: "Institution dashboards, analytics, and data export capabilities.", status: "progress" },
    { num: 5, title: "AI & Beyond", desc: "AI-powered insights, smart recommendations, and more innovations.", status: "upcoming" },
];

const statusColor = { completed: "#22c55e", progress: "#f59e0b", upcoming: NAVY };
const statusLabel = { completed: "COMPLETED", progress: "IN PROGRESS", upcoming: "UPCOMING" };

export default function AboutPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    // Spotlight / parallax on hero
    useEffect(() => {
        const handle = e => {
            if (!heroRef.current) return;
            const { left, top, width, height } = heroRef.current.getBoundingClientRect();
            setMousePos({
                x: ((e.clientX - left) / width) * 100,
                y: ((e.clientY - top) / height) * 100,
            });
        };
        window.addEventListener("mousemove", handle);
        return () => window.removeEventListener("mousemove", handle);
    }, []);

    return (
        <div style={{ fontFamily: "'Nunito', 'Poppins', sans-serif", background: WHITE_OFF, color: NAVY, overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(41,98,255,.18); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f0f2ff; }
        ::-webkit-scrollbar-thumb { background: ${NAVY}; border-radius: 4px; }
        h1, h2, h3 { font-family: 'Poppins', sans-serif; }

        /* ── cursor spotlight ── */
        .spotlight {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(circle 500px at var(--mx) var(--my),
            rgba(41,98,255,0.12) 0%, transparent 70%);
          transition: background .1s;
        }

        /* ── marquee ── */
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track { animation: marquee 26s linear infinite; display:flex; white-space:nowrap; width:max-content; }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── feature card ── */
        .fcard {
          border-radius: 18px; padding: 32px 26px;
          background: white; border: 1.5px solid rgba(3,4,94,0.08);
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s;
          position: relative; overflow: hidden; cursor: default;
        }
        .fcard::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(41,98,255,0.05) 0%, transparent 60%);
          opacity: 0; transition: opacity .35s;
        }
        .fcard:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 24px 60px rgba(3,4,94,0.12); border-color: rgba(41,98,255,0.3); }
        .fcard:hover::after { opacity: 1; }
        .fcard-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, ${ACCENT}, #5c6bc0);
          transform: scaleX(0); transform-origin: left; transition: transform .4s;
        }
        .fcard:hover .fcard-bar { transform: scaleX(1); }

        /* ── stack pill ── */
        .spill {
          border-radius: 16px; padding: 22px 12px; text-align: center;
          background: white; border: 1.5px solid rgba(3,4,94,0.08);
          transition: transform .3s, box-shadow .3s, border-color .3s;
          cursor: default; position: relative; overflow: hidden;
        }
        .spill:hover { transform: translateY(-6px) scale(1.05); box-shadow: 0 16px 40px rgba(3,4,94,0.12); border-color: ${ACCENT}; }

        /* ── pillar card ── */
        .pillar {
          border-radius: 20px; padding: 38px 32px;
          background: white; border: 1.5px solid rgba(3,4,94,0.08);
          transition: transform .35s, box-shadow .35s, border-color .35s;
          position: relative; overflow: hidden;
        }
        .pillar::before {
          content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, ${ACCENT}, #5c6bc0);
          transform: scaleX(0); transform-origin: left; transition: transform .4s;
        }
        .pillar:hover { transform: translateY(-8px); box-shadow: 0 28px 64px rgba(3,4,94,0.1); border-color: rgba(41,98,255,0.2); }
        .pillar:hover::before { transform: scaleX(1); }

        /* ── roadmap item ── */
        .rmap-item {
          border-radius: 16px; padding: 24px 22px;
          background: white; border: 1.5px solid rgba(3,4,94,0.08);
          transition: transform .3s, box-shadow .3s;
          position: relative;
        }
        .rmap-item:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(3,4,94,0.1); }

        /* ── stat strip ── */
        .stat-pill {
          display: flex; flex-direction: column; align-items: center; padding: 28px 42px;
          border-right: 1px solid rgba(255,255,255,0.1);
          transition: background .25s;
        }
        .stat-pill:hover { background: rgba(255,255,255,0.05); }
        .stat-pill:last-child { border-right: none; }

        /* ── btn ── */
        .btn-primary {
          background: white; color: ${NAVY};
          font-weight: 800; font-size: 14px; border: none; border-radius: 50px;
          padding: 14px 36px; cursor: pointer; letter-spacing: .04em;
          transition: transform .2s, box-shadow .2s;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 6px 30px rgba(0,0,0,0.25);
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
        .btn-ghost {
          background: transparent; color: rgba(255,255,255,0.85);
          border: 2px solid rgba(255,255,255,0.35); border-radius: 50px;
          padding: 12px 32px; font-size: 14px; font-weight: 700; cursor: pointer;
          transition: background .2s, color .2s, border-color .2s;
          font-family: 'Nunito', sans-serif;
          display: flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); color: white; }

        .sec-label {
          display: inline-block; font-size: 10.5px; font-weight: 800; letter-spacing: .18em;
          text-transform: uppercase; color: ${ACCENT}; margin-bottom: 14px;
          padding: 5px 14px; border-radius: 50px;
          background: rgba(41,98,255,0.08); border: 1px solid rgba(41,98,255,0.2);
          font-family: 'Nunito', sans-serif;
        }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(3,4,94,0.1), transparent); }

        /* ── dot grid bg ── */
        .dot-bg {
          background-image: radial-gradient(circle, rgba(3,4,94,0.12) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        /* ── glow blob ── */
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(24px,-16px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }
        .blob1 { animation: float1 10s ease-in-out infinite; }
        .blob2 { animation: float2 14s ease-in-out infinite; }

        /* ── journey line ── */
        .j-line { position: absolute; left: 27px; top: 60px; bottom: -18px; width: 2px; background: linear-gradient(180deg, rgba(41,98,255,.4), transparent); }

        /* ── image overlay card ── */
        .img-card {
          border-radius: 20px; overflow: hidden; position: relative;
          box-shadow: 0 24px 64px rgba(3,4,94,0.22);
          transition: transform .4s, box-shadow .4s;
        }
        .img-card:hover { transform: scale(1.02); box-shadow: 0 32px 80px rgba(3,4,94,0.3); }

        /* ── stats badge ── */
        .stat-badge {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; gap: 12px;
          backdrop-filter: blur(8px); transition: background .25s, transform .25s;
        }
        .stat-badge:hover { background: rgba(255,255,255,0.14); transform: translateX(4px); }

        @media(max-width:768px){
          .hero-grid { flex-direction: column !important; }
          .pillar-grid { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .stack-grid { grid-template-columns: repeat(4,1fr) !important; }
          .rmap-grid { grid-template-columns: 1fr !important; }
          .stat-pill { padding: 18px 24px !important; }
        }
      `}</style>

            {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
            <section ref={heroRef} style={{
                minHeight: "100vh",
                background: NAVY,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                padding: "100px 5% 80px",
            }}>
                {/* spotlight */}
                <div className="spotlight" style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` }} />
                {/* dot grid */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
                {/* blobs */}
                <div className="blob1" style={{ position: "absolute", top: "-100px", right: "-80px", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(41,98,255,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
                <div className="blob2" style={{ position: "absolute", bottom: "-80px", left: "-60px", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(41,98,255,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

                <div className="hero-grid" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 60, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
                    {/* LEFT */}
                    <div style={{ flex: 1 }}>
                        <Fade>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, marginBottom: 28, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.65)", letterSpacing: ".12em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)" }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                                About HackForge
                            </div>
                        </Fade>
                        <Fade delay={.1}>
                            <h1 style={{ fontSize: "clamp(38px,5.5vw,72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.03em", color: "white", marginBottom: 10 }}>
                                Empowering Innovators.
                            </h1>
                            <h1 style={{ fontSize: "clamp(38px,5.5vw,72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.03em", color: ACCENT, marginBottom: 28 }}>
                                Building the Future.
                            </h1>
                        </Fade>
                        <Fade delay={.18}>
                            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: 520, marginBottom: 36, fontWeight: 400 }}>
                                HackForge is a full-stack hackathon management platform built to simplify, automate, and elevate every stage of a hackathon — from registration to recognition.
                            </p>
                        </Fade>
                        {/* mini stats */}
                        <Fade delay={.24}>
                            <div style={{ display: "flex", gap: 32, marginBottom: 40, flexWrap: "wrap" }}>
                                {[
                                    { icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, val: "100%", label: "Secure Platform" },
                                    { icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.5" /><path d="M3 17c0-2.761 2.239-4 5-4M12 10l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, val: "10K+", label: "Participants" },
                                    { icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6l2-6z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>, val: "500+", label: "Hackathons" },
                                ].map(s => (
                                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 17, fontWeight: 800, color: "white", lineHeight: 1, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Fade>
                        <Fade delay={.3}>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <button className="btn-primary">Explore Hackathons</button>
                                <button className="btn-ghost">
                                    Our Journey
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </Fade>
                    </div>

                    {/* RIGHT — image collage */}
                    <Fade delay={.15} style={{ flex: 1, position: "relative", minHeight: 420 }}>
                        <div style={{ position: "relative" }}>
                            {/* Main image card */}
                            <div className="img-card" style={{ width: "100%", aspectRatio: "4/3" }}>
                                <img
                                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
                                    alt="Hackathon participants collaborating"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,4,94,0.6) 0%, rgba(41,98,255,0.3) 100%)" }} />
                                {/* floating code brackets overlay */}
                                <div style={{ position: "absolute", top: "50%", right: 24, transform: "translateY(-50%)", fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.08)", fontFamily: "monospace", lineHeight: 1 }}>{"{ }"}</div>
                                <div style={{ position: "absolute", top: 20, left: 20 }}>
                                    <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "white", fontWeight: 700 }}>
                                        🏆 Live Hackathon
                                    </div>
                                </div>
                            </div>
                            {/* floating stat badges */}
                            <div style={{ position: "absolute", bottom: -18, left: -18, background: NAVY, borderRadius: 16, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 48px rgba(3,4,94,0.4)" }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif" }}>50+</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Partner Universities</div>
                            </div>
                            <div style={{ position: "absolute", top: -18, right: -18, background: ACCENT, borderRadius: 16, padding: "14px 20px", boxShadow: "0 16px 48px rgba(41,98,255,0.5)" }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif" }}>1M+</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Lines of Code</div>
                            </div>
                        </div>
                    </Fade>
                </div>
            </section>

            {/* ══ MARQUEE BAND ══ */}
            <div style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 0", overflow: "hidden" }}>
                <div className="marquee-track">
                    {[...Array(2)].map((_, ri) =>
                        ["Hackathon Management", "Team Formation", "Live Judging", "Auto Certificates", "Razorpay Payments", "University Dashboards", "Real-time Updates", "Role-based Access", "PDF Generation", "Socket.IO", "MongoDB", "JWT Auth"].map((t, i) => (
                            <span key={`${ri}-${i}`} style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", marginRight: 44 }}>
                                {t} <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 44 }}>✦</span>
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════
          WHY HACKVERSE — Features
      ══════════════════════════════════════════ */}
            <section style={{ padding: "110px 5%", background: WHITE_OFF }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 70 }}>
                        {/* <span className="sec-label">Why HackForge</span> */}
                        <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", marginTop: 4 }}>
                            Everything You Need, <span style={{ color: ACCENT }}>All in One Platform</span>
                        </h2>
                        <p style={{ fontSize: 15, color: NAVY_TEXT, marginTop: 14, maxWidth: 520, margin: "14px auto 0" }}>
                            Designed to streamline hackathons for participants, organizers, and institutions.
                        </p>
                    </div>
                </Fade>
                <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
                    {features.map((f, i) => (
                        <Fade key={f.title} delay={i * .07}>
                            <div className="fcard">
                                <div className="fcard-bar" />
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(41,98,255,0.07)", border: "1.5px solid rgba(41,98,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                    <f.Icon />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 10 }}>{f.title}</h3>
                                <p style={{ fontSize: 14, color: NAVY_TEXT, lineHeight: 1.78 }}>{f.desc}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            <div className="divider" />

                 {/* ══════════════════════════════════════════
          BOTTOM STATS STRIP
      ══════════════════════════════════════════ */}
            <section style={{ background: NAVY, padding: "64px 5%" }}>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: 1000, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {[
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.5" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, to: 10000, suffix: "+", label: "Happy Participants" },
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, to: 50, suffix: "+", label: "Partner Universities" },
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>, to: 500, suffix: "+", label: "Hackathons Hosted" },
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="15" y1="4" x2="9" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, to: 1, suffix: "M+", label: "Lines of Code" },
                    ].map((s, i, arr) => (
                        <div key={s.label} className="stat-pill" style={{ borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                            <div style={{ marginBottom: 10, opacity: 0.7 }}>{s.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                                <Counter to={s.to} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, marginTop: 6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

                {/* ══════════════════════════════════════════
          JOURNEY — From Vision to Impact (with img)
      ══════════════════════════════════════════ */}
            <section style={{ padding: "110px 5%", background: WHITE_OFF }}>
                <div style={{ display: "flex", gap: 70, alignItems: "flex-start", maxWidth: 1100, margin: "0 auto", flexWrap: "wrap" }}>
                    {/* LEFT */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <Fade>
                            {/* <span className="sec-label">Our Journey</span> */}
                            <h2 style={{ fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", margin: "12px 0 16px", lineHeight: 1.15 }}>
                                From Vision <br />to Impact
                            </h2>
                            <p style={{ fontSize: 15, color: NAVY_TEXT, lineHeight: 1.8, marginBottom: 36, maxWidth: 360 }}>
                                HackForge was born out of the need to simplify hackathon management and create a meaningful experience for every innovator.
                            </p>
                        </Fade>
                        {/* illustration / image */}
                        <Fade delay={.1}>
                            <div className="img-card" style={{ borderRadius: 20 }}>
                                <img
                                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                                    alt="Technology circuit board"
                                    style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
                                />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,4,94,0.7) 0%, rgba(41,98,255,0.4) 100%)" }} />
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 48, fontWeight: 900, color: "white", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                                            <Counter to={10} suffix="K+" />
                                        </div>
                                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>Participants Empowered</div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </div>

                    {/* RIGHT — steps */}
                    <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
                        <Fade delay={.05}>
                            {journey.map((item, i) => (
                                <div key={item.n} className="jstep" style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative", marginBottom: i < journey.length - 1 ? 12 : 0 }}>
                                    {i < journey.length - 1 && <div className="j-line" />}
                                    <div style={{ width: 54, height: 54, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1, borderRadius: 16, padding: "18px 22px", marginBottom: 14, background: "white", border: `1px solid ${NAVY_MID}`, transition: "box-shadow .25s", cursor: "default" }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(3,4,94,0.1)"}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                            <div style={{ fontSize: 12, fontWeight: 800, color: NAVY, letterSpacing: ".06em", textTransform: "uppercase" }}>{item.t}</div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(3,4,94,0.25)", fontFamily: "monospace" }}>{item.n}</div>
                                        </div>
                                        <p style={{ fontSize: 14, color: NAVY_TEXT, lineHeight: 1.7 }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </Fade>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
          VISION / MISSION / ABOUT
      ══════════════════════════════════════════ */}
            <section style={{ padding: "110px 5%", background: "white", position: "relative", overflow: "hidden" }}>
                <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <div style={{ textAlign: "center", marginBottom: 70 }}>
                            {/* <span className="sec-label">Who We Are</span> */}
                            <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", marginTop: 4 }}>
                                Our Purpose & <span style={{ color: ACCENT }}>Story</span>
                            </h2>
                            <p style={{ fontSize: 15, color: NAVY_TEXT, marginTop: 14, maxWidth: 480, margin: "14px auto 0" }}>
                                The beliefs and experiences that drive everything we build.
                            </p>
                        </div>
                    </Fade>

                    {/* Image + text row for "About Us" flavour */}
                    <div style={{ display: "flex", gap: 56, alignItems: "center", maxWidth: 1100, margin: "0 auto 72px", flexWrap: "wrap" }}>
                        <Fade delay={.05} style={{ flex: 1, minWidth: 280 }}>
                            <div className="img-card" style={{ borderRadius: 24 }}>
                                <img
                                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80"
                                    alt="Team collaborating on laptops"
                                    style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
                                />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(3,4,94,0.5) 0%, transparent 60%)" }} />
                                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Born at a Hackathon</div>
                                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Founded by developers who lived the problem</div>
                                </div>
                            </div>
                        </Fade>
                        <Fade delay={.12} style={{ flex: 1.3, minWidth: 280 }}>
                            <div>
                                {/* <span className="sec-label">Our Story</span> */}
                                <h3 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, color: NAVY, letterSpacing: "-.02em", margin: "12px 0 18px", lineHeight: 1.2 }}>
                                    From Frustration <br />to Innovation
                                </h3>
                                <p style={{ fontSize: 15, color: NAVY_TEXT, lineHeight: 1.9, marginBottom: 16 }}>
                                    HackForge was created during a 48-hour hackathon where our founding team experienced the chaos of spreadsheet-driven judging, misplaced certificates, and broken payment flows. We turned that frustration into a solution.
                                </p>
                                <p style={{ fontSize: 15, color: NAVY_TEXT, lineHeight: 1.9, marginBottom: 28 }}>
                                    Today, HackForge powers hackathons across universities like MDU and DTU, serving 10,000+ participants with a platform that handles everything from team formation to certified winners — automatically.
                                </p>
                                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                                    {[{ val: "10K+", label: "Happy Participants" }, { val: "50+", label: "Partner Universities" }, { val: "500+", label: "Hackathons Hosted" }].map(s => (
                                        <div key={s.label} style={{ textAlign: "center", padding: "14px 18px", borderRadius: 12, background: "rgba(41,98,255,0.05)", border: "1px solid rgba(41,98,255,0.15)" }}>
                                            <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
                                            <div style={{ fontSize: 11, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Fade>
                    </div>

                    {/* Pillar cards — Vision, Mission, About */}
                    <div className="pillar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
                        {pillars.map((p, i) => (
                            <Fade key={p.tag} delay={i * .1}>
                                <div className="pillar">
                                    <div style={{ width: 58, height: 58, borderRadius: 16, background: "rgba(41,98,255,0.07)", border: "1.5px solid rgba(41,98,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                                        {p.icon}
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".15em" }}>{p.tag}</span>
                                    <h3 style={{ fontSize: 19, fontWeight: 700, color: NAVY, margin: "10px 0 14px", lineHeight: 1.25 }}>{p.title}</h3>
                                    <p style={{ fontSize: 14, color: NAVY_TEXT, lineHeight: 1.8 }}>{p.desc}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            <div className="divider" />

        
            <div className="divider" />

            {/* ══════════════════════════════════════════
          TECH STACK
      ══════════════════════════════════════════ */}
            {/* <section style={{ padding: "110px 5%", background: "white" }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <span className="sec-label">Built With Modern Technologies</span>
                        <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", marginTop: 4 }}>
                            Our Technology Stack
                        </h2>
                        <p style={{ fontSize: 15, color: NAVY_TEXT, marginTop: 12 }}>Robust. Scalable. Real-time. Future-ready.</p>
                    </div>
                </Fade>
                <div className="stack-grid" style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 14, maxWidth: 980, margin: "52px auto 0" }}>
                    {stack.map((s, i) => (
                        <Fade key={s.name} delay={i * .06}>
                            <div className="spill">
                                <div style={{ width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", background: "rgba(3,4,94,0.04)" }}>
                                    <s.SVG />
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: NAVY }}>{s.name}</div>
                                <div style={{ fontSize: 10.5, color: NAVY_TEXT, marginTop: 4, letterSpacing: ".05em" }}>{s.role}</div>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section> */}

            <div className="divider" />

       

            {/* ══════════════════════════════════════════
          ROADMAP
      ══════════════════════════════════════════ */}
            <section style={{ padding: "110px 5%", background: WHITE_OFF }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 70 }}>
                        {/* <span className="sec-label">What's Next</span> */}
                        <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", marginTop: 4 }}>
                            Our Roadmap
                        </h2>
                        <p style={{ fontSize: 15, color: NAVY_TEXT, marginTop: 12 }}>Continuously evolving to deliver more value to the community.</p>
                    </div>
                </Fade>

                {/* Horizontal roadmap */}
                <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                    {/* connector line */}
                    <div style={{ position: "absolute", top: 36, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, #22c55e, #22c55e 55%, ${ACCENT} 55%, ${ACCENT} 75%, rgba(3,4,94,0.2) 75%)`, borderRadius: 2 }} />

                    <div className="rmap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, position: "relative", zIndex: 1 }}>
                        {roadmapItems.map((item, i) => (
                            <Fade key={item.title} delay={i * .09}>
                                <div className="rmap-item">
                                    {/* circle */}
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: item.status === "upcoming" ? "rgba(3,4,94,0.08)" : item.status === "progress" ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)", border: `2px solid ${statusColor[item.status]}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 14, fontWeight: 800, color: statusColor[item.status], fontFamily: "'Poppins',sans-serif" }}>
                                        {item.num}
                                    </div>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 8, textAlign: "center" }}>{item.title}</h3>
                                    <p style={{ fontSize: 12, color: NAVY_TEXT, lineHeight: 1.65, textAlign: "center", marginBottom: 14 }}>{item.desc}</p>
                                    <div style={{ textAlign: "center" }}>
                                        <span style={{ fontSize: 9.5, fontWeight: 800, color: statusColor[item.status], letterSpacing: ".12em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 50, background: `${statusColor[item.status]}18`, border: `1px solid ${statusColor[item.status]}30` }}>
                                            {statusLabel[item.status]}
                                        </span>
                                    </div>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
          BOTTOM STATS STRIP
      ══════════════════════════════════════════ */}
            {/* <section style={{ background: NAVY, padding: "64px 5%" }}>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: 1000, margin: "0 auto", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {[
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.5" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, to: 10000, suffix: "+", label: "Happy Participants" },
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>, to: 50, suffix: "+", label: "Partner Universities" },
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>, to: 500, suffix: "+", label: "Hackathons Hosted" },
                        { icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="15" y1="4" x2="9" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, to: 1, suffix: "M+", label: "Lines of Code" },
                    ].map((s, i, arr) => (
                        <div key={s.label} className="stat-pill" style={{ borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                            <div style={{ marginBottom: 10, opacity: 0.7 }}>{s.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                                <Counter to={s.to} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, marginTop: 6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
            <section style={{
                padding: "110px 5%",
                textAlign: "center",
                background: NAVY,
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 25% 50%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <span className="sec-label" style={{ color: "rgba(255,255,255,0.4)" }}>Ready to Hack?</span>
                        <h2 style={{ fontSize: "clamp(34px,5vw,66px)", fontWeight: 700, color: "white", letterSpacing: "-.03em", lineHeight: 1.08, marginBottom: 20 }}>
                            Build. Compete.{" "}
                            <span style={{ color: "rgba(255,255,255,0.45)" }}>Certify.</span>
                        </h2>
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 44, fontWeight: 400, maxWidth: 460, margin: "0 auto 44px", fontFamily: "'Nunito', sans-serif" }}>
                            Join thousands of developers on a platform built for serious innovation.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <button className="btn-primary" style={{ background: "white", color: NAVY }}>Get Started Free</button>
                            <button className="btn-ghost" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}>Contact Team</button>
                        </div>
                    </Fade>
                </div>
            </section>

        </div>
    );
}