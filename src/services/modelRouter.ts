export type ModelTask = "fastPreview" | "photoAnalysis" | "deepAnalysis" | "caption";

export type ModelRoute = {
  task: ModelTask;
  label: string;
  model: string;
  mode: "cheap" | "balanced" | "premium";
  expectedUse: "low" | "medium" | "high";
  note: string;
};

export const DEFAULT_MODEL_ROUTES: ModelRoute[] = [
  {
    task: "fastPreview",
    label: "Fast Preview",
    model: "gemini-2.5-flash-lite",
    mode: "cheap",
    expectedUse: "high",
    note: "Schnelle, günstige Analyse für viele Uploads.",
  },
  {
    task: "photoAnalysis",
    label: "Photo Analysis",
    model: "gemini-2.5-flash",
    mode: "balanced",
    expectedUse: "medium",
    note: "Standardmodell für normale Fotoanalyse.",
  },
  {
    task: "deepAnalysis",
    label: "Deep Analysis",
    model: "gemini-2.5-pro",
    mode: "premium",
    expectedUse: "low",
    note: "Nur für Premium/Detailanalyse, weil teurer/langsamer.",
  },
  {
    task: "caption",
    label: "Caption & Post Text",
    model: "gemini-2.5-flash-lite",
    mode: "cheap",
    expectedUse: "high",
    note: "Texte, Captions, Hashtags – günstig und schnell.",
  },
];

export const MODEL_ROUTE_STORAGE_KEY = "kameraapp-model-routes-v1";

export function getStoredModelRoutes(): ModelRoute[] {
  if (typeof window === "undefined") return DEFAULT_MODEL_ROUTES;

  try {
    const stored = window.localStorage.getItem(MODEL_ROUTE_STORAGE_KEY);
    if (!stored) return DEFAULT_MODEL_ROUTES;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MODEL_ROUTES;
  }
}

export function saveModelRoutes(routes: ModelRoute[]) {
  window.localStorage.setItem(MODEL_ROUTE_STORAGE_KEY, JSON.stringify(routes));
}

export function getRouteForTask(task: ModelTask): ModelRoute {
  return getStoredModelRoutes().find((route) => route.task === task) || DEFAULT_MODEL_ROUTES[1];
}
