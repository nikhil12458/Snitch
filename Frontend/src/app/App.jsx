import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect, useState } from "react";

function App() {
  const { handleGetMe } = useAuth();
  const loading = useSelector((state) => state.auth.loading);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state only once when app mounts
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        await handleGetMe();
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    };
    
    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading state while checking authentication (only on first load)
  if (!initialized) {
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
