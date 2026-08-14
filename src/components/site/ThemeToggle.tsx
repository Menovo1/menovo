import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const THEME_KEY = "menovo-theme";

export function ThemeToggle({ light = false }: { light?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative h-9 w-9 rounded-full border flex items-center justify-center transition-all duration-500 hover:border-gold hover:text-gold ${
        light ? "border-white/50 text-white" : "border-border text-foreground"
      }`}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-500 ${
          dark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-500 ${
          dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
        }`}
      />
    </button>
  );
}
