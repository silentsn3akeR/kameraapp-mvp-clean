import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load .env.local first, then .env as fallback.
dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "18mb" }));

function extractBase64(dataUrl = "") {
  if (!dataUrl.includes(",")) return dataUrl;
  return dataUrl.split(",")[1];
}

function extractMimeType(dataUrl = "") {
  const match = dataUrl.match(/^data:(.*?);base64,/);
  return match?.[1] || "image/jpeg";
}

function cleanJson(text = "") {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function buildPhotoCoachPrompt() {
  return `You are Obscura, a premium AI photography coach.
Analyze the uploaded photo visually and return JSON only. No markdown.

Your job:
- Identify the real main subject if there is one.
- Judge composition, subject clarity, foreground/background depth, light, contrast and distractions.
- Give practical camera advice for the next shot, not generic motivational text.
- Be honest: if the photo is messy, say what exactly blocks the image.
- Keep every text short, premium, direct and useful.

Coordinate rules:
- focusX/focusY = current main subject position in percent of the image, 0-100.
- If no clear subject exists, choose the strongest visual anchor.
- targetX/targetY = better subject position for stronger composition, 0-100.
- Prefer rule-of-thirds points where useful: around 33/66 x and 33/66 y.
- moveDirection = short action like "move subject right", "lower camera angle", "crop tighter", "step closer".

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
}`;
}

async function callGemini({ model, imageDataUrl }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.25,
          responseMimeType: "application/json",
        },
        contents: [
          {
            parts: [
              { text: buildPhotoCoachPrompt() },
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
  if (!text) throw new Error("Gemini returned no analysis text");

  return JSON.parse(cleanJson(text));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, keyLoaded: Boolean(GEMINI_API_KEY) });
});

app.post("/api/analyze", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in .env.local" });
    }

    const { imageDataUrl, model } = req.body || {};
    if (!imageDataUrl) {
      return res.status(400).json({ error: "Missing imageDataUrl" });
    }

    const result = await callGemini({
      model: model || "gemini-2.5-flash-lite",
      imageDataUrl,
    });

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Analyze failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Obscura API proxy running on http://localhost:${PORT}`);
  console.log(`Gemini key loaded: ${Boolean(GEMINI_API_KEY)}`);
});
