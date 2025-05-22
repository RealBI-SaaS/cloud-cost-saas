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
import useOrgStore from "@/context/OrgStore";
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
  // const { userComp, userOrgs } = useOrg();
  const userComp = useOrgStore((state) => state.userComp);
  const userOrgs = useOrgStore((state) => state.userOrgs);
  const currentOrg = useOrgStore((state) => state.currentOrg);
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
  console.log(currentOrg);

  return (
    <Sidebar collapsible="icon" {...props}>
      {state == "expanded" ? (
        !currentOrg?.company_logo ? (
          <SidebarHeader>
            {/* <p className="text-3xl text-primary px-3 py-5 bold-lg">
              {currentOrg?.company_name || "RealBI"}
            </p> */}
            <img
              src={text_and_logo}
              alt="Logo"
              className="h-14 object-contain "
            />
          </SidebarHeader>
        ) : (
          <img
            src={`${import.meta.env.VITE_BASE_URL}/media/${currentOrg.company_logo}` }
            alt={`${currentOrg?.company_name} logo`}
            className="h-24 object-contain px-3 py-5"
          />
        )
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

        {userOrgs.length > 0 && <OrganizationSelector />}

        <hr className="" />

        <SideBarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
