"use client";

import {
  Folder,
  Handshake,
  Forward,
  MoreHorizontal,
  Trash2,
  House,
  type LucideIcon,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useOrg } from "@/context/OrganizationContext";
import { Link, useLocation } from "react-router-dom";
import { navIcons, defaultIcon } from "@/assets/iconMap";
import useOrgStore from "@/context/OrgStore";

export function NavigationsList() {
  const { isMobile } = useSidebar();
  // const { navigations, currentOrg } = useOrg();
  const navigations = useOrgStore((state) => state.navigations);
  const currentOrg = useOrgStore((state) => state.currentOrg);

  let navigations_list = [
    {
      name: "Welcome", // Fix typo from "lable" to "label"
      key: 1,
      icon: Handshake,
      url: "/welcome",
    },
    {
      name: "Home", // Fix typo from "lable" to "label"
      key: 2,
      icon: House,
      url: "/home",
    },
    ...navigations.map((nav) => ({
      name: nav.label, // Ensure this matches the key name in the API response
      key: nav.id, // Use ID as the unique key
      icon: navIcons[nav?.icon] || defaultIcon, // Add icons if needed
    })),
  ];
  //useEffect(() => {
  //  if (navigations) {
  //    navigations_list = [];
  //
  //    navigations.map((nav) => {
  //      navigations_list.push({
  //        name: nav.label,
  //        icon: Folder,
  //        url: "#",
  //      });
  //    });
  //  }
  //}, [currentOrg]);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath.includes(path);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">
        Navigations
      </SidebarGroupLabel>
      <SidebarMenu>
        {navigations_list.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton isActive={isActive(item.url)} asChild>
              <Link to={item.url}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>

            {/* Optional: keep the dropdown trigger hidden on collapse */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
