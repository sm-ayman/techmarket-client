"use client";

import React, { use } from "react";
import Link from "next/link";
import { useProducts } from "../../../hooks/useProducts";

const ItemDetails = ({ params }) => {
  const { id } = use(params);
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto" />
        <p className="mt-4 text-zinc-500">Loading item details...</p>
      </div>
    );
  }

  // Find the exact product
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Product Not Found</h2>
        <p className="mt-2 text-zinc-555">The item you are looking for might have been deleted or does not exist.</p>
        <Link
          href="/items"
          className="mt-6 inline-block rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/items"
        className="inline-flex items-center gap-2 text-sm font-semibold text-teal-500 hover:text-teal-600 mb-8 transition-colors"
      >
        <span>←</span> Back to Items
      </Link>

      {/* Main product card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Column: Image */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-100 aspect-video lg:aspect-square shadow-inner">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-4 sm:text-4xl">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 mb-6">
              <span className="text-2xl font-extrabold text-zinc-950 dark:text-white">${product.price}</span>
              <span className="text-zinc-400">|</span>
              <span className="text-sm font-semibold text-teal-500">{product.rating} ⭐ Rating</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-350 leading-relaxed text-base mb-8">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specs || {}).map(([key, val]) => (
                <div key={key} className="bg-zinc-50 border border-zinc-100 p-3.5 rounded-xl dark:bg-zinc-900 dark:border-zinc-800">
                  <span className="block text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{key}</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 mt-1 block">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-50">
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
                  <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1">
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
        </div>
      )}
    </div>
  );
};

export default ItemDetails;