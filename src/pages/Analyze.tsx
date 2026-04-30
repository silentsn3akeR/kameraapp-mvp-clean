import { useEffect, useState } from "react";

export default function Analyze({
  image,
  onRetry,
}: {
  image: string | null;
  onRetry: () => void;
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (!image) return;

    setIsAnalyzing(true);
    const timer = window.setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [image]);

  if (!image) {
    return (
      <div className="page">
        <h2>Analyse</h2>
        <p>Kein Bild ausgewählt.</p>
        <button className="primaryBtn" onClick={onRetry}>
          Zur Kamera
        </button>
      </div>
    );
  }

  return (
    <div className="page analysisPage">
      <div className="analysisHeader">
        <div>
          <h2>Analyse</h2>
          <p className="sub">Erste Einschätzung deines Bildes.</p>
        </div>

        {!isAnalyzing && (
          <div className="analysisActions">
            <button
              className={mode === "simple" ? "modeBtn modeBtnActive" : "modeBtn"}
              onClick={() => setMode("simple")}
              type="button"
            >
              Einfach
            </button>
            <button
              className={mode === "advanced" ? "modeBtn modeBtnActive" : "modeBtn"}
              onClick={() => setMode("advanced")}
              type="button"
            >
              Profi
            </button>
          </div>
        )}
      </div>

      {isAnalyzing ? (
        <div className="analyzingBox">
          <div className="loaderRing" />
          <strong>Szene wird analysiert...</strong>
          <p>Komposition, Licht und Kamera-Einstellungen werden vorbereitet.</p>
        </div>
      ) : (
        <>
          <div className="imageStage">
            <img src={image} alt="Analyse" className="analysisImage" />

            {showGrid && <div className="thirdsGrid" aria-hidden="true" />}

            <div className="subjectMarker">
              <span>Motiv</span>
            </div>

            <button
              className="gridToggle"
              onClick={() => setShowGrid((value) => !value)}
              type="button"
            >
              {showGrid ? "Grid aus" : "Grid an"}
            </button>
          </div>

          <div className="settingsStrip" aria-label="Empfohlene Kameraeinstellungen">
            <div>
              <span>Modus</span>
              <strong>AV</strong>
            </div>
            <div>
              <span>Blende</span>
              <strong>f/2.8</strong>
            </div>
            <div>
              <span>ISO</span>
              <strong>100</strong>
            </div>
            <div>
              <span>Zeit</span>
              <strong>1/200</strong>
            </div>
          </div>

          {mode === "simple" ? (
            <div className="heroAdvice">
              <strong>Haupt-Tipp</strong>
              <p>Setze das Motiv etwas mehr auf eine Drittellinie und lasse Blickrichtung oder Bewegung mehr Raum.</p>
            </div>
          ) : (
            <div className="cardGrid">
              <div className="card">
                <strong>Komposition</strong>
                <p>Motiv leicht mittig. Drittelregel oder mehr negativer Raum kann das Bild stärker machen.</p>
              </div>

              <div className="card">
                <strong>Licht</strong>
                <p>Weiches Licht. Gut für natürliche Motive, aber achte auf klare Trennung vom Hintergrund.</p>
              </div>

              <div className="card">
                <strong>Verbesserung</strong>
                <p>Teste einen tieferen Standpunkt oder mehr Abstand, wenn das Motiv zu eng wirkt.</p>
              </div>
            </div>
          )}

          <div className="actionRow">
            <button className="secondaryBtn" onClick={onRetry}>
              Nochmal versuchen
            </button>
            <button className="primaryBtn">Post vorbereiten</button>
          </div>
        </>
      )}
    </div>
  );
}
