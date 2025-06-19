import { ThemeToggle } from "@/components/settings/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ColorPicker } from "@/components/settings/ColorSelector";
import useOrgStore from "@/stores/OrgStore";
export function CompanyStyles() {
  const userComp = useOrgStore((state)=>state.userComp)
  return (
    <Card className="border-none shadow-none m-10 p-5 w-2/3">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how your <span className="font-bold">{userComp.name}</span> looks on RealBI
        </CardDescription>
      </CardHeader>
      <hr />
      <CardContent className="">
        <div className="flex flex-col items-start justify-between  ">
          <div className="space-y-0.5  border-b mb-3">
            <h3 className="text-sm font-medium">Color</h3>
            <p className="text-sm text-muted-foreground">Select your colors</p>
          </div>
          <hr />

          <ColorPicker />
        </div>
      </CardContent>
    </Card>
  );
}
