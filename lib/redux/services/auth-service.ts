import axios from "axios";

// API base URL
const API_URL = "http://localhost:8000";

// Create an Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get the stored access token
function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

// Auth service methods
export const authService = {
  // Register a new user
  async register(userData: any) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Logout user
  async logout(refreshToken: string) {
    const accessToken = getAccessToken();
    const response = await api.post(
      "/auth/logout",
      { refresh: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  },

  // Refresh access token
  async refreshToken(refreshToken: string) {
    const response = await api.post("/auth/refresh", { refresh: refreshToken });
    return response.data;
  },

  // Get current user data
  async getCurrentUser() {
    const token = getAccessToken();
    if (!token) throw new Error("No access token");

    const response = await api.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
