"use client";

import { useRef } from "react";
import { Paintbrush, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/context/ThemeContext";

const COLOR_VARIABLES = [
  { label: "Primary ", variable: "--primary" },
  { label: "Sidebar Accent", variable: "--sidebar-accent" },
  { label: "Borders", variable: "--border" },
  { label: "form Input Background", variable: "--input" },
  { label: "Sidebar Background Color", variable: "--sidebar" },
  { label: "Sidebar Font Color", variable: "--sidebar-foreground" },
];

export function ColorPicker() {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { setPrimaryColor } = useThemeContext();

  const handleColorChange = (variable: string, color: string) => {
    document.documentElement.style.setProperty(variable, color);
    if (variable === "--primary") {
      setPrimaryColor(color); // update context if needed
    }
  };
  const resetToDefault = (variable: string) => {
    document.documentElement.style.removeProperty(variable);
    if (variable === "--primary") setPrimaryColor(""); // Or default value
  };

  return (
    <div className="space-y-3 w-full">
      {COLOR_VARIABLES.map(({ label, variable }) => (
        <div
          key={variable}
          className="grid   grid-cols-2 w-100 w-full gap-2 border-b border-dotted "
        >
          <span className="text-sm ">{label}</span>
          <input
            ref={(el) => (inputRefs.current[variable] = el)}
            type="color"
            className="hidden"
            onChange={(e) => handleColorChange(variable, e.target.value)}
          />
          <div className="flex justify-end ">
            <Button
              variant="outline"
              size="icon"
              className=" rounded-md flex items-center justify-center "
              onClick={() => inputRefs.current[variable]?.click()}
            >
              <Paintbrush className="h-4 w-4" />
              <span className="sr-only text-sm">Pick {label} color</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => resetToDefault(variable)}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset {label} color</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
