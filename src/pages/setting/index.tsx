import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyDetails from "./CompanyDetail";
import CompanyMembers from "./CompanyMembers";
import DataIntegration from "../data/DataIntegration";
import { useState } from "react";

// Import icons (you can use Lucide, Heroicons, or any other icon library)
import {
  Building2,
  Users,
  Database,
  ChevronDown,
  Bell,
  Home,
  LayoutPanelTop,
} from "lucide-react";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import CompanyOrganization from "./organization";
import CustomTab from "@/components/CustomTab";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const settingList = [
    {
      key: "general",
      name: "General",
      icon: Building2,
      content: (
        <div className=" flex gap-10">
          <CompanyDetails />
          <ThemeSwitcher />
        </div>
      ),
    },
    {
      key: "organization",
      name: "Organization",
      icon: LayoutPanelTop,
      content: <CompanyOrganization />,
    },
    {
      key: "members",
      name: "Members",
      icon: Users,
      content: <CompanyMembers />,
    },
    {
      key: "data-integration",
      name: "Data Integration",
      icon: Database,
      content: <DataIntegration />,
    },
    {
      key: "alert",
      name: "Alert",
      icon: Bell,
      content: "todo",
    },
  ];

  return (
    <div className="p-6 px-10  space-y-8 mx-auto ">
      <CustomTab settingList={settingList} />
      {/* <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="flex gap-2    w-full  mx-auto border  border-primary/50 bg-sidebar rounded-none">
          {settingList.map((setting) => (
            <TabsTrigger
              value={setting.key}
              className={`relative px-4 py-3.5 text-sm font-medium    transition-all duration-300 flex items-center gap-2 flex-1 group ${
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
                  <setting.icon />

                  <span className="relative z-10">{setting.name}</span>
                  <ChevronDown className="relative z-10 h-4 w-4 ml-auto opacity-70" />
                </>
              ) : (
                <>
                  <setting.icon />
                  <span>{setting.name}</span>
                </>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="border border-accent  bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <TabsContent
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
          </TabsContent>
          <TabsContent
            value="members"
            className="m-0 pt-2 data-[state=active]:animate-fadeIn"
          >
            <CompanyMembers />
          </TabsContent>
          <TabsContent
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
          </TabsContent>
        </div>
      </Tabs> */}
    </div>
  );
};

export default Settings;
