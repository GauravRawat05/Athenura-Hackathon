import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NAVY = "#03045E";
const WHITE = "#ffffff";
const OFF = "#f0f2ff";
const ACCENT = "#2962FF";
const NAVY_10 = "rgba(3,4,94,0.07)";
const NAVY_15 = "rgba(3,4,94,0.13)";
const NAVY_50 = "rgba(3,4,94,0.5)";
const NAVY_65 = "rgba(3,4,94,0.65)";

/* ── InView hook ── */
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

function Fade({ children, delay = 0, y = 28, style = {}, className = "" }) {
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

/* ── SVG Icons ── */
const MailIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);
const PhoneIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.05-.25 11.5 11.5 0 003.6.72 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.03L6.6 10.8z" />
    </svg>
);
const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
const ChevronIcon = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: "transform .32s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>
        <path d="M6 9l6 6 6-6" />
    </svg>
);
const ClockIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
);
const CheckIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const SpinnerIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
        style={{ animation: "spin .8s linear infinite" }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
    </svg>
);
const TwitterSVG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.04C7.69 5.38 4.07 3.6 1.64.9a4.52 4.52 0 00-.61 2.27c0 1.57.8 2.96 2.01 3.77a4.48 4.48 0 01-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.43-.38.1-.78.16-1.19.16-.29 0-.57-.03-.85-.08.57 1.79 2.24 3.09 4.21 3.12A9.05 9.05 0 010 19.54a12.77 12.77 0 006.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0023 3z" />
    </svg>
);
const LinkedInSVG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
);
const GithubSVG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
);
const DiscordSVG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={NAVY}>
        <path d="M20.32 4.37A19.79 19.79 0 0015.43 2.86a.07.07 0 00-.08.04c-.21.37-.44.86-.61 1.25a18.27 18.27 0 00-5.49 0 12.64 12.64 0 00-.62-1.25.08.08 0 00-.08-.04A19.74 19.74 0 003.68 4.37a.07.07 0 00-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 00.03.06 19.9 19.9 0 005.99 3.03.08.08 0 00.08-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 00-.04-.11 13.1 13.1 0 01-1.87-.89.08.08 0 010-.13c.13-.09.25-.19.37-.29a.07.07 0 01.08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 01.08.01c.12.1.25.2.37.29a.08.08 0 010 .13c-.6.35-1.23.65-1.87.89a.08.08 0 00-.04.11c.36.7.77 1.36 1.23 1.99a.07.07 0 00.08.03 19.84 19.84 0 006-3.03.08.08 0 00.03-.05c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 00-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.41s.96-2.41 2.16-2.41c1.21 0 2.18 1.09 2.16 2.41 0 1.33-.96 2.41-2.16 2.41zm7.97 0c-1.18 0-2.16-1.08-2.16-2.41s.96-2.41 2.16-2.41c1.21 0 2.18 1.09 2.16 2.41 0 1.33-.95 2.41-2.16 2.41z" />
    </svg>
);

/* ── DATA ── */
const roles = [
    { value: "participant", label: "Participant / Developer" },
    { value: "admin", label: "Event Organizer / Admin" },
    { value: "university", label: "University Representative" },
    { value: "judge", label: "Judge / Evaluator" },
    { value: "sponsor", label: "Sponsor / Partner" },
    { value: "other", label: "Other" },
];

const routeMap = [
    { role: "Participant / Developer", dept: "Participant Support", color: "#22c55e" },
    { role: "University Representative", dept: "Institutional Onboarding", color: ACCENT },
    { role: "Event Organizer / Admin", dept: "Platform Configuration", color: "#f59e0b" },
    { role: "Judge / Evaluator", dept: "Judge Assignment Team", color: "#8b5cf6" },
    { role: "Sponsor / Partner", dept: "Partnerships & Growth", color: "#ef4444" },
];

const responseTimes = [
    { label: "General Queries", time: "< 24 hrs" },
    { label: "Technical Issues", time: "< 6 hrs" },
    { label: "Institutional Setup", time: "< 48 hrs" },
];

const socials = [
    { label: "Twitter / X", Svg: TwitterSVG },
    { label: "LinkedIn", Svg: LinkedInSVG },
    { label: "GitHub", Svg: GithubSVG },
    { label: "Discord", Svg: DiscordSVG },
];

