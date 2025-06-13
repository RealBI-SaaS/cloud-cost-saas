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
import { navIcons, defaultIcon } from "@/assets/iconMap";
import useOrgStore from "@/context/OrgStore";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "./ui/button";

export function NavigationsList() {
  const { isMobile } = useSidebar();
  const navigations = useOrgStore((state) => state.navigations);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const [activeNav, setActiveNav] = useState<string | null>("home");
  const [activeParent, setActiveParent] = useState<string | null>(null);

  const location = useLocation();
  const currentPath = location.pathname;

  const normalize = (str) => str.toLowerCase().replace(/\/+$/, ""); // remove trailing slashes

  // const isActive = (navItemUrl) => {
  //   const current = normalize(currentPath);
  //   const target = normalize(navItemUrl);

  //   return (
  //     current === target ||
  //     (current.startsWith(target) && target !== "/dashboard")
  //   );
  // };
  const firstNavWithChildrenId = navigations.find(
    (nav) => nav.children?.length > 0,
  )?.id;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">
        Navigations
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={activeNav == "home"}>
            <div className="flex items-center w-full gap-2 px-2 py-1 cursor-pointer" onClick={() => {setActiveNav("home"); setActiveParent(null)}}>
              <Home />
              <span className="group-data-[collapsible=icon]:hidden">Home</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {navigations.map((nav, ind) => {
          const Icon = navIcons[nav?.icon] || defaultIcon;
          const navUrl = `/dashboard/${nav.label}`;

          return (
            <Collapsible
              key={nav.id}
              asChild
              open={activeParent === nav.id || nav.id === firstNavWithChildrenId}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton  asChild>
                    <div
                      onClick={() => {setActiveNav(nav.children[0].id); setActiveParent(nav.id)}} // <- your custom function
                      className={`flex items-center w-full gap-2 px-2 py-1 cursor-pointer ${activeParent === nav.id ? "bg-primary/10 border-l-4 border-l-primary" : ""}`}
                    >
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {nav.label}
                      </span>
                      {nav.children.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {nav.children.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {nav.children.map((subNav) => (
                        <SidebarMenuSubItem key={subNav.id}>
                          <SidebarMenuSubButton asChild isActive={subNav.id == activeNav}> 
                            <div
                              onClick={() => {
                                setActiveNav(subNav.id);
                                setActiveParent(nav.id);
                              }}
                              className="flex items-center w-full gap-2 px-2 py-1 cursor-pointer"
                            >
                              <span>{subNav.label}</span>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
