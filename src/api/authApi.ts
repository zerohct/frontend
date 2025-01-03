import { apiClient, handleApiError } from "./apiClientBase";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

interface TokenInfo {
  token: string;
  authenticated: boolean;
}

interface RegisterResponse {
  message: string;
  username: string;
  email: string | null;
}

export const authApi = {
  register: async (
    username: string,
    password: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  login: async (username: string, password: string): Promise<TokenInfo> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });
      const data = response.data;
      sessionStorage.setItem("authToken", JSON.stringify(data.token));
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      sessionStorage.clear();
      window.location.href = "/login";
    }
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.INTROSPECT);
      return response.data.valid;
    } catch {
      return false;
    }
  },
};
