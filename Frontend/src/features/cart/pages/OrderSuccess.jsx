import React from "react";
import { useLocation, Link } from "react-router";

const OrderSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  // Format today's date + 3-5 days for delivery estimate
  const today = new Date();
  const startDelivery = new Date(today);
  startDelivery.setDate(today.getDate() + 3);
  const endDelivery = new Date(today);
  endDelivery.setDate(today.getDate() + 5);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#2C2C2A] font-sans selection:bg-[#2C2C2A] selection:text-[#F9F9F6] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <p className="text-[#8A8678] text-[10px] md:text-xs uppercase tracking-[0.4em] mb-12 font-semibold opacity-60">
          The Aura Blanc Edit
        </p>

        {/* Success Icon */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-[#E0DFD8] rounded-full blur-3xl scale-150 opacity-50" />
          <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-[#C5C2B7] bg-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2C2C2A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center max-w-lg">
          <p className="text-[#8A8678] text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 font-semibold">
            Order Confirmed
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#2C2C2A] mb-6">
            Your selection is secured.
          </h1>
          <p className="text-[#8A8678] text-sm md:text-base font-light leading-relaxed mb-12 px-4">
            Thank you for choosing Snitch. Your order has been successfully
            placed and is being prepared by our atelier with the utmost care.
          </p>

          {/* Details Card */}
          <div className="bg-[#F0EFEA] border border-[#E0DFD8] rounded-2xl p-8 md:p-10 mb-12 text-left shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[#8A8678] text-[10px] uppercase tracking-widest font-semibold mb-2">
                  Order Reference
                </p>
                <p className="text-[#2C2C2A] font-medium tracking-tight">
                  {orderId || "#SN-29384-92"}
                </p>
              </div>
              <div>
                <p className="text-[#8A8678] text-[10px] uppercase tracking-widest font-semibold mb-2">
                  Estimated Delivery
                </p>
                <p className="text-[#2C2C2A] font-medium tracking-tight">
                  {formatDate(startDelivery)} — {formatDate(endDelivery)}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-[#E0DFD8] my-8" />

            <div>
              <p className="text-[#8A8678] text-[10px] uppercase tracking-widest font-semibold mb-3">
                A Note from the Atelier
              </p>
              <p className="text-[#2C2C2A] text-xs leading-relaxed font-light italic">
                "Each piece in your selection represents our commitment to
                timeless design and exceptional craftsmanship. We hope it
                brings a sense of elevated confidence to your wardrobe."
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-12 py-4 bg-[#2C2C2A] text-[#F9F9F6] text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#1A1A1A] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="w-full sm:w-auto px-12 py-4 border border-[#E0DFD8] text-[#2C2C2A] text-xs font-semibold uppercase tracking-[0.2em] rounded-full hover:border-[#2C2C2A] transition-all duration-300 text-center"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <footer className="border-t border-[#E0DFD8] py-8 px-6 md:px-10 bg-[#F9F9F6]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[#C5C2B7] text-[10px] tracking-widest uppercase">
            © 2026 SNITCH. ESTABLISHED IN AURA BLANC.
          </span>
          <div className="flex gap-6 text-[#8A8678] text-[10px] uppercase tracking-widest font-medium">
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Support
            </Link>
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderSuccess;
