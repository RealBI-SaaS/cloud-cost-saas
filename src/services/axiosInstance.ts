import axios, { CanceledError } from "axios";

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

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // ✅ If the response is OK, return it
  async (error) => {
    const originalRequest = error.config;

    // 🔐 Handle 401 → refresh token flow
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.warn("No refresh token available, logging out...");
        window.location.href = "/logout";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = data.access;
        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // ⚠️ Handle other errors → extract readable message
    if (error.response) {
      const serverError = error.response.data;

      let errorMessage =
        serverError?.message ||
        serverError?.detail ||
        "";

      // If validation errors: { field: ["msg"] }
      if (!errorMessage && typeof serverError === "object") {
        errorMessage = Object.entries(serverError)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              // return `${field}: ${messages.join(", ")}`;
              return messages;
            }
            return `${field}: ${messages}`;
          })
          .join(" | ");
      }

      if (!errorMessage) {
        errorMessage = error.message || "Something went wrong";
      }

      return Promise.reject({
        status: error.response.status,
        message: errorMessage,
        data: serverError,
      });
    }

    // Fallback for network/unknown errors
    // return Promise.reject({
    //   status: error.status || 500,
    //   message: error.message || "Something went wrong",
    // });
      return Promise.reject(error);

  }
);

export { CanceledError };
export default axiosInstance;
