import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ChevronDown, LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Tabs } from "./ui/tabs";

interface TabsItem {
  key: string;
  name: string;
  icon: LucideIcon;
  content: ReactNode;
}
interface Props {
  settingList: TabsItem[];
}

const CustomTab = ({ settingList }: Props) => {
  const [activeTab, setActiveTab] = useState<string>("general");

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex gap-2 py-0  w-full  mx-auto border  border-primary/50 bg-sidebar rounded-none">
        {settingList.map((setting) => (
          <TabsTrigger
            value={setting.key}
            className={`relative px-4 py-2 text-sm font-medium    transition-all duration-300 flex items-center gap-2 flex-1 group ${
              activeTab === setting.key
                ? "text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === setting.key ? (
              <>
                <span
                  className="absolute inset-0  bg-primary/50   "
                  aria-hidden="true"
                />
                <setting.icon className="relative z-10 h-4  opacity-70" />

                <span className="relative z-10">{setting.name}</span>
                <ChevronDown className="relative z-10 h-4 w-4 ml-auto opacity-70" />
              </>
            ) : (
              <>
                <setting.icon className="h-4 " />
                <span>{setting.name}</span>
              </>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="border border-accent  bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        {/* <TabsContent
          value="general"
          className="m-0 pt-2 flex gap-10 p-10 data-[state=active]:animate-fadeIn"
        >
          <CompanyDetails />
          <ThemeSwitcher />
        </TabsContent>
        <TabsContent
          value="organization"
          className="m-0 flex gap-10 data-[state=active]:animate-fadeIn"
        >
          <CompanyOrganization />
        </TabsContent> */}
        {settingList.map((setting) => (
          <TabsContent
            key={setting.key}
            value={setting.key}
            className="m-0 pt-2 data-[state=active]:animate-fadeIn"
          >
            {setting.content}
          </TabsContent>
        ))}
        {/* <TabsContent
          value="members"
          className="m-0 pt-2 data-[state=active]:animate-fadeIn"
        >
          <CompanyMembers />
        </TabsContent> */}
        {/* <TabsContent
          value="data-integration"
          className="m-0 pt-2 data-[state=active]:animate-fadeIn"
        >
          <DataIntegration />
        </TabsContent>
        <TabsContent
          value="alert"
          className="m-0 pt-2 data-[state=active]:animate-fadeIn"
        >
          Todo
        </TabsContent> */}
      </div>
    </Tabs>
  );
};

export default CustomTab;
