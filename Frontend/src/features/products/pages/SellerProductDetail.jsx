import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

const SellerProductDetail = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant } = useProduct();
  const [product, setProduct] = useState(null);

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      const apiProduct = data?.product || data;
      setProduct(apiProduct);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Variant Form State
  const [variantForm, setVariantForm] = useState({
    priceAmount: "",
    priceCurrency: "INR",
    stock: "",
    attributes: [{ key: "", value: "" }], // Dynamic attributes
  });
  const [variantImages, setVariantImages] = useState([]); // Array of { file, preview }

  /* ─── Handlers ─────────────────────────────────────── */

  // Variant Form Handlers
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (index, field, value) => {
    setVariantForm((prev) => {
      const newAttrs = [...prev.attributes];
      newAttrs[index][field] = value;
      return { ...prev, attributes: newAttrs };
    });
  };

  const addAttributeField = () => {
    setVariantForm((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }],
    }));
  };

  const removeAttributeField = (index) => {
    setVariantForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  // Image Upload Handlers
  const handleImageAdd = useCallback((files) => {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setVariantImages((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      const toAdd = incoming.slice(0, remaining).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
  }, []);

  const removeVariantImage = (index) => {
    setVariantImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageAdd(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageAdd(e.target.files);
    }
  };

  // Submit Variant
  const handleCreateVariant = async (e) => {
    e.preventDefault();

    const attributesMap = {};
    variantForm.attributes.forEach((attr) => {
      if (attr.key && attr.value) {
        attributesMap[attr.key] = attr.value;
      }
    });

    if (Object.keys(attributesMap).length === 0) {
      alert("At least one attribute (e.g., Size or Color) is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const variantData = {
        stock: parseInt(variantForm.stock) || 0,
        priceAmount: variantForm.priceAmount,
        priceCurrency: variantForm.priceCurrency,
        attributes: attributesMap,
        images: variantImages.map((img) => img.file),
      };

      // Call Backend API
      await handleAddProductVariant(productId, variantData);

      // Refresh product details from backend to show the new variant
      await fetchProductDetails();

      // Reset Form
      setVariantForm({
        priceAmount: "",
        priceCurrency: "INR",
        stock: "",
        attributes: [{ key: "", value: "" }],
      });
      variantImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setVariantImages([]);
    } catch (error) {
      console.error("Failed to create variant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Stock
  const handleStockUpdate = (variantId, newStock) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v._id === variantId ? { ...v, stock: parseInt(newStock) || 0 } : v,
      ),
    }));
  };

  /* ─── Shared class strings ──────────────────────────── */
  const labelCls =
    "block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A8678] mb-2";
  const inputCls =
    "w-full bg-[#FFFFFF] text-[#2C2C2A] px-4 py-3 rounded-xl border border-[#E0DFD8] focus:outline-none focus:ring-2 focus:ring-[#C5C2B7]/60 focus:border-[#C5C2B7] transition-all placeholder:text-[#C5C2B7] text-sm shadow-sm";
  const cardCls =
    "bg-[#FFFFFF] p-6 rounded-2xl border border-[#E0DFD8] shadow-sm";

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F9F6] flex flex-col items-center justify-center gap-4">
        <svg
          className="animate-spin text-[#8A8678]"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="text-[#8A8678] text-[11px] uppercase tracking-[0.15em] font-semibold">
          Loading Product
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#2C2C2A] font-sans selection:bg-[#2C2C2A] selection:text-[#F9F9F6] relative overflow-x-hidden">
      {/* Ambient glow accents */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#C5C2B7]/10 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#E0DFD8]/20 blur-[160px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ── Top nav bar ───────────────────────────────── */}
        <header className="w-full max-w-[1200px] mx-auto px-6 pt-10 pb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FFFFFF] border border-[#E0DFD8] text-[#8A8678] hover:border-[#2C2C2A] hover:text-[#2C2C2A] transition-all shadow-sm"
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
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#2C2C2A] leading-none">
                Manage Variants
              </h1>
              <p className="text-xs text-[#8A8678] mt-1 font-medium">
                Update inventory and add new styles for {product.title}
              </p>
            </div>
          </div>
          <button
            className="bg-[#2C2C2A] text-[#F9F9F6] px-5 py-2.5 rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-[#1A1A1A] transition-all shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Save All
          </button>
        </header>

        {/* ── Divider ───────────────────────────────────── */}
        <div className="w-full max-w-[1200px] mx-auto px-6 mb-8">
          <div className="h-px bg-[#E0DFD8]" />
        </div>

        {/* ── Main Content Layout ───────────────────────── */}
        <main className="w-full max-w-[1200px] mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Overview */}
          <div className={`lg:col-span-4 space-y-6 ${cardCls}`}>
            <div>
              <p className={labelCls}>Base Product</p>
              <h2 className="text-xl font-medium tracking-tight mt-1">
                {product.title}
              </h2>
              <p className="text-[#8A8678] text-sm mt-3 leading-relaxed line-clamp-4">
                {product.description}
              </p>
              <p className="text-lg font-medium mt-4">
                {product.price.currency}{" "}
                {product.price?.amount
                  ? Number(product.price.amount).toLocaleString()
                  : "0"}
              </p>
            </div>

            <div>
              <p className={labelCls}>Base Gallery</p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {product.images.map((img, idx) => (
                  <div
                    key={img._id || idx}
                    className="aspect-square rounded-xl overflow-hidden border border-[#E0DFD8]"
                  >
                    <img
                      src={img.url}
                      alt={`Base ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Variant Management */}
          <div className="lg:col-span-8 space-y-8">
            {/* Create Variant Form */}
            <div className={cardCls}>
              <h3 className="text-lg font-medium tracking-tight mb-6">
                Create New Variant
              </h3>
              <form onSubmit={handleCreateVariant} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Variant Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`${labelCls} mb-0`}>Variant Images</p>
                      <span className="text-[11px] text-[#8A8678] tracking-wide font-medium">
                        {variantImages.length} / {MAX_IMAGES}
                      </span>
                    </div>

                    {/* Drop Zone */}
                    {variantImages.length < MAX_IMAGES && (
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          relative flex flex-col items-center justify-center gap-3
                          w-full h-32 rounded-2xl border-2 border-dashed cursor-pointer
                          transition-all duration-200 select-none overflow-hidden
                          ${isDragging ? "border-[#2C2C2A] bg-[#2C2C2A]/5" : "border-[#E0DFD8] bg-[#F9F9F6] hover:border-[#C5C2B7]"}
                        `}
                      >
                        <div className="text-center p-4">
                          <div className="w-8 h-8 mx-auto rounded-xl bg-[#FFFFFF] shadow-sm flex items-center justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#8A8678"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                              <circle cx="12" cy="13" r="3" />
                            </svg>
                          </div>
                          <p className="text-xs text-[#8A8678]">
                            Upload up to {MAX_IMAGES} images
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

                    {/* Thumbnail Strip */}
                    {variantImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {variantImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group aspect-square"
                          >
                            <img
                              src={img.preview}
                              alt={`Preview ${idx}`}
                              className="w-full h-full object-cover rounded-xl border border-[#E0DFD8] group-hover:border-[#2C2C2A] transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(idx)}
                              className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#2C2C2A]/70 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Variant Details */}
                  <div className="space-y-4">
                    {/* Attributes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`${labelCls} mb-0`}>Attributes</p>
                        <button
                          type="button"
                          onClick={addAttributeField}
                          className="text-[11px] text-[#2C2C2A] font-medium hover:underline"
                        >
                          + ADD
                        </button>
                      </div>
                      <div className="space-y-2">
                        {variantForm.attributes.map((attr, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Name (e.g. Size)"
                              required={idx === 0}
                              value={attr.key}
                              onChange={(e) =>
                                handleAttributeChange(
                                  idx,
                                  "key",
                                  e.target.value,
                                )
                              }
                              className={`${inputCls} py-2`}
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g. M)"
                              required={idx === 0}
                              value={attr.value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  idx,
                                  "value",
                                  e.target.value,
                                )
                              }
                              className={`${inputCls} py-2`}
                            />
                            {variantForm.attributes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeAttributeField(idx)}
                                className="p-2 text-[#8A8678] hover:text-red-500 transition-colors"
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
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stock & Price */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className={labelCls}>Stock Qty</p>
                        <input
                          name="stock"
                          type="number"
                          min="0"
                          required
                          value={variantForm.stock}
                          onChange={handleVariantChange}
                          placeholder="0"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <p className={labelCls}>Price</p>
                        <input
                          name="priceAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={variantForm.priceAmount}
                          onChange={handleVariantChange}
                          placeholder={product.price?.amount || "0"}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-[#2C2C2A] hover:bg-[#1A1A1A] disabled:opacity-50 text-[#F9F9F6] font-medium py-3 rounded-xl text-sm tracking-widest uppercase transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? "Publishing..." : "Publish Variant"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Current Variants List */}
            <div className={cardCls}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium tracking-tight">
                  Current Variants
                </h3>
                <span className="text-[11px] bg-[#F0EFEA] text-[#8A8678] px-2 py-1 rounded-md font-semibold tracking-wide">
                  {product.variants.length} Total
                </span>
              </div>

              {product.variants.length === 0 ? (
                <div className="text-center py-10 bg-[#F9F9F6] rounded-xl border border-dashed border-[#E0DFD8]">
                  <p className="text-[#8A8678] text-sm">
                    No variants added yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.variants.map((v) => (
                    <div
                      key={v._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#E0DFD8] bg-[#F9F9F6] gap-4 transition-colors hover:border-[#C5C2B7]"
                    >
                      {/* Left: Image & Attributes */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E0DFD8] bg-[#FFFFFF] shrink-0">
                          {v.images && v.images.length > 0 ? (
                            <img
                              src={v.images[0].url}
                              alt="Variant"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F0EFEA]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#C5C2B7"
                                strokeWidth="2"
                              >
                                <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {Object.entries(v.attributes || {}).map(
                              ([key, val]) => (
                                <span
                                  key={key}
                                  className="text-xs bg-[#FFFFFF] border border-[#E0DFD8] px-2 py-0.5 rounded-md text-[#2C2C2A] font-medium"
                                >
                                  {key}: {val}
                                </span>
                              ),
                            )}
                          </div>
                          <p className="text-sm font-medium text-[#8A8678]">
                            {v.price?.amount !== undefined &&
                            v.price?.amount !== null
                              ? `${v.price?.currency || "INR"} ${Number(v.price.amount).toLocaleString()}`
                              : "Base Price"}
                          </p>
                        </div>
                      </div>

                      {/* Right: Stock Control */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto w-full border-t border-[#E0DFD8] sm:border-0 pt-3 sm:pt-0">
                        <span
                          className={`text-xs font-medium uppercase tracking-wider ${v.stock === 0 ? "text-red-500" : "text-[#8A8678]"}`}
                        >
                          {v.stock === 0 ? "Out of Stock" : "Stock"}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) =>
                            handleStockUpdate(v._id, e.target.value)
                          }
                          className="w-20 bg-[#FFFFFF] text-center text-[#2C2C2A] px-2 py-1.5 rounded-lg border border-[#E0DFD8] focus:outline-none focus:ring-2 focus:ring-[#C5C2B7]/60 text-sm font-medium shadow-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerProductDetail;
