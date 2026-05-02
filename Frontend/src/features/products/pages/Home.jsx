import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useEffect } from "react";
import { Link } from "react-router";

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#161308] text-[#eae2cf] font-sans overflow-x-hidden">
      {/* Top Navbar Component */}
      <nav className="fixed w-full z-50 bg-[#161308]/80 backdrop-blur-xl border-b border-[#343024]/50 px-8 py-5 flex justify-between items-center transition-all duration-300">
        <div className="text-2xl font-light tracking-[0.25em] text-white select-none">
          SNITCH<span className="text-[#ffd700]">.</span>
        </div>
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#343024] flex items-center justify-center text-[#ffd700] text-xs font-medium border border-[#ffd700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                {(user?.fullname ||
                  user?.name ||
                  user?.firstName ||
                  "U")[0].toUpperCase()}
              </div>
              <span className="text-sm tracking-widest text-[#d0c6ab] font-light hidden sm:block uppercase">
                {user?.fullname || user?.name || user?.firstName || "User"}
              </span>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 border border-[#ffd700]/50 rounded-full hover:bg-[#ffd700] hover:text-[#161308] hover:border-[#ffd700] transition-all duration-300 text-xs tracking-[0.2em] text-[#ffd700] font-medium"
            >
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-screen bg-[#110e05] flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161308]/40 to-[#161308] z-10"></div>
          {/* Subtle abstract background element */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ffd700]/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="z-20 text-center px-6 max-w-5xl mx-auto mt-20">
          <p className="text-[#ffd700] text-xs md:text-sm tracking-[0.3em] mb-6 uppercase">
            Autumn / Winter 2026
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-8">
            THE MIDNIGHT
            <br />
            COLLECTION
          </h1>
          <p className="text-[#d0c6ab] text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Curated essentials designed for the modern aesthetic, featuring
            quiet luxury and minimal silhouettes.
          </p>
          <Link
            to="#new-arrivals"
            className="inline-block bg-[#ffd700] hover:bg-[#e9c400] text-[#3a3000] px-10 py-4 rounded-xl font-medium tracking-widest transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
          >
            EXPLORE NOW
          </Link>
        </div>
      </div>



      {/* Product Grid */}
      <div id="new-arrivals" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">
              NEW ARRIVALS
            </h2>
            <div className="w-16 h-0.5 bg-[#ffd700] mt-6"></div>
          </div>
          <p className="text-[#999077] text-sm uppercase tracking-widest hover:text-[#ffd700] cursor-pointer transition-colors">
            VIEW ALL ({products?.length || 0})
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1f1b10] mb-6 rounded-2xl border border-[#343024]/30 group-hover:border-[#ffd700]/30 transition-colors duration-500">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-700"></div>
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4d4732]">
                      No Image
                    </div>
                  )}
                  {/* Subtle hover overlay for 'View' action */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-[#161308]/80 backdrop-blur-md text-[#ffd700] px-8 py-3 rounded-xl font-medium text-xs tracking-[0.2em] uppercase border border-[#ffd700]/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      View Details
                    </div>
                  </div>
                </div>

                <div className="flex flex-col text-center">
                  <h3 className="text-lg font-light text-white mb-2 truncate group-hover:text-[#ffd700] transition-colors duration-300">
                    {product.title}
                  </h3>
                  <span className="text-[#d0c6ab] font-light tracking-wider">
                    {product.price?.currency} {product.price?.amount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-[#1f1b10] rounded-2xl border border-[#343024]">
            <h3 className="text-2xl font-light text-white mb-3">
              Collection Coming Soon
            </h3>
            <p className="text-[#d0c6ab] text-center max-w-md leading-relaxed">
              We are currently curating our next release. Check back soon for
              new arrivals.
            </p>
          </div>
        )}
      </div>

      {/* Quote Section */}
      <div className="w-full bg-[#110e05] py-32 border-y border-[#343024]/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-[#eae2cf] leading-tight italic">
            "Elegance is not about being noticed, it's about being remembered."
          </h2>
        </div>
      </div>



      {/* Footer */}
      <footer className="w-full bg-[#0e0e0e] border-t border-[#1f1b10] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-light tracking-[0.2em] text-[#ffd700]">
            SNITCH
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[#999077] text-sm tracking-widest uppercase">
            <Link to="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Shipping
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-[#4d4732] text-xs tracking-widest uppercase">
            © 2026 SNITCH. ESTABLISHED IN NOIR.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
