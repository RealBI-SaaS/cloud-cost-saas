import React from "react";
import { Button } from "@/components/ui/button";
import { TableOfContents, LayoutDashboard } from "lucide-react";
import { cn } from "@/utils/utils";

interface LayoutSwitcherProps {
  currentLayout: "table" | "card";
  onLayoutChange: (layout: "table" | "card") => void;
}

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({
  currentLayout,
  onLayoutChange,
}) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      <Button
        variant={currentLayout === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("table")}
        className={cn(
          "h-8 w-8 p-0",
          currentLayout === "table" && "bg-primary shadow-sm"
        )}
      >
        <TableOfContents className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        variant={currentLayout === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("card")}
        className={cn(
          "h-8 w-8 p-0",
          currentLayout === "card" && "bg-primary shadow-sm"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="sr-only">Card view</span>
      </Button>
    </div>
  );
};

export default LayoutSwitcher;
