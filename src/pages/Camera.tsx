import { useState } from "react";

export default function Camera({ onAnalyze }: { onAnalyze: (img: string) => void; }) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  return (
    <div className="page">
      <h2>Shot erstellen</h2>
      <p className="sub">Wähle ein Bild oder starte direkt.</p>

      <div className="actionRow">
        <button className="secondaryBtn">Kamera öffnen</button>

        <label className="primaryBtn">
          Bild auswählen
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </label>
      </div>

      {image && (
        <div>
          <img src={image} alt="Preview" className="previewImage" />

          <div className="actionRow">
            <button className="primaryBtn" onClick={() => onAnalyze(image)}>Analysieren</button>
            <button className="secondaryBtn" onClick={() => setImage(null)}>Neu wählen</button>
          </div>
        </div>
      )}
    </div>
  );
}
