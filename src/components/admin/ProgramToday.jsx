import { SLOTS } from "../../data/slots";

export default function ProgramToday({
  songs,
  programa,
  setPrograma,
  saved,
  onSave,
  todayStr,
}) {
  const handleSlotChange = (slot, songId) => {
    setPrograma((currentPrograma) => ({
      ...currentPrograma,
      [slot]: songId,
    }));
  };

  const handleViewPublic = () => {
    window.location.href = "/";
  };

  const repertorioCompleto = SLOTS.filter((slot) => slot.id !== "ofertorio").every(
    (slot) => programa[slot.id]
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Repertorio de Hoy</h1>
          <p className="page-date">{todayStr}</p>
        </div>

        <div className="publish-actions">
          <button
            onClick={onSave}
            className={`save-button ${saved ? "saved" : ""}`}
          >
            {saved ? "Publicado" : "Publicar"}
          </button>

          {saved && (
            <button
              type="button"
              onClick={handleViewPublic}
              className="view-public-button"
            >
              Ver vista pública
            </button>
          )}
        </div>
      </div>

      <div className="repertorio-grid">
        {SLOTS.map((slot) => {
          const selected = Boolean(programa[slot.id]);

          return (
            <article
              key={slot.id}
              className={`programa-card ${selected ? "selected" : ""}`}
            >
              <div className="slot-content">
                <div className="slot-title">{slot.label}</div>

                <select
                  value={programa[slot.id]}
                  onChange={(event) =>
                    handleSlotChange(slot.id, event.target.value)
                  }
                  className="select"
                >
                  <option value="">Seleccionar canción</option>

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
            </article>
          );
        })}
      </div>

      {!repertorioCompleto && (
        <div className="warning">Faltan algunos momentos por asignar</div>
      )}
    </section>
  );
}