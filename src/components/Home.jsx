import React, { useEffect } from "react";
//import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Landing from "./Landing";
import HomeAuthenticated from "./HomeAuthenticated";
import HomeNew from "./HomeNew";

const Home = () => {
  const { user, loading, setUser, fetchUserData } = useUser();
  //const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleTokenParams = async () => {
      const accessToken = searchParams.get("access");
      const refreshToken = searchParams.get("refresh");

      if (accessToken && refreshToken) {
        try {
          // Store tokens in localStorage
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          // Fetch user data using the access token
          //const response = await fetch(
          //  `${import.meta.env.VITE_BASE_URL}/auth/user/`,
          //  {
          //    headers: {
          //      Authorization: `Bearer ${accessToken}`,
          //    },
          //  },
          //);
          //
          const response = await fetchUserData();

          if (response.ok) {
            const userData = await response.json();
            // Update user context directly
            setUser(userData);
          }
        } catch (error) {
          console.error("Error handling token parameters:", error);
        }
      }
    };
    //console.log("searchParams");
    console.log(searchParams);
    handleTokenParams();
  }, [searchParams, setUser]);

  if (loading) {
     return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <div className="relative animate-bounce rounded-full h-12 w-12 bg-primary"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );;
  }

  if (!user) {
    return <Landing />;
  } else {
    return <HomeAuthenticated />;
  }
};

export default Home;
