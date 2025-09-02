// components/ThemeSwitcher.tsx

import { useTheme } from "./theme-provider";

const brandThemes = [
  { label: "Default", value: "default" },
  { label: "Ocean", value: "theme-ocean" },
  { label: "Sunset", value: "theme-sunset" },
  { label: "Forest", value: "theme-forest" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Filter out non-brand themes
  const isBrandTheme = (value: string) =>
    ["default", "theme-ocean", "theme-sunset", "theme-forest"].includes(value);

  return (
    <select
      value={isBrandTheme(theme) ? theme : "default"}
      onChange={(e) => setTheme(e.target.value as any)}
      className="p-2 border rounded text-sm"
    >
      {brandThemes.map((theme) => (
        <option key={theme.value} value={theme.value}>
          {theme.label}
        </option>
      ))}
    </select>
  );
}
