import { useState } from "react";
import Camera from "./pages/Camera";
import Analyze from "./pages/Analyze";
import Challenges from "./pages/Challenges";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import "./styles.css";

type Page = "camera" | "analyze" | "challenges" | "community" | "profile";

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "camera", label: "Shot", icon: "📷" },
  { id: "analyze", label: "Analyse", icon: "✨" },
  { id: "challenges", label: "Challenges", icon: "🏆" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "profile", label: "Profil", icon: "👤" },
];

export default function App() {
  const [page, setPage] = useState<Page>("camera");
  const [image, setImage] = useState<string | null>(null);

  const goToAnalyze = (img: string) => {
    setImage(img);
    setPage("analyze");
  };

  const retryShot = () => {
    setImage(null);
    setPage("camera");
  };

  const renderPage = () => {
    switch (page) {
      case "camera":
        return <Camera onAnalyze={goToAnalyze} />;
      case "analyze":
        return <Analyze image={image} onRetry={retryShot} />;
      case "challenges":
        return <Challenges />;
      case "community":
        return <Community />;
      case "profile":
        return <Profile />;
      default:
        return <Camera onAnalyze={goToAnalyze} />;
    }
  };

  return (
    <div className="appShell">
      <main className="appMain">{renderPage()}</main>

      <nav className="bottomNav" aria-label="Hauptnavigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? "navButton navButtonActive" : "navButton"}
            onClick={() => setPage(item.id)}
            type="button"
          >
            <span className="navIcon">{item.icon}</span>
            <span className="navLabel">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
