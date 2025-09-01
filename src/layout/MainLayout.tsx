import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/sidebars/app-sidebar";
import Navbar from "@/components/navbar/Navbar";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const MainLayout = () => {
  // If you need async data, fetch it in useEffect
  const defaultOpen = true;

  const location = useLocation();
  const isSettingsPage =
    location.pathname.includes("/manage-all") ||
    location.pathname.includes("/account") ||
    location.pathname.includes("/create-company") ||
    location.pathname.includes("/organization");

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <main className="w-full ">
        <Navbar />

        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
