import useUserStore from "@/context/userStore";
import useOrgStore from "@/context/OrgStore";
import {
  User,
  KeyRound,
  Building,
  List,
  Users,
  Map,
  Database,
  Settings,
  MonitorCog,
  Hammer,
  Home,
  ChevronLeft,
  UsersRound,
  UserRound,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
const SettingsSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const userComp = useOrgStore((state) => state.userComp);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const userOrgs = useOrgStore((state) => state.userOrgs);
  const location = useLocation();
  const currentPath = location.pathname;
  //const { user } = useUser();
  const user = useUserStore((state) => state.user);
  //console.log(userOrgs.length);

  const isActive = (path: string) => {
    return currentPath.includes(path);
  };

  const isActiveExact = (path: string) => {
    return currentPath === path;
  };

  return (
    <Sidebar
      collapsible="none"
      className="!relative h-full overflow-y-auto"
      {...props}
    >
      <SidebarHeader>
        <p className="text-2xl font-bold text-start pt-5 pb-0 mb-0">Settings</p>
      </SidebarHeader>
      <hr />
      <SidebarContent>
        {/* General Section  */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  //isActive={isActive("/settings/general")}
                  tooltip="General"
                >
                  <div>
                    <MonitorCog className="h-4 w-4" />
                    <span>General</span>
                  </div>
                </SidebarMenuButton>

                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isActiveExact("/settings/general/preferences")}
                    >
                      <Link to="/settings/general/preferences">
                        Preferences
                      </Link>
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
                  //isActive={isActive("/settings/account")}
                  tooltip="Account"
                >
                  <Link to="/settings/account/info">
                    <UserRound />
                    <span>Account</span>
                  </Link>
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
                  {/* TODO: hide for google users >> {!user.is_google_user && ( */}
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

        {/* Company Section */}
        {userComp && (
          <SidebarGroup>
            <SidebarGroupLabel>Company</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    //isActive={isActive("/settings/organization")}
                    tooltip="Company"
                  >
                    <Link to="settings/company/details">
                      <Building className="h-4 w-4" />
                      <span>Company</span>
                    </Link>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActiveExact("/settings/company/details")}
                      >
                        <Link to="settings/company/details">Your Company</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActiveExact("/settings/company/styles")}
                      >
                        <Link to="settings/company/styles">Manage Colors</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Organization Section */}
        {(userComp ||currentOrg?.role != "member" ||  user.is_staff) && (
          <SidebarGroup>
            <SidebarGroupLabel>Organization</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    //isActive={isActive("/settings/organization")}
                    tooltip="Organization"
                  >
                    <Link to="/settings/organization/list">
                      <UsersRound />
                      <span>Organizations</span>
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

                     {(userOrgs.length > 0) && (<SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActiveExact(
                          "/settings/organization/members",
                        )}
                      >
                        <Link to="/settings/organization/members">
                          Members and Invitations
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>)
                  }

                    {(currentOrg?.role === "admin" ||
                      currentOrg?.role === "owner" ||
                      user.is_staff) && (
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
                      )}

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
        )}

        {/* admin Section */}
        {user?.is_staff && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    //isActive={isActive("/settings/admin")}
                    tooltip="Admin"
                  >
                    <Link to={`${import.meta.env.VITE_BASE_URL}/admin`}>
                      <Hammer className="h-4 w-4" />
                      <span>Admin Protal</span>
                    </Link>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActiveExact(
                          "/settings/organization/backend",
                        )}
                      >
                        <Link to={`${import.meta.env.VITE_BASE_URL}/admin`}>
                          Backend Admin Portal
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="text-sm mb-5 px-3 ">
          <Link to="/home">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ChevronLeft />
                Back to home
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SettingsSidebar;
