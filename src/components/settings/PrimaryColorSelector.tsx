"use client";

import { useEffect, useState } from "react";
import { Paintbrush } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

//function lighten(color: string, percent: number): string {
//  const amt = Math.round(255 * (percent / 100));
//  return color
//    .replace(/^#/, "")
//    .replace(/.{2}/g, (hex) =>
//      Math.min(255, parseInt(hex, 16) + amt)
//        .toString(16)
//        .padStart(2, "0"),
//    )
//    .padEnd(6, "0")
//    .replace(/^/, "#");
//}
//
import { useThemeContext } from "@/context/ThemeContext";
export function PrimaryColorPicker() {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const { setPrimaryColor } = useThemeContext();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };
  //const colorInputRef = useRef<HTMLInputElement>(null);
  //
  //const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //  const newColor = e.target.value;
  //  const root = document.documentElement;
  //  root.style.setProperty("--primary", newColor);
  //
  //  const lighter = lighten(newColor, 30);
  //  root.style.setProperty("--sidebar-accent", lighter);
  //};
  return (
    <>
      <input
        ref={colorInputRef}
        type="color"
        onChange={handleColorChange}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-md"
        onClick={() => colorInputRef.current?.click()}
      >
        <Paintbrush className="h-4 w-4" />
        <span className="sr-only">Pick primary color</span>
      </Button>
    </>
  );
}
