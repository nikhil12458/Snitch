import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";

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
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col lg:flex-row text-[#E5E2E1] font-sans selection:bg-[#FFD700] selection:text-[#131313]">
      {/* Top/Left Side: Branding / Abstract Art */}
      <div
        className="w-full lg:w-1/2 relative overflow-hidden bg-[#131313] flex flex-col items-center justify-center p-8 sm:p-12 lg:p-12 min-h-[35vh] lg:min-h-screen lg:border-r border-[#2A2A2A] bg-cover bg-center"
        style={{ backgroundImage: "url('/snitch_bg.png')" }}
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
            Welcome to{" "}
            <span className="text-[#FFD700] font-medium">Snitch</span>.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#D0C6AB] leading-relaxed max-w-md drop-shadow-md">
            Your premium destination for modern clothing and apparel. Join our
            community to discover exclusive collections or start selling your
            own fashion line.
          </p>
        </div>
      </div>

      {/* Bottom/Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-20 relative">
        {/* Subtle mobile background glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-[#FFD700]/5 blur-[120px]"></div>
        </div>

        <div className="w-full max-w-md bg-[#131313]/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-[24px] lg:rounded-none p-8 sm:p-10 lg:p-0 shadow-2xl lg:shadow-none shadow-black/50 border lg:border-none border-[#2A2A2A] relative z-10">
          <div className="mb-10 lg:mb-12 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-medium mb-2 lg:mb-3 tracking-tight text-white">
              Create Account
            </h2>
            <p className="text-[#D0C6AB] text-xs sm:text-sm">
              Join us to experience the curated digital journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            <div className="space-y-5 lg:space-y-6">
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-semibold tracking-wider text-[#D0C6AB] uppercase"
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
                  className="w-full bg-[#2A2A2A] text-white px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FFE16D] transition-all placeholder:text-[#4D4732]"
                  placeholder="John Doe"
                  required
                />
              </div>

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

              {/* Contact Number */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-semibold tracking-wider text-[#D0C6AB] uppercase"
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
                  className="w-full bg-[#2A2A2A] text-white px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FFE16D] transition-all placeholder:text-[#4D4732]"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xs font-semibold tracking-wider text-[#D0C6AB] uppercase"
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
                  className="w-full bg-[#2A2A2A] text-white px-4 py-3 lg:py-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FFE16D] transition-all placeholder:text-[#4D4732]"
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
                    className="peer appearance-none w-5 h-5 bg-[#2A2A2A] rounded md:rounded-md checked:bg-[#FFD700] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFE16D] focus:ring-offset-2 focus:ring-offset-[#131313]"
                  />
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#3A3000]"
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
                  className="text-sm text-[#D0C6AB] cursor-pointer select-none"
                  htmlFor="isSeller"
                >
                  Register as a seller
                </label>
              </div>
            </div>

            <div className="pt-4 lg:pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#E9C400] hover:from-[#E9C400] hover:to-[#DBC677] text-[#3A3000] font-bold py-3.5 lg:py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] transform hover:-translate-y-0.5"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-xs text-[#4D4732]">
              By registering, you agree to our{" "}
              <a
                href="#"
                className="text-[#D0C6AB] hover:text-[#FFD700] transition-colors underline decoration-[#4D4732] underline-offset-4"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#D0C6AB] hover:text-[#FFD700] transition-colors underline decoration-[#4D4732] underline-offset-4"
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
