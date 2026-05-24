import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .payment-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .payment-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/1200x/67/8c/09/678c09482a3b64d395923888450b8ecd.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.35) saturate(1.2);
    z-index: 0;
  }

  .payment-bg-overlay {
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
    background: none;
    border: none;
    font-size: 12.5px;
    font-weight: 600;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .back-home:hover { transform: translateX(-3px); }
  .back-home svg { width: 15px; height: 15px; transition: transform 0.2s; }
  .back-home:hover svg { transform: translateX(-2px); }

  .payment-card {
    display: flex;
    width: 780px;
    min-height: 520px;
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
  .pay-left {
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

  .pay-left::before {
    content: '';
    position: absolute;
    width: 280px; height: 280px;
    background: rgba(144,224,239,0.10);
    bottom: -90px; left: -90px;
    transform: rotate(45deg);
    border-radius: 36px;
  }
  .pay-left::after {
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

  .pay-left-content { position: relative; z-index: 3; width: 100%; }

  .pay-left-icon {
    width: 56px; height: 56px;
    background: rgba(144,224,239,0.15);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    border: 1px solid rgba(144,224,239,0.25);
  }
  .pay-left-icon svg { width: 28px; height: 28px; color: #90e0ef; }

  .pay-left-label {
    font-size: 11px; font-weight: 700;
    color: #90e0ef; letter-spacing: 0.18em;
    text-transform: uppercase; margin-bottom: 8px;
    font-family: 'Nunito', sans-serif;
  }
  .pay-left-title {
    font-size: 26px; font-weight: 900;
    color: white; line-height: 1.15;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.02em;
    margin-bottom: 14px;
  }
  .pay-left-title span { color: #90e0ef; }

  .pay-divider {
    width: 40px; height: 2px;
    background: rgba(144,224,239,0.4);
    border-radius: 2px;
    margin-bottom: 18px;
  }

  /* ORDER SUMMARY CARD */
  .order-summary {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(144,224,239,0.18);
    border-radius: 14px;
    padding: 16px;
    margin-top: 4px;
  }
  .order-summary-title {
    font-size: 10px; font-weight: 700;
    color: rgba(144,224,239,0.7);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-family: 'Nunito', sans-serif;
  }
  .order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .order-row:last-child { margin-bottom: 0; }
  .order-key {
    font-size: 11px; color: rgba(144,224,239,0.6);
    font-family: 'Poppins', sans-serif;
  }
  .order-val {
    font-size: 11px; color: rgba(255,255,255,0.9);
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  }
  .order-divider-line {
    height: 1px;
    background: rgba(144,224,239,0.12);
    margin: 10px 0;
  }
  .order-total-key {
    font-size: 12px; color: #90e0ef;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
  }
  .order-total-val {
    font-size: 15px; color: #fff;
    font-weight: 900;
    font-family: 'Nunito', sans-serif;
  }

  /* SECURE BADGE */
  .secure-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 18px;
  }
  .secure-badge svg { width: 13px; height: 13px; color: rgba(144,224,239,0.55); }
  .secure-badge span {
    font-size: 10px;
    color: rgba(144,224,239,0.55);
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
  }

  /* RIGHT PANEL */
  .pay-right {
    flex: 1;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 42px 44px;
    overflow-y: auto;
  }

  .pay-right-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
  }
  .pay-avatar {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, #03045E, #0077b6);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(3,4,94,0.22);
    flex-shrink: 0;
    animation: avatarPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }
  @keyframes avatarPop {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .pay-avatar svg { width: 24px; height: 24px; color: white; }
  .pay-right-title {
    font-size: 22px; font-weight: 900;
    color: #03045E; letter-spacing: 0.10em;
    text-transform: uppercase;
    font-family: 'Nunito', sans-serif;
  }
  .pay-right-sub {
    font-size: 11.5px; color: #90a4ae;
    font-family: 'Poppins', sans-serif;
    margin-top: 2px;
  }

  /* SECTION LABEL */
  .section-label {
    font-size: 10.5px; font-weight: 700;
    color: #00b4d8; letter-spacing: 0.14em;
    text-transform: uppercase;
    font-family: 'Nunito', sans-serif;
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .section-label::after {
    content: '';
    flex: 1; height: 1px;
    background: #e0f4fa;
  }

  /* INPUT GROUP */
  .input-group {
    width: 100%;
    position: relative;
    margin-bottom: 6px;
  }
  .input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    width: 17px; height: 17px;
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
    font-size: 13.5px;
    font-family: 'Poppins', sans-serif;
    color: #03045E;
    background: #f8fdff;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .form-input:focus {
    border-color: #00b4d8;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(0,180,216,0.10);
  }
  .form-input.input-error {
    border-color: #e63946;
    background: #fff8f8;
  }
  .form-input:focus + .float-label,
  .form-input:not(:placeholder-shown) + .float-label {
    top: 8px; transform: none;
    font-size: 10px; color: #00b4d8;
    font-weight: 700; letter-spacing: 0.08em;
  }
  .form-input.input-error + .float-label { color: #e63946 !important; }
  .form-input:focus ~ .input-icon { color: #00b4d8; }
  .float-label {
    position: absolute;
    left: 42px; top: 50%;
    transform: translateY(-50%);
    font-size: 13px; color: #adb5bd;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    pointer-events: none;
    transition: top 0.22s, transform 0.22s, font-size 0.22s, color 0.22s;
  }

  .input-row {
    display: flex; gap: 12px;
  }
  .input-row .input-group { flex: 1; }

  .input-spacer { margin-bottom: 16px; }
  .error-msg {
    font-size: 10.5px; color: #e63946;
    margin-top: 4px; margin-bottom: 12px;
    margin-left: 6px; font-weight: 500;
    font-family: 'Poppins', sans-serif;
    display: flex; align-items: center; gap: 4px;
    animation: errPop 0.25s ease;
  }
  @keyframes errPop {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* CARD VISUAL */
  .card-visual {
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    min-height: 78px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: cardSlide 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }
  @keyframes cardSlide {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-visual::before {
    content: '';
    position: absolute;
    width: 160px; height: 160px;
    background: rgba(144,224,239,0.08);
    top: -50px; right: -40px;
    transform: rotate(45deg);
    border-radius: 20px;
  }
  .card-chip {
    width: 30px; height: 22px;
    background: linear-gradient(135deg, #f0c040, #d4a017);
    border-radius: 5px;
    margin-bottom: 10px;
    position: relative; z-index: 1;
  }
  .card-chip::after {
    content: '';
    position: absolute;
    left: 50%; top: 0;
    transform: translateX(-50%);
    width: 1.5px; height: 100%;
    background: rgba(0,0,0,0.15);
  }
  .card-number-preview {
    font-size: 13px; color: rgba(255,255,255,0.9);
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    letter-spacing: 0.22em;
    position: relative; z-index: 1;
  }
  .card-visual-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative; z-index: 1;
  }
  .card-holder-label {
    font-size: 9px; color: rgba(144,224,239,0.65);
    text-transform: uppercase; letter-spacing: 0.12em;
    font-family: 'Poppins', sans-serif;
  }
  .card-holder-name {
    font-size: 11.5px; color: white;
    font-family: 'Nunito', sans-serif;
    font-weight: 700; letter-spacing: 0.06em;
    margin-top: 1px;
  }
  .card-logo {
    display: flex; gap: -6px;
  }
  .card-logo-circle {
    width: 26px; height: 26px;
    border-radius: 50%;
  }
  .card-logo-circle:first-child {
    background: #eb001b;
    margin-right: -8px;
  }
  .card-logo-circle:last-child {
    background: #f79e1b;
    opacity: 0.9;
  }

  /* PAY BUTTON */
  .pay-btn {
    width: 100%;
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none;
    border-radius: 50px;
    padding: 15px 34px;
    font-size: 13.5px; font-weight: 800;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(3,4,94,0.32);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    display: flex; align-items: center;
    justify-content: center; gap: 10px;
    margin-top: 6px;
  }
  .pay-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 50px;
  }
  .pay-btn span { position: relative; z-index: 1; }
  .pay-btn svg { width: 18px; height: 18px; position: relative; z-index: 1; }
  .pay-btn:hover::after { opacity: 1; }
  .pay-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,180,216,0.38); }
  .pay-btn:active { transform: translateY(0); }
  .pay-btn.loading { pointer-events: none; }

  .spinner {
    display: inline-block;
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    position: relative; z-index: 1;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* PAYMENT METHODS ROW */
  .methods-row {
    display: flex; gap: 8px;
    margin-bottom: 18px;
  }
  .method-btn {
    flex: 1;
    border: 2px solid #e0f4fa;
    border-radius: 10px;
    background: #f8fdff;
    padding: 8px 6px;
    display: flex; align-items: center;
    justify-content: center; gap: 6px;
    cursor: pointer;
    font-size: 11.5px; font-weight: 600;
    font-family: 'Poppins', sans-serif;
    color: #546e7a;
    transition: all 0.25s;
  }
  .method-btn svg { width: 16px; height: 16px; }
  .method-btn.active {
    border-color: #00b4d8;
    background: #e0f7fb;
    color: #03045E;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.12);
  }
  .method-btn:hover:not(.active) {
    border-color: #b2ebf2;
    background: #f0fbff;
  }

  /* UPI input */
  .upi-section {
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* TRUST ROW */
  .trust-row {
    display: flex; align-items: center;
    justify-content: center; gap: 16px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #f0f0f0;
  }
  .trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 10.5px; color: #90a4ae;
    font-family: 'Poppins', sans-serif;
  }
  .trust-item svg { width: 13px; height: 13px; color: #00b4d8; }

  /* PAGE TRANSITION */
  .payment-page.fade-out {
    animation: fadeOut 0.4s ease forwards;
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

 /* MOBILE */
  @media (max-width: 760px) {
    .payment-page { align-items: flex-end; padding: 0; }
    .payment-card {
      flex-direction: column; width: 100%;
      min-height: 100svh; border-radius: 0;
    }
    .pay-left {
      width: 100%; min-height: 200px;
      padding: 60px 28px 36px;
      border-radius: 0 0 44px 44px;
      align-items: center;
      text-align: center;
    }
    .pay-left-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .pay-left-icon {
      margin-left: auto;
      margin-right: auto;
    }
    .pay-left-title {
      font-size: 28px;
    }
    .pay-divider {
      margin-left: auto;
      margin-right: auto;
    }
    .order-summary {
      width: 100%;
      text-align: left;
    }
    .secure-badge {
      justify-content: center;
    }
    .pay-right { padding: 28px 22px 36px; }
    .input-row { flex-direction: column; gap: 0; }
    .pay-btn { padding: 16px; }
    .methods-row { flex-wrap: wrap; }
    .method-btn { min-width: calc(50% - 4px); }
  }
`;

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hackathon info (normally from route state/props)
  const hackathon = location.state?.hackathon || {
    name: "TechBurst 2025",
    mode: "Team",
    fee: 499,
    deadline: "30 Jan 2025",
    teamName: "Code Ninjas",
  };

  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("card"); // card | upi | netbanking

  const [card, setCard] = useState({
    number: "", name: "", expiry: "", cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState({});

 const goBack = () => {
    setLeaving(true);
    setTimeout(() => navigate(-1), 420);
};

  // Format card number with spaces
  const formatCardNumber = (val) => {
    return val.replace(/\D/g, "").slice(0, 16)
      .replace(/(.{4})/g, "$1 ").trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + "/" + v.slice(2);
    return v;
  };

  const validate = () => {
    const e = {};
    if (method === "card") {
      const raw = card.number.replace(/\s/g, "");
      if (!raw || raw.length < 16) e.number = "Enter valid 16-digit card number";
      if (!card.name.trim()) e.name = "Cardholder name required";
      if (!card.expiry || card.expiry.length < 5) e.expiry = "Enter valid expiry (MM/YY)";
      if (!card.cvv || card.cvv.length < 3) e.cvv = "Enter valid CVV";
    } else if (method === "upi") {
      if (!upiId.includes("@")) e.upiId = "Enter valid UPI ID (eg: name@upi)";
    }
    return e;
  };

  const handlePay = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setLeaving(true);
      setTimeout(() => navigate("/payment/status", {
        state: { status: "success", hackathon }
      }), 420);
    }, 2200);
  };

  const cardPreview = card.number
    ? card.number.padEnd(19, " ").slice(0, 19)
    : "•••• •••• •••• ••••";

  return (
    <>
      <style>{styles}</style>
      <div className={`payment-page${leaving ? " fade-out" : ""}`}>
        <div className="payment-bg" />
        <div className="payment-bg-overlay" />

        {/* Back Button */}
        <button className="back-home" onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        <div className="payment-card">

          {/* LEFT PANEL */}
          <div className="pay-left">
            <div className="left-shape-1" />
            <div className="left-shape-2" />
            <div className="pay-left-content">

              <div className="pay-left-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>

              <p className="pay-left-label">Secure Checkout</p>
              <h2 className="pay-left-title">Complete <span>Payment</span></h2>
              <div className="pay-divider" />

              {/* Order Summary */}
              <div className="order-summary">
                <p className="order-summary-title">Order Summary</p>

                <div className="order-row">
                  <span className="order-key">Hackathon</span>
                  <span className="order-val" style={{maxWidth:"100px",textAlign:"right",fontSize:"10.5px"}}>
                    {hackathon.name}
                  </span>
                </div>
                <div className="order-row">
                  <span className="order-key">Mode</span>
                  <span className="order-val">{hackathon.mode}</span>
                </div>
                {hackathon.teamName && (
                  <div className="order-row">
                    <span className="order-key">Team</span>
                    <span className="order-val">{hackathon.teamName}</span>
                  </div>
                )}
                <div className="order-row">
                  <span className="order-key">Deadline</span>
                  <span className="order-val">{hackathon.deadline}</span>
                </div>

                <div className="order-divider-line" />

                <div className="order-row">
                  <span className="order-total-key">Total</span>
                  <span className="order-total-val">₹{hackathon.fee}</span>
                </div>
              </div>

              <div className="secure-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>256-bit SSL Encrypted</span>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="pay-right">

            {/* Header */}
            <div className="pay-right-header">
              <div className="pay-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <h1 className="pay-right-title">Payment</h1>
                <p className="pay-right-sub">Choose your preferred payment method</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <p className="section-label">Payment Method</p>
            <div className="methods-row">
              {/* Card */}
              <button
                className={`method-btn${method === "card" ? " active" : ""}`}
                onClick={() => { setMethod("card"); setErrors({}); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Card
              </button>
              {/* UPI */}
              <button
                className={`method-btn${method === "upi" ? " active" : ""}`}
                onClick={() => { setMethod("upi"); setErrors({}); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                UPI
              </button>
              {/* Net Banking */}
              <button
                className={`method-btn${method === "netbanking" ? " active" : ""}`}
                onClick={() => { setMethod("netbanking"); setErrors({}); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
                Net Banking
              </button>
            </div>

            {/* CARD FORM */}
            {method === "card" && (
              <>
                {/* Card Visual */}
                <div className="card-visual">
                  <div className="card-chip" />
                  <p className="card-number-preview">{cardPreview}</p>
                  <div className="card-visual-row">
                    <div>
                      <p className="card-holder-label">Card Holder</p>
                      <p className="card-holder-name">
                        {card.name || "YOUR NAME"}
                      </p>
                    </div>
                    <div className="card-logo">
                      <div className="card-logo-circle" />
                      <div className="card-logo-circle" />
                    </div>
                  </div>
                </div>

                <p className="section-label">Card Details</p>

                {/* Card Number */}
                <div className="input-group">
                  <input
                    className={`form-input${errors.number ? " input-error" : ""}`}
                    placeholder=" "
                    value={card.number}
                    maxLength={19}
                    onChange={e => {
                      setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }));
                      if (errors.number) setErrors(p => ({ ...p, number: "" }));
                    }}
                  />
                  <label className="float-label">Card Number</label>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                {errors.number
                  ? <p className="error-msg">⚠ {errors.number}</p>
                  : <div className="input-spacer" />
                }

                {/* Cardholder Name */}
                <div className="input-group">
                  <input
                    className={`form-input${errors.name ? " input-error" : ""}`}
                    placeholder=" "
                    value={card.name}
                    onChange={e => {
                      setCard(p => ({ ...p, name: e.target.value }));
                      if (errors.name) setErrors(p => ({ ...p, name: "" }));
                    }}
                  />
                  <label className="float-label">Cardholder Name</label>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                {errors.name
                  ? <p className="error-msg">⚠ {errors.name}</p>
                  : <div className="input-spacer" />
                }

                {/* Expiry + CVV */}
                <div className="input-row">
                  <div>
                    <div className="input-group">
                      <input
                        className={`form-input${errors.expiry ? " input-error" : ""}`}
                        placeholder=" "
                        value={card.expiry}
                        maxLength={5}
                        onChange={e => {
                          setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }));
                          if (errors.expiry) setErrors(p => ({ ...p, expiry: "" }));
                        }}
                      />
                      <label className="float-label">Expiry (MM/YY)</label>
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    {errors.expiry
                      ? <p className="error-msg">⚠ {errors.expiry}</p>
                      : <div className="input-spacer" />
                    }
                  </div>

                  <div>
                    <div className="input-group">
                      <input
                        className={`form-input${errors.cvv ? " input-error" : ""}`}
                        placeholder=" "
                        type="password"
                        value={card.cvv}
                        maxLength={4}
                        onChange={e => {
                          setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }));
                          if (errors.cvv) setErrors(p => ({ ...p, cvv: "" }));
                        }}
                      />
                      <label className="float-label">CVV</label>
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    {errors.cvv
                      ? <p className="error-msg">⚠ {errors.cvv}</p>
                      : <div className="input-spacer" />
                    }
                  </div>
                </div>
              </>
            )}

            {/* UPI FORM */}
            {method === "upi" && (
              <div className="upi-section">
                <p className="section-label">UPI Details</p>
                <div className="input-group">
                  <input
                    className={`form-input${errors.upiId ? " input-error" : ""}`}
                    placeholder=" "
                    value={upiId}
                    onChange={e => {
                      setUpiId(e.target.value);
                      if (errors.upiId) setErrors(p => ({ ...p, upiId: "" }));
                    }}
                  />
                  <label className="float-label">UPI ID (eg: name@upi)</label>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                {errors.upiId
                  ? <p className="error-msg">⚠ {errors.upiId}</p>
                  : <div className="input-spacer" />
                }
                <p style={{fontSize:"11px",color:"#90a4ae",fontFamily:"Poppins",marginBottom:"14px"}}>
                  Supported: PhonePe, Google Pay, Paytm, BHIM & all UPI apps
                </p>
              </div>
            )}

            {/* NET BANKING */}
            {method === "netbanking" && (
              <div className="upi-section">
                <p className="section-label">Select Bank</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"16px"}}>
                  {["SBI","HDFC","ICICI","Axis","Kotak","PNB"].map(bank => (
                    <button key={bank} style={{
                      padding:"8px 16px",
                      border:"2px solid #e0f4fa",
                      borderRadius:"8px",
                      background:"#f8fdff",
                      color:"#03045E",
                      fontSize:"11.5px",
                      fontWeight:"600",
                      fontFamily:"Poppins",
                      cursor:"pointer",
                      transition:"all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.target.style.borderColor="#00b4d8";
                      e.target.style.background="#e0f7fb";
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor="#e0f4fa";
                      e.target.style.background="#f8fdff";
                    }}>
                      {bank}
                    </button>
                  ))}
                </div>
                <p style={{fontSize:"11px",color:"#90a4ae",fontFamily:"Poppins",marginBottom:"14px"}}>
                  You will be redirected to your bank's secure portal
                </p>
              </div>
            )}

            {/* PAY BUTTON */}
            <button
              className={`pay-btn${loading ? " loading" : ""}`}
              onClick={handlePay}
            >
              {loading ? (
                <><div className="spinner" /><span>Processing...</span></>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Pay ₹{hackathon.fee} Securely</span>
                </>
              )}
            </button>

            {/* Trust Row */}
            <div className="trust-row">
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                SSL Secure
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                PCI Compliant
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Razorpay
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}