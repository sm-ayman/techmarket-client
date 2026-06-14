"use client";

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import { useProducts } from "../../../hooks/useProducts";

const ManageItems = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { products, loading: productsLoading, deleteProduct } = useProducts();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto" />
        <p className="mt-4 text-zinc-555">Checking credentials...</p>
      </div>
    );
  }

  // Calculate admin stats
  const totalProducts = products.length;
  const avgPrice = totalProducts ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts) : 0;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
            Manage Tech Inventory
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Overview, track, and purge products from the catalog directory.
          </p>
        </div>
        <Link
          href="/items/add"
          className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 shadow-md shadow-teal-500/10 transition-all cursor-pointer"
        >
          + Add New Product
        </Link>
      </div>

      {/* Admin stats dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Products</span>
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 block">{totalProducts}</span>
        </div>
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Average Price</span>
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 block">${avgPrice}</span>
        </div>
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <span className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Active Categories</span>
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2 block">{categoriesCount}</span>
        </div>
      </div>

      {/* Products list table/grid */}
      {productsLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Inventory is empty</h3>
          <p className="text-sm text-zinc-500 mt-2">Get started by creating a new product listing.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-zinc-100 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 dark:bg-zinc-950/40 dark:border-zinc-805">
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Product Info</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-12 w-12 rounded-lg object-cover bg-zinc-100"
                        />
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white block text-sm">{p.title}</span>
                          <span className="text-xs text-zinc-400 truncate max-w-[250px] block mt-0.5">{p.shortDescription}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-zinc-650 dark:text-zinc-300">{p.category}</td>
                    <td className="p-4 text-sm font-bold text-zinc-900 dark:text-white">${p.price}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/items/${p.id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 dark:text-teal-400 dark:hover:text-teal-350 dark:bg-teal-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-red-650 hover:text-red-700 bg-red-50 dark:text-red-400 dark:hover:text-red-350 dark:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grid Layout for smaller mobile screens */}
          <div className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="p-5 space-y-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-12 w-12 rounded-lg object-cover bg-zinc-150"
                  />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block text-sm">{p.title}</span>
                    <span className="text-xs text-zinc-400">{p.category}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white">${p.price}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/items/${p.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/30 rounded-lg"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;
