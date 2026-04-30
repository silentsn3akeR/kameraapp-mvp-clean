import { useEffect, useState } from "react";
import { analyzeImageWithGemini } from "../services/geminiVision";

export default function Analyze({ image, onRetry, onScanComplete }: any) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return;

    const runAnalysis = async () => {
      try {
        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        const data = await analyzeImageWithGemini(image);

        setResult(data);
        onScanComplete(data.score);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "AI analysis failed");
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [image]);

  if (!image) return null;

  return (
    <div className="page analyzePage polishedAnalyze">
      <section className="analysisWorkbench">
        <div className="analysisVisual">
          <div className="cameraFramePremium analysisFrame">

            <div className="analysisImageWrapper">
              <img src={image} alt="Analyzed" />

              {result && (
                <div className="analysisOverlay">
                  <div className="grid" />

                  <div
                    className="focusDot"
                    style={{ top: `${result.focusY}%`, left: `${result.focusX}%` }}
                  />

                  <div
                    className="targetDot"
                    style={{ top: `${result.targetY}%`, left: `${result.targetX}%` }}
                  />
                </div>
              )}
            </div>

            <div className="analysisHud"><span className="recDot" /> GEMINI_VISION_STREAM</div>
            {isAnalyzing && <div className="scanLine" />}
          </div>
        </div>

        <aside className="analysisPanelPro">
          <div className="panelEyebrow">AI IMAGE ANALYSIS</div>

          {isAnalyzing ? (
            <>
              <div className="scoreSkeleton">...</div>
              <h2>Neural Processing</h2>
              <p>Gemini prüft Motiv, Bildaufbau, Tiefe, Licht und Kameraempfehlung.</p>
            </>
          ) : error ? (
            <>
              <div className="panelStatus error">API CHECK REQUIRED</div>
              <h2>Analyse fehlgeschlagen</h2>
              <p>{error}</p>
              <button className="pillButton darkButton" onClick={onRetry}>Retry</button>
            </>
          ) : (
            <>
              <div className="scoreHeader">
                <div>
                  <span className="scoreNumber">{result.score}</span>
                  <span className="scoreMax">/100</span>
                </div>
                <span className="panelStatus">{result.modelMode || "LIVE AI"}</span>
              </div>

              <h2>{result.title}</h2>
              <p className="analysisSummary">{result.summary}</p>
              <p className="analysisHint">{result.suggestion}</p>

              <div className="metricGrid">
                <div><small>Composition</small><strong>{result.composition}</strong></div>
                <div><small>Subject</small><strong>{result.subject}</strong></div>
                <div><small>Depth</small><strong>{result.depth}</strong></div>
                <div><small>Lighting</small><strong>{result.lighting}</strong></div>
                <div><small>Mode</small><strong>{result.cameraMode}</strong></div>
                <div><small>Settings</small><strong>{result.aperture} · ISO {result.iso} · {result.shutter}</strong></div>
              </div>

              <div className="insightColumns">
                <div>
                  <h3>Strengths</h3>
                  {(result.strengths || []).map((item: string) => <p key={item}>✓ {item}</p>)}
                </div>
                <div>
                  <h3>Improve</h3>
                  {(result.weaknesses || []).map((item: string) => <p key={item}>→ {item}</p>)}
                </div>
              </div>

              <div className="modelFooter">Model: {result.modelUsed}</div>

              <div className="commandBar panelCommands">
                <button className="pillButton darkButton" onClick={onRetry}>Retry</button>
              </div>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}
