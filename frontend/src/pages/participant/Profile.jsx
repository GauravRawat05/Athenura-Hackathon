import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { userService } from "../../services/userService";

const Icons = {
  User: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Phone: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Calendar: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  GraduationCap: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Building: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Link: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Code: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Edit: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Save: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  X: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Zap: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Trophy: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 7 4 7 4 14 8 14" /><polyline points="16 7 20 7 20 14 16 14" />
      <path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <rect x="8" y="14" width="8" height="4" rx="1" />
      <line x1="12" y1="18" x2="12" y2="21" /><line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  ),
  CheckCircle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  MapPin: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Camera: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Award: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Lock: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
};

const initialProfile = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  college: "",
  graduationYear: "",
  role: "Participant",
  skills: [],
  resumeLink: "",
  isEmailVerified: false,
};

const defaultProfileStats = [
  { label: "Hackathons", value: 0, icon: <Icons.Zap size={20} /> },
  { label: "Best Rank", value: "—", icon: <Icons.Trophy size={20} /> },
  { label: "Certificates", value: 0, icon: <Icons.Award size={20} /> },
];

const mapApiProfileToState = (apiUser) => ({
  fullName: apiUser.fullName || "",
  email: apiUser.email || "",
  phone: apiUser.phone ? String(apiUser.phone) : "",
  dob: apiUser.dateOfBirth ? new Date(apiUser.dateOfBirth).toISOString().slice(0, 10) : "",
  gender: apiUser.gender || "",
  college: apiUser.collegeOrUniversity || "",
  graduationYear: apiUser.graduationYear ? String(apiUser.graduationYear) : "",
  role: apiUser.role || "Participant",
  skills: Array.isArray(apiUser.skills)
    ? apiUser.skills
    : typeof apiUser.skills === "string"
      ? apiUser.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [],
  resumeLink: apiUser.resumeLink || "",
  isEmailVerified: apiUser.isEmailVerified || false,
});

function RevealSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Password Modal ────────────────────────────────────────────────────────
function PasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  // ✅ FIX 1: Sirf ek show state per field — left wala extra eye icon hata diya
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      setError("All fields are required."); return;
    }
    if (form.newPass.length < 6) {
      setError("New password must be at least 6 characters."); return;
    }
    if (form.newPass !== form.confirm) {
      setError("New password and confirm password do not match."); return;
    }
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  // ✅ FIX 2: Backdrop click se modal band
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed", inset: 0, background: "rgba(3,4,94,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, animation: "pf-fade-in 0.25s ease",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 420, margin: "0 16px",
        boxShadow: "0 24px 60px rgba(3,4,94,0.22)",
        animation: "pf-modal-in 0.35s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: "#03045e" }}>Change Password</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Update your account password</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
            <Icons.X size={20} />
          </button>
        </div>

        {["current", "newPass", "confirm"].map((field) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.Lock size={12} />
              {field === "current" ? "Current Password" : field === "newPass" ? "New Password" : "Confirm New Password"}
            </div>
            {/* ✅ FIX 1: position relative wrapper, sirf EK eye button right side pe */}
            <div style={{ position: "relative" }}>
              <input
                type={show[field] ? "text" : "password"}
                className="pf-input"
                value={form[field]}
                onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))}
                placeholder={field === "current" ? "Enter current password" : field === "newPass" ? "Min. 6 characters" : "Re-enter new password"}
                style={{ paddingRight: 44, paddingLeft: 15 }}
              />
              <button
                onClick={() => setShow(p => ({ ...p, [field]: !p[field] }))}
                style={{
                  position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#94a3b8", display: "flex", alignItems: "center", padding: 0,
                }}
              >
                {show[field] ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </div>
        ))}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#dc2626", marginBottom: 14 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#16a34a", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.CheckCircle size={14} /> Password successfully changed!
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button className="pf-cancel-btn" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
          <button className="pf-save-btn" onClick={handleSubmit} style={{ flex: 1, justifyContent: "center" }}>
            <Icons.Save size={15} /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [profileStats, setProfileStats] = useState(defaultProfileStats);
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userService.getProfile();
      const apiUser = response.data?.data || response.data;
      const mappedProfile = mapApiProfileToState(apiUser);
      setProfile(mappedProfile);
      setDraft(mappedProfile);
      if (token) {
        dispatch(setCredentials({ user: { ...user, ...mappedProfile }, token }));
      }
    } catch (err) {
      
      setError(err.response?.data?.message || "Unable to load profile. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await userService.getDashboardStats();
      const result = response.data?.data || response.data;
      setProfileStats([
        { label: "Hackathons", value: result.hackathonsJoined ?? 0, icon: <Icons.Zap size={20} /> },
        { label: "Best Rank", value: result.bestRank ? `#${result.bestRank}` : "—", icon: <Icons.Trophy size={20} /> },
        { label: "Certificates", value: result.certificates ?? 0, icon: <Icons.Award size={20} /> },
      ]);
    } catch (err) {
      
    }
  };

  useEffect(() => {
    loadProfile();
    loadDashboardStats();
  }, []);

  const handleEdit = () => { setDraft(profile); setEditMode(true); setSaved(false); setError(""); };
  const handleCancel = () => { setEditMode(false); setDraft(profile); setError(""); };
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        fullName: draft.fullName,
        phone: draft.phone ? Number(String(draft.phone).replace(/\D/g, "")) : undefined,
        dateOfBirth: draft.dob,
        collegeOrUniversity: draft.college,
        graduationYear: draft.graduationYear ? Number(draft.graduationYear) : undefined,
        skills: draft.skills,
        resumeLink: draft.resumeLink,
        gender: draft.gender,
      };
      const response = await userService.updateProfile(payload);
      const apiUser = response.data?.data || response.data;
      const updatedProfile = mapApiProfileToState(apiUser);
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setEditMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (token) {
        dispatch(setCredentials({ user: { ...user, ...updatedProfile }, token }));
      }
    } catch (err) {
      
      setError(err.response?.data?.message || err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => setDraft((p) => ({ ...p, [field]: value }));
  const handleAddSkill = () => {
    const s = newSkill.trim();
    if (s && !draft.skills.includes(s)) {
      setDraft((p) => ({ ...p, skills: [...p.skills, s] }));
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skill) =>
    setDraft((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const dp = editMode ? draft : profile;

  if (loading) {
    return (
      <div className="pf-wrap" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 16, color: '#03045e' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pf-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pf-modal-in {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pf-toast-in {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pf-pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(144,224,239,0.45); }
          70%  { box-shadow: 0 0 0 12px rgba(144,224,239,0); }
          100% { box-shadow: 0 0 0 0 rgba(144,224,239,0); }
        }

        .pf-wrap {
          min-height: 100vh;
          background: #f0f4f8;
          font-family: 'Poppins', sans-serif;
          padding: 28px 32px 60px;
        }

        /* ── Page Header ── */
        .pf-page-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 28px;
        }
        .pf-page-title { font-family: 'Nunito', sans-serif; font-size: 26px; font-weight: 900; color: #03045e; }
        .pf-page-sub { font-size: 12px; color: #94a3b8; margin-top: 3px; font-weight: 500; }

        .pf-edit-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 12px; border: none;
          background: #03045e; color: #fff;
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 4px 14px rgba(3,4,94,0.25);
        }
        .pf-edit-btn:hover { background: #0a0a8e; transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 22px rgba(3,4,94,0.35); }
        .pf-edit-btn:active { transform: scale(0.97); }

        .pf-header-right { display: flex; align-items: center; gap: 10px; }
        .pf-password-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; background: #fff; color: #475569;
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease;
        }
        .pf-password-btn:hover { border-color: #03045e; color: #03045e; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(3,4,94,0.1); }

        .pf-action-btns { display: flex; gap: 10px; }
        .pf-save-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #03045e, #0a0a8e); color: #fff;
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 4px 14px rgba(3,4,94,0.3);
        }
        .pf-save-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 22px rgba(3,4,94,0.4); }
        .pf-save-btn:active { transform: scale(0.97); }
        .pf-cancel-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; background: #fff; color: #64748b;
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease;
        }
        .pf-cancel-btn:hover { border-color: #03045e; color: #03045e; }

        /* ── Toast ── */
        .pf-toast {
          position: fixed; bottom: 28px; right: 28px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          color: #fff; padding: 14px 24px; border-radius: 14px;
          font-size: 13px; font-weight: 600; font-family: 'Poppins', sans-serif;
          display: flex; align-items: center; gap: 8px;
          z-index: 9999; box-shadow: 0 8px 28px rgba(3,4,94,0.35);
          animation: pf-toast-in 0.4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ── Hero ── */
        .pf-hero {
          border-radius: 24px; padding: 0;
          display: flex; align-items: stretch;
          margin-bottom: 20px; position: relative; overflow: hidden;
          box-shadow: 0 12px 40px rgba(3,4,94,0.28);
          min-height: 220px;
        }
        .pf-hero-bg {
          position: absolute; inset: 0;
          background-image: url('https://i.pinimg.com/1200x/e1/6f/31/e16f31f5d1edb11fb69eeab1c1a10843.jpg');
          background-size: cover; background-position: center top;
          opacity: 0.6; transition: opacity 0.5s ease;
        }
        .pf-hero:hover .pf-hero-bg { opacity: 0.9; }
        .pf-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(3,4,94,0.92) 0%, rgba(10,10,142,0.85) 55%, rgba(2,62,138,0.80) 100%);
        }
        .pf-hero-content {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 28px;
          padding: 36px; width: 100%;
        }

        .pf-avatar-wrap { position: relative; flex-shrink: 0; }
        .pf-avatar {
          width: 92px; height: 92px; border-radius: 50%;
          background: linear-gradient(135deg, #90e0ef, #48cae4);
          display: flex; align-items: center; justify-content: center;
          color: #03045e; font-family: 'Nunito', sans-serif;
          font-size: 36px; font-weight: 900;
          border: 3px solid rgba(144,224,239,0.5);
          animation: pf-pulse-ring 2.5s infinite;
          transition: transform 0.4s cubic-bezier(.34,1.56,.64,1);
          cursor: default;
        }
        .pf-avatar:hover { transform: scale(1.08); }
        .pf-avatar-edit {
          position: absolute; bottom: 2px; right: 2px;
          width: 28px; height: 28px; border-radius: 50%;
          background: #90e0ef; display: flex; align-items: center; justify-content: center;
          color: #03045e; cursor: pointer; border: 2px solid #03045e;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
        }
        .pf-avatar-edit:hover { transform: scale(1.2) rotate(15deg); }

        .pf-hero-info { flex: 1; position: relative; z-index: 1; }
        .pf-hero-name {
          font-family: 'Nunito', sans-serif; font-size: 30px; font-weight: 900;
          color: #ffffff; line-height: 1.1; margin-bottom: 8px;
          text-shadow: 0 2px 12px rgba(3,4,94,0.3);
        }
        .pf-hero-role {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          background: rgba(144,224,239,0.18); border: 1px solid rgba(144,224,239,0.35);
          border-radius: 20px; font-size: 11px; font-weight: 700;
          color: #90e0ef; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;
          backdrop-filter: blur(4px);
        }
        .pf-hero-bio {
          font-size: 13px; color: rgba(255,255,255,0.7);
          font-weight: 400; line-height: 1.65; max-width: 520px;
        }
        .pf-hero-meta { display: flex; gap: 16px; margin-top: 14px; flex-wrap: wrap; }
        .pf-hero-meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: rgba(144,224,239,0.75); font-weight: 500;
        }

        /* ── Hero Stats — default row (desktop) ── */
        .pf-hero-stats {
          display: flex; flex-direction: column; gap: 10px;
          position: relative; z-index: 1;
        }
        .pf-hero-stat {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 18px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(144,224,239,0.18);
          border-radius: 14px; min-width: 148px;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1); cursor: default;
          backdrop-filter: blur(6px);
        }
        .pf-hero-stat:hover { background: rgba(144,224,239,0.16); transform: translateX(-4px) scale(1.02); border-color: rgba(144,224,239,0.35); }
        .pf-hero-stat-icon { color: #90e0ef; display: flex; align-items: center; }
        .pf-hero-stat-val { font-family: 'Nunito', sans-serif; font-size: 22px; font-weight: 900; color: #fff; line-height: 1; }
        .pf-hero-stat-label { font-size: 10px; color: rgba(144,224,239,0.7); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

        /* ── Card ── */
        .pf-card {
          background: #fff; border: 1.5px solid #a9e1f7;
          border-radius: 20px; padding: 28px; margin-bottom: 16px;
          transition: box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
        }
        .pf-card:hover { border-color: #1b5187; box-shadow: 0 8px 30px rgba(3,4,94,0.09); transform: translateY(-1px); }

        .pf-card-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 22px; padding-bottom: 14px; border-bottom: 1.5px solid #f1f5f9;
        }
        .pf-card-header-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #03045e, #0a0a8e);
          display: flex; align-items: center; justify-content: center;
          color: #90e0ef; flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .pf-card:hover .pf-card-header-icon { transform: rotate(-6deg) scale(1.08); }
        .pf-card-title { font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 800; color: #03045e; }
        .pf-card-sub { font-size: 11px; color: #94a3b8; font-weight: 500; margin-top: 1px; }

        /* ── Fields ── */
        .pf-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .pf-field { display: flex; flex-direction: column; gap: 6px; }
        .pf-field-full { grid-column: 1 / -1; }
        .pf-field-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; color: #64748b;
          letter-spacing: 0.8px; text-transform: uppercase;
        }
        .pf-field-label svg { color: #03045e; }
        .pf-field-value {
          font-size: 14px; font-weight: 600; color: #1e293b;
          padding: 12px 15px; background: #f8fafc;
          border-radius: 10px; border: 1.5px solid #c3c4c8; line-height: 1.4;
          transition: border-color 0.2s ease;
        }
        .pf-field-value:hover { border-color: #e2e8f0; }
        .pf-field-link {
          font-size: 14px; font-weight: 600; color: #03045e;
          padding: 12px 15px; background: #f8fafc;
          border-radius: 10px; border: 1.5px solid #f1f5f9;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; word-break: break-all;
          transition: all 0.2s ease;
        }
        .pf-field-link:hover { color: #0a0a8e; border-color: #c8d6e5; text-decoration: underline; }

        /* ── Inputs ── */
        .pf-input {
          font-size: 13.5px; font-weight: 500; color: #1e293b;
          padding: 12px 15px; background: #fff;
          border-radius: 10px; border: 1.5px solid #c8d6e5;
          font-family: 'Poppins', sans-serif; outline: none; width: 100%;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .pf-input:focus { border-color: #03045e; box-shadow: 0 0 0 3px rgba(3,4,94,0.1); }
        textarea.pf-input { resize: vertical; min-height: 85px; line-height: 1.55; }

        /* ── Skills ── */
        .pf-skills-wrap { display: flex; flex-wrap: wrap; gap: 9px; }
        .pf-skill-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 15px;
          background: linear-gradient(135deg, rgba(3,4,94,0.06), rgba(3,4,94,0.03));
          border: 1.5px solid rgba(3,4,94,0.12);
          border-radius: 20px; font-size: 12px; font-weight: 700; color: #03045e;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1); cursor: default;
        }
        .pf-skill-tag:hover {
          background: #03045e; color: #90e0ef; border-color: #03045e;
          transform: translateY(-3px) scale(1.04); box-shadow: 0 6px 16px rgba(3,4,94,0.22);
        }
        .pf-skill-remove {
          display: flex; align-items: center; cursor: pointer;
          color: #94a3b8; background: none; border: none; padding: 0;
          transition: color 0.2s, transform 0.2s;
        }
        .pf-skill-remove:hover { color: #ef4444; transform: rotate(90deg); }
        .pf-skill-add { display: flex; gap: 8px; margin-top: 14px; }
        .pf-skill-add-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 10px 18px; border-radius: 10px; border: none;
          background: #03045e; color: #fff;
          font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; white-space: nowrap;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1); flex-shrink: 0;
        }
        .pf-skill-add-btn:hover { background: #0a0a8e; transform: translateY(-2px) scale(1.04); box-shadow: 0 6px 16px rgba(3,4,94,0.25); }

        /* ── Verify Badge ── */
        .pf-verify-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; background: #dcfce7;
          border-radius: 20px; font-size: 10px; font-weight: 700; color: #16a34a;
          margin-left: 8px;
        }

        /* ── Security Card ── */
        .pf-security-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 0; border-bottom: 1px solid #f1f5f9;
        }
        .pf-security-row:last-child { border-bottom: none; padding-bottom: 0; }
        .pf-security-label { font-size: 14px; font-weight: 600; color: #1e293b; }
        .pf-security-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .pf-change-btn {
          padding: 7px 16px; border-radius: 9px;
          border: 1.5px solid #e2e8f0; background: #fff; color: #475569;
          font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease; white-space: nowrap;
        }
        .pf-change-btn:hover { border-color: #03045e; color: #03045e; transform: translateY(-1px); }

        /* ── Responsive ── */

        /* Tablet (900px se neeche) — hero stats ROW mein */
        /* ── Responsive ── */

@media (max-width: 900px) {
  .pf-hero-content { flex-direction: column; align-items: center; }
  .pf-hero-info { text-align: center; width: 100%; }
  .pf-hero-meta { justify-content: center; }
  .pf-hero-stats { flex-direction: row; flex-wrap: wrap; justify-content: center; width: 100%; gap: 8px; }
  .pf-hero-stat { min-width: unset; flex: 1; min-width: 120px; }
  .pf-hero-stat:hover { transform: translateY(-3px) scale(1.02); }
}

@media (max-width: 768px) {
  .pf-wrap { padding: 20px 16px 50px; }
  .pf-field-grid { grid-template-columns: 1fr; }
  .pf-page-header { flex-direction: column; align-items: center; text-align: center; gap: 14px; }
  .pf-hero-content { padding: 20px 16px; }
  .pf-hero-name { font-size: 22px; }
  .pf-avatar { width: 76px; height: 76px; font-size: 28px; }
  .pf-header-right { flex-wrap: wrap; justify-content: center; }
  .pf-hero-info { display: flex; flex-direction: column; align-items: center; }
  .pf-hero-role { align-self: center; }
  .pf-hero-bio { text-align: center; }

  /* ✅ Mobile pe stats — 3 cards row mein, equal width, text wrap allow */
  .pf-hero-stats {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    width: 100%;
    gap: 6px;
  }
  .pf-hero-stat {
    flex: 1;
    min-width: 0;
    padding: 10px 8px;
    border-radius: 12px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
  }
  .pf-hero-stat-val { font-size: 18px; }
  .pf-hero-stat-label { font-size: 9px; letter-spacing: 0.3px; }
  .pf-hero-stat-icon { margin-bottom: 2px; }
}

@media (max-width: 480px) {
  .pf-action-btns { width: 100%; }
  .pf-save-btn, .pf-cancel-btn { flex: 1; justify-content: center; }
  .pf-hero-stat { padding: 10px 6px; }
  .pf-hero-stat-val { font-size: 17px; }
  .pf-hero-stat-label { font-size: 8px; }
}
      `}</style>

      <div className="pf-wrap">

        {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}

        {saved && (
          <div className="pf-toast">
            <Icons.CheckCircle size={16} /> Profile saved successfully!
          </div>
        )}
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', color: '#b91c1c', fontSize: 13, marginBottom: 18 }}>
            {error}
          </div>
        )}

        {/* Page Header */}
        <RevealSection delay={0}>
          <div className="pf-page-header">
            <div>
              <div className="pf-page-title">My Profile</div>
              <div className="pf-page-sub">Manage your personal information and preferences</div>
            </div>
            <div className="pf-header-right">
              {!editMode ? (
                <>
                  <button className="pf-password-btn" onClick={() => setShowPasswordModal(true)}>
                    <Icons.Lock size={15} /> Change Password
                  </button>
                  <button className="pf-edit-btn" onClick={handleEdit}>
                    <Icons.Edit size={15} /> Edit Profile
                  </button>
                </>
              ) : (
                <div className="pf-action-btns">
                  <button className="pf-cancel-btn" onClick={handleCancel}>
                    <Icons.X size={15} /> Cancel
                  </button>
                  <button className="pf-save-btn" onClick={handleSave} disabled={saving}>
                    <Icons.Save size={15} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </RevealSection>

        {/* Hero */}
        <RevealSection delay={0.05}>
          <div className="pf-hero">
            <div className="pf-hero-bg" />
            <div className="pf-hero-overlay" />
            <div className="pf-hero-content">
              <div className="pf-avatar-wrap">
                <div className="pf-avatar">{dp.fullName?.charAt(0) || "U"}</div>
                {editMode && (
                  <div className="pf-avatar-edit"><Icons.Camera size={13} /></div>
                )}
              </div>
              <div className="pf-hero-info">
                <div className="pf-hero-name">{dp.fullName}</div>
                <div className="pf-hero-role"><Icons.Shield size={11} /> {dp.role}</div>
                <div className="pf-hero-bio">{dp.gender ? `Proud ${dp.gender} participant on the platform.` : "Hackathon participant building stronger ideas."}</div>
                <div className="pf-hero-meta">
                  {dp.gender && <div className="pf-hero-meta-item"><Icons.User size={13} /> {dp.gender}</div>}
                  {dp.college && <div className="pf-hero-meta-item"><Icons.Building size={13} /> {dp.college}</div>}
                  {dp.graduationYear && <div className="pf-hero-meta-item"><Icons.GraduationCap size={13} /> Class of {dp.graduationYear}</div>}
                </div>
              </div>
              <div className="pf-hero-stats">
                {profileStats.map((s, i) => (
                  <div className="pf-hero-stat" key={i}>
                    <div className="pf-hero-stat-icon">{s.icon}</div>
                    <div>
                      <div className="pf-hero-stat-val">{s.value}</div>
                      <div className="pf-hero-stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Personal Information */}
        <RevealSection delay={0.08}>
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-icon"><Icons.User size={18} /></div>
              <div>
                <div className="pf-card-title">Personal Information</div>
                <div className="pf-card-sub">Your basic personal details</div>
              </div>
            </div>
            <div className="pf-field-grid">
              <div className="pf-field">
                <div className="pf-field-label"><Icons.User size={13} /> Full Name</div>
                {editMode
                  ? <input className="pf-input" value={draft.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Full Name" />
                  : <div className="pf-field-value">{profile.fullName}</div>}
              </div>
              <div className="pf-field">
                <div className="pf-field-label">
                  <Icons.Mail size={13} /> Email
                  <span className="pf-verify-badge"><Icons.CheckCircle size={10} /> Verified</span>
                </div>
                <div className="pf-field-value">{profile.email}</div>
              </div>
              <div className="pf-field">
                <div className="pf-field-label"><Icons.User size={13} /> Gender</div>
                {editMode
                  ? (
                    <select className="pf-input" value={draft.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  )
                  : <div className="pf-field-value">{profile.gender || "Not specified"}</div>}
              </div>
              <div className="pf-field">
                <div className="pf-field-label"><Icons.Phone size={13} /> Phone</div>
                {editMode
                  ? <input className="pf-input" value={draft.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                  : <div className="pf-field-value">{profile.phone}</div>}
              </div>
              <div className="pf-field">
                <div className="pf-field-label"><Icons.Calendar size={13} /> Date of Birth</div>
                {editMode
                  ? <input className="pf-input" type="date" value={draft.dob} onChange={(e) => handleChange("dob", e.target.value)} />
                  : <div className="pf-field-value">{profile.dob ? new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Not set"}</div>}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Academic Information */}
        <RevealSection delay={0.1}>
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-icon"><Icons.GraduationCap size={18} /></div>
              <div>
                <div className="pf-card-title">Academic Information</div>
                <div className="pf-card-sub">Your college and university details</div>
              </div>
            </div>
            <div className="pf-field-grid">
              <div className="pf-field pf-field-full">
                <div className="pf-field-label"><Icons.Building size={13} /> College / University</div>
                {editMode
                  ? <input className="pf-input" value={draft.college} onChange={(e) => handleChange("college", e.target.value)} placeholder="College or University name" />
                  : <div className="pf-field-value">{profile.college}</div>}
              </div>
              <div className="pf-field">
                <div className="pf-field-label"><Icons.Calendar size={13} /> Graduation Year</div>
                {editMode
                  ? <input className="pf-input" value={draft.graduationYear} onChange={(e) => handleChange("graduationYear", e.target.value)} placeholder="e.g. 2025" />
                  : <div className="pf-field-value">{profile.graduationYear}</div>}
              </div>
              <div className="pf-field">
                <div className="pf-field-label"><Icons.Link size={13} /> Resume Link</div>
                {editMode
                  ? <input className="pf-input" value={draft.resumeLink} onChange={(e) => handleChange("resumeLink", e.target.value)} placeholder="https://drive.google.com/..." />
                  : <a className="pf-field-link" href={profile.resumeLink} target="_blank" rel="noreferrer">
                      <Icons.Link size={13} /> {profile.resumeLink}
                    </a>}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Skills */}
        <RevealSection delay={0.12}>
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-icon"><Icons.Code size={18} /></div>
              <div>
                <div className="pf-card-title">Skills</div>
                <div className="pf-card-sub">Technologies and tools you know</div>
              </div>
            </div>
            <div className="pf-skills-wrap">
              {dp.skills.map((skill) => (
                <div className="pf-skill-tag" key={skill}>
                  {skill}
                  {editMode && (
                    <button className="pf-skill-remove" onClick={() => handleRemoveSkill(skill)}>
                      <Icons.X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {editMode && (
              <div className="pf-skill-add">
                <input
                  className="pf-input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  placeholder="Add a skill (e.g. Flutter)"
                />
                <button className="pf-skill-add-btn" onClick={handleAddSkill}>
                  <Icons.Plus size={14} /> Add
                </button>
              </div>
            )}
          </div>
        </RevealSection>

        {/* Security Settings */}
        <RevealSection delay={0.14}>
          <div className="pf-card">
            <div className="pf-card-header">
              <div className="pf-card-header-icon"><Icons.Lock size={18} /></div>
              <div>
                <div className="pf-card-title">Security Settings</div>
                <div className="pf-card-sub">Manage your account security</div>
              </div>
            </div>
            <div className="pf-security-row">
              <div>
                <div className="pf-security-label">Password</div>
                <div className="pf-security-sub">Last changed — Never</div>
              </div>
              <button className="pf-change-btn" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
            </div>
            <div className="pf-security-row">
              <div>
                <div className="pf-security-label">Email Verification</div>
                <div className="pf-security-sub">{profile.email}</div>
              </div>
              <span className="pf-verify-badge" style={{ marginLeft: 0 }}>
                <Icons.CheckCircle size={10} /> {profile.isEmailVerified ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="pf-security-row">
              <div>
                <div className="pf-security-label">Account Role</div>
                <div className="pf-security-sub">Your permission level on the platform</div>
              </div>
              <span style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: "rgba(3,4,94,0.07)", color: "#03045e", letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                {profile.role}
              </span>
            </div>
          </div>
        </RevealSection>

      </div>
    </>
  );
}