import CompanyDetails from "./CompanyDetail";
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
    </div>
  );
};

export default Settings;