const faqs = [
    { q: "How do I register for a hackathon?", a: "Sign up on HackForge, verify your email, then browse and join any listed hackathon. Payment (if applicable) is handled via Razorpay." },
    { q: "Can universities get a custom dashboard?", a: "Yes. University admins receive dedicated login credentials from the main admin. Students are auto-linked based on their institutional email domain (e.g. mdu.ac.in)." },
    { q: "How are certificates generated?", a: "Certificates are auto-generated as signed PDFs using Puppeteer after results are declared. Each includes a unique QR code for public verification." },
    { q: "What payment methods are supported?", a: "We use Razorpay for all transactions — supporting UPI, cards, net banking, and wallets. Free hackathons need no payment." },
    { q: "How does the judging system work?", a: "Admins configure custom rubrics (e.g. innovation, complexity, presentation). Judges score via their dashboard; scores are aggregated using weighted averages." },
];

/* ── Hero image collage ── */
function HeroImageCollage() {
    return (
        <div style={{ position: "relative", width: "100%", minHeight: 480 }}>
            <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(3,4,94,0.45)", position: "relative", transition: "transform .4s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&q=80" alt="Team collaborating"
                    style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,4,94,0.55) 0%, rgba(41,98,255,0.3) 100%)" }} />
                <div style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "white", letterSpacing: ".06em" }}>💬 Support Response</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>Average reply in &lt; 6 hrs</div>
                </div>
                <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", padding: "8px 14px", borderRadius: 50 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                    <span style={{ fontSize: 11, color: "white", fontWeight: 700 }}>Team Online</span>
                </div>
            </div>
            <div style={{ position: "absolute", bottom: -20, left: -20, background: NAVY, borderRadius: 18, padding: "16px 22px", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 48px rgba(3,4,94,0.5)", transition: "transform .3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>50+</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginTop: 4 }}>Partner Universities</div>
            </div>
            <div style={{ position: "absolute", top: -20, right: -20, background: ACCENT, borderRadius: 18, padding: "16px 22px", boxShadow: "0 16px 48px rgba(41,98,255,0.55)", transition: "transform .3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>10K+</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginTop: 4 }}>Happy Developers</div>
            </div>
        </div>
    );
}

