import React, { useState } from "react";
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
import { Link } from "react-router-dom";

const Header = () => {
  const allOrganizations = [
    {
      initial: "A",
      name: "All organization",
      color: "bg-primary/10 text-primary",
      url: "org/all-organization",
    },
    {
      initial: "M",
      name: "Marketing team",
      color: "bg-primary/10 text-primary",
      url: "org/marketing-team",
    },
    {
      initial: "P",
      name: "Production team",
      color: "bg-secondary/10 text-secondary-foreground",
      url: "org/product-team",
    },
    {
      initial: "D",
      name: "Development team",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      url: "org/development-team",
    },
    {
      initial: "D",
      name: "Design team",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      url: "org/design-team",
    },
  ];

  const [organizations, setOrganizations] = useState(allOrganizations);
  const [selectedOrg, setSelectedOrg] = useState("All organization");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setOrganizations(
      allOrganizations.filter((org) => org.name.toLowerCase().includes(query))
    );
  };

  const handleOrgSelect = (orgName: string) => {
    setSelectedOrg(orgName);
  };

  return (
    <div className="py-2 border-b border-border/50 bg-gradient-to-r from-background to-background/95">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="
                  h-12 px-3 w-full rounded-lg border border-border/30
                  bg-sidebar-accent/50 hover:bg-sidebar-accent/70
                  transition-all duration-200 
                  data-[state=open]:bg-sidebar-accent/80
                "
              >
                <Building2 className="h-5 w-5 text-sidebar-primary transition-transform duration-200 group-hover:scale-110 flex-shrink-0" />
                <span className="font-semibold text-sidebar-foreground truncate max-w-[120px] text-sm">
                  {selectedOrg}
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
                  className="pl-9 pr-3 h-10 rounded-lg border-border/50 focus-visible:ring-2 focus-visible:ring-primary/25 text-sm"
                />
              </div>

              {/* Organization List */}
              <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
                {organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.name}
                    onClick={() => handleOrgSelect(org.name)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-accent/70 ${
                      org.name === selectedOrg ? "bg-accent/50" : ""
                    }`}
                  >
                    <Link
                      to={org.url}
                      className="flex items-center gap-3 w-full"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span
                        className={`flex items-center justify-center h-7 w-7 rounded-md font-bold text-xs shrink-0 ${org.color}`}
                      >
                        {org.initial}
                      </span>
                      <span className="truncate text-sm font-medium flex-grow">
                        {org.name}
                      </span>
                      {org.name === selectedOrg && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-border/40" />

              {/* Create New Organization */}
              <DropdownMenuItem className="flex items-center px-3 py-2 rounded-lg cursor-pointer border border-dashed border-border/40 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Create new organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};

export default Header;
