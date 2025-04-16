import {
  User,
  KeyRound,
  Building,
  List,
  Users,
  Map,
  Database,
  Settings,
  MonitorCog
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const SettingsSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath.includes(path);
  };

  const isActiveExact = (path: string) => {
    return currentPath === path;
  };

  return (
    <Sidebar collapsible="none" className="!relative pt-5">
      {/* <SidebarHeader>
        <p className="text-2xl font-bold text-start pt-5 pb-0 mb-0">Settings</p>
      </SidebarHeader> */}
      <SidebarContent>
        {/* General Section  */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings/general")}
                  tooltip="General"
                >
                  <div>
                    <MonitorCog  className="h-4 w-4" />
                    <span>General</span>
                  </div>
                </SidebarMenuButton>

                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/general/preferences")}
                    >
                      <Link to="/settings/general/preferences">Preferences</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings/account")}
                  tooltip="Account"
                >
                  <div>
                    <User className="h-4 w-4" />
                    <span>Account</span>
                  </div>
                </SidebarMenuButton>

                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/account/info")}
                    >
                      <Link to="/settings/account/info">Account Info</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/account/password")}
                    >
                      <Link to="/settings/account/password">Password</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Organization Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/settings/organization")}
                  tooltip="Organization"
                >
                  <Link to="/settings/organization/list">
                    <Building className="h-4 w-4" />
                    <span>Organization</span>
                  </Link>
                </SidebarMenuButton>

                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/organization/list")}
                    >
                      <Link to="/settings/organization/list">
                        List and Create
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/organization/members")}
                    >
                      <Link to="/settings/organization/members">
                        Members and Invitations
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact(
                        "/settings/organization/navigation",
                      )}
                    >
                      <Link to="/settings/organization/navigation">
                        Navigations
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/organization/data")}
                    >
                      <Link to="/settings/organization/data">Your Data</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SettingsSidebar;
