import { useState } from "react";
import Camera from "./pages/Camera";
import Analyze from "./pages/Analyze";
import Challenges from "./pages/Challenges";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import GameNotifications from "./components/GameNotifications";
import { useGameEngine } from "./hooks/useGameEngine";
import type { Page } from "./core/types";
import "./styles.css";

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "camera", label: "Shot", icon: "📷" },
  { id: "analyze", label: "Analyse", icon: "✨" },
  { id: "challenges", label: "Missionen", icon: "🏆" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "profile", label: "Profil", icon: "👤" },
];

export default function App() {
  const [page, setPage] = useState<Page>("camera");
  const [image, setImage] = useState<string | null>(null);
  const game = useGameEngine();

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
        return (
          <Analyze
            image={image}
            onRetry={retryShot}
            onScanComplete={game.recordScan}
            stats={game.stats}
            progressPercent={game.progressPercent}
          />
        );
      case "challenges":
        return <Challenges stats={game.stats} progressPercent={game.progressPercent} />;
      case "community":
        return <Community />;
      case "profile":
        return <Profile stats={game.stats} />;
      default:
        return <Camera onAnalyze={goToAnalyze} />;
    }
  };

  return (
    <div className="appShell obscuraShell">
      <main className="appMain">{renderPage()}</main>

      <GameNotifications notifications={game.notifications} onRemove={game.removeNotification} />

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
