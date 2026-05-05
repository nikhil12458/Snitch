import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart?.items);
  const cartItemCount = cartItems?.length || 0;

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#F9F9F6]/90 backdrop-blur-xl border-b border-[#E0DFD8] px-6 md:px-10 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="h-8 flex items-center">
        <img
          src="/snitch_logo_light.png"
          alt="SNITCH"
          className="h-full object-contain"
        />
      </Link>

      <div className="flex items-center gap-6">
        {user?.role === "seller" && (
          <Link
            to="/seller/dashboard"
            className="flex items-center gap-2 text-[#8A8678] hover:text-[#2C2C2A] transition-colors duration-200 text-xs uppercase tracking-widest font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span className="hidden sm:inline">DASHBOARD</span>
          </Link>
        )}

        <Link
          to="/cart"
          className="flex items-center gap-2 text-[#8A8678] hover:text-[#2C2C2A] transition-colors duration-200 text-xs uppercase tracking-widest font-medium"
        >
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#2C2C2A] text-[#F9F9F6] text-[9px] font-bold h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">CART</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2C2C2A] flex items-center justify-center text-[#F9F9F6] text-xs font-medium border border-[#E0DFD8] shadow-sm">
              {(user?.fullname ||
                user?.name ||
                user?.firstName ||
                "U")[0].toUpperCase()}
            </div>
            <span className="text-sm tracking-widest text-[#8A8678] font-medium hidden sm:block uppercase">
              {user?.fullname || user?.name || user?.firstName || "User"}
            </span>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 border border-[#2C2C2A] rounded-full hover:bg-[#2C2C2A] hover:text-[#F9F9F6] transition-all duration-300 text-xs tracking-[0.2em] text-[#2C2C2A] font-medium"
          >
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
