import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import { setLoading } from "../features/auth/state/auth.slice";

function App() {
  const { handleGetMe } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state by fetching user from token on app load
    const initializeAuth = async () => {
      await handleGetMe();
    };
    
    initializeAuth();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E0DFD8] border-t-[#2C2C2A] rounded-full animate-spin"></div>
          <p className="text-[#8A8678]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
