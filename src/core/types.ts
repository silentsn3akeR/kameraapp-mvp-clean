export type Page = "camera" | "analyze" | "challenges" | "community" | "profile";

export type AnalysisType = "BALANCED_SHOT" | "OFF_CENTER" | "NO_CLEAR_SUBJECT";

export type AnalysisResult = {
  type: AnalysisType;
  score: number;
  title: string;
  composition: string;
  subject: string;
  depth: string;
  suggestion: string;
  cameraMode: string;
  aperture: string;
  iso: string;
  shutter: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  completed: boolean;
};

export type GameStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  scansCompleted: number;
  streak: number;
  lastScore: number | null;
  bestScore: number | null;
  totalXpEarned: number;
};

export type GameNotification = {
  id: string;
  title: string;
  message: string;
};
