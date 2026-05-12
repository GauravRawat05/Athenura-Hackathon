import { useState, useEffect, useRef } from "react";

/* ── palette ── */
const C = {
    navy: "#03045E",
    ocean: "#0077B6",
    cyan: "#00B4D8",
    sky: "#90E0EF",
    mist: "#CAF0F8",
};

/* ── tiny SVG icon ── */
function Icon({ children, size = 20, color = C.cyan, stroke = 1.8 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );
}

/* ── intersection observer ── */
function useInView(threshold = 0.12) {
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
            transition: `opacity .72s cubic-bezier(.22,1,.36,1) ${delay}s, transform .72s cubic-bezier(.22,1,.36,1) ${delay}s`,
            ...style,
        }}>
            {children}
        </div>
    );
}

/* ── contact info cards ── */
const infos = [
    {
        icon: <Icon size={22}><path d="M3 8l9 6 9-6" /><rect x="2" y="6" width="20" height="14" rx="2" /></Icon>,
        label: "Email Us",
        value: "support@hackforge.dev",
        sub: "We reply within 24 hours",
        href: "mailto:support@hackforge.dev",
    },
    {
        icon: <Icon size={22}><path d="M22 16.92v3a2 2 0 0 1-2.18 2c-3.56-.35-6.97-1.73-9.68-3.96a19.77 19.77 0 0 1-3.96-9.68A2 2 0 0 1 8.11 6h3a2 2 0 0 1 2 1.72c.13 1.01.37 2 .7 2.94a2 2 0 0 1-.46 2.12L12 14a16.02 16.02 0 0 0 5.62 5.62l1.27-1.27a2 2 0 0 1 2.11-.45c.94.34 1.94.57 2.96.7A2 2 0 0 1 22 16.92z" /></Icon>,
        label: "Call Us",
        value: "+91 98765 43210",
        sub: "Mon–Fri, 10am – 6pm IST",
        href: "tel:+919876543210",
    },
    {
        icon: <Icon size={22}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>,
        label: "Headquarters",
        value: "New Delhi, India",
        sub: "DTU Tech Incubator",
        href: "https://maps.google.com",
    },
    {
        icon: <Icon size={22}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>,
        label: "Live Chat",
        value: "Available in-app",
        sub: "Socket.IO powered support",
        href: "#",
    },
];

const roles = [
    { value: "participant", label: "Participant / Developer" },
    { value: "admin", label: "Event Organizer / Admin" },
    { value: "university", label: "University Representative" },
    { value: "judge", label: "Judge / Evaluator" },
    { value: "sponsor", label: "Sponsor / Partner" },
    { value: "other", label: "Other" },
];

