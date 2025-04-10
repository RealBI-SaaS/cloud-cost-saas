"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import AccountSettings, { accountNavItems } from "./AccountSettings";
import OrganizationSettings, { orgNavItems } from "./OrganizationSettings";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export default function Account() {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get("section") || "profile");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const NavItem = ({
    item,
    isActive,
  }: {
    item: NavItem;
    isActive: boolean;
  }) => {
    return (
      <Link
        to={`/account?section=${item.href.replace("#", "")}`}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive ? "bg-accent" : "transparent",
        )}
        onClick={() => {
          setActiveSection(item.href.replace("#", ""));
          setMobileNavOpen(false);
        }}
      >
        {item.icon}
        {item.title}
      </Link>
    );
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Navigation */}
        {/* <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="py-4 space-y-4">
                <h2 className="text-lg font-semibold px-3">Account</h2>
                <nav className="space-y-1">
                  {accountNavItems.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={activeSection === item.href.replace("#", "")}
                    />
                  ))}
                </nav>

                <h2 className="text-lg font-semibold px-3 pt-4">
                  Organizations
                </h2>
                <nav className="space-y-1">
                  {orgNavItems.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={activeSection === item.href.replace("#", "")}
                    />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div> */}

        {/* Desktop Sidebar */}
        {/* <aside className="hidden md:flex flex-col w-64 shrink-0">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Account</h2>
              <nav className="space-y-1">
                {accountNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={activeSection === item.href.replace("#", "")}
                  />
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Organizations</h2>
              <nav className="space-y-1">
                {orgNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={activeSection === item.href.replace("#", "")}
                  />
                ))}
              </nav>
            </div>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1">
          {activeSection === "profile" && <AccountSettings section="profile" />}
          {activeSection === "password" && <AccountSettings section="password" />}
          {activeSection === "organizations" && <OrganizationSettings />}
        </main>
      </div>
    </div>
  );
}
