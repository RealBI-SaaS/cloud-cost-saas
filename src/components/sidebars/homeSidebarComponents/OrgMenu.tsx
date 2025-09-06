import React, { useContext, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Building2, ChevronsUpDown, Plus, Search, Check } from "lucide-react";
import {
  allOrganizations,
  Organization,
} from "@/services/organization_service";
import OrganizationContext from "@/context/OrganizationContext";
import AddOrganization from "@/pages/setting/organization/AddOrganization";

const OrgMenu = () => {
  const colors = [
    "bg-primary/10 text-primary",
    "bg-primary/10 text-primary",
    "bg-secondary/10 text-secondary-foreground",
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    "bg-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  ];

  const { organizations, selectedOrg, setSelectedOrg } =
    useContext(OrganizationContext);

  const [sortedOrganizations, setSortedOrganizations] =
    useState<Organization[]>(organizations);
  const [search, setSearch] = useState("");

  // Initialize sortedOrganizations when organizations change
  useEffect(() => {
    setSortedOrganizations(organizations);
  }, [organizations]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search_text = e.target.value.toLowerCase();
    setSearch(search_text);

    setSortedOrganizations(
      organizations.filter((org) =>
        org.name.toLowerCase().includes(search_text)
      )
    );
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);

    // Sort organizations with selected org at the top
    const sorted = [...organizations].sort((a, b) => {
      if (a.id === org.id) return -1;
      if (b.id === org.id) return 1;
      return 0;
    });

    setSortedOrganizations(sorted);
  };

  return (
    <div className="border bg-accent border-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="
                  h-12 px-3 w-full rounded-sm border border-border/30
                  bg-primary/5 hover:bg-sidebar-accent hover:border-primary
                  transition-all duration-200 
                  data-[state=open]:bg-sidebar-accent/80
                "
              >
                <Building2 className="h-5 w-5 text-sidebar-primary transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <span className="font-semibold text-sidebar-foreground truncate max-w-[120px] text-sm">
                  {selectedOrg?.name || "Select Organization"}
                </span>
                <ChevronsUpDown className="ml-auto h-4 w-4 text-sidebar-muted-foreground transition-all duration-200 group-hover:text-sidebar-foreground group-hover:rotate-180" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="min-w-[240px] w-[var(--radix-popper-anchor-width)] p-3 rounded-xl border border-border/60 bg-popover shadow-2xl backdrop-blur-sm"
            >
              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  onChange={handleSearch}
                  value={search}
                  className="pl-9 pr-3 h-10 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary/25 text-sm"
                />
              </div>

              {/* Organization List */}
              <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
                {[allOrganizations, ...sortedOrganizations].map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleOrgSelect(org)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-accent/70 ${
                      org.id === selectedOrg?.id ? "bg-accent/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span
                        className={`flex items-center justify-center h-7 w-7 rounded-md font-bold text-xs shrink-0 ${
                          colors[Math.floor(Math.random() * colors.length)]
                        }`}
                      >
                        {org.name[0]}
                      </span>
                      <span className="truncate text-sm font-medium flex-grow">
                        {org.name}
                      </span>
                      {org.id === selectedOrg?.id && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-border/40" />

              {/* Create New Organization */}

              <AddOrganization variant="muted" />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};

export default OrgMenu;
