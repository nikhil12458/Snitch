import { setError, setLoading, setUser, clearAuth } from "../state/auth.slice";
import { getMe, login, register, logout } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    password,
    contact,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      const data = await register({
        email,
        password,
        contact,
        fullname,
        isSeller,
      });

      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });

      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      console.log("Get me error:", error?.message);
      // This is expected if no token exists, not a critical error
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(clearAuth());
    } catch (error) {
      console.log("Logout error:", error);
      // Clear auth state even if logout API fails
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogout };
};
