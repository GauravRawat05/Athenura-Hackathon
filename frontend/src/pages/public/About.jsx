import { useState, useEffect, useRef } from "react";

const NAVY = "#03045E";
const WHITE = "#ffffff";
const WHITE_OFF = "#f0f2ff";
const NAVY_MID = "rgba(3,4,94,0.14)";
const NAVY_TEXT = "rgba(3,4,94,0.62)";
const ACCENT = "#2962FF";

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

/* ── Smooth scroll helper ── */
function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── Link Button components ── */
function LinkButton({ href, className, style, onMouseEnter, onMouseLeave, children, onClick }) {
    const handleClick = (e) => {
        if (onClick) { e.preventDefault(); onClick(e); return; }
        if (href && href.startsWith("#")) {
            e.preventDefault();
            scrollToId(href.slice(1));
        }
        // For real routes, let the browser navigate (or use router.push in Next.js)
    };
    return (
        <a
            href={href || "#"}
            className={className}
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}

/* ── Feature Icons ── */
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
const IconRoles = () => (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none">
        <circle cx="14" cy="16" r="5" stroke={NAVY} strokeWidth="2" />
        <circle cx="34" cy="16" r="5" stroke={NAVY} strokeWidth="2" />
        <circle cx="24" cy="30" r="5" stroke={ACCENT} strokeWidth="2" />
        <path d="M7 36c0-3.866 3.134-6 7-6M34 30c3.866 0 7 2.134 7 6" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
        <path d="M19 36c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
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
    { Icon: IconRoles, title: "Multi-Role Access", desc: "Separate portals for Participants, Organizers, Judges, and University Admins — each with tailored permissions and dashboards." },
    { Icon: IconJudging, title: "Judging & Scoring", desc: "Configurable rubrics, weighted scores, and automated tie-breaking for fair outcomes." },
    { Icon: IconCert, title: "Auto Certificates", desc: "Participation and rank certificates generated as signed PDFs with QR-code verification." },
    { Icon: IconPayment, title: "Payment Integration", desc: "Razorpay-powered registration fees with real-time webhook confirmation and refund tracking." },
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
        desc: "We envision a world where every developer — from top-tier institutions to remote villages — gets equal access to hackathon opportunities. HackForge exists to level the playing field."
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
        desc: "Our mission is to build the most comprehensive, fair, and scalable hackathon platform on earth. We automate the administrative burden so organisers can focus on inspiring participants."
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
        desc: "HackForge was born in a 48-hour hackathon. Our founding team experienced first-hand the chaos of spreadsheet-driven judging, lost certificates, and payment headaches."
    },
];

/* ── Journey steps ── */
const journey = [
    {
        n: "01", t: "Ideation", d: "Identifying challenges in traditional hackathon management.",
        icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="9" r="5" stroke="white" strokeWidth="1.5" /><path d="M9 15v1a3 3 0 006 0v-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><line x1="12" y1="2" x2="12" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
    },
    {
        n: "02", t: "Development", d: "Building a unified platform with modern technologies and real-time features.",
        icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="14" y1="4" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
    },
    {
        n: "03", t: "Launch", d: "Onboarding universities and hosting impactful hackathons across institutions.",
        icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 2C6 9 4 14 4 18a8 8 0 0016 0c0-4-2-9-8-16z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 18c0-2 1.8-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
    },
    {
        n: "04", t: "Impact", d: "Empowering innovators and shaping the future of hackathon culture together.",
        icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5l-6.2 4.4 2.4-7.2L2 9.2h7.6L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>
    },
];

// Participant step icons
const IcoSignup = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M7 11V7a5 5 0 0110 0v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1.5" fill={c} />
    </svg>
);
const IcoBrowse = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.6" />
        <path d="M16.5 16.5L21 21" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const IcoTeamReg = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="9" cy="7" r="3" stroke={c} strokeWidth="1.6" />
        <circle cx="17" cy="9" r="2.5" stroke={c} strokeWidth="1.6" />
        <path d="M3 20c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M17 14c2.209 0 4 1.343 4 4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const IcoPay = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="2" y="6" width="20" height="14" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M2 10h20" stroke={c} strokeWidth="1.6" />
        <rect x="5" y="13" width="4" height="3" rx="1" fill={c} opacity=".35" />
        <rect x="11" y="13" width="6" height="3" rx="1" fill={c} opacity=".2" />
    </svg>
);
const IcoSubmit = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const IcoCertDownload = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="3" y="3" width="14" height="18" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M7 8h6M7 12h4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="18" cy="18" r="4" fill={c} opacity=".15" stroke={c} strokeWidth="1.4" />
        <path d="M16.5 18l1.2 1.2L19.5 17" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Organizer step icons
