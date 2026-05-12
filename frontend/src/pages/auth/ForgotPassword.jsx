import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .fp-page {
    min-height: 100vh;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .fp-bg {
    position: absolute; inset: 0;
    background-image: url('https://i.pinimg.com/736x/88/0b/19/880b19ec40c935f42b78f1151939cc75.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.30) saturate(1.3);
    z-index: 0;
  }

  .fp-bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(3,4,94,0.88) 0%, rgba(0,119,182,0.50) 50%, rgba(3,4,94,0.80) 100%);
    z-index: 1;
  }

  /* ── BACK BUTTON ── */
  .back-home {
    position: absolute;
    top: 20px; left: 20px;
    z-index: 100;
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px 8px 12px;
    color: white;
    font-size: 12px; font-weight: 600;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
   
    
   
    border-radius: 50px;
    transition: all 0.25s;
  }
  .back-home:hover { transform: translateX(-2px); }
  .back-home svg { width: 14px; height: 14px; transition: transform 0.2s; }
  .back-home:hover svg { transform: translateX(-2px); }

  /* ── CARD ── */
  .fp-card {
    display: flex;
    width: min(860px, 94vw);
    min-height: 480px;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,180,216,0.15);
    position: relative; z-index: 2;
    animation: cardAppear 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(32px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LEFT PANEL ── */
  .fp-left {
    width: 270px; flex-shrink: 0;
    background: linear-gradient(160deg, #0096c7 0%, #03045E 60%, #023e8a 100%);
    position: relative;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: center;
    padding: 48px 28px 40px;
    overflow: hidden; gap: 28px;
  }
  .fp-left::before {
    content: '';
    position: absolute; width: 300px; height: 300px;
    background: rgba(144,224,239,0.09);
    bottom: -100px; left: -100px;
    transform: rotate(45deg); border-radius: 40px;
  }
  .fp-left::after {
    content: '';
    position: absolute; width: 220px; height: 220px;
    background: rgba(0,180,216,0.12);
    top: -70px; right: -70px;
    transform: rotate(45deg); border-radius: 30px;
  }
  .fp-blob1 {
    position: absolute; width: 150px; height: 150px;
    background: rgba(144,224,239,0.06);
    top: 50%; left: -30px;
    transform: translateY(-50%) rotate(45deg); border-radius: 20px;
  }
  .fp-blob2 {
    position: absolute; width: 100px; height: 100px;
    background: rgba(0,180,216,0.08);
    bottom: 60px; right: -20px;
    transform: rotate(45deg); border-radius: 14px;
  }

  .fp-left-content { position: relative; z-index: 3; width: 100%; }

  .fp-brand {
    font-family: 'Nunito', sans-serif;
    font-size: 10.5px; font-weight: 700;
    color: #90e0ef; letter-spacing: 0.18em;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .fp-left-title {
    font-family: 'Nunito', sans-serif;
    font-size: 25px; font-weight: 900;
    color: white; line-height: 1.15; margin-bottom: 8px;
  }
  .fp-left-title span { color: #90e0ef; }
  .fp-left-sub {
    font-size: 10.5px;
    color: rgba(144,224,239,0.62);
    line-height: 1.65; margin-bottom: 24px;
  }

  /* steps */
  .fp-steps { display: flex; flex-direction: column; gap: 0; }
  .fp-step-row {
    display: flex; align-items: flex-start;
    gap: 12px; position: relative; z-index: 3;
  }
  .step-num {
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(0,180,216,0.22);
    border: 1.5px solid rgba(144,224,239,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif;
    font-size: 11px; font-weight: 800; color: #90e0ef;
    flex-shrink: 0; margin-top: 1px; transition: all 0.4s;
  }
  .step-num.active {
    background: #00b4d8; border-color: #00b4d8; color: white;
    box-shadow: 0 0 16px rgba(0,180,216,0.55);
  }
  .step-num.done {
    background: rgba(0,180,216,0.40); border-color: #00b4d8; color: white;
  }
  .step-label { font-size: 11.5px; font-weight: 700; color: white; font-family: 'Nunito', sans-serif; }
  .step-desc  { font-size: 9.5px; color: rgba(144,224,239,0.52); margin-top: 1px; line-height: 1.45; }
  .step-line  { width: 1.5px; height: 14px; background: rgba(144,224,239,0.18); margin-left: 12px; }

  /* ── RIGHT PANEL ── */
  .fp-right {
    flex: 1; background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 44px 50px 38px;
    position: relative;
  }

  /* step dots */
  .step-dots { display: flex; gap: 6px; margin-bottom: 22px; }
  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #e0f4fa; transition: all 0.35s ease;
  }
  .dot.active {
    width: 24px; border-radius: 4px;
    background: linear-gradient(90deg, #03045E, #00b4d8);
  }

  /* ── ICON CIRCLE ── */
  .fp-icon-wrap {
    width: 74px; height: 74px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    animation: avatarPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  }
  @keyframes avatarPop {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .fp-icon-wrap.blue1 {
    background: linear-gradient(135deg, #03045E, #0096c7);
    box-shadow: 0 10px 28px rgba(3,4,94,0.30);
  }
  .fp-icon-wrap.blue2 {
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    box-shadow: 0 10px 28px rgba(0,119,182,0.30);
  }
  /* CRITICAL: icon always white — stroke="white" directly on svg */
  .fp-icon { width: 32px; height: 32px; }

  .fp-title {
    font-family: 'Nunito', sans-serif;
    font-size: 21px; font-weight: 900;
    color: #03045E; letter-spacing: 0.10em;
    text-transform: uppercase; margin-bottom: 6px; text-align: center;
  }
  .fp-subtitle {
    font-size: 12px; color: #6c757d;
    text-align: center; line-height: 1.65;
    margin-bottom: 24px; max-width: 300px;
  }
  .fp-subtitle strong { color: #03045E; font-weight: 600; }

  /* ── INPUT FIELD ── */
  .fp-field { width: 100%; margin-bottom: 4px; }
  .fp-input-group { width: 100%; position: relative; }

  .fp-input-icon {
    position: absolute;
    left: 14px; top: 50%; transform: translateY(-50%);
    width: 17px; height: 17px;
    color: #90e0ef;
    pointer-events: none; transition: color 0.3s; z-index: 1;
  }

  .fp-input {
    width: 100%;
    border: 2px solid #e0f4fa; border-radius: 12px;
    padding: 20px 14px 7px 44px;
    font-size: 13.5px; font-family: 'Poppins', sans-serif;
    color: #03045E; background: #f8fdff; outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
    /* Remove browser default password reveal icon */
    -webkit-appearance: none;
  }
  .fp-input::-ms-reveal,
  .fp-input::-ms-clear,
  .fp-input::-webkit-contacts-auto-fill-button,
  .fp-input::-webkit-credentials-auto-fill-button { display: none !important; }

  .fp-input.has-eye { padding-right: 46px; }
  .fp-input:focus { border-color: #00b4d8; background: #fff; box-shadow: 0 0 0 4px rgba(0,180,216,0.10); }
  .fp-input.err   { border-color: #e63946; background: #fff8f8; box-shadow: 0 0 0 3px rgba(230,57,70,0.08); }

  /* float label */
  .fp-float-label {
    position: absolute;
    left: 44px; top: 50%; transform: translateY(-50%);
    font-size: 13px; color: #adb5bd;
    font-family: 'Poppins', sans-serif; font-weight: 400;
    pointer-events: none;
    transition: top 0.22s, transform 0.22s, font-size 0.22s, color 0.22s, letter-spacing 0.22s;
  }
  .fp-input.has-value + .fp-float-label,
  .fp-input:focus    + .fp-float-label {
    top: 7px; transform: none; font-size: 9.5px;
    color: #00b4d8; font-weight: 700; letter-spacing: 0.08em;
  }
  .fp-input.err + .fp-float-label { color: #e63946 !important; }
  .fp-input:focus ~ .fp-input-icon { color: #00b4d8; }
  .fp-input.err   ~ .fp-input-icon { color: #e63946; }

  /* ── EYE BUTTON — ONE ONLY, right side ── */
  .eye-btn {
    position: absolute;
    right: 13px; top: 50%; transform: translateY(-50%);
    width: 22px; height: 22px;
    background: none; border: none; padding: 0;
    cursor: pointer; color: #b0bec5;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.2s; z-index: 3;
    flex-shrink: 0;
  }
  .eye-btn:hover { color: #00b4d8; }
  .eye-btn svg { width: 17px; height: 17px; pointer-events: none; display: block; }

  .fp-error-msg {
    font-size: 10.5px; color: #e63946;
    margin-top: 4px; margin-left: 5px;
    font-weight: 500; font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 3px;
    min-height: 17px;
    animation: errPop 0.22s ease;
  }
  @keyframes errPop {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── OTP ── */
  .otp-row {
    display: flex; gap: 9px;
    width: 100%; justify-content: center;
    margin-bottom: 4px;
  }
  .otp-box {
    width: 50px; height: 56px;
    border: 2px solid #e0f4fa; border-radius: 12px;
    font-size: 22px; font-weight: 800;
    font-family: 'Nunito', sans-serif; color: #03045E;
    text-align: center; background: #f8fdff; outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    caret-color: #00b4d8;
  }
  .otp-box:focus   { border-color: #00b4d8; background: #fff; box-shadow: 0 0 0 4px rgba(0,180,216,0.12); }
  .otp-box.filled  { border-color: #0096c7; background: #f0fbff; }
  .otp-box.otp-err { border-color: #e63946; background: #fff8f8; }

  .otp-resend {
    font-size: 11.5px; color: #6c757d;
    text-align: center; margin: 6px 0 2px;
    font-family: 'Poppins', sans-serif;
  }
  .otp-resend button {
    color: #00b4d8; background: none; border: none;
    font-size: 11.5px; font-weight: 600; cursor: pointer;
    font-family: 'Poppins', sans-serif; transition: color 0.2s;
  }
  .otp-resend button:hover { color: #03045E; }
  .otp-timer { color: #adb5bd; }

  /* ── PASSWORD STRENGTH ── */
  .pw-strength { width: 100%; margin: 5px 0 2px; }
  .pw-strength-bar { display: flex; gap: 4px; margin-bottom: 3px; }
  .pw-seg {
    flex: 1; height: 3px; border-radius: 2px;
    background: #e9ecef; transition: background 0.3s;
  }
  .pw-seg.weak   { background: #e63946; }
  .pw-seg.fair   { background: #f4a261; }
  .pw-seg.good   { background: #2ec4b6; }
  .pw-seg.strong { background: #00b4d8; }
  .pw-strength-label { font-size: 10px; font-weight: 600; font-family: 'Poppins', sans-serif; }
  .pw-strength-label.weak   { color: #e63946; }
  .pw-strength-label.fair   { color: #f4a261; }
  .pw-strength-label.good   { color: #2ec4b6; }
  .pw-strength-label.strong { color: #00b4d8; }

  /* ── SUCCESS ── */
  .success-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .success-anim {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, #03045E, #0096c7);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 30px rgba(3,4,94,0.35);
    margin-bottom: 18px;
    animation: successPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  @keyframes successPop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  /* ── PRIMARY BUTTON ── */
  .fp-btn {
    width: 100%;
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none; border-radius: 50px;
    padding: 13px 34px;
    font-size: 13px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em; text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(3,4,94,0.32);
    transition: all 0.3s ease;
    position: relative; overflow: hidden; margin-top: 10px;
  }
  .fp-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s; border-radius: 50px;
  }
  .fp-btn span { position: relative; z-index: 1; }
  .fp-btn:hover::after { opacity: 1; }
  .fp-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,180,216,0.42); }
  .fp-btn:active { transform: translateY(0); }
  .fp-btn.loading { pointer-events: none; opacity: 0.85; }

  .spinner {
    display: inline-block; width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 6px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fp-page.fade-out { animation: fadeOut 0.4s ease forwards; }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  /* ══════════════════════════════
     MOBILE ≤ 700px — NO SCROLL
  ══════════════════════════════ */
  @media (max-width: 700px) {
    .fp-page { align-items: stretch; height: 100svh; overflow: hidden; }

     .back-home {
    top: 8px;
    left: 5px;
  }

    .fp-card {
      flex-direction: column;
      width: 100%; height: 100svh; max-height: 100svh;
      border-radius: 0; box-shadow: none;
    }

    /* ── TOP BANNER ── */
    .fp-left {
      width: 100%; flex-shrink: 0;
      padding: 48px 20px 16px;
      align-items: center; text-align: center;
      border-radius: 0 0 28px 28px;
      justify-content: flex-end;
      gap: 8px;
    }
    .fp-left-content { width: 100%; }
    .fp-brand { font-size: 9px; letter-spacing: 0.14em; margin-bottom: 4px; }
    .fp-left-title { font-size: 20px; margin-bottom: 0; line-height: 1.1; }
    .fp-left-sub { display: none; }

    /* steps — horizontal strip */
    .fp-steps {
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      gap: 12px; width: 100%; margin-top: 10px;
    }
    .fp-step-row {
      flex-direction: column;
      align-items: center; text-align: center;
      gap: 3px; flex: 1;
    }
    .step-line { display: none; }
    .step-desc { display: none; }
    .step-label { font-size: 9px; text-align: center; line-height: 1.3; }
    .step-num { width: 22px; height: 22px; font-size: 10px; }

    /* horizontal connector between step bubbles */
    .step-h-connector {
      width: 20px; height: 1.5px;
      background: rgba(144,224,239,0.22);
      margin-top: 11px; flex-shrink: 0;
    }

    /* ── RIGHT CONTENT ── */
    .fp-right {
      flex: 1; min-height: 0;
      padding: 14px 20px 16px;
      justify-content: center; overflow: hidden;
    }

    .step-dots { margin-bottom: 10px; }
    .dot { width: 7px; height: 7px; }
    .dot.active { width: 20px; }

    .fp-icon-wrap { width: 54px; height: 54px; margin-bottom: 8px; }
    .fp-icon { width: 24px; height: 24px; }

    .fp-title { font-size: 16px; margin-bottom: 4px; }
    .fp-subtitle { font-size: 10.5px; margin-bottom: 14px; line-height: 1.5; }

    .fp-input { padding: 17px 12px 5px 38px; font-size: 12px; border-radius: 10px; }
    .fp-input.has-eye { padding-right: 38px; }
    .fp-float-label { font-size: 12px; left: 38px; }
    .fp-input.has-value + .fp-float-label,
    .fp-input:focus    + .fp-float-label { font-size: 9px; top: 6px; }
    .fp-input-icon { left: 11px; width: 14px; height: 14px; }
    .eye-btn { right: 11px; width: 18px; height: 18px; }
    .eye-btn svg { width: 15px; height: 15px; }

    .fp-field { margin-bottom: 2px; }
    .fp-error-msg { font-size: 9px; min-height: 14px; }

    .pw-strength { margin: 3px 0 1px; }

    .otp-box { width: 40px; height: 48px; font-size: 19px; border-radius: 10px; }
    .otp-row { gap: 6px; }
    .otp-resend { font-size: 10.5px; margin: 4px 0 1px; }

    .fp-btn { padding: 11px; font-size: 12px; margin-top: 8px; border-radius: 40px; }

    .success-anim { width: 64px; height: 64px; margin-bottom: 12px; }
    .success-wrap .fp-title { font-size: 18px; }
    .success-wrap .fp-subtitle { font-size: 11px; margin-bottom: 16px; }
  }

  @media (max-width: 380px) {
    .fp-right { padding: 12px 14px 12px; }
    .otp-box { width: 34px; height: 42px; font-size: 17px; }
    .otp-row { gap: 5px; }
    .fp-title { font-size: 14px; }
    .fp-subtitle { font-size: 10px; margin-bottom: 10px; }
    .fp-left { padding: 44px 16px 14px; }
    .fp-left-title { font-size: 18px; }
  }
`;

const OTP_LENGTH = 6;

function getStrength(pw) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return "weak";
  if (s === 2) return "fair";
  if (s === 3) return "good";
  return "strong";
}
const strLabel = { weak: "Weak", fair: "Fair", good: "Good", strong: "Strong" };

/* ── SVG ICONS — all white strokes ── */
const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function ForgotPassword() {
  const [step, setStep]           = useState(1);
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState(Array(OTP_LENGTH).fill(""));
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [leaving, setLeaving]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [timer, setTimer]         = useState(0);
  const navigate = useNavigate();

  const goToLogin = () => { setLeaving(true); setTimeout(() => navigate("/login"), 420); };
  const goHome    = () => { setLeaving(true); setTimeout(() => navigate("/"), 420); };

  const startTimer = () => {
    setTimer(60);
    const id = setInterval(() => setTimer(t => {
      if (t <= 1) { clearInterval(id); return 0; } return t - 1;
    }), 1000);
  };

  const handleOtp = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (errors.otp) setErrors(p => ({ ...p, otp: "" }));
    if (val && i < OTP_LENGTH - 1) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  };
  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    document.getElementById(`otp-${Math.min(text.length, OTP_LENGTH - 1)}`)?.focus();
  };

  const handleStep1 = () => {
    if (!email.trim()) { setErrors({ email: "Please enter your email address" }); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrors({ email: "Enter a valid email address" }); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); startTimer(); }, 1500);
  };
  const handleStep2 = () => {
    if (otp.some(d => !d)) { setErrors({ otp: "Please enter the complete 6-digit code" }); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1500);
  };
  const handleStep3 = () => {
    const e = {};
    if (!newPw) e.newPw = "Please enter a new password";
    else if (newPw.length < 8) e.newPw = "Minimum 8 characters required";
    if (!confirmPw) e.confirmPw = "Please confirm your password";
    else if (newPw !== confirmPw) e.confirmPw = "Passwords do not match";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 1500);
  };

  const strength = getStrength(newPw);
  const steps = [
    { n: 1, label: "Enter Email",  desc: "Registered email" },
    { n: 2, label: "Verify OTP",   desc: "Code sent to email" },
    { n: 3, label: "New Password", desc: "Set strong password" },
  ];

  /* left icon class helper */
  const ic = (field) =>
    `fp-input${field ? " has-value" : ""}${errors[field] ? " err" : ""}`;

  const renderRight = () => {

    /* ── STEP 1 : Email ── */
    if (step === 1) return (
      <>
        <div className="fp-icon-wrap blue1">
          {/* white envelope */}
          <svg className="fp-icon" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 className="fp-title">FORGOT PASSWORD</h1>
        <p className="fp-subtitle">No worries! Enter your registered email and we'll send you a reset code.</p>

        <div className="fp-field">
          <div className="fp-input-group">
            <input
              className={`fp-input${errors.email ? " err" : ""}${email ? " has-value" : ""}`}
              id="fp-email" name="email" type="email" autoComplete="email"
              placeholder="" value={email}
              onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
              onKeyDown={e => e.key === "Enter" && handleStep1()}
            />
            <label className="fp-float-label" htmlFor="fp-email">Email Address</label>
            {/* left icon — envelope */}
            <svg className="fp-input-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div className="fp-error-msg">{errors.email ? `⚠ ${errors.email}` : ""}</div>
        </div>

        <button className={`fp-btn${loading ? " loading" : ""}`} onClick={handleStep1}>
          {loading && <span className="spinner"/>}
          <span>{loading ? "Sending code..." : "SEND RESET CODE"}</span>
        </button>
      </>
    );

    /* ── STEP 2 : OTP ── */
    if (step === 2) return (
      <>
        <div className="fp-icon-wrap blue2">
          {/* white phone */}
          <svg className="fp-icon" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        </div>
        <h1 className="fp-title">VERIFY CODE</h1>
        <p className="fp-subtitle">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
        </p>

        <div className="fp-field">
          <div className="otp-row" onPaste={handleOtpPaste}>
            {otp.map((d, i) => (
              <input
                key={i} id={`otp-${i}`}
                className={`otp-box${d ? " filled" : ""}${errors.otp ? " otp-err" : ""}`}
                type="text" inputMode="numeric" maxLength={1}
                value={d}
                onChange={e => handleOtp(i, e.target.value)}
                onKeyDown={e => handleOtpKey(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>
          <div className="fp-error-msg">{errors.otp ? `⚠ ${errors.otp}` : ""}</div>
        </div>

        <p className="otp-resend">
          Didn't receive it?{" "}
          {timer > 0
            ? <span className="otp-timer">Resend in {timer}s</span>
            : <button onClick={() => { setOtp(Array(OTP_LENGTH).fill("")); startTimer(); }}>Resend code</button>
          }
        </p>

        <button className={`fp-btn${loading ? " loading" : ""}`} onClick={handleStep2}>
          {loading && <span className="spinner"/>}
          <span>{loading ? "Verifying..." : "VERIFY CODE"}</span>
        </button>
      </>
    );

    /* ── STEP 3 : New Password ── */
    if (step === 3) return (
      <>
        <div className="fp-icon-wrap blue1">
          {/* white lock — stroke="white" directly, not via CSS */}
          <svg className="fp-icon" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1 className="fp-title">NEW PASSWORD</h1>
        <p className="fp-subtitle">Almost there! Create a strong password for your account.</p>

        {/* New password field */}
        <div className="fp-field">
          <div className="fp-input-group">
            <input
              className={`fp-input has-eye${errors.newPw ? " err" : ""}${newPw ? " has-value" : ""}`}
              id="fp-newpw" name="newPassword"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="" value={newPw}
              onChange={e => { setNewPw(e.target.value); if (errors.newPw) setErrors(p => ({ ...p, newPw: "" })); }}
            />
            <label className="fp-float-label" htmlFor="fp-newpw">New Password</label>
            {/* LEFT: lock icon */}
            <svg className="fp-input-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {/* RIGHT: eye button — the ONLY eye, no browser default */}
            <button className="eye-btn" onClick={() => setShowPw(p => !p)}
              type="button" tabIndex={-1} aria-label="Toggle password visibility">
              {showPw ? <EyeOff/> : <EyeOpen/>}
            </button>
          </div>
          {newPw && strength && (
            <div className="pw-strength">
              <div className="pw-strength-bar">
                {["weak","fair","good","strong"].map((s, i) => (
                  <div key={s}
                    className={`pw-seg${["weak","fair","good","strong"].indexOf(strength) >= i ? " " + strength : ""}`}
                  />
                ))}
              </div>
              <span className={`pw-strength-label ${strength}`}>{strLabel[strength]}</span>
            </div>
          )}
          <div className="fp-error-msg">{errors.newPw ? `⚠ ${errors.newPw}` : ""}</div>
        </div>

        {/* Confirm password field */}
        <div className="fp-field">
          <div className="fp-input-group">
            <input
              className={`fp-input has-eye${errors.confirmPw ? " err" : ""}${confirmPw ? " has-value" : ""}`}
              id="fp-cpw" name="confirmPassword"
              type={showCpw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="" value={confirmPw}
              onChange={e => { setConfirmPw(e.target.value); if (errors.confirmPw) setErrors(p => ({ ...p, confirmPw: "" })); }}
              onKeyDown={e => e.key === "Enter" && handleStep3()}
            />
            <label className="fp-float-label" htmlFor="fp-cpw">Confirm Password</label>
            {/* LEFT: shield/check icon */}
            <svg className="fp-input-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {/* RIGHT: eye button — the ONLY eye */}
            <button className="eye-btn" onClick={() => setShowCpw(p => !p)}
              type="button" tabIndex={-1} aria-label="Toggle confirm password visibility">
              {showCpw ? <EyeOff/> : <EyeOpen/>}
            </button>
          </div>
          <div className="fp-error-msg">{errors.confirmPw ? `⚠ ${errors.confirmPw}` : ""}</div>
        </div>

        <button className={`fp-btn${loading ? " loading" : ""}`} onClick={handleStep3}>
          {loading && <span className="spinner"/>}
          <span>{loading ? "Updating password..." : "RESET PASSWORD"}</span>
        </button>
      </>
    );

    /* ── STEP 4 : Success ── */
    if (step === 4) return (
      <div className="success-wrap">
        <div className="success-anim">
          <svg style={{width:34,height:34}} viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="fp-title">ALL DONE!</h1>
        <p className="fp-subtitle" style={{ marginBottom: 22 }}>
          Your password has been reset successfully.<br/>
          You can now log in with your new password.
        </p>
        <button className="fp-btn" onClick={goToLogin}>
          <span>GO TO LOGIN</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`fp-page${leaving ? " fade-out" : ""}`}>
        <div className="fp-bg"/>
        <div className="fp-bg-overlay"/>

        <button className="back-home" onClick={goToLogin}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Login
        </button>

        <div className="fp-card">

          {/* ── LEFT ── */}
          <div className="fp-left">
            <div className="fp-blob1"/><div className="fp-blob2"/>
            <div className="fp-left-content">
              <p className="fp-brand">Password Recovery</p>
              <h2 className="fp-left-title">RESET YOUR<br/><span>PASSWORD</span></h2>
              <p className="fp-left-sub">
                Follow the simple steps to securely regain access to your account.
              </p>

              <div className="fp-steps">
                {steps.map((s, idx) => (
                  <div key={s.n}>
                    <div className="fp-step-row">
                      <div className={`step-num${step > s.n ? " done" : step === s.n ? " active" : ""}`}>
                        {step > s.n
                          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                              stroke="white" strokeWidth="3"
                              strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          : s.n
                        }
                      </div>
                      <div>
                        <div className="step-label">{s.label}</div>
                        <div className="step-desc">{s.desc}</div>
                      </div>
                    </div>
                    {idx < steps.length - 1 && <div className="step-line"/>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="fp-right">
            {step < 4 && (
              <div className="step-dots">
                {[1,2,3].map(n => (
                  <div key={n} className={`dot${step === n ? " active" : ""}`}/>
                ))}
              </div>
            )}
            {renderRight()}
          </div>

        </div>
      </div>
    </>
  );
}