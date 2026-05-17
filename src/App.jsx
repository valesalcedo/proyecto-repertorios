import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import PublicView  from "./components/PublicView";
import AdminPanel  from "./components/admin/AdminPanel";
import LoginPage   from "./components/auth/LoginPage";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = cargando

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mientras verifica la sesión, no renderiza nada
  if (session === undefined) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<PublicView />} />
        <Route
          path="/admin"
          element={session ? <AdminPanel /> : <LoginPage />}
        />
        <Route path="*"      element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}