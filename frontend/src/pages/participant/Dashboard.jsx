import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockStats = [
  { id: 1, label: "Hackathons Joined", value: 8, suffix: "" },
  { id: 2, label: "Submissions Made", value: 6, suffix: "" },
  { id: 3, label: "Best Rank", value: 3, suffix: "#" },
  { id: 4, label: "Certificates", value: 5, suffix: "" },
];

const mockActiveHackathons = [
  {
    id: "h1",
    name: "Smart India Hackathon 2025",
    status: "ongoing",
    deadline: "2025-06-10",
    domain: "AI / ML",
    prize: "₹1,00,000",
    submitted: false,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  },
  {
    id: "h2",
    name: "HackWithInfy Spring Edition",
    status: "upcoming",
    deadline: "2025-07-01",
    domain: "Web Dev",
    prize: "₹50,000",
    submitted: true,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
  },
  {
    id: "h3",
    name: "DevSprint National Challenge",
    status: "ongoing",
    deadline: "2025-05-28",
    domain: "Blockchain",
    prize: "₹75,000",
    submitted: false,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
  },
];

const mockActivity = [
  { id: 1, text: "Registered for Smart India Hackathon 2025", time: "2 hours ago", type: "register" },
  { id: 2, text: "Payment successful for HackWithInfy", time: "1 day ago", type: "payment" },
  { id: 3, text: "Project submitted for DevSprint Challenge", time: "3 days ago", type: "submit" },
  { id: 4, text: "Certificate downloaded — HackFest 2024", time: "1 week ago", type: "cert" },
  { id: 5, text: "Rank #3 achieved in CodeStorm 2024", time: "2 weeks ago", type: "rank" },
];

const mockCertificates = [
  { id: "c1", hackathon: "CodeStorm 2024", type: "Rank Certificate", rank: "#3", date: "Dec 2024" },
  { id: "c2", hackathon: "HackFest 2024", type: "Participation", rank: null, date: "Oct 2024" },
  { id: "c3", hackathon: "BuildForBharat", type: "Rank Certificate", rank: "#7", date: "Aug 2024" },
];

const mockResults = [
  { id: "r1", hackathon: "CodeStorm 2024", rank: 3, score: 87, total: 100, badge: "winner" },
  { id: "r2", hackathon: "HackFest 2024", rank: 12, score: 74, total: 100, badge: "participant" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{suffix === "#" ? `#${count}` : count}</span>;
}

function AnimatedScoreBar({ score }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div className="db-score-bar-wrap">
      <div className="db-score-bar" style={{ width: `${width}%` }} />
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Zap: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Folder: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Trophy: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 7 4 7 4 14 8 14" />
      <polyline points="16 7 20 7 20 14 16 14" />
      <path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <rect x="8" y="14" width="8" height="4" rx="1" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  ),
  Award: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Bell: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Clock: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Tag: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  IndianRupee: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12" /><path d="M6 8h12" /><path d="m6 13 8.5 8" /><path d="M6 13h3" /><path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  ),
  Medal: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
      <path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" />
      <circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" />
    </svg>
  ),
  GraduationCap: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Download: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Activity: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  CheckCircle: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  ArrowRight: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Send: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  CreditCard: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Star: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

const activityIconsMap = {
  register: <Icons.Zap size={15} />,
  payment: <Icons.CreditCard size={15} />,
  submit: <Icons.Send size={15} />,
  cert: <Icons.GraduationCap size={15} />,
  rank: <Icons.Medal size={15} />,
};

const statIcons = [
  <Icons.Zap size={24} />,
  <Icons.Folder size={24} />,
  <Icons.Trophy size={24} />,
  <Icons.Award size={24} />,
];

