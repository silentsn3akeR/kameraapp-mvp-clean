export default function Analyze({ image }: { image: string | null }) {
  if (!image) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Analyse</h2>
        <p>Kein Bild ausgewählt.</p>
        <p>Gehe zur Kamera und wähle ein Bild aus.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Analyse</h2>
      <p>Erste Einschätzung deines Bildes.</p>

      <img
        src={image}
        alt="Analyse"
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          marginTop: 12,
        }}
      />

      <div style={{ marginTop: 20 }}>
        <h3>Ergebnis</h3>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={cardStyle}>
            <strong>Komposition</strong>
            <p>Motiv erkannt. Prüfe, ob es bewusst platziert ist.</p>
          </div>

          <div style={cardStyle}>
            <strong>Licht</strong>
            <p>Licht wirkt solide. Achte auf Richtung und harte Schatten.</p>
          </div>

          <div style={cardStyle}>
            <strong>Verbesserung</strong>
            <p>Teste eine zweite Aufnahme mit klarerer Bildidee.</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button>Nochmal versuchen</button>
        <button>Post vorbereiten</button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  background: "#f2f2f2",
};
