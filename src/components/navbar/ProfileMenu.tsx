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
  const logout = Logout;

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
      <DropdownMenuContent sideOffset={12} className="me-3">
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
        <DropdownMenuItem onClick={() => handlLogout()} variant="destructive">
          <LogOut className=" mr-1 " />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
