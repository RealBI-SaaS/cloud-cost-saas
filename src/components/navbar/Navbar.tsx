import React from "react";
import { ThemeToggle } from "../settings/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CircleUserRound } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="my-4 flex justify-between">
      <p className=" font-bold text-xl">Dashboard</p>

      <div className=" rounded-4xl bg-accent p-0.5 px-2 flex items-center gap-4">
        <input placeholder="Search" />

        <ThemeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            <CircleUserRound />
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
