import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../axios/axiosInstance";
import useUserStore from "@/context/userStore";
const AcceptInvitation = () => {
  const { token } = useParams();
  const user = useUserStore((state) => state.user);
  const [message, setMessage] = useState("Verifying invitation token...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    const acceptInvitation = async () => {
      try {
        const response = await axiosInstance.post(
          `/organizations/invitations/accept/${token}/`,
        );
        //console.log(response)

        if (response.status == "200") {
          setMessage("Invitation Accepted");
          //console.log("Account Verified")
          //setTimeout(() => navigate("/manage-all"), 3000);
        } else {
          console.log(response);
          setMessage("Invalid or expired invitation link.");
        }
      } catch (error) {
        console.log(error);
        setMessage("An error occurred. Please try again.");
      }
    };

    if (token) {
      acceptInvitation();
    }
  }, [token, navigate]);

  return (
    <div className="grid grid-cols-1 items-center justify-center">
      <p className="text-2xl">{message}</p>
    </div>
  );
};

export default AcceptInvitation;
