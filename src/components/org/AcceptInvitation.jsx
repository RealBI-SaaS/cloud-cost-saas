import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../ui/button";

import axiosInstance from "../../axios/axiosInstance";
import useUserStore from "@/context/userStore";
import useOrgStore, { useOrgInitializer } from "@/context/OrgStore";

const AcceptInvitation = () => {
  const initialize = useOrgStore((state) => state.initialize);
  const { token } = useParams();
  const user = useUserStore((state) => state.user);
  const [message, setMessage] = useState(
    "Click the button to accept the invitation.",
  );
  const [hasAcceptedInvitation, setHasAcceptedInvitation] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { redirectTo: location.pathname } });
    }
  }, [user, navigate, location]);

  const handleAcceptInvitation = async () => {
    if (!token || hasSentRequest) return;

    setHasSentRequest(true);
    setMessage("Processing...");

    try {
      const response = await axiosInstance.post(
        `/organizations/invitations/accept/${token}/`,
      );

      if (response.status === 200) {
        setMessage("Invitation Accepted");
        setHasAcceptedInvitation(true);
        //useOrgInitializer()
        initialize();
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMessage("Invalid or expired invitation link.");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-lg">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Organization Invitation</h1>
          <p
            className={`text-xl ${
              message.includes("Accepted")
                ? "text-green-600"
                : message.includes("error") || message.includes("Invalid")
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
          >
            {message}
          </p>

          {!hasAcceptedInvitation && !hasSentRequest && (
            <Button onClick={handleAcceptInvitation} variant="">
              Accept Invitation
            </Button>
          )}

          {(hasAcceptedInvitation ||
            message.includes("error") ||
            message.includes("Invalid")) && (
            <p className="text-sm text-gray-500">
              You will be redirected shortly... or go to{" "}
              <Link to="/" className="text-primary text-lg underline">
                Home
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
