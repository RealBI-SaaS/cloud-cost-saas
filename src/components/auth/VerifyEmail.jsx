import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

//user redirected form email after signup
const VerifyEmail = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/users/activation/`,
          { uid, token },
          { headers: { "Content-Type": "application/json" } },
        );

        if (response.status === 204) {
          setMessage("Email verified successfully!");
          toast.success("Email verified successfully!");
          //setTimeout(() => navigate("/login"), 3000);
          navigate("/company/create");
        } else {
          setMessage("Invalid or expired activation link.");
          toast.error("Invalid or expired activation link.");

          navigate("/company/create");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
        toast.error("Failed to verify email. Please try again.");

        navigate("/company/create");
      } finally {
        setIsLoading(false);
      }
    };

    if (uid && token) {
      verifyEmail();
    }
  }, [uid, token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {isLoading
              ? "Please wait while we verify your email..."
              : "Verification complete"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <div className="relative animate-bounce rounded-full h-12 w-12 bg-primary"></div>
              </div>
            ) : null}
            <p
              className={`text-center text-sm ${message.includes("successfully") ? "text-primary" : "text-destructive"}`}
            >
              {message}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
