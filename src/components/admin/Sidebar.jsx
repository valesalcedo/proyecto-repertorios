export default function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">
      <button
        type="button"
        onClick={() => setView("repertorio")}
        className={`nav-button ${view === "repertorio" ? "active" : ""}`}
      >
        Repertorio de hoy
      </button>

      <button
        type="button"
        onClick={() => setView("canciones")}
        className={`nav-button ${view === "canciones" ? "active" : ""}`}
      >
        Canciones
      </button>
    </aside>
  );
}