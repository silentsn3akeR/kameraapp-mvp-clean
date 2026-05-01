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

  const cropLeft = Math.max(8, Math.min(34, (result?.targetX || 50) - 26));
  const cropTop = Math.max(8, Math.min(28, (result?.targetY || 45) - 20));

  return (
    <div className="page analyzePage polishedAnalyze">
      <section className="analysisWorkbench">
        <div className="analysisVisual">
          <div className="cameraFramePremium analysisFrame">
            <div className="analysisImageWrapper">
              <img src={image} alt="Analyzed" />

              {result && (
                <div className="analysisOverlay">
                  <div className="negativeSpaceOverlay">
                    <span className="spaceZone spaceLeft">NEGATIVE SPACE</span>
                    <span className="spaceZone spaceTop">BREATHING ROOM</span>
                  </div>

                  <div
                    className="cropSuggestionBox"
                    style={{ left: `${cropLeft}%`, top: `${cropTop}%` }}
                  >
                    <span>AI CROP</span>
                  </div>

                  <div className="grid" />

                  <svg className="leadingLinesOverlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <marker id="flowArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L6,3 L0,6 Z" />
                      </marker>
                    </defs>
                    <path className="leadingLine cyan" d={`M 8 78 Q ${result.focusX || 50} ${result.focusY || 55}, ${result.targetX || 66} ${result.targetY || 45}`} markerEnd="url(#flowArrow)" />
                    <path className="leadingLine gold" d="M 18 96 Q 35 72, 51 50 T 82 14" />
                    <path className="leadingLine soft" d="M 0 58 Q 30 54, 52 48 T 100 38" />
                  </svg>

                  <svg className="guidanceLine" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <marker id="guidanceArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L8,4 L0,8 Z" />
                      </marker>
                    </defs>
                    <line
                      x1={result.focusX}
                      y1={result.focusY}
                      x2={result.targetX}
                      y2={result.targetY}
                      markerEnd="url(#guidanceArrow)"
                    />
                  </svg>

                  <div className="flowTag">LINIENFÜHRUNG</div>

                  <div
                    className="focusDot"
                    style={{ top: `${result.focusY}%`, left: `${result.focusX}%` }}
                  />

                  <div
                    className="targetDot"
                    style={{ top: `${result.targetY}%`, left: `${result.targetX}%` }}
                  />

                  <div
                    className="guidanceLabel"
                    style={{ top: `${result.targetY}%`, left: `${result.targetX}%` }}
                  >
                    {result.moveDirection || "refine framing"}
                  </div>
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

              <div className="cropPreviewCard">
                <small>Suggested Reframe</small>
                <div className="cropPreviewThumb">
                  <img src={image} alt="Crop preview" />
                  <div className="cropPreviewMask" />
                </div>
                <p>Use more breathing room around the subject and remove visual noise near the edges.</p>
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
