import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .register-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; position: relative; background: #03045E; }
  .login-card { display: flex; width: 720px; border-radius: 28px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.6); background: white; }
  .left-panel { width: 240px; background: linear-gradient(160deg, #0096c7 0%, #03045E 55%, #023e8a 100%); padding: 48px 28px; display: flex; flex-direction: column; justify-content: center; color: white; }
  .right-panel { flex: 1; padding: 50px 48px; display: flex; flex-direction: column; align-items: center; }
  .form-title { font-size: 22px; font-weight: 900; color: #03045E; margin-bottom: 24px; text-transform: uppercase; }
  .input-group { width: 100%; margin-bottom: 15px; position: relative; }
  .form-input { width: 100%; border: 2px solid #e0f4fa; border-radius: 12px; padding: 15px; }
  .register-btn { width: 100%; background: #03045E; color: white; border-radius: 50px; padding: 14px; border: none; cursor: pointer; font-weight: 700; margin-top: 10px; }
  .error-msg { color: #e63946; font-size: 12px; margin-bottom: 10px; }
  .eye-btn { position: absolute; right: 15px; top: 15px; cursor: pointer; background: none; border: none; color: #90a4b5; }
`;

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', phone: '',
    role: 'Admin', adminSecretKey: '', judgeSecretKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      role: e.target.value,
      adminSecretKey: '',
      judgeSecretKey: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone < 0) {
      setError("Phone number cannot be negative.");
      return;
    }
    // Ensure keys match role
    const payload = { ...formData };
    if (payload.role === 'Admin') delete payload.judgeSecretKey;
    else delete payload.adminSecretKey;

    try {
      await authService.adminRegister(payload);
      alert('Registration successful');
      navigate('/admin-login');
    } catch (err) {
      setError(err.response?.data?.errors || err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="register-page">
        <div className="login-card">
          <div className="left-panel">
            <h2>Admin/Judge Register</h2>
            <p>Register new administrative accounts.</p>
          </div>
          <div className="right-panel">
            <h1 className="form-title">Register</h1>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="input-group">
                <input className="form-input" type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="input-group">
                <input className="form-input" type={showPassword ? "text" : "password"} placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "🙈"}</button>
              </div>
              <div className="input-group">
                <input className="form-input" type={showPassword ? "text" : "password"} placeholder="Confirm Password" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
              <div className="input-group">
                <input className="form-input" type="number" placeholder="Phone" min="0" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="input-group">
                <select className="form-input" value={formData.role} onChange={handleRoleChange}>
                  <option value="Admin">Admin</option>
                  <option value="Judge">Judge</option>
                </select>
              </div>
              {formData.role === 'Admin' ? (
                <div className="input-group"><input className="form-input" type="text" placeholder="Admin Secret Key" required onChange={(e) => setFormData({...formData, adminSecretKey: e.target.value})} /></div>
              ) : (
                <div className="input-group"><input className="form-input" type="text" placeholder="Judge Secret Key" required onChange={(e) => setFormData({...formData, judgeSecretKey: e.target.value})} /></div>
              )}
              <button type="submit" className="register-btn">REGISTER</button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              Already have an account? <button onClick={() => navigate('/admin-login')} style={{ background: 'none', border: 'none', color: '#0096c7', cursor: 'pointer', fontWeight: 'bold' }}>Login here</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
