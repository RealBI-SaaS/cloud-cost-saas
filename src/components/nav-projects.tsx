//<DropdownMenuSeparator />
//
import * as React from "react";
import { useNavigationHandlers } from "./hooks/useNavigationHandlers";
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Map,
  type LucideIcon,
} from "lucide-react";
import { handleSidebarItemClick } from "../utils/ui/handleSideBarNavigationClick";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useOrg } from "@/context/OrganizationContext";

export function NavProjects({
  projects: initialProjects,
}: {
  projects: {
    name: string;
    url: string;
    org: string;
    id: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { handleNavigationDelete } = useNavigationHandlers();
  const { navigations, currentOrg } = useOrg();
  const [projects, setProjects] = useState(initialProjects);

  React.useEffect(() => {
    const addNavigations = () => {
      console.log("Refetch");
      if (navigations) {
        const updatedProjects = [...initialProjects];
        navigations.forEach((nav) => {
          const exists = updatedProjects.some((item) => item.name === nav.label);
          if (!exists) {
            updatedProjects.push({
              name: nav.label,
              url: "#",
              org: nav.organization,
              id: nav.id,
              icon: Map,
            });
          }
        });
        setProjects(updatedProjects);
      }
    };

    addNavigations();
  }, [currentOrg, navigations, initialProjects]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Navigations</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                onClick={(e) => {
                  handleSidebarItemClick(e, item);
                }}
              >
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
                <DropdownMenuItem
                  onClick={() => {
                    handleNavigationDelete(item.id);
                    console.log(item);
                  }}
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Navigation</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
