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

import { OrganizationSelector } from "@/components/sidebars/homeSidebarComponents/organization-selector";
import { NavigationsList } from "@/components/sidebars/homeSidebarComponents/navigation-list";
import { SideBarUser } from "@/components/sidebars/homeSidebarComponents/sidebar-footer-account";
import { Link } from "react-router-dom";
import text_and_logo from "/text-and-logo.png";
import useCompany from "@/stores/CompanyStore";
import real_bi_logo from "/logo-only.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { useOrg } from "@/context/OrganizationContext";
// import useOrgStore from "@/stores/OrgStore";
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
  // const { userComp } = useCompany();
  const userComp = useCompany((state) => state.userComp);
  // const userOrgs = useOrgStore((state) => state.userOrgs);
  // const currentOrg = useOrgStore((state) => state.currentOrg);
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
    <Sidebar collapsible="icon" {...props} className="border-border ">
      {/* {state == "expanded" ? ( */}
      {/*   <img */}
      {/*     src={`${import.meta.env.VITE_BASE_URL}${userComp.company_logo}`} */}
      {/*     alt={`${currentOrg?.company_name} logo`} */}
      {/*     className="h-24 object-contain px-3 py-5" */}
      {/*   /> */}
      {/* ) : ( */}
      {/*   <></> */}
      {/* )} */}

      <SidebarHeader>
        <SidebarMenuButton asChild variant="muted">
          <Link to="/dashboard">
            <Avatar>
              <AvatarImage src={real_bi_logo} />
              <AvatarFallback>RB</AvatarFallback>
            </Avatar>
            <span className="font-bold text-lg">RealBI </span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="">
        {/* navigations list */}
        <NavigationsList />
      </SidebarContent>
      <SidebarFooter>
        {/*setting menu item */}

        {/* {userOrgs.length > 0 && <OrganizationSelector />} */}

        <hr className="border-border" />

        <SideBarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
