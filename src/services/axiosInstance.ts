import axios, { CanceledError  } from "axios";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to attach the access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to refresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is OK, return it as is
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.warn("No refresh token available, logging out...");
        //localStorage.removeItem("access_token");
        //localStorage.removeItem("refresh_token");
        window.location.href = "/logout";

        return Promise.reject(error);
      }
      originalRequest._retry = true; // Prevent infinite loops

      try {
        // Request a new access token
        const { data } = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Update the header and retry the failed request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        //window.location.href = "/login"; // Redirect to login if refresh fails
      }
    }

    return Promise.reject(error);
  }
);

export { CanceledError };
export default axiosInstance;
