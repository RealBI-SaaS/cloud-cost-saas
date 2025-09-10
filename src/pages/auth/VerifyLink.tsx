import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import my_auth_service from "@/services/my_auth_service";
import useUserStore from "@/stores/userStore";
import { toast } from "sonner";

function VerifyLink() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { fetchUserData } = useUserStore();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (token) {
      my_auth_service
        .verifyMagicLink(token)
        .then((res) => {
          toast.success("You have successfully logged in!");
          const { access, refresh } = res.data;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);

          fetchUserData();
          setStatus("success");

          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate("/admin", { replace: true });
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        })
        .catch((error) => {
          console.error("Verification error:", error);
          toast.error("Invalid or expired link.");
          setStatus("error");
        });
    } else {
      setStatus("error");
      toast.error("No verification token found.");
    }
  }, [token, navigate, fetchUserData]);

  const handleManualRedirect = () => {
    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-foreground/5 p-4">
      <Card className="w-full max-w-md mx-auto border border-primary/40 shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Verifying Your Login
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {status === "verifying" &&
              "Please wait while we verify your magic link"}
            {status === "success" &&
              "Your login was successful! Redirecting you now..."}
            {status === "error" && "We couldn't verify your magic link"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          {status === "verifying" && (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Authenticating your session...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-primary" />
                <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse opacity-75"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium text-foreground">Login Successful!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting in {countdown} seconds...
                </p>
              </div>
              <Button onClick={handleManualRedirect} className="w-full">
                Go to Dashboard Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <div className="text-center space-y-2">
                <p className="font-medium text-foreground">
                  Verification Failed
                </p>
                <p className="text-sm text-muted-foreground">
                  This magic link is invalid or has expired. Please request a
                  new one.
                </p>
              </div>
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full"
              >
                Return to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyLink;
