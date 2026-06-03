import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";

const authApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor to log outgoing requests
authApiInstance.interceptors.request.use(
  (config) => {
    console.log("📤 [Auth API] Request:", config.method?.toUpperCase(), config.url);
    console.log("📤 [Auth API] withCredentials:", config.withCredentials);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
authApiInstance.interceptors.response.use(
  (response) => {
    console.log("✅ [Auth API] Response received:", response.config.url, "Status:", response.status);
    console.log("✅ [Auth API] Response data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ [Auth API] Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    });
    return Promise.reject(error);
  }
);

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const response = await authApiInstance.post("/register", {
    email,
    contact,
    password,
    fullname,
    isSeller,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await authApiInstance.post("/login", {
    email,
    password,
  });
  return response.data;
}

export async function getMe() {
  const response = await authApiInstance.get("/me");
  return response.data;
}

export async function logout() {
  const response = await authApiInstance.post("/logout");
  return response.data;
}
