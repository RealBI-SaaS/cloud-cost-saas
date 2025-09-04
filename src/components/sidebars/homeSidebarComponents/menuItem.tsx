import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  name: string;
  path: string;
  icon: LucideIcon;
}

const MenuItem = ({ name, path, icon }: Props) => {
  const location = useLocation(); // Make sure you're using the hook to access the path
  const isActive = location.pathname === path;
  const Icon = icon;

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className={` transition-all duration-200  py-6  min-w-full  hover:bg-primary/20 `}
    >
      <Link to={path} className="flex   items-center gap-3 py-2.5 group">
        <div
          className={`p-1.5 flex  justify-center rounded-lg transition-colors ${
            isActive
              ? "bg-muted/40"
              : "bg-muted/50 text-muted-foreground group-hover:bg-accent"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className=" font-semibold  group-data-[collapsible=icon]:hidden">
          {name}
        </span>
      </Link>
    </SidebarMenuButton>
  );
};

export default MenuItem;
