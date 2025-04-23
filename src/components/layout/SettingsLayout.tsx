import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import SettingsSidebar from "../menu/SettingSidebar";
import { useUser } from "@/context/UserContext";
import { Loading } from "@/misc/loading";

const SettingsLayout = () => {
  const { user, loading } = useUser();
  //FIX: user data null after refresh untill fetch
  //
  //  if (loading) {
  //    return (
  //
  //      <Loading />;
  //    )
  //  }
  //
  //if (!user) {
  //  return (
  //
  //    <Loading />;
  //      )
  //
  //}
  //
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
