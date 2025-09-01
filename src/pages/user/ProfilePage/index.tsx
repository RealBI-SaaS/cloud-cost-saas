import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import axiosInstance from "@/config/axios/axiosInstance";
import check_correct_password from "@/utils/auth/check_correct_password";
import { validatePassword } from "@/utils/auth/password_validate";
import change_password from "@/utils/auth/change_password";
import { ProfileCard } from "./profileCard";
import { SecurityCard } from "./securityCard";
import { UserProfile, PasswordData } from "./types";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  const handleProfileUpdate = async (profile: UserProfile) => {
    try {
      await axiosInstance.patch("/myauth/user/", {
        first_name: profile.firstName,
        last_name: profile.lastName,
      });

      const accessToken = localStorage.getItem("access_token");
      const updatedUserData = await fetchUserData(accessToken);
      setUser(updatedUserData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const handlePasswordUpdate = async (passwords: PasswordData) => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      throw new Error("Passwords do not match");
    }

    const validationError = validatePassword(passwords.newPassword);
    if (validationError) {
      toast.error(validationError);
      throw new Error(validationError);
    }

    const isCorrectPassword = await check_correct_password(
      user.email,
      passwords.currentPassword
    );

    if (!isCorrectPassword) {
      toast.error("The value for your current password is wrong!");
      throw new Error("Incorrect current password");
    }

    const accessToken = localStorage.getItem("access_token");
    const passwordChanged = await change_password(
      passwords.currentPassword,
      passwords.newPassword,
      accessToken
    );

    if (!passwordChanged) {
      toast.success("Password updated successfully");
      navigate("/logout");
    } else {
      toast.error("Unexpected response. Please try again.");
      throw new Error("Password update failed");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6  space-y-6">
      <ProfileCard user={user} onProfileUpdate={handleProfileUpdate} />

      <SecurityCard
        userEmail={user.email}
        onPasswordUpdate={handlePasswordUpdate}
      />
    </div>
  );
}