// const IcoLogin = ({ c }) => (
//     <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
//         <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M10 17l5-5-5-5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         <line x1="15" y1="12" x2="3" y2="12" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
// );
// const IcoCreate = ({ c }) => (
//     <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
//         <rect x="3" y="4" width="18" height="17" rx="2" stroke={c} strokeWidth="1.6" />
//         <path d="M3 9h18" stroke={c} strokeWidth="1.6" />
//         <path d="M8 2v4M16 2v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M12 13v4M10 15h4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
// );
// const IcoRubric = ({ c }) => (
//     <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
//         <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <rect x="9" y="3" width="6" height="4" rx="1" stroke={c} strokeWidth="1.6" />
//         <path d="M9 12h6M9 16h4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
// );
// const IcoMonitor = ({ c }) => (
//     <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
//         <rect x="2" y="3" width="20" height="14" rx="2" stroke={c} strokeWidth="1.6" />
//         <path d="M8 21h8M12 17v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M6 10l3 3 3-4 3 3 3-3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );
// const IcoAnnounce = ({ c }) => (
//     <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
//         <path d="M18 8a6 6 0 01-12 0" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M4 8h16" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M12 2v6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M8 14l-2 6h12l-2-6" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );
// const IcoBulkCert = ({ c }) => (
//     <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
//         <rect x="2" y="6" width="13" height="16" rx="2" stroke={c} strokeWidth="1.6" />
//         <path d="M5 10h7M5 14h5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M17 2h3a2 2 0 012 2v13" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
//         <circle cx="19" cy="19" r="3.5" fill={c} opacity=".15" stroke={c} strokeWidth="1.4" />
//         <path d="M17.8 19l1 1 1.8-1.8" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
// );

// Judge step icons
const IcoInvite = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke={c} strokeWidth="1.6" />
        <path d="M22 6l-10 7L2 6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const IcoAssigned = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={c} strokeWidth="1.6" />
        <rect x="9" y="3" width="6" height="4" rx="1" stroke={c} strokeWidth="1.6" />
        <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IcoReview = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" fill={c} opacity=".2" stroke={c} strokeWidth="1.4" />
        <path d="M3 12h3M18 12h3M12 3v3M12 18v3" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);
const IcoScore = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5l-6.2 4.4 2.4-7.2L2 9.2h7.6L12 2z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
);
const IcoLockScore = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke={c} strokeWidth="1.6" />
        <path d="M8 11V7a4 4 0 018 0v4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 17l2 2 4-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IcoLeaderboard = ({ c }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="2" y="13" width="4" height="8" rx="1" stroke={c} strokeWidth="1.6" />
        <rect x="10" y="8" width="4" height="13" rx="1" stroke={c} strokeWidth="1.6" />
        <rect x="18" y="10" width="4" height="11" rx="1" stroke={c} strokeWidth="1.6" />
        <path d="M4 10l4-4 4 3 4-6 4 3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const roles = [
    {
        key: "participant",
        label: "Participant",
        color: ACCENT,
        steps: [
            { Icon: IcoSignup, title: "Sign Up / Log In", desc: "Create your account with email or OAuth. Instant access — no approval required." },
            { Icon: IcoBrowse, title: "Browse Hackathons", desc: "Explore active and upcoming hackathons filtered by theme, date, fee, or university." },
            { Icon: IcoTeamReg, title: "Register Solo or as Team", desc: "Join individually or form a team. Invite teammates via link or username." },
            { Icon: IcoPay, title: "Pay Entry Fee", desc: "Secure Razorpay checkout — UPI, card, netbanking. Instant confirmation email." },
            { Icon: IcoSubmit, title: "Submit Your Project", desc: "Upload code link, demo video, and presentation deck before the deadline." },
            { Icon: IcoCertDownload, title: "Get Your Certificate", desc: "Download signed participation or winner certificates with QR-code verification." },
        ],
        ctaLabel: "Register Now →",
        ctaHref: "/register",
    },
    // {
    //     key: "organizer",
    //     label: "Organizer",
    //     color: "#7C3AED",
    //     steps: [
    //         { Icon: IcoLogin, title: "Log In as Organizer", desc: "Use your organizer credentials. Role is assigned by the platform admin at signup." },
    //         { Icon: IcoCreate, title: "Create a Hackathon", desc: "Set name, description, timeline, themes, team limits, and entry fee in minutes." },
    //         { Icon: IcoRubric, title: "Configure Judging", desc: "Build custom rubrics — add criteria, weights, and assign judges to rounds." },
    //         { Icon: IcoMonitor, title: "Monitor Registrations", desc: "Live dashboard shows registration count, team formation, and payment status." },
    //         { Icon: IcoAnnounce, title: "Announce Results", desc: "One-click result publication notifies all participants and triggers leaderboard." },
    //         { Icon: IcoBulkCert, title: "Bulk Certificates", desc: "Auto-generate and dispatch certificates to all participants post-event." },
    //     ],
    //     ctaLabel: "Create Hackathon →",
    //     ctaHref: "/organizer/create",
    // },
    // {
    //     key: "judge",
    //     label: "Judge",
    //     color: "#059669",
    //     steps: [
    //         { Icon: IcoInvite, title: "Accept Invite", desc: "Judges receive a direct invite link from the organizer — click and you're in." },
    //         { Icon: IcoAssigned, title: "View Assigned Submissions", desc: "Your panel shows only the projects assigned to you — no confusion, no overlap." },
    //         { Icon: IcoReview, title: "Review Each Submission", desc: "Watch demo videos, browse code repos, and read project descriptions in one place." },
    //         { Icon: IcoScore, title: "Score Against Rubric", desc: "Rate each criterion on a weighted scale. Add inline comments for transparency." },
    //         { Icon: IcoLockScore, title: "Submit & Lock Scores", desc: "Lock in your scores. The system auto-resolves ties using the configured tie-breaker." },
    //         { Icon: IcoLeaderboard, title: "View Leaderboard", desc: "Instantly see aggregated results across all judges once scoring closes." },
    //     ],
    //     ctaLabel: "Accept Invite →",
    //     ctaHref: "/judge/invite",
    // },
];

