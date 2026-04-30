import { getRouteForTask } from "./modelRouter";

export type GeminiVisionResult = {
  score: number;
  title: string;
  summary: string;
  suggestion: string;
  composition: string;
  subject: string;
  depth: string;
  lighting: string;
  cameraMode: string;
  aperture: string;
  iso: string;
  shutter: string;
  strengths: string[];
  weaknesses: string[];
  modelUsed: string;
  modelMode: string;
  focusX: number;
  focusY: number;
  targetX: number;
  targetY: number;
  moveDirection: string;
};

function normalizeArray(value: any, fallback: string[]) {
  return Array.isArray(value) ? value.slice(0, 3).map(String) : fallback;
}

function normalizePercent(value: any, fallback: number) {
  const number = Number(value ?? fallback);
  return Math.max(6, Math.min(94, Number.isFinite(number) ? number : fallback));
}

function normalizeResult(raw: any, modelUsed: string, modelMode: string): GeminiVisionResult {
  const score = Math.max(0, Math.min(100, Number(raw?.score ?? 70)));

  return {
    score,
    title: String(raw?.title || raw?.issue || "Photo analysis complete"),
    summary: String(raw?.summary || "The image has been analyzed for composition, subject clarity, depth and exposure."),
    suggestion: String(raw?.suggestion || raw?.tip || "Try a cleaner subject placement and stronger framing."),
    composition: String(raw?.composition || "Balanced but improvable"),
    subject: String(raw?.subject || "Subject detected"),
    depth: String(raw?.depth || "Medium separation"),
    lighting: String(raw?.lighting || "Usable natural light"),
    cameraMode: String(raw?.cameraMode || raw?.mode || "AV"),
    aperture: String(raw?.aperture || "f/4"),
    iso: String(raw?.iso || "100"),
    shutter: String(raw?.shutter || "1/250"),
    strengths: normalizeArray(raw?.strengths, ["Readable scene", "Usable exposure"]),
    weaknesses: normalizeArray(raw?.weaknesses, ["Framing can be stronger", "Subject separation can improve"]),
    modelUsed,
    modelMode,
    focusX: normalizePercent(raw?.focusX, 50),
    focusY: normalizePercent(raw?.focusY, 45),
    targetX: normalizePercent(raw?.targetX, 66),
    targetY: normalizePercent(raw?.targetY, 45),
    moveDirection: String(raw?.moveDirection || "refine framing"),
  };
}

function offlineFallback(errorMessage: string): GeminiVisionResult {
  console.warn("Using offline fallback analysis because proxy failed:", errorMessage);

  return normalizeResult(
    {
      score: 68,
      title: "AI route unavailable",
      summary: "Der sichere Proxy ist gerade nicht erreichbar; die App zeigt deshalb eine lokale Notfallanalyse.",
      suggestion: "Starte den Proxy mit npm run dev:all und prüfe http://localhost:8787/api/health.",
      composition: "Usable frame, needs clearer priority",
      subject: "Subject needs stronger separation",
      depth: "Foreground and background compete",
      lighting: "Contrast is usable but uneven",
      cameraMode: "AV",
      aperture: "f/2.8–f/4",
      iso: "100–400",
      shutter: "1/250+",
      strengths: ["App flow remains usable", "Image preview is intact", "Retry can use proxy route"],
      weaknesses: ["Proxy unavailable", "Live analysis unavailable", "Check backend health"],
      focusX: 50,
      focusY: 50,
      targetX: 66,
      targetY: 45,
      moveDirection: "start proxy",
    },
    "offline-fallback",
    "safe-mode"
  );
}

export async function analyzeImageWithGemini(imageDataUrl: string): Promise<GeminiVisionResult> {
  const route = getRouteForTask("photoAnalysis");

  try {
    const response = await fetch("http://localhost:8787/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl,
        model: route.model,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Proxy analysis failed");
    }

    return normalizeResult(data.result, route.model, route.mode);
  } catch (err: any) {
    return offlineFallback(err?.message || String(err));
  }
}
