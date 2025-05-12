import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import SettingsSidebar from "../menu/SettingSidebar";
import { useUser } from "@/context/UserContext";
import { Loading } from "@/misc/loading";
import useUserStore from "@/context/userStore";

const SettingsLayout = () => {
  //const { user, loading } = useUser();
  const user = useUserStore((state) => {
    state.user;
  });
  const loading = useUserStore((state) => {
    state.loading;
  });
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
      <div className="flex h-screen min-w-full overflow-hidden">
        <aside className="overflow-y-auto h-full">
          <SettingsSidebar />
        </aside>
        <div className="flex-1 h-full overflow-y-auto  ">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SettingsLayout;
