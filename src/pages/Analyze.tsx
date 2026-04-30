import { useEffect, useState } from "react";
import { ANALYSIS_TYPES } from "../core/constants";

export default function Analyze({ image, onRetry, onScanComplete }: any) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!image) return;
    setIsAnalyzing(true);

    const timer = setTimeout(() => {
      const random = ANALYSIS_TYPES[Math.floor(Math.random() * ANALYSIS_TYPES.length)];
      setResult(random);
      onScanComplete(random.score);
      setIsAnalyzing(false);
    }, 1800);

    return () => clearTimeout(timer);
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
