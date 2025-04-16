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
import { User } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function AccountInfo() {
  const { user, setUser, fetchUserData } = useUser();

  // User profile state
  const [profile, setProfile] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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

  return (
    <Card className="m-10 p-5 w-2/3 shadow-none border-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Personal Information</CardTitle>
        </div>
        <CardDescription>
          Update your personal details here.
        </CardDescription>
      </CardHeader>
      <hr />
      <form onSubmit={handleProfileUpdate}>
        <CardContent className="space-y-4 ">
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
          <div className="space-y-2 mt-5">
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
        <CardFooter className="mt-10">
          <Button type="submit" className="!text-white hover:!bg-gray-800">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 