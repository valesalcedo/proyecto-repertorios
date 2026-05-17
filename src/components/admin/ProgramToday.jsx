import { SLOTS } from "../../data/slots";

export default function ProgramToday({
  songs,
  programa,
  setPrograma,
  saved,
  onSave,
}) {
  const handleSlotChange = (slot, songId) => {
    setPrograma((currentPrograma) => ({
      ...currentPrograma,
      [slot]: songId,
    }));
  };

  const programaCompleto = SLOTS.filter((slot) => slot.id !== "ofertorio").every(
    (slot) => programa[slot.id]
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Programa de Hoy</h1>
          <p>Asigna una canción a cada momento de la misa o celebración</p>
        </div>

        <button
          onClick={onSave}
          className={`save-button ${saved ? "saved" : ""}`}
        >
          {saved ? "✓ Guardado" : "Guardar programa"}
        </button>
      </div>

      <div className="programa-list">
        {SLOTS.map((slot, index) => {
          const selected = songs.find(
            (song) => song.id === programa[slot.id]
          );

          return (
            <article
              key={slot.id}
              className={`programa-card ${selected ? "selected" : ""}`}
            >
              <div className="slot-icon">{slot.icon}</div>

              <div className="slot-content">
                <div className="slot-number">MOMENTO {index + 1}</div>
                <div className="slot-title">{slot.label}</div>

                <select
                  value={programa[slot.id]}
                  onChange={(event) =>
                    handleSlotChange(slot.id, event.target.value)
                  }
                  className="select"
                >
                  <option value="">— Seleccionar canción —</option>

                  {songs
                    .filter((song) => song.categoria === slot.id)
                    .map((song) => (
                      <option key={song.id} value={song.id}>
                        {song.titulo}
                      </option>
                    ))}

                  {songs.some((song) => song.categoria !== slot.id) && (
                    <option disabled>──────────</option>
                  )}

                  {songs
                    .filter((song) => song.categoria !== slot.id)
                    .map((song) => (
                      <option key={song.id} value={song.id}>
                        {song.titulo}
                      </option>
                    ))}
                </select>
              </div>

              {selected && (
                <div className="song-preview">
                  {selected.letra.split("\n")[0]}…
                </div>
              )}
            </article>
          );
        })}
      </div>

      {!programaCompleto && (
        <div className="warning">⚠️ Faltan algunos momentos por asignar</div>
      )}
    </section>
  );
}