const faqs = [
    { q: "How do I register for a hackathon?", a: "Sign up on HackForge, verify your email, then browse and join any listed hackathon. Payment (if applicable) is handled via Razorpay." },
    { q: "Can universities get a custom dashboard?", a: "Yes. University admins receive dedicated login credentials from the main admin. Students are auto-linked based on their institutional email domain (e.g. mdu.ac.in)." },
    { q: "How are certificates generated?", a: "Certificates are auto-generated as signed PDFs using Puppeteer after results are declared. Each includes a unique QR code for public verification." },
    { q: "What payment methods are supported?", a: "We use Razorpay for all transactions — supporting UPI, cards, net banking, and wallets. Free hackathons need no payment." },
    { q: "How does the judging system work?", a: "Admins configure custom rubrics (e.g. innovation, complexity, presentation). Judges score via their dashboard; scores are aggregated using weighted averages." },
];

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", role: "", subject: "", message: "" });
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error
    const [openFaq, setOpenFaq] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) return;
        setStatus("sending");
        setTimeout(() => setStatus("sent"), 1800);
    };

    return (
        <div style={{ fontFamily: "'DM Sans','Outfit',sans-serif", background: C.mist, color: C.navy, overflowX: "hidden", minHeight: "100vh" }}>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: ${C.cyan}44; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.mist}; }
        ::-webkit-scrollbar-thumb { background: ${C.ocean}; border-radius: 4px; }

        h1,h2,h3,h4 { font-family: 'Outfit', sans-serif; }

        /* nav */
        .nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 5%; height:66px;
          transition: background .4s, box-shadow .4s;
        }
        .nav.scrolled {
          background: rgba(3,4,94,.86);
          backdrop-filter: blur(22px);
          box-shadow: 0 1px 32px rgba(0,0,0,.22);
        }
        .nav-links { display:flex; gap:32px; }
        .nav-links a {
          font-size:12px; font-weight:600; letter-spacing:.07em;
          text-transform:uppercase; color:${C.sky}; text-decoration:none;
          opacity:.72; transition:opacity .2s,color .2s;
        }
        .nav-links a:hover { opacity:1; color:${C.cyan}; }

        /* buttons */
        .btn-primary {
          background: linear-gradient(135deg, ${C.ocean}, ${C.cyan});
          color:${C.navy}; font-weight:700; font-size:14px; font-family:'Outfit',sans-serif;
          border:none; border-radius:50px; padding:14px 40px; cursor:pointer;
          letter-spacing:.04em; box-shadow:0 6px 36px ${C.cyan}44;
          transition:transform .2s, box-shadow .2s, filter .2s;
          display:inline-flex; align-items:center; gap:8px;
        }
        .btn-primary:hover { transform:translateY(-2px) scale(1.03); filter:brightness(1.08); box-shadow:0 12px 48px ${C.cyan}55; }
        .btn-primary:disabled { opacity:.6; cursor:default; transform:none; }

        .btn-ghost {
          background:transparent; color:${C.sky};
          border:1.5px solid ${C.ocean}88; border-radius:50px;
          padding:13px 32px; font-size:14px; font-weight:600; font-family:'Outfit',sans-serif;
          cursor:pointer; transition:background .2s, border-color .2s, color .2s;
        }
        .btn-ghost:hover { background:rgba(0,180,216,.12); border-color:${C.cyan}; color:${C.mist}; }

        /* glass */
        .glass {
          background:rgba(255,255,255,.52);
          backdrop-filter:blur(20px);
          border:1px solid rgba(0,119,182,.14);
        }
        .glass-dark {
          background:rgba(3,4,94,.38);
          backdrop-filter:blur(20px);
          border:1px solid rgba(144,224,239,.16);
        }

        /* noise overlay */
        .noise { position:relative; }
        .noise::after {
          content:""; position:absolute; inset:0; pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity:.28; mix-blend-mode:overlay;
        }

        /* info card */
        .icard {
          border-radius:22px; padding:30px 26px;
          border:1px solid rgba(0,180,216,.12);
          background:rgba(255,255,255,.48);
          backdrop-filter:blur(16px);
          transition:transform .28s, box-shadow .28s, border-color .28s;
          position:relative; overflow:hidden; cursor:pointer; text-decoration:none;
          display:block;
        }
        .icard::before {
          content:""; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg, ${C.ocean}, ${C.cyan});
          transform:scaleX(0); transform-origin:left; transition:transform .32s;
        }
        .icard:hover { transform:translateY(-7px); box-shadow:0 22px 56px rgba(0,119,182,.14); border-color:${C.cyan}55; }
        .icard:hover::before { transform:scaleX(1); }

        /* form fields */
        .field-wrap { position:relative; }
        .field-label {
          display:block; font-size:11px; font-weight:700; letter-spacing:.1em;
          text-transform:uppercase; color:${C.ocean}; margin-bottom:8px;
        }
        .field {
          width:100%; background:rgba(255,255,255,.6);
          border:1.5px solid rgba(0,119,182,.2); border-radius:14px;
          padding:14px 18px; font-size:14px; color:${C.navy};
          font-family:'DM Sans',sans-serif; font-weight:400;
          transition:border-color .2s, box-shadow .2s, background .2s;
          outline:none; resize:none;
        }
        .field:focus {
          border-color:${C.cyan}; background:rgba(255,255,255,.85);
          box-shadow:0 0 0 4px ${C.cyan}22;
        }
        .field::placeholder { color:${C.ocean}88; }
        select.field { appearance:none; cursor:pointer; }

        /* char counter */
        .char { font-size:11px; color:${C.ocean}66; text-align:right; margin-top:5px; font-family:'DM Mono',monospace; }

        /* FAQ item */
        .faq-item {
          border-radius:16px; overflow:hidden;
          border:1px solid rgba(0,180,216,.14);
          background:rgba(255,255,255,.5);
          backdrop-filter:blur(12px);
          transition:border-color .25s, box-shadow .25s;
          margin-bottom:10px;
        }
        .faq-item:hover { border-color:${C.cyan}44; box-shadow:0 8px 32px rgba(0,119,182,.08); }
        .faq-q {
          width:100%; background:transparent; border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:space-between;
          padding:20px 24px; text-align:left; font-family:'Outfit',sans-serif;
          font-size:15px; font-weight:600; color:${C.navy};
          transition:color .2s;
        }
        .faq-q:hover { color:${C.ocean}; }
        .faq-a {
          max-height:0; overflow:hidden;
          transition:max-height .42s cubic-bezier(.22,1,.36,1), padding .3s;
          font-size:14px; color:${C.ocean}; line-height:1.75; font-weight:300;
          padding:0 24px;
        }
        .faq-a.open { max-height:200px; padding:0 24px 20px; }

        /* chevron */
        .chev { transition:transform .32s; flex-shrink:0; }
        .chev.open { transform:rotate(180deg); }

        /* social icon */
        .social {
          width:44px; height:44px; border-radius:12px;
          border:1.5px solid rgba(0,119,182,.22);
          display:flex; align-items:center; justify-content:center;
          transition:background .2s, border-color .2s, transform .2s;
          cursor:pointer; text-decoration:none;
          background:rgba(255,255,255,.4);
        }
        .social:hover { background:rgba(0,180,216,.14); border-color:${C.cyan}; transform:translateY(-3px); }

        /* divider */
        .div { height:1px; background:linear-gradient(90deg,transparent,${C.ocean}22,transparent); }

        /* section label */
        .slabel {
          font-size:11px; font-weight:700; letter-spacing:.16em;
          text-transform:uppercase; color:${C.ocean}; display:block; margin-bottom:14px;
        }

        /* floating blobs */
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-18px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.04)} }
        .blob1 { animation:float1 10s ease-in-out infinite; }
        .blob2 { animation:float2 13s ease-in-out infinite; }

        /* pulse dot */
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 ${C.cyan}66} 50%{box-shadow:0 0 0 8px transparent} }
        .pulse { animation:pulse 2s ease-in-out infinite; }

        /* success animation */
        @keyframes pop { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .pop { animation:pop .55s cubic-bezier(.22,1,.36,1) forwards; }

        /* sending spinner */
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation:spin .8s linear infinite; }

        @media(max-width:768px) {
          .contact-grid { grid-template-columns:1fr !important; }
          .info-grid { grid-template-columns:1fr 1fr !important; }
          .nav-links { display:none; }
        }
        @media(max-width:480px) {
          .info-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

            {/* ══ NAV ══ */}
            <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={16} color={C.navy} stroke={2.8}><path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" /></Icon>
                    </div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: C.mist, letterSpacing: "-.01em" }}>
                        Hack<span style={{ color: C.cyan }}>Forge</span>
                    </span>
                </div>
                <div className="nav-links">
                    {["Features", "Stack", "Roles", "Journey", "Contact"].map(l => (
                        <a key={l} href="#">{l}</a>
                    ))}
                </div>
                <button className="btn-ghost" style={{ padding: "9px 22px", fontSize: 12 }}>Login</button>
            </nav>

            {/* ══ HERO HEADER ══ */}
            <section className="noise" style={{
                minHeight: "52vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "130px 5% 80px", textAlign: "center", position: "relative", overflow: "hidden",
                background: `linear-gradient(155deg, ${C.navy} 0%, #021c6b 55%, #023a8a 100%)`,
            }}>
                {/* blobs */}
                <div className="blob1" style={{ position: "absolute", top: "-60px", right: "-100px", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle,${C.cyan}1e 0%,transparent 68%)`, pointerEvents: "none" }} />
                <div className="blob2" style={{ position: "absolute", bottom: "-80px", left: "-60px", width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle,${C.ocean}22 0%,transparent 68%)`, pointerEvents: "none" }} />
                {/* grid */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,180,216,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,180,216,.04) 1px,transparent 1px)`, backgroundSize: "52px 52px", pointerEvents: "none" }} />

                {/* diagonal accent */}
                <div style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "80px", background: `linear-gradient(170deg,transparent 49%,${C.mist} 50%)`, pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <div className="glass-dark" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 20px", borderRadius: 50, marginBottom: 28, fontSize: 12, fontWeight: 700, color: C.sky, letterSpacing: ".1em", textTransform: "uppercase" }}>
                            <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: C.cyan, display: "inline-block" }} />
                            We're here to help
                        </div>
                    </Fade>
                    <Fade delay={.1}>
                        <h1 style={{ fontSize: "clamp(40px,6.5vw,82px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.03em", color: C.mist, maxWidth: 800, margin: "0 auto 20px" }}>
                            Get in <span style={{ background: `linear-gradient(135deg,${C.cyan},${C.sky})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
                        </h1>
                    </Fade>
                    <Fade delay={.2}>
                        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: `${C.sky}cc`, maxWidth: 540, lineHeight: 1.8, margin: "0 auto", fontWeight: 300 }}>
                            Whether you're a participant, university rep, event organiser, or sponsor — our team is ready to assist you across every stage of your hackathon journey.
                        </p>
                    </Fade>
                </div>
            </section>

            {/* ══ INFO CARDS ══ */}
            <section style={{ padding: "0 5% 80px", background: C.mist, position: "relative", zIndex: 1 }}>
                <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
                    {infos.map((info, i) => (
                        <Fade key={info.label} delay={i * .08}>
                            <a className="icard" href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C.ocean}18`, border: `1px solid ${C.ocean}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                                    {info.icon}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.ocean, marginBottom: 8 }}>{info.label}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{info.value}</div>
                                <div style={{ fontSize: 12, color: C.ocean, fontWeight: 300, opacity: .8 }}>{info.sub}</div>
                                <div style={{ position: "absolute", bottom: 20, right: 22 }}>
                                    <Icon size={16} color={`${C.ocean}66`}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>
                                </div>
                            </a>
                        </Fade>
                    ))}
                </div>
            </section>

            <div className="div" />

            {/* ══ MAIN CONTACT SECTION ══ */}
            <section style={{ padding: "90px 5%", background: C.sky }}>
                <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 1100, margin: "0 auto", alignItems: "start" }}>

                    {/* ── LEFT: form ── */}
                    <Fade delay={.05}>
                        <div>
                            <span className="slabel">Send a Message</span>
                            <h2 style={{ fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, color: C.navy, letterSpacing: "-.025em", lineHeight: 1.1, marginBottom: 10 }}>
                                How Can We <span style={{ color: C.ocean }}>Help?</span>
                            </h2>
                            <p style={{ fontSize: 14, color: C.ocean, lineHeight: 1.7, fontWeight: 300, marginBottom: 36, maxWidth: 420 }}>
                                Fill in the form and our team will route your query to the right department — participant support, institutional onboarding, judge assignments, or partnerships.
                            </p>

                            {status === "sent" ? (
                                <div className="pop glass" style={{ borderRadius: 24, padding: "48px 36px", textAlign: "center" }}>
                                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", fontSize: 28 }}>✓</div>
                                    <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 10 }}>Message Sent!</h3>
                                    <p style={{ fontSize: 14, color: C.ocean, lineHeight: 1.7, fontWeight: 300 }}>
                                        Thanks for reaching out. We'll reply to <strong>{form.email}</strong> within 24 hours.
                                    </p>
                                    <button className="btn-primary" style={{ marginTop: 28 }} onClick={() => { setStatus("idle"); setForm({ name: "", email: "", role: "", subject: "", message: "" }); }}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <div className="glass" style={{ borderRadius: 24, padding: "36px 32px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                        {/* name */}
                                        <div className="field-wrap">
                                            <label className="field-label">Full Name *</label>
                                            <input className="field" name="name" placeholder="Arjun Sharma" value={form.name} onChange={handleChange} />
                                        </div>
                                        {/* email */}
                                        <div className="field-wrap">
                                            <label className="field-label">Email Address *</label>
                                            <input className="field" name="email" type="email" placeholder="you@university.edu" value={form.email} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* role */}
                                    <div className="field-wrap" style={{ marginBottom: 16 }}>
                                        <label className="field-label">I am a…</label>
                                        <div style={{ position: "relative" }}>
                                            <select className="field" name="role" value={form.role} onChange={handleChange}>
                                                <option value="">Select your role</option>
                                                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                            <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                                <Icon size={16} color={C.ocean}><path d="M6 9l6 6 6-6" /></Icon>
                                            </div>
                                        </div>
                                    </div>

                                    {/* subject */}
                                    <div className="field-wrap" style={{ marginBottom: 16 }}>
                                        <label className="field-label">Subject</label>
                                        <input className="field" name="subject" placeholder="e.g. University dashboard setup, Judge assignment…" value={form.subject} onChange={handleChange} />
                                    </div>

                                    {/* message */}
                                    <div className="field-wrap" style={{ marginBottom: 24 }}>
                                        <label className="field-label">Message *</label>
                                        <textarea className="field" name="message" rows={5} placeholder="Describe your query in detail — the more context you give, the faster we can help." value={form.message} onChange={handleChange} style={{ minHeight: 120 }} />
                                        <div className="char">{form.message.length} / 1000</div>
                                    </div>

                                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={status === "sending"} onClick={handleSubmit}>
                                        {status === "sending" ? (
                                            <>
                                                <svg className="spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
                                                Sending…
                                            </>
                                        ) : "Send Message →"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </Fade>

                    {/* ── RIGHT: context + socials ── */}
                    <Fade delay={.15}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                            {/* department routing card */}
                            <div className="glass" style={{ borderRadius: 22, padding: "30px 28px" }}>
                                <span className="slabel">Query Routing</span>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 20, letterSpacing: "-.01em" }}>We'll Route You Right</h3>
                                {[
                                    { role: "Participant / Developer", dept: "Participant Support", color: C.cyan },
                                    { role: "University Representative", dept: "Institutional Onboarding", color: C.ocean },
                                    { role: "Event Organizer / Admin", dept: "Platform Configuration", color: `${C.navy}` },
                                    { role: "Judge / Evaluator", dept: "Judge Assignment Team", color: C.ocean },
                                    { role: "Sponsor / Partner", dept: "Partnerships & Growth", color: C.cyan },
                                ].map(r => (
                                    <div key={r.role} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, padding: "12px 14px", borderRadius: 12, background: `rgba(0,119,182,.05)`, border: `1px solid rgba(0,180,216,.1)` }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{r.role}</div>
                                            <div style={{ fontSize: 11, color: C.ocean, marginTop: 2 }}>→ {r.dept}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* response time */}
                            <div className="glass" style={{ borderRadius: 22, padding: "28px", background: `linear-gradient(135deg,${C.ocean}12,${C.cyan}08)` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon size={18} color={C.navy}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Response Time</div>
                                        <div style={{ fontSize: 12, color: C.ocean, fontWeight: 300 }}>Average reply speed</div>
                                    </div>
                                </div>
                                {[
                                    { label: "General Queries", time: "< 24 hrs" },
                                    { label: "Technical Issues", time: "< 6 hrs" },
                                    { label: "Institutional Setup", time: "< 48 hrs" },
                                ].map(rt => (
                                    <div key={rt.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid rgba(0,119,182,.1)` }}>
                                        <span style={{ fontSize: 13, color: C.ocean, fontWeight: 400 }}>{rt.label}</span>
                                        <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: C.navy, fontWeight: 600, background: `${C.cyan}22`, padding: "3px 10px", borderRadius: 20 }}>{rt.time}</span>
                                    </div>
                                ))}
                            </div>

                            {/* socials */}
                            <div className="glass" style={{ borderRadius: 22, padding: "26px 28px" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.ocean, marginBottom: 16 }}>Follow HackForge</div>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    {[
                                        { label: "Twitter / X", icon: <Icon size={18}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.04C7.69 5.38 4.07 3.6 1.64.9a4.52 4.52 0 0 0-.61 2.27c0 1.57.8 2.96 2.01 3.77a4.48 4.48 0 0 1-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.43-.38.1-.78.16-1.19.16-.29 0-.57-.03-.85-.08.57 1.79 2.24 3.09 4.21 3.12A9.05 9.05 0 0 1 0 19.54a12.77 12.77 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 23 3z" /></Icon> },
                                        { label: "LinkedIn", icon: <Icon size={18}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></Icon> },
                                        { label: "GitHub", icon: <Icon size={18}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></Icon> },
                                        { label: "Discord", icon: <Icon size={18}><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></Icon> },
                                    ].map(s => (
                                        <a key={s.label} className="social" href="#" title={s.label}>{s.icon}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Fade>
                </div>
            </section>

            <div className="div" />

            {/* ══ FAQ ══ */}
            <section style={{ padding: "90px 5%", background: C.mist }}>
                <Fade>
                    <div style={{ textAlign: "center", marginBottom: 60 }}>
                        <span className="slabel">FAQ</span>
                        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: C.navy, letterSpacing: "-.025em", lineHeight: 1.1 }}>
                            Frequently Asked <span style={{ color: C.ocean }}>Questions</span>
                        </h2>
                        <p style={{ fontSize: 14, color: C.ocean, marginTop: 14, fontWeight: 300, maxWidth: 480, margin: "14px auto 0" }}>
                            Quick answers to the most common queries from participants, universities, and organizers.
                        </p>
                    </div>
                </Fade>

                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    {faqs.map((faq, i) => (
                        <Fade key={faq.q} delay={i * .07}>
                            <div className="faq-item">
                                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    <span>{faq.q}</span>
                                    <span className={`chev ${openFaq === i ? "open" : ""}`}>
                                        <Icon size={18} color={C.ocean}><path d="M6 9l6 6 6-6" /></Icon>
                                    </span>
                                </button>
                                <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{faq.a}</div>
                            </div>
                        </Fade>
                    ))}
                </div>

                <Fade delay={.3}>
                    <div style={{ textAlign: "center", marginTop: 44 }}>
                        <p style={{ fontSize: 14, color: C.ocean, marginBottom: 18, fontWeight: 300 }}>Didn't find what you were looking for?</p>
                        <button className="btn-primary">Browse Documentation</button>
                    </div>
                </Fade>
            </section>

            <div className="div" />

            {/* ══ CTA BANNER ══ */}
            <section className="noise" style={{
                padding: "90px 5%", textAlign: "center", position: "relative", overflow: "hidden",
                background: `linear-gradient(155deg, ${C.navy} 0%, #021c6b 50%, ${C.ocean} 100%)`,
            }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 25% 50%,${C.cyan}18 0%,transparent 50%),radial-gradient(circle at 75% 50%,${C.ocean}22 0%,transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Fade>
                        <span className="slabel" style={{ color: C.sky }}>Join the Community</span>
                        <h2 style={{ fontSize: "clamp(30px,4.5vw,58px)", fontWeight: 800, color: C.mist, letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: 18 }}>
                            Ready to Run Your Next{" "}
                            <span style={{ background: `linear-gradient(135deg,${C.cyan},${C.sky})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Hackathon?
                            </span>
                        </h2>
                        <p style={{ fontSize: 15, color: `${C.sky}bb`, marginBottom: 40, fontWeight: 300, maxWidth: 480, margin: "0 auto 40px" }}>
                            Create your account today and access all platform features — from team formation to automated certification.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <button className="btn-primary">Get Started Free</button>
                            <button className="btn-ghost">Schedule a Demo</button>
                        </div>
                    </Fade>
                </div>
            </section>

            {/* ══ FOOTER ══ */}
            <footer style={{ background: C.navy, padding: "28px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${C.ocean},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={13} color={C.navy} stroke={2.8}><path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" /></Icon>
                    </div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 15, color: C.mist }}>HackForge</span>
                </div>
                <span style={{ fontSize: 11, color: `${C.sky}77`, letterSpacing: ".06em", fontFamily: "'DM Mono',monospace" }}>© 2026 HackForge · support@hackforge.dev</span>
                <div style={{ display: "flex", gap: 20 }}>
                    {["Privacy", "Terms", "Docs", "API"].map(l => (
                        <a key={l} href="#" style={{ fontSize: 11, color: `${C.sky}66`, textDecoration: "none", fontWeight: 600, letterSpacing: ".06em", transition: "color .2s" }}
                            onMouseEnter={e => e.target.style.color = C.cyan} onMouseLeave={e => e.target.style.color = `${C.sky}66`}>{l}</a>
                    ))}
                </div>
            </footer>
        </div>
    );
}