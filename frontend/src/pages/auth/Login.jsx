import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/736x/3d/48/cb/3d48cb05a968ee9251e6988592832a34.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.35) saturate(1.2);
    z-index: 0;
  }

  .login-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(3,4,94,0.82) 0%, rgba(0,119,182,0.55) 50%, rgba(3,4,94,0.75) 100%);
    z-index: 1;
  }

  /* ── BACK TO HOME BUTTON ── */
  .back-home {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 7px;
   
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
   
    padding: 8px 16px 8px 12px;
    color: white;
    text-decoration: none;
    font-size: 12.5px;
    font-weight: 600;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.25s, border-color 0.25s, transform 0.2s;
    
  }
  .back-home:hover {
    
    transform: translateX(-2px);
  }
  .back-home svg {
    width: 15px; height: 15px;
    transition: transform 0.2s;
  }
  .back-home:hover svg {
    transform: translateX(-2px);
  }

  .login-card {
    display: flex;
    width: 720px;
    min-height: 460px;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,180,216,0.18);
    position: relative;
    z-index: 2;
    animation: cardAppear 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    width: 240px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #0096c7 0%, #03045E 55%, #023e8a 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 28px;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    width: 280px; height: 280px;
    background: rgba(144,224,239,0.10);
    bottom: -90px; left: -90px;
    transform: rotate(45deg);
    border-radius: 36px;
  }
  .left-panel::after {
    content: '';
    position: absolute;
    width: 210px; height: 210px;
    background: rgba(0,180,216,0.13);
    top: -65px; right: -65px;
    transform: rotate(45deg);
    border-radius: 28px;
  }
  .left-shape-1 {
    position: absolute;
    width: 170px; height: 170px;
    background: rgba(144,224,239,0.07);
    top: 45px; left: -45px;
    transform: rotate(45deg);
    border-radius: 22px;
  }
  .left-shape-2 {
    position: absolute;
    width: 130px; height: 130px;
    background: rgba(0,180,216,0.09);
    bottom: 45px; right: -25px;
    transform: rotate(45deg);
    border-radius: 18px;
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
    gap: 6px;
  }

  .tab-btn {
    width: 38px;
    height: 80px;
    border-radius: 20px 0 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s ease;
    border: none;
    outline: none;
  }

  .tab-btn.signup {
    background: rgba(0,180,216,0.18);
    box-shadow: -3px 0 12px rgba(0,0,0,0.08);
  }
  .tab-btn.signup:hover { background: rgba(0,180,216,0.32); }

  .tab-btn.login-tab {
    background: white;
    box-shadow: -4px 0 18px rgba(0,0,0,0.12);
    margin-top: 2px;
  }
  .tab-btn.login-tab:hover { background: #f0fbff; }

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
  .tab-btn.signup .tab-text { color: #90e0ef; }
  .tab-btn.login-tab .tab-text { color: #03045E; }

  .left-content { position: relative; z-index: 3; }
  .left-label {
    font-size: 11.5px; font-weight: 600;
    color: #90e0ef; letter-spacing: 0.17em;
    text-transform: uppercase; margin-bottom: 10px;
    font-family: 'Nunito', sans-serif;
  }
  .left-title {
    font-size: 28px; font-weight: 900;
    color: white; line-height: 1.1;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.02em;
  }
  .left-title span { color: #90e0ef; }
  .left-subtitle {
    font-size: 11px;
    color: rgba(144,224,239,0.68);
    margin-top: 13px; line-height: 1.65; font-weight: 400;
  }

  /* ── RIGHT PANEL ── */
  .right-panel {
    flex: 1;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 48px 42px;
  }

  /* ── AVATAR (normal, no animation) ── */
  .avatar-wrap {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, #03045E, #0077b6);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 10px 28px rgba(3,4,94,0.28);
    animation: avatarPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }
  @keyframes avatarPop {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .avatar-icon { width: 38px; height: 38px; color: white; }

  .form-title {
    font-family: 'Nunito', sans-serif;
    font-size: 23px; font-weight: 900;
    color: #03045E; letter-spacing: 0.13em;
    text-transform: uppercase; margin-bottom: 32px;
  }

  /* ── FLOATING LABEL INPUT ── */
  .input-group {
    width: 100%;
    position: relative;
    margin-bottom: 6px;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px; height: 18px;
    color: #90e0ef;
    pointer-events: none;
    transition: color 0.3s;
    z-index: 1;
  }

  .form-input {
    width: 100%;
    border: 2px solid #e0f4fa;
    border-radius: 12px;
    padding: 22px 14px 8px 42px;
    font-size: 14px;
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
    box-shadow: 0 0 0 4px rgba(0,180,216,0.10);
  }

  /* Float label UP when focused OR has value */
  .form-input:focus + .float-label,
  .form-input:not(:placeholder-shown) + .float-label {
    top: 8px;
    transform: none;
    font-size: 10.5px;
    color: #00b4d8;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .form-input.input-error + .float-label { color: #e63946 !important; }
  .form-input:focus ~ .input-icon { color: #00b4d8; }
  .form-input.input-error ~ .input-icon { color: #e63946; }

  .float-label {
    position: absolute;
    left: 42px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13.5px;
    color: #adb5bd;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    pointer-events: none;
    transition: top 0.22s ease, transform 0.22s ease, font-size 0.22s ease,
                color 0.22s ease, letter-spacing 0.22s ease, font-weight 0.22s ease;
  }

  /* ── ERROR MESSAGE ── */
  .error-msg {
    font-size: 11px;
    color: #e63946;
    margin-top: 5px;
    margin-bottom: 14px;
    margin-left: 6px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 4px;
    animation: errPop 0.25s ease;
  }
  @keyframes errPop {
    from { opacity: 0; transform: translateY(-5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .input-spacer { margin-bottom: 20px; }

  /* ── FOOTER ── */
  .form-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    margin-bottom: 22px;
  }

  .forgot-link {
    font-size: 12px; color: #00b4d8;
    text-decoration: none; font-weight: 500;
    transition: color 0.2s;
  }
  .forgot-link:hover { color: #03045E; }

  .login-btn {
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none;
    border-radius: 50px;
    padding: 12px 34px;
    font-size: 13px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(3,4,94,0.32);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
  }
  .login-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 50px;
  }
  .login-btn span { position: relative; z-index: 1; }
  .login-btn:hover::after { opacity: 1; }
  .login-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,180,216,0.42); }
  .login-btn:active { transform: translateY(0); }
  .login-btn.loading { pointer-events: none; }

  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 7px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider-row {
    width: 100%; display: flex;
    align-items: center; gap: 12px;
    margin-bottom: 18px;
  }
  .divider-line { flex: 1; height: 1px; background: #e9ecef; }
  .divider-text { font-size: 11px; color: #adb5bd; white-space: nowrap; font-weight: 500; }

  .social-row { display: flex; gap: 14px; }

  .social-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 20px;
    border: 1.5px solid #e9ecef;
    border-radius: 50px; background: white;
    cursor: pointer;
    font-size: 12.5px; font-weight: 600;
    font-family: 'Poppins', sans-serif;
    color: #495057;
    transition: all 0.25s ease;
    text-decoration: none;
  }
  .social-btn:hover {
    border-color: #00b4d8; color: #03045E;
    box-shadow: 0 4px 16px rgba(0,180,216,0.17);
    transform: translateY(-2px);
  }
  .social-icon { width: 16px; height: 16px; }

  /* ── PAGE TRANSITION ── */
  .login-page.fade-out {
    animation: fadeOut 0.4s ease forwards;
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  /* ── MOBILE RESPONSIVE ── */
  @media (max-width: 700px) {
    .login-page { align-items: flex-end; padding: 0; }

    .back-home {
      top: 14px;
      left: 14px;
      padding: 7px 13px 7px 10px;
      font-size: 11.5px;
    }

    .login-card {
      flex-direction: column;
      width: 100%;
      min-height: 100svh;
      border-radius: 0;
      box-shadow: none;
    }

    .left-panel {
      width: 100%;
      min-height: 230px;
      padding: 64px 32px 64px;
      align-items: center;
      text-align: center;
      border-radius: 0 0 52px 52px;
      justify-content: flex-end;
    }

    .left-tab {
      position: static;
      transform: none;
      flex-direction: row;
      margin-top: 20px;
      gap: 10px;
    }

    .tab-btn {
      width: 80px; height: 36px;
      border-radius: 20px;
    }
    .tab-text {
      writing-mode: horizontal-tb;
      transform: none;
      font-size: 10.5px;
    }
    .tab-btn.signup { border-radius: 20px; }
    .tab-btn.login-tab { border-radius: 20px; }

    .left-content { text-align: center; }
    .left-title { font-size: 32px; }

    .right-panel {
      flex: 1;
      padding: 36px 28px 40px;
      border-radius: 0;
      justify-content: flex-start;
    }

    .avatar-wrap {
      width: 68px; height: 68px;
      margin-top: -44px;
      margin-bottom: 12px;
      border: 4px solid white;
      box-shadow: 0 8px 24px rgba(3,4,94,0.22);
    }

    .form-title { font-size: 20px; margin-bottom: 20px; }
    .login-btn { width: 100%; justify-content: center; padding: 14px; }

    .form-footer {
      flex-direction: column;
      gap: 14px;
      align-items: stretch;
    }
    .forgot-link { text-align: right; }
    .social-row { flex-direction: column; gap: 10px; }
    .social-btn { justify-content: center; width: 100%; }
  }

  @media (max-width: 380px) {
    .right-panel { padding: 32px 20px 36px; }
  }
`;

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [leaving, setLeaving]   = useState(false);
  const [errors, setErrors]     = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const goToSignUp = () => {
    setLeaving(true);
    setTimeout(() => navigate("/register"), 420);
  };

  const goHome = () => {
    setLeaving(true);
    setTimeout(() => navigate("/"), 420);
  };

  const handleSubmit = async () => {
  const newErrors = { email: "", password: "" };
  if (!email)    newErrors.email    = "Please enter your email";
  if (!password) newErrors.password = "Please enter your password";

  if (newErrors.email || newErrors.password) {
    setErrors(newErrors);
    return;
  }

  setErrors({ email: "", password: "" });
  setLoading(true);

  // ── DEMO USERS ──
  const demoUsers = [
    { email: "admin@hack.com",      password: "admin123",  role: "admin" },
    { email: "university@hack.com", password: "univ123",   role: "university" },
    { email: "user@hack.com",       password: "user123",   role: "user" },
  ];

  setTimeout(() => {
    const found = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setLoading(false);
      setLeaving(true);
      setTimeout(() => {
        if (found.role === "admin")      navigate("/admin/dashboard");
        else if (found.role === "university") navigate("/university/dashboard");
        else navigate("/dashboard");
      }, 420);
    } else {
      setLoading(false);
     setErrors({ 
  email: "Invalid email!", 
  password: "Please check your password!" 
});
    }
  }, 1500);
};
  return (
    <>
      <style>{styles}</style>
      <div className={`login-page${leaving ? " fade-out" : ""}`}>
        <div className="login-bg" />
        <div className="login-bg-overlay" />

        {/* ── BACK TO HOME ── */}
        <button className="back-home" onClick={goHome}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Home
        </button>

        <div className="login-card">

          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div className="left-shape-1" />
            <div className="left-shape-2" />
            <div className="left-content">
              <p className="left-label">Welcome back</p>
              <h2 className="left-title">SIGN <span>IN</span></h2>
              <p className="left-subtitle">
                Access your hackathon<br />dashboard & submissions.
              </p>
            </div>

            <div className="left-tab">
              <button className="tab-btn signup" onClick={goToSignUp} title="Go to Sign Up">
                <span className="tab-text">SIGN UP</span>
              </button>
              <button className="tab-btn login-tab" title="Login">
                <span className="tab-text">LOGIN</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">

            {/* Normal Avatar SVG */}
            <div className="avatar-wrap">
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <h1 className="form-title">LOGIN</h1>

            {/* Email — autocomplete enabled */}
            <div className="input-group">
              <input
                className={`form-input${errors.email ? " input-error" : ""}`}
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder=" "
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
              />
              <label className="float-label" htmlFor="login-email">Email</label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {errors.email
              ? <p className="error-msg">⚠ {errors.email}</p>
              : <div className="input-spacer" />
            }

            {/* Password — autocomplete enabled */}
            <div className="input-group">
              <input
                className={`form-input${errors.password ? " input-error" : ""}`}
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder=" "
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                }}
              />
              <label className="float-label" htmlFor="login-password">Password</label>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            {errors.password
              ? <p className="error-msg">⚠ {errors.password}</p>
              : <div className="input-spacer" />
            }

            <div className="form-footer">
              <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
              <button
                className={`login-btn${loading ? " loading" : ""}`}
                onClick={handleSubmit}
              >
                {loading && <span className="spinner" />}
                <span>{loading ? "Signing in..." : "LOGIN"}</span>
              </button>
            </div>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">Or Login With</span>
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