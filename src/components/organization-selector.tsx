import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useOrg } from "@/context/OrganizationContext";
import { StarOff, Plus, ChevronsUpDown, FolderX, Circle } from "lucide-react";
import { act, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useOrgStore from "@/context/OrgStore";
let orgs = [
  {
    name: "firstorg",
    comp_name: "firstcomp",
    logo: StarOff,
  },
];

export function OrganizationSelector() {
  // const { userOrgs, setCurrentOrg, currentOrg } = useOrg();
  const userOrgs = useOrgStore((state) => state.userOrgs);
  const setCurrentOrg = useOrgStore((state) => state.setCurrentOrg);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const navigate = useNavigate();
  const [activeOrg, setActiveOrg] = useState(
    currentOrg?.name
      ? {
        name: currentOrg.name,
        comp_name: currentOrg.company_name,
        logo: StarOff,
      }
      : {
        name: "select ",
        comp_name: "-",
        logo: StarOff,
      },
  );
  const { state } = useSidebar();
  //populate with userorgs
  useEffect(() => {
    if (userOrgs) {
      orgs = [];
      userOrgs.map((org) => {
        orgs.push({
          name: org.name,
          comp_name: org.company_name,
          logo: StarOff,
        });
      });
    }
    // console.log("orgg", userOrgs, orgs);
  }, [userOrgs]);

  useEffect(() => {
    if (userOrgs.length > 0 && !currentOrg) {
      setCurrentOrg(userOrgs[0]);

      //setSelectedOrg(userOrgs[0]); // Update local state
    } else {
      //console.log("Dd");
      //console.log(currentOrg);
      setActiveOrg({
        name: currentOrg.name,
        comp_name: currentOrg.company_name,
        logo: Circle,
      });
    }
  }, [userOrgs, currentOrg]);

  useEffect(() => {
    // console.log("new org", activeOrg);
    const matchedOrg = userOrgs.find((org) => org.name === activeOrg.name);
    if (matchedOrg) {
      setCurrentOrg(matchedOrg);
    }
  }, [activeOrg]);

  const { isMobile } = useSidebar();
  if (activeOrg) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <activeOrg.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeOrg.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {activeOrg.comp_name}
                  </span>
                </div>
                {state == "expanded" && <ChevronsUpDown className="ml-auto" />}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {orgs.map((org, index) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => {
                    //handleSideMenuOrgSelect(team);

                    setActiveOrg(org);
                  }}
                  className="gap-2 p-2"
                >
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  } else {
    console.log("no active org");
  }
}
