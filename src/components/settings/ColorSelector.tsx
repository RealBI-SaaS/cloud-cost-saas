import useOrgStore from "@/stores/OrgStore";
import { useThemeStore } from "@/stores/ThemeStore";
import { useRef } from "react";
import { Paintbrush, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLOR_VARIABLES = [
  { label: "Primary", variable: "--primary" },
  { label: "Sidebar Accent", variable: "--sidebar-accent" },
  { label: "Borders", variable: "--border" },
  { label: "Form Input Background", variable: "--input" },
  { label: "Sidebar Background", variable: "--sidebar" },
  { label: "Sidebar Font", variable: "--sidebar-foreground" },
];

export function ColorPicker() {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const userComp = useOrgStore((state) => state.userComp);
  // const compId = userComp.id;
  const { setColor, resetColor, colors } = useThemeStore();

  return (
    <div className="space-y-3 w-full">
      {COLOR_VARIABLES.map(({ label, variable }) => (
        <div
          key={variable}
          className="grid grid-cols-2 gap-2 border-b border-dotted"
        >
          <span className="text-sm">{label}</span>
          <input
            ref={(el) => (inputRefs.current[variable] = el)}
            type="color"
            className="hidden"
            defaultValue={colors[variable]}
            onChange={(e) => setColor(variable, e.target.value, userComp.id)}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="icon"
              className=" rounded-md flex items-center justify-center mx-2 mb-1 "
              onClick={() => inputRefs.current[variable]?.click()}
            >
              <Paintbrush className="h-4 w-4" />
              <span className="sr-only text-sm">Pick {label} color</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className=" rounded-md flex items-center justify-center "
              onClick={() => resetColor(variable, userComp.id)}
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
