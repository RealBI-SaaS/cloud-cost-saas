import React from "react";
import { useUser } from "../context/UserContext";
import useUserStore from "@/context/userStore";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  //const { logout } = useUser();
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  React.useEffect(() => {
    logout();
    navigate("/login");
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Logging out...</h2>
        <p className="text-gray-600">
          You will be redirected to the login page shortly.
        </p>
      </div>
    </div>
  );
};

export default Logout;
