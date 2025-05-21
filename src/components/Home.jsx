import React, { useEffect, useState } from "react";
//import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
// import { useUser } from "../context/UserContext";
import Landing from "./Landing";
import HomeAuthenticated from "./HomeAuthenticated";
import HomeNew from "./HomeNew";
import useUserStore from "@/context/userStore";
import { shallow } from "zustand/shallow";

const Home = () => {
  //const { user, loading, setLoading, setUser, fetchUserData } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  // Use separate selectors for each value to prevent unnecessary re-renders
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const setLoading = useUserStore((state) => state.setLoading);
  const setUser = useUserStore((state) => state.setUser);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  useEffect(() => {
    const handleTokenParams = async () => {
      const accessToken = searchParams.get("access");
      const refreshToken = searchParams.get("refresh");

      if (accessToken && refreshToken) {
        setLoading(true);
        setIsFetchingUser(true);
        try {
          // Store tokens in localStorage
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);

          // Fetch user data using the access token
          try {
            const userData = await fetchUserData();
            console.log("User data fetched successfully:", userData);
            if (userData?.is_staff) {
              navigate("/admin/signin", { replace: true });
            }
            //setUser(userData);
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Clear tokens if user data fetch fails
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setUser(null);
          }
        } catch (error) {
          console.error("Error handling token parameters:", error);
        } finally {
          setLoading(false);
          setIsFetchingUser(false);
        }
      }
    };
    console.log("searchParams", searchParams);
    handleTokenParams();
  }, [searchParams]); // Remove other dependencies as they are stable references

  useEffect(() => {
    //console.log("loading", loading);
    if (loading || isFetchingUser) {
      return;
    }

    if (!user) {
      navigate("/landing");
      return;
    }

    navigate("/dashboard/");
  }, [user, loading, isFetchingUser, navigate]);

  return null; // Since we're using navigation, we don't need to render anything
};

export default Home;
