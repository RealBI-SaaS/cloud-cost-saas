"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
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

export function NavigationsList() {
  const { isMobile } = useSidebar();
  const { navigations, currentOrg } = useOrg();
  let navigations_list = [
    {
      name: "Welcome", // Fix typo from "lable" to "label"
      key: 1,
      icon: Folder,
    },
    ...navigations.map((nav) => ({
      name: nav.label, // Ensure this matches the key name in the API response
      key: nav.id, // Use ID as the unique key
      icon: Folder, // Add icons if needed
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

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Navigations</SidebarGroupLabel>
      <SidebarMenu>
        {navigations_list.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
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
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
