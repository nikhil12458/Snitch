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
    <div className="min-h-screen bg-[#F9F9F6] text-[#2C2C2A] font-sans overflow-x-hidden selection:bg-[#2C2C2A] selection:text-[#F9F9F6]">

      {/* Hero Section */}
      <div className="relative w-full min-h-[85vh] bg-[#F0EFEA] flex flex-col items-center justify-center py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F9F9F6]/30 to-[#F9F9F6] z-10"></div>
          {/* Subtle abstract background element */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#C5C2B7]/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="z-20 text-center px-6 max-w-5xl mx-auto mt-10">
          <p className="text-[#8A8678] text-xs md:text-sm tracking-[0.3em] mb-6 uppercase font-medium">
            The Aura Blanc Edit
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-[#2C2C2A] mb-8">
            TRANSCEND
            <br />
            THE ORDINARY
          </h1>
          <p className="text-[#8A8678] text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12">
            Discover a curated collection of elevated essentials. Minimalist silhouettes designed for the modern aesthetic.
          </p>
          <Link
            to="#new-arrivals"
            className="inline-block bg-[#2C2C2A] hover:bg-[#1A1A1A] text-[#F9F9F6] px-10 py-4 rounded-full font-medium tracking-widest transition-all duration-500 hover:shadow-xl"
          >
            DISCOVER THE COLLECTION
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div id="new-arrivals" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-[#2C2C2A] tracking-wide">
              CURATED SELECTION
            </h2>
            <div className="w-16 h-0.5 bg-[#C5C2B7] mt-6"></div>
          </div>
          <p className="text-[#8A8678] text-sm uppercase tracking-widest hover:text-[#2C2C2A] cursor-pointer transition-colors font-medium">
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
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EFEA] mb-6 rounded-2xl border border-[#E0DFD8] group-hover:border-[#C5C2B7] transition-colors duration-500">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <div className="absolute inset-0 bg-[#F9F9F6]/5 z-10 group-hover:bg-transparent transition-colors duration-700"></div>
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out mix-blend-multiply"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8A8678] font-light">
                      No Image Available
                    </div>
                  )}
                  {/* Subtle hover overlay for 'View' action */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-[#F9F9F6]/90 backdrop-blur-md text-[#2C2C2A] px-8 py-3 rounded-full font-medium text-xs tracking-[0.2em] uppercase border border-[#E0DFD8] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                      View Details
                    </div>
                  </div>
                </div>

                <div className="flex flex-col text-center">
                  <h3 className="text-lg font-medium text-[#2C2C2A] mb-2 truncate transition-colors duration-300">
                    {product.title}
                  </h3>
                  <span className="text-[#8A8678] font-light tracking-wider">
                    {product.price?.currency} {product.price?.amount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-[#F0EFEA] rounded-2xl border border-[#E0DFD8]">
            <h3 className="text-2xl font-light text-[#2C2C2A] mb-3">
              Collection Coming Soon
            </h3>
            <p className="text-[#8A8678] text-center max-w-md leading-relaxed">
              We are currently curating our next release. Check back soon for
              new arrivals.
            </p>
          </div>
        )}
      </div>

      {/* Quote Section */}
      <div className="w-full bg-[#F0EFEA] py-32 border-y border-[#E0DFD8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-[#8A8678] leading-tight italic">
            "Simplicity is the ultimate sophistication."
          </h2>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#F9F9F6] pt-16 pb-8 border-t border-[#E0DFD8]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-10">
          <div className="h-8 opacity-80">
            <img src="/snitch_logo_light.png" alt="SNITCH" className="h-full object-contain" />
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[#8A8678] text-sm tracking-widest uppercase font-medium">
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Terms
            </Link>
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Shipping
            </Link>
            <Link to="#" className="hover:text-[#2C2C2A] transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-[#C5C2B7] text-xs tracking-widest uppercase mt-4">
            © 2026 SNITCH. ESTABLISHED IN AURA BLANC.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
