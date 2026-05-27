import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .verify-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .verify-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/1200x/44/56/c2/4456c2cf3368f38400f6fe14a0f4d7eb.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.35) saturate(1.2);
    z-index: 0;
  }

  .verify-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(3,4,94,0.82) 0%, rgba(0,119,182,0.55) 50%, rgba(3,4,94,0.75) 100%);
    z-index: 1;
  }

  .back-home {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px 8px 12px;
    color: white;
    text-decoration: none;
    font-size: 12.5px;
    font-weight: 600;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    background: none;
    border: none;
    transition: transform 0.2s;
  }
  .back-home:hover { transform: translateX(-2px); }
  .back-home svg { width: 15px; height: 15px; transition: transform 0.2s; }
  .back-home:hover svg { transform: translateX(-2px); }

  .verify-card {
    display: flex;
    width: min(720px, 96vw);
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

  .right-panel {
    flex: 1;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 36px;
  }

  .avatar-wrap {
    width: 72px; height: 72px;
    background: linear-gradient(135deg, #03045E, #0077b6);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 10px 28px rgba(3,4,94,0.28);
  }
  .avatar-icon { width: 34px; height: 34px; color: white; }

  .form-title {
    font-family: 'Nunito', sans-serif;
    font-size: 20px; font-weight: 900;
    color: #03045E; letter-spacing: 0.13em;
    text-transform: uppercase; margin-bottom: 8px;
    text-align: center;
  }
  .form-subtitle {
    font-size: 11px;
    color: #90a4b5;
    margin-bottom: 24px;
    text-align: center;
    line-height: 1.5;
  }
  .form-subtitle strong { color: #03045E; }

  /* OTP Inputs */
  .otp-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    width: 100%;
    margin-bottom: 12px;
  }
  
  .otp-input {
    width: 44px;
    height: 48px;
    border: 2px solid #e0f4fa;
    border-radius: 12px;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    color: #03045E;
    background: #f8fdff;
    outline: none;
    transition: all 0.25s;
  }
  .otp-input:focus {
    border-color: #00b4d8;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.10);
  }
  .otp-input.input-error {
    border-color: #e63946;
    background: #fff8f8;
  }

  .error-msg {
    font-size: 11px;
    color: #e63946;
    margin-top: 4px;
    margin-bottom: 16px;
    font-weight: 500;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
  }

  .verify-btn {
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none;
    border-radius: 50px;
    width: 100%;
    padding: 12px;
    font-size: 13px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(3,4,94,0.32);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
  }
  .verify-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 50px;
  }
  .verify-btn span { position: relative; z-index: 1; }
  .verify-btn:hover::after { opacity: 1; }
  .verify-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,180,216,0.42); }
  .verify-btn:active { transform: translateY(0); }
  .verify-btn:disabled { opacity: 0.6; pointer-events: none; }

  .resend-row {
    margin-top: 18px;
    font-size: 11.5px;
    color: #6c757d;
  }
  .resend-link {
    color: #00b4d8;
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: color 0.2s;
  }
  .resend-link:hover { color: #03045E; }
  .resend-link:disabled { opacity: 0.5; cursor: default; }

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

  @media (max-width: 700px) {
    .verify-card { flex-direction: column; width: 100vw; height: 100svh; border-radius: 0; }
    .left-panel { width: 100%; min-height: 180px; padding: 40px 24px; text-align: center; justify-content: center; align-items: center; border-radius: 0 0 32px 32px; }
    .left-title { font-size: 24px; }
    .right-panel { flex: 1; padding: 24px 20px; justify-content: flex-start; }
    .avatar-wrap { width: 56px; height: 56px; margin-top: -36px; border: 3px solid white; }
    .avatar-icon { width: 26px; height: 26px; }
  }
`;

export default function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const email = state?.email || localStorage.getItem("pendingVerifyEmail") || "";

  // Set pending email in local storage as fallback
  useEffect(() => {
    if (state?.email) {
      localStorage.setItem("pendingVerifyEmail", state.email);
    }
  }, [state?.email]);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      setErrorMsg("");
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setErrorMsg("Please enter all 6 digits of the verification code");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      await authService.verifyAccount({ email, otp: fullOtp });
      alert("Email verified successfully! You can now log in.");
      localStorage.removeItem("pendingVerifyEmail");
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert("No email address found to resend verification code.");
      return;
    }

    try {
      setResending(true);
      setErrorMsg("");
      await authService.resendVerification({ email });
      alert("A new verification code has been sent to your email!");
      setResendTimer(60); // 60 seconds cooldown
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="verify-page">
        <div className="verify-bg" />
        <div className="verify-bg-overlay" />

        <button className="back-home" onClick={() => navigate("/")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Home
        </button>

        <div className="verify-card">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="left-content">
              <p className="left-label">Security Check</p>
              <h2 className="left-title">VERIFY <span>EMAIL</span></h2>
              <p className="left-subtitle">Please confirm your identity to<br />activate your Athenian account.</p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="avatar-wrap">
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>

            <h1 className="form-title">ENTER CODE</h1>
            <p className="form-subtitle">We have sent a 6-digit OTP code to <strong>{email || "your registered email"}</strong>.</p>

            <div className="otp-row">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength="1"
                  className={`otp-input${errorMsg ? " input-error" : ""}`}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>

            {errorMsg ? (
              <p className="error-msg">⚠ {errorMsg}</p>
            ) : (
              <div style={{ minHeight: 33 }} />
            )}

            <button className="verify-btn" onClick={handleVerify} disabled={loading}>
              {loading && <span className="spinner" />}
              <span>{loading ? "Verifying..." : "Verify OTP"}</span>
            </button>

            <div className="resend-row">
              Didn't receive the code?{" "}
              {resendTimer > 0 ? (
                <span>Resend in <strong>{resendTimer}s</strong></span>
              ) : (
                <button className="resend-link" onClick={handleResend} disabled={resending}>
                  {resending ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
