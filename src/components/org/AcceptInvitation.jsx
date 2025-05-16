import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";

import axiosInstance from "../../axios/axiosInstance";
import useUserStore from "@/context/userStore";

const AcceptInvitation = () => {
  const { token } = useParams();
  const user = useUserStore((state) => state.user);
  const [message, setMessage] = useState("Verifying invitation token...");
  const [hasAcceptedInvitation, setHasAcceptedInvitation] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { redirectTo: location.pathname } });
      return;
    }

    if (!token || hasSentRequest) return;

    const acceptInvitation = async () => {
      try {
        const response = await axiosInstance.post(
          `/organizations/invitations/accept/${token}/`,
        );

        if (response.status === 200) {
          setMessage("Invitation Accepted");
          setHasAcceptedInvitation(true);
          // Redirect after short delay
          navigate("/home");
        } else {
          setMessage("Invalid or expired invitation link.");
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        setMessage("An error occurred. Please try again.");
      } finally {
        setHasSentRequest(true);
      }
    };

    acceptInvitation();
  }, [token, user, navigate, location, hasSentRequest]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-lg">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Organization Invitation</h1>
          <p
            className={`text-xl ${message.includes("Accepted")
              ? "text-green-600"
              : message.includes("error")
                ? "text-red-600"
                : "text-gray-600"
              }`}
          >
            {message}
          </p>
          {hasAcceptedInvitation && (
            <p className="text-sm text-gray-500">
              You will be redirected shortly...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