export default function AboutPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedRole, setSelectedRole] = useState("participant");
    const heroRef = useRef(null);

    useEffect(() => {
        const handle = e => {
            if (!heroRef.current) return;
            const { left, top, width, height } = heroRef.current.getBoundingClientRect();
            setMousePos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
        };
        window.addEventListener("mousemove", handle);
        return () => window.removeEventListener("mousemove", handle);
    }, []);

    const activeRoleData = roles.find(r => r.key === selectedRole);

    return (
        <div style={{ fontFamily: "'Nunito','Poppins',sans-serif", background: WHITE_OFF, color: NAVY, overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{-webkit-font-smoothing:antialiased;}
        ::selection{background:rgba(41,98,255,.18);}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#f0f2ff;}
        ::-webkit-scrollbar-thumb{background:${NAVY};border-radius:4px;}
        h1,h2,h3{font-family:'Poppins',sans-serif;}
        .spotlight{position:absolute;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle 500px at var(--mx) var(--my),rgba(41,98,255,0.12) 0%,transparent 70%);transition:background .1s;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-track{animation:marquee 26s linear infinite;display:flex;white-space:nowrap;width:max-content;}
        .marquee-track:hover{animation-play-state:paused;}
        .fcard{border-radius:18px;padding:32px 26px;background:white;border:1.5px solid rgba(3,4,94,0.08);transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s,border-color .35s;position:relative;overflow:hidden;cursor:default;}
        .fcard::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(41,98,255,0.05) 0%,transparent 60%);opacity:0;transition:opacity .35s;}
        .fcard:hover{transform:translateY(-8px) scale(1.01);box-shadow:0 24px 60px rgba(3,4,94,0.12);border-color:rgba(41,98,255,0.3);}
        .fcard:hover::after{opacity:1;}
        .fcard-bar{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${ACCENT},#5c6bc0);transform:scaleX(0);transform-origin:left;transition:transform .4s;}
        .fcard:hover .fcard-bar{transform:scaleX(1);}
        .pillar{border-radius:20px;padding:38px 32px;background:white;border:1.5px solid rgba(3,4,94,0.08);transition:transform .35s,box-shadow .35s,border-color .35s;position:relative;overflow:hidden;}
        .pillar::before{content:"";position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${ACCENT},#5c6bc0);transform:scaleX(0);transform-origin:left;transition:transform .4s;}
        .pillar:hover{transform:translateY(-8px);box-shadow:0 28px 64px rgba(3,4,94,0.1);border-color:rgba(41,98,255,0.2);}
        .pillar:hover::before{transform:scaleX(1);}
        .stat-pill{display:flex;flex-direction:column;align-items:center;padding:28px 42px;border-right:1px solid rgba(255,255,255,0.1);transition:background .25s;}
        .stat-pill:hover{background:rgba(255,255,255,0.05);}
        .stat-pill:last-child{border-right:none;}

        /* ── Button & Link styles ── */
        .btn-primary{background:white;color:${NAVY};font-weight:800;font-size:14px;border:none;border-radius:50px;padding:14px 36px;cursor:pointer;letter-spacing:.04em;transition:transform .2s,box-shadow .2s;font-family:'Nunito',sans-serif;box-shadow:0 6px 30px rgba(0,0,0,0.25);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;}
        .btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.35);}
        .btn-ghost{background:transparent;color:rgba(255,255,255,0.85);border:2px solid rgba(255,255,255,0.35);border-radius:50px;padding:12px 32px;font-size:14px;font-weight:700;cursor:pointer;transition:background .2s,color .2s,border-color .2s;font-family:'Nunito',sans-serif;display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
        .btn-ghost:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.6);color:white;}
        .btn-cta-white{background:white;border:none;border-radius:50px;padding:13px 30px;font-size:14px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;letter-spacing:.03em;flex-shrink:0;transition:transform .2s,box-shadow .2s;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;}
        .btn-cta-white:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,0.2);}

        .sec-label{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${ACCENT};margin-bottom:14px;padding:5px 14px;border-radius:50px;background:rgba(41,98,255,0.08);border:1px solid rgba(41,98,255,0.2);font-family:'Nunito',sans-serif;}
        .divider{height:1px;background:linear-gradient(90deg,transparent,rgba(3,4,94,0.1),transparent);}
        .dot-bg{background-image:radial-gradient(circle,rgba(3,4,94,0.12) 1px,transparent 1px);background-size:26px 26px;}
        @keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(24px,-16px)}}
        @keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
        .blob1{animation:float1 10s ease-in-out infinite;}
        .blob2{animation:float2 14s ease-in-out infinite;}
        .j-line{position:absolute;left:27px;top:60px;bottom:-18px;width:2px;background:linear-gradient(180deg,rgba(41,98,255,.4),transparent);}
        .img-card{border-radius:20px;overflow:hidden;position:relative;box-shadow:0 24px 64px rgba(3,4,94,0.22);transition:transform .4s,box-shadow .4s;}
        .img-card:hover{transform:scale(1.02);box-shadow:0 32px 80px rgba(3,4,94,0.3);}

        /* Role tabs */
        .role-tab{display:flex;align-items:center;gap:10px;padding:12px 24px;border-radius:50px;cursor:pointer;border:1.5px solid rgba(3,4,94,0.12);background:white;font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:rgba(3,4,94,0.45);transition:all .25s;letter-spacing:.01em;}
        .role-tab:hover{border-color:rgba(3,4,94,0.3);color:${NAVY};transform:translateY(-2px);}
        .role-tab.active-participant{background:rgba(41,98,255,0.08);border-color:${ACCENT};color:${ACCENT};}
        .role-tab.active-organizer{background:rgba(124,58,237,0.08);border-color:#7C3AED;color:#7C3AED;}
        .role-tab.active-judge{background:rgba(5,150,105,0.08);border-color:#059669;color:#059669;}

        /* Step rows */
        .step-row{display:flex;gap:16px;align-items:flex-start;padding:18px 22px;border-radius:14px;background:white;border-left:4px solid transparent;border-top:1px solid rgba(3,4,94,0.07);border-right:1px solid rgba(3,4,94,0.07);border-bottom:1px solid rgba(3,4,94,0.07);transition:transform .25s,box-shadow .25s;cursor:default;}
        .step-row:hover{transform:translateX(6px);box-shadow:0 8px 28px rgba(3,4,94,0.09);}
        .step-num{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;flex-shrink:0;font-family:'Poppins',sans-serif;}
        .step-icon-wrap{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

        @media(max-width:768px){
          .hero-grid{flex-direction:column!important;}
          .pillar-grid{grid-template-columns:1fr!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .hiw-grid{grid-template-columns:1fr!important;}
          .stat-pill{padding:18px 24px!important;}
          .role-tabs{flex-wrap:wrap!important;}
        }
      `}</style>

            {/* ══ HERO ══ */}
            <section ref={heroRef} style={{ minHeight:"100vh", background:NAVY, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", padding:"100px 5% 80px" }}>
                <div className="spotlight" style={{ "--mx":`${mousePos.x}%`, "--my":`${mousePos.y}%` }} />
                <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"52px 52px", pointerEvents:"none" }} />
                <div className="blob1" style={{ position:"absolute", top:"-100px", right:"-80px", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(41,98,255,0.18) 0%,transparent 65%)", pointerEvents:"none" }} />
                <div className="blob2" style={{ position:"absolute", bottom:"-80px", left:"-60px", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(41,98,255,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />

                <div className="hero-grid" style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:60, maxWidth:1200, margin:"0 auto", width:"100%" }}>
                    <div style={{ flex:1 }}>
                        <Fade>
                            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:50, marginBottom:28, fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.65)", letterSpacing:".12em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.07)" }}>
                                <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block", boxShadow:"0 0 6px #22c55e" }} />
                                About HackForge
                            </div>
                        </Fade>
                        <Fade delay={.1}>
                            <h1 style={{ fontSize:"clamp(38px,5.5vw,72px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-.03em", color:"white", marginBottom:10 }}>Empowering Innovators.</h1>
                            <h1 style={{ fontSize:"clamp(38px,5.5vw,72px)", fontWeight:800, lineHeight:1.05, letterSpacing:"-.03em", color:ACCENT, marginBottom:28 }}>Building the Future.</h1>
                        </Fade>
                        <Fade delay={.18}>
                            <p style={{ fontSize:16, color:"rgba(255,255,255,0.6)", lineHeight:1.85, maxWidth:520, marginBottom:36, fontWeight:400 }}>
                                HackForge is a full-stack hackathon management platform built to simplify, automate, and elevate every stage of a hackathon — from registration to recognition.
                            </p>
                        </Fade>
                        <Fade delay={.24}>
                            <div style={{ display:"flex", gap:32, marginBottom:40, flexWrap:"wrap" }}>
                                {[
                                    { icon:<svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>, val:"100%", label:"Secure Platform" },
                                    { icon:<svg viewBox="0 0 20 20" width="18" height="18" fill="none"><circle cx="8" cy="7" r="3" stroke="white" strokeWidth="1.5"/><path d="M3 17c0-2.761 2.239-4 5-4M12 10l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, val:"10K+", label:"Participants" },
                                    { icon:<svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6l2-6z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>, val:"500+", label:"Hackathons" },
                                ].map(s => (
                                    <div key={s.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                                        <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>{s.icon}</div>
                                        <div>
                                            <div style={{ fontSize:17, fontWeight:800, color:"white", lineHeight:1, fontFamily:"'Poppins',sans-serif" }}>{s.val}</div>
                                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", letterSpacing:".08em", textTransform:"uppercase", fontWeight:700 }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Fade>
                        <Fade delay={.3}>
                            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                                {/* "Explore Hackathons" → /hackathons */}
                                <a href="/hackathons" className="btn-primary">
                                    Explore Hackathons
                                </a>
                                {/* "Our Journey" → scrolls to #journey section */}
                                <a
                                    href="#journey"
                                    className="btn-ghost"
                                    onClick={e => { e.preventDefault(); scrollToId("journey"); }}
                                >
                                    Our Journey
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </a>
                            </div>
                        </Fade>
                    </div>

                    <Fade delay={.15} style={{ flex:1, position:"relative", minHeight:420 }}>
                        <div style={{ position:"relative" }}>
                            <div className="img-card" style={{ width:"100%", aspectRatio:"4/3" }}>
                                <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80" alt="Hackathon participants" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(3,4,94,0.6) 0%,rgba(41,98,255,0.3) 100%)" }} />
                                <div style={{ position:"absolute", top:"50%", right:24, transform:"translateY(-50%)", fontSize:80, fontWeight:900, color:"rgba(255,255,255,0.08)", fontFamily:"monospace", lineHeight:1 }}>{"{ }"}</div>
                                <div style={{ position:"absolute", top:20, left:20 }}>
                                    <div style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"8px 14px", fontSize:12, color:"white", fontWeight:700 }}>🏆 Live Hackathon</div>
                                </div>
                            </div>
                            <div style={{ position:"absolute", bottom:-18, left:-18, background:NAVY, borderRadius:16, padding:"14px 20px", border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 16px 48px rgba(3,4,94,0.4)" }}>
                                <div style={{ fontSize:24, fontWeight:800, color:"white", fontFamily:"'Poppins',sans-serif" }}>50+</div>
                                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700 }}>Partner Universities</div>
                            </div>
                            <div style={{ position:"absolute", top:-18, right:-18, background:ACCENT, borderRadius:16, padding:"14px 20px", boxShadow:"0 16px 48px rgba(41,98,255,0.5)" }}>
                                <div style={{ fontSize:24, fontWeight:800, color:"white", fontFamily:"'Poppins',sans-serif" }}>1M+</div>
                                <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", textTransform:"uppercase", letterSpacing:".1em", fontWeight:700 }}>Lines of Code</div>
                            </div>
                        </div>
                    </Fade>
                </div>
            </section>

            {/* ══ MARQUEE ══ */}
            <div style={{ background:NAVY, borderTop:"1px solid rgba(255,255,255,0.08)", padding:"14px 0", overflow:"hidden" }}>
                <div className="marquee-track">
                    {[...Array(2)].map((_,ri) =>
                        ["Hackathon Management","Team Formation","Live Judging","Auto Certificates","Razorpay Payments","University Dashboards","Real-time Updates","Role-based Access","PDF Generation","Socket.IO","MongoDB","JWT Auth"].map((t,i) => (
                            <span key={`${ri}-${i}`} style={{ color:"rgba(255,255,255,0.45)", fontSize:11, fontWeight:800, letterSpacing:".15em", textTransform:"uppercase", marginRight:44 }}>
                                {t} <span style={{ color:"rgba(255,255,255,0.2)", marginRight:44 }}>✦</span>
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ══ FEATURES ══ */}
            <section style={{ padding:"110px 5%", background:WHITE_OFF }}>
                <Fade>
                    <div style={{ textAlign:"center", marginBottom:70 }}>
                        <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:700, color:NAVY, letterSpacing:"-.025em" }}>
                            Everything You Need, <span style={{ color:ACCENT }}>All in One Platform</span>
                        </h2>
                        <p style={{ fontSize:15, color:NAVY_TEXT, marginTop:14, maxWidth:520, margin:"14px auto 0" }}>
                            Designed to streamline hackathons for participants, organizers, and institutions.
                        </p>
                    </div>
                </Fade>
                <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:18, maxWidth:1100, margin:"0 auto" }}>
                    {features.map((f,i) => (
                        <Fade key={f.title} delay={i*.07}>
                            <div className="fcard">
                                <div className="fcard-bar"/>
                                <div style={{ width:56, height:56, borderRadius:16, background:"rgba(41,98,255,0.07)", border:"1.5px solid rgba(41,98,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                                    <f.Icon />
                                </div>
                                <h3 style={{ fontSize:17, fontWeight:700, color:NAVY, marginBottom:10 }}>{f.title}</h3>
                                <p style={{ fontSize:14, color:NAVY_TEXT, lineHeight:1.78 }}>{f.desc}</p>
                            </div>
                        </Fade>
                    ))}
                </div>
            </section>

            <div className="divider"/>

             {/* ══ STATS STRIP ══ */}
            <section style={{ background:NAVY, padding:"64px 5%" }}>
                <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", maxWidth:1000, margin:"0 auto", borderRadius:20, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)" }}>
                    {[
                        { icon:<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>, to:10000, suffix:"+", label:"Happy Participants" },
                        { icon:<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, to:50, suffix:"+", label:"Partner Universities" },
                        { icon:<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>, to:500, suffix:"+", label:"Hackathons Hosted" },
                        { icon:<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M8 6l-4 6 4 6M16 6l4 6-4 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="15" y1="4" x2="9" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>, to:1, suffix:"M+", label:"Lines of Code" },
                    ].map((s,i,arr) => (
                        <div key={s.label} className="stat-pill" style={{ borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.1)":"none" }}>
                            <div style={{ marginBottom:10, opacity:0.7 }}>{s.icon}</div>
                            <div style={{ fontSize:32, fontWeight:800, color:"white", fontFamily:"'Poppins',sans-serif", lineHeight:1 }}><Counter to={s.to} suffix={s.suffix}/></div>
                            <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:".12em", fontWeight:700, marginTop:6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ VISION / MISSION / ABOUT ══ */}
            <section style={{ padding:"110px 5%", background:"white", position:"relative", overflow:"hidden" }}>
                <div className="dot-bg" style={{ position:"absolute", inset:0, opacity:0.5 }}/>
                <div style={{ position:"relative", zIndex:1 }}>
                    <Fade>
                        <div style={{ textAlign:"center", marginBottom:70 }}>
                            <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:700, color:NAVY, letterSpacing:"-.025em" }}>
                                Our Purpose & <span style={{ color:ACCENT }}>Story</span>
                            </h2>
                            <p style={{ fontSize:15, color:NAVY_TEXT, marginTop:14, maxWidth:480, margin:"14px auto 0" }}>The beliefs and experiences that drive everything we build.</p>
                        </div>
                    </Fade>
                    <div style={{ display:"flex", gap:56, alignItems:"center", maxWidth:1100, margin:"0 auto 72px", flexWrap:"wrap" }}>
                        <Fade delay={.05} style={{ flex:1, minWidth:280 }}>
                            <div className="img-card" style={{ borderRadius:24 }}>
                                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80" alt="Team collaborating" style={{ width:"100%", height:340, objectFit:"cover", display:"block" }}/>
                                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(3,4,94,0.5) 0%,transparent 60%)" }}/>
                                <div style={{ position:"absolute", bottom:20, left:20, right:20 }}>
                                    <div style={{ fontSize:18, fontWeight:700, color:"white" }}>Born at a Hackathon</div>
                                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:4 }}>Founded by developers who lived the problem</div>
                                </div>
                            </div>
                        </Fade>
                        <Fade delay={.12} style={{ flex:1.3, minWidth:280 }}>
                            <div>
                                <h3 style={{ fontSize:"clamp(22px,3vw,36px)", fontWeight:700, color:NAVY, letterSpacing:"-.02em", margin:"12px 0 18px", lineHeight:1.2 }}>From Frustration<br/>to Innovation</h3>
                                <p style={{ fontSize:15, color:NAVY_TEXT, lineHeight:1.9, marginBottom:16 }}>HackForge was created during a 48-hour hackathon where our founding team experienced the chaos of spreadsheet-driven judging, misplaced certificates, and broken payment flows.</p>
                                <p style={{ fontSize:15, color:NAVY_TEXT, lineHeight:1.9, marginBottom:28 }}>Today, HackForge powers hackathons across universities like MDU and DTU, serving 10,000+ participants with a platform that handles everything from team formation to certified winners — automatically.</p>
                                <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                                    {[{val:"10K+",label:"Happy Participants"},{val:"50+",label:"Partner Universities"},{val:"500+",label:"Hackathons Hosted"}].map(s=>(
                                        <div key={s.label} style={{ textAlign:"center", padding:"14px 18px", borderRadius:12, background:"rgba(41,98,255,0.05)", border:"1px solid rgba(41,98,255,0.15)" }}>
                                            <div style={{ fontSize:22, fontWeight:800, color:ACCENT, fontFamily:"'Poppins',sans-serif" }}>{s.val}</div>
                                            <div style={{ fontSize:11, color:NAVY_TEXT, textTransform:"uppercase", letterSpacing:".08em", fontWeight:700, marginTop:4 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Fade>
                    </div>
                    <div className="pillar-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, maxWidth:1100, margin:"0 auto" }}>
                        {pillars.map((p,i) => (
                            <Fade key={p.tag} delay={i*.1}>
                                <div className="pillar">
                                    <div style={{ width:58, height:58, borderRadius:16, background:"rgba(41,98,255,0.07)", border:"1.5px solid rgba(41,98,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:22 }}>{p.icon}</div>
                                    <span style={{ fontSize:10, fontWeight:800, color:ACCENT, textTransform:"uppercase", letterSpacing:".15em" }}>{p.tag}</span>
                                    <h3 style={{ fontSize:19, fontWeight:700, color:NAVY, margin:"10px 0 14px", lineHeight:1.25 }}>{p.title}</h3>
                                    <p style={{ fontSize:14, color:NAVY_TEXT, lineHeight:1.8 }}>{p.desc}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ JOURNEY ══ */}
            {/* id="journey" so the "Our Journey" hero button can scroll here */}
            <section id="journey" style={{ padding:"110px 5%", background:WHITE_OFF }}>
                <div style={{ display:"flex", gap:70, alignItems:"flex-start", maxWidth:1100, margin:"0 auto", flexWrap:"wrap" }}>
                    <div style={{ flex:1, minWidth:280 }}>
                        <Fade>
                            <h2 style={{ fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, color:NAVY, letterSpacing:"-.025em", margin:"12px 0 16px", lineHeight:1.15 }}>From Vision<br/>to Impact</h2>
                            <p style={{ fontSize:15, color:NAVY_TEXT, lineHeight:1.8, marginBottom:36, maxWidth:360 }}>HackForge was born out of the need to simplify hackathon management and create a meaningful experience for every innovator.</p>
                        </Fade>
                        <Fade delay={.1}>
                            <div className="img-card" style={{ borderRadius:20 }}>
                                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" alt="Technology" style={{ width:"100%", height:240, objectFit:"cover", display:"block" }}/>
                                <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(3,4,94,0.7) 0%,rgba(41,98,255,0.4) 100%)" }}/>
                                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <div style={{ textAlign:"center" }}>
                                        <div style={{ fontSize:48, fontWeight:900, color:"white", fontFamily:"'Poppins',sans-serif", lineHeight:1 }}><Counter to={10} suffix="K+"/></div>
                                        <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:".12em", fontWeight:700 }}>Participants Empowered</div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </div>
                    <div style={{ flex:1, minWidth:280, position:"relative" }}>
                        <Fade delay={.05}>
                            {journey.map((item,i) => (
                                <div key={item.n} style={{ display:"flex", gap:20, alignItems:"flex-start", position:"relative", marginBottom:i<journey.length-1?12:0 }}>
                                    {i<journey.length-1 && <div className="j-line"/>}
                                    <div style={{ width:54, height:54, borderRadius:"50%", background:NAVY, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1 }}>{item.icon}</div>
                                    <div style={{ flex:1, borderRadius:16, padding:"18px 22px", marginBottom:14, background:"white", border:`1px solid ${NAVY_MID}`, transition:"box-shadow .25s", cursor:"default" }}
                                        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 28px rgba(3,4,94,0.1)"}
                                        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                                            <div style={{ fontSize:12, fontWeight:800, color:NAVY, letterSpacing:".06em", textTransform:"uppercase" }}>{item.t}</div>
                                            <div style={{ fontSize:10, fontWeight:800, color:"rgba(3,4,94,0.25)", fontFamily:"monospace" }}>{item.n}</div>
                                        </div>
                                        <p style={{ fontSize:14, color:NAVY_TEXT, lineHeight:1.7 }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </Fade>
                    </div>
                </div>
            </section>

           

            
            <div className="divider"/>

            {/* ══════════════════════════════════════════
                HOW IT WORKS
            ══════════════════════════════════════════ */}
            <section style={{ padding:"110px 5%", background:WHITE_OFF, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(41,98,255,0.055) 1px,transparent 1px)", backgroundSize:"30px 30px", pointerEvents:"none" }}/>
                <div style={{ position:"relative", zIndex:1, maxWidth:1100, margin:"0 auto" }}>
                    <Fade>
                        <div style={{ textAlign:"center", marginBottom:56 }}>
                            <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:700, color:NAVY, letterSpacing:"-.025em" }}>
                                How It <span style={{ color:ACCENT }}>Works</span>
                            </h2>
                            <p style={{ fontSize:15, color:NAVY_TEXT, marginTop:14, maxWidth:500, margin:"14px auto 0" }}>
                                HackForge is built for every role in the hackathon ecosystem. Pick your role and see your journey.
                            </p>
                        </div>
                    </Fade>

                    {/* Role Tabs */}
                    <Fade delay={.08}>
                        <div className="role-tabs" style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:52, flexWrap:"wrap" }}>
                            {roles.map(role => (
                                <button
                                    key={role.key}
                                    className={`role-tab${selectedRole===role.key?` active-${role.key}`:""}`}
                                    onClick={() => setSelectedRole(role.key)}
                                >
                                    {role.key === "participant" && (
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
                                            <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                        </svg>
                                    )}
                                    {/* {role.key === "organizer" && (
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                            <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                                            <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                            <path d="M8 14h8M8 18h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                                        </svg>
                                    )}
                                    {role.key === "judge" && (
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                                            <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5l-6.2 4.4 2.4-7.2L2 9.2h7.6L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                                        </svg>
                                    )} */}
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </Fade>

                    {/* Steps Grid */}
                    {activeRoleData && (
                        <Fade key={selectedRole} delay={0}>
                            <div className="hiw-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:12 }}>
                                {activeRoleData.steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="step-row"
                                        style={{ borderLeftColor: activeRoleData.color }}
                                    >
                                        <div className="step-num" style={{ background:`${activeRoleData.color}14`, color:activeRoleData.color }}>
                                            {String(i+1).padStart(2,"0")}
                                        </div>
                                        <div className="step-icon-wrap" style={{ background:`${activeRoleData.color}0e` }}>
                                            <step.Icon c={activeRoleData.color}/>
                                        </div>
                                        <div style={{ flex:1 }}>
                                            <div style={{ fontSize:14, fontWeight:800, color:NAVY, marginBottom:5, letterSpacing:".01em" }}>{step.title}</div>
                                            <p style={{ fontSize:13, color:NAVY_TEXT, lineHeight:1.72, margin:0 }}>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA strip — button links to role-specific route */}
                            <div style={{ marginTop:40, padding:"28px 36px", borderRadius:20, background:activeRoleData.color, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
                                <div>
                                    <div style={{ fontSize:18, fontWeight:700, color:"white", marginBottom:5 }}>Ready to join as a {activeRoleData.label}?</div>
                                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)" }}>Get started in under 2 minutes — no setup required.</div>
                                </div>
                                {/* Link to role-specific destination */}
                                <a
                                    href={activeRoleData.ctaHref}
                                    className="btn-cta-white"
                                    style={{ color: activeRoleData.color }}
                                >
                                    {activeRoleData.ctaLabel}
                                </a>
                            </div>
                        </Fade>
                    )}
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section style={{ padding:"110px 5%", textAlign:"center", background:NAVY, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 25% 50%,rgba(255,255,255,0.04) 0%,transparent 50%),radial-gradient(circle at 75% 50%,rgba(255,255,255,0.03) 0%,transparent 50%)", pointerEvents:"none" }}/>
                <div style={{ position:"relative", zIndex:1 }}>
                    <Fade>
                        <span className="sec-label" style={{ color:"rgba(255,255,255,0.4)" }}>Ready to Hack?</span>
                        <h2 style={{ fontSize:"clamp(34px,5vw,66px)", fontWeight:700, color:"white", letterSpacing:"-.03em", lineHeight:1.08, marginBottom:20 }}>
                            Build. Compete. <span style={{ color:"rgba(255,255,255,0.45)" }}>Certify.</span>
                        </h2>
                        <p style={{ fontSize:16, color:"rgba(255,255,255,0.5)", marginBottom:44, fontWeight:400, maxWidth:460, margin:"0 auto 44px", fontFamily:"'Nunito',sans-serif" }}>
                            Join thousands of developers on a platform built for serious innovation.
                        </p>
                        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                            {/* "Get Started Free" → /register */}
                            <a href="/register" className="btn-primary" style={{ background:"white", color:NAVY }}>
                                Get Started Free
                            </a>
                            {/* "Contact Team" → /contact */}
                            <a href="/contact" className="btn-ghost" style={{ color:"white", borderColor:"rgba(255,255,255,0.3)" }}>
                                Contact Team
                            </a>
                        </div>
                    </Fade>
                </div>
            </section>
        </div>
    );
}