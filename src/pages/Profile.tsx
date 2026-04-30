import { useEffect, useState } from "react";
import { DEFAULT_MODEL_ROUTES, getStoredModelRoutes, saveModelRoutes } from "../services/modelRouter";

export default function Profile() {
  const [routes, setRoutes] = useState(DEFAULT_MODEL_ROUTES);

  useEffect(() => {
    setRoutes(getStoredModelRoutes());
  }, []);

  const updateRoute = (index: number, model: string) => {
    const updated = [...routes];
    updated[index].model = model;
    setRoutes(updated);
    saveModelRoutes(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Model Settings</h2>
      <p>Steuere Kosten, Geschwindigkeit und Qualität</p>

      {routes.map((route, i) => (
        <div key={route.task} style={{ marginBottom: 20, borderBottom: "1px solid #333", paddingBottom: 10 }}>
          <h4>{route.label}</h4>
          <p style={{ fontSize: 12, opacity: 0.7 }}>{route.note}</p>

          <select
            value={route.model}
            onChange={(e) => updateRoute(i, e.target.value)}
          >
            <option value="gemini-2.5-flash-lite">Flash Lite (cheap)</option>
            <option value="gemini-2.5-flash">Flash (balanced)</option>
            <option value="gemini-2.5-pro">Pro (premium)</option>
          </select>
        </div>
      ))}
    </div>
  );
}
