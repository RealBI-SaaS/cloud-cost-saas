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
import { useEffect, useState } from "react";
import { useOrg } from "@/context/OrganizationContext";
import { Link, useLocation } from "react-router-dom";
import { navIcons, defaultIcon } from "@/assets/iconMap";
import useOrgStore from "@/context/OrgStore";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Navigation {
  id: string;
  label: string;
  icon?: string;
  parent?: string | null;
}

interface NavigationItem {
  name: string;
  key: string | number;
  icon: LucideIcon | React.ElementType;
  url: string;
  sub_navigations?: {
    id: string;
    label: string;
    url: string;
  }[];
}

export function NavigationsList() {
  const { isMobile } = useSidebar();
  const navigations = useOrgStore((state) => state.navigations) as unknown as Navigation[];
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  // Filter out navigations that have a parent
  const parentNavigations = navigations.filter(nav => !nav.parent);

  let navigations_list: NavigationItem[] = [
    {
      name: "Home",
      key: 2,
      icon: House,
      url: "/dashboard/",
    },
    ...parentNavigations.map((nav) => ({
      name: nav.label,
      key: nav.id,
      icon: navIcons[nav?.icon] || defaultIcon,
      url: `/dashboard/${nav.id}`,
      sub_navigations: navigations
        .filter(subNav => subNav.parent === nav.id)
        .map(subNav => ({
          id: subNav.id,
          label: subNav.label,
          url: `/dashboard/${nav.id}/${subNav.id}/`
        })),
    })),
  ];
  // console.log("navigations_list",navigations);


  const firstItemWithSubmenus = navigations_list.find(
    (item) => item.sub_navigations?.length > 0
  );
  const firstSubmenuKey = firstItemWithSubmenus?.key;

  

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (navItem: NavigationItem) => {
    console.log("currentPath",currentPath);
    console.log("navItem.url",navItem.url); 
    return currentPath === navItem.url || (currentPath.startsWith(navItem.url) && navItem.url !== "/dashboard/"); 
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
            defaultOpen={isActive(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isActive(item)} asChild>
                  <Link
                    to={item.url}
                    // state={{ title: item.name }}
                  >
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
                    {item.sub_navigations.map((subNav) => (
                      <SidebarMenuSubItem key={subNav.id}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subNav.url}
                            // state={{ title: `${item.name} > ${subNav.label}` }}
                          >
                            <span>{subNav.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
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
