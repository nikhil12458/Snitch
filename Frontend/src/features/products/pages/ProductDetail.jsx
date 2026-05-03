import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useEffect, useState } from "react";
import { useCart } from "../../cart/hook/useCart";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleAddItem } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [normalizedVariants, setNormalizedVariants] = useState([]);

  const { handleGetProductById } = useProduct();

  async function fetchProductDetails() {
    setIsLoading(true);
    try {
      const data = await handleGetProductById(productId);
      const fetchedProduct = data?.product || data;
      setProduct(fetchedProduct);

      if (fetchedProduct?.variants?.length > 0) {
        const normVariants = fetchedProduct.variants.map((v) => {
          const normAttr = {};
          if (v.attributes) {
            Object.entries(v.attributes).forEach(([k, val]) => {
              normAttr[k.trim()] = typeof val === "string" ? val.trim() : val;
            });
          }
          return { ...v, attributes: normAttr };
        });
        setNormalizedVariants(normVariants);
        setSelectedAttributes({});
        setSelectedVariant(null);
      } else {
        setNormalizedVariants([]);
        setSelectedAttributes({});
        setSelectedVariant(null);
      }

      setSelectedImageIndex(0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2C2C2A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F9F6] flex flex-col items-center justify-center text-[#2C2C2A]">
        <h2 className="text-2xl font-light mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-[#8A8678] hover:text-[#2C2C2A] underline underline-offset-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  const attributeOptions = {};
  normalizedVariants.forEach((v) => {
    Object.entries(v.attributes).forEach(([k, val]) => {
      if (!attributeOptions[k]) attributeOptions[k] = new Set();
      attributeOptions[k].add(val);
    });
  });

  const handleAttributeSelect = (key, value) => {
    let newAttributes = { ...selectedAttributes };

    if (newAttributes[key] === value) {
      delete newAttributes[key];
    } else {
      newAttributes[key] = value;
    }

    setSelectedAttributes(newAttributes);

    if (Object.keys(newAttributes).length === 0) {
      setSelectedVariant(null);
      setSelectedImageIndex(0);
      return;
    }

    const matchingVariant = normalizedVariants.find((v) => {
      return Object.entries(newAttributes).every(
        ([k, val]) => v.attributes[k] === val,
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setSelectedImageIndex(0);
    } else {
      const fallbackVariant = normalizedVariants.find(
        (v) => v.attributes[key] === value,
      );
      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
        setSelectedVariant(fallbackVariant);
        setSelectedImageIndex(0);
      } else {
        setSelectedVariant(null);
        setSelectedImageIndex(0);
      }
    }
  };

  const currentImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product?.images || [];
  const currentPrice = selectedVariant?.price?.amount
    ? selectedVariant.price
    : product?.price;

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#2C2C2A] font-sans selection:bg-[#2C2C2A] selection:text-[#F9F9F6]">
      {/* Navbar space / Back button */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-6 md:pt-10 pb-4 md:pb-6 flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#8A8678] hover:text-[#2C2C2A] transition-colors uppercase tracking-widest text-xs font-medium"
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
          Back
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 pb-12 md:pb-24">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-3 md:gap-4">
            {/* Thumbnails Gallery (Vertical on md+, Horizontal on mobile) */}
            {currentImages && currentImages.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:max-h-[80vh] scrollbar-hide pb-2 md:pb-0 md:pr-2">
                {currentImages.map((img, index) => (
                  <button
                    key={img._id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-[#2C2C2A] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    } bg-[#F0EFEA]`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover object-center mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex-1 aspect-[4/5] overflow-hidden bg-[#F0EFEA] rounded-2xl border border-[#E0DFD8] mb-4 md:mb-0 group">
              {currentImages && currentImages.length > 0 ? (
                <>
                  <img
                    src={currentImages[selectedImageIndex]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover object-center mix-blend-multiply transition-opacity duration-300"
                  />

                  {/* Navigation Arrows */}
                  {currentImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImageIndex((prev) =>
                            prev === 0 ? currentImages.length - 1 : prev - 1,
                          );
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FFFFFF]/80 backdrop-blur-sm text-[#2C2C2A] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#E0DFD8] hover:bg-[#FFFFFF] shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedImageIndex((prev) =>
                            prev === currentImages.length - 1 ? 0 : prev + 1,
                          );
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FFFFFF]/80 backdrop-blur-sm text-[#2C2C2A] w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#E0DFD8] hover:bg-[#FFFFFF] shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8A8678] font-light">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-[#8A8678] text-xs uppercase tracking-[0.2em] mb-4">
              Aura Blanc Edit
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#2C2C2A] mb-4">
              {product.title}
            </h1>

            <div className="text-2xl font-medium text-[#2C2C2A] mb-2">
              {currentPrice?.currency} {currentPrice?.amount}
            </div>

            <div className="text-sm font-medium tracking-wide uppercase mb-8">
              {normalizedVariants.length > 0 ? (
                selectedVariant ? (
                  selectedVariant.stock > 0 ? (
                    <span className="text-green-600">
                      {selectedVariant.stock} in stock
                    </span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )
                ) : (
                  <span className="text-[#8A8678]">
                    Please select all options
                  </span>
                )
              ) : (
                <span className="text-[#8A8678]">Stock unavailable</span>
              )}
            </div>

            {/* Variants Section */}
            {normalizedVariants.length > 0 && (
              <div className="mb-8">
                {Object.keys(attributeOptions).map((attrKey) => (
                  <div key={attrKey} className="mb-5">
                    <h3 className="text-sm font-medium tracking-widest uppercase text-[#8A8678] mb-3">
                      {attrKey}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Array.from(attributeOptions[attrKey]).map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAttributeSelect(attrKey, option)}
                          className={`px-5 py-2 border rounded-full text-sm font-medium transition-all ${
                            selectedAttributes[attrKey] === option
                              ? "border-[#2C2C2A] bg-[#2C2C2A] text-[#F9F9F6]"
                              : "border-[#E0DFD8] text-[#2C2C2A] hover:border-[#2C2C2A] bg-transparent"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-sm font-medium tracking-widest uppercase text-[#8A8678] mb-3">
                Description
              </h3>
              <p className="text-[#2C2C2A] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              <button
                onClick={() => {
                  handleAddItem({
                    productId: product._id,
                    variantId: selectedVariant?._id,
                  });
                }}
                className="w-full bg-[#FFFFFF] border border-[#2C2C2A] text-[#2C2C2A] hover:bg-[#F0EFEA] px-8 py-4 rounded-full font-medium tracking-widest text-sm uppercase transition-all duration-300 shadow-sm"
              >
                Add to Cart
              </button>
              <button className="w-full bg-[#2C2C2A] border border-[#2C2C2A] text-[#F9F9F6] hover:bg-[#1A1A1A] px-8 py-4 rounded-full font-medium tracking-widest text-sm uppercase transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Buy Now
              </button>
            </div>

            {/* Additional info minimal */}
            <div className="mt-12 pt-8 border-t border-[#E0DFD8] flex flex-col gap-3 text-sm text-[#8A8678]">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#2C2C2A]">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <span className="text-[#2C2C2A]">Within 14 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
