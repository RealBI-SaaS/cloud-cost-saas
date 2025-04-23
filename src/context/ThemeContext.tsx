// context/ThemeContext.tsx
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

function lighten(color: string, percent: number): string {
  const amt = Math.round(255 * (percent / 100));
  return color
    .replace(/^#/, "")
    .replace(/.{2}/g, (hex) =>
      Math.min(255, parseInt(hex, 16) + amt)
        .toString(16)
        .padStart(2, "0"),
    )
    .padEnd(6, "0")
    .replace(/^/, "#");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  //const [theme, setThemeState] = useState<ThemeMode>("light");
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light"; // SSR safety
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (saved === "dark" || saved === "light") return saved;
    return systemPrefersDark ? "dark" : "light";
  });
  //const [primaryColor, setPrimaryColorState] = useState<string>("#3b82f6"); // default blue

  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    if (typeof window === "undefined") return "#023e8a"; // SSR safety
    return localStorage.getItem("primaryColor") || "#023e8a";
  });

  // Init theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (
      savedTheme === "dark" ||
      savedTheme === "light" ||
      savedTheme === "system"
    ) {
      setThemeState(savedTheme);
    } else {
      setThemeState(system ? "dark" : "light");
    }

    const savedColor = localStorage.getItem("primaryColor");
    if (savedColor) {
      setPrimaryColorState(savedColor);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const resolved =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Apply primary color changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--sidebar-accent", lighten(primaryColor, 30));
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
        primaryColor,
        setPrimaryColor: setPrimaryColorState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return context;
}
