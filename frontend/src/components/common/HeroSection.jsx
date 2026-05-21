import { useEffect, useRef, useState } from "react";

/* ── Particle canvas (hero section only) ── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, W, H;
    const pts = [];
    const COUNT = 60;
    const rand = (a, b) => a + Math.random() * (b - a);
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    const init = () => {
      pts.length = 0;
      for (let i = 0; i < COUNT; i++)
        pts.push({
          x: rand(0, W),
          y: rand(0, H),
          r: rand(0.8, 2.2),
          vx: rand(-0.12, 0.12),
          vy: rand(-0.22, -0.04),
          alpha: rand(0.1, 0.45),
          da: rand(-0.003, 0.003),
        });
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0.04, Math.min(0.5, p.alpha + p.da));
        if (p.y < -4) {
          p.y = H + 4;
          p.x = rand(0, W);
        }
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,216,${p.alpha})`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,180,216,${0.09 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      animId = requestAnimationFrame(draw);
    };
    resize();
    init();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = "", duration = 1800, active }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration, active]);
  return (
    <>
      {val.toLocaleString()}
      {suffix}
    </>
  );
}

/* ── Intersection observer hook ── */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

const STATS = [
  { value: "250", suffix: "K+", label: "Participants" },
  { value: "50", suffix: "+", label: "Countries" },
  { value: "2", suffix: "M+", label: "Prize Pool $" },
  { value: "1200", suffix: "+", label: "Projects Built" },
];

const FEATURES = [
  {
    icon: "🚀",
    title: "Find Hackathons",
    desc: "Filter by domain, prize, mode & more",
  },
  {
    icon: "👥",
    title: "Build Your Team",
    desc: "Solo or team up with brilliant minds",
  },
  {
    icon: "⚡",
    title: "Live Updates",
    desc: "Real-time notifications for every milestone",
  },
  {
    icon: "🏅",
    title: "Win Big Prizes",
    desc: "Cash, swag, and career opportunities",
  },
];

const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Discover",
    desc: "Browse hundreds of live hackathons filtered by skill, domain, prize size, and format — online or in-person.",
  },
  {
    num: "02",
    icon: "🤝",
    title: "Form Your Team",
    desc: "Post your profile, browse teammates, and assemble the perfect squad with the exact skills your idea needs.",
  },
  {
    num: "03",
    icon: "💡",
    title: "Build & Submit",
    desc: "Collaborate in real-time with built-in tools, track milestones, and submit your project before the deadline.",
  },
  {
    num: "04",
    icon: "🏆",
    title: "Win & Grow",
    desc: "Get judged by industry experts, claim prizes, and showcase your project to top companies worldwide.",
  },
];

const CATEGORIES = [
  { icon: "🤖", name: "Artificial Intelligence", count: "142 active" },
  { icon: "🔗", name: "Web3 & Blockchain", count: "89 active" },
  { icon: "💊", name: "HealthTech", count: "67 active" },
  { icon: "🌿", name: "Sustainability", count: "54 active" },
  { icon: "💰", name: "FinTech", count: "78 active" },
  { icon: "🎮", name: "Gaming & XR", count: "93 active" },
  { icon: "🛡️", name: "Cybersecurity", count: "45 active" },
  { icon: "🚀", name: "Space Tech", count: "31 active" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Full-Stack Dev · Mumbai",
    avatar: "PS",
    text: "HackWave completely changed my career trajectory. I joined a team of strangers for an AI hackathon and we ended up winning $20K and getting hired by the same startup.",
    badge: "🏆 $20K Winner",
  },
  {
    name: "Marcus Chen",
    role: "ML Engineer · Singapore",
    avatar: "MC",
    text: "The team-matching feature is insane. I posted my ML skills at 11pm and had a full squad by morning. We shipped a working product in 36 hours.",
    badge: "⚡ 36h Build",
  },
  {
    name: "Hamza Ali Mazari",
    role: "Product Designer · Lagos",
    avatar: "AO",
    text: "As a designer, I always struggled to find devs who valued design. HackWave's profile system lets me showcase my portfolio and attract the right collaborators.",
    badge: "🎨 3× Finalist",
  },
  {
    name: "Diego Reyes",
    role: "Blockchain Dev · São Paulo",
    avatar: "DR",
    text: "Competed in 6 hackathons this year, won 2, and got 3 job offers. The exposure to real companies judging your work is priceless. No platform comes close.",
    badge: "💼 3 Offers",
  },
  {
    name: "Sara Lindqvist",
    role: "Data Scientist · Stockholm",
    avatar: "SL",
    text: "The live leaderboard keeps you motivated the entire weekend. Real-time feedback from mentors helped us pivot at exactly the right moment.",
    badge: "🥈 2nd Place",
  },
  {
    name: "Raj Patel",
    role: "Backend Engineer · London",
    avatar: "RP",
    text: "Built 4 side projects from hackathon ideas on HackWave. Two are now actual startups. The community here genuinely wants to see you succeed.",
    badge: "🚀 2 Startups",
  },
];

