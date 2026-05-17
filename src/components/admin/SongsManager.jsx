import { useState } from "react";
import { SLOTS } from "../../data/slots";
import SongDetail from "./SongDetail";
import SongForm from "./SongForm";

export default function SongsManager({
  songs,
  setSongs,
  onAddSong,
  onEditSong,
  onDeleteSong,
}) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [showAddSong, setShowAddSong] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newSong, setNewSong] = useState({
    titulo: "",
    categoria: "entrada",
    letra: "",
  });

  const filteredSongs = songs.filter((song) =>
    song.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    const createdSong = await onAddSong(newSong);

    if (!createdSong) return;

    setNewSong({ titulo: "", categoria: "entrada", letra: "" });
    setShowAddSong(false);
    setSelectedSong(createdSong);
  };

  const handleEdit = async () => {
    const updatedSong = await onEditSong(editSong);

    if (!updatedSong) return;

    setEditSong(null);
    setSelectedSong(updatedSong);
  };

  const handleDelete = async () => {
    if (!selectedSong) return;

    const deleted = await onDeleteSong(selectedSong.id);

    if (!deleted) return;

    setSelectedSong(null);
  };

  return (
    <section className="songs-view">
      <div className="songs-list-panel">
        <div className="search-row">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar canción..."
            className="input"
          />

          <button
            onClick={() => {
              setShowAddSong(true);
              setSelectedSong(null);
              setEditSong(null);
            }}
            className="add-button"
            aria-label="Agregar canción"
          >
            +
          </button>
        </div>

        <div className="songs-list">
          {filteredSongs.map((song) => (
            <button
              key={song.id}
              onClick={() => {
                setSelectedSong(song);
                setShowAddSong(false);
                setEditSong(null);
              }}
              className={`song-list-button ${
                selectedSong?.id === song.id ? "active" : ""
              }`}
            >
              <div className="song-list-title">{song.titulo}</div>
              <div className="song-list-category">
                {SLOTS.find((slot) => slot.id === song.categoria)?.label ||
                  song.categoria}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="song-detail-panel">
        {selectedSong && !editSong && !showAddSong && (
          <SongDetail
            song={selectedSong}
            onEdit={() => setEditSong({ ...selectedSong })}
            onDelete={handleDelete}
          />
        )}

        {editSong && (
          <SongForm
            title="Editar canción"
            song={editSong}
            setSong={setEditSong}
            primaryLabel="Guardar cambios"
            onSubmit={handleEdit}
            secondaryLabel="Cancelar"
            onCancel={() => setEditSong(null)}
          />
        )}

        {showAddSong && (
          <SongForm
            title="Nueva canción"
            song={newSong}
            setSong={setNewSong}
            primaryLabel="Agregar canción"
            onSubmit={handleAdd}
            secondaryLabel="Cancelar"
            onCancel={() => setShowAddSong(false)}
            placeholderTitle="Nombre de la canción"
            placeholderLyrics={"Escribe la letra aquí...\nUsa Enter para separar versos."}
          />
        )}

        {!selectedSong && !showAddSong && !editSong && (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <div className="empty-title">
              Selecciona una canción para ver su letra
            </div>
            <div className="empty-subtitle">
              o presiona + para agregar una nueva
            </div>
          </div>
        )}
      </div>
    </section>
  );
}