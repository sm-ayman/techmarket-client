"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import { useProducts } from "../../../hooks/useProducts";

const AddItem = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { addProduct } = useProducts();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Phones");
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Protected route check
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newProduct = {
      title,
      shortDescription: shortDesc,
      description: fullDesc,
      price: Number(price),
      category,
      image: imageUrl || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      specs: {
        "Category": category,
        "Warranty": "1 Year Brand Warranty",
        "Availability": "In Stock"
      }
    };

    try {
      // Simulate slight network lag for better UX loading indicator
      await new Promise((resolve) => setTimeout(resolve, 800));
      addProduct(newProduct);
      setSuccess(true);
      // Reset form
      setTitle("");
      setShortDesc("");
      setFullDesc("");
      setPrice("");
      setImageUrl("");

      // Automatically hide success notification after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Add New Tech Product
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Publish a new hardware gadget to the public catalog list.
          </p>
        </div>

        {success && (
          <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 text-sm text-teal-800 dark:bg-teal-950/30 dark:border-teal-900 dark:text-teal-400 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span><strong>Success!</strong> Product has been added to the store catalog.</span>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="text-xs font-bold uppercase tracking-wider text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 16 Pro Max"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Price (USD)
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 999"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Phones">Phones</option>
                <option value="Laptops">Laptops</option>
                <option value="Audio">Audio</option>
                <option value="Tablets">Tablets</option>
                <option value="Wearables">Wearables</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or leave blank for placeholder"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Short Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Short Summary (1-2 lines)
              </label>
              <input
                type="text"
                required
                maxLength="120"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief tag line summarizing the product spec."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Full Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Full Specs Description
              </label>
              <textarea
                rows="5"
                required
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                placeholder="Provide a deep dive breakdown of product specifications, build quality, compatibility, etc."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors resize-y"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white hover:bg-teal-600 shadow-md shadow-teal-500/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Submit Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
