import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";

// Create User Context
const UserContext = createContext(null);

// Provider Component
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch user data from backend
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/myauth/user/");
      return response.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      throw err;
    }
  };
  // Load user from token on first load
  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = localStorage.getItem("access_token");

      // 🚨 Stop fetching if there is no access token
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        // If token is expired, try to refresh it
        //try {
        //  const newAccessToken = await refreshToken();
        //  const userData = await fetchUserData(newAccessToken);
        //  setUser(userData);
        //} catch (refreshErr) {
        //  // If refresh fails, clear everything and redirect to login
        //  localStorage.removeItem("access_token");
        //  localStorage.removeItem("refresh_token");
        //  setUser(null);
        //  window.location.href = "/login";
        //}
        //console.log("error in initializeUser: ", err);
        //setError(err.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        //window.location.href = "/login";
        //}
        //} catch (err) {
        //setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    initializeUser();
  }, []);

  // Save user data to local storage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      //since it calls unprotexted route, doesn't need axios intercepter and configured axios instnce
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/jwt/create/`,
        {
          email,
          password,
        },
      );

      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const userData = await fetchUserData(access);
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error.response?.data?.detail?.message || "Login failed");
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      //same as login, doesn't need axiosInstance
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/users/`,
        userData,
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Registratioin failed");
      console.log("error signing user up", err.data);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    //localStorage.removeItem("theme");
    setUser(null);
    navigate("/login");
    //window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        login,
        signup,
        logout,
        fetchUserData,
        //refreshToken
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use User Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
