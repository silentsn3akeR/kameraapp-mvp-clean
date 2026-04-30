import { useState } from "react";
import Camera from "./pages/Camera";
import Analyze from "./pages/Analyze";
import Challenges from "./pages/Challenges";
import Community from "./pages/Community";
import Profile from "./pages/Profile";

export default function App() {
  const [page, setPage] = useState("camera");
  const [image, setImage] = useState<string | null>(null);

  const goToAnalyze = (img: string) => {
    setImage(img);
    setPage("analyze");
  };

  const renderPage = () => {
    switch (page) {
      case "camera":
        return <Camera onAnalyze={goToAnalyze} />;
      case "analyze":
        return <Analyze image={image} />;
      case "challenges":
        return <Challenges />;
      case "community":
        return <Community />;
      case "profile":
        return <Profile />;
      default:
        return
      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          background: "#111",
          color: "#fff",
          padding: 10,
        }}
      >
        <button onClick={() => setPage("camera")}>📷</button>
        <button onClick={() => setPage("analyze")}>✨</button>
        <button onClick={() => setPage("challenges")}>🏆</button>
        <button onClick={() => setPage("community")}>👥</button>
        <button onClick={() => setPage("profile")}>👤</button>
      </div>
    </div>
  );
}          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          background: "#111",
          color: "#fff",
          padding: 10,
        }}
      >
        <button onClick={() => setPage("camera")}>📷</button>
        <button onClick={() => setPage("analyze")}>✨</button>
        <button onClick={() => setPage("challenges")}>🏆</button>
        <button onClick={() => setPage("community")}>👥</button>
        <button onClick={() => setPage("profile")}>👤</button>
      </div>
    </div>
  );
}
