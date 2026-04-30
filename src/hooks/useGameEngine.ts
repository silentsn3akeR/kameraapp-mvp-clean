import { useState } from "react";
import { GameStats, GameNotification } from "../core/types";

export function useGameEngine() {
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    scansCompleted: 0,
    streak: 0,
    lastScore: null,
    bestScore: null,
    totalXpEarned: 0,
  });

  const [notifications, setNotifications] = useState<GameNotification[]>([]);

  const addNotification = (title: string, message: string) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, title, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const recordScan = (score: number) => {
    const gainedXp = Math.round(score / 2);

    setStats((prev) => {
      const newXp = prev.xp + gainedXp;
      const levelUp = newXp >= prev.xpToNextLevel;

      const nextLevel = levelUp ? prev.level + 1 : prev.level;
      const nextXp = levelUp ? newXp - prev.xpToNextLevel : newXp;

      if (levelUp) {
        addNotification("Level Up", `You reached level ${nextLevel}`);
      }

      return {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        scansCompleted: prev.scansCompleted + 1,
        streak: prev.streak + 1,
        lastScore: score,
        bestScore: prev.bestScore ? Math.max(prev.bestScore, score) : score,
        totalXpEarned: prev.totalXpEarned + gainedXp,
      };
    });
  };

  const progressPercent = (stats.xp / stats.xpToNextLevel) * 100;

  return {
    stats,
    notifications,
    recordScan,
    removeNotification,
    progressPercent,
  };
}
