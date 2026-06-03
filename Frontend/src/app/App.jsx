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
        console.log("🔄 [App] Starting auth initialization...");
        console.log("🔄 [App] Current URL:", window.location.href);
        
        // Check if we just came back from Google OAuth
        const params = new URLSearchParams(window.location.search);
        const googleAuthSuccess = params.get("google_auth");
        
        if (googleAuthSuccess === "success") {
          console.log("✅ [App] Google OAuth redirect detected, calling getMe...");
        }
        
        const user = await handleGetMe();
        console.log("✅ [App] Auth initialized, user:", user);
        
        if (!user) {
          console.log("⚠️ [App] No user found, user is not authenticated");
        }
      } catch (err) {
        console.error("❌ [App] Auth initialization error:", err);
      } finally {
        if (isMounted) {
          console.log("✅ [App] Setting initialized to true");
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
          <p className="text-[#8A8678]">Authenticating...</p>
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
