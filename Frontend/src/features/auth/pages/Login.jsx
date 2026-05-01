import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (error) {
      console.log("Login failed: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col lg:flex-row text-[#E5E2E1] font-sans selection:bg-[#FFD700] selection:text-[#131313]">
      {/* Top/Left Side: Branding / Abstract Art */}
      <div
        className="w-full lg:w-1/2 relative overflow-hidden bg-[#131313] flex flex-col items-center justify-center p-8 sm:p-12 lg:p-12 min-h-[35vh] lg:min-h-screen lg:border-r border-[#2A2A2A] bg-cover bg-center"
        style={{ backgroundImage: "url('/login_bg.png')" }}
      >
        <div className="absolute inset-0 bg-[#0E0E0E]/60 backdrop-blur-[2px] pointer-events-none z-0"></div>

        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#FFD700]/10 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#E9C400]/10 blur-[100px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl mb-6 lg:mb-12 flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.25)] overflow-hidden border border-[#FFD700]/30 bg-[#131313]">
            <img
              src="/snitch_logo.png"
              alt="Snitch Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-4 lg:mb-6 tracking-tight text-white drop-shadow-md">
            Welcome back to{" "}
            <span className="text-[#FFD700] font-medium">Snitch</span>.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#D0C6AB] leading-relaxed max-w-md drop-shadow-md">
            Sign in to access your curated collections, continue your fashion
            journey, and explore premium apparel tailored just for you.
          </p>
        </div>
      </div>

      {/* Bottom/Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-20 relative">
        {/* Subtle mobile background glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-[#FFD700]/5 blur-[120px]"></div>
        </div>

        <div className="w-full max-w-md bg-[#131313]/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-[24px] lg:rounded-none p-8 sm:p-10 lg:p-0 shadow-2xl lg:shadow-none shadow-black/50 border lg:border-none border-[#2A2A2A] relative z-10">
          <div className="mb-10 lg:mb-12 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-medium mb-2 lg:mb-3 tracking-tight text-white">
              Sign In
            </h2>
            <p className="text-[#D0C6AB] text-xs sm:text-sm">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            <div className="space-y-5 lg:space-y-6">
              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-semibold tracking-wider text-[#D0C6AB] uppercase"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#2A2A2A] text-white px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FFE16D] transition-all placeholder:text-[#4D4732]"
                  placeholder="hello@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="text-xs font-semibold tracking-wider text-[#D0C6AB] uppercase"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-[#FFD700] hover:text-[#E9C400] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#2A2A2A] text-white px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FFE16D] transition-all placeholder:text-[#4D4732]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-4 lg:pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#E9C400] hover:from-[#E9C400] hover:to-[#DBC677] text-[#3A3000] font-bold py-3.5 lg:py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] transform hover:-translate-y-0.5"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-3 py-3">
                <div className="h-px bg-[#2A2A2A] flex-1"></div>
                <span className="text-xs font-medium text-[#4D4732] uppercase tracking-wider">
                  or
                </span>
                <div className="h-px bg-[#2A2A2A] flex-1"></div>
              </div>

              {/* Google Button */}
              <ContinueWithGoogle />
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#D0C6AB]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#FFD700] hover:text-[#E9C400] font-medium transition-colors underline decoration-[#FFD700]/30 underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
