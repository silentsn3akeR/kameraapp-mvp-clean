export default function Analyze({ image }: { image: string | null }) {
  if (!image) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Analyse</h2>
        <p>Kein Bild ausgewählt</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Analyse</h2>

      <img
        src={image}
        alt="Analyse"
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 12,
          marginTop: 12,
        }}
      />

      <div style={{ marginTop: 20 }}>
        <p>🔍 Erste Analyse (Platzhalter)</p>
        <p>→ Motiv erkannt</p>
        <p>→ Komposition mittel</p>
        <p>→ Verbesserung möglich</p>
      </div>
    </div>
  );
}
