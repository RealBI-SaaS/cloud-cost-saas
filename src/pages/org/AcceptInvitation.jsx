import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

import axiosInstance from "../../config/axios/axiosInstance";
import useUserStore from "@/stores/userStore";

import useCompany from "@/stores/CompanyStore";

const AcceptInvitation = () => {
  // const initialize = useOrgStore((state) => state.initialize);
  const { token } = useParams();
  const user = useUserStore((state) => state.user);

  const [notification, setNotification] = useState({ type: "", text: "" });
  // const [hasAcceptedInvitation, setHasAcceptedInvitation] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  const initializeCompany = useCompany((state) => state.initializeCompany);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { redirectTo: location.pathname } });
    }
  }, [user, navigate, location]);

  const handleAcceptInvitation = async () => {
    if (!token) return;

    setNotification({ type: "info", text: "Processing..." });

    try {

      setHasSentRequest(true)
      const response = await axiosInstance.post(
        `/company/invitations/accept/${token}/`,
      );

      if (response.status === 200) {
        setNotification({ type: "success", text: "Invitation Accepted!" });
        // setHasAcceptedInvitation(true);
        initializeCompany();
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setNotification({
          type: "error",
          text: "Invalid or expired invitation link.",
        });
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setNotification({
        type: "error",
        text:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-lg">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Organization Invitation</h1>
          {notification.text && (
            <p
              className={`text-sm px-5 py-3 rounded-md ${
                notification.type === "success"
                  ? "text-green-600 bg-green-200"
                  : notification.type === "error"
                    ? "text-red-600 bg-red-200"
                    : "text-gray-600 bg-gray-200"
              }`}
            >
              {notification.text}
            </p>
          )}

          {(
            !hasSentRequest &&
            notification.type !== "error"
          ) && (
            <Button onClick={handleAcceptInvitation} variant="">
              Accept Invitation
            </Button>,
          )}

         
{hasSentRequest && (
  <p className="text-sm text-gray-500">
    You will be redirected shortly... or go to{" "}
    <Link
      to={notification.type === "error" ? "/logout" : "/"}
      className="text-primary text-md underline"
    >
      {notification.type === "error" ? "Login" : "Home"}
    </Link>
  </p>
)}

        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
