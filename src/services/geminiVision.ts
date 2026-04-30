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

function extractBase64(dataUrl: string) {
  if (!dataUrl.includes(",")) return dataUrl;
  return dataUrl.split(",")[1];
}

function extractMimeType(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,/);
  return match?.[1] || "image/jpeg";
}

function cleanJson(text: string) {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

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

export async function analyzeImageWithGemini(imageDataUrl: string): Promise<GeminiVisionResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const route = getRouteForTask("photoAnalysis");

  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env.local");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${route.model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
        },
        contents: [
          {
            parts: [
              {
                text: `You are Obscura, a premium AI photography coach.
Analyze the uploaded photo visually and return JSON only. No markdown.
Be specific to the actual image. Avoid generic advice.
Keep text short, premium, direct, and useful.

Coordinate rules:
- focusX/focusY are the current main subject position in percent of the image, 0-100.
- targetX/targetY are where the subject should ideally move for stronger composition, 0-100.
- moveDirection is a short instruction like "move subject right" or "lower camera angle".

Return this exact JSON schema:
{
  "score": number from 0 to 100,
  "title": "short premium issue title",
  "summary": "one sentence about what the image currently does well or poorly",
  "suggestion": "one concrete action the photographer should try next",
  "composition": "short composition assessment",
  "subject": "short subject clarity assessment",
  "depth": "short foreground/background separation assessment",
  "lighting": "short exposure/light assessment",
  "cameraMode": "AV, TV, M or P",
  "aperture": "recommended aperture like f/2.8",
  "iso": "recommended ISO like 100",
  "shutter": "recommended shutter like 1/500",
  "strengths": ["max 3 short strengths"],
  "weaknesses": ["max 3 short weaknesses"],
  "focusX": number,
  "focusY": number,
  "targetX": number,
  "targetY": number,
  "moveDirection": "short direction"
}`,
              },
              {
                inlineData: {
                  mimeType: extractMimeType(imageDataUrl),
                  data: extractBase64(imageDataUrl),
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned no analysis text");
  }

  return normalizeResult(JSON.parse(cleanJson(text)), route.model, route.mode);
}
