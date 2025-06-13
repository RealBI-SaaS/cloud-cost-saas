import axiosInstance from "@/axios/axiosInstance";
import useOrgStore from "./OrgStore";
import { create } from "zustand";
import { useEffect } from "react";
import useUserStore from "./userStore";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  colors: Record<string, string>;
  setColor: (variable: string, value: string, compId: string) => void;
  resetColor: (variable: string, compId: string) => void;

  loadColors: (scheme: Record<string, string>) => void;
  //reset: (scheme: Record<string, string>) => void;

  reset: () => void;
  initializeTheme: (comp_id: string) => Promise<void>;
}

const getDefaultColors = () => {
  const root = document.documentElement;
  return {
    "--primary": getComputedStyle(root).getPropertyValue("--primary").trim(),
    "--sidebar-accent": getComputedStyle(root).getPropertyValue("--sidebar-accent").trim(),
    "--border": getComputedStyle(root).getPropertyValue("--border").trim(),
    "--input": getComputedStyle(root).getPropertyValue("--input").trim(),
    "--sidebar": getComputedStyle(root).getPropertyValue("--sidebar").trim(),
    "--sidebar-foreground": getComputedStyle(root).getPropertyValue("--sidebar-foreground").trim(),
  };
};

const DEFAULT_COLORS = getDefaultColors();

const VARIABLE_TO_FIELD_MAP: Record<string, string> = {
  "--primary": "primary",
  "--sidebar-accent": "sidebar_accent",
  "--border": "borders",
  "--input": "form_input_background",
  "--sidebar": "sidebar_background",
  "--sidebar-foreground": "sidebar_font_color",
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => {
    const root = document.documentElement;
    localStorage.setItem("theme", theme);
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    set({ theme });
  },

  colors: { ...DEFAULT_COLORS },
  setColor: (variable, value, compId) => {
    const field = VARIABLE_TO_FIELD_MAP[variable];

    if (!field) {
      console.error(`No mapping found for variable: ${variable}`);
      return;
    }
    set((state) => {
      const newColors = { ...state.colors, [variable]: value };
      localStorage.setItem("colorScheme", JSON.stringify(newColors));
      document.documentElement.style.setProperty(variable, value);

      axiosInstance.patch(`/organizations/${compId}/colorscheme/`, {
        [field]: value,
      });

      return { colors: newColors };
    });
  },

  resetColor: (variable, compId) =>
    set((state) => {
      const defaultValue = DEFAULT_COLORS[variable];
      const field = VARIABLE_TO_FIELD_MAP[variable];
      // console.log(field, defaultValue);
      if (!field) {
        console.error(`No mapping found for variable: ${variable}`);
        return state;
      }

      // Remove the custom CSS override
      document.documentElement.style.removeProperty(variable);

      // Update local state and localStorage
      const newColors = { ...state.colors, [variable]: defaultValue };
      localStorage.setItem("colorScheme", JSON.stringify(newColors));

      // Sync with backend
      axiosInstance.patch(`/organizations/${compId}/colorscheme/`, {
        [field]: defaultValue,
      });

      return { colors: newColors };
    }),
  loadColors: (scheme) =>
    set(() => {
      //const setLoading = useUserStore((state) => state.setLoading);
      //setLoading(true);
      Object.entries(scheme).forEach(([key, value]) => {
        if (value) {
          // console.log(key, value)
          document.documentElement.style.setProperty(key, value);
        }
      });
      return { colors: { ...DEFAULT_COLORS, ...scheme } };
      //setLoading(false);
    }),

  initializeTheme: async (comp_id) => {
    const savedTheme =
      (localStorage.getItem("theme") as ThemeMode | null) || "system";
    useThemeStore.getState().setTheme(savedTheme);

    try {
      const res = await axiosInstance(`/organizations/${comp_id}/colorscheme`);

      const data = await res.data;
      // console.log(data)

      if (data.color_scheme) {
        const mapped = {
          "--primary": data.color_scheme.primary,
          "--sidebar-accent": data.color_scheme.sidebar_accent,
          "--border": data.color_scheme.borders,
          "--input": data.color_scheme.form_input_background,
          "--sidebar": data.color_scheme.sidebar_background,
          "--sidebar-foreground": data.color_scheme.sidebar_font_color,
        };
        useThemeStore.getState().loadColors(mapped);
        // console.log(data.color_scheme.sidebar_foreground)
      }
    } catch (err) {
      console.error("Failed to load color scheme", err);
    }
  },

  reset: () => {
    // Remove all custom CSS variables
    const root = document.documentElement;
    const vars = [
      "--primary",
      "--sidebar-accent",
      "--border",
      "--input",
      "--sidebar",
      "--sidebar-foreground",
    ];
    vars.forEach((v) => root.style.removeProperty(v));

    // Reset internal state if you're storing colors/theme
    set({
      theme: "system", // or null if you prefer
      colors: {}, // if you store loaded colors in state
    });

    // Optional: remove from localStorage if stored
    localStorage.removeItem("theme");
  },
}));

export const useThemeInitializer = () => {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  //const userComp = useOrgStore((state) => state.userComp);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const compId = currentOrg?.company;

  //console.log(currentOrg);
  //console.log(userComp);
  //console.log("theme initializeTheme function");

  useEffect(() => {
    if (compId) {
      console.log("theme initialized");
      initializeTheme(compId);
    }
  }, [compId]);
};
