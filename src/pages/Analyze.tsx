export default function Analyze({ image, onRetry }: { image: string | null; onRetry: () => void; }) {
  if (!image) {
    return (
      <div className="page">
        <h2>Analyse</h2>
        <p>Kein Bild ausgewählt.</p>
        <button className="primaryBtn" onClick={onRetry}>Zur Kamera</button>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Analyse</h2>
      <p className="sub">Erste Einschätzung deines Bildes.</p>

      <img src={image} alt="Analyse" className="previewImage" />

      <div className="cardGrid">
        <div className="card">
          <strong>Komposition</strong>
          <p>Motiv erkannt. Prüfe die Platzierung.</p>
        </div>

        <div className="card">
          <strong>Licht</strong>
          <p>Achte auf Richtung und Kontrast.</p>
        </div>

        <div className="card">
          <strong>Verbesserung</strong>
          <p>Teste Perspektive oder Abstand.</p>
        </div>
      </div>

      <div className="actionRow">
        <button className="secondaryBtn" onClick={onRetry}>Nochmal versuchen</button>
        <button className="primaryBtn">Post vorbereiten</button>
      </div>
    </div>
  );
}
