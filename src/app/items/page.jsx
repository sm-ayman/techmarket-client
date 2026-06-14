"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProducts } from "../../hooks/useProducts";

// Main Content Component wrapped in Suspense
const ItemsContent = () => {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  // Derive unique categories from products
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    const matchesPrice = p.price <= maxPrice;

    const matchesRating = p.rating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
          Browse Tech Products
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Find, search and filter through our latest catalog of high-end gadgets.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Filters */}
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Filters
          </h2>

          {/* Search bar */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder-zinc-400 text-sm"
            />
          </div>

          {/* Filter 1: Category */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors text-sm"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 2: Max Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-sm font-semibold text-teal-500">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-500 bg-zinc-200 dark:bg-zinc-855 rounded-lg h-2"
            />
          </div>

          {/* Filter 3: Min Rating */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Min Rating
              </label>
              <span className="text-sm font-semibold text-teal-500">{minRating} ⭐</span>
            </div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors text-sm"
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
                <div key={n} className="h-96 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Products Found</h3>
              <p className="text-sm text-zinc-500 mt-2">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-55">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-teal-500/95 px-2.5 py-1 text-xs font-semibold text-white">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-zinc-400">Rating: {p.rating} ⭐</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-teal-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-bold text-lg text-zinc-950 dark:text-white">
                        ${p.price}
                      </span>
                      <Link
                        href={`/items/${p.id}`}
                        className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-600 transition-colors cursor-pointer"
                      >
                        View Details
                      </Link>
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto mb-4" />
        <p className="text-zinc-500">Loading catalog...</p>
      </div>
    }>
      <ItemsContent />
    </Suspense>
  );
}
