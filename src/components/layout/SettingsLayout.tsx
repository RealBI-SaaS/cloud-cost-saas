import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import SettingsSidebar from "../menu/SettingSidebar";

const SettingsLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-full min-w-full">
        <SettingsSidebar />
        <div className="flex-1 ">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SettingsLayout; 