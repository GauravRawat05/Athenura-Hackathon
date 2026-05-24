import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationDrawer from "../../pages/participant/NotificationDrawer";
import { logout } from "../../store/authSlice";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "My Hackathons",
    path: "/My-hackathons",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: "Project Submission",
    path: "/my-submissions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Certificates",
    path: "/certificates",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: "Results",
    path: "/my-results",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
  label: "Back to Home",
  path: "/",
  icon: (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.8V20a1 1 0 0 0 1 1h4.5v-5.5h3V21H18a1 1 0 0 0 1-1V9.8" />
  </svg>
),
},
];

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon = ({ flipped }) => (
  <svg
    width="12" height="12"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform 0.35s", transform: flipped ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export default function Sidebar({ collapsed, setCollapsed }) {
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userName = user?.name || user?.fullName || "User";
  const userRole = user?.role || "Participant";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

        /* ── Fixed hamburger button — page pe, sidebar ke bahar ── */
        .sb-fixed-hamburger {
          display: none;
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 1200;
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: linear-gradient(135deg, #03045e, #020344);
          border: 1px solid rgba(144,224,239,0.3);
          color: #90e0ef;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(3,4,94,0.6);
          transition: background 0.2s, transform 0.15s;
        }
        .sb-fixed-hamburger:hover {
          background: #0a0a6e;
          transform: scale(1.05);
        }

        /* ── Backdrop ── */
        .sb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(3px);
          z-index: 1000;
          opacity: ${mobileOpen ? "1" : "0"};
          pointer-events: ${mobileOpen ? "all" : "none"};
          transition: opacity 0.3s ease;
        }

        /* ── Sidebar wrapper ── */
        .sb-wrap {
          display: flex;
          flex-direction: column;
          width: ${collapsed ? "72px" : "255px"};
          min-height: 100vh;
          background: linear-gradient(175deg, #03045e 0%, #020344 55%, #010230 100%);
          border-right: 1px solid rgba(144,224,239,0.12);
          transition: width 0.35s cubic-bezier(.4,0,.2,1);
          position: fixed;
          overflow: visible;
          font-family: 'Poppins', sans-serif;
          box-shadow: 6px 0 32px rgba(3,4,94,0.45);
          flex-shrink: 0;
          z-index: 1050;
        }

        /* Blobs — clipped inside */
        .sb-blobs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .sb-blob1 {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(144,224,239,0.09) 0%, transparent 70%);
          top: -40px; right: -60px;
        }
        .sb-blob2 {
          position: absolute;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(144,224,239,0.06) 0%, transparent 70%);
          bottom: 80px; left: -40px;
        }

        /* ── Brand row ── */
        .sb-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: ${collapsed ? "0 17px" : "0 14px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-bottom: 1px solid rgba(144,224,239,0.1);
          position: relative;
          z-index: 2;
          min-height: 72px;
        }

        .sb-logo-circle {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #90e0ef 0%, #48cae4 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(144,224,239,0.3);
        }
        .sb-logo-circle svg { color: #ffffff; }

        .sb-brand-text {
          flex: 1;
          overflow: hidden;
          display: ${collapsed ? "none" : "block"};
        }
        .sb-brand-name {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 17px;
          color: #ffffff;
          letter-spacing: 0.3px;
          line-height: 1.1;
          white-space: nowrap;
        }
        .sb-brand-sub {
          font-size: 10px;
          font-weight: 500;
          color: rgba(144,224,239,0.7);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* Desktop collapse toggle — inside brand, rightmost */
        .sb-toggle {
          width: 28px; height: 28px;
          border-radius: 50%;
          
          border: 1.5px solid rgba(144,224,239,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #90e0ef;
          flex-shrink: 0;
          margin-left: auto;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .sb-toggle:hover {
          background: rgba(144,224,239,0.28);
         
        }

        /* Mobile close button — inside brand */
        .sb-close-btn {
          display: none;
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(144,224,239,0.1);
          border: 1px solid rgba(144,224,239,0.2);
          color: #90e0ef;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
          margin-left: auto;
        }
        .sb-close-btn:hover { background: rgba(144,224,239,0.22); }

        /* ── User card ── */
        .sb-user {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: ${collapsed ? "14px 0" : "14px 16px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          margin: 10px ${collapsed ? "8px" : "12px"};
          border-radius: 14px;
          background: rgba(144,224,239,0.08);
          border: 1px solid rgba(144,224,239,0.1);
          position: relative; z-index: 1;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sb-user:hover { background: rgba(144,224,239,0.15); }

        .sb-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #90e0ef, #48cae4);
          display: flex; align-items: center; justify-content: center;
          color: #03045e;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(144,224,239,0.3);
        }

        .sb-user-info {
          display: ${collapsed ? "none" : "block"};
          overflow: hidden;
        }
        .sb-user-name {
          font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 13px;
          color: #ffffff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sb-user-role {
          font-size: 10px; font-weight: 500;
          color: #90e0ef;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        /* ── Nav ── */
        .sb-section-label {
          display: ${collapsed ? "none" : "block"};
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(144,224,239,0.4);
          padding: 12px 20px 6px;
          position: relative; z-index: 1;
        }

        .sb-nav {
          list-style: none;
          margin: 0;
          padding: 0 ${collapsed ? "8px" : "12px"};
          flex: 1;
          position: relative; z-index: 1;
        }

        .sb-nav li { margin-bottom: 3px; position: relative; }

        .sb-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? "11px 0" : "10px 13px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-radius: 11px;
          text-decoration: none;
          color: rgba(255,255,255,0.58);
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          position: relative;
          white-space: nowrap;
        }
        .sb-nav-link:hover {
          background: rgba(144,224,239,0.1);
          color: #90e0ef;
          transform: translateX(${collapsed ? "0" : "3px"});
        }
        .sb-nav-link.active {
          background: linear-gradient(90deg, rgba(144,224,239,0.16) 0%, rgba(144,224,239,0.05) 100%);
          color: #ffffff;
          font-weight: 600;
        }
        .sb-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 55%;
          background: #90e0ef;
          border-radius: 0 3px 3px 0;
        }

        .sb-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          width: 20px; flex-shrink: 0;
          transition: transform 0.2s;
        }
        .sb-nav-link:hover .sb-icon-wrap { transform: scale(1.15); }
        .sb-nav-link.active .sb-icon-wrap { color: #90e0ef; }

        .sb-link-label { display: ${collapsed ? "none" : "block"}; }

        /* Tooltip — collapsed desktop */
        .sb-tooltip {
          display: none;
          position: absolute;
          left: calc(100% + 12px);
          top: 50%; transform: translateY(-50%);
          background: #90e0ef;
          color: #03045e;
          font-family: 'Poppins', sans-serif;
          font-size: 12px; font-weight: 600;
          padding: 5px 11px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 14px rgba(3,4,94,0.25);
          z-index: 200;
        }
        .sb-tooltip::before {
          content: '';
          position: absolute;
          right: 100%; top: 50%; transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #90e0ef;
        }
        ${collapsed ? ".sb-nav li:hover .sb-tooltip { display: block; }" : ""}

        .sb-divider {
          height: 1px;
          background: rgba(144,224,239,0.1);
          margin: 8px ${collapsed ? "8px" : "16px"};
          position: relative; z-index: 1;
        }

        /* ── Logout ── */
        .sb-logout-wrap {
          padding: 8px ${collapsed ? "8px" : "12px"} 22px;
          position: relative; z-index: 1;
        }
        .sb-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? "11px 0" : "10px 13px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-radius: 11px;
          border: none;
          background: transparent;
          color: rgba(255,100,100,0.7);
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px; font-weight: 500;
          cursor: pointer;
          width: 100%;
          transition: all 0.22s;
          white-space: nowrap;
        }
        .sb-logout-btn:hover {
          background: rgba(255,80,80,0.1);
          color: #ff6b6b;
          transform: translateX(${collapsed ? "0" : "3px"});
        }

        /* ── Logout Modal ── */
        .sb-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(3,4,94,0.7);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          animation: sbFadeIn 0.2s ease;
        }
        @keyframes sbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .sb-modal {
          background: linear-gradient(145deg, #03045e, #020344);
          border: 1px solid rgba(144,224,239,0.2);
          border-radius: 20px;
          padding: 36px 32px;
          max-width: 340px; width: 90%;
          text-align: center;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          animation: sbSlideUp 0.25s cubic-bezier(.4,0,.2,1);
        }
        @keyframes sbSlideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .sb-modal-icon {
          width: 58px; height: 58px;
          border-radius: 50%;
          background: rgba(255,80,80,0.12);
          border: 1px solid rgba(255,80,80,0.25);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: #ff6b6b;
        }
        .sb-modal h3 {
          font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 20px;
          color: #ffffff; margin: 0 0 8px;
        }
        .sb-modal p {
          font-size: 13px; color: rgba(255,255,255,0.55);
          font-family: 'Poppins', sans-serif;
          margin: 0 0 24px; line-height: 1.6;
        }
        .sb-modal-actions { display: flex; gap: 10px; }
        .sb-modal-cancel {
          flex: 1; padding: 11px;
          border-radius: 10px;
          border: 1px solid rgba(144,224,239,0.2);
          background: rgba(144,224,239,0.07);
          color: rgba(255,255,255,0.7);
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .sb-modal-cancel:hover { background: rgba(144,224,239,0.14); color: #fff; }
        .sb-modal-confirm {
          flex: 1; padding: 11px;
          border-radius: 10px; border: none;
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(255,80,80,0.3);
        }
        .sb-modal-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,80,80,0.45); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          /* Fixed hamburger — page pe dikhta hai jab sidebar band ho */
          .sb-fixed-hamburger { display: flex; }

          /* Close button — sidebar ke andar brand me */
          .sb-close-btn { display: flex; }

          /* Desktop toggle hide */
          .sb-toggle { display: none !important; }

          /* Sidebar — fixed drawer */
          .sb-wrap {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 265px !important;
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.35s cubic-bezier(.4,0,.2,1);
          }

          /* Jab sidebar open ho toh fixed hamburger hide */
          ${mobileOpen ? ".sb-fixed-hamburger { display: none; }" : ""}

          /* Force show content */
          .sb-brand-text { display: block !important; }
          .sb-user-info { display: block !important; }
          .sb-section-label { display: block !important; }
          .sb-link-label { display: block !important; }

          .sb-brand { padding: 0 14px !important; justify-content: flex-start !important; }
          .sb-user { padding: 14px 16px !important; margin: 10px 12px !important; justify-content: flex-start !important; }
          .sb-nav { padding: 0 12px !important; }
          .sb-nav-link { padding: 10px 13px !important; justify-content: flex-start !important; }
          .sb-logout-wrap { padding: 8px 12px 22px !important; }
          .sb-logout-btn { padding: 10px 13px !important; justify-content: flex-start !important; }
        }
      `}</style>

      {/* Fixed hamburger — sidebar ke BAHAR, page pe */}
      <button
        className="sb-fixed-hamburger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <HamburgerIcon />
      </button>

      {/* Backdrop */}
      <div className="sb-backdrop" onClick={() => setMobileOpen(false)} />

      <aside className="sb-wrap">
        <div className="sb-blobs">
          <div className="sb-blob1" />
          <div className="sb-blob2" />
        </div>

        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-logo-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="sb-brand-text">
            <div className="sb-brand-name">Athenura</div>
            <div className="sb-brand-sub">Platform</div>
          </div>

          {/* Desktop toggle */}
          <button className="sb-toggle" onClick={() => setCollapsed(!collapsed)} title="Collapse sidebar">
            <ChevronIcon flipped={collapsed} />
          </button>

          {/* Mobile close button */}
          <button className="sb-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
            <CloseIcon />
          </button>
        </div>

        {/* User Card */}
        <div className="sb-user">
          <div className="sb-avatar">
            <PersonIcon />
          </div>
          <div className="sb-user-info">
            <div className="sb-user-name">{userName}</div>
            <div className="sb-user-role">{userRole}</div>
          </div>
        </div>

     {/* Nav */}
<div className="sb-section-label">Main Menu</div>
<ul className="sb-nav">
  {navItems.map((item) => (
    <li key={item.path}>
      <NavLink
        to={item.path}
        className={({ isActive }) => `sb-nav-link${isActive ? " active" : ""}`}
        onClick={handleNavClick}
      >
        <span className="sb-icon-wrap">{item.icon}</span>
        <span className="sb-link-label">{item.label}</span>
      </NavLink>
      {collapsed && <span className="sb-tooltip">{item.label}</span>}
    </li>
  ))}

 {/* Notifications — NotificationDrawer */}
  <li style={{ position: "relative" }}>
    <div className="sb-nav-link" style={{ cursor: "pointer", padding: "10px 13px" }}>
      <span className="sb-icon-wrap">
        <NotificationDrawer />
      </span>
      {!collapsed && (
        <span className="sb-link-label"
          onClick={() => document.querySelector(".nd-bell-btn")?.click()}
        >
          Notifications
        </span>
      )}
    </div>
    {collapsed && <span className="sb-tooltip">Notifications</span>}
  </li>

</ul>

<div className="sb-divider" />

        {/* Logout */}
        <div className="sb-logout-wrap">
          <button className="sb-logout-btn" onClick={() => setShowLogoutModal(true)}>
            <span className="sb-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="sb-link-label">Logout</span>
          </button>
          {collapsed && <span className="sb-tooltip">Logout</span>}
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="sb-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3>Logout?</h3>
            <p>Are you sure you want to logout from your Athenura account?</p>
            <div className="sb-modal-actions">
              <button className="sb-modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="sb-modal-confirm" onClick={handleLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}