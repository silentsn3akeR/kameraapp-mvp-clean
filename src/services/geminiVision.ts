export type GeminiVisionResult = {
  score: number;
  title: string;
  suggestion: string;
  composition?: string;
  subject?: string;
  depth?: string;
  cameraMode?: string;
  aperture?: string;
  iso?: string;
  shutter?: string;
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
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function normalizeResult(raw: any): GeminiVisionResult {
  const score = Math.max(0, Math.min(100, Number(raw?.score ?? 70)));

  return {
    score,
    title: String(raw?.title || raw?.issue || "Photo analysis complete"),
    suggestion: String(raw?.suggestion || raw?.tip || "Try a cleaner subject placement and stronger framing."),
    composition: String(raw?.composition || "balanced"),
    subject: String(raw?.subject || "detected"),
    depth: String(raw?.depth || "medium"),
    cameraMode: String(raw?.cameraMode || raw?.mode || "AV"),
    aperture: String(raw?.aperture || "f/4"),
    iso: String(raw?.iso || "100"),
    shutter: String(raw?.shutter || "1/250"),
  };
}

export async function analyzeImageWithGemini(imageDataUrl: string): Promise<GeminiVisionResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env.local");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this photo as a professional photography coach. Return JSON only. No markdown.

Schema:
{
  "score": number,
  "title": "short issue title",
  "suggestion": "one short actionable improvement",
  "composition": "short composition assessment",
  "subject": "short subject assessment",
  "depth": "short depth assessment",
  "cameraMode": "AV/TV/M/P",
  "aperture": "recommended aperture",
  "iso": "recommended ISO",
  "shutter": "recommended shutter speed"
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

  return normalizeResult(JSON.parse(cleanJson(text)));
}
