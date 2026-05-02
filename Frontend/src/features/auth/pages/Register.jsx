import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: formData.email,
      password: formData.password,
      contact: formData.contact,
      fullname: formData.fullName,
      isSeller: formData.isSeller,
    });
    navigate("/");
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
            Welcome to
            <br />
            <span className="font-medium italic">Snitch</span>.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#8A8678] leading-relaxed max-w-md">
            Your premium destination for modern clothing and apparel. Join our
            community to discover exclusive collections or start selling your
            own fashion line.
          </p>
        </div>
      </div>

      {/* Bottom/Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-20 relative bg-[#F9F9F6]">
        {/* Subtle mobile background glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-[#C5C2B7]/20 blur-[120px]"></div>
        </div>

        <div className="w-full max-w-md bg-[#FFFFFF]/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-[24px] lg:rounded-none p-8 sm:p-10 lg:p-0 shadow-xl lg:shadow-none shadow-black/5 border lg:border-none border-[#E0DFD8] relative z-10">
          <div className="mb-10 lg:mb-12 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-medium mb-2 lg:mb-3 tracking-tight text-[#2C2C2A]">
              Create Account
            </h2>
            <p className="text-[#8A8678] text-xs sm:text-sm">
              Join us to experience the curated digital journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            <div className="space-y-5 lg:space-y-6">
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-medium tracking-widest text-[#8A8678] uppercase"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#FFFFFF] border border-[#E0DFD8] text-[#2C2C2A] px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5C2B7] focus:border-[#C5C2B7] transition-all placeholder:text-[#C5C2B7] shadow-sm"
                  placeholder="John Doe"
                  required
                />
              </div>

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

              {/* Contact Number */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-medium tracking-widest text-[#8A8678] uppercase"
                  htmlFor="contact"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full bg-[#FFFFFF] border border-[#E0DFD8] text-[#2C2C2A] px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5C2B7] focus:border-[#C5C2B7] transition-all placeholder:text-[#C5C2B7] shadow-sm"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-medium tracking-widest text-[#8A8678] uppercase"
                  htmlFor="password"
                >
                  Password
                </label>
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

              {/* Is Seller Checkbox */}
              <div className="flex items-center space-x-3 pt-2 lg:pt-3">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="isSeller"
                    name="isSeller"
                    checked={formData.isSeller}
                    onChange={handleChange}
                    className="peer appearance-none w-5 h-5 bg-[#FFFFFF] border border-[#E0DFD8] rounded md:rounded-md checked:bg-[#2C2C2A] checked:border-[#2C2C2A] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5C2B7] focus:ring-offset-2 focus:ring-offset-[#F9F9F6]"
                  />
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#F9F9F6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <label
                  className="text-sm text-[#8A8678] cursor-pointer select-none font-medium"
                  htmlFor="isSeller"
                >
                  Register as a seller
                </label>
              </div>
            </div>

            <div className="pt-4 lg:pt-6 space-y-4 lg:space-y-5">
              <button
                type="submit"
                className="w-full bg-[#2C2C2A] hover:bg-[#1A1A1A] text-[#F9F9F6] font-medium tracking-widest uppercase py-3.5 lg:py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-3">
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

          <div className="mt-8 text-center lg:text-left">
            <p className="text-xs text-[#8A8678]">
              By registering, you agree to our{" "}
              <a
                href="#"
                className="text-[#2C2C2A] hover:text-[#8A8678] transition-colors underline decoration-[#E0DFD8] underline-offset-4"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#2C2C2A] hover:text-[#8A8678] transition-colors underline decoration-[#E0DFD8] underline-offset-4"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
