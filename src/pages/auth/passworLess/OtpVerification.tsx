import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import my_auth_service from "@/services/my_auth_service";
import { RefreshCw, Mail, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useUserStore from "@/stores/userStore";

interface OtpVerificationProps {
  email: string;
  onResend: () => void;
  countdown: number;
  isLoading: boolean;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onResend,
  countdown,
  isLoading,
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const navigate = useNavigate();
  const { fetchUserData } = useUserStore();

  const handleOtpVerification = (value: string) => {
    setOtp(value);
    setVerificationStatus("idle"); // Reset status when user types

    // Auto-submit when OTP is complete
    if (value.length === 6) {
      setIsVerifying(true);
      setVerificationStatus("idle");

      my_auth_service
        .verifyOtp(value, email)
        .then((res) => {
          toast.success("Verification successful!");
          const { access, refresh } = res.data;

          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);
          setVerificationStatus("success");

          fetchUserData();

          // Small delay to show success state before redirecting
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        })
        .catch((e) => {
          const errorMessage =
            e.response?.data?.message ||
            e.message ||
            "Invalid verification code";
          toast.error(errorMessage);
          setVerificationStatus("error");
          setOtp(""); // Clear OTP on error
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  };

  const getSlotClassName = (index: number) => {
    if (verificationStatus === "success")
      return "bg-green-100 border-green-300";
    if (verificationStatus === "error") return "bg-red-100 border-red-300";
    if (otp.length > index) return "bg-primary/10 border-primary/30";
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative pb-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpVerification}
            disabled={isVerifying || verificationStatus === "success"}
            className="relative"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className={getSlotClassName(0)} />
              <InputOTPSlot index={1} className={getSlotClassName(1)} />
              <InputOTPSlot index={2} className={getSlotClassName(2)} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className={getSlotClassName(3)} />
              <InputOTPSlot index={4} className={getSlotClassName(4)} />
              <InputOTPSlot index={5} className={getSlotClassName(5)} />
            </InputOTPGroup>
          </InputOTP>

          {verificationStatus === "success" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500 animate-in fade-in" />
            </div>
          )}
        </div>

        {(isVerifying || verificationStatus === "success") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isVerifying && (
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            )}
            {verificationStatus === "success" && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <span>
              {isVerifying && "Verifying..."}
              {verificationStatus === "success" && "Success! Redirecting..."}
            </span>
          </div>
        )}

        {verificationStatus === "error" && (
          <p className="text-sm text-destructive text-center animate-in fade-in">
            Invalid code. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
