import React from "react";
import clsx from "clsx";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  User,
  Lock,
  Building2,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { OrganizationSelector } from "@/components/organization-selector";
import { NavigationsList } from "@/components/navigation-list";
import { SideBarUser } from "@/components/sidebar-footer-account";
import { Link } from "react-router-dom";
import text_and_logo from "/text-and-logo.png";
import { useOrg } from "@/context/OrganizationContext";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  //{
  //  title: "Inbox",
  //  url: "#",
  //  icon: Inbox,
  //},
  //{
  //  title: "Calendar",
  //  url: "#",
  //  icon: Calendar,
  //},
  //{
  //  title: "Search",
  //  url: "#",
  //  icon: Search,
  //},
  //{
  //  title: "Settings",
  //  url: "#",
  //  icon: Settings,
  //},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen } = useSidebar();
  const location = useLocation();
  const { userComp } = useOrg()

  // Check if we're on a settings page
  const isSettingsPage =
    location.pathname.includes("/settings") ||
    location.pathname.includes("/manage-all") ||
    location.pathname.includes("/create-company");

  // Set initial collapsed state for settings pages
  React.useEffect(() => {
    if (isSettingsPage && state === "expanded") {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isSettingsPage]);

  return (
    <Sidebar collapsible="icon" {...props}>
      {state == "expanded" ? (
        !userComp ? (<SidebarHeader>
          <img
            src={text_and_logo}
            alt="Logo"
            className=" h-8 object-contain "
          />
        </SidebarHeader>) :
          (
            <p className="text-3xl text-primary px-3 py-5 bold-lg">{userComp.name}</p>)
      ) : (
        <></>
      )}
      <SidebarContent>
        <hr />
        {/* navigations list*/}
        <NavigationsList />
      </SidebarContent>
      <SidebarFooter>
        {/*setting menu item */}

        <OrganizationSelector />

        <hr className="" />

        <SideBarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
