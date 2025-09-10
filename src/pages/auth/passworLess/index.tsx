import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import my_auth_service from "@/services/my_auth_service";
import { Mail, Link, KeyRound, RefreshCw } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import OtpVerification from "./OtpVerification";

const PasswordLessRequest = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [requestType, setRequestType] = useState({
    email: "",
    via: "magic_link",
  });
  const navigate = useNavigate();

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePwdRequest = (e) => {
    e.preventDefault();
    if (!requestType.email || !requestType.via) {
      toast.error("Please provide both email and access method");
      return;
    }

    setIsLoading(true);

    const authPromise =
      requestType.via === "magic_link"
        ? my_auth_service.requestMagicLink(requestType.email)
        : my_auth_service.requestOtp(requestType.email);

    authPromise
      .then((res) => {
        toast.info(
          "If an account exists, a message has been sent to your email"
        );
        setEmailSent(true);
        setCountdown(30); // 30 second countdown for resend
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResend = () => {
    if (countdown > 0) return;

    setIsLoading(true);
    const authPromise =
      requestType.via === "magic_link"
        ? my_auth_service.requestMagicLink(requestType.email)
        : my_auth_service.requestOtp(requestType.email);

    authPromise
      .then((res) => {
        toast.success("New code sent successfully");
        setCountdown(30);
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto p-6 bg-foreground/5 rounded-xl border border-primary/40 shadow-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <KeyRound className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Passwordless Login
            </h2>
            <p className="text-muted-foreground text-sm">
              Access your account without a password
            </p>
          </div>

          <div className="text-foreground">
            {emailSent ? (
              <div className="space-y-4 py-2">
                <div className="text-center bg-secondary/5 p-4 rounded-lg">
                  <p className="">
                    We've sent a{" "}
                    {requestType.via === "magic_link"
                      ? "magic link"
                      : "verification code"}{" "}
                    to:
                  </p>
                  <p className="font-medium text-foreground mt-1">
                    {requestType.email}
                  </p>
                </div>

                {requestType.via === "magic_link" ? (
                  <p className="text-sm text-muted-foreground text-center">
                    Please check your inbox and follow the instructions to
                    access your account.
                  </p>
                ) : (
                  <OtpVerification
                    email={requestType.email}
                    onResend={handleResend}
                    countdown={countdown}
                    isLoading={isLoading}
                  />
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleResend}
                    disabled={countdown > 0 || isLoading}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    Resend {countdown > 0 ? `(${countdown}s)` : ""}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePwdRequest} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="your.email@example.com"
                      type="email"
                      required
                      value={requestType.email}
                      onChange={(e) =>
                        setRequestType({
                          ...requestType,
                          email: e.target.value,
                        })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Access Method</Label>
                  <RadioGroup
                    value={requestType.via}
                    onValueChange={(value) =>
                      setRequestType({ ...requestType, via: value })
                    }
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="magic_link"
                        id="magic_link"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="magic_link"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-input bg-background p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Link className="h-5 w-5 mb-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Magic Link</span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem
                        value="otp"
                        id="otp"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="otp"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-input bg-background p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <KeyRound className="h-5 w-5 mb-2 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          One-Time Code
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      `Send ${
                        requestType.via === "magic_link"
                          ? "Magic Link"
                          : "Verification Code"
                      }`
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="text-center pt-4 space-y-2">
            <Separator />
            <RouterLink
              to="/login"
              className="text-center text-sm text-primary hover:underline"
            >
              Login with password instead
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordLessRequest;
