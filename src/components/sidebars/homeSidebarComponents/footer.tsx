import { SidebarMenuButton } from "@/components/ui/sidebar";
import numLockLogo from "/logo-only.svg";
import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  BuildingIcon,
  CreditCard,
  HelpCircle,
  Home,
  Settings,
} from "lucide-react";
import { CarOutlined } from "@ant-design/icons";

const Footer = () => {
  return (
    <div>
      <SidebarMenuButton
        asChild
        isActive={location.pathname === "/settings"}
        className="rounded-lg transition-all duration-200 hover:bg-accent py-5 "
      >
        <Link to="/settings" className="flex items-center gap-3 py-2.5 group">
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              location.pathname === "/settings"
                ? "bg-primary/20 text-primary"
                : "bg-muted/50 text-muted-foreground group-hover:bg-accent"
            }`}
          >
            <Settings className="h-4 w-4" />
          </div>
          <span className="font-medium group-data-[collapsible=icon]:hidden">
            Settings
          </span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton
        asChild
        isActive={location.pathname === "/billing"}
        className="rounded-lg transition-all duration-200 hover:bg-accent py-5 "
      >
        <Link to="/setting" className="flex items-center gap-3 py-2.5 group">
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              location.pathname === "/billing"
                ? "bg-primary/20 text-primary"
                : "bg-muted/50 text-muted-foreground group-hover:bg-accent"
            }`}
          >
            <CreditCard className="h-4 w-4" />
          </div>
          <span className="font-medium group-data-[collapsible=icon]:hidden">
            Billing
          </span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuButton
        asChild
        isActive={location.pathname === "/support"}
        className="rounded-lg transition-all duration-200 hover:bg-accent py-5 "
      >
        <Link to="/setting" className="flex items-center gap-3 py-2.5 group">
          <div
            className={`p-1.5 rounded-lg transition-colors ${
              location.pathname === "/support"
                ? "bg-primary/20 text-primary"
                : "bg-muted/50 text-muted-foreground group-hover:bg-accent"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="font-medium group-data-[collapsible=icon]:hidden">
            Support
          </span>
        </Link>
      </SidebarMenuButton>
      <div className=" border-t mt-2 pt-2 border-border/40">
        <SidebarMenuButton asChild variant="muted">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Avatar className="rounded-none">
              <AvatarImage src={numLockLogo} />
              <AvatarFallback>RB</AvatarFallback>
            </Avatar>
            <p className="font-bold text-xl text-[#2387e9ff]">
              Num
              <span className="text-[#cd5a13ff]">Lock</span>
            </p>
          </Link>
        </SidebarMenuButton>
      </div>{" "}
    </div>
  );
};

export default Footer;
