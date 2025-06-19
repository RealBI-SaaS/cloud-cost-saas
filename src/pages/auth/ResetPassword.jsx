import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

//a page the user can reset his/her password, redirected form reset email
const ResetPassword = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetSubmit = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/users/reset_password_confirm/`,
        { uid: uid, token: token, new_password: newPassword },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.status === 204) {
        setMessage("Password changed successfully!");
        toast.success("Password changed successfully!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("Invalid or expired activation link.");
        toast.error("Invalid or expired activation link.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <Label htmlFor="show-password" className="text-sm">
              Show Password
            </Label>
          </div>
          {message && (
            <p className={`text-sm ${message.includes("successfully") ? "text-primary" : "text-destructive"}`}>
              {message}
            </p>
          )}
          <Button 
            className="w-full" 
            onClick={handleResetSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
