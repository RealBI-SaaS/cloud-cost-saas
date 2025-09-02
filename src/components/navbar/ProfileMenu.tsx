import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import Logout from "@/pages/auth/logout";

const ProfileMenu = () => {
  const handlLogout = () => {
    const logout = Logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://yosefemyayu.pythonanywhere.com/static/img/my_pic.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 p-0 rounded-lg border-border/60"
        sideOffset={8}
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="flex" to="/account/me">
            <User className=" mr-1 " />
            Profile
          </Link>
          {/* <Link to="/account/me">account/me</Link> */}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className=" mr-1 " />
          Setting
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" asChild>
          <Link to="/logout">
            <LogOut className=" mr-1 " />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
