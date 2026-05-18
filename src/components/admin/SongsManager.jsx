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
  const [expandedId, setExpandedId] = useState(null); // CAMBIO 3: acorde móvil
  const [showAddSong, setShowAddSong] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(""); // CAMBIO 4: filtro por momento

  const [newSong, setNewSong] = useState({
    titulo: "",
    categoria: "entrada",
    letra: "",
  });

  // CAMBIO 4: filtrar por búsqueda Y categoría
  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? song.categoria === filterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = async () => {
    const createdSong = await onAddSong(newSong);
    if (!createdSong) return;
    setNewSong({ titulo: "", categoria: "entrada", letra: "" });
    setShowAddSong(false);
    setSelectedSong(createdSong);
    setExpandedId(createdSong.id);
  };

  const handleEdit = async () => {
    const updatedSong = await onEditSong(editSong);
    if (!updatedSong) return;
    setEditSong(null);
    setSelectedSong(updatedSong);
    setExpandedId(updatedSong.id);
  };

  const handleDelete = async () => {
    if (!selectedSong) return;
    const deleted = await onDeleteSong(selectedSong.id);
    if (!deleted) return;
    setSelectedSong(null);
    setExpandedId(null);
  };

  // CAMBIO 3: clic en canción también expande/colapsa el detalle inline en móvil
  const handleSongClick = (song) => {
    setSelectedSong(song);
    setShowAddSong(false);
    setEditSong(null);
    setExpandedId(expandedId === song.id ? null : song.id);
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
              setExpandedId(null);
            }}
            className="add-button"
            aria-label="Agregar canción"
          >
            +
          </button>
        </div>

        {/* CAMBIO 4: selector de filtro por momento */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="select full"
        >
          <option value="">🎵 Todos los momentos</option>
          {SLOTS.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.icon} {slot.label}
            </option>
          ))}
        </select>

        <div className="songs-list">
          {filteredSongs.length === 0 && (
            <div className="empty-filter-msg">
              No hay canciones para este momento
            </div>
          )}

          {filteredSongs.map((song) => (
            <div key={song.id} className="song-list-item">
              <button
                onClick={() => handleSongClick(song)}
                className={`song-list-button ${
                  selectedSong?.id === song.id ? "active" : ""
                }`}
              >
                <div className="song-list-title">{song.titulo}</div>
                <div className="song-list-category">
                  {SLOTS.find((slot) => slot.id === song.categoria)?.label ||
                    song.categoria}
                </div>
                {/* Indicador de acorde en móvil */}
                <div className="song-list-chevron">
                  {expandedId === song.id ? "▲" : "▼"}
                </div>
              </button>

              {/* CAMBIO 3: detalle inline (solo visible en móvil) */}
              {expandedId === song.id && !editSong && (
                <div className="song-inline-detail">
                  <SongDetail
                    song={song}
                    onEdit={() => setEditSong({ ...song })}
                    onDelete={handleDelete}
                  />
                </div>
              )}

              {/* CAMBIO 3: formulario de edición inline en móvil */}
              {expandedId === song.id &&
                editSong &&
                editSong.id === song.id && (
                  <div className="song-inline-detail">
                    <SongForm
                      title="Editar canción"
                      song={editSong}
                      setSong={setEditSong}
                      primaryLabel="Guardar cambios"
                      onSubmit={handleEdit}
                      secondaryLabel="Cancelar"
                      onCancel={() => setEditSong(null)}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel de detalle — en móvil solo se muestra al agregar una canción nueva */}
      <div className={`song-detail-panel ${!showAddSong ? "mobile-hidden" : ""}`}>
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
            placeholderLyrics={
              "Escribe la letra aquí...\nUsa Enter para separar versos."
            }
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