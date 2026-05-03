import React, { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-[#2C2C2A] font-sans p-6 md:p-12 selection:bg-[#2C2C2A] selection:text-[#F9F9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#2C2C2A] mb-2">
              Seller{" "}
              <span className="font-medium text-[#8A8678]">Dashboard</span>
            </h1>
            <p className="text-[#8A8678] text-sm md:text-base font-medium">
              Manage and view your curated collections.
            </p>
          </div>
          <Link
            to="/seller/create-product"
            className="bg-[#2C2C2A] hover:bg-[#1A1A1A] text-[#F9F9F6] px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 tracking-widest text-sm uppercase"
          >
            Add New Product
          </Link>
        </div>

        {sellerProducts && sellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sellerProducts.map((product) => (
              <div
                onClick={() => {
                  navigate(`/seller/product/${product._id}`);
                }}
                key={product._id}
                className="bg-[#FFFFFF] rounded-2xl cursor-pointer overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col border border-[#E0DFD8]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EFEA]">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <div className="absolute inset-0 bg-[#F9F9F6]/5 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8A8678] font-light">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20 bg-[#F9F9F6]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-[#2C2C2A] uppercase shadow-sm border border-[#E0DFD8]">
                    {product.price?.currency} {product.price?.amount}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-medium text-[#2C2C2A] mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-[#8A8678] line-clamp-2 flex-grow mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E0DFD8]">
                    <span className="text-xs uppercase tracking-wider text-[#8A8678] font-medium">
                      Added {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        navigate(`/seller/product/${product._id}`);
                      }}
                      className="text-[#2C2C2A] hover:text-[#8A8678] transition-colors text-sm font-medium uppercase tracking-widest"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-[#FFFFFF] rounded-3xl border border-[#E0DFD8] shadow-sm">
            <div className="w-24 h-24 bg-[#F0EFEA] rounded-full flex items-center justify-center mb-8 border border-[#E0DFD8]">
              <svg
                className="w-10 h-10 text-[#8A8678]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-[#2C2C2A] mb-3">
              No products yet
            </h3>
            <p className="text-[#8A8678] text-center max-w-md mb-10 leading-relaxed">
              Start building your collection by adding your first product. Your
              items will be showcased here in your premium gallery.
            </p>
            <Link
              to="/seller/create-product"
              className="bg-transparent border border-[#2C2C2A] text-[#2C2C2A] hover:bg-[#2C2C2A] hover:text-[#F9F9F6] px-8 py-3 rounded-full font-medium transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
