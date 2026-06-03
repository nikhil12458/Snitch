// API Configuration - handles both local and production environments
const isDevelopment = import.meta.env.MODE === "development";

// For development: use proxy (localhost:5173 proxies to localhost:3000)
// For production: use full URL to Railway backend
const getApiBaseUrl = () => {
  if (isDevelopment) {
    return "/api";
  }
  return "https://snitch-production.up.railway.app/api";
};

export const API_BASE_URL = getApiBaseUrl();
