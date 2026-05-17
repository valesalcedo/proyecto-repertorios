import { useState, useEffect } from "react";
import { getProgramForDate } from "../services/publicProgramService";

// ─── Estilos ────────────────────────────────────────────────────────────────

const S = {
  app: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    maxWidth: 480,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#fdf9f3",
  },
  header: {
    background: "#1e1208",
    padding: "22px 20px 20px",
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerCross: {
    fontSize: 20,
    color: "#c9a84c",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    color: "#f5ead8",
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 0,
  },
  headerDate: {
    fontSize: 11,
    color: "#a09070",
    marginTop: 5,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "sans-serif",
    fontWeight: 300,
  },
  list: {
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: (isOpen) => ({
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ece4d6",
    overflow: "hidden",
    boxShadow: isOpen ? "0 4px 18px rgba(30,18,8,0.1)" : "none",
    transition: "box-shadow 0.2s",
  }),
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#fdf2e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  slotLabel: {
    fontSize: 10,
    color: "#a09070",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "sans-serif",
    marginBottom: 3,
  },
  songTitle: {
    fontSize: 19,
    color: "#1e1208",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  arrow: (isOpen) => ({
    color: "#c9a84c",
    fontSize: 20,
    flexShrink: 0,
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.25s",
    lineHeight: 1,
  }),
  lyricsWrapper: (isOpen) => ({
    maxHeight: isOpen ? 1000 : 0,
    overflow: "hidden",
    transition: "max-height 0.4s ease",
  }),
  lyricsInner: {
    padding: "14px 16px 18px",
    borderTop: "1px solid #f0e8d8",
  },
  lyricsText: {
    fontSize: 17,
    lineHeight: 1.95,
    color: "#3a2c1a",
    whiteSpace: "pre-line",
    fontStyle: "italic",
  },
  emptyState: {
    textAlign: "center",
    padding: "70px 30px",
    color: "#a09070",
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 18,
    fontStyle: "italic",
  },
  error: {
    margin: 20,
    padding: "14px 18px",
    background: "#fff5f5",
    border: "1px solid #f0c0c0",
    borderRadius: 10,
    color: "#8b2020",
    fontSize: 14,
    fontFamily: "sans-serif",
  },
  footer: {
    textAlign: "center",
    padding: "20px 16px",
    fontSize: 11,
    color: "#c4b89a",
    letterSpacing: 1,
    fontFamily: "sans-serif",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayLabel() {
  return new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

// ─── Componentes ─────────────────────────────────────────────────────────────

function SlotCard({ item, isOpen, onToggle }) {
  return (
    <div style={S.card(isOpen)}>
      <div style={S.cardHeader} onClick={onToggle} role="button" aria-expanded={isOpen}>
        <div style={S.icon}>{item.icon}</div>
        <div style={S.meta}>
          <div style={S.slotLabel}>{item.label}</div>
          <div style={S.songTitle}>{item.cancion.titulo}</div>
        </div>
        <div style={S.arrow(isOpen)}>⌄</div>
      </div>
      <div style={S.lyricsWrapper(isOpen)} aria-hidden={!isOpen}>
        <div style={S.lyricsInner}>
          <p style={S.lyricsText}>{item.cancion.letra}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Vista Principal ──────────────────────────────────────────────────────────

export default function PublicView() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getProgramForDate()
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (slot) =>
    setExpanded(prev => (prev === slot ? null : slot));

  return (
    <div style={S.app}>
      <header style={S.header}>
        <div style={S.headerCross}>✝</div>
        <h1 style={S.headerTitle}>Misa de Hoy</h1>
        <p style={S.headerDate}>{todayLabel()}</p>
      </header>

      {loading && (
        <div style={S.emptyState}>
          <div style={S.emptyIcon}>🕊️</div>
          <p style={S.emptyText}>Cargando programa...</p>
        </div>
      )}

      {error && (
        <div style={S.error}>
          Error al cargar el programa: {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div style={S.emptyState}>
          <div style={S.emptyIcon}>📋</div>
          <p style={S.emptyText}>No hay programa cargado para hoy.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div style={S.list}>
          {items.map(item => (
            <SlotCard
              key={item.slot}
              item={item}
              isOpen={expanded === item.slot}
              onToggle={() => toggle(item.slot)}
            />
          ))}
        </div>
      )}

      <footer style={S.footer}>
        Universidad · Comunidad de Fe
      </footer>
    </div>
  );
}