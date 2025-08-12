"use client";

import {
  Folder,
  Handshake,
  Forward,
  MoreHorizontal,
  Trash2,
  House,
  ChevronRight,
  type LucideIcon,
  Home,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { act, useEffect, useState } from "react";
//import { useOrg } from "@/context/OrganizationContext";
import { Link, useLocation } from "react-router-dom";
import { navIcons, defaultIcon } from "@/data/iconMap";
import useOrgStore from "@/stores/OrgStore";

import vendorMeta from "@/data/VendorMeta";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useCompany from "@/stores/CompanyStore";

import axiosInstance from "@/config/axios/axiosInstance";
import useCloudAccountsStore from "@/stores/CloudAccountStore";
import { Button } from "../../ui/button";

export function NavigationsList() {
  const { isMobile } = useSidebar();

  const userComp = useCompany((state) => state.userComp);
  const { accounts, currentAccount, setCurrentAccount, loading, error } =
    useCloudAccountsStore();
  // const [loading, setLoading] = useState(true);
  // const [activeNav, setActiveNav] = useState(null);

  // const fetchIntegrations = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.get(
  //       `${import.meta.env.VITE_BASE_URL}/data/companies/${userComp.id}/cloud-accounts/`,
  //     );
  //     setIntegratedAccounts(response.data.results);
  //   } catch (error) {
  //     console.error("Error fetching integrations", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (userComp) {
  //     fetchIntegrations();
  //   }
  // }, [userComp]);

  // Sidebar Rendering
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">
        Cloud Accounts
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={"" === "home"}>
            <div
              className="flex items-center w-full gap-2 px-2 py-1 cursor-pointer"
              onClick={() => {}}
            >
              <Home />
              <span className="group-data-[collapsible=icon]:hidden">Home</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {loading && (
          <div className="px-2 py-1 text-sm text-muted-foreground">
            Loading accounts...
          </div>
        )}

        {!loading &&
          accounts.map((acc) => {
            const Icon = vendorMeta[acc.vendor]?.icon || defaultIcon;
            return (
              <SidebarMenuItem key={acc.id}>
                <SidebarMenuButton
                  asChild
                  isActive={currentAccount?.id === acc.id}
                >
                  <div
                    onClick={() => {
                      setCurrentAccount(acc);
                    }}
                    className={`flex items-center w-full gap-2 px-2 py-1 cursor-pointer ${
                      currentAccount?.id === acc.id
                        ? "bg-primary/10 border-l-4 border-l-primary"
                        : ""
                    }`}
                  >
                    <Icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {acc.account_name}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
