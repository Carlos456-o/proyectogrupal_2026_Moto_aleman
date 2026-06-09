import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";
import logoImg from '../assets/logo.png';
import './Login.css';

const Registro = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [registrando, setRegistrando] = useState(false);
  const [tiempoEspera, setTiempoEspera] = useState(0);

  const navegar = useNavigate();

  const crearCuenta = async () => {
    if (registrando || tiempoEspera > 0) return;

    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      setMensaje(null);
      return;
    }

    if (!nombreCompleto || !email || !usuario || !contrasena || !confirmarContrasena) {
      setError("Completa todos los campos para continuar.");
      setMensaje(null);
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      setMensaje(null);
      return;
    }

    setRegistrando(true);
    setError(null);
    setMensaje(null);

    const intentarRegistro = async (intento = 1) => {
      try {
        const { error } = await supabase.auth.signUp(
          {
            email,
            password: contrasena,
          },
          {
            data: {
              full_name: nombreCompleto,
              username: usuario,
            },
          }
        );

        if (error) {
          // Si es error 429 (rate limit), reintentar
          if (error.message.includes("rate limit") || error.message.includes("429")) {
            if (intento < 5) {
              // Delays más agresivos: 5s, 15s, 30s, 60s, 120s
              const delays = [5000, 15000, 30000, 60000, 120000];
              const espera = delays[intento - 1];
              console.log(`Rate limit detectado. Reintentando en ${espera / 1000}s (intento ${intento + 1}/5)`);
              setMensaje(`Rate limit detectado. Reintentando en ${espera / 1000}s (intento ${intento + 1}/5)...`);
              await new Promise(resolve => setTimeout(resolve, espera));
              return intentarRegistro(intento + 1);
            }
          }
          
          setError(error.message);
          setMensaje(null);
          setRegistrando(false);
          setTiempoEspera(120); // 2 minutos de cooldown
          const interval = setInterval(() => {
            setTiempoEspera((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          return;
        }

        setMensaje("Cuenta creada con éxito. Revisa tu correo para confirmar tu acceso.");
        setError(null);
        setRegistrando(false);

        setTimeout(() => {
          navegar("/login");
        }, 2200);
      } catch (err) {
        console.error("Error al crear la cuenta:", err);
        setError("No se pudo crear la cuenta en este momento. Intenta más tarde.");
        setMensaje(null);
        setRegistrando(false);
        setTiempoEspera(120); // 2 minutos de cooldown
        const interval = setInterval(() => {
          setTiempoEspera((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    intentarRegistro();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="card-inner">
          <div className="brand">
            <img src={logoImg} alt="logo" className="brand-logo" />
          </div>
          <h2 className="title">Crear Cuenta</h2>
          <div className="bike-icon">🏍️</div>
          <p className="subtitle">Registra un nuevo usuario</p>

          {error && <div className="message-error">{error}</div>}
          {mensaje && <div className="message-success">{mensaje}</div>}

          <label className="field-label">Nombre Completo</label>
          <div className="input-with-icon">
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21a9 9 0 10-18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input className="input" type="text" placeholder="Ingresa tu nombre completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
          </div>

          <label className="field-label">Correo Electrónico</label>
          <div className="input-with-icon">
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input className="input" type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <label className="field-label">Nombre de Usuario</label>
          <div className="input-with-icon">
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21a9 9 0 10-18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input className="input" type="text" placeholder="Elige un nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>

          <label className="field-label">Contraseña</label>
          <div className="input-with-icon">
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input className="input" type="password" placeholder="Crea una contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
          </div>

          <label className="field-label">Confirmar Contraseña</label>
          <div className="input-with-icon">
            <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input className="input" type="password" placeholder="Confirma tu contraseña" value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)} />
          </div>

          <div className="row actions" style={{ justifyContent: "flex-start", gap: "10px" }}>
            <label className="remember"><input type="checkbox" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} /> Acepto los términos y condiciones</label>
          </div>

          <button className="primary-btn" type="button" onClick={crearCuenta} disabled={registrando || tiempoEspera > 0}>
            {registrando 
              ? "Creando cuenta..." 
              : tiempoEspera > 0
              ? `Espera ${tiempoEspera}s...`
              : "CREAR CUENTA →"}
          </button>

          <div className="divider" />

          <button className="secondary-btn" type="button" onClick={() => navegar("/login")}>← Volver al Login</button>

          <div className="footer">© 2026 <span className="brand-name">RevPartsPro</span> - Todos los derechos reservados.</div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
