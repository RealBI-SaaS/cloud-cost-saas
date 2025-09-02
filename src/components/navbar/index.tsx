import React, { useEffect, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import { Button } from "../ui/button";
import { Bell, Search, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Notification from "./Notification";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const pathname = window.location;
  const page_header = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "cost-analysis",
      label: "Cost Analysis",
    },
    {
      id: "settings",
      label: "Settings",
    },
    {
      id: "account",
      label: "Personal Account",
    },
  ];

  const curent_page = page_header.find(
    (item) => item.id === pathname.pathname.split("/")[1]
  );
  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3.5 bg-background border-b border-border/40 transition-all duration-300 ${
        isScrolled ? "shadow-md backdrop-blur-sm bg-background/95" : "shadow-sm"
      }`}
    >
      {/* Left Section - Title and Description */}
      <div
        className={`flex flex-col transition-all duration-300 ${"opacity-100"}`}
      >
        <div className="flex items-center">
          <SidebarTrigger className="h-9 w-9 p-2 hover:bg-accent/50 transition-colors rounded-lg mr-3" />
          <h1 className="text-xl font-semibold text-foreground">
            {curent_page?.label}
          </h1>
        </div>
      </div>

      {/* Right Section  Notifications, and Profile */}
      <div className="flex items-center space-x-5 pe-5">
        {/* Action Buttons */}
        <Notification />
        <ModeToggle />
        <ProfileMenu />
      </div>
    </nav>
  );
};

export default Navbar;
