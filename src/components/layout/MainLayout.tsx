import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, SidebarProvider } from "../ui/sidebar";
import Nav from "../Nav";
import { AppSidebar } from "../app-sidebar";

const MainLayout = () => {
  const location = useLocation();
  const isSettingsPage =
    location.pathname.includes("/manage-all") ||
    location.pathname.includes("/account") ||
    location.pathname.includes("/create-company") ||
    location.pathname.includes("/organization");

  //return (
  //  <SidebarProvider>
  //    <div className="flex h-full bg-red-200">
  //      <AppSidebar />
  //      <div className="flex-1 bg-green-500">
  //        <Outlet />
  //      </div>
  //    </div>
  //  </SidebarProvider>
  //);

  return (
    <SidebarProvider>
      <div className="flex h-screen min-w-full overflow-hidden">
        <aside className="overflow-y-auto h-full">
          <AppSidebar />
        </aside>
        <div className="flex-1 h-full overflow-y-auto ">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
