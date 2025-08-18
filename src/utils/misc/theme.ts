export function setTheme(theme?: string) {
  const root = document.documentElement;

  // If no theme passed, read from localStorage or default to dark
  if (!theme) {
    theme = localStorage.getItem("theme") || "dark";
  }

  // Save theme
  localStorage.setItem("theme", theme);

  // Remove any previous classes
  root.classList.remove("light", "dark");

  // Apply theme
  if (theme === "system") {
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(system);
  } else {
    root.classList.add(theme);
  }
}
