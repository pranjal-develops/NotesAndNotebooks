import { useCallback, useEffect, useMemo, useState } from "react";

export type ThemeId = string; // so you can add more later easily

const THEMES: ThemeId[] = ["light", "dark", "island", "dark-island", "pitch-black", "pure-white"];

function applyThemeToDocument(theme: ThemeId) {
  const root = document.documentElement;

  // reset all known theme classes (add more classes here if you introduce new root classes)
  root.classList.remove("dark", "island", "dark-island", "pure-white", "pitch-black");

  if (theme === "dark") root.classList.add("dark");
  if (theme === "island") root.classList.add("island");
  if (theme === "dark-island") root.classList.add("dark-island");
  if (theme === "pure-white") root.classList.add("pure-white");
  if (theme === "pitch-black") root.classList.add("pitch-black");
  // "light" applies no class
}

export function useThemeSwitcher() {
  const themes = useMemo(() => THEMES, []);
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const stored = localStorage.getItem("theme");
    return stored ?? "light";
  });

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    localStorage.setItem("theme", next);
  }, []);

  const isDarkLike = theme === "dark" || theme === "dark-island" || theme === "pitch-black";

  // Toggle should switch between dark/light only
  const toggleDarkLight = useCallback(() => {
    const next: ThemeId = isDarkLike ? "pure-white" : "dark";
    setTheme(next);
  }, [isDarkLike, setTheme]);

  return { theme, themes, setTheme, toggleDarkLight, isDarkLike };
}
