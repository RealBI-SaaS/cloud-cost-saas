"use client";

import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Home,
  ChevronDown,
  Plus,
  type LucideIcon,
  Cloud,
  DollarSign,
  CloudOff,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import useCloudAccountsStore from "@/stores/CloudAccountStore";
import IntegrationSources from "@/pages/data/IntegrationSources";
import { FcEmptyTrash } from "react-icons/fc";
// import { vendorMeta, defaultIcon } from "@/data/iconMap";

export function NavigationsList() {
  const { isMobile } = useSidebar();
  const [isAccountsOpen, setIsAccountsOpen] = useState(true);
  const { accounts, currentAccount, setCurrentAccount, loading } =
    useCloudAccountsStore();
  const location = useLocation();
  const { orgId } = useParams();

  return (
    <div className="flex flex-col h-full pt-2">
      {/* Dashboard Navigation */}
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/dashboard"}
              className="rounded-lg transition-all duration-200 hover:bg-accent py-5 "
            >
              <Link
                to={"/dashboard"}
                className="flex items-center gap-3 py-2.5 group"
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    location.pathname === "/dashboard"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground group-hover:bg-accent"
                  }`}
                >
                  <Home className="h-4 w-4" />
                </div>
                <span className="font-medium group-data-[collapsible=icon]:hidden">
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/cost-analysis"}
              className="rounded-lg transition-all duration-200 hover:bg-accent py-5 "
            >
              <Link
                to={"/cost-analysis"}
                className="flex items-center gap-3 py-2.5 group"
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    location.pathname === "/cost-analysis"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground group-hover:bg-accent"
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                </div>
                <span className="font-medium group-data-[collapsible=icon]:hidden">
                  Cost Analysis
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
            <SidebarGroupLabel className=" uppercase  gap-2  group-data-[collapsible=icon]:sr-only">
              <Cloud /> Cloud Accounts
            </SidebarGroupLabel>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                title="Add Cloud Account"
              >
                <IntegrationSources />
                {/* <Plus className="h-3.5 w-3.5" /> */}
              </Button>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md group-data-[collapsible=icon]:hidden text-muted-foreground hover:text-foreground hover:bg-accent"
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
              {loading ? (
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
              ) : accounts.length === 0 ? (
                <div className="flex  gap-2.5 flex-col items-center justify-center p-4 text-center rounded-lg bg-muted/30 mx-2">
                  <CloudOff />
                  <p className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                    No cloud accounts
                  </p>{" "}
                </div>
              ) : (
                accounts.map((acc) => {
                  // const Icon = vendorMeta[acc.vendor]?.icon || defaultIcon;
                  const isActive = currentAccount?.id === acc.id;

                  return (
                    <SidebarMenuSub>
                      <SidebarMenuSub key={acc.id}></SidebarMenuSub>
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
                              {/* <Icon className="h-4 w-4" /> */}
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
    </div>
  );
}
