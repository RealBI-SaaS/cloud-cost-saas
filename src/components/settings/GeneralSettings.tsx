import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrimaryColorPicker } from "./PrimaryColorSelector";

export function GeneralSettings() {
  return (
    <Card className="border-none shadow-none m-10 p-5 w-2/3">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how RealBI looks on your device
        </CardDescription>
      </CardHeader>
      <hr />
      <CardContent className="">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">Color</h3>
            <p className="text-sm text-muted-foreground">
              Select your main color
            </p>
          </div>

          <PrimaryColorPicker />
        </div>
      </CardContent>
    </Card>
  );
}
