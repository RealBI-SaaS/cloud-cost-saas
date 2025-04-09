//import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
//import { useUser } from "../context/UserContext";
//import { Avatar } from "antd";
//import checkIcon from "/check.png";
//import { IoMdCreate, IoMdClose } from "react-icons/io";
//import ManageAllSideMenu from "./menu/ManageAllSideMenu";
////import axios from "axios";
//import axiosInstance from "../axios/axiosInstance";
//
//import SettingsMenu from "./menu/SettingsMenu";
//import change_password from "../utils/auth/change_password";
//import { validatePassword } from "../utils/auth/password_validate";
//import check_correct_password from "../utils/auth/check_correct_password";
//import Logout from "./logout";
//
//const Account = () => {
//  const { user, fetchUserData, setUser } = useUser();
//  const userName = user?.first_name || user?.email || "x";
//  const userInitial = userName.charAt(0).toUpperCase();
//  const navigate = useNavigate();
//
//  const [isEditing, setIsEditing] = useState(false);
//  const [showPassword, setShowPassword] = useState(false);
//  const [formData, setFormData] = useState({
//    firstName: "",
//    lastName: "",
//  });
//
//  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
//  const [passwordFormData, setPasswordFormData] = useState({
//    currentPass: "",
//    newPass: "",
//  });
//
//  useEffect(() => {
//    if (user) {
//      setFormData({
//        firstName: user.first_name || "",
//        lastName: user.last_name || "",
//      });
//    }
//  }, [user]);
//
//  if (!user) {
//    return <div>Loading...</div>;
//  }
//  const handlePasswordChangeFormSubmit = async (e) => {
//    e.preventDefault();
//
//    let response = validatePassword(passwordFormData.newPass);
//
//    if (response) {
//      setPasswordChangeMessage(response);
//      return;
//    }
//    response = await check_correct_password(
//      user.email,
//      passwordFormData.currentPass,
//    );
//    console.log(response);
//    if (!response) {
//      setPasswordChangeMessage("The value for your current password is wrong!");
//      return;
//    }
//    const accessToken = localStorage.getItem("access_token");
//    response = await change_password(
//      passwordFormData.currentPass,
//      passwordFormData.newPass,
//      accessToken,
//    );
//
//    if (!response) {
//      navigate("/logout");
//    } else {
//      setPasswordChangeMessage("Unexpected response. Please try again.");
//    }
//  };
//
//  //TODO: Refactor this method
//  const handleUpdateFormSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      const response = await axiosInstance.patch("/myauth/user/", {
//        first_name: formData.firstName,
//        last_name: formData.lastName,
//      });
//      // Fetch updated user data to ensure we have all fields
//      const accessToken = localStorage.getItem("access_token");
//      const updatedUserData = await fetchUserData(accessToken);
//      setUser(updatedUserData);
//
//      console.log(updatedUserData);
//      setIsEditing(false);
//    } catch (error) {
//      console.error("Error updating user:", error);
//    }
//  };
//
//  return (
//    <div className="grid grid-cols-6 h-full min-h-screen ">
//      <ManageAllSideMenu />
//      <div className="grid grid-cols-6 bg-gray-100 h-full col-span-5 overflow-auto bg-red-300">
//        <div className=" col-span-5 w-full max-w-screen-lg mt-5 p-4  w-full ">
//          <h1 className="text-xl mb-4">Account Information</h1>
//          <div className="flex flex-col border mb-5  p-3 items-center justify-start">
//            {isEditing ? (
//              <div className="w-full max-w-md mt-4">
//                <form className="space-y-4" onSubmit={handleUpdateFormSubmit}>
//                  <div className="space-y-2">
//                    <label
//                      htmlFor="firstName"
//                      className="block text-sm font-sm text-gray-700"
//                    >
//                      First Name
//                    </label>
//                    <input
//                      id="firstName"
//                      type="text"
//                      value={formData.firstName}
//                      onChange={(e) =>
//                        setFormData({ ...formData, firstName: e.target.value })
//                      }
//                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//                      placeholder="Enter your first name"
//                    />
//                  </div>
//                  <div className="space-y-2">
//                    <label
//                      htmlFor="lastName"
//                      className="block text-sm font-sm text-gray-700"
//                    >
//                      Last Name
//                    </label>
//                    <input
//                      id="lastName"
//                      type="text"
//                      value={formData.lastName}
//                      onChange={(e) =>
//                        setFormData({ ...formData, lastName: e.target.value })
//                      }
//                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//                      placeholder="Enter your last name"
//                    />
//                  </div>
//                  <div className="flex gap-3 pt-2 py-5">
//                    <button
//                      type="submit"
//                      className="flex-1 border bg-blue-500 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                    >
//                      Save Changes
//                    </button>
//                    <button
//                      type="button"
//                      onClick={() => setIsEditing(false)}
//                      className="flex-1 border bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                    >
//                      Cancel
//                    </button>
//                  </div>
//                </form>
//              </div>
//            ) : (
//              <div className="flex flex-col ml-4 w-75 py-2">
//                <IoMdCreate
//                  className=" grid grid-cols-1 justify-start  items-end w-full ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
//                  onClick={() => setIsEditing(true)}
//                />
//                <div className="flex flex-col justify-between ">
//                  <div className="grid grid-cols-2">
//                    <div className="flex flex-col items-start px-0 py-0 my-0 pr-5">
//                      <p className="text-sm text-gray-500 pb-0 mb-0 ">
//                        First Name
//                      </p>
//                      <p>{user.first_name}</p>
//                    </div>
//                    <div className="flex flex-col items-start px-0 py-0 my-0">
//                      <p className="text-sm text-gray-500 pb-0 mb-0 ">
//                        Last Name
//                      </p>
//                      <p>{user.last_name}</p>
//                    </div>
//                    <div className="flex flex-col items-start px-0 py-0 my-0 pt-5">
//                      <p className="text-sm text-gray-500 pb-0 mb-0 ">Email</p>
//                      <p>{user.email}</p>
//                    </div>
//                  </div>
//                </div>
//              </div>
//            )}
//          </div>
//
//          <h1 className="text-xl mb-4">Change Password</h1>
//          <div className="flex flex-col border items-center justify-start px-5   p-4 ">
//            <p className="text-sm text-red-200">{passwordChangeMessage}</p>
//            <form
//              className="grid grid-cols-1 gap-3"
//              onSubmit={handlePasswordChangeFormSubmit}
//            >
//              <input
//                type={showPassword ? "text" : "password"}
//                name="current_password"
//                className="border bg-gray-50 rounded-sm m-2"
//                onChange={(e) =>
//                  setPasswordFormData({
//                    ...passwordFormData,
//                    currentPass: e.target.value,
//                  })
//                }
//              />
//              <input
//                type={showPassword ? "text" : "password"}
//                name="new_password"
//                className="border bg-gray-50 rounded-sm m-2"
//                onChange={(e) =>
//                  setPasswordFormData({
//                    ...passwordFormData,
//                    newPass: e.target.value,
//                  })
//                }
//              />
//              <div className="flex gap-3">
//                <input
//                  type="checkbox"
//                  id="show-password"
//                  checked={showPassword}
//                  onChange={() => setShowPassword((prev) => !prev)}
//                  className="cursor-pointer"
//                />
//                <label
//                  htmlFor="show-password"
//                  className="text-sm cursor-pointer"
//                >
//                  Show Password
//                </label>
//              </div>
//              <button type="submit" className="border bg-blue-500 ">
//                {" "}
//                Finish{" "}
//              </button>
//            </form>
//          </div>
//
//          <div className="space-y-2 mb-8"></div>
//
//          <button
//            onClick={() => navigate("/logout")}
//            className="bg-red-300 mx-5 px-5 border text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors"
//          >
//            Logout
//          </button>
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default Account;
//
//

