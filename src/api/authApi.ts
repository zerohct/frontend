import { API_BASE_URL } from "constants/apiEndpoints";

// Interface for token structure
interface TokenInfo {
  access_token: string;
  refresh_token: string;
  token_chat?: string;
}

// Interface for user information
interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
  class_name: string;
  is_verify_email: boolean;
  is_teacher: boolean;
  is_admin: boolean;
}

// Login API function
export const loginApi = async (username: string, password: string) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error("Đăng nhập thất bại.");
    }

    const data = await response.json();

    // Store user info and tokens
    sessionStorage.setItem("userInfo", JSON.stringify(data.data.user_info));
    sessionStorage.setItem("authToken", JSON.stringify(data.data.token));

    // Set up default headers for future requests
    setAuthHeaders(data.data.token);

    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

// Set authentication headers for future requests
export const setAuthHeaders = (tokenData: TokenInfo) => {
  sessionStorage.setItem(
    "defaultHeaders",
    JSON.stringify({
      Authorization: `Bearer ${tokenData.access_token}`,
      "Chat-Token": tokenData.token_chat || "",
    })
  );
};

// Authenticated fetch wrapper
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  // Retrieve stored headers
  const headersJson = sessionStorage.getItem("defaultHeaders");
  const defaultHeaders = headersJson ? JSON.parse(headersJson) : {};

  // Merge default headers with any provided headers
  const mergedHeaders = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });

    // Handle unauthorized errors (token expiration)
    if (response.status === 401) {
      // Implement token refresh logic here if needed
      logoutApi();
      throw new Error("Phiên đăng nhập hết hạn");
    }

    return response;
  } catch (error) {
    console.error("Authenticated Fetch Error:", error);
    throw error;
  }
};

// Get user information
export const getUserInfo = (): UserInfo | null => {
  const userInfo = sessionStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

// Check authentication status
export const isAuthenticated = () => {
  return !!sessionStorage.getItem("authToken");
};

// Logout function
export const logoutApi = () => {
  sessionStorage.clear();
  window.location.href = "/login";
};

// Example of using authenticated fetch
export const fetchProtectedResource = async () => {
  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/protected-endpoint`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching protected resource:", error);
    throw error;
  }
};
