import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrandTheme, brandThemes } from "./brandThemes";

// ----- Types -----

type Mode = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: Mode;
  defaultBrandTheme?: BrandTheme;
  storageKeyMode?: string;
  storageKeyBrand?: string;
};

type ThemeContextType = {
  mode: Mode;
  brandTheme: BrandTheme;
  setMode: (mode: Mode) => void;
  setBrandTheme: (brand: BrandTheme) => void;
};

// ----- Initial State -----

const initialState: ThemeContextType = {
  mode: "system",
  brandTheme: "default",
  setMode: () => null,
  setBrandTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

// ----- ThemeProvider Component -----

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultBrandTheme = "default",
  storageKeyMode = "vite-ui-mode",
  storageKeyBrand = "vite-ui-brand",
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKeyMode) as Mode) || defaultMode;
    }
    return defaultMode;
  });

  const [brandTheme, setBrandThemeState] = useState<BrandTheme>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem(storageKeyBrand) as BrandTheme) ||
        defaultBrandTheme
      );
    }
    return defaultBrandTheme;
  });

  // Apply theme + mode classes to <html>
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all brand + mode classes
    root.classList.remove("light", "dark");
    root.classList.remove(
      "default",
      "theme-ocean",
      "theme-sunset",
      "theme-forest"
    );
    brandThemes.map((theme) => root.classList.remove(theme.value));
    // Determine effective mode
    let appliedMode = mode;
    if (mode === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      appliedMode = prefersDark ? "dark" : "light";
    }

    // Add classes
    root.classList.add(brandTheme);
    root.classList.add(appliedMode);
  }, [mode, brandTheme]);

  const setMode = (newMode: Mode) => {
    localStorage.setItem(storageKeyMode, newMode);
    setModeState(newMode);
  };

  const setBrandTheme = (newBrand: BrandTheme) => {
    localStorage.setItem(storageKeyBrand, newBrand);
    setBrandThemeState(newBrand);
  };

  const value = useMemo(
    () => ({ mode, brandTheme, setMode, setBrandTheme }),
    [mode, brandTheme]
  );

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
