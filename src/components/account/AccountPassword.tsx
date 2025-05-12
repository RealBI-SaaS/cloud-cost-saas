"use client";

import { useState } from "react";
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
import { KeyRound } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import check_correct_password from "@/utils/auth/check_correct_password";
import { validatePassword } from "@/utils/auth/password_validate";
import change_password from "@/utils/auth/change_password";
import useUserStore from "@/context/userStore";

export default function AccountPassword() {
  const navigate = useNavigate();
  // const { user } = useUser();
  const user = useUserStore((state)=>state.user)

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
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
    <Card className="m-10 p-5 w-2/3 shadow-none border-none">
      <CardHeader>
        <div className="flex items-center gap-3 ">
          <KeyRound className="h-5 w-5" />
          <CardTitle className="">Update Password</CardTitle>
        </div>
        <CardDescription>Change your account password here.</CardDescription>
      </CardHeader>
      <hr />
      <form onSubmit={handlePasswordUpdate}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm text-muted-foreground"
            >
              Current Password
            </Label>
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
            <Label
              htmlFor="newPassword"
              className="text-sm text-muted-foreground"
            >
              New Password
            </Label>
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
            variant="default"
            disabled={!passwords.currentPassword || !passwords.newPassword}
          >
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
