import React, { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#161308] text-[#eae2cf] font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-2">
              Seller <span className="font-light text-[#ffd700]">Dashboard</span>
            </h1>
            <p className="text-[#d0c6ab] text-sm md:text-base">
              Manage and view your listed products.
            </p>
          </div>
          <Link
            to="/seller/create-product"
            className="bg-[#ffd700] hover:bg-[#e9c400] text-[#3a3000] px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]"
          >
            Add New Product
          </Link>
        </div>

        {sellerProducts && sellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sellerProducts.map((product) => (
              <div
                key={product._id}
                className="bg-[#1f1b10] rounded-xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(255,215,0,0.05)] transition-all duration-500 group flex flex-col border border-[#343024]/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#110e05]">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4d4732]">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20 bg-[#161308]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-[#ffd700] uppercase">
                    {product.price?.currency} {product.price?.amount}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-light text-white mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-[#d0c6ab] line-clamp-2 flex-grow mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#343024]">
                    <span className="text-xs uppercase tracking-wider text-[#999077]">
                      Added {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-[#d0c6ab] hover:text-[#ffd700] transition-colors text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-[#1f1b10] rounded-2xl border border-[#343024]">
            <div className="w-24 h-24 bg-[#2e2a1e] rounded-full flex items-center justify-center mb-8">
              <svg className="w-10 h-10 text-[#d0c6ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-white mb-3">No products yet</h3>
            <p className="text-[#d0c6ab] text-center max-w-md mb-10 leading-relaxed">
              Start building your collection by adding your first product. Your items will be showcased here in your premium gallery.
            </p>
            <Link
              to="/seller/create-product"
              className="bg-transparent border border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#3a3000] px-8 py-3 rounded-xl font-medium transition-all duration-300"
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
