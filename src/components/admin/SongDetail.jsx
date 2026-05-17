import { SLOTS } from "../../data/slots";

export default function SongDetail({ song, onEdit, onDelete }) {
  return (
    <div>
      <div className="song-detail-header">
        <div>
          <h2>{song.titulo}</h2>
          <div className="song-category">
            {SLOTS.find((slot) => slot.id === song.categoria)?.label}
          </div>
        </div>

        <div className="song-actions">
          <button onClick={onEdit} className="secondary-button">
            ✏️ Editar
          </button>

          <button onClick={onDelete} className="danger-button">
            🗑 Eliminar
          </button>
        </div>
      </div>

      <div className="lyrics">{song.letra}</div>
    </div>
  );
}