import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import axiosInstance from "@/config/axios/axiosInstance";
// import useOrgStore from "./OrgStore";
import { useThemeStore } from "./ThemeStore";
const userStore = (set, get) => ({
  //const reset = useOrgStore((state) => state.reset)
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchUserData: async () => {
    try {
      const response = await axiosInstance.get("/myauth/user/");
      set({ user: response.data });
      return response.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/jwt/create/`,
        { email, password },
      );
      const { access, refresh } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const userData = await get().fetchUserData();
      set({ user: userData, error: null });
      return userData;
    } catch (error) {
      set({
        error:
          error.response?.data?.detail?.message ||
          error.response?.data?.detail ||
          "Login failed",
      });
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/users/`,
        userData,
      );
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.detail || "Registration failed",
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    //localStorage.removeItem("user-store");
    //localStorage.removeItem("org-store");
    //reset()
    // useOrgStore.getState().reset();
    // useThemeStore.getState().reset();
    set({ user: null });
  },

  initializeUser: async () => {
    set({ loading: true });
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      set({ loading: false });
      return;
    }
    try {
      const userData = await get().fetchUserData();
      set({ user: userData });
    } catch (err) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
});

const useUserStore = create(
  persist(userStore, {
    name: "user-store", // for persistence
    partialize: (state) => ({ user: state.user }), // only persist user
  }),
);
export default useUserStore;
