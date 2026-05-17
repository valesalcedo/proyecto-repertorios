import { useEffect, useState } from "react";
import "./AdminPanel.css";

import Sidebar from "./Sidebar";
import ProgramToday from "./ProgramToday";
import SongsManager from "./SongsManager";

import { EMPTY_PROGRAM } from "../../data/slots";
import { getSongs, createSong, updateSong, deleteSong } from "../../services/songsService";
import { getProgramByDate, saveProgram } from "../../services/programService";

const todayStr = new Date().toLocaleDateString("es-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const todayISO = new Date().toISOString().slice(0, 10);

export default function AdminPanel() {
  const [view, setView] = useState("programa");
  const [songs, setSongs] = useState([]);
  const [programa, setPrograma] = useState(EMPTY_PROGRAM);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el programa del día.");
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

  if (loading) {
    return (
      <div className="admin-panel loading-screen">
        <div>Cargando cancionero...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">✝</span>
          <div>
            <div className="brand-title">Cancionero · Admin</div>
            <div className="brand-subtitle">UNIVERSIDAD</div>
          </div>
        </div>

        <div className="today">{todayStr}</div>
      </header>

      <div className="layout">
        <Sidebar
          view={view}
          setView={setView}
          songs={songs}
          programa={programa}
        />

        <main className="main-content">
          {error && <div className="error-message">{error}</div>}

          {view === "programa" && (
            <ProgramToday
              songs={songs}
              programa={programa}
              setPrograma={setPrograma}
              saved={saved}
              onSave={handleSaveProgram}
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