import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./LoginPage.css";
import corosLogo from "../admin/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img
            src={corosLogo}
            alt="COROS Pastoral UC"
            className="login-logo"
          />

          <h1 className="login-title">Creador de repertorios</h1>
          <p className="login-subtitle">Acceso jefes de día</p>
        </div>

        <div className="login-field">
          <label className="login-label">Correo</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="admin@universidad.cl"
            autoFocus
          />
        </div>

        <div className="login-field">
          <label className="login-label">Contraseña</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
          />
        </div>

        <button
          className={`login-button ${loading ? "is-loading" : ""}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}