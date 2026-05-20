import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const userNotifications = [
  { id: 1, type: "team_invite", unread: true, time: "2 min ago", title: "Team Invite Received", message: "Aryan Sharma invited you to join NeuralNinjas for Smart India Hackathon 2025." },
  { id: 2, type: "payment", unread: true, time: "1 hour ago", title: "Payment Successful", message: "Your registration fee ₹199 for HackWithInfy Spring Edition is confirmed." },
  { id: 3, type: "result", unread: true, time: "3 hours ago", title: "Result Declared 🏆", message: "You ranked #3 in CodeStorm 2024! Check your results now." },
  { id: 4, type: "certificate", unread: false, time: "1 day ago", title: "Certificate Ready", message: "Your Rank Certificate for CodeStorm 2024 is ready to download." },
  { id: 5, type: "register", unread: false, time: "2 days ago", title: "Registration Confirmed", message: "You have successfully registered for DevSprint National Challenge." },
  { id: 6, type: "submission", unread: false, time: "3 days ago", title: "Submission Received", message: "Your project submission for DevSprint Challenge has been received." },
];

const adminNotifications = [
  { id: 1, type: "register", unread: true, time: "5 min ago", title: "New Registration", message: "Priya Verma registered for Smart India Hackathon 2025." },
  { id: 2, type: "payment", unread: true, time: "20 min ago", title: "Payment Received", message: "₹299 received from Rohan Mehta for CloudHack by AWS." },
  { id: 3, type: "submission", unread: true, time: "1 hour ago", title: "New Submission", message: "Team ByteBusters submitted their project for DevSprint Challenge." },
  { id: 4, type: "result", unread: false, time: "2 hours ago", title: "Judge Scored", message: "Judge Anjali has completed scoring for HackWithInfy Spring Edition." },
  { id: 5, type: "team_invite", unread: false, time: "1 day ago", title: "New Team Formed", message: "Team CloudPunks (4 members) formed for CloudHack by AWS." },
];

const universityNotifications = [
  { id: 1, type: "register", unread: true, time: "10 min ago", title: "New Student Registered", message: "Sneha Gupta (sneha@mdu.ac.in) registered for Smart India Hackathon 2025." },
  { id: 2, type: "result", unread: true, time: "2 hours ago", title: "Student Result", message: "Rahul Kumar achieved Rank #1 in HackMDU Intra-University 2024." },
  { id: 3, type: "certificate", unread: false, time: "1 day ago", title: "Result Declared", message: "Results for CodeStorm 2024 have been declared. 12 students participated." },
];

