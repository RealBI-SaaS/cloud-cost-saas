import resend_verification_email from "../../utils/auth/resend_verification_email";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MailCheck, RefreshCw } from "lucide-react";

//a page for the user to ask for a new email verification email
const AskEmailVerificatioin = () => {
  const { state } = useLocation();
  const user_email = state.user_email || null;

  if (!user_email) {
    return <h1> No email </h1>;
  }
  console.log(user_email);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 ">
      <MailCheck className="h-12 w-12 text-green-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Check your inbox</h1>
      <p className="text-muted-foreground mb-6 max-w-md text-start">
        We’ve sent a verification link to <strong>{user_email}</strong>. Click
        the link in the email to verify your account.
      </p>

      <Button
        variant="outline"
        onClick={() => resend_verification_email(user_email)}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Resend Email
      </Button>
    </div>
  );
};

export default AskEmailVerificatioin;
