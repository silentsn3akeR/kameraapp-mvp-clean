import { useState } from "react";

export default function Camera({ onAnalyze }: { onAnalyze: (img: string) => void }) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  return (
    <div className="page cameraPage">
      <section className="cameraHero">
        <div className="eyebrow">KameraApp MVP</div>
        <h2>Dein Foto-Coach für bessere Shots</h2>
        <p className="sub">
          Lade ein Bild hoch und erhalte sofort Komposition, Licht und Kamera-Tipps als visuelle Analyse.
        </p>
      </section>

      {!image ? (
        <section className="uploadCard">
          <div className="cameraMock">
            <div className="cameraTopBar">
              <span>AV</span>
              <span>ISO 100</span>
              <span>1/200</span>
            </div>
            <div className="cameraFrame">
              <div className="mockGrid" />
              <div className="mockSubject" />
              <span className="mockHint">Motiv platzieren</span>
            </div>
          </div>

          <div className="uploadActions">
            <label className="primaryBtn uploadBtn">
              Bild auswählen
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>

            <label className="secondaryBtn uploadBtn">
              Kamera öffnen
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} hidden />
            </label>
          </div>

          <p className="microCopy">MVP-Modus: Analyse ist aktuell simuliert, der Flow und die UI werden getestet.</p>
        </section>
      ) : (
        <section className="shotPreviewCard">
          <div className="previewHeader">
            <div>
              <strong>Bild bereit</strong>
              <p>Starte die Analyse und prüfe den ersten Foto-Tipp.</p>
            </div>
            <button className="secondaryBtn smallBtn" onClick={() => setImage(null)} type="button">
              Neu
            </button>
          </div>

          <img src={image} alt="Preview" className="previewImage" />

          <div className="actionRow stickyActions">
            <button className="primaryBtn" onClick={() => onAnalyze(image)} type="button">
              Jetzt analysieren
            </button>
            <button className="secondaryBtn" onClick={() => setImage(null)} type="button">
              Anderes Bild
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