export default function HeroSection() {
  const homeRef = useRef(null);
  const hiwRef = useRef(null);
  const catRef = useRef(null);
  const testiRef = useRef(null);

  const heroInView = useInView(homeRef, 0.3);
  const hiwInView = useInView(hiwRef);
  const catInView = useInView(catRef);
  const testiInView = useInView(testiRef);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { font-family:'Poppins',sans-serif; }


        /* ══ REVEAL ANIMATION ══ */
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.65s ease, transform 0.65s ease; }
        .reveal.in { opacity:1; transform:translateY(0); }
        .reveal-d1 { transition-delay:0.08s; }
        .reveal-d2 { transition-delay:0.18s; }
        .reveal-d3 { transition-delay:0.28s; }
        .reveal-d4 { transition-delay:0.38s; }

        /* ══════════════════════════════════════
           SECTION 1 — HERO  (dark navy)
        ══════════════════════════════════════ */
        .s-hero { position:relative; min-height:100vh; overflow:hidden; background:#020338; display:flex; align-items:center; }
        .s-hero-bg { position:absolute; inset:0; pointer-events:none; z-index:0; }
        .s-hero-grad { position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 70% 0%,rgba(0,119,182,0.28) 0%,transparent 65%),radial-gradient(ellipse 60% 50% at 10% 90%,rgba(0,180,216,0.18) 0%,transparent 60%),linear-gradient(160deg,#020338 0%,#030557 40%,#021630 100%); }
        .s-hero-aurora { position:absolute; inset:0; background:linear-gradient(105deg,transparent 30%,rgba(0,119,182,0.07) 50%,transparent 70%),linear-gradient(250deg,transparent 40%,rgba(0,180,216,0.06) 55%,transparent 75%); animation:aurora 8s ease-in-out infinite alternate; }
        @keyframes aurora { from{transform:skewX(-2deg);opacity:0.7;} to{transform:skewX(2deg) scaleX(1.06);opacity:1;} }
        .s-hero-dots { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(144,224,239,0.07) 1px,transparent 1px); background-size:38px 38px; }
        .hw-orb { position:absolute; border-radius:50%; filter:blur(60px); }
        .hw-orb-1 { top:-100px; right:-60px; width:550px; height:550px; background:radial-gradient(circle at 40% 40%,rgba(0,119,182,0.3) 0%,transparent 65%); animation:orb 12s ease-in-out infinite alternate; }
        .hw-orb-2 { bottom:-80px; left:-80px; width:450px; height:450px; background:radial-gradient(circle at 55% 55%,rgba(0,180,216,0.2) 0%,transparent 65%); animation:orb 15s ease-in-out infinite alternate-reverse; }
        @keyframes orb { from{transform:translate(0,0);} to{transform:translate(20px,30px) scale(1.08);} }
        .s-hero-inner { position:relative; z-index:2; max-width:1240px; margin:0 auto; padding:80px 48px; display:grid; grid-template-columns:1.15fr 0.85fr; gap:72px; align-items:center; width:100%; }
        .hw-h1 { font-family:'Nunito',sans-serif; font-size:clamp(42px,5.5vw,70px); font-weight:800; line-height:1.04; letter-spacing:-2px; color:#fff; margin-bottom:22px; }
        .hw-h1-accent { display:block; background:linear-gradient(135deg,#90E0EF 0%,#00B4D8 45%,#0077B6 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hw-sub { font-size:16px; color:rgba(144,224,239,0.65); line-height:1.75; max-width:480px; margin-bottom:36px; }
        .hw-sub strong { color:#90E0EF; font-weight:600; }
        .hw-ctas { display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-bottom:52px; }
        .hw-btn-pri { display:inline-flex; align-items:center; gap:10px; padding:14px 30px; border-radius:14px; font-size:15px; font-weight:700; color:#fff; background:linear-gradient(135deg,#0077B6,#00B4D8); border:none; cursor:pointer; text-decoration:none; font-family:'Poppins',sans-serif; box-shadow:0 4px 24px rgba(0,180,216,0.4); position:relative; overflow:hidden; transition:transform 0.18s,box-shadow 0.18s; }
        .hw-btn-pri::before { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transition:left 0.4s; }
        .hw-btn-pri:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,180,216,0.55); }
        .hw-btn-pri:hover::before { left:150%; }
        .hw-btn-pri .arr { transition:transform 0.18s; }
        .hw-btn-pri:hover .arr { transform:translateX(4px); }
        .hw-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:14px; font-size:15px; font-weight:600; color:rgba(202,240,248,0.8); background:rgba(255,255,255,0.04); border:1px solid rgba(144,224,239,0.2); cursor:pointer; text-decoration:none; font-family:'Poppins',sans-serif; transition:all 0.18s; }
        .hw-btn-ghost:hover { color:#CAF0F8; border-color:rgba(0,180,216,0.45); background:rgba(0,119,182,0.1); transform:translateY(-2px); }
        .hw-stats { display:flex; flex-wrap:wrap; border-top:1px solid rgba(0,180,216,0.1); }
        .hw-stat { display:flex; flex-direction:column; gap:3px; padding:18px 28px 18px 0; }
        .hw-stat+.hw-stat { padding-left:28px; border-left:1px solid rgba(0,180,216,0.12); }
        .hw-stat-val { font-family:'Nunito',sans-serif; font-size:26px; font-weight:800; letter-spacing:-1px; line-height:1; background:linear-gradient(135deg,#fff 0%,#90E0EF 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hw-stat-lbl { font-size:11px; font-weight:600; color:rgba(144,224,239,0.45); text-transform:uppercase; letter-spacing:0.1em; }
        .hw-right { display:flex; flex-direction:column; gap:14px; }
        .hw-featured { position:relative; background:linear-gradient(135deg,rgba(0,119,182,0.2),rgba(0,180,216,0.1)); border:1px solid rgba(0,180,216,0.22); border-radius:20px; padding:24px 26px; overflow:hidden; transition:transform 0.22s,box-shadow 0.22s; }
        .hw-featured:hover { transform:translateY(-4px); box-shadow:0 16px 50px rgba(0,119,182,0.3); }
        .hw-f-shine { position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,180,216,0.6),transparent); }
        .hw-f-glow { position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:50%; background:rgba(0,180,216,0.08); filter:blur(28px); pointer-events:none; }
        .hw-f-head { display:flex; align-items:center; gap:14px; margin-bottom:16px; }
        .hw-f-icon { font-size:34px; filter:drop-shadow(0 4px 12px rgba(0,180,216,0.5)); }
        .hw-f-badge { display:inline-flex; align-items:center; gap:5px; background:rgba(0,180,216,0.15); border:1px solid rgba(0,180,216,0.3); border-radius:20px; padding:3px 10px; font-size:11px; font-weight:700; color:#00B4D8; text-transform:uppercase; letter-spacing:0.06em; }
        .hw-f-live { width:5px; height:5px; border-radius:50%; background:#00B4D8; display:inline-block; animation:pulse-dot 1.8s ease-in-out infinite; }
        .hw-f-title { font-family:'Nunito',sans-serif; font-size:19px; font-weight:800; color:#fff; letter-spacing:-0.5px; margin:4px 0 3px; }
        .hw-f-meta { font-size:13px; color:rgba(144,224,239,0.6); }
        .hw-prog-wrap { margin-top:14px; }
        .hw-prog-info { display:flex; justify-content:space-between; margin-bottom:8px; }
        .hw-prog-lbl { font-size:12px; font-weight:600; color:rgba(144,224,239,0.55); text-transform:uppercase; letter-spacing:0.06em; }
        .hw-prog-pct { font-size:12px; font-weight:700; color:#00B4D8; }
        .hw-prog-track { height:5px; border-radius:4px; background:rgba(144,224,239,0.1); overflow:hidden; }
        .hw-prog-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,#03045E,#0077B6,#00B4D8,#90E0EF); background-size:200% 100%; animation:prog 2.8s ease-in-out infinite alternate,shimmer 2s linear infinite; }
        @keyframes prog { from{width:58%;} to{width:80%;} }
        @keyframes shimmer { from{background-position:100% 0;} to{background-position:0 0;} }
        .hw-mini-cards { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .hw-mini-card { background:rgba(255,255,255,0.03); border:1px solid rgba(0,180,216,0.1); border-radius:16px; padding:18px 16px; transition:all 0.22s; cursor:default; }
        .hw-mini-card:hover { background:rgba(0,119,182,0.09); border-color:rgba(0,180,216,0.28); transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,119,182,0.18); }
        .hw-mini-icon { font-size:24px; margin-bottom:10px; display:block; }
        .hw-mini-title { font-family:'Nunito',sans-serif; font-size:13px; font-weight:700; color:#CAF0F8; margin-bottom:4px; }
        .hw-mini-desc { font-size:11.5px; color:rgba(144,224,239,0.45); line-height:1.5; }
        .hw-scroll-hint { position:absolute; bottom:28px; left:50%; transform:translateX(-50%); z-index:3; display:flex; flex-direction:column; align-items:center; gap:6px; opacity:0.45; cursor:pointer; }
        .hw-scroll-hint span { font-size:10px; color:#90E0EF; text-transform:uppercase; letter-spacing:0.12em; font-weight:600; }
        .hw-scroll-line { width:1px; height:30px; background:linear-gradient(to bottom,rgba(0,180,216,0.6),transparent); animation:spulse 1.8s ease-in-out infinite; }
        @keyframes spulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }

        /* ══════════════════════════════════════
           SECTION 2 — HOW IT WORKS  (pure white)
        ══════════════════════════════════════ */
        .s-hiw { background:#fff; padding:100px 48px; position:relative; overflow:hidden; }
        .s-hiw-topbar { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#0077B6,#00B4D8,#90E0EF,#00B4D8,#0077B6); background-size:200% 100%; animation:barslide 4s linear infinite; }
        @keyframes barslide { from{background-position:100% 0;} to{background-position:0 0;} }
        .s-hiw-pattern { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(0,119,182,0.04) 1px,transparent 1px); background-size:32px 32px; pointer-events:none; }
        .s-hiw-inner { max-width:1100px; margin:0 auto; position:relative; z-index:1; }
        .s-eyebrow { display:inline-flex; align-items:center; gap:8px; background:rgba(0,119,182,0.08); border:1px solid rgba(0,119,182,0.18); border-radius:100px; padding:5px 14px; margin-bottom:20px; font-size:11.5px; font-weight:700; color:#0077B6; text-transform:uppercase; letter-spacing:0.1em; }
        .s-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#00B4D8; }
        .s-title-dark { font-family:'Nunito',sans-serif; font-size:clamp(32px,4vw,52px); font-weight:800; letter-spacing:-1.5px; line-height:1.08; color:#03045E; margin-bottom:14px; }
        .s-title-dark .accent { color:#0077B6; }
        .s-sub-dark { font-size:16px; color:rgba(3,4,94,0.5); line-height:1.7; max-width:500px; margin-bottom:56px; }
        .s-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; position:relative; }
        .s-step-connector { position:absolute; top:48px; left:calc(12.5% + 12px); right:calc(12.5% + 12px); height:2px; background:linear-gradient(90deg,rgba(0,119,182,0.2),rgba(0,180,216,0.4)); border-radius:2px; overflow:hidden; }
        .s-step-connector::after { content:''; position:absolute; top:0; height:100%; width:40%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent); animation:lflow 2.5s linear infinite; }
        @keyframes lflow { from{left:-40%;} to{left:140%;} }
        .s-step { background:#fff; border:1.5px solid rgba(0,119,182,0.1); border-radius:20px; padding:28px 20px 24px; text-align:center; position:relative; z-index:1; transition:all 0.25s; cursor:default; box-shadow:0 2px 16px rgba(0,119,182,0.06); }
        .s-step:hover { transform:translateY(-8px); border-color:rgba(0,180,216,0.5); box-shadow:0 20px 50px rgba(0,119,182,0.15); }
        .s-step-num { font-family:'Nunito',sans-serif; font-size:52px; font-weight:900; color:rgba(0,119,182,0.07); letter-spacing:-3px; line-height:1; position:absolute; top:10px; right:14px; }
        .s-step-icon { font-size:36px; margin-bottom:14px; display:block; filter:drop-shadow(0 3px 8px rgba(0,119,182,0.25)); }
        .s-step-title { font-family:'Nunito',sans-serif; font-size:17px; font-weight:800; color:#03045E; margin-bottom:10px; letter-spacing:-0.3px; }
        .s-step-desc { font-size:13px; color:rgba(3,4,94,0.5); line-height:1.65; }
        .s-hiw-banner { margin-top:52px; display:flex; align-items:center; justify-content:space-between; background:linear-gradient(135deg,#03045E,#0077B6); border-radius:20px; padding:30px 40px; }
        .s-hiw-banner-text { font-size:19px; font-weight:700; color:#fff; font-family:'Nunito',sans-serif; }
        .s-hiw-banner-text span { color:#90E0EF; }
        .s-hiw-banner-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 26px; border-radius:12px; font-size:14px; font-weight:700; color:#03045E; background:#fff; border:none; cursor:pointer; text-decoration:none; font-family:'Poppins',sans-serif; transition:all 0.18s; }
        .s-hiw-banner-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.2); }

        /* ══════════════════════════════════════
           SECTION 3 — CATEGORIES  (soft sky-blue)
        ══════════════════════════════════════ */
        .s-cat { background:linear-gradient(160deg,#f0f7ff 0%,#e5f2ff 50%,#f5faff 100%); padding:100px 48px; position:relative; overflow:hidden; }
        .s-cat-blob1 { position:absolute; top:-80px; right:-80px; width:380px; height:380px; border-radius:50%; background:radial-gradient(circle,rgba(0,119,182,0.09),transparent 70%); pointer-events:none; }
        .s-cat-blob2 { position:absolute; bottom:-60px; left:-60px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(0,180,216,0.07),transparent 70%); pointer-events:none; }
        .s-cat-inner { max-width:1100px; margin:0 auto; position:relative; z-index:1; }
        .s-cat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        .s-cat-card { background:#fff; border:1.5px solid rgba(0,119,182,0.1); border-radius:18px; padding:26px 20px; cursor:default; transition:all 0.25s; position:relative; overflow:hidden; box-shadow:0 2px 12px rgba(0,119,182,0.06); }
        .s-cat-card:hover { transform:translateY(-6px) scale(1.02); border-color:rgba(0,180,216,0.45); box-shadow:0 20px 48px rgba(0,119,182,0.16); }
        .s-cat-topbar { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#0077B6,#00B4D8); opacity:0; transition:opacity 0.25s; }
        .s-cat-card:hover .s-cat-topbar { opacity:1; }
        .s-cat-icon { font-size:32px; margin-bottom:14px; display:block; filter:drop-shadow(0 3px 8px rgba(0,119,182,0.18)); }
        .s-cat-name { font-family:'Nunito',sans-serif; font-size:14.5px; font-weight:800; color:#03045E; margin-bottom:6px; letter-spacing:-0.3px; }
        .s-cat-count { font-size:12px; font-weight:600; color:#0077B6; }
        .s-cat-arrow { position:absolute; bottom:16px; right:16px; font-size:16px; color:rgba(0,119,182,0.22); transition:all 0.2s; }
        .s-cat-card:hover .s-cat-arrow { color:#0077B6; transform:translate(2px,-2px); }
        .s-cat-tags { margin-top:36px; display:flex; flex-wrap:wrap; gap:8px; }
        .s-cat-tag { padding:6px 14px; border-radius:20px; background:rgba(0,119,182,0.07); border:1px solid rgba(0,119,182,0.14); font-size:12px; font-weight:600; color:#0077B6; cursor:default; transition:all 0.18s; }
        .s-cat-tag:hover { background:rgba(0,119,182,0.14); border-color:rgba(0,119,182,0.28); color:#03045E; }

        /* ══════════════════════════════════════
           SECTION 4 — TESTIMONIALS  (deep navy)
        ══════════════════════════════════════ */
        .s-testi { background:linear-gradient(160deg,#020d3a 0%,#03045E 55%,#020f40 100%); padding:100px 48px; position:relative; overflow:hidden; }
        .s-testi-glow1 { position:absolute; top:-80px; right:-80px; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(0,119,182,0.18),transparent 65%); filter:blur(40px); pointer-events:none; }
        .s-testi-glow2 { position:absolute; bottom:-60px; left:-60px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(0,180,216,0.12),transparent 65%); filter:blur(40px); pointer-events:none; }
        .s-testi-dots { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(144,224,239,0.05) 1px,transparent 1px); background-size:36px 36px; pointer-events:none; }
        .s-testi-inner { max-width:1200px; margin:0 auto; position:relative; z-index:1; }
        .s-eyebrow-light { display:inline-flex; align-items:center; gap:8px; background:rgba(0,180,216,0.12); border:1px solid rgba(0,180,216,0.25); border-radius:100px; padding:5px 14px; margin-bottom:20px; font-size:11.5px; font-weight:700; color:#90E0EF; text-transform:uppercase; letter-spacing:0.1em; }
        .s-title-light { font-family:'Nunito',sans-serif; font-size:clamp(32px,4vw,52px); font-weight:800; letter-spacing:-1.5px; line-height:1.08; color:#fff; margin-bottom:14px; }
        .s-title-light .accent { background:linear-gradient(135deg,#90E0EF,#00B4D8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .s-sub-light { font-size:16px; color:rgba(144,224,239,0.5); line-height:1.7; max-width:500px; margin-bottom:52px; }
        .s-testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .s-tcard { background:rgba(255,255,255,0.04); border:1px solid rgba(0,180,216,0.12); border-radius:20px; padding:26px 22px; transition:all 0.25s; cursor:default; position:relative; overflow:hidden; }
        .s-tcard:hover { background:rgba(0,119,182,0.12); border-color:rgba(0,180,216,0.32); transform:translateY(-6px); box-shadow:0 20px 48px rgba(0,119,182,0.22); }
        .s-tcard-topbar { position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(0,180,216,0.5),transparent); opacity:0; transition:opacity 0.25s; }
        .s-tcard:hover .s-tcard-topbar { opacity:1; }
        .s-tcard-stars { display:flex; gap:2px; margin-bottom:10px; }
        .s-tcard-star { color:#00B4D8; font-size:13px; }
        .s-tcard-quote { font-size:40px; line-height:1; color:rgba(0,180,216,0.18); font-family:'Nunito',sans-serif; font-weight:900; margin-bottom:4px; }
        .s-tcard-text { font-size:13.5px; color:rgba(144,224,239,0.6); line-height:1.72; margin-bottom:20px; }
        .s-tcard-footer { display:flex; align-items:center; gap:12px; }
        .s-tcard-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#0077B6,#00B4D8); display:flex; align-items:center; justify-content:center; font-family:'Nunito',sans-serif; font-size:12px; font-weight:800; color:#fff; border:2px solid rgba(0,180,216,0.25); flex-shrink:0; }
        .s-tcard-name { font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; color:#CAF0F8; letter-spacing:-0.2px; }
        .s-tcard-role { font-size:11.5px; color:rgba(144,224,239,0.4); margin-top:1px; }
        .s-tcard-badge { margin-left:auto; padding:3px 10px; border-radius:20px; background:rgba(0,180,216,0.12); border:1px solid rgba(0,180,216,0.22); font-size:11px; font-weight:700; color:#00B4D8; white-space:nowrap; }
        .s-metrics { margin-top:40px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); border:1px solid rgba(0,180,216,0.1); border-radius:20px; padding:32px; }
        .s-metric { text-align:center; flex:1; }
        .s-metric-val { font-family:'Nunito',sans-serif; font-size:30px; font-weight:900; letter-spacing:-1px; background:linear-gradient(135deg,#fff,#90E0EF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .s-metric-lbl { font-size:11px; font-weight:600; color:rgba(144,224,239,0.4); text-transform:uppercase; letter-spacing:0.1em; margin-top:3px; }
        .s-metric-div { width:1px; height:52px; background:rgba(0,180,216,0.12); }
        .s-testi-cta { margin-top:40px; text-align:center; }
        .s-testi-cta-btn { display:inline-flex; align-items:center; gap:10px; padding:15px 36px; border-radius:14px; font-size:15px; font-weight:700; color:#fff; background:linear-gradient(135deg,#0077B6,#00B4D8); border:none; cursor:pointer; text-decoration:none; font-family:'Poppins',sans-serif; box-shadow:0 4px 28px rgba(0,180,216,0.4); transition:all 0.18s; }
        .s-testi-cta-btn:hover { transform:translateY(-3px); box-shadow:0 10px 36px rgba(0,180,216,0.6); }

        /* ══ RESPONSIVE ══ */
        @media (max-width:1000px) {
          .s-hero-inner { grid-template-columns:1fr; padding:60px 32px; gap:48px; }
          .s-steps { grid-template-columns:1fr 1fr; }
          .s-step-connector { display:none; }
          .s-cat-grid { grid-template-columns:repeat(2,1fr); }
          .s-testi-grid { grid-template-columns:1fr 1fr; }
          .s-hiw,.s-cat,.s-testi { padding:80px 28px; }
        }
        @media (max-width:640px) {
          .s-steps { grid-template-columns:1fr; }
          .s-testi-grid { grid-template-columns:1fr; }
          .hw-ctas { flex-direction:column; }
          .s-hiw-banner { flex-direction:column; gap:20px; text-align:center; }
          .s-metrics { flex-direction:column; gap:20px; }
          .s-metric-div { width:80px; height:1px; }
          .hw-mini-cards { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      {/* ══════════ SECTION 1 — HERO ══════════ */}
      <section id="home" ref={homeRef} className="s-hero">
        <div className="s-hero-bg">
          <div className="s-hero-grad" />
          <div className="s-hero-aurora" />
          <div className="s-hero-dots" />
          <div className="hw-orb hw-orb-1" />
          <div className="hw-orb hw-orb-2" />
        </div>
        <ParticleField />
        <div className="s-hero-inner">
          <div>
            <h1
              className="hw-h1"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease 0.1s,transform 0.6s ease 0.1s",
              }}
            >
              Compete, Build &amp;
              <span className="hw-h1-accent">Win Together</span>
            </h1>
            <p
              className="hw-sub"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease 0.22s,transform 0.6s ease 0.22s",
              }}
            >
              Discover world-class hackathons, form your dream team, and turn
              ideas into products. Join <strong>250K+ innovators</strong>{" "}
              already competing on HackWave — the world's fastest-growing
              hackathon platform.
            </p>
            <div
              className="hw-ctas"
              style={{
                opacity: heroInView ? 1 : 0,
                transition: "opacity 0.6s ease 0.34s",
              }}
            >
              <a href="/hackathons" className="hw-btn-pri">
                <span>Explore Hackathons</span>
                <span className="arr">→</span>
              </a>
              <a href="/host" className="hw-btn-ghost">
                🎯 Host a Hackathon
              </a>
            </div>
            <div
              className="hw-stats"
              style={{
                opacity: heroInView ? 1 : 0,
                transition: "opacity 0.6s ease 0.46s",
              }}
            >
              {STATS.map((s) => (
                <div className="hw-stat" key={s.label}>
                  <span className="hw-stat-val">
                    <Counter
                      target={s.value}
                      suffix={s.suffix}
                      active={heroInView}
                    />
                  </span>
                  <span className="hw-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="hw-right"
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 0.65s ease 0.3s,transform 0.65s ease 0.3s",
            }}
          >
            <div className="hw-featured">
              <div className="hw-f-shine" />
              <div className="hw-f-glow" />
              <div className="hw-f-head">
                <span className="hw-f-icon">🔥</span>
                <div>
                  <span className="hw-f-badge">
                    <span className="hw-f-live" /> Featured · Ends in 14h
                  </span>
                  <h3 className="hw-f-title">Global AI Challenge 2025</h3>
                  <p className="hw-f-meta">
                    $50K prize pool · 4,200 participants joined
                  </p>
                </div>
              </div>
              <div className="hw-prog-wrap">
                <div className="hw-prog-info">
                  <span className="hw-prog-lbl">Spots filled</span>
                  <span className="hw-prog-pct">72%</span>
                </div>
                <div className="hw-prog-track">
                  <div className="hw-prog-fill" />
                </div>
              </div>
            </div>
            <div className="hw-mini-cards">
              {FEATURES.map((f) => (
                <div className="hw-mini-card" key={f.title}>
                  <span className="hw-mini-icon">{f.icon}</span>
                  <div className="hw-mini-title">{f.title}</div>
                  <div className="hw-mini-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="hw-scroll-hint"
          onClick={() =>
            hiwRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          <span>Scroll</span>
          <div className="hw-scroll-line" />
        </div>
      </section>

      {/* ══════════ SECTION 2 — HOW IT WORKS (white) ══════════ */}
      <section id="how-it-works" ref={hiwRef} className="s-hiw">
        <div className="s-hiw-topbar" />
        <div className="s-hiw-pattern" />
        <div className="s-hiw-inner">
          <div className={`reveal${hiwInView ? " in" : ""}`}>
            <div className="s-eyebrow">
              <div className="s-eyebrow-dot" /> Simple Process
            </div>
            <h2 className="s-title-dark">
              From Zero to <span className="accent">Winner</span>
              <br />
              in Four Steps
            </h2>
            <p className="s-sub-dark">
              No experience needed. Whether you're a seasoned developer or a
              first-time hacker, our platform guides you every step of the way.
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <div className="s-step-connector" />
            <div className="s-steps">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  className={`s-step reveal reveal-d${i + 1}${hiwInView ? " in" : ""}`}
                >
                  <div className="s-step-num">{s.num}</div>
                  <span className="s-step-icon">{s.icon}</span>
                  <div className="s-step-title">{s.title}</div>
                  <div className="s-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`s-hiw-banner reveal${hiwInView ? " in" : ""}`}
            style={{ transitionDelay: "0.5s" }}
          >
            <div className="s-hiw-banner-text">
              Ready to build something <span>extraordinary?</span>
            </div>
            <a href="/hackathons" className="s-hiw-banner-btn">
              Browse Live Hackathons →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 3 — CATEGORIES (soft blue) ══════════ */}
      <section id="categories" ref={catRef} className="s-cat">
        <div className="s-cat-blob1" />
        <div className="s-cat-blob2" />
        <div className="s-cat-inner">
          <div className={`reveal${catInView ? " in" : ""}`}>
            <div className="s-eyebrow">
              <div className="s-eyebrow-dot" /> 20+ Domains
            </div>
            <h2 className="s-title-dark">
              Find Your <span className="accent">Niche,</span>
              <br />
              Claim Your Crown
            </h2>
            <p className="s-sub-dark">
              From cutting-edge AI to sustainable tech — every domain has a
              leaderboard waiting for you to top it.
            </p>
          </div>
          <div className="s-cat-grid">
            {CATEGORIES.map((c, i) => (
              <div
                key={c.name}
                className={`s-cat-card reveal reveal-d${(i % 4) + 1}${catInView ? " in" : ""}`}
              >
                <div className="s-cat-topbar" />
                <span className="s-cat-icon">{c.icon}</span>
                <div className="s-cat-name">{c.name}</div>
                <div className="s-cat-count">{c.count}</div>
                <div className="s-cat-arrow">↗</div>
              </div>
            ))}
          </div>
          <div
            className={`s-cat-tags reveal${catInView ? " in" : ""}`}
            style={{ transitionDelay: "0.5s" }}
          >
            {[
              "#EdgeComputing",
              "#IoT",
              "#BioTech",
              "#AR/VR",
              "#DevTools",
              "#ClimateAI",
              "#RoboticAI",
              "#QuantumTech",
              "#OpenSource",
            ].map((t) => (
              <span key={t} className="s-cat-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 4 — TESTIMONIALS (deep navy) ══════════ */}
      <section id="testimonials" ref={testiRef} className="s-testi">
        <div className="s-testi-glow1" />
        <div className="s-testi-glow2" />
        <div className="s-testi-dots" />
        <div className="s-testi-inner">
          <div className={`reveal${testiInView ? " in" : ""}`}>
            <div className="s-eyebrow-light">
              <div className="s-eyebrow-dot" /> 50K+ Reviews
            </div>
            <h2 className="s-title-light">
              Builders Who <span className="accent">Made It</span>
            </h2>
            <p className="s-sub-light">
              Real stories from real hackers who turned weekend projects into
              careers, startups, and life-changing wins.
            </p>
          </div>
          <div className="s-testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`s-tcard reveal reveal-d${(i % 3) + 1}${testiInView ? " in" : ""}`}
              >
                <div className="s-tcard-topbar" />
                <div className="s-tcard-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="s-tcard-star">
                      ★
                    </span>
                  ))}
                </div>
                <div className="s-tcard-quote">"</div>
                <p className="s-tcard-text">{t.text}</p>
                <div className="s-tcard-footer">
                  <div className="s-tcard-avatar">{t.avatar}</div>
                  <div>
                    <div className="s-tcard-name">{t.name}</div>
                    <div className="s-tcard-role">{t.role}</div>
                  </div>
                  <div className="s-tcard-badge">{t.badge}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`s-metrics reveal${testiInView ? " in" : ""}`}
            style={{ transitionDelay: "0.4s" }}
          >
            {[
              ["4.9/5", "Platform Rating"],
              ["98%", "Would Recommend"],
              ["250K+", "Happy Hackers"],
              ["$2M+", "Prizes Won"],
            ].map(([v, l], i, arr) => (
              <div
                key={l}
                style={{ display: "flex", alignItems: "center", flex: 1 }}
              >
                <div className="s-metric" style={{ flex: 1 }}>
                  <div className="s-metric-val">{v}</div>
                  <div className="s-metric-lbl">{l}</div>
                </div>
                {i < arr.length - 1 && <div className="s-metric-div" />}
              </div>
            ))}
          </div>
          <div
            className={`s-testi-cta reveal${testiInView ? " in" : ""}`}
            style={{ transitionDelay: "0.5s" }}
          >
            <a href="/register" className="s-testi-cta-btn">
              Join 250K+ Hackers Today →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
