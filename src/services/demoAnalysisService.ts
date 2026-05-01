export const createDemoAnalysis = () => ({
  score: 78,
  title: "Demo-Analyse aktiv",
  summary:
    "Die App nutzt gerade eine lokale Demo-Analyse. So kannst du UI, Analyse-Flow und Overlays testen, ohne Gemini-Tokens zu verbrauchen.",
  suggestion:
    "Platziere das Hauptmotiv leicht außerhalb der Mitte, prüfe die Horizontlinie und teste einen engeren Crop.",
  strengths: [
    "Klares Hauptmotiv",
    "Gute Bildstimmung",
    "Interessante Tiefe"
  ],
  weaknesses: [
    "Motiv etwas zu mittig",
    "Ablenkungen am Bildrand",
    "Komposition könnte stärker geführt werden"
  ],
  overlays: {
    ruleOfThirds: true,
    goldenRatio: true,
    horizon: true,
    cropSuggestion: true
  },
  mode: "demo"
});