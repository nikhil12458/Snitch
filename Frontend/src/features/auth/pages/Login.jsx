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
      const user = await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      if (user.role == "buyer") {
        navigate("/");
      } else if (user.role == "seller") {
        navigate("/seller/dashboard");
      }
    } catch (error) {
      console.log("Login failed: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] flex flex-col lg:flex-row text-[#2C2C2A] font-sans selection:bg-[#2C2C2A] selection:text-[#F9F9F6]">
      {/* Top/Left Side: Branding / Abstract Art */}
      <div
        className="w-full lg:w-1/2 relative overflow-hidden bg-[#F0EFEA] flex flex-col items-center justify-center p-8 sm:p-12 lg:p-12 min-h-[35vh] lg:min-h-screen lg:border-r border-[#E0DFD8] bg-cover bg-center"
        style={{ backgroundImage: "url('/login_bg_light.png')" }}
      >
        <div className="absolute inset-0 bg-[#F9F9F6]/40 backdrop-blur-[2px] pointer-events-none z-0"></div>

        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#C5C2B7]/30 blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#E0DFD8]/40 blur-[100px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="h-12 lg:h-16 mb-8 lg:mb-12 flex items-center justify-center drop-shadow-sm overflow-hidden">
            <img
              src="/snitch_logo_light.png"
              alt="Snitch Logo"
              className="h-full object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-4 lg:mb-6 tracking-tight text-[#2C2C2A]">
            Elevate your
            <br />
            <span className="font-medium italic">aesthetic</span>.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#8A8678] leading-relaxed max-w-md">
            Sign in to access your curated collections, continue your journey, and explore premium apparel tailored just for you.
          </p>
        </div>
      </div>

      {/* Bottom/Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-20 relative bg-[#F9F9F6]">
        {/* Subtle mobile background glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-[#C5C2B7]/20 blur-[120px]"></div>
        </div>

        <div className="w-full max-w-md bg-[#FFFFFF]/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-[24px] lg:rounded-none p-8 sm:p-10 lg:p-0 shadow-xl lg:shadow-none shadow-black/5 border lg:border-none border-[#E0DFD8] relative z-10">
          <div className="mb-10 lg:mb-12 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-medium mb-2 lg:mb-3 tracking-tight text-[#2C2C2A]">
              Welcome Back
            </h2>
            <p className="text-[#8A8678] text-xs sm:text-sm">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            <div className="space-y-5 lg:space-y-6">
              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-medium tracking-widest text-[#8A8678] uppercase"
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
                  className="w-full bg-[#FFFFFF] border border-[#E0DFD8] text-[#2C2C2A] px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5C2B7] focus:border-[#C5C2B7] transition-all placeholder:text-[#C5C2B7] shadow-sm"
                  placeholder="hello@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="text-xs font-medium tracking-widest text-[#8A8678] uppercase"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-[#8A8678] hover:text-[#2C2C2A] transition-colors"
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
                  className="w-full bg-[#FFFFFF] border border-[#E0DFD8] text-[#2C2C2A] px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5C2B7] focus:border-[#C5C2B7] transition-all placeholder:text-[#C5C2B7] shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-4 lg:pt-6">
              <button
                type="submit"
                className="w-full bg-[#2C2C2A] hover:bg-[#1A1A1A] text-[#F9F9F6] font-medium tracking-widest uppercase py-3.5 lg:py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-3 py-6">
                <div className="h-px bg-[#E0DFD8] flex-1"></div>
                <span className="text-xs font-medium text-[#8A8678] uppercase tracking-wider">
                  or
                </span>
                <div className="h-px bg-[#E0DFD8] flex-1"></div>
              </div>

              {/* Google Button */}
              <div className="[&>button]:!bg-[#FFFFFF] [&>button]:!text-[#2C2C2A] [&>button]:!border-[#E0DFD8] [&>button:hover]:!bg-[#F0EFEA] [&>button]:shadow-sm">
                <ContinueWithGoogle />
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#8A8678]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#2C2C2A] hover:text-[#8A8678] font-medium transition-colors underline decoration-[#E0DFD8] underline-offset-4"
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
