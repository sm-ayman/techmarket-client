"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import { useProducts } from "../../../hooks/useProducts";

const ManageItems = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { products, loading: productsLoading, deleteProduct } = useProducts();
  const router = useRouter();

  // Selected filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-zinc-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Sidebar Filter categories
  const filterCategories = ["All", "Phones", "Laptops", "Audio", "Tablets", "Wearables", "Accessories"];

  // Apply filters
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryFilter === "All" || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase() || (selectedCategoryFilter === "Phones" && p.category === "Phones");
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Mock stock numbers for preview
  const getStockInfo = (title) => {
    // Generate deterministic stock based on title length
    const units = (title.length * 7) % 120 + 3;
    const progress = Math.min(100, Math.max(5, (units / 120) * 100));
    const isLow = units < 15;
    return { units, progress, isLow };
  };

  // Stats
  const totalItems = products.length;
  const lowStockCount = products.filter((p) => getStockInfo(p.title).isLow).length;
  const inTransitCount = Math.round(totalItems * 0.15) + 2;

  // Category badges color mapping
  const badgeColor = (cat) => {
    switch (cat.toLowerCase()) {
      case "phones":
      case "smartphones":
        return "bg-pink-500/10 text-pink-400 border border-pink-500/20";
      case "laptops":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "audio":
        return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
      case "gaming":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border border-zinc-700/50";
    }
  };

  return (
    <div className="bg-[#0A0A0C] text-white min-h-screen font-sans border-t border-zinc-900">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-72 bg-[#0C0C0E] border-b lg:border-b-0 lg:border-r border-zinc-900 p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Filters</h2>
              <p className="text-xs text-zinc-500 mt-1">Refine your tech inventory views.</p>
            </div>

            <nav className="flex flex-col gap-2">
              {filterCategories.map((cat) => {
                const isActive = selectedCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-550/20"
                        : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                    }`}
                  >
                    <span className="mr-3 text-base">
                      {cat === "All" ? "📦" : cat === "Phones" ? "📱" : cat === "Laptops" ? "💻" : cat === "Audio" ? "🎧" : "⚙️"}
                    </span>
                    {cat === "Phones" ? "Smartphones" : cat}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-12 lg:mt-32">
            <button
              onClick={() => {
                setSelectedCategoryFilter("All");
                setSearchQuery("");
              }}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-650 hover:to-indigo-650 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/10 transition-all cursor-pointer text-center"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Right Dashboard Area */}
        <main className="flex-1 p-8 sm:p-12 space-y-10">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Manage Inventory</h1>
              <p className="text-zinc-500 text-xs mt-1">
                Track and control your high-performance hardware stocks.
              </p>
            </div>
            <Link
              href="/items/add"
              className="px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              ➕ Add New Product
            </Link>
          </div>

          {/* Stats Grid Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0C0C0E]/60 border border-zinc-900 p-6 rounded-2xl">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TOTAL ITEMS</span>
              <span className="text-4xl font-black text-white mt-2 block">
                {productsLoading ? "..." : totalItems.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#0C0C0E]/60 border border-zinc-900 p-6 rounded-2xl">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-red-400">LOW STOCK</span>
              <span className="text-4xl font-black text-red-400 mt-2 block">
                {productsLoading ? "..." : lowStockCount}
              </span>
            </div>
            <div className="bg-[#0C0C0E]/60 border border-zinc-900 p-6 rounded-2xl">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-purple-400">IN TRANSIT</span>
              <span className="text-4xl font-black text-purple-400 mt-2 block">
                {productsLoading ? "..." : inTransitCount}
              </span>
            </div>
          </div>

          {/* Inventory Table Container */}
          <div className="bg-[#0C0C0E]/40 border border-zinc-900 rounded-3xl overflow-hidden p-6 space-y-6">
            
            {/* Table Search Actions */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search inventory by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 text-white rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-colors placeholder-zinc-500"
                />
              </div>
              <div className="flex gap-2.5">
                <button className="px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-bold hover:text-white transition-colors cursor-pointer">
                  🎛️ Columns
                </button>
                <button className="px-4 py-2.5 bg-zinc-900/60 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-bold hover:text-white transition-colors cursor-pointer">
                  📤 Export
                </button>
              </div>
            </div>

            {/* Main Table */}
            {productsLoading ? (
              <div className="py-20 text-center text-zinc-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
                <span>Loading catalog items...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                <span>No products matching your search criteria.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <th className="pb-4 pt-2">PRODUCT NAME</th>
                      <th className="pb-4 pt-2">CATEGORY</th>
                      <th className="pb-4 pt-2">PRICE</th>
                      <th className="pb-4 pt-2">STOCK</th>
                      <th className="pb-4 pt-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-sm">
                    {filteredProducts.map((p) => {
                      const sku = `TM-${p.id.toUpperCase().slice(0, 8)}`;
                      const { units, progress, isLow } = getStockInfo(p.title);

                      return (
                        <tr key={p.id} className="hover:bg-zinc-900/20 transition-all">
                          {/* Name */}
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-12 w-12 rounded-xl object-cover bg-zinc-900/80 border border-zinc-800/80"
                              />
                              <div>
                                <span className="font-bold text-white block">{p.title}</span>
                                <span className="text-[10px] text-zinc-500 block mt-0.5">SKU: {sku}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeColor(p.category)}`}>
                              {p.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 font-black text-white">
                            ${p.price.toLocaleString()}.00
                          </td>

                          {/* Stock progress bar */}
                          <td className="py-4">
                            <div className="max-w-[120px]">
                              <span className={`text-xs font-bold block ${isLow ? "text-orange-400" : "text-white"}`}>
                                {units} Units
                              </span>
                              <div className="w-full bg-zinc-850 h-1 rounded-full mt-2 overflow-hidden">
                                <div
                                  style={{ width: `${progress}%` }}
                                  className={`h-full rounded-full ${isLow ? "bg-orange-500" : "bg-purple-500"}`}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/items/${p.id}`}
                                className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                              >
                                View Specs
                              </Link>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove "${p.title}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="px-3 py-1.5 bg-red-950/20 hover:bg-red-900/20 border border-red-900/30 text-red-400 hover:text-red-350 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination footer bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900 text-xs text-zinc-500">
              <div>
                Showing 1 to {filteredProducts.length} of {filteredProducts.length} results
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 border border-zinc-850 bg-zinc-950/50 rounded-xl hover:text-white transition-colors cursor-pointer">◀</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-purple-500 text-white font-bold shadow-md shadow-purple-500/10">1</button>
                <button className="p-2 border border-zinc-850 bg-zinc-950/50 rounded-xl hover:text-white transition-colors cursor-pointer">▶</button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default ManageItems;
