import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .invite-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .invite-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/1200x/07/b4/2c/07b42c67cf7564dbe559196b023e3d93.jpg');
    background-size: cover;
    background-position: center;
    filter: brightness(0.3) saturate(1.2);
    z-index: 0;
  }

  .invite-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(10, 31, 110, 0.85) 0%, rgba(14, 58, 122, 0.6) 50%, rgba(10, 45, 107, 0.8) 100%);
    z-index: 1;
  }

  .invite-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(144, 224, 239, 0.25);
    border-radius: 28px;
    padding: 48px 40px;
    width: 100%;
    max-width: 520px;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 180, 216, 0.15);
    text-align: center;
    position: relative;
    z-index: 2;
    animation: cardEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes cardEntrance {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .invite-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #0077B6, #00b4d8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    box-shadow: 0 12px 32px rgba(0, 180, 216, 0.35);
  }
  .invite-icon svg { width: 36px; height: 36px; color: white; }

  .invite-label {
    font-size: 11px;
    font-weight: 700;
    color: #90e0ef;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-family: 'Nunito', sans-serif;
  }

  .invite-title {
    font-size: 26px;
    font-weight: 900;
    color: white;
    font-family: 'Nunito', sans-serif;
    line-height: 1.25;
    margin-bottom: 16px;
  }

  .invite-desc {
    font-size: 13.5px;
    color: #caf0f8;
    line-height: 1.7;
    margin-bottom: 36px;
    opacity: 0.85;
  }

  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
  }

  .btn-accept {
    width: 100%;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 15px 30px;
    font-size: 14px;
    font-weight: 800;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 180, 216, 0.3);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .btn-accept:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(0, 180, 216, 0.45);
  }
  .btn-accept:active { transform: translateY(0); }

  .btn-decline {
    width: 100%;
    background: transparent;
    color: #90e0ef;
    border: 2px solid rgba(144, 224, 239, 0.4);
    border-radius: 50px;
    padding: 13px 30px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .btn-decline:hover {
    border-color: #00b4d8;
    color: white;
    background: rgba(0, 180, 216, 0.08);
  }

  .btn-loading {
    pointer-events: none;
    opacity: 0.8;
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-block {
    background: rgba(220, 38, 38, 0.15);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 12px;
    padding: 12px 16px;
    color: #fca5a5;
    font-size: 13px;
    margin-bottom: 24px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export default function TeamInviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const handleAction = async (accept) => {
    setErrorMsg("");
    if (accept) {
      setLoading(true);
    } else {
      setDeclineLoading(true);
    }

    try {
      const endpoint = `/teams/team-invitations/${token}/${accept ? "accept" : "decline"}`;
      const res = await api.post(endpoint);
      const msg = res.data?.message || (accept ? "Invitation accepted!" : "Invitation declined.");
      setResultMsg(msg);
      setCompleted(true);
    } catch (err) {
      
      const msg = err.response?.data?.message || err.message || "Failed to process invitation action.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setDeclineLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="invite-page">
        <div className="invite-bg" />
        <div className="invite-overlay" />

        <div className="invite-card">
          <div className="invite-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <polyline points="17 11 19 13 23 9" />
            </svg>
          </div>

          <p className="invite-label">Team Invitation</p>
          
          {completed ? (
            <>
              <h2 className="invite-title" style={{ color: "#34D399" }}>Completed!</h2>
              <p className="invite-desc">{resultMsg}</p>
              <div className="btn-group">
                <button className="btn-accept" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="invite-title">Join Your Teammates</h2>
              <p className="invite-desc">
                You have been invited to participate in a hackathon team. Accept to sync workspace repositories, unlock task boards, and compete together.
              </p>

              {errorMsg && (
                <div className="error-block">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="btn-group">
                <button
                  className={`btn-accept${loading ? " btn-loading" : ""}`}
                  onClick={() => handleAction(true)}
                  disabled={loading || declineLoading}
                >
                  {loading ? <div className="spinner" /> : <span>Accept & Enter Team</span>}
                </button>

                <button
                  className={`btn-decline${declineLoading ? " btn-loading" : ""}`}
                  onClick={() => handleAction(false)}
                  disabled={loading || declineLoading}
                >
                  {declineLoading ? <div className="spinner" /> : <span>Decline Invite</span>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
