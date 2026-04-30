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

        const data = await analyzeImageWithGemini(image);

        setResult(data);
        onScanComplete(data.score);
      } catch (err: any) {
        console.error(err);
        setError("AI analysis failed");
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [image]);

  if (!image) return null;

  return (
    <div className="page analyzePage">
      <div className="cameraFramePremium">
        <img src={image} alt="Analyzed" />
        {isAnalyzing && <div className="scanLine" />}
      </div>

      {isAnalyzing ? (
        <div className="analysisLoading">Neural Processing...</div>
      ) : error ? (
        <div className="analysisCardPremium">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="pillButton darkButton" onClick={onRetry}>Retry</button>
        </div>
      ) : (
        <div className="analysisCardPremium">
          <div className="scoreBlock">
            <span>{result.score}</span>
            <small>/100</small>
          </div>

          <h2>{result.title}</h2>
          <p className="analysisHint">{result.suggestion}</p>

          <div className="commandBar">
            <button className="pillButton darkButton" onClick={onRetry}>Retry</button>
          </div>
        </div>
      )}
    </div>
  );
}
