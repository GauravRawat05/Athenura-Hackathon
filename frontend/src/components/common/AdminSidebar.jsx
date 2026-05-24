import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const navItems = [
    {
        label: "Analytics Dashboard",
        path: "/admin",
        end: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        label: "Hackathon Management",
        path: "/admin/hackathons",
        end: true,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        label: "User Management",
        path: "/admin/users",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        label: "Judge Management",
        path: "/admin/hackathons/1/judges",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
        ),
    },
    {
        label: "Reports & Export",
        path: "/admin/reports",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        label: "Result Declaration",
        path: "/admin/hackathons/1/winners",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
    {
        label: "University Dashboard",
        path: "/admin/universities",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        ),
    },
    {
        label: "Certificates",
        path: "/admin/certificates",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
            </svg>
        ),
    },
];

const bottomNavItems = [
    {
        label: "Real-time Notifications",
        path: "/admin/notifications",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
    },
];

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
    const [collapsed, setCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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

        /* ── Color Palette ──
           #03045E  deep navy
           #0077B6  ocean blue
           #00B4D8  cyan
           #90E0EF  sky
           #CAF0F8  ice / background
        */

        .asb-fixed-hamburger {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1200;
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #0077B6;
          border: 1px solid #00B4D8;
          color: #ffffff;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,119,182,0.35);
          transition: background 0.2s, transform 0.15s;
        }
        .asb-fixed-hamburger:hover {
          background: #03045E;
          transform: scale(1.05);
        }

        .asb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3,4,94,0.35);
          backdrop-filter: blur(3px);
          z-index: 1000;
          opacity: ${mobileOpen ? "1" : "0"};
          pointer-events: ${mobileOpen ? "all" : "none"};
          transition: opacity 0.3s ease;
        }

        .asb-wrap {
          display: flex;
          flex-direction: column;
          width: ${collapsed ? "72px" : "260px"};
          min-height: 100vh;
          background: linear-gradient(175deg, #050b6e 0%, #03045E 50%, #020348 100%);
          border-right: 1px solid rgba(0,180,216,0.15);
          transition: width 0.35s cubic-bezier(.4,0,.2,1);
          position: relative;
          overflow: visible;
          font-family: 'Poppins', sans-serif;
          box-shadow: 6px 0 32px rgba(3,4,94,0.55);
          flex-shrink: 0;
          z-index: 1050;
        }

        /* Decorative blobs — light tinted */
        .asb-blobs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .asb-blob1 {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,180,216,0.10) 0%, transparent 70%);
          top: -60px; right: -80px;
        }
        .asb-blob2 {
          position: absolute;
          width: 170px; height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,180,216,0.07) 0%, transparent 70%);
          bottom: 120px; left: -55px;
        }
        .asb-blob3 {
          position: absolute;
          width: 130px; height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%);
          top: 42%; right: -35px;
        }

        /* Brand */
        .asb-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: ${collapsed ? "0 17px" : "0 16px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-bottom: 1px solid rgba(0,180,216,0.15);
          position: relative;
          z-index: 2;
          min-height: 72px;
        }

        .asb-logo-circle {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: linear-gradient(140deg, #0077B6 0%, #00B4D8 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 14px rgba(0,119,182,0.30);
        }
        .asb-logo-circle svg { color: #ffffff; }

        .asb-brand-text {
          flex: 1;
          overflow: hidden;
          display: ${collapsed ? "none" : "block"};
        }
        .asb-brand-name {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 17px;
          color: #ffffff;
          letter-spacing: 0.3px;
          line-height: 1.1;
          white-space: nowrap;
        }
        .asb-brand-sub {
          font-size: 10px;
          font-weight: 600;
          color: rgba(144,224,239,0.85);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .asb-toggle {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,180,216,0.35);
          display: ${collapsed ? "none" : "flex"}; align-items: center; justify-content: center;
          cursor: pointer;
          color: #90E0EF;
          flex-shrink: 0;
          margin-left: auto;
          background: transparent;
          transition: background 0.2s;
        }
        .asb-toggle:hover { background: rgba(0,180,216,0.12); }

        .asb-close-btn {
          display: none;
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(0,180,216,0.10);
          border: 1px solid rgba(0,180,216,0.20);
          color: #90E0EF;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
          margin-left: auto;
        }
        .asb-close-btn:hover { background: rgba(0,180,216,0.20); }

        /* Admin badge */
        .asb-admin-badge {
          display: ${collapsed ? "none" : "flex"};
          align-items: center;
          gap: 7px;
          margin: 12px 14px 6px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(0,180,216,0.10);
          border: 1px solid rgba(0,180,216,0.20);
          position: relative; z-index: 1;
        }
        .asb-admin-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #00B4D8;
          box-shadow: 0 0 6px rgba(0,180,216,0.60);
          flex-shrink: 0;
          animation: asbPulse 2s ease-in-out infinite;
        }
        @keyframes asbPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.82); }
        }
        .asb-admin-badge-text {
          font-size: 10.5px;
          font-weight: 700;
          color: #90E0EF;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-family: 'Poppins', sans-serif;
        }

        /* Section label */
        .asb-section-label {
          display: ${collapsed ? "none" : "block"};
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(144,224,239,0.50);
          padding: 10px 20px 5px;
          position: relative; z-index: 1;
        }

        /* Nav */
        .asb-nav {
          list-style: none;
          margin: 0;
          padding: 0 ${collapsed ? "8px" : "10px"};
          flex: 1;
          position: relative; z-index: 1;
        }
        .asb-nav li { margin-bottom: 2px; position: relative; }

        .asb-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? "11px 0" : "9px 12px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          position: relative;
          white-space: nowrap;
        }
        .asb-nav-link:hover {
          background: rgba(0,180,216,0.12);
          color: #ffffff;
          transform: translateX(${collapsed ? "0" : "3px"});
        }
        .asb-nav-link.active {
          background: linear-gradient(90deg, rgba(0,119,182,0.30) 0%, rgba(0,180,216,0.10) 100%);
          color: #ffffff;
          font-weight: 600;
        }
        .asb-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 55%;
          background: linear-gradient(to bottom, #00B4D8, #90E0EF);
          border-radius: 0 3px 3px 0;
        }

        .asb-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          width: 20px; flex-shrink: 0;
          transition: transform 0.2s;
          color: #90E0EF;
        }
        .asb-nav-link:hover .asb-icon-wrap { transform: scale(1.15); color: #CAF0F8; }
        .asb-nav-link.active .asb-icon-wrap { color: #00B4D8; }

        .asb-link-label { display: ${collapsed ? "none" : "block"}; }

        /* Tooltip */
        .asb-tooltip {
          display: none;
          position: absolute;
          left: calc(100% + 12px);
          top: 50%; transform: translateY(-50%);
          background: #0077B6;
          color: #CAF0F8;
          font-family: 'Poppins', sans-serif;
          font-size: 12px; font-weight: 600;
          padding: 5px 11px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 14px rgba(3,4,94,0.35);
          z-index: 200;
          border: 1px solid rgba(0,180,216,0.30);
        }
        .asb-tooltip::before {
          content: '';
          position: absolute;
          right: 100%; top: 50%; transform: translateY(-50%);
          border: 5px solid transparent;
          border-right-color: #0077B6;
        }
        ${collapsed ? ".asb-nav li:hover .asb-tooltip { display: block; }" : ""}

        .asb-divider {
          height: 1px;
          background: rgba(0,180,216,0.15);
          margin: 6px ${collapsed ? "8px" : "14px"};
          position: relative; z-index: 1;
        }

        /* Logout */
        .asb-logout-wrap {
          padding: 8px ${collapsed ? "8px" : "10px"} 22px;
          position: relative; z-index: 1;
        }
        .asb-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? "11px 0" : "9px 12px"};
          justify-content: ${collapsed ? "center" : "flex-start"};
          border-radius: 10px;
          border: none;
          background: transparent;
          color: rgba(252,165,165,0.70);
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          width: 100%;
          transition: all 0.22s;
          white-space: nowrap;
        }
        .asb-logout-btn:hover {
          background: rgba(239,68,68,0.18);
          color: #fca5a5;
          transform: translateX(${collapsed ? "0" : "3px"});
        }

        /* Logout Modal */
        .asb-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(3,4,94,0.45);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          animation: asbFadeIn 0.2s ease;
        }
        @keyframes asbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .asb-modal {
          background: linear-gradient(145deg, #03045E, #023e8a);
          border: 1px solid rgba(144,224,239,0.25);
          border-radius: 20px;
          padding: 36px 32px;
          max-width: 340px; width: 90%;
          text-align: center;
          box-shadow: 0 24px 60px rgba(3,4,94,0.40);
          animation: asbSlideUp 0.25s cubic-bezier(.4,0,.2,1);
        }
        @keyframes asbSlideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .asb-modal-icon {
          width: 58px; height: 58px;
          border-radius: 50%;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.30);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: #fca5a5;
        }
        .asb-modal h3 {
          font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 20px;
          color: #ffffff; margin: 0 0 8px;
        }
        .asb-modal p {
          font-size: 13px; color: rgba(202,240,248,0.75);
          font-family: 'Poppins', sans-serif;
          margin: 0 0 24px; line-height: 1.6;
        }
        .asb-modal-actions { display: flex; gap: 10px; }
        .asb-modal-cancel {
          flex: 1; padding: 11px;
          border-radius: 10px;
          border: 1px solid rgba(144,224,239,0.30);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.80);
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .asb-modal-cancel:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .asb-modal-confirm {
          flex: 1; padding: 11px;
          border-radius: 10px; border: none;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(239,68,68,0.28);
        }
        .asb-modal-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(239,68,68,0.40); }

        /* Responsive */
        @media (max-width: 768px) {
          .asb-fixed-hamburger { display: flex; }
          .asb-close-btn { display: flex; }
          .asb-toggle { display: none !important; }
          .asb-wrap {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 265px !important;
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"};
            transition: transform 0.35s cubic-bezier(.4,0,.2,1);
          }
          ${mobileOpen ? ".asb-fixed-hamburger { display: none; }" : ""}
          .asb-brand-text { display: block !important; }
          .asb-admin-badge { display: flex !important; }
          .asb-section-label { display: block !important; }
          .asb-link-label { display: block !important; }
          .asb-brand { padding: 0 16px !important; justify-content: flex-start !important; }
          .asb-nav { padding: 0 10px !important; }
          .asb-nav-link { padding: 9px 12px !important; justify-content: flex-start !important; }
          .asb-logout-wrap { padding: 8px 10px 22px !important; }
          .asb-logout-btn { padding: 9px 12px !important; justify-content: flex-start !important; }
        }
      `}</style>
            <button
                className="asb-fixed-hamburger"
                onClick={() => setMobileOpen(true)}
                aria-label="Open admin sidebar"
            >
                <HamburgerIcon />
            </button>
            <div className="asb-backdrop" onClick={() => setMobileOpen(false)} />
            <aside className="asb-wrap">
                <div className="asb-blobs">
                    <div className="asb-blob1" />
                    <div className="asb-blob2" />
                    <div className="asb-blob3" />
                </div>
                <div className="asb-brand">
                    <div className="asb-logo-circle">
                        <ShieldIcon />
                    </div>
                    <div className="asb-brand-text">
                        <div className="asb-brand-name">HackWave</div>
                        <div className="asb-brand-sub">Admin Dashboard</div>
                    </div>
                    <button
                        className="asb-toggle"
                        onClick={() => setCollapsed(c => !c)}
                        aria-label="Toggle sidebar"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
                            <rect x="1" y="7" width="10" height="2" rx="1" fill="currentColor"/>
                            <rect x="1" y="11" width="14" height="2" rx="1" fill="currentColor"/>
                        </svg>
                    </button>
                    <button className="asb-close-btn" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
                        <CloseIcon />
                    </button>
                </div>
                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        aria-label="Expand sidebar"
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: "40px", height: "40px", margin: "10px auto 0",
                            borderRadius: "10px", border: "1.5px solid rgba(0,180,216,0.30)",
                            background: "rgba(0,180,216,0.10)", color: "#90E0EF",
                            cursor: "pointer", transition: "background 0.2s",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
                            <rect x="1" y="7" width="10" height="2" rx="1" fill="currentColor"/>
                            <rect x="1" y="11" width="14" height="2" rx="1" fill="currentColor"/>
                        </svg>
                    </button>
                )}
                
                    <div className="asb-section-label">Main Menu</div>
                <ul className="asb-nav">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.end || false}
                                className={({ isActive }) => `asb-nav-link${isActive ? " active" : ""}`}
                                onClick={() => { handleNavClick(); if (collapsed) setCollapsed(false); }}
                            >
                                <span className="asb-icon-wrap">{item.icon}</span>
                                <span className="asb-link-label">{item.label}</span>
                            </NavLink>
                            {collapsed && <span className="asb-tooltip">{item.label}</span>}
                        </li>
                    ))}
                </ul>

                <div className="asb-divider" />

                <div className="asb-section-label">System</div>
                <ul className="asb-nav">
                    {bottomNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `asb-nav-link${isActive ? " active" : ""}`}
                                onClick={() => { handleNavClick(); if (collapsed) setCollapsed(false); }}
                            >
                                <span className="asb-icon-wrap">{item.icon}</span>
                                <span className="asb-link-label">{item.label}</span>
                            </NavLink>
                            {collapsed && <span className="asb-tooltip">{item.label}</span>}
                        </li>
                    ))}
                </ul>

                <div className="asb-divider" />

                <div className="asb-logout-wrap">
                    <button className="asb-logout-btn" onClick={() => setShowLogoutModal(true)}>
                        <span className="asb-icon-wrap" style={{ color: "inherit" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </span>
                        <span className="asb-link-label">Logout</span>
                    </button>
                    {collapsed && <span className="asb-tooltip">Logout</span>}
                </div>
            </aside>

            {showLogoutModal && createPortal(
                <div className="asb-modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="asb-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="asb-modal-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                        <h3>Logout?</h3>
                        <p>Are you sure you want to logout from the Admin Panel?</p>
                        <div className="asb-modal-actions">
                            <button className="asb-modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="asb-modal-confirm" onClick={handleLogout}>Yes, Logout</button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </>
    );
}