import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hook/useCart";
import { Link, useNavigate } from "react-router";
import { useRazorpay } from "react-razorpay";

/* ─────────────────────────────────────────
   Quantity Stepper
───────────────────────────────────────── */
const QuantityStepper = ({ value, onDecrement, onIncrement }) => (
  <div className="flex items-center gap-0 border border-[#E0DFD8] rounded-full overflow-hidden bg-[#F9F9F6]">
    <button
      onClick={onDecrement}
      className="w-8 h-8 flex items-center justify-center text-[#8A8678] hover:text-[#2C2C2A] hover:bg-[#E0DFD8] transition-all duration-200 text-sm"
    >
      −
    </button>
    <span className="w-8 text-center text-sm font-medium text-[#2C2C2A]">
      {value}
    </span>
    <button
      onClick={onIncrement}
      className="w-8 h-8 flex items-center justify-center text-[#8A8678] hover:text-[#2C2C2A] hover:bg-[#E0DFD8] transition-all duration-200 text-sm"
    >
      +
    </button>
  </div>
);

/* ─────────────────────────────────────────
   Cart Item Card
───────────────────────────────────────── */
const CartItemCard = ({ item, onRemove, onDecrement, onIncrement }) => {
  const { product, variant: variantId, quantity, price } = item;

  // Resolve the variant object from the product's variants array or object
  const variantObj = Array.isArray(product?.variants)
    ? product.variants.find((v) => v._id === variantId)
    : product?.variants;

  // Pick best image: variant images first, then product images
  const images =
    variantObj?.images?.length > 0 ? variantObj.images : product?.images || [];
  const mainImage = images[0]?.url;

  // Variant attributes for display
  const attributes = variantObj?.attributes || {};
  const attrEntries = Object.entries(attributes).map(([k, v]) => ({
    key: k.trim(),
    value: typeof v === "string" ? v.trim() : v,
  }));

  // Price difference calculation
  let currentPriceAmt = variantObj?.price?.amount ?? product?.price?.amount;
  if (currentPriceAmt === undefined && typeof variantObj?.price === "number")
    currentPriceAmt = variantObj.price;
  if (currentPriceAmt === undefined && typeof product?.price === "number")
    currentPriceAmt = product.price;

  let cartPriceAmt = price?.amount;
  if (cartPriceAmt === undefined && typeof price === "number")
    cartPriceAmt = price;

  const hasPriceChanged =
    currentPriceAmt !== undefined &&
    cartPriceAmt !== undefined &&
    currentPriceAmt !== cartPriceAmt;
  const priceDiff = hasPriceChanged ? currentPriceAmt - cartPriceAmt : 0;
  const absDiff = Math.abs(priceDiff);

  return (
    <div className="group flex gap-5 p-5 bg-[#F0EFEA] rounded-2xl border border-[#E0DFD8] hover:border-[#C5C2B7] transition-all duration-300">
      {/* Product Image */}
      <div className="flex-shrink-0 w-28 h-36 rounded-xl overflow-hidden bg-[#E0DFD8]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product?.title || "Product"}
            className="w-full h-full object-cover object-center mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8A8678]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Title */}
          <h3 className="text-[#2C2C2A] font-light text-base leading-snug truncate mb-2">
            {product?.title || "Unnamed Product"}
          </h3>

          {/* Variant Chips */}
          {attrEntries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attrEntries.map(({ key, value }) => (
                <span
                  key={key}
                  className="px-2.5 py-0.5 bg-[#F9F9F6] border border-[#E0DFD8] rounded-full text-[10px] uppercase tracking-widest text-[#8A8678] font-medium"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <p className="text-[#2C2C2A] text-lg font-light">
            {price?.currency}{" "}
            <span className="font-medium">
              {price?.amount?.toLocaleString("en-IN")}
            </span>
          </p>
        </div>

        <div>
          {/* Bottom row: qty + remove */}
          <div className="flex items-center justify-between mt-4">
            <QuantityStepper
              value={quantity}
              onDecrement={() => onDecrement(product._id, variantId)}
              onIncrement={() => onIncrement(product._id, variantId)}
            />
            <button
              onClick={() => onRemove(product._id, variantId)}
              className="flex items-center gap-1.5 text-[#8A8678] hover:text-[#2C2C2A] transition-colors duration-200 text-xs uppercase tracking-widest font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Remove
            </button>
          </div>

          {/* Price Change Alerts */}
          {hasPriceChanged && priceDiff < 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-md w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span className="text-[10px] text-green-700 font-medium tracking-wide">
                Price dropped! You saved {price?.currency || "INR"}{" "}
                {absDiff.toLocaleString("en-IN")}, you get this at{" "}
                {price?.currency || "INR"}{" "}
                {currentPriceAmt.toLocaleString("en-IN")}.
              </span>
            </div>
          )}
          {hasPriceChanged && priceDiff > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-md w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="text-[10px] text-amber-700 font-medium tracking-wide">
                Price increased to {price?.currency || "INR"}{" "}
                {currentPriceAmt.toLocaleString("en-IN")}. You will pay{" "}
                {price?.currency || "INR"} {absDiff.toLocaleString("en-IN")}{" "}
                more at checkout.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex gap-5 p-5 bg-[#F0EFEA] rounded-2xl border border-[#E0DFD8] animate-pulse">
    <div className="flex-shrink-0 w-28 h-36 rounded-xl bg-[#E0DFD8]" />
    <div className="flex-1 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-[#E0DFD8] rounded-full w-3/4" />
        <div className="h-3 bg-[#E0DFD8] rounded-full w-1/2" />
        <div className="h-5 bg-[#E0DFD8] rounded-full w-1/4 mt-3" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-24 bg-[#E0DFD8] rounded-full" />
        <div className="h-4 w-16 bg-[#E0DFD8] rounded-full" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Empty Cart
───────────────────────────────────────── */
const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      {/* Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[#E0DFD8] rounded-full blur-2xl scale-150" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="72"
          height="72"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8A8678"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <p className="text-[#8A8678] text-xs uppercase tracking-[0.3em] mb-4 font-medium">
        Your Curation
      </p>
      <h2 className="text-[#2C2C2A] text-3xl font-light mb-3 tracking-tight">
        Your cart is empty
      </h2>
      <p className="text-[#8A8678] text-sm font-light leading-relaxed max-w-xs mb-10">
        You haven't added anything yet. Explore the collection and find
        something you'll love.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-10 py-4 bg-[#2C2C2A] text-[#F9F9F6] text-xs font-semibold uppercase tracking-[0.2em] rounded-full hover:bg-[#1A1A1A] transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        Discover the Collection
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Cart Page
───────────────────────────────────────── */
const Cart = () => {
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.items || [];
  const user = useSelector((state) => state.auth.user);
  const { error, isLoading: isRazorpayLoading, Razorpay } = useRazorpay();
  const {
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveFromCart,
    handleCreateCartOrder,
    handleVerifyCartOrder
  } = useCart();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  // Local qty state so UI responds immediately
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function fetchCart() {
      setIsLoading(true);
      try {
        await handleGetCart();
      } finally {
        setIsLoading(false);
      }
    }
    fetchCart();
  }, []);

  // Sync quantities from store when items change
  useEffect(() => {
    if (cartItems) {
      const qs = {};
      cartItems.forEach((item) => {
        qs[item._id] = item.quantity;
      });
      setQuantities(qs);
    }
  }, [cartItems]);

  const getQuantity = (itemId) => quantities[itemId] ?? 1;

  const handleDecrement = async (productId, variantId, itemId) => {
    setQuantities((prev) => ({ ...prev, [itemId]: (prev[itemId] || 1) - 1 }));
    try {
      await handleDecrementCartItem({ productId, variantId });
    } catch (error) {
      // Revert if API fails
      setQuantities((prev) => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }));
    }
  };

  const handleIncrement = async (productId, variantId, itemId) => {
    setQuantities((prev) => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }));
    try {
      await handleIncrementCartItem({ productId, variantId });
    } catch (error) {
      // Revert if API fails
      setQuantities((prev) => ({ ...prev, [itemId]: (prev[itemId] || 2) - 1 }));
    }
  };

  const handleRemove = async (productId, variantId) => {
    try {
      await handleRemoveFromCart({ productId, variantId });
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  const subtotal = cartState?.totalPrice || 0;
  const currency = cartState?.currency || "INR";
  const shippingFree = true;
  const total = subtotal + (shippingFree ? 0 : 0);

  const itemCount = cartItems?.length || 0;

  async function handleCheckout() {
    const order = await handleCreateCartOrder();
    console.log(order);

    const options = {
      key: "rzp_test_SlcVGbkvta8NEG",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        const isValid = await handleVerifyCartOrder(response) 

        if(isValid){
          navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
        }
        
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: "#F9F9F6",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#2C2C2A] font-sans selection:bg-[#2C2C2A] selection:text-[#F9F9F6]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-24">
        {/* Page Header */}
        <div className="mb-12">
          <p className="text-[#8A8678] text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 font-medium">
            The Aura Blanc Edit
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#2C2C2A]">
              Your Selection
            </h1>
            {!isLoading && itemCount > 0 && (
              <span className="text-[#8A8678] text-sm tracking-widest uppercase mb-1 font-medium">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <div className="w-16 h-0.5 bg-[#C5C2B7] mt-6" />
        </div>

        {/* ── Loading State ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="h-96 bg-[#F0EFEA] rounded-2xl animate-pulse border border-[#E0DFD8]" />
          </div>
        ) : itemCount === 0 ? (
          /* ── Empty State ── */
          <EmptyCart />
        ) : (
          /* ── Populated Cart ── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* LEFT — Cart Items */}
            <div className="space-y-4">
              <p className="text-[#8A8678] text-[10px] uppercase tracking-[0.3em] mb-6 font-semibold">
                Your Selection
              </p>
              {cartItems.map((item) => (
                <CartItemCard
                  key={item._id}
                  item={{ ...item, quantity: getQuantity(item._id) }}
                  onRemove={handleRemove}
                  onDecrement={handleDecrement}
                  onIncrement={handleIncrement}
                />
              ))}
            </div>

            {/* RIGHT — Order Summary */}
            <div className="lg:sticky lg:top-28">
              <div className="bg-[#F0EFEA] rounded-2xl border border-[#E0DFD8] p-6 md:p-8 relative overflow-hidden">
                <p className="text-[#8A8678] text-[10px] uppercase tracking-[0.3em] mb-7 font-semibold">
                  Order Summary
                </p>

                {/* Line items */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8A8678] text-sm font-light">
                      Subtotal
                    </span>
                    <span className="text-[#2C2C2A] text-sm font-medium">
                      {currency} {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8A8678] text-sm font-light">
                      Shipping
                    </span>
                    <span className="text-green-600 text-sm tracking-wide font-medium">
                      Complimentary
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#E0DFD8] mb-6" />

                {/* Total */}
                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-[#2C2C2A] text-sm uppercase tracking-widest font-medium">
                    Total
                  </span>
                  <span className="text-[#2C2C2A] text-2xl font-medium tracking-tight">
                    {currency} {total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full h-13 py-4 bg-[#2C2C2A] hover:bg-[#1A1A1A] text-[#F9F9F6] text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </button>

                {/* Secondary CTA */}
                <Link
                  to="/"
                  className="mt-3 w-full py-3.5 flex items-center justify-center border border-[#E0DFD8] hover:border-[#2C2C2A] text-[#2C2C2A] text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 bg-transparent hover:bg-transparent"
                >
                  Continue Shopping
                </Link>

                {/* Trust Signals */}
                <div className="mt-7 pt-6 border-t border-[#E0DFD8] space-y-3">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2C2C2A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className="text-[#8A8678] text-xs font-light">
                      Complimentary shipping on all orders
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2C2C2A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-[#8A8678] text-xs font-light">
                      Easy returns within 14 days
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2C2C2A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-[#8A8678] text-xs font-light">
                      Secure & encrypted checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer Strip ── */}
      <footer className="border-t border-[#E0DFD8] py-8 px-6 md:px-10 bg-[#F9F9F6]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[#C5C2B7] text-xs tracking-widest uppercase">
            © 2026 SNITCH. ESTABLISHED IN AURA BLANC.
          </span>
          <div className="flex gap-6 text-[#8A8678] text-xs uppercase tracking-widest font-medium">
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Shipping
            </Link>
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Returns
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
