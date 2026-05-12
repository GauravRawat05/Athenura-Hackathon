import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .register-page {
    min-height: 100vh;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .register-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/1200x/44/56/c2/4456c2cf3368f38400f6fe14a0f4d7eb.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.35) saturate(1.2);
    z-index: 0;
  }

  .register-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(3,4,94,0.82) 0%, rgba(0,119,182,0.55) 50%, rgba(3,4,94,0.75) 100%);
    z-index: 1;
  }

  .back-home {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px 7px 10px;
    color: white;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    background: none;
    border: none;
    transition: transform 0.2s;
  }
  .back-home:hover { transform: translateX(-2px); }
  .back-home svg { width: 14px; height: 14px; transition: transform 0.2s; }
  .back-home:hover svg { transform: translateX(-2px); }

  /* ── CARD ── */
  .register-card {
    display: flex;
    width: min(780px, 96vw);
    max-height: 96vh;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,180,216,0.18);
    position: relative;
    z-index: 2;
    animation: cardAppear 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    width: 230px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #0096c7 0%, #03045E 55%, #023e8a 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 44px 26px;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    width: 260px; height: 260px;
    background: rgba(144,224,239,0.10);
    bottom: -80px; left: -80px;
    transform: rotate(45deg);
    border-radius: 36px;
  }
  .left-panel::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: rgba(0,180,216,0.13);
    top: -60px; right: -60px;
    transform: rotate(45deg);
    border-radius: 28px;
  }
  .left-shape-1 {
    position: absolute;
    width: 160px; height: 160px;
    background: rgba(144,224,239,0.07);
    top: 40px; left: -40px;
    transform: rotate(45deg); border-radius: 22px;
  }
  .left-shape-2 {
    position: absolute;
    width: 120px; height: 120px;
    background: rgba(0,180,216,0.09);
    bottom: 40px; right: -22px;
    transform: rotate(45deg); border-radius: 18px;
  }

  /* ── SIDE TABS ── */
  .left-tab {
    position: absolute;
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .tab-btn {
    width: 36px;
    height: 76px;
    border-radius: 20px 0 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
    border: none;
    outline: none;
  }

  /* SIGN UP — active (white, on top) */
  .tab-btn.signup-active {
    background: white;
    box-shadow: -4px 0 18px rgba(0,0,0,0.12);
  }
  .tab-btn.signup-active:hover { background: #f0fbff; }
  .tab-btn.signup-active .tab-text { color: #03045E; }

  /* LOGIN — ghost (below) */
  .tab-btn.login-ghost {
    background: rgba(0,180,216,0.18);
    box-shadow: -3px 0 12px rgba(0,0,0,0.08);
  }
  .tab-btn.login-ghost:hover { background: rgba(0,180,216,0.32); }
  .tab-btn.login-ghost .tab-text { color: #90e0ef; }

  .tab-text {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-family: 'Nunito', sans-serif;
    white-space: nowrap;
  }

  .left-content { position: relative; z-index: 3; }
  .left-label {
    font-size: 11px; font-weight: 600;
    color: #90e0ef; letter-spacing: 0.17em;
    text-transform: uppercase; margin-bottom: 8px;
    font-family: 'Nunito', sans-serif;
  }
  .left-title {
    font-size: 26px; font-weight: 900;
    color: white; line-height: 1.1;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.02em;
  }
  .left-title span { color: #90e0ef; }
  .left-subtitle {
    font-size: 10.5px;
    color: rgba(144,224,239,0.68);
    margin-top: 10px; line-height: 1.6; font-weight: 400;
  }

  /* ── RIGHT PANEL ── */
  .right-panel {
    flex: 1;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 44px 28px;
    overflow: hidden;
  }

  .avatar-wrap {
    width: 70px; height: 70px;
    background: linear-gradient(135deg, #03045E, #0077b6);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 8px 24px rgba(3,4,94,0.28);
    animation: avatarPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
    flex-shrink: 0;
  }
  @keyframes avatarPop {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .avatar-icon { width: 32px; height: 32px; color: white; }

  .form-title {
    font-family: 'Nunito', sans-serif;
    font-size: 19px; font-weight: 900;
    color: #03045E; letter-spacing: 0.13em;
    text-transform: uppercase; margin-bottom: 18px;
    flex-shrink: 0;
  }

  /* ── INPUT ROW (side by side) ── */
  .input-row {
    display: flex;
    gap: 12px;
    width: 100%;
  }
  .input-col { flex: 1; min-width: 0; }

  /* ── FLOATING LABEL INPUT ── */
  .input-group {
    width: 100%;
    position: relative;
    margin-bottom: 0;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    color: #90e0ef;
    pointer-events: none;
    transition: color 0.3s;
    z-index: 1;
  }

  .form-input {
    width: 100%;
    border: 2px solid #e0f4fa;
    border-radius: 10px;
    padding: 18px 12px 6px 36px;
    font-size: 13px;
    font-family: 'Poppins', sans-serif;
    color: #03045E;
    background: #f8fdff;
    outline: none;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }

  .form-input.input-error {
    border-color: #e63946;
    background: #fff8f8;
    box-shadow: 0 0 0 3px rgba(230,57,70,0.08);
  }

  .form-input:focus {
    border-color: #00b4d8;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.10);
  }

  .form-input.has-value + .float-label,
  .form-input:focus + .float-label {
    top: 6px;
    transform: none;
    font-size: 9.5px;
    color: #00b4d8;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .form-input.input-error + .float-label { color: #e63946 !important; }
  .form-input:focus ~ .input-icon { color: #00b4d8; }
  .form-input.input-error ~ .input-icon { color: #e63946; }

  .float-label {
    position: absolute;
    left: 36px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12.5px;
    color: #adb5bd;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    pointer-events: none;
    transition: top 0.2s ease, transform 0.2s ease, font-size 0.2s ease,
                color 0.2s ease, letter-spacing 0.2s ease, font-weight 0.2s ease;
  }

  /* ── ERROR ── */
  .error-msg {
    font-size: 10px;
    color: #e63946;
    margin-top: 3px;
    margin-left: 4px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 3px;
    min-height: 16px;
    animation: errPop 0.22s ease;
  }
  @keyframes errPop {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .field-wrap { width: 100%; margin-bottom: 8px; }
  .field-col { flex: 1; min-width: 0; margin-bottom: 8px; }

  /* ── TERMS ── */
  .terms-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 14px;
    margin-top: 2px;
  }
  .terms-checkbox {
    width: 14px; height: 14px;
    accent-color: #0096c7;
    margin-top: 2px;
    flex-shrink: 0;
    cursor: pointer;
  }
  .terms-text {
    font-size: 11px;
    color: #6c757d;
    font-family: 'Poppins', sans-serif;
    line-height: 1.5;
  }
  .terms-text a { color: #00b4d8; text-decoration: none; font-weight: 500; }
  .terms-text a:hover { color: #03045E; }
  .terms-err {
    font-size: 10px; color: #e63946;
    display: block; margin-top: 2px;
  }

  /* ── BUTTON ── */
  .register-btn {
    width: 100%;
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none;
    border-radius: 50px;
    padding: 11px 34px;
    font-size: 12.5px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 5px 18px rgba(3,4,94,0.32);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    flex-shrink: 0;
  }
  .register-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 50px;
  }
  .register-btn span { position: relative; z-index: 1; }
  .register-btn:hover::after { opacity: 1; }
  .register-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0,180,216,0.42); }
  .register-btn:active { transform: translateY(0); }
  .register-btn.loading { pointer-events: none; }

  .spinner {
    display: inline-block;
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 6px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── DIVIDER ── */
  .divider-row {
    width: 100%; display: flex;
    align-items: center; gap: 10px;
    margin-top: 14px; margin-bottom: 12px;
    flex-shrink: 0;
  }
  .divider-line { flex: 1; height: 1px; background: #e9ecef; }
  .divider-text { font-size: 10.5px; color: #adb5bd; white-space: nowrap; font-weight: 500; }

  /* ── SOCIAL ── */
  .social-row { display: flex; gap: 12px; width: 100%; flex-shrink: 0; }

  .social-btn {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 8px 14px;
    border: 1.5px solid #e9ecef;
    border-radius: 50px; background: white;
    cursor: pointer;
    font-size: 12px; font-weight: 600;
    font-family: 'Poppins', sans-serif;
    color: #495057;
    transition: all 0.25s ease;
    text-decoration: none;
  }
  .social-btn:hover {
    border-color: #00b4d8; color: #03045E;
    box-shadow: 0 4px 14px rgba(0,180,216,0.17);
    transform: translateY(-2px);
  }
  .social-icon { width: 15px; height: 15px; }

  /* ── FADE OUT ── */
  .register-page.fade-out {
    animation: fadeOut 0.4s ease forwards;
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  /* ────────────────────────────────────────────
     MOBILE  ≤ 700px  — single column, no scroll
  ──────────────────────────────────────────── */
  @media (max-width: 700px) {
    .register-page {
      align-items: stretch;
      height: 100svh;
      overflow: hidden;
    }

    .register-card {
      flex-direction: column;
      width: 100%;
      max-height: 100svh;
      height: 100svh;
      border-radius: 0;
      box-shadow: none;
    }

    /* LEFT → compact top banner */
    .left-panel {
      width: 100%;
      flex-shrink: 0;
      min-height: unset;
      padding: 52px 28px 20px;
      align-items: center;
      text-align: center;
      border-radius: 0 0 36px 36px;
      justify-content: center;
    }

    .left-tab {
      position: static;
      transform: none;
      flex-direction: row;
      margin-top: 14px;
      gap: 8px;
    }

    .tab-btn {
      width: 76px; height: 32px;
      border-radius: 20px;
    }
    .tab-text {
      writing-mode: horizontal-tb;
      transform: none;
      font-size: 10px;
    }

    .left-content { text-align: center; }
    .left-title { font-size: 26px; }
    .left-subtitle { font-size: 10px; margin-top: 6px; }

    /* RIGHT → fills remaining height, no overflow */
    .right-panel {
      flex: 1;
      min-height: 0;
      padding: 0 22px 16px;
      justify-content: center;
      overflow: hidden;
    }

    .avatar-wrap {
      width: 56px; height: 56px;
      margin-top: -28px;
      margin-bottom: 8px;
      border: 3px solid white;
      box-shadow: 0 6px 20px rgba(3,4,94,0.22);
    }
    .avatar-icon { width: 26px; height: 26px; }

    .form-title { font-size: 16px; margin-bottom: 12px; }

    /* stack name fields vertically on very small screens */
    .input-row { flex-direction: column; gap: 0; }
    .input-col { margin-bottom: 0; }

    .form-input {
      padding: 16px 10px 5px 34px;
      font-size: 12px;
      border-radius: 9px;
    }
    .float-label { font-size: 12px; left: 34px; }
    .form-input.has-value + .float-label,
    .form-input:focus + .float-label { font-size: 9px; top: 5px; }

    .field-wrap { margin-bottom: 6px; }
    .error-msg { font-size: 9.5px; min-height: 14px; }

    .terms-row { margin-bottom: 10px; }
    .terms-text { font-size: 10.5px; }

    .register-btn { padding: 10px; font-size: 12px; }

    .divider-row { margin-top: 10px; margin-bottom: 10px; }
    .social-row { gap: 10px; }
    .social-btn { padding: 7px 10px; font-size: 11.5px; }
  }

  @media (max-width: 380px) {
    .left-panel { padding: 48px 20px 16px; }
    .right-panel { padding: 0 16px 12px; }
    .form-title { font-size: 14px; margin-bottom: 10px; }
    .field-wrap { margin-bottom: 4px; }
    .terms-row { margin-bottom: 8px; }
    .divider-row { margin-top: 8px; margin-bottom: 8px; }
  }
`;

export default function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
  });
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [errors, setErrors]   = useState({});
  const navigate = useNavigate();

  const goToLogin = () => { setLeaving(true); setTimeout(() => navigate("/login"), 420); };
  const goHome    = () => { setLeaving(true); setTimeout(() => navigate("/"), 420); };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const inputClass = (field) =>
    `form-input${errors[field] ? " input-error" : ""}${form[field] ? " has-value" : ""}`;

  const handleSubmit = async () => {
    const e = {};
    if (!form.firstName.trim())   e.firstName      = "First name required";
    if (!form.lastName.trim())    e.lastName       = "Last name required";
    if (!form.email.trim())       e.email          = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)           e.password       = "Password required";
    else if (form.password.length < 6) e.password  = "Min 6 characters";
    if (!form.confirmPassword)    e.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!agreed)                  e.agreed         = "Please accept the terms";

    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`register-page${leaving ? " fade-out" : ""}`}>
        <div className="register-bg" />
        <div className="register-bg-overlay" />

        <button className="back-home" onClick={goHome}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Home
        </button>

        <div className="register-card">

          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div className="left-shape-1" /><div className="left-shape-2" />
            <div className="left-content">
              <p className="left-label">Join us today</p>
              <h2 className="left-title">SIGN <span>UP</span></h2>
              <p className="left-subtitle">Create your account &amp;<br />start your journey.</p>
            </div>

            {/* SIGN UP on top (active/white), LOGIN below (ghost) */}
            <div className="left-tab">
              <button className="tab-btn signup-active" title="Sign Up">
                <span className="tab-text">SIGN UP</span>
              </button>
              <button className="tab-btn login-ghost" onClick={goToLogin} title="Go to Login">
                <span className="tab-text">LOGIN</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">

            <div className="avatar-wrap">
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>

            <h1 className="form-title">CREATE ACCOUNT</h1>

            {/* First + Last Name */}
            <div className="input-row" style={{ marginBottom: 0 }}>
              <div className="input-col">
                <div className="field-wrap">
                  <div className="input-group">
                    <input className={inputClass("firstName")} id="reg-fn"
                      name="firstName" type="text" autoComplete="given-name"
                      placeholder="" value={form.firstName} onChange={set("firstName")} />
                    <label className="float-label" htmlFor="reg-fn">First Name</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  {errors.firstName && <p className="error-msg">⚠ {errors.firstName}</p>}
                  {!errors.firstName && <div style={{ minHeight: 16 }} />}
                </div>
              </div>

              <div className="input-col">
                <div className="field-wrap">
                  <div className="input-group">
                    <input className={inputClass("lastName")} id="reg-ln"
                      name="lastName" type="text" autoComplete="family-name"
                      placeholder="" value={form.lastName} onChange={set("lastName")} />
                    <label className="float-label" htmlFor="reg-ln">Last Name</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  {errors.lastName && <p className="error-msg">⚠ {errors.lastName}</p>}
                  {!errors.lastName && <div style={{ minHeight: 16 }} />}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="field-wrap">
              <div className="input-group">
                <input className={inputClass("email")} id="reg-email"
                  name="email" type="email" autoComplete="email"
                  placeholder="" value={form.email} onChange={set("email")} />
                <label className="float-label" htmlFor="reg-email">Email Address</label>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              {errors.email && <p className="error-msg">⚠ {errors.email}</p>}
              {!errors.email && <div style={{ minHeight: 16 }} />}
            </div>

            {/* Password + Confirm */}
            <div className="input-row" style={{ marginBottom: 0 }}>
              <div className="input-col">
                <div className="field-wrap">
                  <div className="input-group">
                    <input className={inputClass("password")} id="reg-pw"
                      name="password" type="password" autoComplete="new-password"
                      placeholder="" value={form.password} onChange={set("password")} />
                    <label className="float-label" htmlFor="reg-pw">Password</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  {errors.password && <p className="error-msg">⚠ {errors.password}</p>}
                  {!errors.password && <div style={{ minHeight: 16 }} />}
                </div>
              </div>

              <div className="input-col">
                <div className="field-wrap">
                  <div className="input-group">
                    <input className={inputClass("confirmPassword")} id="reg-cpw"
                      name="confirmPassword" type="password" autoComplete="new-password"
                      placeholder="" value={form.confirmPassword} onChange={set("confirmPassword")} />
                    <label className="float-label" htmlFor="reg-cpw">Confirm Password</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  {errors.confirmPassword && <p className="error-msg">⚠ {errors.confirmPassword}</p>}
                  {!errors.confirmPassword && <div style={{ minHeight: 16 }} />}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="terms-row">
              <input className="terms-checkbox" type="checkbox" id="reg-terms"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.agreed) setErrors(p => ({ ...p, agreed: "" }));
                }}
              />
              <label className="terms-text" htmlFor="reg-terms">
                I agree to the <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
                {errors.agreed && <span className="terms-err">⚠ {errors.agreed}</span>}
              </label>
            </div>

            {/* Submit */}
            <button className={`register-btn${loading ? " loading" : ""}`} onClick={handleSubmit}>
              {loading && <span className="spinner" />}
              <span>{loading ? "Creating account..." : "CREATE ACCOUNT"}</span>
            </button>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">Or Sign Up With</span>
              <div className="divider-line" />
            </div>

            <div className="social-row">
              <a href="#" className="social-btn">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </a>
              <a href="#" className="social-btn">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}