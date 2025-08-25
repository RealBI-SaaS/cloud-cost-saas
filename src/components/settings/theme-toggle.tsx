import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/ThemeStore";
import { setTheme } from "@/utils/misc/theme";

//import { useThemeContext } from "@/context/ThemeContext";

export function ThemeToggle() {
  const [theme, setThemeState] = useState("dark"); // default dark

  // Apply theme on mount
  // useEffect(() => {
  //   const saved = localStorage.getItem("theme") || "dark";
  //   setTheme(saved);
  // }, []);

  // const setTheme = (theme) => {
  //   const root = document.documentElement;
  //   localStorage.setItem("theme", theme);
  //   root.classList.remove("light", "dark");
  //   if (theme === "system") {
  //     const system = window.matchMedia("(prefers-color-scheme: dark)").matches
  //       ? "dark"
  //       : "light";
  //     root.classList.add(system);
  //     setThemeState(system);
  //   } else {
  //     root.classList.add(theme);
  //     setThemeState(theme);
  //   }
  // };
  // const setMyTheme = ((theme)=>{
  //
  //   setTheme(theme)
  // })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className=" rounded-full">
          {theme == "dark" ? (
            <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          ) : (
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
