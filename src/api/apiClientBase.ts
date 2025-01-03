import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../constants/apiEndpoints";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây timeout
});

// Interceptor để thêm Authorization token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
    }
    return config;
  }
);

// Xử lý lỗi API
const handleApiError = (error: any): never => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "An unexpected error occurred";
  console.error("API Error:", {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
  });
  throw new Error(errorMessage);
};

export { apiClient, handleApiError };
