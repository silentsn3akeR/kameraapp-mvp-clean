export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Missing image" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.json({
      type: "OFF_CENTER",
      scores: { composition: 70, technical: 75, overall: 73 },
      composition: {
        subject_position: "right",
        balance: "right-heavy",
        leading_lines: false,
        empty_space: "medium",
        framing: "loose"
      },
      technical: {
        sharpness: "sharp",
        exposure: "balanced",
        depth: "moderate"
      },
      suggestion: "tighten crop isolate subject"
    });
  }

  try {
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Return strict JSON photography analysis." },
                { inline_data: { mime_type: "image/jpeg", data: base64 } }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch {
      return res.json({ error: "Invalid JSON from AI" });
    }
  } catch (e) {
    return res.json({ error: "Analysis failed" });
  }
}
