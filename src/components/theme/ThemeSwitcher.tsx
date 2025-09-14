// components/ThemeSwitcher.tsx
import { useTheme } from "./theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Paintbrush } from "lucide-react";
import { brandThemes } from "./brandThemes";

interface Props {
  disabled: boolean;
}

export default function ThemeSwitcher({ disabled }: Props) {
  const { brandTheme, setBrandTheme } = useTheme();

  return (
    <Card className="shadow-lg border-border/50 w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-primary" />
          <CardTitle>Theme Customize</CardTitle>
        </div>
        <CardDescription>
          Personalize your experience by selecting a theme
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="theme-select">Interface Theme</Label>
          <Select
            value={brandTheme}
            disabled={!disabled}
            onValueChange={(value) => setBrandTheme(value as any)}
          >
            <SelectTrigger id="theme-select" className="w-full">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {brandThemes.map((themeOption) => (
                <SelectItem key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            Current theme:{" "}
            <span className="font-medium text-foreground">
              {brandThemes.find((t) => t.value === brandTheme)?.label}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