"use client";

import type React from "react";

import { useEffect, useState } from "react";
import axiosInstance from "@/axios/axiosInstance";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  User,
  KeyRound,
  Menu,
  Building2,
  Plus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import check_correct_password from "@/utils/auth/check_correct_password";
import { validatePassword } from "@/utils/auth/password_validate";
import { useNavigate } from "react-router-dom";
import change_password from "@/utils/auth/change_password";
import { useOrg } from "@/context/OrganizationContext";

// Sample organization data
let organizations = [
  { id: 1, name: "Personal Workspace" },
  { id: 2, name: "Acme Corp" },
  { id: 3, name: "Startup Project" },
];

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const accountNavItems: NavItem[] = [
  {
    title: "Profile",
    href: "#profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Password",
    href: "#password",
    icon: <KeyRound className="h-5 w-5" />,
  },
];

const orgNavItems: NavItem[] = [
  {
    title: "Organizations",
    href: "#organizations",
    icon: <Building2 className="h-5 w-5" />,
  },
];

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, setUser, fetchUserData } = useUser();
  const { createOrganization, userOrgs, setCurrentOrg } = useOrg();
  const [activeSection, setActiveSection] = useState("profile");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showNewOrgForm, setShowNewOrgForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  useEffect(() => {
    organizations = [];
    userOrgs.map((org) => {
      organizations.push({
        id: org.id,
        name: org.name,
      });
    });
  }, [userOrgs]);

  // User profile state
  const [profile, setProfile] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch("/myauth/user/", {
        first_name: profile.firstName,
        last_name: profile.lastName,
      });
      // Fetch updated user data to ensure we have all fields
      const accessToken = localStorage.getItem("access_token");
      const updatedUserData = await fetchUserData(accessToken);
      setUser(updatedUserData);

      console.log(updatedUserData);

      setPasswords((prev) => ({
        ...prev,
        firstName: user.first_name,
        lastName: user.lastName,
      }));
      //setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }

    // Here you would typically send the updated profile to your API
    toast("hi", {
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the password update to your API

    let response = validatePassword(passwords.newPassword);

    if (response) {
      //setPasswordChangeMessage(response);
      toast("hi", {
        title: "Error",
        description: response,
      });

      return;
    }
    response = await check_correct_password(
      user.email,
      passwords.currentPassword,
    );
    console.log(response);
    if (!response) {
      toast("hi", {
        title: "Error",
        description: "The value for your current password is wrong!",
      });
      return;
    }
    const accessToken = localStorage.getItem("access_token");
    response = await change_password(
      passwords.currentPassword,
      passwords.newPassword,
      accessToken,
    );

    if (!response) {
      setPasswords({ currentPassword: "", newPassword: "" });

      toast("hi", {
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });

      navigate("/logout");
    } else {
      setPasswords({ currentPassword: "", newPassword: "" });
      toast("hi", {
        title: "Error",
        description: "Unexpected response. Please try again.",
      });
    }
  };

  // Handle creating a new organization
  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName.trim()) {
      // Here you would typically send the new org to your API
      const response = createOrganization(newOrgName);
      toast("", {
        title: "Organization created",
        description: `${newOrgName} has been created successfully.`,
      });
      setNewOrgName("");
      setShowNewOrgForm(false);
    }
  };


  const handleOrgClick = ((org) => {
    setCurrentOrg(org)
    navigate('/organization-detail/')


  })

  const NavItem = ({
    item,
    isActive,
  }: {
    item: NavItem;
    isActive: boolean;
  }) => {
    return (
      <Link
        href={item.href}
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
        <div className="md:hidden flex items-center justify-between mb-4">
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
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0">
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
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {activeSection === "password" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  <CardTitle>Update Password</CardTitle>
                </div>
                <CardDescription>
                  Change your account password here.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordUpdate}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={
                      !passwords.currentPassword || !passwords.newPassword
                    }
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {activeSection === "organizations" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      <CardTitle>Your Organizations</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowNewOrgForm(!showNewOrgForm)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Organization
                    </Button>
                  </div>
                  <CardDescription>
                    Manage your organizations and teams.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showNewOrgForm && (
                    <form
                      onSubmit={handleCreateOrg}
                      className="mb-6 p-4 border rounded-lg"
                    >
                      <h3 className="text-sm font-medium mb-3">
                        Create New Organization
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="orgName">Organization Name</Label>
                          <Input
                            id="orgName"
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                            placeholder="Enter organization name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShowNewOrgForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={!newOrgName.trim()}>
                            Create
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2 ">
                    {organizations.map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                        onClick={() => handleOrgClick(org)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
                            {org.name.charAt(0)}
                          </div>
                          <span className="font-medium">{org.name}</span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
