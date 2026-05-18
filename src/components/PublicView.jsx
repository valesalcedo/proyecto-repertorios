import { useState, useEffect } from "react";
import { getProgramForDate } from "../services/publicProgramService";
import corosLogo from "./admin/logo.png";
import "./PublicView.css";

function todayLabel() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function LiturgicalIcon({ slot }) {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (slot) {
    case "entrada":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6.5 10v9h11v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );

    case "penitencial":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M8.5 12.5 12 16l3.5-3.5" />
          <path d="M12 16V6" />
          <path d="M7 8.5c0-1.5 1-2.5 2.5-2.5S12 7 12 8.5c0-1.5 1-2.5 2.5-2.5S17 7 17 8.5" />
        </svg>
      );

    case "aclamacion":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M6 5.5h9a3 3 0 0 1 3 3V19H9a3 3 0 0 0-3 3Z" />
          <path d="M6 5.5v16.5" />
          <path d="M9 9h6" />
          <path d="M9 12h6" />
        </svg>
      );

    case "ofertorio":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M7 6h10" />
          <path d="M8.5 6c0 4 1.5 6 3.5 6s3.5-2 3.5-6" />
          <path d="M12 12v4" />
          <path d="M9 20h6" />
          <path d="M7.5 16h9" />
        </svg>
      );

    case "santo":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M12 4v4" />
          <path d="M12 16v4" />
          <path d="M4 12h4" />
          <path d="M16 12h4" />
          <path d="m6.5 6.5 2.8 2.8" />
          <path d="m14.7 14.7 2.8 2.8" />
          <path d="m17.5 6.5-2.8 2.8" />
          <path d="m9.3 14.7-2.8 2.8" />
        </svg>
      );

    case "cordero":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M7.5 14.5c-1.4 0-2.5-1.1-2.5-2.5S6.1 9.5 7.5 9.5c.4-2 2.1-3.5 4.5-3.5 2.7 0 5 2 5 4.8 1.1.3 2 1.4 2 2.7 0 1.7-1.3 3-3 3H9.5" />
          <path d="M9 17v2" />
          <path d="M14 17v2" />
        </svg>
      );

    case "comunion":
      return (
        <svg {...commonProps} aria-hidden="true">
          <circle cx="12" cy="6.5" r="2.5" />
          <path d="M8 11h8" />
          <path d="M9 11c0 4 1.2 6 3 6s3-2 3-6" />
          <path d="M8 17h8" />
          <path d="M9.5 20h5" />
        </svg>
      );

    case "salida":
      return (
        <svg {...commonProps} aria-hidden="true">
          <path d="M4.5 5.5h8v13h-8z" />
          <path d="M12.5 12H20" />
          <path d="m17 8.5 3.5 3.5-3.5 3.5" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps} aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function SlotCard({ item, isOpen, onToggle }) {
  return (
    <article className={`public-card ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="public-card-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="public-card-icon">
          <LiturgicalIcon slot={item.slot} />
        </div>

        <div className="public-card-meta">
          <div className="public-card-label">{item.label}</div>
          <div className="public-card-song">{item.cancion.titulo}</div>
        </div>

        <div className={`public-card-arrow ${isOpen ? "is-open" : ""}`}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      <div className={`public-lyrics-wrapper ${isOpen ? "is-open" : ""}`}>
        <div className="public-lyrics-inner">
          <p className="public-lyrics-text">{item.cancion.letra}</p>
        </div>
      </div>
    </article>
  );
}

export default function PublicView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getProgramForDate()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (slot) => {
    setExpanded((prev) => (prev === slot ? null : slot));
  };

  return (
    <div className="public-page-bg">
      <div className="public-app">
        <header className="public-header">
          <img
            src={corosLogo}
            alt="COROS Pastoral UC"
            className="public-header-logo"
          />
          <div className="public-header-text">
            <h1 className="public-header-title">Repertorio de Hoy</h1>
            <p className="public-header-date">{todayLabel()}</p>
          </div>
        </header>

        {loading && (
          <div className="public-empty-state">
            <div className="public-empty-icon">
              <LiturgicalIcon slot="aclamacion" />
            </div>
            <p className="public-empty-text">Cargando repertorio...</p>
          </div>
        )}

        {error && (
          <div className="public-error">
            Error al cargar el repertorio: {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="public-empty-state">
            <div className="public-empty-icon">
              <LiturgicalIcon slot="ofertorio" />
            </div>
            <p className="public-empty-text">
              No hay repertorio cargado para hoy.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <main className="public-list">
            {items.map((item) => (
              <SlotCard
                key={item.slot}
                item={item}
                isOpen={expanded === item.slot}
                onToggle={() => toggle(item.slot)}
              />
            ))}
          </main>
        )}

        <footer className="public-footer">COROS Pastoral UC</footer>
      </div>
    </div>
  );
}