import { useState } from "react";

export default function Camera({ onAnalyze }: { onAnalyze: (img: string) => void }) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="page cameraPage">
      <section className="obscuraTopbar">
        <div>
          <span className="kicker">Neural Engine Status</span>
          <div className="statusLine"><i /> OBX_UNIT_042 // STANDBY</div>
        </div>
        <span className="meta">CORE_02.5.4 · SYNC_GAIN:[ON]</span>
      </section>

      {!image ? (
        <section className="uploadShell">
          <div className="uploadCardPremium">
            <div className="uploadGlow" />
            <div className="cameraOrb">⌘</div>
            <h1>Obscura</h1>
            <p>Initialize optic sensor or import high-fidelity archive for neural post-processing.</p>
            <div className="uploadActionsPremium">
              <label className="pillButton lightButton">
                ✦ Browse Data
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
              <label className="pillButton darkButton">
                📷 Camera Input
                <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} hidden />
              </label>
            </div>
          </div>
        </section>
      ) : (
        <section className="previewLayout">
          <div className="cameraFramePremium">
            <img src={image} alt="Selected preview" />
            <div className="hudLayer">
              <div className="hudTop"><span className="recDot" /> REC [H_OPTIC_BITSTREAM]</div>
              <div className="hudMetrics">ISO_400<br />SHUTTER_1/500<br />APERTURE_f/1.2</div>
              <div className="hudLock">LUCID_FOCUS_LOCKED</div>
            </div>
          </div>

          <div className="commandBar">
            <button className="pillButton darkButton" type="button" onClick={() => setImage(null)}>× Abort Process</button>
            <button className="pillButton lightButton" type="button" onClick={() => onAnalyze(image)}>✦ Execute Analysis</button>
          </div>
        </section>
      )}
    </div>
  );
}
