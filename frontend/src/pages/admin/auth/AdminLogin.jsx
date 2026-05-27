import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../../../services/authService";
import { setCredentials } from "../../../store/authSlice";

// Using the same style object as standard Login
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; position: relative; overflow: hidden; }
  .login-bg { position: absolute; inset: 0; background-image: url('https://i.pinimg.com/736x/3d/48/cb/3d48cb05a968ee9251e6988592832a34.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: brightness(0.35) saturate(1.2); z-index: 0; }
  .login-bg-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(3,4,94,0.82) 0%, rgba(0,119,182,0.55) 50%, rgba(3,4,94,0.75) 100%); z-index: 1; }
  .login-card { display: flex; width: 720px; min-height: 520px; border-radius: 28px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.6); position: relative; z-index: 2; background: white; }
  .left-panel { width: 240px; background: linear-gradient(160deg, #0096c7 0%, #03045E 55%, #023e8a 100%); padding: 48px 28px; display: flex; flex-direction: column; justify-content: center; color: white; }
  .right-panel { flex: 1; padding: 50px 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .form-title { font-size: 22px; font-weight: 900; color: #03045E; margin-bottom: 24px; text-transform: uppercase; }
  .input-group { width: 100%; margin-bottom: 15px; position: relative; }
  .form-input { width: 100%; border: 2px solid #e0f4fa; border-radius: 12px; padding: 15px; outline: none; }
  .login-btn { width: 100%; background: #03045E; color: white; border: none; border-radius: 50px; padding: 14px; cursor: pointer; font-weight: 700; }
  .error-msg { color: #e63946; font-size: 12px; margin-bottom: 10px; }
`;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await authService.adminLogin({ email, password });
      const { user, accessToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      dispatch(setCredentials({ user, token: accessToken }));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-bg" />
        <div className="login-bg-overlay" />
        <div className="login-card">
          <div className="left-panel">
            <h2>Admin/Judge Login</h2>
            <p>Access the administrative portal.</p>
          </div>
          <div className="right-panel">
            <h1 className="form-title">Login</h1>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="input-group">
                <input className="form-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <input className="form-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              Don't have an account? <button onClick={() => navigate('/admin-register')} style={{ background: 'none', border: 'none', color: '#0096c7', cursor: 'pointer', fontWeight: 'bold' }}>Register here</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
