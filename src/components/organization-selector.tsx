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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
let orgs = [
  {
    name: "firstorg",
    logo: StarOff,
  },
];

export function OrganizationSelector() {
  const { userOrgs, setCurrentOrg, currentOrg } = useOrg();
  const navigate = useNavigate();
  const [activeOrg, setActiveOrg] = useState(
    currentOrg?.name
      ? {
        name: currentOrg.name,
        logo: StarOff,
      }
      : {
        name: "select ",
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
      setActiveOrg({
        name: currentOrg.name,
        logo: Circle,
      });
    }
  }, [userOrgs, currentOrg, setCurrentOrg]);

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
                  <span className="truncate text-xs">{activeOrg.name}</span>
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
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <org.logo className="size-3.5 shrink-0" />
                  </div>
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
