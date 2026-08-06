"use client";

import React, { useState, useContext, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useProducts } from "../../hooks/useProducts";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

// Reusable icon-only Add to Cart button with success flash
function AddToCartBtn({ product }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        type: "error",
        title: "Authentication Required",
        message: "Please login to add to cart",
      });
      router.push("/login");
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleAdd}
      title="Add to Cart"
      className={`rounded-lg bg-transparent border p-1.5 transition-all cursor-pointer ${
        added
          ? "border-cyan-500 dark:border-cyan-400 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
          : "border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_5px_rgba(255,0,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]"
      }`}
    >
      {added ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )}
    </button>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ItemsContent = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAdmin = user?.email === "admin@techmarket.com";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [maxPrice, setMaxPrice] = useState(null);
  const [minRating, setMinRating] = useState(0);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Dynamic upper bound so expensive items (e.g. RTX 5090) aren't filtered out
  const priceCeil = products.length
    ? Math.max(...products.map((p) => p.price), 2000)
    : 2000;
  const currentMaxPrice = maxPrice === null ? priceCeil : maxPrice;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = p.price <= currentMaxPrice;
    const matchesRating = p.rating >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (!user) {
      toast({
        type: "error",
        title: "Authentication Required",
        message: "Please login to buy product",
      });
      router.push("/login");
      return;
    }
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Title */}
      <motion.div variants={fadeInUp} className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Browse Tech Products</h1>
        <p className="mt-2 text-sm text-ink-2">Find, search and filter through our latest catalog of high-end gadgets.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Filters */}
        <motion.div variants={fadeInUp} className="bg-surface-2 border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,243,255,0.1)] space-y-6 h-fit">
          <h2 className="font-bold text-lg text-cyan-600 dark:text-cyan-400 mb-4 flex items-center gap-2">
            <span>⚙️</span> Filters
          </h2>

          <div>
            <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Search</label>
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-surface-3 border border-cyan-500/30 text-ink rounded-lg focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all placeholder-ink-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-surface-3 border border-cyan-500/30 text-ink rounded-lg focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider">Max Price</label>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">৳{currentMaxPrice}</span>
            </div>
            <input
              type="range" min="100" max={priceCeil} step="50"
              value={currentMaxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-surface-3 rounded-lg h-2"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider">Min Rating</label>
              <span className="text-sm font-bold text-pink-500 dark:text-pink-400">{minRating} ⭐</span>
            </div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-3 border border-cyan-500/30 text-ink rounded-lg focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all text-sm"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.7">4.7+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-surface-3 animate-pulse border border-line" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-surface-2 border border-pink-500/30 rounded-2xl shadow-[0_0_15px_rgba(255,0,255,0.1)]"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-pink-500 dark:text-pink-400">No Products Found</h3>
              <p className="text-sm text-ink-2 mt-2">Try adjusting your filters or search keywords.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -5 }}
                    key={p.id}
                    onClick={() => router.push(`/items/${p.id}`)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-2 transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] cursor-pointer h-full"
                  >
                    <div className="relative aspect-video overflow-hidden bg-surface-4">
                      <img
                        src={p.image} alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                      <span className="absolute top-3 right-3 rounded-full border border-pink-500 bg-pink-500/20 px-2.5 py-1 text-[10px] font-black text-pink-600 dark:text-pink-400 tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)]">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-ink-3 uppercase tracking-wider">
                          Rating: <span className="text-pink-500 dark:text-pink-400">{p.rating} ⭐</span>
                        </span>
                      </div>
                      <h3 className="font-bold text-ink line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                      <p className="mt-2 text-xs text-ink-2 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-line mt-4">
                        <span className="font-mono font-bold text-lg text-ink">৳{p.price}</span>
                        {!isAdmin && (
                          <div className="flex items-center gap-2">
                            <AddToCartBtn product={p} />
                            <button
                              onClick={(e) => handleBuyNow(e, p)}
                              className="rounded-lg bg-cyan-500 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-black hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.4)] hover:shadow-[0_0_20px_rgba(0,243,255,0.8)] uppercase"
                            >
                              Buy Now
                            </button>
                          </div>
                        )}
                        {isAdmin && (
                          <Link
                            href={`/items/${p.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg bg-pink-500 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-white hover:bg-pink-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,255,0.4)] hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] uppercase"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Items() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto mb-4" />
        <p className="text-ink-3">Loading catalog...</p>
      </div>
    }>
      <ItemsContent />
    </Suspense>
  );
}
