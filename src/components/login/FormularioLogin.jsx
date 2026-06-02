import React, { useState } from "react";
import logoImg from '../../assets/logo.png';

const FormularioLogin = ({ usuario, contrasena, error, setUsuario, setContrasena, iniciarSesion, onCrearCuenta }) => {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="login-card">
      <div className="card-inner">
        <div className="brand">
          <img src={logoImg} alt="logo" className="brand-logo" />
        </div>
        <h2 className="title">Iniciar Sesión</h2>
        <div className="bike-icon">🏍️</div>
        {error && <div className="login-error">{error}</div>}

        <label className="field-label">Usuario</label>
        <div className="input-with-icon">
          <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21a9 9 0 10-18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <input className="input" type="text" placeholder="usuario@ejemplo.com" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        </div>

        <label className="field-label">Contraseña</label>
        <div className="input-with-icon">
          <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <input className="input" type={showPass ? 'text' : 'password'} placeholder="********" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
          <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)} aria-label="toggle password visibility">{showPass ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12s4-7 9-7 9 7 9 7-4 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9-4-9-8 0-1.77.49-3.42 1.36-4.86M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}</button>
        </div>

        <div className="row actions">
          <label className="remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Bienvenidos</label>
          <a className="forgot" href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button className="primary-btn" onClick={iniciarSesion}>INICIAR SESIÓN →</button>

        <div className="divider" />

        <button className="secondary-btn" onClick={onCrearCuenta}> 👤 Crear Cuenta </button>

        <div className="footer">© 2025 <span className="brand-name">RevPartsPro</span> - Todos los derechos reservados.</div>
      </div>
    </div>
  );
}

export default FormularioLogin;