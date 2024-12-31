import axios from "axios";
import { API_BASE_URL } from "constants/apiEndpoints";
import { logoutApi } from "./authApi";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // Use more robust token retrieval
    const authTokenString = sessionStorage.getItem("authToken");

    try {
      const authToken = authTokenString ? JSON.parse(authTokenString) : null;

      // Check if token exists and has not expired
      if (authToken && authToken.access_token) {
        config.headers.Authorization = `Bearer ${authToken.access_token}`;
      } else {
        // Force logout if no valid token
        logoutApi();
      }
    } catch (error) {
      console.error("Token parsing error:", error);
      logoutApi();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
