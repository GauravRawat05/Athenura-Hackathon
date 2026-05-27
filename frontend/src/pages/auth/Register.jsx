import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .register-page {
    min-height: 100vh;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .register-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://i.pinimg.com/1200x/44/56/c2/4456c2cf3368f38400f6fe14a0f4d7eb.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.35) saturate(1.2);
    z-index: 0;
  }

  .register-bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(3,4,94,0.82) 0%, rgba(0,119,182,0.55) 50%, rgba(3,4,94,0.75) 100%);
    z-index: 1;
  }

  .back-home {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px 7px 10px;
    color: white;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer;
    background: none;
    border: none;
    transition: transform 0.2s;
  }
  .back-home:hover { transform: translateX(-2px); }
  .back-home svg { width: 14px; height: 14px; transition: transform 0.2s; }
  .back-home:hover svg { transform: translateX(-2px); }

  .register-card {
    display: flex;
    width: min(900px, 96vw);
    max-height: 96vh;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,180,216,0.18);
    position: relative;
    z-index: 2;
    animation: cardAppear 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .left-panel {
    width: 230px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #0096c7 0%, #03045E 55%, #023e8a 100%);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 44px 26px;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    width: 260px; height: 260px;
    background: rgba(144,224,239,0.10);
    bottom: -80px; left: -80px;
    transform: rotate(45deg);
    border-radius: 36px;
  }
  .left-panel::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: rgba(0,180,216,0.13);
    top: -60px; right: -60px;
    transform: rotate(45deg);
    border-radius: 28px;
  }
  .left-shape-1 {
    position: absolute;
    width: 160px; height: 160px;
    background: rgba(144,224,239,0.07);
    top: 40px; left: -40px;
    transform: rotate(45deg); border-radius: 22px;
  }
  .left-shape-2 {
    position: absolute;
    width: 120px; height: 120px;
    background: rgba(0,180,216,0.09);
    bottom: 40px; right: -22px;
    transform: rotate(45deg); border-radius: 18px;
  }

  .left-tab {
    position: absolute;
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .tab-btn {
    width: 36px;
    height: 76px;
    border-radius: 20px 0 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
    border: none;
    outline: none;
  }

  .tab-btn.signup-active {
    background: white;
    box-shadow: -4px 0 18px rgba(0,0,0,0.12);
  }
  .tab-btn.signup-active:hover { background: #f0fbff; }
  .tab-btn.signup-active .tab-text { color: #03045E; }

  .tab-btn.login-ghost {
    background: rgba(0,180,216,0.18);
    box-shadow: -3px 0 12px rgba(0,0,0,0.08);
  }
  .tab-btn.login-ghost:hover { background: rgba(0,180,216,0.32); }
  .tab-btn.login-ghost .tab-text { color: #90e0ef; }

  .tab-text {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-family: 'Nunito', sans-serif;
    white-space: nowrap;
  }

  .left-content { position: relative; z-index: 3; }
  .left-label {
    font-size: 11px; font-weight: 600;
    color: #90e0ef; letter-spacing: 0.17em;
    text-transform: uppercase; margin-bottom: 8px;
    font-family: 'Nunito', sans-serif;
  }
  .left-title {
    font-size: 26px; font-weight: 900;
    color: white; line-height: 1.1;
    font-family: 'Nunito', sans-serif;
    letter-spacing: -0.02em;
  }
  .left-title span { color: #90e0ef; }
  .left-subtitle {
    font-size: 10.5px;
    color: rgba(144,224,239,0.68);
    margin-top: 10px; line-height: 1.6; font-weight: 400;
  }

  .steps-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 22px;
    position: relative;
    z-index: 3;
  }
  .step-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(144,224,239,0.35);
    transition: all 0.3s;
  }
  .step-dot.active {
    width: 22px;
    border-radius: 4px;
    background: #90e0ef;
  }
  .step-dot.done { background: rgba(144,224,239,0.7); }

  .step-label {
    font-size: 9.5px;
    color: rgba(144,224,239,0.6);
    margin-top: 10px;
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    position: relative;
    z-index: 3;
  }

  .right-panel {
    flex: 1;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 28px 40px 24px;
    overflow-y: auto;
  }

  .step-view {
    width: 100%;
    animation: stepIn 0.32s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes stepIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .avatar-wrap {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, #03045E, #0077b6);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
    box-shadow: 0 8px 24px rgba(3,4,94,0.28);
    flex-shrink: 0;
  }
  .avatar-icon { width: 28px; height: 28px; color: white; }

  .form-title {
    font-family: 'Nunito', sans-serif;
    font-size: 17px; font-weight: 900;
    color: #03045E; letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 4px;
    flex-shrink: 0;
    text-align: center;
  }
  .form-subtitle {
    font-size: 11px;
    color: #90a4b5;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 16px;
    text-align: center;
  }

  .progress-bar-wrap {
    width: 100%;
    height: 3px;
    background: #e0f4fa;
    border-radius: 2px;
    margin-bottom: 18px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #0096c7, #00b4d8);
    border-radius: 2px;
    transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
  }

  .input-row {
    display: flex;
    gap: 12px;
    width: 100%;
  }
  .input-col { flex: 1; min-width: 0; }

  .input-group {
    width: 100%;
    position: relative;
    margin-bottom: 0;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px; height: 15px;
    color: #90e0ef;
    pointer-events: none;
    transition: color 0.3s;
    z-index: 1;
  }

  .form-input {
    width: 100%;
    border: 2px solid #e0f4fa;
    border-radius: 10px;
    padding: 18px 12px 6px 36px;
    font-size: 12.5px;
    font-family: 'Poppins', sans-serif;
    color: #03045E;
    background: #f8fdff;
    outline: none;
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }

  .form-input.input-error {
    border-color: #e63946;
    background: #fff8f8;
    box-shadow: 0 0 0 3px rgba(230,57,70,0.08);
  }

  .form-input:focus {
    border-color: #00b4d8;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.10);
  }

  .form-input.has-value + .float-label,
  .form-input:focus + .float-label {
    top: 6px;
    transform: none;
    font-size: 9.5px;
    color: #00b4d8;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .form-input.input-error + .float-label { color: #e63946 !important; }
  .form-input:focus ~ .input-icon { color: #00b4d8; }
  .form-input.input-error ~ .input-icon { color: #e63946; }

  select.form-input {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    padding-right: 30px;
  }
  .select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #90e0ef;
    width: 14px; height: 14px;
  }

  .float-label {
    position: absolute;
    left: 36px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: #adb5bd;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    pointer-events: none;
    transition: top 0.2s ease, transform 0.2s ease, font-size 0.2s ease,
                color 0.2s ease, letter-spacing 0.2s ease, font-weight 0.2s ease;
  }

  select.form-input + .float-label,
  select.form-input.has-value + .float-label {
    top: 6px;
    transform: none;
    font-size: 9.5px;
    color: #00b4d8;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  /* Date input — label always floated when browser shows placeholder */
  input[type="date"].form-input + .float-label {
    top: 6px;
    transform: none;
    font-size: 9.5px;
    color: #00b4d8;
    font-weight: 700;
    letter-spacing: 0.08em;
  }
  /* Hide the native date placeholder text until focused or has value */
  input[type="date"].form-input:not(:focus):not(.has-value) {
    color: transparent;
  }
  input[type="date"].form-input:not(:focus):not(.has-value)::-webkit-datetime-edit {
    color: transparent;
  }
  input[type="date"].form-input:focus,
  input[type="date"].form-input.has-value {
    color: #03045E;
  }
  input[type="date"].form-input:focus::-webkit-datetime-edit,
  input[type="date"].form-input.has-value::-webkit-datetime-edit {
    color: #03045E;
  }

  .error-msg {
    font-size: 10px;
    color: #e63946;
    margin-top: 3px;
    margin-left: 4px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    display: flex;
    align-items: center;
    gap: 3px;
    min-height: 15px;
    animation: errPop 0.22s ease;
  }
  @keyframes errPop {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .field-wrap { width: 100%; margin-bottom: 6px; }

  /* Skills */
  .skills-wrap {
    width: 100%;
    border: 2px solid #e0f4fa;
    border-radius: 10px;
    background: #f8fdff;
    padding: 8px 10px 6px 36px;
    min-height: 48px;
    cursor: text;
    transition: border-color 0.3s, box-shadow 0.3s;
    position: relative;
  }
  .skills-wrap:focus-within {
    border-color: #00b4d8;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.10);
  }
  .skills-wrap.input-error { border-color: #e63946; background: #fff8f8; }
  .skills-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
  }
  .skill-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #e0f4fa;
    color: #0077b6;
    border-radius: 20px;
    padding: 2px 10px 2px 8px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  }
  .skill-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: #0096c7;
    font-size: 13px;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
  }
  .skill-remove:hover { color: #e63946; }
  .skill-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 12px;
    font-family: 'Poppins', sans-serif;
    color: #03045E;
    min-width: 80px;
    flex: 1;
    padding: 2px 0;
  }
  .skills-label {
    position: absolute;
    left: 36px;
    top: 6px;
    font-size: 9.5px;
    color: #00b4d8;
    font-weight: 700;
    letter-spacing: 0.08em;
    font-family: 'Poppins', sans-serif;
    pointer-events: none;
  }
  .skills-icon {
    position: absolute;
    left: 12px;
    top: 14px;
    width: 15px; height: 15px;
    color: #90e0ef;
  }

  /* Gender pills */
  .gender-row {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-top: 2px;
  }
  .gender-pill {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 2px solid #e0f4fa;
    border-radius: 10px;
    padding: 10px 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: #adb5bd;
    font-family: 'Poppins', sans-serif;
    transition: all 0.2s;
    background: #f8fdff;
    user-select: none;
  }
  .gender-pill input { display: none; }
  .gender-pill.selected {
    border-color: #00b4d8;
    background: #e0f9ff;
    color: #0077b6;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.10);
  }
  .gender-pill:hover:not(.selected) { border-color: #90e0ef; color: #0096c7; }
  .gender-pill svg { width: 14px; height: 14px; }

  /* Terms */
  .terms-row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
    margin-top: 2px;
  }
  .terms-checkbox {
    width: 14px; height: 14px;
    accent-color: #0096c7;
    margin-top: 2px;
    flex-shrink: 0;
    cursor: pointer;
  }
  .terms-text {
    font-size: 11px;
    color: #6c757d;
    font-family: 'Poppins', sans-serif;
    line-height: 1.5;
  }
  .terms-text a { color: #00b4d8; text-decoration: none; font-weight: 500; }
  .terms-text a:hover { color: #03045E; }
  .terms-err { font-size: 10px; color: #e63946; display: block; margin-top: 2px; }

  /* Buttons */
  .btn-row {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-top: 2px;
  }
  .btn-back {
    flex: 0 0 auto;
    background: transparent;
    color: #0096c7;
    border: 2px solid #e0f4fa;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 12px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-back:hover { border-color: #00b4d8; background: #f0fbff; }

  .register-btn {
    flex: 1;
    background: linear-gradient(135deg, #03045E 0%, #0096c7 100%);
    color: white; border: none;
    border-radius: 50px;
    padding: 11px 34px;
    font-size: 12.5px; font-weight: 700;
    font-family: 'Nunito', sans-serif;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 5px 18px rgba(3,4,94,0.32);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
  }
  .register-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 50px;
  }
  .register-btn span { position: relative; z-index: 1; }
  .register-btn:hover::after { opacity: 1; }
  .register-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0,180,216,0.42); }
  .register-btn:active { transform: translateY(0); }
  .register-btn.loading { pointer-events: none; }

  .spinner {
    display: inline-block;
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 6px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider-row {
    width: 100%; display: flex;
    align-items: center; gap: 10px;
    margin-top: 12px; margin-bottom: 10px;
  }
  .divider-line { flex: 1; height: 1px; background: #e9ecef; }
  .divider-text { font-size: 10.5px; color: #adb5bd; white-space: nowrap; font-weight: 500; }

  .social-row { display: flex; gap: 12px; width: 100%; }
  .social-btn {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 8px 14px;
    border: 1.5px solid #e9ecef;
    border-radius: 50px; background: white;
    cursor: pointer;
    font-size: 12px; font-weight: 600;
    font-family: 'Poppins', sans-serif;
    color: #495057;
    transition: all 0.25s ease;
    text-decoration: none;
  }
  .social-btn:hover {
    border-color: #00b4d8; color: #03045E;
    box-shadow: 0 4px 14px rgba(0,180,216,0.17);
    transform: translateY(-2px);
  }
  .social-icon { width: 15px; height: 15px; }

  .register-page.fade-out { animation: fadeOut 0.4s ease forwards; }
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  .section-div {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0 10px;
  }
  .section-div-line { flex: 1; height: 1px; background: #e0f4fa; }
  .section-div-text {
    font-size: 10px;
    color: #90e0ef;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-family: 'Nunito', sans-serif;
    white-space: nowrap;
  }

  /* ── MOBILE ── */
  @media (max-width: 700px) {
    .register-page { align-items: stretch; height: 100svh; overflow: hidden; }
    .register-card {
      flex-direction: column; width: 100%;
      max-height: 100svh; height: 100svh;
      border-radius: 0; box-shadow: none;
    }
    .left-panel {
      width: 100%; flex-shrink: 0; min-height: unset;
      padding: 48px 28px 16px; align-items: center;
      text-align: center; border-radius: 0 0 36px 36px;
      justify-content: center;
    }
    .left-tab { position: static; transform: none; flex-direction: row; margin-top: 12px; gap: 8px; }
    .tab-btn { width: 76px; height: 32px; border-radius: 20px; }
    .tab-text { writing-mode: horizontal-tb; transform: none; font-size: 10px; }
    .left-content { text-align: center; }
    .left-title { font-size: 22px; }
    .left-subtitle { font-size: 10px; margin-top: 4px; }
    .steps-indicator { justify-content: center; margin-top: 10px; }
    .step-label { margin-top: 6px; }

    .right-panel {
      flex: 1;
      min-height: 0;
      padding: 16px 18px 14px;
      justify-content: flex-start;
      overflow-y: auto;
    }

    /* Avatar — sits inside right panel, no overlap trick */
    .avatar-wrap {
      width: 52px; height: 52px;
      margin-bottom: 8px;
      margin-top: 0;
      border: 3px solid #e0f4fa;
      box-shadow: 0 6px 20px rgba(3,4,94,0.18);
    }
    .avatar-icon { width: 22px; height: 22px; }

    .form-title { font-size: 15px; margin-bottom: 2px; }
    .form-subtitle { font-size: 10px; margin-bottom: 10px; }
    .progress-bar-wrap { margin-bottom: 12px; }

    .input-row { flex-direction: column; gap: 0; }
    .input-col { margin-bottom: 0; }
    .form-input { padding: 16px 10px 5px 34px; font-size: 12px; border-radius: 9px; }
    .float-label { font-size: 11.5px; left: 34px; }
    .form-input.has-value + .float-label,
    .form-input:focus + .float-label { font-size: 9px; top: 5px; }
    input[type="date"].form-input + .float-label { font-size: 9px; top: 5px; }

    .field-wrap { margin-bottom: 4px; }
    .error-msg { font-size: 9.5px; min-height: 14px; }
    .terms-row { margin-bottom: 8px; }
    .register-btn { padding: 10px; font-size: 12px; }
    .divider-row { margin-top: 8px; margin-bottom: 8px; }
    .social-row { gap: 10px; }
    .social-btn { padding: 7px 10px; font-size: 11.5px; }
    .gender-pill { padding: 8px 4px; font-size: 11px; }
    .btn-row { margin-top: 6px; }
  }

  @media (max-width: 380px) {
    .left-panel { padding: 44px 16px 14px; }
    .right-panel { padding: 12px 14px 10px; }
    .form-title { font-size: 14px; }
    .field-wrap { margin-bottom: 3px; }
  }
`;

const STEPS = [
  { label: "Basic Info" },
  { label: "Profile" },
  { label: "Account" },
];

const SKILL_SUGGESTIONS = ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "UI/UX", "ML", "SQL", "Flutter"];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", password: "", confirmPassword: "",
    phone: "", dateOfBirth: "", gender: "",
    collegeOrUniversity: "", graduationYear: "",
    skills: [],
    resumeLink: "",
    secretKey: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const goToLogin = () => { setLeaving(true); setTimeout(() => navigate("/login"), 420); };
  const goHome    = () => { setLeaving(true); setTimeout(() => navigate("/"), 420); };

  const setField = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const setGender = (val) => {
    setForm(prev => ({ ...prev, gender: val }));
    if (errors.gender) setErrors(prev => ({ ...prev, gender: "" }));
  };

  const addSkill = (val) => {
    const s = val.trim();
    if (s && !form.skills.includes(s)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
      if (errors.skills) setErrors(prev => ({ ...prev, skills: "" }));
    }
    setSkillInput("");
  };

  const removeSkill = (s) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
  };

  const inputClass = (field) =>
    `form-input${errors[field] ? " input-error" : ""}${form[field] ? " has-value" : ""}`;

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.firstName.trim()) e.firstName = "First name is required";
      if (!form.lastName.trim())  e.lastName  = "Last name is required";
      if (!form.email.trim())     e.email     = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
      if (!form.phone.trim())     e.phone     = "Phone number is required";
      else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = "Invalid phone number";
    }
    if (s === 1) {
      if (!form.gender) e.gender = "Please select a gender";
      if (!form.collegeOrUniversity.trim()) e.collegeOrUniversity = "University/College is required";
      if (!form.graduationYear) e.graduationYear = "Graduation year is required";
      if (form.skills.length === 0) e.skills = "Add at least one skill";
    }
    if (s === 2) {
      if (!form.password)          e.password        = "Password is required";
      else if (form.password.length < 6)   e.password = "Min 6 characters required";
      else if (!/[A-Z]/.test(form.password)) e.password = "Need at least 1 uppercase letter";
      else if (!/[^A-Za-z0-9]/.test(form.password)) e.password = "Need at least 1 special character";
      if (!form.confirmPassword)   e.confirmPassword  = "Please confirm your password";
      else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
      if (!agreed) e.agreed = "You must accept the Terms of Service";
    }
    return e;
  };

  const handleNext = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    const e = validateStep(2);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const payload = {
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        gender: form.gender,
      };

      if (form.phone && form.phone.trim()) {
        const cleanedPhone = form.phone.replace(/\D/g, "");
        if (cleanedPhone) {
          payload.phone = Number(cleanedPhone);
        }
      }

      if (form.dateOfBirth && form.dateOfBirth.trim()) {
        payload.dateOfBirth = form.dateOfBirth;
      }

      if (form.collegeOrUniversity && form.collegeOrUniversity.trim()) {
        payload.collegeOrUniversity = form.collegeOrUniversity;
      }

      if (form.graduationYear) {
        payload.graduationYear = parseInt(form.graduationYear, 10);
      }

      if (form.resumeLink && form.resumeLink.trim()) {
        payload.resumeLink = form.resumeLink;
      }

      if (form.skills && form.skills.length > 0) {
        payload.skills = form.skills;
      }

      if (form.secretKey && form.secretKey.trim()) {
        payload.secretKey = form.secretKey.trim();
      }

      const res = await authService.register(payload);
      
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed. Please check your network.";
      setErrors({ server: msg });
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const yearOptions = [];
  for (let y = new Date().getFullYear() + 5; y >= 2010; y--) yearOptions.push(y);

  return (
    <>
      <style>{styles}</style>
      <div className={`register-page${leaving ? " fade-out" : ""}`}>
        <div className="register-bg" />
        <div className="register-bg-overlay" />

        <button className="back-home" onClick={goHome}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Home
        </button>

        <div className="register-card">

          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="left-shape-1" /><div className="left-shape-2" />
            <div className="left-content">
              <p className="left-label">Join us today</p>
              <h2 className="left-title">SIGN <span>UP</span></h2>
              <p className="left-subtitle">Create your account &amp;<br />start your journey.</p>
            </div>

            <div className="steps-indicator" style={{ marginTop: 18 }}>
              {STEPS.map((st, i) => (
                <div key={i} className={`step-dot${i === step ? " active" : i < step ? " done" : ""}`} />
              ))}
            </div>
            <p className="step-label">Step {step + 1} — {STEPS[step].label}</p>

            <div className="left-tab">
              <button className="tab-btn signup-active" title="Sign Up">
                <span className="tab-text">SIGN UP</span>
              </button>
              <button className="tab-btn login-ghost" onClick={goToLogin} title="Go to Login">
                <span className="tab-text">LOGIN</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="avatar-wrap">
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>

            <h1 className="form-title">CREATE ACCOUNT</h1>
            <p className="form-subtitle">{STEPS[step].label} — Step {step + 1} of {STEPS.length}</p>

            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>

            {/* ── STEP 0: Basic Info ── */}
            {step === 0 && (
              <div className="step-view" style={{ width: "100%" }}>
                <div className="section-div">
                  <div className="section-div-line" />
                  <span className="section-div-text">Personal Details</span>
                  <div className="section-div-line" />
                </div>

                <div className="input-row" style={{ marginBottom: 0 }}>
                  <div className="input-col">
                    <div className="field-wrap">
                      <div className="input-group">
                        <input className={inputClass("firstName")} id="reg-fn"
                          name="firstName" type="text" autoComplete="given-name"
                          placeholder="" value={form.firstName} onChange={setField("firstName")} />
                        <label className="float-label" htmlFor="reg-fn">First Name</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      {errors.firstName ? <p className="error-msg">⚠ {errors.firstName}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                  <div className="input-col">
                    <div className="field-wrap">
                      <div className="input-group">
                        <input className={inputClass("lastName")} id="reg-ln"
                          name="lastName" type="text" autoComplete="family-name"
                          placeholder="" value={form.lastName} onChange={setField("lastName")} />
                        <label className="float-label" htmlFor="reg-ln">Last Name</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      {errors.lastName ? <p className="error-msg">⚠ {errors.lastName}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                </div>

                <div className="field-wrap">
                  <div className="input-group">
                    <input className={inputClass("email")} id="reg-email"
                      name="email" type="email" autoComplete="email"
                      placeholder="" value={form.email} onChange={setField("email")} />
                    <label className="float-label" htmlFor="reg-email">Email Address</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  {errors.email ? <p className="error-msg">⚠ {errors.email}</p> : <div style={{ minHeight: 15 }} />}
                </div>

                <div className="input-row" style={{ marginBottom: 0 }}>
                  <div className="input-col">
                    <div className="field-wrap">
                      <div className="input-group">
                        <input className={inputClass("phone")} id="reg-phone"
                          name="phone" type="tel" autoComplete="tel"
                          placeholder="" value={form.phone} onChange={setField("phone")} />
                        <label className="float-label" htmlFor="reg-phone">Phone Number</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18C1.61 2.1 2.5 1.21 3.56 1.21H6.56a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.06 6.06l.87-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      {errors.phone ? <p className="error-msg">⚠ {errors.phone}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                  <div className="input-col">
                    <div className="field-wrap">
                      <div className="input-group">
                        <input
                          className={`form-input${errors.dateOfBirth ? " input-error" : ""}${form.dateOfBirth ? " has-value" : ""}`}
                          id="reg-dob" name="dateOfBirth" type="date"
                          value={form.dateOfBirth} onChange={setField("dateOfBirth")}
                          max={new Date().toISOString().split("T")[0]}
                        />
                        <label className="float-label" htmlFor="reg-dob">Date of Birth</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      {errors.dateOfBirth ? <p className="error-msg">⚠ {errors.dateOfBirth}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                </div>

                <div className="btn-row">
                  <button className="register-btn" onClick={handleNext}>
                    <span>Next →</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Profile (was step 2) ── */}
            {step === 1 && (
              <div className="step-view" style={{ width: "100%" }}>
                <div className="section-div">
                  <div className="section-div-line" />
                  <span className="section-div-text">Academic &amp; Profile Info</span>
                  <div className="section-div-line" />
                </div>

                {/* Gender */}
                <div className="field-wrap">
                  <p style={{ fontSize: 10, color: "#00b4d8", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'Poppins', sans-serif", marginBottom: 6, textTransform: "uppercase" }}>Gender</p>
                  <div className="gender-row">
                    {["Male", "Female", "Other"].map(g => (
                      <label key={g} className={`gender-pill${form.gender === g ? " selected" : ""}`}>
                        <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => setGender(g)} />
                        {g === "Male" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="10" cy="14" r="5"/><line x1="19" y1="5" x2="14.65" y2="9.35"/><polyline points="15 5 19 5 19 9"/>
                          </svg>
                        )}
                        {g === "Female" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/>
                          </svg>
                        )}
                        {g === "Other" && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="22"/>
                          </svg>
                        )}
                        {g}
                      </label>
                    ))}
                  </div>
                  {errors.gender ? <p className="error-msg">⚠ {errors.gender}</p> : <div style={{ minHeight: 15 }} />}
                </div>

                {/* College + Grad Year */}
                <div className="input-row" style={{ marginBottom: 0 }}>
                  <div className="input-col" style={{ flex: 2 }}>
                    <div className="field-wrap">
                      <div className="input-group">
                        <input className={inputClass("collegeOrUniversity")} id="reg-college"
                          name="collegeOrUniversity" type="text"
                          placeholder="" value={form.collegeOrUniversity} onChange={setField("collegeOrUniversity")} />
                        <label className="float-label" htmlFor="reg-college">College / University</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      {errors.collegeOrUniversity ? <p className="error-msg">⚠ {errors.collegeOrUniversity}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                  <div className="input-col" style={{ flex: 1 }}>
                    <div className="field-wrap">
                      <div className="input-group">
                        <select className={`form-input has-value${errors.graduationYear ? " input-error" : ""}`}
                          id="reg-gradyear" value={form.graduationYear}
                          onChange={setField("graduationYear")}>
                          <option value="">—</option>
                          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <label className="float-label" htmlFor="reg-gradyear">Grad Year</label>
                        <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      {errors.graduationYear ? <p className="error-msg">⚠ {errors.graduationYear}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="field-wrap">
                  <div style={{ position: "relative" }}>
                    <svg className="skills-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <div className={`skills-wrap${errors.skills ? " input-error" : ""}`}
                      onClick={() => document.getElementById("skill-input-field").focus()}>
                      <span className="skills-label">Skills</span>
                      <div className="skills-inner" style={{ marginTop: 12 }}>
                        {form.skills.map(s => (
                          <span key={s} className="skill-tag">
                            {s}
                            <button className="skill-remove" onClick={(e) => { e.stopPropagation(); removeSkill(s); }}>×</button>
                          </span>
                        ))}
                        <input
                          id="skill-input-field"
                          className="skill-input"
                          placeholder={form.skills.length === 0 ? "Type a skill & press Enter…" : "Add more…"}
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); }
                            if (e.key === "Backspace" && !skillInput && form.skills.length) {
                              removeSkill(form.skills[form.skills.length - 1]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 5 }}>
                    {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 6).map(s => (
                      <button key={s} onClick={() => addSkill(s)}
                        style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, border: "1px solid #e0f4fa", background: "#f8fdff", color: "#0096c7", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 600, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.target.style.background = "#e0f4fa"; }}
                        onMouseLeave={e => { e.target.style.background = "#f8fdff"; }}>
                        + {s}
                      </button>
                    ))}
                  </div>
                  {errors.skills ? <p className="error-msg">⚠ {errors.skills}</p> : <div style={{ minHeight: 10 }} />}
                </div>

                {/* Resume Link */}
                <div className="field-wrap">
                  <div className="input-group">
                    <input className={`form-input${form.resumeLink ? " has-value" : ""}`}
                      id="reg-resume" name="resumeLink" type="url"
                      placeholder="" value={form.resumeLink} onChange={setField("resumeLink")} />
                    <label className="float-label" htmlFor="reg-resume">Resume / Portfolio URL</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <div style={{ minHeight: 10 }} />
                </div>

                <div className="btn-row">
                  <button className="btn-back" onClick={handleBack}>← Back</button>
                  <button className="register-btn" onClick={handleNext}>
                    <span>Next →</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Account (was step 1) ── */}
            {step === 2 && (
              <div className="step-view" style={{ width: "100%" }}>
                <div className="section-div">
                  <div className="section-div-line" />
                  <span className="section-div-text">Account Security</span>
                  <div className="section-div-line" />
                </div>

                <div className="input-row" style={{ marginBottom: 0 }}>
                  <div className="input-col">
                    <div className="field-wrap">
                      <div className="input-group">
                        <input className={inputClass("password")} id="reg-pw"
                          name="password" type="password" autoComplete="new-password"
                          placeholder="" value={form.password} onChange={setField("password")} />
                        <label className="float-label" htmlFor="reg-pw">Password</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      {errors.password ? <p className="error-msg">⚠ {errors.password}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                  <div className="input-col">
                    <div className="field-wrap">
                      <div className="input-group">
                        <input className={inputClass("confirmPassword")} id="reg-cpw"
                          name="confirmPassword" type="password" autoComplete="new-password"
                          placeholder="" value={form.confirmPassword} onChange={setField("confirmPassword")} />
                        <label className="float-label" htmlFor="reg-cpw">Confirm Password</label>
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      {errors.confirmPassword ? <p className="error-msg">⚠ {errors.confirmPassword}</p> : <div style={{ minHeight: 15 }} />}
                    </div>
                  </div>
                </div>

                <div className="field-wrap" style={{ width: "100%" }}>
                  <div className="input-group">
                    <input className={`form-input${form.secretKey ? " has-value" : ""}`} id="reg-skey"
                      name="secretKey" type="password"
                      placeholder="" value={form.secretKey || ""} onChange={setField("secretKey")} />
                    <label className="float-label" htmlFor="reg-skey">Secret Key (Optional - for Admin/Judge/University)</label>
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div style={{ minHeight: 15 }} />
                </div>

                <div style={{ width: "100%", background: "#f0fbff", borderRadius: 8, padding: "8px 12px", marginBottom: 10, border: "1px solid #e0f4fa" }}>
                  <p style={{ fontSize: 10.5, color: "#0096c7", fontFamily: "'Poppins', sans-serif", lineHeight: 1.7, margin: 0 }}>
                    Password must be min 6 chars, include <strong>1 uppercase</strong> letter &amp; <strong>1 special character</strong> (e.g. @, #, !)
                  </p>
                </div>

                <div className="terms-row">
                  <input className="terms-checkbox" type="checkbox" id="reg-terms"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors(p => ({ ...p, agreed: "" }));
                    }}
                  />
                  <label className="terms-text" htmlFor="reg-terms">
                    I agree to the <a href="/terms">Terms of Service</a> and{" "}
                    <a href="/privacy">Privacy Policy</a>
                    {errors.agreed && <span className="terms-err">⚠ {errors.agreed}</span>}
                  </label>
                </div>

                <div className="divider-row">
                  <div className="divider-line" />
                  <span className="divider-text">Or Sign Up With</span>
                  <div className="divider-line" />
                </div>

                <div className="social-row" style={{ marginBottom: 12 }}>
                  <a href="#" className="social-btn">
                    <svg className="social-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </a>
                  <a href="#" className="social-btn">
                    <svg className="social-icon" viewBox="0 0 24 24">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                </div>

                <div className="btn-row">
                  <button className="btn-back" onClick={handleBack}>← Back</button>
                  <button className={`register-btn${loading ? " loading" : ""}`} onClick={handleSubmit} type="button">
                    {loading && <span className="spinner" />}
                    <span>{loading ? "Creating account..." : "Create Account"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}