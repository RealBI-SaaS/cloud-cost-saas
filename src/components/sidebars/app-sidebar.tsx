import React, { useState } from "react";
import { Building2, Plus, ChevronsUpDown, Home, Search } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavigationsList } from "@/components/sidebars/homeSidebarComponents/navigation-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Vite public folder import
import realBiLogo from "/logo-only.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Header from "./homeSidebarComponents/header";
import Footer from "./homeSidebarComponents/footer";
import SelectedOrgContext from "@/context/selectedOrgContext";
import { allOrganizations } from "@/pages/dashboard/mockData";

// Menu items (extendable)
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const isSettingsPage =
    location.pathname.includes("/settings") ||
    location.pathname.includes("/manage-all") ||
    location.pathname.includes("/create-company");

  return (
    <Sidebar collapsible="icon" {...props} className="border-border">
      <SidebarHeader>
        <Header />
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent>
        <NavigationsList />
      </SidebarContent>

      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}
