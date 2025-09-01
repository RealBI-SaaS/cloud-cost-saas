import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Lock, X } from "lucide-react";
import { PasswordData } from "./types";

interface SecurityCardProps {
  userEmail: string;
  onPasswordUpdate: (passwords: PasswordData) => Promise<void>;
}

export function SecurityCard({
  userEmail,
  onPasswordUpdate,
}: SecurityCardProps) {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPasswordUpdate(passwords);
    setIsUpdatingPassword(false);
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const isPasswordFormValid =
    passwords.currentPassword &&
    passwords.newPassword &&
    passwords.confirmPassword;

  return (
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
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

            <div className="flex gap-3 justify-end">
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
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between flex-col sm:flex-row w-full">
            <div className="space-y-1 my-2">
              <Label className="text-sm font-medium">Password</Label>
              <p className="text-sm text-muted-foreground">
                Last changed: Recently
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsUpdatingPassword(true)}
              className="gap-2  w-full sm:w-fit"
            >
              <KeyRound className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