/* ── Bento card — Email ── */
function BentoEmail() {
    const [hov, setHov] = useState(false);
    return (
        <a href="mailto:support@hackforge.dev" className="bento-cell" style={{ gridColumn: "span 7", background: NAVY, color: "white", padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260, transform: hov ? "translateY(-6px)" : "none", boxShadow: hov ? "0 24px 60px rgba(3,4,94,0.14)" : "none" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                <MailIcon />
            </div>
            <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 18 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>
                    Reply within 24 hours
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Poppins',sans-serif", color: "white", lineHeight: 1.2 }}>support@hackforge.dev</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>Drop us a line for any query — participant support, partnerships, technical issues</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: hov ? 10 : 6, fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginTop: 20, transition: "gap .2s, opacity .2s", opacity: hov ? 1 : 0.45 }}>
                    Write to us <ArrowIcon />
                </div>
            </div>
        </a>
    );
}

/* ── Bento card — Phone ── */
function BentoPhone() {
    const [hov, setHov] = useState(false);
    return (
        <a href="tel:+919876543210" className="bento-cell" style={{ gridColumn: "span 5", background: ACCENT, color: "white", padding: 36, minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "space-between", transform: hov ? "translateY(-6px)" : "none", boxShadow: hov ? "0 24px 60px rgba(41,98,255,0.35)" : "none" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 18, display: "flex", alignItems: "center", gap: 7 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    Mon–Fri · 10am–6pm IST
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Poppins',sans-serif", color: "white", lineHeight: 1.2 }}>+91 98765 43210</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>Speak directly with our support team</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PhoneIcon />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: hov ? 10 : 6, fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", transition: "gap .2s, opacity .2s", opacity: hov ? 1 : 0.55 }}>
                    Call now <ArrowIcon />
                </div>
            </div>
        </a>
    );
}

/* ── Bento card — HQ ── */
function BentoHQ() {
    const [hov, setHov] = useState(false);
    return (
        <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="bento-cell" style={{ gridColumn: "span 5", minHeight: 220, overflow: "hidden", position: "relative", borderRadius: 22, transform: hov ? "translateY(-6px)" : "none", boxShadow: hov ? "0 24px 60px rgba(3,4,94,0.14)" : "none" }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=700&q=80" alt="New Delhi"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .5s", transform: hov ? "scale(1.06)" : "scale(1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(3,4,94,0.88) 0%, rgba(3,4,94,0.3) 60%, transparent 100%)" }} />
            <div style={{ position: "absolute", inset: 0, padding: 28, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                    Headquarters
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Poppins',sans-serif", color: "white", lineHeight: 1.2 }}>New Delhi, India</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>DTU Tech Incubator</div>
                <div style={{ display: "flex", alignItems: "center", gap: hov ? 10 : 6, fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginTop: 14, transition: "gap .2s, opacity .2s", opacity: hov ? 1 : 0.55 }}>
                    Get directions <ArrowIcon />
                </div>
            </div>
        </a>
    );
}

/* ── Bento card — Discord Community ── */
const DISCORD = "#5865F2";
function BentoCommunity() {
    const [hov, setHov] = useState(false);
    const channels = [
        { icon: "📢", name: "announcements", desc: "Platform updates & new hackathons" },
        { icon: "🛠️", name: "dev-support",   desc: "Technical help from the community" },
        { icon: "🏆", name: "showcase",       desc: "Show off your winning projects" },
    ];
    return (
        <a href="https://discord.gg/hackforge" target="_blank" rel="noreferrer"
            className="bento-cell"
            style={{
                gridColumn: "span 7", minHeight: 220,
                background: hov
                    ? "linear-gradient(135deg, #4752c4 0%, #5865F2 50%, #7289da 100%)"
                    : "linear-gradient(135deg, #3c4399 0%, #5865F2 55%, #6f7fda 100%)",
                padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between",
                transform: hov ? "translateY(-6px)" : "none",
                boxShadow: hov ? "0 28px 64px rgba(88,101,242,0.45)" : "0 8px 32px rgba(88,101,242,0.25)",
                transition: "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, background .35s",
                position: "relative", overflow: "hidden",
            }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>

            {/* Background blob */}
            <div style={{
                position: "absolute", top: -40, right: -40, width: 200, height: 200,
                borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: -30, left: "30%", width: 140, height: 140,
                borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none",
            }} />

            {/* Header */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 7 }}>
                        {/* Discord logo */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
                            <path d="M20.32 4.37A19.79 19.79 0 0015.43 2.86a.07.07 0 00-.08.04c-.21.37-.44.86-.61 1.25a18.27 18.27 0 00-5.49 0 12.64 12.64 0 00-.62-1.25.08.08 0 00-.08-.04A19.74 19.74 0 003.68 4.37a.07.07 0 00-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 00.03.06 19.9 19.9 0 005.99 3.03.08.08 0 00.08-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 00-.04-.11 13.1 13.1 0 01-1.87-.89.08.08 0 010-.13c.13-.09.25-.19.37-.29a.07.07 0 01.08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 01.08.01c.12.1.25.2.37.29a.08.08 0 010 .13c-.6.35-1.23.65-1.87.89a.08.08 0 00-.04.11c.36.7.77 1.36 1.23 1.99a.07.07 0 00.08.03 19.84 19.84 0 006-3.03.08.08 0 00.03-.05c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 00-.03-.03z"/>
                        </svg>
                        Community
                    </div>
                    {/* Live member count */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 50, padding: "4px 12px" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>1,240 online</span>
                    </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Poppins',sans-serif", color: "white", lineHeight: 1.2, marginBottom: 6 }}>
                    Join Our Discord
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>
                    10,000+ developers · get peer help, share projects &amp; be first to know about upcoming hackathons
                </div>
            </div>

            {/* Channel previews */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
                    {channels.map((ch) => (
                        <div key={ch.name} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "8px 12px", borderRadius: 10,
                            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                        }}>
                            <span style={{ fontSize: 14 }}>{ch.icon}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>#{ch.name}</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginLeft: "auto", textAlign: "right", maxWidth: 160 }}>{ch.desc}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                        hackforge.dev/discord
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: hov ? 10 : 6, fontSize: 12, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", transition: "gap .2s, color .2s", ...(hov ? { color: "white" } : {}) }}>
                        Join Server <ArrowIcon />
                    </div>
                </div>
            </div>
        </a>
    );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", role: "", subject: "", message: "" });
    const [status, setStatus] = useState("idle");
    const [openFaq, setOpenFaq] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
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

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) return;
        setStatus("sending");
        setTimeout(() => setStatus("sent"), 1800);
    };

    return (
        <div style={{ fontFamily: "'Nunito','Poppins',sans-serif", background: OFF, color: NAVY, overflowX: "hidden", minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(41,98,255,0.18); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f0f2ff; }
        ::-webkit-scrollbar-thumb { background:${NAVY}; border-radius:4px; }
        h1,h2,h3,h4 { font-family:'Poppins',sans-serif; }

        .spotlight {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background: radial-gradient(circle 520px at var(--mx) var(--my), rgba(41,98,255,0.14) 0%, transparent 70%);
        }
        .sec-label {
          display:inline-block; font-size:10.5px; font-weight:800; letter-spacing:.18em;
          text-transform:uppercase; color:${ACCENT}; margin-bottom:14px;
          padding:5px 14px; border-radius:50px;
          background:rgba(41,98,255,0.08); border:1px solid rgba(41,98,255,0.2);
          font-family:'Nunito',sans-serif;
        }
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-18px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.04)} }
        .blob1 { animation:float1 10s ease-in-out infinite; }
        .blob2 { animation:float2 14s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.6)} 50%{box-shadow:0 0 0 8px transparent} }
        .pulse { animation:pulse 2.2s ease-in-out infinite; }

        /* Bento grid */
        .bento-grid {
          display:grid;
          grid-template-columns:repeat(12,1fr);
          gap:16px;
          max-width:1100px;
          margin:0 auto;
        }
        .bento-cell {
          border-radius:22px;
          overflow:hidden;
          position:relative;
          transition:transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s;
          cursor:pointer;
          text-decoration:none;
          display:block;
        }

        /* btn primary */
        .btn-primary {
          background:${NAVY}; color:white; font-weight:800; font-size:14px;
          font-family:'Nunito',sans-serif; border:none; border-radius:50px;
          padding:14px 38px; cursor:pointer; letter-spacing:.04em;
          box-shadow:0 6px 28px rgba(3,4,94,0.28);
          transition:transform .22s, box-shadow .22s, background .22s;
          display:inline-flex; align-items:center; gap:8px;
        }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(3,4,94,0.36); background:#040672; }
        .btn-primary:disabled { opacity:.65; cursor:default; transform:none; }
        .btn-ghost-white {
          background:transparent; color:white; border:2px solid rgba(255,255,255,0.35);
          border-radius:50px; padding:12px 32px; font-size:14px; font-weight:700;
          font-family:'Nunito',sans-serif; cursor:pointer;
          transition:background .2s,border-color .2s;
          display:inline-flex; align-items:center; gap:8px;
        }
        .btn-ghost-white:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.65); }

        /* form fields */
        .field-label {
          display:block; font-size:11px; font-weight:800; letter-spacing:.12em;
          text-transform:uppercase; color:${NAVY}; opacity:.5; margin-bottom:8px;
          font-family:'Nunito',sans-serif;
        }
        .field {
          width:100%; background:${OFF}; border:1.5px solid rgba(3,4,94,0.1);
          border-radius:14px; padding:13px 17px; font-size:14px; color:${NAVY};
          font-family:'Nunito',sans-serif; font-weight:600;
          transition:border-color .22s, box-shadow .22s, background .22s; outline:none; resize:none;
        }
        .field:focus { border-color:${ACCENT}; box-shadow:0 0 0 4px rgba(41,98,255,0.1); background:white; }
        .field::placeholder { color:rgba(3,4,94,0.28); font-weight:400; }
        select.field { appearance:none; cursor:pointer; }
        .char { font-size:11px; color:rgba(3,4,94,0.3); text-align:right; margin-top:5px; }

        /* faq */
        .faq-item {
          border-radius:18px; overflow:hidden;
          border:1.5px solid rgba(3,4,94,0.08);
          background:white; transition:border-color .25s, box-shadow .25s, transform .25s;
          margin-bottom:10px;
        }
        .faq-item:hover { border-color:rgba(41,98,255,0.25); box-shadow:0 8px 32px rgba(3,4,94,0.08); transform:translateX(4px); }
        .faq-q {
          width:100%; background:transparent; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 24px; text-align:left; font-family:'Nunito',sans-serif;
          font-size:15px; font-weight:800; color:${NAVY}; gap:16px;
        }
        .faq-a {
          max-height:0; overflow:hidden;
          transition:max-height .45s cubic-bezier(.22,1,.36,1), padding .3s;
          font-size:14px; color:${NAVY_65}; line-height:1.8; font-weight:400;
          padding:0 24px; font-family:'Nunito',sans-serif;
        }
        .faq-a.open { max-height:200px; padding:0 24px 22px; }

        /* social */
        .social {
          width:46px; height:46px; border-radius:14px;
          border:1.5px solid rgba(3,4,94,0.14);
          display:flex; align-items:center; justify-content:center;
          transition:background .22s, border-color .22s, transform .22s, box-shadow .22s;
          cursor:pointer; text-decoration:none; background:white;
        }
        .social:hover { background:rgba(3,4,94,0.05); border-color:${NAVY}; transform:translateY(-4px); box-shadow:0 8px 20px rgba(3,4,94,0.12); }

        /* route row */
        .rrow {
          display:flex; align-items:center; gap:14px; padding:11px 14px;
          border-radius:12px; background:rgba(3,4,94,0.04);
          border:1px solid rgba(3,4,94,0.06); margin-bottom:8px;
          transition:background .2s, transform .22s;
          cursor:default;
        }
        .rrow:last-child { margin-bottom:0; }
        .rrow:hover { background:rgba(3,4,94,0.08); transform:translateX(5px); }

        .divider { height:1px; background:linear-gradient(90deg,transparent,rgba(3,4,94,0.12),transparent); }
        .dot-bg {
          background-image: radial-gradient(circle, rgba(3,4,94,0.07) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        /* context panel */
        .context-panel {
          border-radius:22px; padding:26px;
          background:${OFF}; border:1.5px solid rgba(3,4,94,0.1);
          transition: transform .3s, box-shadow .3s;
        }
        .context-panel:hover { transform:translateY(-4px); box-shadow:0 14px 44px rgba(3,4,94,0.09); }

        @keyframes pop { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        .pop { animation:pop .5s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .img-card {
          border-radius:20px; overflow:hidden; position:relative;
          box-shadow:0 20px 60px rgba(3,4,94,0.22);
          transition: transform .4s, box-shadow .4s;
        }
        .img-card:hover { transform:scale(1.02); box-shadow:0 28px 80px rgba(3,4,94,0.3); }

        @media(max-width:900px) {
          .hero-grid { flex-direction:column !important; }
          .contact-grid { grid-template-columns:1fr !important; }
          .bento-grid { grid-template-columns:1fr !important; }
          .bento-cell { grid-column:span 1 !important; }
        }
        @media(max-width:600px) {
          .form-row { grid-template-columns:1fr !important; }
        }
      `}</style>

            {/* ══ HERO ══ */}
            <section ref={heroRef} style={{ minHeight: "100vh", background: NAVY, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "110px 5% 130px" }}>
                <div className="spotlight" style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` }} />
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
                <div className="blob1" style={{ position: "absolute", top: "-80px", right: "-80px", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,rgba(41,98,255,0.18) 0%,transparent 65%)", pointerEvents: "none" }} />
                <div className="blob2" style={{ position: "absolute", bottom: "-80px", left: "-60px", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(41,98,255,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />
                <div className="hero-grid" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 64, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <Fade>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 20px", borderRadius: 50, marginBottom: 30, fontSize: 11.5, fontWeight: 800, color: "rgba(255,255,255,0.65)", letterSpacing: ".12em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.07)", fontFamily: "'Nunito',sans-serif" }}>
                                <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                                We're here to help
                            </div>
                        </Fade>
                        <Fade delay={.1}>
                            <h1 style={{ fontSize: "clamp(40px,6vw,76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.03em", color: "white", marginBottom: 10 }}>Get in Touch</h1>
                            <h1 style={{ fontSize: "clamp(40px,6vw,76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.03em", color: ACCENT, marginBottom: 28 }}>With HackForge.</h1>
                        </Fade>
                        <Fade delay={.18}>
                            <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "rgba(255,255,255,0.58)", lineHeight: 1.9, maxWidth: 500, marginBottom: 36, fontWeight: 400 }}>
                                Whether you're a participant, university rep, event organiser, or sponsor — our team is ready to assist across every stage of your journey with HackForge.
                            </p>
                        </Fade>
                        <Fade delay={.24}>
                            <div style={{ display: "flex", gap: 28, marginBottom: 42, flexWrap: "wrap" }}>
                                {[
                                    { icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="white" strokeWidth="1.5" /><path d="M2 7l8 5 8-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, val: "< 6h", label: "Reply Time" },
                                    { icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M10 2a6 6 0 100 12A6 6 0 0010 2zM2 18c0-2 3.134-4 8-4s8 2 8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, val: "50+", label: "Universities" },
                                    { icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M3 6h14M3 10h14M3 14h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>, val: "500+", label: "Hackathons" },
                                ].map(s => (
                                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1, fontFamily: "'Poppins',sans-serif" }}>{s.val}</div>
                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700 }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Fade>
                        <Fade delay={.3}>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <button className="btn-primary" style={{ background: "white", color: NAVY }}
                                    onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>
                                    Send a Message
                                </button>
                                <button className="btn-ghost-white"
                                    onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}>
                                    Browse FAQs <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </Fade>
                    </div>
                    <Fade delay={.15} style={{ flex: 1, minWidth: 280 }}>
                        <HeroImageCollage />
                    </Fade>
                </div>
            </section>

            {/* ══ REACH US — BENTO GRID ══ */}
            <section style={{ padding: "100px 5%", background: WHITE, position: "relative", overflow: "hidden" }}>
                <div className="dot-bg" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <div style={{ textAlign: "center", marginBottom: 56 }}>
                            <span className="sec-label">Contact Channels</span>
                            <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", marginTop: 6 }}>
                                Reach Us <span style={{ color: ACCENT }}>Anywhere</span>
                            </h2>
                            <p style={{ fontSize: 14.5, color: NAVY_65, marginTop: 12, maxWidth: 420, margin: "12px auto 0", fontFamily: "'Nunito',sans-serif" }}>
                                Four ways to connect — pick what works for you
                            </p>
                        </div>
                    </Fade>

                    <div className="bento-grid">
                        <Fade delay={0} style={{ gridColumn: "span 7" }}><BentoEmail /></Fade>
                        <Fade delay={.08} style={{ gridColumn: "span 5" }}><BentoPhone /></Fade>
                        <Fade delay={.14} style={{ gridColumn: "span 5" }}><BentoHQ /></Fade>
                        <Fade delay={.2} style={{ gridColumn: "span 7" }}><BentoCommunity /></Fade>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* ══ CONTACT FORM ══ */}
            <section id="contact-form" style={{ padding: "100px 5%", background: OFF, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <div style={{ textAlign: "center", marginBottom: 62 }}>
                            <span className="sec-label">Send a Message</span>
                            <h2 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", marginTop: 6 }}>
                                How Can We <span style={{ color: ACCENT }}>Help You?</span>
                            </h2>
                            <p style={{ fontSize: 15, color: NAVY_65, marginTop: 12, maxWidth: 480, margin: "12px auto 0", fontWeight: 400, fontFamily: "'Nunito',sans-serif", lineHeight: 1.7 }}>
                                Fill in the form and we'll route your query to the right team — participant support, university onboarding, judge assignments, or partnerships.
                            </p>
                        </div>
                    </Fade>

                    {/*
                      ── LAYOUT ──
                      LEFT column  : form card  +  Response Times card (below form)
                      RIGHT column : image banner  +  query routing  +  socials  (unchanged)
                    */}
                    <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 44, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>

                        {/* ── LEFT: form + response times stacked ── */}
                        <Fade delay={.06}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                                {/* FORM */}
                                {status === "sent" ? (
                                    <div className="pop" style={{ borderRadius: 24, padding: "56px 40px", textAlign: "center", background: WHITE, border: `1.5px solid ${NAVY_15}` }}>
                                        <div style={{ width: 68, height: 68, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                                            <CheckIcon />
                                        </div>
                                        <h3 style={{ fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Message Sent!</h3>
                                        <p style={{ fontSize: 14.5, color: NAVY_65, lineHeight: 1.75, fontFamily: "'Nunito',sans-serif" }}>
                                            Thanks for reaching out. We'll reply to <strong>{form.email}</strong> within 24 hours.
                                        </p>
                                        <button className="btn-primary" style={{ marginTop: 30 }} onClick={() => { setStatus("idle"); setForm({ name: "", email: "", role: "", subject: "", message: "" }); }}>
                                            Send Another
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ borderRadius: 24, padding: "40px 36px", background: WHITE, border: `1.5px solid rgba(3,4,94,0.1)` }}>
                                        <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                            <div>
                                                <label className="field-label">Full Name *</label>
                                                <input className="field" name="name" placeholder="Arjun Sharma" value={form.name} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <label className="field-label">Email Address *</label>
                                                <input className="field" name="email" type="email" placeholder="you@university.edu" value={form.email} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <label className="field-label">I am a…</label>
                                            <div style={{ position: "relative" }}>
                                                <select className="field" name="role" value={form.role} onChange={handleChange}>
                                                    <option value="">Select your role</option>
                                                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                                </select>
                                                <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                                    <ChevronIcon open={false} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <label className="field-label">Subject</label>
                                            <input className="field" name="subject" placeholder="e.g. University dashboard setup, Judge assignment…" value={form.subject} onChange={handleChange} />
                                        </div>
                                        <div style={{ marginBottom: 26 }}>
                                            <label className="field-label">Message *</label>
                                            <textarea className="field" name="message" rows={5} placeholder="Describe your query in detail — the more context, the faster we can help." value={form.message} onChange={handleChange} style={{ minHeight: 130 }} />
                                            <div className="char">{form.message.length} / 1000</div>
                                        </div>
                                        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "16px 38px" }} disabled={status === "sending"} onClick={handleSubmit}>
                                            {status === "sending" ? <><SpinnerIcon /> Sending…</> : <>Send Message <ArrowIcon /></>}
                                        </button>
                                    </div>
                                )}

                                {/* RESPONSE TIMES — directly below the form */}
                                <div style={{ borderRadius: 22, padding: "26px", background: NAVY, transition: "transform .3s, box-shadow .3s" }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(3,4,94,0.45)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <ClockIcon />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif" }}>Response Times</div>
                                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'Nunito',sans-serif" }}>Average reply speed</div>
                                        </div>
                                    </div>
                                    {responseTimes.map((rt, i) => (
                                        <div key={rt.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < responseTimes.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>{rt.label}</span>
                                            <span style={{ fontSize: 12, fontFamily: "'Poppins',monospace", color: "white", fontWeight: 700, background: "rgba(255,255,255,0.12)", padding: "3px 14px", borderRadius: 20 }}>{rt.time}</span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </Fade>

                        {/* ── RIGHT: image + query routing + socials — exactly as before ── */}
                        <Fade delay={.16}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {/* image banner */}
                                <div className="img-card" style={{ borderRadius: 20 }}>
                                    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&q=80" alt="Support team"
                                        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,4,94,0.72) 0%, rgba(41,98,255,0.4) 100%)" }} />
                                    <div style={{ position: "absolute", inset: 0, padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 5 }}>Dedicated Support Team</div>
                                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>Real humans, not bots — here to guide you at every step of your HackForge journey.</div>
                                    </div>
                                </div>

                                {/* query routing */}
                                <div className="context-panel">
                                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: NAVY, opacity: .4, marginBottom: 14, fontFamily: "'Nunito',sans-serif" }}>Query Routing</div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 16, letterSpacing: "-.01em" }}>We'll Route You Right</h3>
                                    {routeMap.map(r => (
                                        <div key={r.role} className="rrow">
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0, boxShadow: `0 0 6px ${r.color}` }} />
                                            <div>
                                                <div style={{ fontSize: 12.5, fontWeight: 800, color: NAVY, fontFamily: "'Nunito',sans-serif" }}>{r.role}</div>
                                                <div style={{ fontSize: 11.5, color: NAVY_65, marginTop: 2, fontFamily: "'Nunito',sans-serif" }}>→ {r.dept}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* socials */}
                                {/* <div className="context-panel">
                                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: NAVY, opacity: .4, marginBottom: 16, fontFamily: "'Nunito',sans-serif" }}>Follow HackForge</div>
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                        {[
                                            { label: "Twitter / X", Svg: TwitterSVG, href: "https://twitter.com/hackforge" },
                                            { label: "LinkedIn",    Svg: LinkedInSVG, href: "https://linkedin.com/company/hackforge" },
                                            { label: "GitHub",      Svg: GithubSVG,  href: "https://github.com/hackforge" },
                                            { label: "Discord",     Svg: DiscordSVG, href: "https://discord.gg/hackforge" },
                                        ].map(({ label, Svg, href }) => (
                                            <a key={label} className="social" href={href} target="_blank" rel="noreferrer" title={label}><Svg /></a>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </Fade>

                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* ══ FAQ ══ */}
            <section id="faq-section" style={{ padding: "100px 5%", background: WHITE, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <div style={{ textAlign: "center", marginBottom: 62 }}>
                            <span className="sec-label">FAQ</span>
                            <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 700, color: NAVY, letterSpacing: "-.025em", lineHeight: 1.1, marginTop: 6 }}>
                                Frequently Asked <span style={{ color: ACCENT }}>Questions</span>
                            </h2>
                            <p style={{ fontSize: 14.5, color: NAVY_65, marginTop: 14, maxWidth: 460, margin: "14px auto 0", fontFamily: "'Nunito',sans-serif", fontWeight: 400 }}>
                                Quick answers to the most common queries from participants, universities, and organizers.
                            </p>
                        </div>
                    </Fade>

                    <div style={{ display: "flex", gap: 56, maxWidth: 1100, margin: "0 auto", alignItems: "flex-start", flexWrap: "wrap" }}>
                        <div style={{ flex: 1.4, minWidth: 280 }}>
                            {faqs.map((faq, i) => (
                                <Fade key={faq.q} delay={i * .07}>
                                    <div className="faq-item">
                                        <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                            <span>{faq.q}</span>
                                            <ChevronIcon open={openFaq === i} />
                                        </button>
                                        <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{faq.a}</div>
                                    </div>
                                </Fade>
                            ))}
                            <Fade delay={.35}>
                                <div style={{ marginTop: 28 }}>
                                    <p style={{ fontSize: 14, color: NAVY_65, marginBottom: 16, fontFamily: "'Nunito',sans-serif" }}>Didn't find what you were looking for?</p>
                                    <button className="btn-primary"
                                        onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>
                                        Send Us a Message
                                    </button>
                                </div>
                            </Fade>
                        </div>

                        <Fade delay={.1} style={{ flex: 1, minWidth: 260 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <div className="img-card" style={{ borderRadius: 20 }}>
                                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" alt="Team working together"
                                        style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(3,4,94,0.6) 0%, transparent 60%)" }} />
                                    <div style={{ position: "absolute", bottom: 18, left: 20 }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Community Driven</div>
                                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>Built with feedback from 10K+ developers</div>
                                    </div>
                                </div>
                                <div className="img-card" style={{ borderRadius: 20 }}>
                                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80" alt="Meeting and collaboration"
                                        style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(41,98,255,0.65) 0%, rgba(3,4,94,0.5) 100%)" }} />
                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 28, fontWeight: 800, color: "white", fontFamily: "'Poppins',sans-serif" }}>500+</div>
                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700 }}>Hackathons Hosted</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* ══ CTA ══ */}
            <section style={{ padding: "110px 5%", textAlign: "center", background: NAVY, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 25% 50%,rgba(255,255,255,0.04) 0%,transparent 50%),radial-gradient(circle at 75% 50%,rgba(255,255,255,0.03) 0%,transparent 50%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <span className="sec-label" style={{ color: "rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>Join the Community</span>
                        <h2 style={{ fontSize: "clamp(32px,5vw,62px)", fontWeight: 800, color: "white", letterSpacing: "-.03em", lineHeight: 1.08, margin: "16px auto 18px", maxWidth: 700 }}>
                            Ready to Run Your Next <span style={{ color: ACCENT }}>Hackathon?</span>
                        </h2>
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 460, margin: "0 auto 44px", fontFamily: "'Nunito',sans-serif", fontWeight: 400, lineHeight: 1.8 }}>
                            Create your account today and access all platform features — from team formation to automated certification.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link to="/register" className="btn-primary" style={{ background: "white", color: NAVY, textDecoration: "none" }}>Get Started Free</Link>
                            <button className="btn-ghost-white"
                                onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>
                                Send Us a Message
                            </button>
                        </div>
                    </Fade>
                </div>
            </section>
        </div>
    );
}