import React, { useState, useEffect } from "react";
import ProfileMenu from "./ProfileMenu";
import { Button } from "../ui/button";
import { Bell, Search, ChevronRight, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close search when route changes
    useEffect(() => {
        setIsSearchOpen(false);
    }, [location.pathname]);

    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics", href: "/dashboard/analytics" },
    ];

    return (
        <nav className={`
      flex items-center justify-between px-4 lg:px-6 py-3 bg-background border-b border-border/40 
      sticky top-0 z-50 transition-all duration-300
      ${isScrolled ? "shadow-sm backdrop-blur-sm bg-background/95" : ""}
    `}>
            {/* Left Section - Breadcrumb and Title */}
            <div className="flex items-center space-x-2 lg:space-x-3">
                {/*<SidebarTrigger className="h-9 w-9 p-2 hover:bg-accent/50 transition-colors rounded-lg flex-shrink-0" />*/}

                {/* Mobile menu button (alternative to sidebar trigger) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-9 w-9 p-2 hover:bg-accent/50 transition-colors rounded-lg"
                    onClick={() => {/* Add mobile menu toggle logic */}}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-1 text-muted-foreground min-w-0">
                    <span className="hidden sm:inline text-sm truncate">Dashboard</span>
                    <ChevronRight className="h-4 w-4 mx-1 hidden sm:inline" />
                    <span className="text-sm font-medium text-foreground truncate">
            Analytics
                </div>

                <div className="h-6 w-px bg-border/60 mx-2 hidden lg:block" />

                <h1 className="hidden lg:block text-xl font-semibold text-foreground truncate max-w-xs">
                    Performance Overview
                </h1>
            </div>

            {/* Right Section - Search and Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Mobile Search Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-10 w-10 rounded-full border border-border/40 hover:bg-accent/50 transition-colors"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                    {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>

                {/* Search Box - Desktop */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search dashboards, reports..."
                        type="search"
                        className="pl-10 pr-4 h-10 w-60 lg:w-80 rounded-full border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                    />
                </div>

                {/* Search Box - Mobile (expands when open) */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 bg-background border-b border-border/40 p-3 md:hidden">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                type="search"
                                autoFocus
                                className="pl-10 pr-4 h-10 w-full rounded-full border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20"
                                onBlur={() => setIsSearchOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Notification Bell with Badge */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full border border-border/40 hover:bg-accent/50 transition-colors relative"
                        onClick={() => setHasNotifications(false)}
                    >
                        <Bell className="h-5 w-5" />
                        {hasNotifications && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                    </Button>
                </div>

                <ModeToggle />

                <ProfileMenu />
            </div>
        </nav>
    );
};

export default Navbar;