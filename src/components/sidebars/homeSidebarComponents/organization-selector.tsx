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
import useOrgStore from "@/stores/OrgStore";
import { useThemeStore, useThemeInitializer } from "@/stores/ThemeStore";

import { toast } from "sonner";
import { useUserGroupStore } from "@/stores/UserGroupStore";

let orgs = [
  {
    name: "firstorg",
    comp_name: "firstcomp",
    logo: StarOff,
  },
];

//TODO: refactor and clean this code up
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
          logo: Circle,
        }
      : {
          name: "select ",
          comp_name: "-",
          logo: Circle,
        },
  );
  const { state } = useSidebar();

  //console.log("DFFF", userOrgs);
  //populate with userorgs
  useEffect(() => {
    if (userOrgs) {
      orgs = [];
      userOrgs.map((org) => {
        orgs.push({
          name: org.name,
          comp_name: org.company_name,
          logo: Circle,
        });
      });
    }
  }, [userOrgs]);

  // Update activeOrg when currentOrg changes
  useEffect(() => {
    if (currentOrg?.name && currentOrg.name !== activeOrg.name) {
      setActiveOrg({
        name: currentOrg.name,
        comp_name: currentOrg.company_name,
        logo: Circle,
      });
    }
  }, [currentOrg]);

  // Only handle org changes when activeOrg is explicitly changed by user
  useEffect(() => {
    // console.log(currentOrg.name);
    //const matchedOrg = userOrgs.find((org) => org.name === activeOrg.name);
    //if (matchedOrg && matchedOrg.id !== currentOrg?.id) {
    //setCurrentOrg(matchedOrg);
    // useUserGroupStore.getState().fetchGroups(currentOrg.id);

    useOrgStore.getState().fetchNavigations();
    useThemeStore.getState().initializeTheme(currentOrg.company);
    //}
  }, [currentOrg.name]);
  const handleSideMenuOrgChange = ((org)=>{
                    setCurrentOrg(org);
                    
      toast.success(`You are now in ${org.name}`);

  })

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
              {userOrgs.map((org, index) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => {
                    handleSideMenuOrgChange(org);


                    // setCurrentOrg(org);
                    //setActiveOrg({
                    //  name: org.name,
                    //  comp_name: org.company_name,
                    //  logo: Circle,
                    //},);
                  }}
                  className={`gap-2 p-2 ${currentOrg == org ? 'bg-sidebar-accent' : ''} hover:bg-transparent`}
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
