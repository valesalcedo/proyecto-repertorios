import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #071f3f 0%, #0a3f78 60%, #2f7dbd 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 20px 60px rgba(7,31,63,0.4)",
  },
  header: {
    textAlign: "center",
    marginBottom: 36,
  },
  cross: {
    fontSize: 32,
    color: "#d2ac72",
  },
  title: {
    margin: "10px 0 4px",
    fontSize: 22,
    color: "#071f3f",
    fontWeight: "bold",
  },
  subtitle: {
    margin: 0,
    fontSize: 12,
    color: "#6f86a3",
    letterSpacing: 2,
    fontFamily: "sans-serif",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 11,
    color: "#6f86a3",
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: "sans-serif",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: 15,
    border: "1.5px solid #e3d5bd",
    borderRadius: 8,
    background: "#f8f3ea",
    color: "#12233f",
    boxSizing: "border-box",
    fontFamily: "Georgia, serif",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#2f7dbd",
    color: "#fff8ec",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 8,
    fontFamily: "Georgia, serif",
    transition: "background 0.2s",
  },
  error: {
    marginTop: 16,
    padding: "10px 14px",
    background: "#fff2f2",
    border: "1px solid #e8a2a2",
    borderRadius: 8,
    color: "#9c2f2f",
    fontSize: 13,
    fontFamily: "sans-serif",
  },
};

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setError("Credenciales incorrectas. Intenta de nuevo.");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.cross}>✝</div>
          <h1 style={S.title}>Cancionero · Admin</h1>
          <p style={S.subtitle}>UNIVERSIDAD</p>
        </div>

        <div style={S.field}>
          <label style={S.label}>CORREO</label>
          <input
            style={S.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="admin@universidad.cl"
            autoFocus
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>CONTRASEÑA</label>
          <input
            style={S.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
          />
        </div>

        <button
          style={{
            ...S.button,
            background: loading ? "#6f86a3" : "#2f7dbd",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && <div style={S.error}>{error}</div>}
      </div>
    </div>
  );
}