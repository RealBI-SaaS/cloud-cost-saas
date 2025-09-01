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
import { User, KeyRound, Pencil, Save, X, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import axiosInstance from "@/config/axios/axiosInstance";
import check_correct_password from "@/utils/auth/check_correct_password";
import { validatePassword } from "@/utils/auth/password_validate";
import change_password from "@/utils/auth/change_password";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

      const accessToken = localStorage.getItem("access_token");
      const updatedUserData = await fetchUserData(accessToken);
      setUser(updatedUserData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    let response = validatePassword(passwords.newPassword);
    if (response) {
      toast.error(response);
      return;
    }

    const isCorrectPassword = await check_correct_password(
      user.email,
      passwords.currentPassword
    );

    if (!isCorrectPassword) {
      toast.error("The value for your current password is wrong!");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    const passwordChanged = await change_password(
      passwords.currentPassword,
      passwords.newPassword,
      accessToken
    );

    if (!passwordChanged) {
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
      setIsUpdatingPassword(false);
      navigate("/logout");
    } else {
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.error("Unexpected response. Please try again.");
    }
  };

  const isProfileChanged =
    profile.firstName !== user?.first_name ||
    profile.lastName !== user?.last_name;

  const isPasswordFormValid =
    passwords.currentPassword &&
    passwords.newPassword &&
    passwords.confirmPassword;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Profile Information Card */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription>
                Manage your personal details and account information
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  value={profile.email}
                  disabled
                  className="h-11 bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed
                </p>
              </div>

              <CardFooter className="px-0 pb-0 flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setProfile({
                      firstName: user?.first_name || "",
                      lastName: user?.last_name || "",
                      email: user?.email || "",
                    });
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isProfileChanged}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    First Name
                  </Label>
                  <p className="text-lg font-medium px-2 py-3 bg-muted/20 rounded-lg">
                    {profile.firstName}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Last Name
                  </Label>
                  <p className="text-lg font-medium px-2 py-3 bg-muted/20 rounded-lg">
                    {profile.lastName}
                  </p>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Email Address
                </Label>
                <p className="text-md px-2 py-3 bg-muted/20 rounded-lg">
                  {profile.email}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Update Card */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Lock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Security</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isUpdatingPassword ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="h-11"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="h-11"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="h-11"
                  placeholder="Confirm new password"
                />
              </div>

              <CardFooter className="px-0 pb-0 flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsUpdatingPassword(false);
                    setPasswords({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isPasswordFormValid}
                  className="gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Password</Label>
                <p className="text-sm text-muted-foreground">
                  Last changed: Recently
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsUpdatingPassword(true)}
                className="gap-2"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
