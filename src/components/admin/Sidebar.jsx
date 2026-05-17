import { SLOTS } from "../../data/slots";

export default function Sidebar({ view, setView, songs, programa }) {
  return (
    <nav className="sidebar">
      {[
        { id: "programa", label: "Programa de Hoy", icon: "📋" },
        { id: "canciones", label: "Canciones", icon: "🎵" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`nav-button ${view === item.id ? "active" : ""}`}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div className="sidebar-section-title">PROGRAMA ACTUAL</div>

      {SLOTS.map((slot) => {
        const cancion = songs.find(
          (song) => song.id === Number(programa[slot.id])
        );

        return (
          <div
            key={slot.id}
            className={`sidebar-slot ${cancion ? "has-song" : ""}`}
          >
            <div className="sidebar-slot-label">{slot.label}</div>
            <div className="sidebar-slot-song">
              {cancion ? cancion.titulo : "—"}
            </div>
          </div>
        );
      })}
    </nav>
  );
}