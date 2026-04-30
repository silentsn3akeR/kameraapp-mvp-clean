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
    }, 1200);

    return () => clearTimeout(timer);
  }, [image]);

  if (!image) return null;

  return (
    <div style={{ padding: 20 }}>
      {isAnalyzing ? (
        <h2>Analyzing...</h2>
      ) : (
        <>
          <img src={image} style={{ width: "100%" }} />
          <h2>{result.title}</h2>
          <p>Score: {result.score}</p>
          <p>{result.suggestion}</p>
          <button onClick={onRetry}>Retry</button>
        </>
      )}
    </div>
  );
}
