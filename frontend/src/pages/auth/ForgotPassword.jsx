import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

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

  .fp-left {
    width: 270px; flex-shrink: 0;
    background: linear-gradient(160deg, #0096c7 0%, #03045E 60%, #023e8a 100%);
    position: relative;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: center;
    padding: 48px 28px 40px;
    overflow: hidden; gap: 28px;
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

  .fp-right {
    flex: 1; background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 44px 50px 38px;
    position: relative;
  }

  .step-dots { display: flex; gap: 6px; margin-bottom: 22px; }
  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #e0f4fa; transition: all 0.35s ease;
  }
  .dot.active {
    width: 24px; border-radius: 4px;
    background: linear-gradient(90deg, #03045E, #00b4d8);
  }

  .fp-icon-wrap {
    width: 74px; height: 74px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    background: linear-gradient(135deg, #03045E, #0096c7);
    box-shadow: 0 10px 28px rgba(3,4,94,0.30);
  }
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

  .fp-field { width: 100%; margin-bottom: 4px; }
  .fp-input-group { width: 100%; position: relative; }

  .fp-input {
    width: 100%;
    border: 2px solid #e0f4fa; border-radius: 12px;
    padding: 20px 14px 7px 44px;
    font-size: 13.5px; font-family: 'Poppins', sans-serif;
    color: #03045E; background: #f8fdff; outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  }
  .fp-input:focus { border-color: #00b4d8; background: #fff; box-shadow: 0 0 0 4px rgba(0,180,216,0.10); }
  .fp-input.err   { border-color: #e63946; background: #fff8f8; box-shadow: 0 0 0 3px rgba(230,57,70,0.08); }

  .fp-float-label {
    position: absolute;
    left: 44px; top: 50%; transform: translateY(-50%);
    font-size: 13px; color: #adb5bd;
    font-family: 'Poppins', sans-serif;
    transition: all 0.22s;
  }
  .fp-input:focus + .fp-float-label,
  .fp-input:not(:placeholder-shown) + .fp-float-label {
    top: 7px; transform: none; font-size: 9.5px;
    color: #00b4d8; font-weight: 700;
  }

  .otp-row { display: flex; gap: 10px; margin-bottom: 20px; justify-content: center; width: 100%; }
  .otp-box { width: 45px; height: 55px; border: 2px solid #e0f4fa; border-radius: 12px; font-size: 22px; font-weight: 700; text-align: center; color: #03045E; background: #f8fdff; outline: none; transition: all 0.3s; font-family: 'Poppins', sans-serif; }
  .otp-box:focus { border-color: #00b4d8; background: #fff; box-shadow: 0 0 0 4px rgba(0,180,216,0.10); }

  .fp-btn {
    width: 100%;
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none; border-radius: 50px;
    padding: 13px 34px;
    font-size: 13px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 22px rgba(3,4,94,0.32);
    margin-top: 10px;
  }
  .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const OTP_LENGTH = 6;

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleStep1 = async () => {
    if (!email.trim()) { setErrors({ email: "Email required" }); return; }
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setStep(2);
    } catch (err) {
      setErrors({ email: "Could not send reset code" });
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (otp.some(d => !d)) { setErrors({ otp: "Enter full code" }); return; }
    setStep(3);
  };

  const handleStep3 = async () => {
    if (newPw !== confirmPw) { setErrors({ confirmPw: "Passwords do not match" }); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ email, otp: otp.join(""), newPassword: newPw });
      setStep(4);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setErrors({ newPw: "Password reset failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fp-page">
        <div className="fp-bg"/>
        <div className="fp-bg-overlay"/>
        <div className="fp-card">
          <div className="fp-left">
            <div className="fp-left-content">
               <h2 className="fp-left-title">RESET YOUR<br/><span>PASSWORD</span></h2>
            </div>
          </div>
          <div className="fp-right">
            {step === 1 && (
              <>
                <h1 className="fp-title">FORGOT PASSWORD</h1>
                <input className="fp-input" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="fp-float-label">Email Address</label>
                <button className="fp-btn" onClick={handleStep1}>{loading ? "Sending..." : "SEND CODE"}</button>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="fp-title">VERIFY CODE</h1>
                <div className="otp-row">
                    {otp.map((d, i) => <input key={i} className="otp-box" value={d} onChange={(e) => {
                        const next = [...otp]; next[i] = e.target.value.slice(-1); setOtp(next);
                    }} />)}
                </div>
                <button className="fp-btn" onClick={handleStep2}>VERIFY</button>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="fp-title">NEW PASSWORD</h1>
                <input className="fp-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                <input className="fp-input" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                <button className="fp-btn" onClick={handleStep3}>RESET</button>
              </>
            )}
            {step === 4 && (
              <>
                <h1 className="fp-title">SUCCESS!</h1>
                <p className="fp-subtitle">Your password has been successfully reset.</p>
                <button className="fp-btn" onClick={() => navigate("/login")}>GO TO LOGIN</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
