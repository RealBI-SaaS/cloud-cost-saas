import { useContext, useState } from "react";
import {
  Home,
  ChevronDown,
  DollarSign,
  Cloud,
  CloudOff,
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import useCloudAccountsStore from "@/stores/CloudAccountStore";
import IntegrationSources from "@/pages/data/IntegrationSources";
import MenuItem from "./menuItem";
import useCloudAccounts from "@/hooks/useCloudAccounts";
import OrganizationContext from "@/context/organizationContext";
import { allOrganizations } from "@/pages/dashboard/mockData";

export function NavigationsList() {
  const { isMobile } = useSidebar(); // not used currently, maybe for future conditional rendering
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  // const { accounts, currentAccount, setCurrentAccount, loading } =
  //   useCloudAccountsStore();
  const { selectedOrg } = useContext(OrganizationContext);

  const { cloudAccounts, isLoading, error } = useCloudAccounts(selectedOrg.id);

  return (
    <div className="flex flex-col h-full pt-2">
      {/* Dashboard Navigation */}
      <SidebarGroup>
        <SidebarMenu>
          <MenuItem name="Dashboard" path="/dashboard" icon={Home} />
          <MenuItem
            name="Cost Analysis"
            path="/cost-analysis"
            icon={DollarSign}
          />
        </SidebarMenu>
      </SidebarGroup>

      {/* Cloud Accounts Section */}
      <SidebarGroup>
        <Collapsible
          open={isAccountsOpen}
          onOpenChange={setIsAccountsOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between px-1 mb-2">
            <SidebarGroupLabel className="uppercase gap-2 group-data-[collapsible=icon]:sr-only">
              <Cloud /> Cloud Accounts
            </SidebarGroupLabel>

            <div className="flex items-center gap-1">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                title="Add Cloud Account"
              >
                <IntegrationSources />
              </Button>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isAccountsOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <SidebarMenu>
              {isLoading ? (
                <div className="space-y-1 px-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg"
                    >
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-4 flex-1 group-data-[collapsible=icon]:hidden" />
                    </div>
                  ))}
                </div>
              ) : cloudAccounts.length === 0 ? (
                <div className="flex flex-col gap-2.5 items-center justify-center p-4 text-center rounded-lg bg-muted/30 mx-2">
                  <CloudOff />
                  <p className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                    No cloud accounts
                  </p>
                </div>
              ) : (
                cloudAccounts.map((acc) => {
                  const isActive = currentAccount?.id === acc.id;

                  return (
                    <SidebarMenuSub key={acc.id}>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="rounded-lg group relative"
                        >
                          <div
                            onClick={() => setCurrentAccount(acc)}
                            className={`flex items-center gap-3 py-2 transition-all duration-200 cursor-pointer ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-accent"
                            }`}
                          >
                            <div
                              className={`p-1.5 rounded-lg ${
                                isActive ? "bg-primary/20" : "bg-muted"
                              }`}
                            >
                              {/* You can add dynamic icons here if available */}
                            </div>

                            <span className="font-medium group-data-[collapsible=icon]:hidden truncate">
                              {acc.account_name}
                            </span>

                            {isActive && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 group-data-[collapsible=icon]:hidden">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              </div>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  );
                })
              )}
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>

      {/* Other Navigation */}
      <SidebarGroup>
        <SidebarMenu>
          <MenuItem name="Catalog" path="/catalog" icon={BookOpen} />
          <MenuItem name="Statistics" path="/statistics" icon={Users} />
          <MenuItem name="Campaign" path="/campaign" icon={Users} />
          <MenuItem
            name="Conversation"
            path="/conversation"
            icon={MessageCircle}
          />
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
