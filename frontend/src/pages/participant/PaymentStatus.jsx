import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .ps-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .ps-bg {
    position: absolute; inset: 0;
    background-image: url('https://i.pinimg.com/1200x/65/ef/14/65ef14181934587f4dc7350bd9121792.jpg');
    background-size: cover;
    background-position: center;
    filter: brightness(0.35) saturate(1.2);
    z-index: 0;
  }

  .ps-bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(3,4,94,0.82) 0%, rgba(0,119,182,0.55) 50%, rgba(3,4,94,0.75) 100%);
    z-index: 1;
  }

  .ps-card {
    display: flex;
    width: 780px;
    min-height: 500px;
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

  /* LEFT PANEL */
  .ps-left {
    width: 260px;
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

  .ps-left::before {
    content: '';
    position: absolute;
    width: 280px; height: 280px;
    background: rgba(144,224,239,0.10);
    bottom: -90px; left: -90px;
    transform: rotate(45deg);
    border-radius: 36px;
  }
  .ps-left::after {
    content: '';
    position: absolute;
    width: 210px; height: 210px;
    background: rgba(0,180,216,0.13);
    top: -65px; right: -65px;
    transform: rotate(45deg);
    border-radius: 28px;
  }
  .ps-left-shape1 {
    position: absolute;
    width: 170px; height: 170px;
    background: rgba(144,224,239,0.07);
    top: 45px; left: -45px;
    transform: rotate(45deg);
    border-radius: 22px;
  }
  .ps-left-shape2 {
    position: absolute;
    width: 130px; height: 130px;
    background: rgba(0,180,216,0.09);
    bottom: 45px; right: -25px;
    transform: rotate(45deg);
    border-radius: 18px;
  }

  .ps-left-content { position: relative; z-index: 3; width: 100%; }

  .ps-left-label {
    font-size: 11px; font-weight: 700;
    color: #90e0ef; letter-spacing: 0.18em;
    text-transform: uppercase; margin-bottom: 8px;
    font-family: 'Nunito', sans-serif;
  }
  .ps-left-title {
    font-size: 26px; font-weight: 900;
    color: white; line-height: 1.15;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  .ps-left-title span { color: #90e0ef; }
  .ps-left-sub {
    font-size: 11px;
    color: rgba(144,224,239,0.6);
    line-height: 1.6;
    margin-bottom: 22px;
  }

  .ps-divider {
    width: 40px; height: 2px;
    background: rgba(144,224,239,0.4);
    border-radius: 2px;
    margin-bottom: 20px;
  }

  /* RECEIPT CARD */
  .receipt-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(144,224,239,0.18);
    border-radius: 14px;
    padding: 16px;
  }
  .receipt-title {
    font-size: 10px; font-weight: 700;
    color: rgba(144,224,239,0.7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-family: 'Nunito', sans-serif;
  }
  .receipt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .receipt-row:last-child { margin-bottom: 0; }
  .receipt-key {
    font-size: 11px; color: rgba(144,224,239,0.6);
    font-family: 'Poppins', sans-serif;
  }
  .receipt-val {
    font-size: 11px; color: rgba(255,255,255,0.9);
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    text-align: right;
    max-width: 110px;
  }
  .receipt-divider {
    height: 1px;
    background: rgba(144,224,239,0.12);
    margin: 10px 0;
  }
  .receipt-total-key {
    font-size: 12px; color: #90e0ef;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
  }
  .receipt-total-val {
    font-size: 15px; color: #fff;
    font-weight: 900;
    font-family: 'Nunito', sans-serif;
  }

  /* RIGHT PANEL */
  .ps-right {
    flex: 1;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 44px;
  }

  /* SUCCESS ICON */
  .status-icon-wrap {
    width: 90px; height: 90px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 22px;
    animation: iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }
  @keyframes iconPop {
    from { transform: scale(0.3); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .status-icon-wrap.success {
    background: linear-gradient(135deg, #00b894, #00cec9);
    box-shadow: 0 12px 32px rgba(0,184,148,0.35);
  }
  .status-icon-wrap.failed {
    background: linear-gradient(135deg, #e63946, #c1121f);
    box-shadow: 0 12px 32px rgba(230,57,70,0.35);
  }
  .status-icon-wrap svg {
    width: 44px; height: 44px;
    color: white;
  }

  /* CHECKMARK ANIMATION */
  .check-circle {
    animation: iconPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }
  .check-path {
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
    animation: drawCheck 0.5s ease 0.9s forwards;
  }
  @keyframes drawCheck {
    to { stroke-dashoffset: 0; }
  }

  .status-title {
    font-size: 26px; font-weight: 900;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
    text-align: center;
  }
  .status-title.success { color: #00b894; }
  .status-title.failed  { color: #e63946; }

  .status-msg {
    font-size: 13px; color: #78909c;
    font-family: 'Poppins', sans-serif;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 28px;
    max-width: 320px;
  }

  /* TRANSACTION ID BOX */
  .txn-box {
    background: #f8fdff;
    border: 1.5px solid #e0f4fa;
    border-radius: 10px;
    padding: 10px 18px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 340px;
  }
  .txn-box svg { width: 16px; height: 16px; color: #00b4d8; flex-shrink: 0; }
  .txn-label {
    font-size: 10px; color: #90a4ae;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .txn-id {
    font-size: 12.5px; color: #03045E;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    letter-spacing: 0.06em;
  }

  /* BUTTONS */
  .ps-btn-primary {
    width: 100%;
    max-width: 340px;
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none;
    border-radius: 50px;
    padding: 14px 34px;
    font-size: 13px; font-weight: 800;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(3,4,94,0.28);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
    margin-bottom: 12px;
  }
  .ps-btn-primary::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 50px;
  }
  .ps-btn-primary span { position: relative; z-index: 1; }
  .ps-btn-primary svg { width: 16px; height: 16px; position: relative; z-index: 1; }
  .ps-btn-primary:hover::after { opacity: 1; }
  .ps-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,180,216,0.35); }

  .ps-btn-secondary {
    width: 100%;
    max-width: 340px;
    background: transparent;
    color: #03045E;
    border: 2px solid #e0f4fa;
    border-radius: 50px;
    padding: 12px 34px;
    font-size: 12.5px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
    margin-bottom: 12px;
  }
  .ps-btn-secondary svg { width: 15px; height: 15px; }
  .ps-btn-secondary:hover {
    border-color: #00b4d8;
    color: #0096c7;
    background: #f0fbff;
  }

  /* CONFETTI DOTS (success only) */
  .confetti-wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }
  .confetti-dot {
    position: absolute;
    width: 8px; height: 8px;
    border-radius: 50%;
    animation: confettiFall linear forwards;
    opacity: 0;
  }
  @keyframes confettiFall {
    0%   { opacity: 1; transform: translateY(-20px) rotate(0deg); }
    100% { opacity: 0; transform: translateY(300px) rotate(720deg); }
  }

  /* PAGE TRANSITION */
  .ps-page.fade-out {
    animation: fadeOut 0.4s ease forwards;
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  /* MOBILE */
 /* MOBILE */
  @media (max-width: 760px) {
    .ps-page { align-items: flex-start; padding: 0; }
    .ps-card {
      flex-direction: column; width: 100%;
      min-height: 100svh; border-radius: 0;
    }
    .ps-left {
      width: 100%;
      padding: 40px 22px 24px;
      border-radius: 0 0 36px 36px;
      align-items: center;
      text-align: center;
    }
    .ps-left-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .ps-left-label { font-size: 10px; margin-bottom: 5px; }
    .ps-left-title { font-size: 20px; margin-bottom: 4px; }
    .ps-left-sub { font-size: 10px; margin-bottom: 12px; }
    .ps-divider { margin: 0 auto 12px; }
    .receipt-card { padding: 12px; text-align: left; }
    .receipt-title { margin-bottom: 8px; }
    .receipt-row { margin-bottom: 5px; }
    .receipt-key, .receipt-val { font-size: 10px; }
    .receipt-total-key { font-size: 11px; }
    .receipt-total-val { font-size: 13px; }

    .ps-right {
      flex: 1;
      padding: 20px 20px 24px;
      justify-content: center;
    }
    .status-icon-wrap {
      width: 64px; height: 64px;
      margin-bottom: 12px;
    }
    .status-icon-wrap svg { width: 30px; height: 30px; }
    .status-title { font-size: 18px; margin-bottom: 6px; }
    .status-msg {
      font-size: 11.5px;
      margin-bottom: 14px;
      max-width: 100%;
    }
    .txn-box {
      max-width: 100%;
      padding: 8px 12px;
      margin-bottom: 14px;
    }
    .txn-label { font-size: 9px; }
    .txn-id { font-size: 11px; }
    .ps-btn-primary {
      max-width: 100%;
      padding: 12px;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .ps-btn-secondary {
      max-width: 100%;
      padding: 10px;
      font-size: 11.5px;
      margin-bottom: 8px;
    }
  }

  @media (max-width: 380px) {
    .ps-left { padding: 32px 16px 20px; }
    .ps-left-title { font-size: 18px; }
    .ps-right { padding: 16px 16px 20px; }
    .status-icon-wrap { width: 54px; height: 54px; }
    .status-title { font-size: 16px; }
    .status-msg { font-size: 11px; }
  }
`;

// Random transaction ID generator
const genTxnId = () => "TXN" + Math.random().toString(36).substr(2,9).toUpperCase();

// Confetti colors
const CONFETTI_COLORS = ["#00b4d8","#0096c7","#90e0ef","#03045E","#00b894","#fdcb6e"];

export default function PaymentStatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const status   = location.state?.status || "success"; // success | failed
  const hackathon = location.state?.hackathon || {
    name: "TechBurst 2025",
    mode: "Team",
    fee: 499,
    teamName: "Code Ninjas",
    deadline: "30 Jan 2025",
  };

  const [leaving, setLeaving] = useState(false);
  const txnId = genTxnId();

  const isSuccess = status === "success";

  const goToDashboard = () => {
    setLeaving(true);
    setTimeout(() => navigate("/dashboard"), 420);
  };

  const goToHackathons = () => {
    setLeaving(true);
    setTimeout(() => navigate("/hackathons"), 420);
  };

  const retryPayment = () => {
    setLeaving(true);
    setTimeout(() => navigate(-1), 420);
  };

  // Confetti dots — only on success
  const confettiDots = isSuccess
    ? Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 1.2,
        duration: 1.8 + Math.random() * 1.2,
        size: 5 + Math.random() * 7,
      }))
    : [];

  return (
    <>
      <style>{styles}</style>
      <div className={`ps-page${leaving ? " fade-out" : ""}`}>
        <div className="ps-bg" />
        <div className="ps-bg-overlay" />

        {/* Confetti — success only */}
        {isSuccess && (
          <div className="confetti-wrap">
            {confettiDots.map(d => (
              <div
                key={d.id}
                className="confetti-dot"
                style={{
                  left: `${d.left}%`,
                  top: "10%",
                  width: `${d.size}px`,
                  height: `${d.size}px`,
                  background: d.color,
                  animationDelay: `${d.delay}s`,
                  animationDuration: `${d.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="ps-card">

          {/* LEFT PANEL */}
          <div className="ps-left">
            <div className="ps-left-shape1" />
            <div className="ps-left-shape2" />
            <div className="ps-left-content">

              <p className="ps-left-label">
                {isSuccess ? "Registration Complete" : "Payment Failed"}
              </p>
              <h2 className="ps-left-title">
                {isSuccess
                  ? <><span>Success!</span><br />You're In </>
                  : <>Payment<br /><span>Failed</span></>
                }
              </h2>
              <div className="ps-divider" />
              <p className="ps-left-sub">
                {isSuccess
                  ? "Your registration is confirmed. Get ready to hack!"
                  : "Something went wrong. Please try again."
                }
              </p>

              {/* Receipt */}
              <div className="receipt-card">
                <p className="receipt-title">Receipt</p>

                <div className="receipt-row">
                  <span className="receipt-key">Hackathon</span>
                  <span className="receipt-val">{hackathon.name}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Mode</span>
                  <span className="receipt-val">{hackathon.mode}</span>
                </div>
                {hackathon.teamName && (
                  <div className="receipt-row">
                    <span className="receipt-key">Team</span>
                    <span className="receipt-val">{hackathon.teamName}</span>
                  </div>
                )}
                <div className="receipt-divider" />
                <div className="receipt-row">
                  <span className="receipt-total-key">
                    {isSuccess ? "Paid" : "Amount"}
                  </span>
                  <span className="receipt-total-val">₹{hackathon.fee}</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="ps-right">

            {/* Status Icon */}
            <div className={`status-icon-wrap ${isSuccess ? "success" : "failed"}`}>
              {isSuccess ? (
                // Animated checkmark SVG
                <svg viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" className="check-circle" />
                  <path d="M7 13l3 3 7-7" className="check-path" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h1 className={`status-title ${isSuccess ? "success" : "failed"}`}>
              {isSuccess ? "Payment Successful!" : "Payment Failed!"}
            </h1>

            {/* Message */}
            <p className="status-msg">
              {isSuccess
                ? `You have successfully registered for ${hackathon.name}. Check your dashboard for details and upcoming updates!`
                : "Your payment could not be processed. Please check your details and try again, or use a different payment method."
              }
            </p>

            {/* Transaction ID — success only */}
            {isSuccess && (
              <div className="txn-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <div>
                  <p className="txn-label">Transaction ID</p>
                  <p className="txn-id">{txnId}</p>
                </div>
              </div>
            )}

            {/* Buttons — Success */}
            {isSuccess && (
              <>
                <button className="ps-btn-primary" onClick={goToDashboard}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  <span>Go to Dashboard</span>
                </button>

                <button className="ps-btn-secondary" onClick={goToHackathons}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <span>Browse More Hackathons</span>
                </button>
              </>
            )}

            {/* Buttons — Failed */}
            {!isSuccess && (
              <>
                <button className="ps-btn-primary" onClick={retryPayment}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
                  </svg>
                  <span>Retry Payment</span>
                </button>

                <button className="ps-btn-secondary" onClick={goToHackathons}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  <span>Back to Hackathons</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}