import React, { useState } from "react";
import { Building2, Plus, ChevronsUpDown, Home, Search } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import numLockLogo from "/logo-only.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
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
import Header from "./homeSidebarComponents/OrgMenu";
import Footer from "./homeSidebarComponents/footer";
import SelectedOrgContext from "@/context/OrganizationContext";
import { allOrganizations } from "@/pages/dashboard/mockData";
import OrgMenu from "./homeSidebarComponents/OrgMenu";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-border">
      {/* header */}
      <SidebarHeader>
        <div className=" mt-2 pt-2 ">
          <SidebarMenuButton asChild variant="muted">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Avatar className="rounded-none">
                <AvatarImage src={numLockLogo} />
                <AvatarFallback>RB</AvatarFallback>
              </Avatar>
              <p className="font-bold text-xl text-[#2387e9ff]">
                Num
                <span className="text-[#cd5a13ff]">Lock</span>
              </p>
            </Link>
          </SidebarMenuButton>
        </div>{" "}
        <SidebarSeparator />
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent>
        <NavigationsList />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <Footer />
        <OrgMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