const Icons = {
  Bell: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Close: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  TeamInvite: ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Payment: ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Result: ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Certificate: ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Register: ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Submission: ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  CheckAll: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ViewAll: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

const typeConfig = {
  team_invite: { Icon: Icons.TeamInvite, color: "#6366f1", bg: "rgba(99,102,241,0.10)", border: "rgba(99,102,241,0.22)" },
  payment:     { Icon: Icons.Payment,    color: "#10b981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.22)" },
  result:      { Icon: Icons.Result,     color: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.22)" },
  certificate: { Icon: Icons.Certificate,color: "#0ea5e9", bg: "rgba(14,165,233,0.10)", border: "rgba(14,165,233,0.22)" },
  register:    { Icon: Icons.Register,   color: "#8b5cf6", bg: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.22)" },
  submission:  { Icon: Icons.Submission, color: "#ec4899", bg: "rgba(236,72,153,0.10)", border: "rgba(236,72,153,0.22)" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .nd-bell-btn {
    position: relative;
    width: 42px; height: 42px;
    border-radius: 12px;
    border: none;
    background: #03045e;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff;
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, background 0.22s ease;
    box-shadow: 0 4px 14px rgba(3,4,94,0.35);
    outline: none; flex-shrink: 0;
  }
  .nd-bell-btn:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 8px 24px rgba(3,4,94,0.45); background: #05076e; }
  .nd-bell-btn:active { transform: scale(0.96); }
  .nd-bell-btn:hover .nd-bell-icon { animation: ndRing 0.55s ease; }

  @keyframes ndRing {
    0%,100% { transform: rotate(0deg); }
    20% { transform: rotate(-18deg); }
    40% { transform: rotate(18deg); }
    60% { transform: rotate(-10deg); }
    80% { transform: rotate(10deg); }
  }

  .nd-badge {
    position: absolute; top: -6px; right: -6px;
    min-width: 20px; height: 20px;
    background: #ef4444; border-radius: 99px;
    border: 2.5px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; color: #fff;
    font-family: 'Inter', sans-serif;
    padding: 0 4px;
    animation: ndBadgePop 0.35s cubic-bezier(.34,1.56,.64,1) both;
    box-shadow: 0 2px 8px rgba(239,68,68,0.45);
    letter-spacing: -0.3px;
  }
  @keyframes ndBadgePop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  /* ── PORTAL styles: backdrop + drawer are rendered into document.body via portal ── */
  .nd-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(3,4,30,0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 99998;
    animation: ndFadeIn 0.25s ease both;
  }
  @keyframes ndFadeIn { from { opacity:0; } to { opacity:1; } }

  .nd-drawer {
    position: fixed;
    top: 0; right: 0;
    width: 400px;
    height: 100vh;
    background: #ffffff;
    z-index: 99999;
    display: flex; flex-direction: column;
    box-shadow: -12px 0 60px rgba(3,4,94,0.22), -2px 0 8px rgba(3,4,94,0.08);
    animation: ndSlideIn 0.38s cubic-bezier(0.16,1,0.3,1) both;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }
  @keyframes ndSlideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  .nd-header {
    padding: 20px 20px 18px;
    background: #03045e;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .nd-header-left { display: flex; align-items: center; gap: 12px; }
  .nd-header-icon-wrap {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(255,255,255,0.13); border: 1.5px solid rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }
  .nd-header-title { font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.4px; line-height: 1.2; }
  .nd-header-sub { font-size: 12px; color: rgba(144,224,239,0.85); font-weight: 500; margin-top: 2px; }
  .nd-close-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid rgba(255,255,255,0.20);
    background: rgba(255,255,255,0.10); color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s ease, transform 0.3s ease;
    outline: none; flex-shrink: 0;
  }
  .nd-close-btn:hover { background: rgba(255,255,255,0.22); transform: rotate(90deg); }

  .nd-toolbar {
    padding: 10px 18px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #f0f4f8;
    background: #f8fafc; flex-shrink: 0;
  }
  .nd-count-pill { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #64748b; }
  .nd-count-badge { background: #03045e; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 99px; }
  .nd-mark-all-btn {
    display: flex; align-items: center; gap: 5px;
    background: none; border: 1.5px solid #e2e8f0; border-radius: 8px;
    padding: 5px 12px; font-size: 11.5px; font-weight: 600; color: #03045e;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .nd-mark-all-btn:hover { background: #03045e; color: #fff; border-color: #03045e; }

  .nd-list {
    flex: 1; overflow-y: auto; padding: 14px;
    display: flex; flex-direction: column; gap: 9px;
  }
  .nd-list::-webkit-scrollbar { width: 4px; }
  .nd-list::-webkit-scrollbar-track { background: transparent; }
  .nd-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  .nd-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  .nd-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px; border-radius: 14px;
    border: 1.5px solid #e8edf5; background: #fff;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    position: relative; overflow: hidden;
    animation: ndItemIn 0.32s ease both;
  }
  @keyframes ndItemIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .nd-item.dismissing { animation: ndItemOut 0.32s ease both; }
  @keyframes ndItemOut {
    from { opacity: 1; transform: translateX(0);    max-height: 160px; padding: 14px; }
    to   { opacity: 0; transform: translateX(64px); max-height: 0;     padding: 0; }
  }
  .nd-item.unread { background: #f0f6ff; border-color: #bdd6fe; }
  .nd-item:hover { transform: translateX(-4px); box-shadow: 6px 0 20px rgba(3,4,94,0.10); border-color: #93c5fd; }

  .nd-item-stripe {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3.5px; border-radius: 0 2px 2px 0;
    transition: opacity 0.22s ease; opacity: 0;
  }
  .nd-item.unread .nd-item-stripe,
  .nd-item:hover .nd-item-stripe { opacity: 1; }

  .nd-item-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .nd-item:hover .nd-item-icon { transform: rotate(-8deg) scale(1.1); }

  .nd-item-body { flex: 1; min-width: 0; }
  .nd-item-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
  .nd-item-title { font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.3; flex: 1; }
  .nd-item-time { font-size: 10.5px; color: #94a3b8; font-weight: 500; white-space: nowrap; flex-shrink: 0; margin-top: 1px; }
  .nd-item-msg {
    font-size: 12px; color: #475569; font-weight: 400; line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .nd-item-actions { display: flex; align-items: center; gap: 7px; margin-top: 9px; }
  .nd-action-btn {
    padding: 4px 12px; border-radius: 7px; font-size: 11px; font-weight: 600;
    border: 1.5px solid; cursor: pointer; font-family: 'Inter', sans-serif;
    transition: all 0.18s ease; line-height: 1.6;
  }
  .nd-action-primary { background: #03045e; color: #fff; border-color: #03045e; }
  .nd-action-primary:hover { background: #0a0a8e; border-color: #0a0a8e; }
  .nd-action-ghost { background: transparent; color: #64748b; border-color: #e2e8f0; }
  .nd-action-ghost:hover { border-color: #94a3b8; color: #334155; background: #f8fafc; }

  .nd-unread-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #ef4444; flex-shrink: 0; margin-top: 5px;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.18);
    animation: ndDotPulse 2.2s ease-in-out infinite;
  }
  @keyframes ndDotPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.18); }
    50%      { box-shadow: 0 0 0 5px rgba(239,68,68,0.08); }
  }

  .nd-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 24px; gap: 10px;
  }
  .nd-empty-icon {
    width: 68px; height: 68px; border-radius: 20px;
    background: #f1f5f9; display: flex; align-items: center; justify-content: center;
    color: #cbd5e1; margin-bottom: 6px;
  }
  .nd-empty-title { font-size: 15px; font-weight: 700; color: #475569; }
  .nd-empty-sub { font-size: 12.5px; color: #94a3b8; text-align: center; line-height: 1.5; }

  .nd-footer { padding: 14px 16px; border-top: 1px solid #f0f4f8; background: #f8fafc; flex-shrink: 0; }
  .nd-footer-btn {
    width: 100%; background: none; border: 1.5px solid #e2e8f0; border-radius: 10px;
    padding: 10px 20px; font-size: 12.5px; font-weight: 600; color: #03045e;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .nd-footer-btn:hover { background: #03045e; color: #fff; border-color: #03045e; }

  @media (max-width: 480px) { .nd-drawer { width: 100vw; } }
`;

// Portal component — renders children directly into document.body
import { createPortal } from "react-dom";

function Portal({ children }) {
  return createPortal(children, document.body);
}

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [animatingIds, setAnimatingIds] = useState([]);
  const drawerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "user";

  useEffect(() => {
    if (role === "admin") setNotifications(adminNotifications);
    else if (role === "university") setNotifications(universityNotifications);
    else setNotifications(userNotifications);
  }, [role]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markOneRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  const dismissOne = (id) => {
    setAnimatingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setAnimatingIds((prev) => prev.filter((x) => x !== id));
    }, 320);
  };

  return (
    <>
      <style>{styles}</style>

      {/* Bell Button — stays wherever you place it in your navbar */}
      <button className="nd-bell-btn" onClick={() => setOpen((p) => !p)} title="Notifications">
        <span className="nd-bell-icon"><Icons.Bell size={20} /></span>
        {unreadCount > 0 && (
          <span className="nd-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {/* Backdrop + Drawer rendered into document.body via Portal */}
      {open && (
        <Portal>
          {/* Backdrop */}
          <div className="nd-backdrop" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="nd-drawer" ref={drawerRef}>

            {/* Header */}
            <div className="nd-header">
              <div className="nd-header-left">
                <div className="nd-header-icon-wrap"><Icons.Bell size={18} /></div>
                <div>
                  <div className="nd-header-title">Notifications</div>
                  <div className="nd-header-sub">
                    {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
                  </div>
                </div>
              </div>
              <button className="nd-close-btn" onClick={() => setOpen(false)}>
                <Icons.Close size={16} />
              </button>
            </div>

            {/* Toolbar */}
            {notifications.length > 0 && (
              <div className="nd-toolbar">
                <div className="nd-count-pill">
                  Total <span className="nd-count-badge">{notifications.length}</span>
                </div>
                {unreadCount > 0 && (
                  <button className="nd-mark-all-btn" onClick={markAllRead}>
                    <Icons.CheckAll size={12} /> Mark all read
                  </button>
                )}
              </div>
            )}

            {/* List */}
            <div className="nd-list">
              {notifications.length === 0 ? (
                <div className="nd-empty">
                  <div className="nd-empty-icon"><Icons.Bell size={30} /></div>
                  <div className="nd-empty-title">No notifications yet</div>
                  <div className="nd-empty-sub">You're all caught up!<br />Check back later.</div>
                </div>
              ) : (
                notifications.map((n, i) => {
                  const cfg = typeConfig[n.type] || typeConfig.register;
                  const isDismissing = animatingIds.includes(n.id);
                  const TypeIcon = cfg.Icon;
                  return (
                    <div
                      key={n.id}
                      className={`nd-item${n.unread ? " unread" : ""}${isDismissing ? " dismissing" : ""}`}
                      style={{ animationDelay: `${i * 40}ms` }}
                      onClick={() => markOneRead(n.id)}
                    >
                      <div className="nd-item-stripe"
                        style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}88)` }} />

                      <div className="nd-item-icon"
                        style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                        <TypeIcon color={cfg.color} />
                      </div>

                      <div className="nd-item-body">
                        <div className="nd-item-top">
                          <div className="nd-item-title">{n.title}</div>
                          <div className="nd-item-time">{n.time}</div>
                        </div>
                        <div className="nd-item-msg">{n.message}</div>

                        {n.type === "team_invite" && n.unread && (
                          <div className="nd-item-actions">
                            <button className="nd-action-btn nd-action-primary"
                              onClick={(e) => { e.stopPropagation(); markOneRead(n.id); }}>Accept</button>
                            <button className="nd-action-btn nd-action-ghost"
                              onClick={(e) => { e.stopPropagation(); dismissOne(n.id); }}>Decline</button>
                          </div>
                        )}

                        {n.type !== "team_invite" && (
                          <div className="nd-item-actions">
                            <button className="nd-action-btn nd-action-ghost"
                              onClick={(e) => { e.stopPropagation(); dismissOne(n.id); }}>Dismiss</button>
                          </div>
                        )}
                      </div>

                      {n.unread && <div className="nd-unread-dot" />}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="nd-footer">
              <button className="nd-footer-btn">
                <Icons.ViewAll size={13} /> View All Notifications
              </button>
            </div>

          </div>
        </Portal>
      )}
    </>
  );
}