function ViewAllBtn({ onClick }) {
  return (
    <button className="db-view-all-arrow" onClick={onClick}>
      <span>View All</span>
      <span className="db-arrow-icon"><Icons.ArrowRight size={13} /></span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userName = user?.name || user?.fullName || "Participant";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .db-wrap {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Poppins', sans-serif;
          padding: 28px 32px 48px;
        }

        /* ── Header ── */
        .db-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          animation: fadeSlideDown 0.5s ease both;
        }
        .db-username {
          font-family: 'Nunito', sans-serif;
          font-size: 26px;
          font-weight: 900;
          color: #03045e;
          line-height: 1.1;
        }
        .db-date {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
          font-weight: 500;
        }
        .db-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .db-notif-btn {
          position: relative;
          width: 42px; height: 42px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #03045e;
          
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(3,4,94,0.06);
        }
        .db-notif-btn:hover { border-color: #90e0ef; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(3,4,94,0.1); }
        .db-notif-dot {
          position: absolute;
          top: 8px; right: 8px;
          width: 8px; height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #fff;
        }
        .db-explore-btn {
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          background: #03045e;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(3,4,94,0.25);
          white-space: nowrap;
          display: flex; align-items: center; gap: 6px;
        }
        .db-explore-btn:hover { background: #0a0a8e; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(3,4,94,0.35); }

        /* ── Stats Cards ── */
        .db-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .db-stat-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          padding: 22px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: background 0.45s ease, border-color 0.45s ease, transform 0.45s ease, box-shadow 0.45s ease;
          position: relative;
          overflow: hidden;
          animation: fadeSlideUp 0.5s ease both;
        }
        .db-stat-card:nth-child(1) { animation-delay: 0.1s; }
        .db-stat-card:nth-child(2) { animation-delay: 0.15s; }
        .db-stat-card:nth-child(3) { animation-delay: 0.2s; }
        .db-stat-card:nth-child(4) { animation-delay: 0.25s; }
        .db-stat-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #90e0ef, #03045e);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s ease;
        }
        .db-stat-card:hover {
          border-color: #03045e;
          background: #03045e;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(3,4,94,0.22);
        }
        .db-stat-card:hover::before { transform: scaleX(1); }

        .db-stat-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(3,4,94,0.2);
          transition: background 0.45s ease, color 0.45s ease, transform 0.5s cubic-bezier(.34,1.56,.64,1), box-shadow 0.45s ease;
        }
        .db-stat-card:hover .db-stat-icon {
          background: #fff;
          color: #03045e;
          transform: rotate(-12deg) scale(1.08);
          box-shadow: 0 6px 18px rgba(255,255,255,0.25);
        }
        .db-stat-info { flex: 1; min-width: 0; }
        .db-stat-value {
          font-family: 'Nunito', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #03045e;
          line-height: 1;
          margin-bottom: 4px;
          transition: color 0.45s ease;
        }
        .db-stat-card:hover .db-stat-value { color: #fff; }
        .db-stat-label {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.45s ease;
        }
        .db-stat-card:hover .db-stat-label { color: #90e0ef; }

        /* ── Section Title ── */
        .db-section-title {
          font-family: 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #03045e;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .db-section-title-icon { color: #03045e; display: flex; align-items: center; }
        .db-section-line {
          flex: 1;
          height: 1.5px;
          background: linear-gradient(90deg, #e2e8f0 0%, transparent 100%);
          margin-left: 8px;
        }

        /* ── View All Arrow ── */
        .db-view-all-arrow {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 4px 10px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          color: #03045e;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .db-view-all-arrow:hover {
          background: #03045e;
          color: #fff;
          border-color: #03045e;
        }
        .db-arrow-icon {
          display: flex;
          align-items: center;
          transition: transform 0.28s cubic-bezier(.4,0,.2,1);
        }
        .db-view-all-arrow:hover .db-arrow-icon {
          transform: translateX(4px);
        }

        /* ── Active Hackathons ── */
        .db-hackathons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .db-hack-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeSlideUp 0.5s ease both;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(3,4,94,0.04);
        }
        .db-hack-card:nth-child(1) { animation-delay: 0.2s; }
        .db-hack-card:nth-child(2) { animation-delay: 0.28s; }
        .db-hack-card:nth-child(3) { animation-delay: 0.36s; }
        .db-hack-card:hover {
          border-color: #03045e;
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(3,4,94,0.13);
        }

        /* ── Card image — taller so it shows properly ── */
        .db-hack-img-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .db-hack-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s ease;
        }
        .db-hack-card:hover .db-hack-img { transform: scale(1.07); }
        .db-hack-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(3,4,94,0.08) 0%, rgba(3,4,94,0.52) 100%);
        }
        .db-hack-img-badge {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .db-hack-body { padding: 18px; }
        .db-hack-name {
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #03045e;
          line-height: 1.35;
          margin-bottom: 10px;
        }
        .db-badge {
          padding: 4px 11px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .db-badge-ongoing { background: #dcfce7; color: #16a34a; }
        .db-badge-upcoming { background: #dbeafe; color: #1d4ed8; }

        .db-hack-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .db-hack-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .db-hack-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .db-deadline {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }
        .db-deadline strong {
          color: #03045e;
          font-weight: 800;
        }
        .db-submit-btn {
          padding: 8px 15px;
          border-radius: 9px;
          border: none;
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .db-submit-btn-primary {
          background: #03045e;
          color: #fff;
          box-shadow: 0 3px 10px rgba(3,4,94,0.2);
        }
        .db-submit-btn-primary:hover { background: #0a0a8e; transform: translateY(-1px); }
        .db-submit-btn-done {
          background: #dcfce7;
          color: #16a34a;
        }

        /* ── Bottom Grid ── */
        .db-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }

        /* ── Activity ── */
        .db-activity-list {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
        }
        .db-activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.25s ease, transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeSlideUp 0.5s ease both;
          cursor: default;
        }
        .db-activity-item:last-child { border-bottom: none; }
        .db-activity-item:hover {
          background: #f0f6ff;
          transform: scale(1.012);
          box-shadow: 0 4px 16px rgba(3,4,94,0.07);
          z-index: 1;
          position: relative;
        }
        .db-act-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
          transition: transform 0.38s cubic-bezier(.34,1.56,.64,1);
        }
        .db-activity-item:hover .db-act-icon {
          transform: rotate(-14deg) scale(1.12);
        }
        .db-act-text {
          flex: 1;
          font-size: 12.5px;
          color: #334155;
          font-weight: 500;
          line-height: 1.4;
        }
        .db-act-time {
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
          font-weight: 500;
        }

        /* ── Results ── */
        .db-results-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
        }
        .db-result-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          transition: all 0.25s ease;
          animation: fadeSlideUp 0.5s ease both;
        }
        .db-result-card:hover { border-color: #90e0ef; background: #f0fdff; }
        .db-result-rank {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 900;
          color: #90e0ef;
          flex-shrink: 0;
        }
        .db-result-info { flex: 1; }
        .db-result-name {
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #03045e;
          margin-bottom: 3px;
        }
        .db-result-score {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }
        .db-result-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .db-result-badge-winner { background: #fef9c3; color: #854d0e; }
        .db-result-badge-participant { background: #f1f5f9; color: #64748b; }

        /* ── Score Bar ── */
        .db-score-bar-wrap {
          margin-top: 6px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 99px;
          overflow: hidden;
          width: 100%;
        }
        .db-score-bar {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #03045e, #90e0ef);
          transition: width 1.2s cubic-bezier(.4,0,.2,1);
          width: 0%;
        }

        /* ── Certificates ── */
        .db-certs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 8px;
        }
        .db-cert-card {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.38s ease;
          animation: fadeSlideUp 0.5s ease both;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .db-cert-card::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(144,224,239,0.12) 0%, transparent 70%);
          transition: all 0.45s ease;
          pointer-events: none;
        }
        .db-cert-card:hover {
          border-color: #03045e;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(3,4,94,0.12);
        }
        .db-cert-card:hover::after {
          top: -30px; right: -30px;
          width: 200px; height: 200px;
        }
        .db-cert-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          display: flex; align-items: center; justify-content: center;
          color: #90e0ef;
          transition: transform 0.5s cubic-bezier(.34,1.56,.64,1), box-shadow 0.4s ease;
          box-shadow: 0 4px 12px rgba(3,4,94,0.2);
        }
        .db-cert-card:hover .db-cert-icon-wrap {
          transform: rotate(-10deg) scale(1.1);
          box-shadow: 0 8px 20px rgba(3,4,94,0.28);
        }
        .db-cert-top-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .db-cert-name {
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #03045e;
          line-height: 1.3;
          flex: 1;
        }
        .db-cert-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .db-cert-type { font-size: 11px; color: #64748b; font-weight: 600; }
        .db-cert-rank-badge {
          padding: 2px 8px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          color: #90e0ef;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }
        .db-cert-date { font-size: 11px; color: #94a3b8; font-weight: 600; }
        .db-cert-download {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #03045e;
          font-family: 'Poppins', sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.28s ease;
          width: 100%;
        }
        .db-cert-download:hover {
          border-color: #03045e;
          background: #03045e;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(3,4,94,0.18);
        }
        .db-cert-download-icon { display: flex; align-items: center; transition: transform 0.28s ease; }
        .db-cert-download:hover .db-cert-download-icon { transform: translateY(2px); }

        /* ── Placeholder ── */
        .db-placeholder {
          text-align: center;
          padding: 20px 0;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* ── Animations ── */
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .db-stats { grid-template-columns: repeat(2, 1fr); }
          .db-hackathons { grid-template-columns: repeat(2, 1fr); }
          .db-certs { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .db-wrap { padding: 20px 16px 40px; }
          .db-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .db-hackathons { grid-template-columns: 1fr; }
          .db-bottom-grid { grid-template-columns: 1fr; }
          .db-certs { grid-template-columns: 1fr; }
          .db-username { font-size: 20px; }
          .db-explore-btn { display: none; }
          .db-section-title { font-size: 15px; }
         .db-header {
    position: relative;
    justify-content: center;
  }
  .db-header > div:first-child {
    text-align: center;
  }
  .db-header-right {
    position: absolute;
    right: 0;
    top: 0;
  }
        }
        @media (max-width: 480px) {
          .db-stats { grid-template-columns: 1fr 1fr; }
          .db-stat-value { font-size: 22px; }
        }
      `}</style>

      <div className="db-wrap">

    {/* ── Header ── */}
<div className="db-header">
  <div>
    <div className="db-username">{userName}</div>
    <div className="db-date">{today}</div>
  </div>
</div>

        {/* ── Stats ── */}
        <div className="db-stats">
          {mockStats.map((stat, i) => (
            <div className="db-stat-card" key={stat.id}>
              <div className="db-stat-icon">{statIcons[i]}</div>
              <div className="db-stat-info">
                <div className="db-stat-value">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="db-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Active Hackathons ── */}
        <div className="db-section-title">
          <span className="db-section-title-icon"><Icons.Zap size={17} /></span>
          Active &amp; Upcoming Hackathons
          <div className="db-section-line" />
          <ViewAllBtn onClick={() => navigate("/my-hackathons")} />
        </div>
        <div className="db-hackathons">
          {mockActiveHackathons.map((h) => (
            <div className="db-hack-card" key={h.id} onClick={() => navigate(`/hackathon/${h.id}`)}>
              <div className="db-hack-img-wrap">
                <img className="db-hack-img" src={h.image} alt={h.name} />
                <div className="db-hack-img-overlay" />
                <div className="db-hack-img-badge">
                  <span className={`db-badge db-badge-${h.status}`}>{h.status}</span>
                </div>
              </div>
              <div className="db-hack-body">
                <div className="db-hack-name">{h.name}</div>
                <div className="db-hack-meta">
                  <span className="db-hack-tag"><Icons.Tag size={11} /> {h.domain}</span>
                  <span className="db-hack-tag"><Icons.IndianRupee size={11} /> {h.prize}</span>
                </div>
                <div className="db-hack-bottom">
                  <div className="db-deadline">
                    <Icons.Clock size={13} />
                    <strong>{getDaysLeft(h.deadline)}d</strong> left
                  </div>
                  {h.submitted ? (
                    <button className="db-submit-btn db-submit-btn-done">
                      <Icons.CheckCircle size={12} /> Submitted
                    </button>
                  ) : (
                   <button
  className="db-submit-btn db-submit-btn-primary"
  onClick={(e) => { e.stopPropagation(); navigate("/my-submissions"); }}
>
  Submit <Icons.ArrowRight size={11} />
</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Activity + Results ── */}
        <div className="db-bottom-grid">
          {/* Activity */}
          <div>
            <div className="db-section-title">
              <span className="db-section-title-icon"><Icons.Activity size={16} /></span>
              Recent Activity
              <div className="db-section-line" />
              <ViewAllBtn onClick={() => navigate("/my-activity")} />
            </div>
            <div className="db-activity-list">
              {mockActivity.map((a, i) => (
                <div className="db-activity-item" key={a.id} style={{ animationDelay: `${0.1 * i}s` }}>
                  <div className="db-act-icon">{activityIconsMap[a.type]}</div>
                  <div className="db-act-text">{a.text}</div>
                  <div className="db-act-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="db-section-title">
              <span className="db-section-title-icon"><Icons.Medal size={16} /></span>
              Recent Results
              <div className="db-section-line" />
              <ViewAllBtn onClick={() => navigate("/my-results")} />
            </div>
            <div className="db-results-list">
              {mockResults.map((r, i) => (
                <div className="db-result-card" key={r.id} style={{ animationDelay: `${0.15 * i}s` }}>
                  <div className="db-result-rank">#{r.rank}</div>
                  <div className="db-result-info">
                    <div className="db-result-name">{r.hackathon}</div>
                    <div className="db-result-score">Score: {r.score}/{r.total}</div>
                    <AnimatedScoreBar score={r.score} />
                  </div>
                  <span className={`db-result-badge db-result-badge-${r.badge}`}>
                    {r.badge}
                  </span>
                </div>
              ))}
              <div className="db-placeholder">
                <Icons.Star size={14} />
                Join more hackathons to see results
              </div>
            </div>
          </div>
        </div>

        {/* ── Certificates ── */}
        <div className="db-section-title">
          <span className="db-section-title-icon"><Icons.GraduationCap size={17} /></span>
          My Certificates
          <div className="db-section-line" />
          <ViewAllBtn onClick={() => navigate("/certificates")} />
        </div>
        <div className="db-certs">
          {mockCertificates.map((c, i) => (
            <div className="db-cert-card" key={c.id} style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="db-cert-top-row">
                <div className="db-cert-icon-wrap">
                  <Icons.GraduationCap size={22} />
                </div>
                <div className="db-cert-name">{c.hackathon}</div>
              </div>
              <div className="db-cert-meta">
                <span className="db-cert-type">{c.type}</span>
                {c.rank && <span className="db-cert-rank-badge">{c.rank}</span>}
                <span className="db-cert-date">{c.date}</span>
              </div>
              <button className="db-cert-download">
                <span className="db-cert-download-icon"><Icons.Download size={13} /></span>
                Download Certificate
              </button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}