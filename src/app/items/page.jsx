"use client";

import React, { useState, useContext, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useProducts } from "../../hooks/useProducts";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

// Reusable icon-only Add to Cart button with success flash
function AddToCartBtn({ product }) {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
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
          ? "border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
          : "border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_5px_rgba(255,0,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]"
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

const ItemsContent = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAdmin = user?.email === "admin@techmarket.com";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    const matchesRating = p.rating >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const handleBuyNow = (product) => {
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-extrabold text-white neon-text-cyan sm:text-4xl">Browse Tech Products</h1>
        <p className="mt-2 text-sm text-zinc-400">Find, search and filter through our latest catalog of high-end gadgets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Filters */}
        <div className="bg-[#0a0a0a] border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,243,255,0.1)] space-y-6">
          <h2 className="font-bold text-lg text-cyan-400 mb-4 flex items-center gap-2">
            <span>⚙️</span> Filters
          </h2>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Search</label>
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-[#050505] border border-cyan-500/30 text-white rounded-lg focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all placeholder-zinc-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#050505] border border-cyan-500/30 text-white rounded-lg focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all text-sm"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Max Price</label>
              <span className="text-sm font-bold text-cyan-400 neon-text-cyan">৳{maxPrice}</span>
            </div>
            <input
              type="range" min="100" max="2000" step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 rounded-lg h-2"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Min Rating</label>
              <span className="text-sm font-bold text-pink-400 neon-text-pink">{minRating} ⭐</span>
            </div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#050505] border border-cyan-500/30 text-white rounded-lg focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all text-sm"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.7">4.7+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-[#0a0a0a] animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#0a0a0a] border border-pink-500/30 rounded-2xl shadow-[0_0_15px_rgba(255,0,255,0.1)]">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-pink-400">No Products Found</h3>
              <p className="text-sm text-zinc-400 mt-2">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] transition-all hover:neon-glow-cyan hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#050505]">
                    <img
                      src={p.image} alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <span className="absolute top-3 right-3 rounded-full border border-pink-500 bg-pink-500/20 px-2.5 py-1 text-[10px] font-black text-pink-400 tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)]">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                        Rating: <span className="text-pink-400">{p.rating} ⭐</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/80 mt-4">
                      <span className="font-mono font-bold text-lg text-white">৳{p.price}</span>
                      {!isAdmin && (
                        <div className="flex items-center gap-2">
                          <AddToCartBtn product={p} />
                          <button
                            onClick={() => handleBuyNow(p)}
                            className="rounded-lg bg-cyan-500 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-black hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.4)] hover:shadow-[0_0_20px_rgba(0,243,255,0.8)] uppercase"
                          >
                            Buy Now
                          </button>
                        </div>
                      )}
                      {isAdmin && (
                        <Link
                          href={`/items/${p.id}`}
                          className="rounded-lg bg-pink-500 px-3.5 py-1.5 text-[10px] font-black tracking-widest text-white hover:bg-pink-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,255,0.4)] hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] uppercase"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Items() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto mb-4" />
        <p className="text-zinc-500">Loading catalog...</p>
      </div>
    }>
      <ItemsContent />
    </Suspense>
  );
}
