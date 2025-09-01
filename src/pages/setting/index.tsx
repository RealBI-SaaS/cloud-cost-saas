import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyDetails from "./CompanyDetail";
import CompanyMembers from "./CompanyMembers";
import DataIntegration from "../data/DataIntegration";
import { useState } from "react";

// Import icons (you can use Lucide, Heroicons, or any other icon library)
import { Building2, Users, Database, ChevronDown, Bell } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const settingList = [
    {
      key: "general",
      name: "general",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      key: "members",
      name: "members",
      icon: <Users className="relative z-10 h-4 w-4" />,
    },
    {
      key: "data-integration",
      name: "Data Integration",
      icon: <Database className="relative z-10 h-4 w-4" />,
    },
    {
      key: "alert",
      name: "Alert",
      icon: <Bell className="relative z-10 h-4 w-4" />,
    },
  ];

  return (
    <div className="p-6 px-10  space-y-8 mx-auto ">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Company Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
          Manage your company profile, members, and data integrations in one
          place
        </p>
      </div>

      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className=""
      >
        <TabsList className="flex gap-2 p-1   w-full  mx-auto border">
          {settingList.map((setting) => (
            <TabsTrigger
              value={setting.key}
              className={`relative px-4 py-3 text-sm font-medium  transition-all duration-300 flex items-center gap-2 flex-1 group ${
                activeTab === setting.key
                  ? "text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === setting.key ? (
                <>
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/15 "
                    aria-hidden="true"
                  />
                  {/* <Building2 className="relative z-10 h-4 w-4" /> */}
                  {setting.icon}
                  <span className="relative z-10">{setting.name}</span>
                  <ChevronDown className="relative z-10 h-4 w-4 ml-auto opacity-70" />
                </>
              ) : (
                <>
                  {setting.icon}
                  <span>{setting.name}</span>
                </>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="border  bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <TabsContent
            value="general"
            className="m-0 pt-2 data-[state=active]:animate-fadeIn"
          >
            <CompanyDetails />
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
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
