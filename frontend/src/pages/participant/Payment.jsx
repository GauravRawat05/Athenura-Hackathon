import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { hackathonService } from "../../services/hackathonService";
import { paymentService } from "../../services/paymentService";

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
    .pay-btn { padding: 16px; }
  }
`;

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId } = useParams();

  const [registration, setRegistration] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [hackathon, setHackathon] = useState(location.state?.hackathon || {
    name: "Loading...",
    mode: "Solo",
    fee: 0,
    deadline: "",
    teamName: "",
  });

  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Razorpay SDK loaded successfully.");
      setSdkLoaded(true);
    };
    
    script.onerror = (err) => {
      console.error("Failed to load Razorpay SDK:", err);
      alert("Failed to load payment gateway. Please check your internet connection.");
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchReg = async () => {
      try {
        const res = await hackathonService.getMyRegistrations();
        const list = res.data && (res.data.data || res.data);
        if (list && Array.isArray(list)) {
          const match = list.find(r => r._id === registrationId);
          if (match && mounted) {
            setRegistration(match);
            const h = match.hackathonId || {};
            setHackathon({
              name: h.title || "Hackathon",
              mode: match.mode === "team" ? "Team" : "Solo",
              fee: h.registrationFee || 0,
              deadline: h.registrationDeadline ? new Date(h.registrationDeadline).toLocaleDateString() : "",
              teamName: match.teamId?.teamName || "",
            });
          }
        }
      } catch (err) {
        
      }
    };
    if (registrationId) {
      fetchReg();
    }
    return () => { mounted = false; };
  }, [registrationId]);

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => navigate(-1), 420);
  };

  const handlePay = async () => {
    setErrors({});
    if (!sdkLoaded) {
      alert("Razorpay payment gateway is still loading. Please try again in a moment.");
      return;
    }
    setLoading(true);

    try {
      // Use registration order details directly
      const orderId = registration?.paymentId?.razorpayOrderId;
      const amount = (registration?.amount || 0) * 100; // Convert to paise

      if (!orderId) {
        throw new Error("Payment order not found for this registration. Please contact support.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SokmKPc76a4dtb",
        amount: amount,
        currency: "INR",
        name: "Athenura Hackathons",
        description: `Registration fee for ${hackathon.name}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            await paymentService.verifyPayment(
              registrationId,
              orderId,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            
            setLoading(false);
            setLeaving(true);
            setTimeout(() => navigate("/payment/status", {
              state: { status: "success", hackathon }
            }), 420);
          } catch (verifyErr) {
            console.error('[Payment] Payment verification failed:', verifyErr);
            setLoading(false);
            navigate("/payment/status", {
              state: { 
                status: "failed", 
                hackathon,
                errorMessage: verifyErr?.response?.data?.message || "Payment verification failed. Please contact support." 
              }
            });
          }
        },
        prefill: {
          name: registration?.userId?.fullName || "",
          email: registration?.userId?.email || "",
          contact: "",
        },
        theme: {
          color: "#03045E"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
      setErrors({ apiError: err?.response?.data?.message || err.message || "Failed to initialize payment gateway." });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`payment-page${leaving ? " fade-out" : ""}`}>
        <div className="payment-bg" />
        <div className="payment-bg-overlay" />

        <button className="back-home" onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>

        <div className="payment-card">
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
              <div className="order-summary">
                <p className="order-summary-title">Order Summary</p>
                <div className="order-row">
                  <span className="order-key">Hackathon</span>
                  <span className="order-val" style={{maxWidth:"100px",textAlign:"right",fontSize:"10.5px"}}>{hackathon.name}</span>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          <div className="pay-right" style={{justifyContent: 'center'}}>
            <div className="pay-right-header">
              <div className="pay-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <h1 className="pay-right-title">Ready to Pay?</h1>
                <p className="pay-right-sub">Click the button below to pay securely.</p>
              </div>
            </div>

            {errors.apiError && (
              <div className="error-msg" style={{ justifyContent: "center", marginBottom: "14px" }}>
                <span>❌ {errors.apiError}</span>
              </div>
            )}

            <button
              className={`pay-btn${loading ? " loading" : ""}`}
              onClick={handlePay}
            >
              {loading ? (
                <><div className="spinner" /><span>Processing...</span></>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Pay ₹{hackathon.fee} Securely</span>
                </>
              )}
            </button>
            <div className="trust-row">
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                SSL Secure
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                PCI Compliant
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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