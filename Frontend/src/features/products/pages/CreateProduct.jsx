import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [images, setImages] = useState([]); // Array of { file, preview }

  /* ─── Handlers ─────────────────────────────────────── */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = useCallback((files) => {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setImages((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      const toAdd = incoming.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
  }, []);

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInputChange = (e) => addFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      images.forEach(({ file }) => data.append("images", file));
      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── Shared class strings ──────────────────────────── */

  const labelCls =
    "block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#D0C6AB] mb-2";

  const inputCls =
    "w-full bg-[#2A2A2A] text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700]/60 transition-all placeholder:text-[#4D4732] text-sm";

  /* ─── Render ────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#E5E2E1] font-['Inter',sans-serif] selection:bg-[#FFD700] selection:text-[#131313] relative overflow-x-hidden">
      {/* Ambient glow accents */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#FFD700]/[0.06] blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#E9C400]/[0.05] blur-[160px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Top nav bar ───────────────────────────────── */}
        <header className="w-full max-w-[720px] mx-auto px-6 pt-10 pb-0 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#D0C6AB] hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white leading-none">
              Create Product
            </h1>
            <p className="text-xs text-[#D0C6AB] mt-1">
              Add a new item to your collection
            </p>
          </div>
        </header>

        {/* ── Divider ───────────────────────────────────── */}
        <div className="w-full max-w-[720px] mx-auto px-6 mt-8">
          <div className="h-px bg-[#2A2A2A]" />
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <main className="w-full max-w-[720px] mx-auto px-6 py-10 flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className={labelCls}>
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Classic Oxford Shirt"
                className={inputCls}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelCls}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product — fabric, fit, styling tips..."
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </div>

            {/* Price row */}
            <div>
              <p className={labelCls}>Price</p>
              <div className="flex gap-3">
                {/* Amount */}
                <div className="flex-1">
                  <label htmlFor="priceAmount" className="sr-only">
                    Amount
                  </label>
                  <input
                    id="priceAmount"
                    name="priceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>

                {/* Currency */}
                <div className="w-[120px]">
                  <label htmlFor="priceCurrency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer appearance-none pr-8`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D0C6AB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "calc(100% - 12px) center",
                    }}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1A1A1A]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={`${labelCls} mb-0`}>Product Images</p>
                <span className="text-[11px] text-[#4D4732] tracking-wide">
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>

              {/* Drop zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fileInputRef.current?.click()
                  }
                  className={`
                    relative flex flex-col items-center justify-center gap-3
                    w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer
                    transition-all duration-200 select-none
                    ${
                      isDragging
                        ? "border-[#FFD700] bg-[#FFD700]/[0.04] shadow-[0_0_40px_rgba(255,215,0,0.08)]"
                        : "border-[#2A2A2A] bg-[#131313] hover:border-[#FFD700]/40 hover:bg-[#FFD700]/[0.02]"
                    }
                  `}
                >
                  {/* Camera icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isDragging ? "bg-[#FFD700]/20" : "bg-[#2A2A2A]"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDragging ? "#FFD700" : "#D0C6AB"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-[#D0C6AB] font-light">
                      Drop images here or{" "}
                      <span className="text-[#FFD700] font-medium">
                        click to browse
                      </span>
                    </p>
                    <p className="text-[11px] text-[#4D4732] mt-1 tracking-wide uppercase">
                      PNG, JPG, WEBP · up to {MAX_IMAGES} photos
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              )}

              {/* Thumbnail strip */}
              {(images.length > 0 || images.length < MAX_IMAGES) && (
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {/* Filled slots */}
                  {images.map(({ preview }, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-[#2A2A2A] group-hover:border-[#FFD700]/40 transition-all"
                      />
                      {/* Remove overlay */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        aria-label="Remove image"
                        className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#0E0E0E]/70 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({
                    length: MAX_IMAGES - images.length,
                  }).map((_, i) => (
                    <button
                      key={`empty-${i}`}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border border-dashed border-[#2A2A2A] flex items-center justify-center text-[#4D4732] hover:border-[#FFD700]/40 hover:text-[#FFD700]/60 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4 pb-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#E9C400] hover:from-[#E9C400] hover:to-[#DBC677] disabled:opacity-50 disabled:cursor-not-allowed text-[#3A3000] font-bold py-4 rounded-xl text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(255,215,0,0.12)] hover:shadow-[0_0_40px_rgba(255,215,0,0.22)] transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Publishing…
                  </span>
                ) : (
                  "Publish Product"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
