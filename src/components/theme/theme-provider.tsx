import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ----- Types -----

type Mode = "light" | "dark" | "system";
type BrandTheme = "default" | "theme-ocean" | "theme-sunset" | "theme-forest";

type Theme = Mode | BrandTheme;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// ----- Theme List -----

const ALL_THEMES: Theme[] = [
  "light",
  "dark",
  "system",
  "default",
  "theme-ocean",
  "theme-sunset",
  "theme-forest",
];

// ----- Initial State -----

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

// ----- ThemeProvider Component -----

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  // Apply theme class to <html>
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    ALL_THEMES.forEach((t) => root.classList.remove(t));

    let activeTheme = theme;

    if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      activeTheme = systemPrefersDark ? "dark" : "light";
    }

    root.classList.add(activeTheme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ----- Hook -----

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
