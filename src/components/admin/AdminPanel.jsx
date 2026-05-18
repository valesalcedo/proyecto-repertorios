import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./styles/AdminPanel.css";
import corosLogo from "./logo.png";

import Sidebar from "./Sidebar";
import ProgramToday from "./ProgramToday";
import SongsManager from "./SongsManager";

import { EMPTY_PROGRAM } from "../../data/slots";
import {
  getSongs,
  createSong,
  updateSong,
  deleteSong,
} from "../../services/songsService";
import { getProgramByDate, saveProgram } from "../../services/programService";

const todayStr = new Date().toLocaleDateString("es-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const todayISO = new Date().toISOString().slice(0, 10);

const handleLogout = () => supabase.auth.signOut();

export default function AdminPanel() {
  const [view, setView] = useState("repertorio");
  const [songs, setSongs] = useState([]);
  const [programa, setPrograma] = useState(EMPTY_PROGRAM);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError("");

    try {
      const songsFromDb = await getSongs();
      const todayProgram = await getProgramByDate(todayISO);

      setSongs(songsFromDb);
      setPrograma(todayProgram);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los datos desde Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgram = async () => {
    setError("");

    try {
      await saveProgram(todayISO, programa);
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo publicar el repertorio del día.");
    }
  };

  const handleAddSong = async (newSong) => {
    if (!newSong.titulo.trim() || !newSong.letra.trim()) return null;

    setError("");

    try {
      const createdSong = await createSong(newSong);
      setSongs((currentSongs) => [...currentSongs, createdSong]);
      return createdSong;
    } catch (err) {
      console.error(err);
      setError("No se pudo agregar la canción.");
      return null;
    }
  };

  const handleEditSong = async (editSong) => {
    if (!editSong.titulo.trim() || !editSong.letra.trim()) return null;

    setError("");

    try {
      const updatedSong = await updateSong(editSong);

      setSongs((currentSongs) =>
        currentSongs.map((song) =>
          song.id === updatedSong.id ? updatedSong : song
        )
      );

      return updatedSong;
    } catch (err) {
      console.error(err);
      setError("No se pudo editar la canción.");
      return null;
    }
  };

  const handleDeleteSong = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta canción?"
    );

    if (!confirmDelete) return false;

    setError("");

    try {
      await deleteSong(id);
      setSongs((currentSongs) => currentSongs.filter((song) => song.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la canción.");
      return false;
    }
  };

  const handleChangeView = (newView) => {
    setView(newView);
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="admin-panel loading-screen">
        <div>Cargando repertorio...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="topbar">
        <div className="brand">
          <img src={corosLogo} alt="COROS Pastoral UC" className="brand-logo" />

          <div className="brand-title">Creador de repertorios</div>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <button onClick={handleLogout} className="logout-button desktop-only">
          Cerrar sesión
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button
            type="button"
            onClick={() => handleChangeView("repertorio")}
            className={view === "repertorio" ? "active" : ""}
          >
            Repertorio de hoy
          </button>

          <button
            type="button"
            onClick={() => handleChangeView("canciones")}
            className={view === "canciones" ? "active" : ""}
          >
            Canciones
          </button>

          <button type="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}

      <div className="layout">
        <Sidebar view={view} setView={setView} />

        <main className="main-content">
          {error && <div className="error-message">{error}</div>}

          {view === "repertorio" && (
            <ProgramToday
              songs={songs}
              programa={programa}
              setPrograma={setPrograma}
              saved={saved}
              onSave={handleSaveProgram}
              todayStr={todayStr}
            />
          )}

          {view === "canciones" && (
            <SongsManager
              songs={songs}
              setSongs={setSongs}
              onAddSong={handleAddSong}
              onEditSong={handleEditSong}
              onDeleteSong={handleDeleteSong}
            />
          )}
        </main>
      </div>
    </div>
  );
}