import { SLOTS } from "../../data/slots";

export default function SongForm({
  title,
  song,
  setSong,
  primaryLabel,
  onSubmit,
  secondaryLabel,
  onCancel,
  placeholderTitle = "",
  placeholderLyrics = "",
}) {
  return (
    <div>
      <h2 className="form-title">{title}</h2>

      <div className="form">
        <div className="form-field">
          <label>TÍTULO</label>
          <input
            value={song.titulo}
            onChange={(event) =>
              setSong((currentSong) => ({
                ...currentSong,
                titulo: event.target.value,
              }))
            }
            placeholder={placeholderTitle}
            className="input large"
          />
        </div>

        <div className="form-field">
          <label>CATEGORÍA</label>
          <select
            value={song.categoria}
            onChange={(event) =>
              setSong((currentSong) => ({
                ...currentSong,
                categoria: event.target.value,
              }))
            }
            className="select full"
          >
            {SLOTS.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>LETRA</label>
          <textarea
            value={song.letra}
            onChange={(event) =>
              setSong((currentSong) => ({
                ...currentSong,
                letra: event.target.value,
              }))
            }
            rows={12}
            placeholder={placeholderLyrics}
            className="textarea"
          />
        </div>

        <div className="form-actions">
          <button onClick={onSubmit} className="primary-button">
            {primaryLabel}
          </button>

          <button onClick={onCancel} className="secondary-button">
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}