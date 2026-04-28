import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const KEY = "lessmark-theme";

function read(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => (typeof window === "undefined" ? "light" : read()));

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}
