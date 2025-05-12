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

      console.log("fetch", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
      }
      throw err;
    }
  };
  // Load user from token on first load
  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = localStorage.getItem("access_token");

      // 🚨 Stop fetching if there is no access token
      if (!accessToken) {
        console.log("no access token");
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        console.error("Error initializing user:", err);
        // If token is expired or invalid, clear everything and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    console.log("initializing user");
    initializeUser();
  }, [navigate]);

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
    setUser(null);
    navigate("/login");
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
