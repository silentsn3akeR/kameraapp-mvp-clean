import { useState } from "react";

export default function Camera() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Kamera</h2>
      <p>Starte einen Shot oder wähle ein vorhandenes Bild aus.</p>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button>Kamera öffnen</button>

        <label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <span
            style={{
              display: "inline-block",
              padding: "8px 12px",
              background: "#111",
              color: "#fff",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Bild auswählen
          </span>
        </label>
      </div>

      {image && (
        <div style={{ marginTop: 24 }}>
          <h3>Vorschau</h3>
          <img
            src={image}
            alt="Ausgewähltes Bild"
            style={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 12,
              marginTop: 12,
            }}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button>Analysieren</button>
            <button onClick={() => setImage(null)}>Neu wählen</button>
          </div>
        </div>
      )}
    </div>
  );
}
