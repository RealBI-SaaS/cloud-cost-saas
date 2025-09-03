import { SidebarMenuButton } from "@/components/ui/sidebar";
import React from "react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { CreditCard, HelpCircle, Home, Settings } from "lucide-react";
import { CarOutlined } from "@ant-design/icons";
import MenuItem from "./menuItem";

const Footer = () => {
  return (
    <div>
      <MenuItem name="Settings" path="/settings" icon={Settings} />
      <MenuItem name="Billing" path="/billing" icon={CreditCard} />
      <MenuItem name="Support" path="/support" icon={HelpCircle} />
    </div>
  );
};

export default Footer;
