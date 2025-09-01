import React from "react";
import ProfileMenu from "./ProfileMenu";
import { Button } from "../ui/button";
import { Bell, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between pe-2 py-4 bg-background border-b border-border/40">
      {/* Left Section - Breadcrumb and Title */}
      <div className="flex items-center space-x-3">
        <SidebarTrigger className="h-9 w-9 p-2 hover:bg-accent/50 transition-colors rounded-lg" />

        <div className="flex items-center space-x-1 text-muted-foreground">
          <span className="hidden sm:block text-sm">Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-1 hidden sm:block" />
          <span className="text-sm">Analytics</span>
        </div>

        <div className="hidden lg:block  h-6 w-px bg-border/60 mx-2" />

        <h1 className="hidden lg:block  text-xl font-semibold text-foreground">
          Performance Overview
        </h1>
      </div>

      {/* Right Section - profile and Actions */}
      <div className="flex items-center space-x-3">
        {/* Action Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full border border-border/40 hover:bg-accent/50 transition-colors"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <ModeToggle />

        <ProfileMenu />
      </div>
    </nav>
  );
};

export default Navbar;
