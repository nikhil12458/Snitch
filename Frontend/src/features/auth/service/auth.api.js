import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";

const authApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
  timeout: 10000,
});

// Add response interceptor for better error handling
authApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Auth API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
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
