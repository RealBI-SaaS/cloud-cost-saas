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
import { useEffect } from "react";
import { useOrg } from "@/context/OrganizationContext";
import { Link, useLocation } from "react-router-dom";
import { navIcons, defaultIcon } from "@/assets/iconMap";
import useOrgStore from "@/context/OrgStore";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function NavigationsList() {
  const { isMobile } = useSidebar();
  const navigations = useOrgStore((state) => state.navigations);
  const currentOrg = useOrgStore((state) => state.currentOrg);
    // Filter out navigations that have a parent
    const parentNavigations = navigations.filter(nav => !nav.parent);

  let navigations_list = [
    // {
    //   name: "Welcome",
    //   key: 1,
    //   icon: Handshake,
    //   url: "/welcome",
    // },
    {
      name: "Home",
      key: 2,
      icon: House,
      url: "/home",
    },
    ...parentNavigations.map((nav) => ({
      name: nav.label,
      key: nav.id,
      icon: navIcons[nav?.icon] || defaultIcon,
      url: `#${nav.id}`,
      sub_navigations: navigations
        .filter(subNav => subNav.parent === nav.id)
        .map(subNav => subNav.id),
    })),
  ];


  const firstItemWithSubmenus = navigations_list.find(
    (item) => item.sub_navigations?.length > 0
  );
  const firstSubmenuKey = firstItemWithSubmenus?.key;

  

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
          <Collapsible
            key={item.key}
            asChild
            defaultOpen={isActive(item.url) || item.key === firstSubmenuKey}
            className="group/collapsible"
            
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive(item.url)} asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.name}
                    </span>
                    {item.sub_navigations?.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.sub_navigations?.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.sub_navigations.map((subNavId) => {
                      const subNav = navigations.find((nav) => nav.id === subNavId);
                      if (!subNav) return null;
                      return (
                        <SidebarMenuSubItem key={subNav.id}>
                          <SidebarMenuSubButton asChild>
                            <Link to={`#${subNav.id}`}>
                              <span>{subNav.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
