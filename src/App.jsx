// src/App.jsx
// Agrega react-router-dom si aún no lo tienes:
//   npm install react-router-dom

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicView  from "./components/PublicView";
import AdminPanel  from "./components/admin/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vista pública → el QR apunta aquí */}
        <Route path="/"       element={<PublicView />} />

        {/* Panel admin → solo para el equipo */}
        <Route path="/admin"  element={<AdminPanel />} />

        {/* Cualquier ruta desconocida redirige al inicio */}
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}