"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/axios/axiosInstance";
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
import { toast } from "sonner";
import { User, KeyRound } from "lucide-react";
import { useUser } from "@/context/UserContext";
import check_correct_password from "@/utils/auth/check_correct_password";
import { validatePassword } from "@/utils/auth/password_validate";
import { useNavigate } from "react-router-dom";
import change_password from "@/utils/auth/change_password";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export const accountNavItems: NavItem[] = [
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

export default function AccountSettings({ section = "profile" }: { section?: string }) {
  const navigate = useNavigate();
  const { user, setUser, fetchUserData } = useUser();
  const [activeSection, setActiveSection] = useState(section);

  useEffect(() => {
    setActiveSection(section);
  }, [section]);

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

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let response = validatePassword(passwords.newPassword);

    if (response) {
      toast.error(response);
      return;
    }

    const isCorrectPassword = await check_correct_password(
      user.email,
      passwords.currentPassword,
    );

    if (!isCorrectPassword) {
      toast.error("The value for your current password is wrong!");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    const passwordChanged = await change_password(
      passwords.currentPassword,
      passwords.newPassword,
      accessToken,
    );

    if (!passwordChanged) {
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully");
      navigate("/logout");
    } else {
      setPasswords({ currentPassword: "", newPassword: "" });
      toast.error("Unexpected response. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {activeSection === "profile" && (
        <Card className="m-10 p-5">
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
                  disabled
                />
              </div>
            </CardContent>
            <CardFooter className="mt-5">
              <Button type="submit" className="text-white">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {activeSection === "password" && (
        <Card className="m-10 p-5">
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
                  className="w-80"
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
                  className="w-80"

                />
              </div>
            </CardContent>
            <CardFooter className="mt-5">
              <Button
                type="submit"
                variant="destructive"
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
    </div>
  );
} 