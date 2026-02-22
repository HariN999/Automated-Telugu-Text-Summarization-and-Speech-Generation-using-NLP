export const THEME_STORAGE_KEY = "telugu-ai-theme";

// Reusable semantic tokens used across the app.
export const THEME_TOKENS = {
  light: {
    background: "#f5f7fb",
    surface: "#ffffff",
    "surface-muted": "#eef2f8",
    primary: "#4f46e5",
    secondary: "#0ea5a4",
    "text-primary": "#0f172a",
    "text-secondary": "#475569",
    border: "#dbe3ef",
    "focus-ring": "rgba(79, 70, 229, 0.35)",
    "shadow-soft": "0 8px 24px rgba(15, 23, 42, 0.08)",
    "shadow-lift": "0 14px 38px rgba(15, 23, 42, 0.12)",
    "bg-gradient": "radial-gradient(ellipse at 20% 0%, rgba(79,70,229,0.09) 0%, transparent 45%), radial-gradient(ellipse at 85% 100%, rgba(14,165,164,0.07) 0%, transparent 50%), #f5f7fb",
  },
  dark: {
    background: "#0b1221",
    surface: "#131d30",
    "surface-muted": "#17243a",
    primary: "#818cf8",
    secondary: "#2dd4bf",
    "text-primary": "#e2e8f0",
    "text-secondary": "#9aa9c2",
    border: "#25324a",
    "focus-ring": "rgba(129, 140, 248, 0.45)",
    "shadow-soft": "0 10px 24px rgba(2, 6, 23, 0.4)",
    "shadow-lift": "0 16px 42px rgba(2, 6, 23, 0.55)",
    "bg-gradient": "radial-gradient(ellipse at 15% 0%, rgba(79,70,229,0.22) 0%, transparent 45%), radial-gradient(ellipse at 90% 100%, rgba(45,212,191,0.1) 0%, transparent 55%), #0b1221",
  },
};

export const resolveSystemTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
