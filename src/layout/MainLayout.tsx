import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/sidebars/app-sidebar";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { allOrganizations } from "@/pages/dashboard/mockData";
import { useState } from "react";
import SelectedOrgContext from "@/context/selectedOrgContext";
import Navbar from "@/components/navbar";
import { Organization } from "@/services/organization_service";
import useOrganizations from "@/hooks/useOrganization";
import CompanyContext from "@/context/companyContext";
import useCompany from "@/hooks/useCompany";

const MainLayout = () => {
  // If you need async data, fetch it in useEffect
  const defaultOpen = true;

  const location = useLocation();
  const isSettingsPage =
    location.pathname.includes("/manage-all") ||
    location.pathname.includes("/account") ||
    location.pathname.includes("/create-company") ||
    location.pathname.includes("/organization");
  // const [rganizations] = useOrganizations()
  const [selectedOrg, setSelectedOrg] = useState<Organization>(
    allOrganizations[0]
  );
  const { companies, isLoading, error } = useCompany();
  return (
    <SelectedOrgContext.Provider value={{ selectedOrg, setSelectedOrg }}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />

        <main className="w-full ">
          <Navbar />

          <Outlet />
        </main>
      </SidebarProvider>{" "}
    </SelectedOrgContext.Provider>
  );
};

export default MainLayout;
