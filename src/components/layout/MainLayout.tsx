import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import Nav from "../Nav";

const MainLayout = () => {
  const location = useLocation();
  const isSettingsPage = location.pathname.includes('/manage-all') || 
                        location.pathname.includes('/account') || 
                        location.pathname.includes('/create-company') || 
                        location.pathname.includes('/organization');

  return (
    <SidebarProvider>
      <div className="flex h-full">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout; 