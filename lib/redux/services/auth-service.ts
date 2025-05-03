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

// Get the refresh token
function getRefreshToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
}

// Set new access token
function setAccessToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

// Auth service methods
export const authService = {
  async register(userData: any) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async logout(refreshToken: string) {
    const response = await api.post("/auth/logout", { refresh: refreshToken });
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refresh: refreshToken,
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/auth/user");
    return response.data;
  },
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();
        const { access } = await authService.refreshToken(refresh!);

        // Save the new token
        setAccessToken(access);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally clear storage or redirect to login
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
