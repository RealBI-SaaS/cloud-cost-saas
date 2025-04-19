import { useState } from "react";
import { useLocation } from "react-router-dom";
import send_password_reset_email from "../../utils/auth/send_password_reset_email";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
//a page for the user to ak for password reset email, attched on login form
const AskForPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await send_password_reset_email(email);
      if (response) {
        setMessage("Unexpected response, please try again later");
        toast.error("Failed to send reset email");
      } else {
        setMessage("Reset email sent! Please check your inbox");
        toast.success("Reset email sent successfully");
      }
    } catch (error) {
      setMessage("An error occurred, please try again later");
      toast.error("Failed to send reset email");
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
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {message && (
            <p className={`text-sm ${message.includes("Unexpected") ? "text-destructive" : "text-primary"}`}>
              {message}
            </p>
          )}
          <Button 
            className="w-full" 
            onClick={handleFormSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskForPasswordReset;
