"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";
import { useProducts } from "../../../hooks/useProducts";
import { ToastContext } from "../../../context/ToastContext";
import ConfirmModal from "../../../components/ConfirmModal";

const ManageItems = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { products, loading: productsLoading, deleteProduct, updateProduct, categories, fetchCategories, addCategory, deleteCategory } = useProducts();
  const { toast } = useContext(ToastContext);
  const router = useRouter();

  // Selected filter states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editSpecsList, setEditSpecsList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [inTransitCount, setInTransitCount] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState(null); // product to delete
  const [confirmSave, setConfirmSave] = useState(false);    // save changes confirm

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, fetchCategories]);

  useEffect(() => {
    if (editingProduct) {
      setEditImages([]);
      setEditImagePreviews(editingProduct.images || (editingProduct.image ? [editingProduct.image] : []));
      const specs = editingProduct.specs || {};
      const initialSpecs = Object.entries(specs).map(([key, value]) => ({ key, value }));
      setEditSpecsList(initialSpecs);
    }
  }, [editingProduct]);

  useEffect(() => {
    const fetchInTransit = async () => {
      try {
        const res = await fetch(`${API_URL}/orders`);
        if (!res.ok) return;
        const orders = await res.json();
        
        let transitCount = 0;
        orders.forEach(order => {
          if (order.status === "shipped") {
            order.items?.forEach(item => {
              transitCount += item.quantity || 1;
            });
          }
        });
        setInTransitCount(transitCount);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchInTransit();
    }
  }, [user]);

  const handleAddEditSpec = () => setEditSpecsList([...editSpecsList, { key: "", value: "" }]);
  const handleRemoveEditSpec = (index) => setEditSpecsList(editSpecsList.filter((_, i) => i !== index));
  const handleEditSpecChange = (index, field, val) => {
    const newSpecs = [...editSpecsList];
    newSpecs[index][field] = val;
    setEditSpecsList(newSpecs);
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setEditImagePreviews(previews);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    let uploadedUrls = editingProduct.images || [];

    if (editImages.length > 0) {
      uploadedUrls = [];
      try {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "c6b66c9f85a5aaf4843cc838735bd9c2";
        for (const file of editImages) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.success) {
            uploadedUrls.push(data.data.url);
          }
        }
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }

    const finalImage = uploadedUrls.length > 0 ? uploadedUrls[0] : editingProduct.image;

    const specsObj = {};
    editSpecsList.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    try {
      await updateProduct(editingProduct.id, {
        title: editingProduct.title,
        price: editingProduct.price,
        category: editingProduct.category,
        isFeatured: editingProduct.isFeatured || false,
        stock: editingProduct.stock !== undefined ? editingProduct.stock : getStockInfo(editingProduct).units,
        image: finalImage,
        images: uploadedUrls,
        specs: specsObj
      });
      toast({ type: "success", title: "Product Updated", message: `"${editingProduct.title}" has been saved successfully.` });
    } catch {
      toast({ type: "error", title: "Update Failed", message: "Could not save product changes. Try again." });
    }
    
    setIsSaving(false);
    setEditingProduct(null);
  };

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-surface text-ink-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Sidebar Filter categories (dynamic from DB + any product categories)
  const productCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.slug, c])).values()
  );
  const allCategoryNames = [...new Set([...uniqueCategories.map((c) => c.name), ...productCategories])];
  const filterCategories = ["All", ...allCategoryNames];

  // Category management handlers
  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    try {
      await addCategory(name);
      toast({ type: "success", title: "Category Created", message: `"${name}" has been added.` });
      setNewCategory("");
      setSelectedCategoryFilter(name);
    } catch {
      toast({ type: "error", title: "Create Failed", message: "Could not create category. It may already exist." });
    }
  };

  const handleDeleteCategory = async (slug, name) => {
    try {
      await deleteCategory(slug);
      toast({ type: "warning", title: "Category Deleted", message: `"${name}" removed from inventory.` });
      if (selectedCategoryFilter === name) setSelectedCategoryFilter("All");
    } catch {
      toast({ type: "error", title: "Delete Failed", message: "Could not delete category." });
    }
  };

  // Apply filters
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryFilter === "All" || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase() || (selectedCategoryFilter === "Phones" && p.category === "Phones");
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Mock or Real stock numbers for preview
  const getStockInfo = (p) => {
    const units = p.stock !== undefined ? p.stock : ((p.title.length * 7) % 120 + 3);
    const progress = Math.min(100, Math.max(5, (units / 120) * 100));
    const isLow = units < 15;
    return { units, progress, isLow };
  };

  // Stats
  const totalItems = products.length;
  const lowStockCount = products.filter((p) => getStockInfo(p).isLow).length;

  // Category badges color mapping
  const badgeColor = (cat) => {
    switch (cat.toLowerCase()) {
      case "phones":
      case "smartphones":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20";
      case "laptops":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
      case "audio":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20";
      case "gaming":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      default:
        return "bg-surface-3 text-ink-2 border border-line-strong";
    }
  };

  const handleExportCSV = () => {
    const rows = products.length > 0 ? products : [];
    if (rows.length === 0) return;

    const escape = (value) => {
      const str = value == null ? "" : String(value);
      if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = [
      "Product Name", "Category", "Price (BDT)",
      "Stock", "Image URL", "Specification",
    ];

    const csvRows = rows.map((p) => {
      const stockInfo = getStockInfo(p);
      const specs = p.specs || {};
      const specEntries = Object.entries(specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ");
      const imageUrl = p.image || "";
      return [
        escape(p.title),
        escape(p.category),
        escape(p.price),
        escape(stockInfo.units),
        escape(imageUrl),
        escape(specEntries),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface text-ink min-h-screen font-sans border-t border-line">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-72 bg-surface-2 border-b lg:border-b-0 lg:border-r border-line p-4 lg:p-8 flex flex-col justify-between shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
          <div className="space-y-4 lg:space-y-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-ink">Filters</h2>
              <p className="text-xs text-ink-3 mt-1">Refine your tech inventory views.</p>
            </div>

            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              {filterCategories.map((cat) => {
                const isActive = selectedCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`flex items-center shrink-0 lg:w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                        : "text-ink-3 hover:bg-surface-3 hover:text-ink border border-transparent"
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

            {/* Manage Categories */}
            <div className="pt-6 border-t border-line">
              <h3 className="text-xs font-bold text-ink-3 uppercase tracking-widest mb-3">Manage Categories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {uniqueCategories.map((c) => (
                  <span key={c.slug} className="inline-flex items-center gap-1.5 rounded-full bg-surface-3 border border-line px-2.5 py-1 text-xs font-bold text-ink-2">
                    {c.name}
                    <button
                      onClick={() => handleDeleteCategory(c.slug, c.name)}
                      title={`Delete "${c.name}"`}
                      className="text-ink-3 hover:text-pink-500 transition-colors text-xs leading-none"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="New category name"
                  className="flex-1 min-w-0 px-3 py-2 bg-surface-3 border border-cyan-500/30 text-ink rounded-xl text-xs focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 placeholder-ink-3 transition-colors"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Dashboard Area */}
        <main className="flex-1 p-4 lg:p-12 space-y-6 lg:space-y-10 w-full overflow-hidden">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-cyan-600 dark:text-cyan-400">Manage Inventory</h1>
              <p className="text-ink-3 text-xs mt-1">
                Track and control your high-performance hardware stocks.
              </p>
            </div>
            <Link
              href="/items/add"
              className="px-5 py-3 bg-pink-500 hover:bg-pink-400 text-white font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer uppercase tracking-widest"
            >
              ➕ Add New Product
            </Link>
          </div>

          {/* Stats Grid Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-surface-2 border border-cyan-500/30 p-6 rounded-2xl hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all">
              <span className="block text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">TOTAL ITEMS</span>
              <span className="text-4xl font-black text-ink mt-2 block">
                {productsLoading ? "..." : totalItems.toLocaleString()}
              </span>
            </div>
            <div className="bg-surface-2 border border-pink-500/30 p-6 rounded-2xl hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all">
              <span className="block text-[10px] font-bold text-pink-500 uppercase tracking-widest">LOW STOCK</span>
              <span className="text-4xl font-black text-pink-600 dark:text-pink-400 mt-2 block">
                {productsLoading ? "..." : lowStockCount}
              </span>
            </div>
            <div className="bg-surface-2 border border-purple-500/30 p-6 rounded-2xl hover:shadow-[0_0_20px_rgba(176,38,255,0.2)] transition-all">
              <span className="block text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">IN TRANSIT</span>
              <span className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-2 block">
                {productsLoading ? "..." : inTransitCount}
              </span>
            </div>
          </div>

          {/* Inventory Table Container */}
          <div className="bg-surface-2 border border-line rounded-3xl overflow-hidden p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
            
            {/* Table Search Actions */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-ink-3 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search inventory by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-3 border border-cyan-500/30 text-ink rounded-xl text-xs focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors placeholder-ink-3"
                />
              </div>
              <div className="flex gap-2.5">
                <button className="px-4 py-2.5 bg-surface-3 border border-line text-ink-3 rounded-xl text-xs font-bold hover:text-ink transition-colors cursor-pointer">
                  🎛️ Columns
                </button>
                <button onClick={handleExportCSV} disabled={productsLoading || products.length === 0} className="px-4 py-2.5 bg-surface-3 border border-line text-ink-3 rounded-xl text-xs font-bold hover:text-ink transition-colors cursor-pointer">
                  📤 Export
                </button>
              </div>
            </div>

            {/* Main Table */}
            {productsLoading ? (
              <div className="py-20 text-center text-ink-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
                <span>Loading catalog items...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-ink-3 border border-dashed border-line-strong rounded-2xl">
                <span>No products matching your search criteria.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-line text-[10px] font-bold text-ink-3 uppercase tracking-widest">
                      <th className="pb-4 pt-2">PRODUCT NAME</th>
                      <th className="pb-4 pt-2">CATEGORY</th>
                      <th className="pb-4 pt-2">PRICE</th>
                      <th className="pb-4 pt-2">STOCK</th>
                      <th className="pb-4 pt-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm">
                    {filteredProducts.map((p) => {
                      const sku = `TM-${p.id.toUpperCase().slice(0, 8)}`;
                      const { units, progress, isLow } = getStockInfo(p);

                      return (
                        <tr key={p.id} className="hover:bg-surface-4 transition-all">
                          {/* Name */}
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-12 w-12 rounded-xl object-cover bg-surface-3 border border-line"
                              />
                              <div>
                                <span className="font-bold text-ink block">{p.title}</span>
                                <span className="text-[10px] text-ink-3 block mt-0.5">SKU: {sku}</span>
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
                          <td className="py-4 font-mono text-ink font-bold tracking-tight">
                            ৳{p.price.toLocaleString()}.00
                          </td>

                          {/* Stock progress bar */}
                          <td className="py-4">
                            <div className="max-w-[120px]">
                              <span className={`text-xs font-bold block ${isLow ? "text-orange-600 dark:text-orange-400" : "text-ink"}`}>
                                {units} Units
                              </span>
                              <div className="w-full bg-surface-3 h-1 rounded-full mt-2 overflow-hidden">
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
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="px-3 py-1.5 bg-transparent border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-black text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setConfirmDelete(p)}
                                className="px-3 py-1.5 bg-transparent border border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line text-xs text-ink-3">
              <div>
                Showing 1 to {filteredProducts.length} of {filteredProducts.length} results
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 border border-line-strong bg-surface-3 rounded-xl hover:text-ink transition-colors cursor-pointer">◀</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-purple-500 text-white font-bold shadow-md shadow-purple-500/10">1</button>
                <button className="p-2 border border-line-strong bg-surface-3 rounded-xl hover:text-ink transition-colors cursor-pointer">▶</button>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-surface-2 border border-pink-500/50 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-[0_0_30px_rgba(255,0,255,0.2)] my-auto max-h-[90vh] flex flex-col">
            <h3 className="text-xl font-bold text-ink mb-4 shrink-0">Edit Product</h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" 
                  value={editingProduct.title} 
                  onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-3 border border-pink-500/30 text-ink rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Price (৳)</label>
                <input 
                  type="number" 
                  value={editingProduct.price} 
                  onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-surface-3 border border-pink-500/30 text-ink rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-3 border border-pink-500/30 text-ink rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all"
                >
                  {allCategoryNames.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Stock Units</label>
                <input 
                  type="number" 
                  value={editingProduct.stock !== undefined ? editingProduct.stock : getStockInfo(editingProduct).units} 
                  onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                  className="w-full px-4 py-2 bg-surface-3 border border-pink-500/30 text-ink rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
              <div className="flex items-center pt-2">
                <input
                  id="editIsFeatured"
                  type="checkbox"
                  checked={editingProduct.isFeatured || false}
                  onChange={(e) => setEditingProduct({...editingProduct, isFeatured: e.target.checked})}
                  className="h-4 w-4 rounded border-line-strong bg-surface-3 text-pink-500 focus:ring-pink-500"
                />
                <label htmlFor="editIsFeatured" className="ml-2 block text-sm font-medium text-ink-2">
                  Featured Product
                </label>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Update Images (Optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-4 py-2 bg-surface-3 border border-pink-500/30 text-ink rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-500/20 file:text-pink-600 dark:file:text-pink-400 hover:file:bg-pink-500/30"
                />
                {editImagePreviews.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {editImagePreviews.map((src, idx) => (
                      <img key={idx} src={src} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-pink-500/30" />
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-pink-500/20 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider">Specifications</label>
                  <button
                    type="button"
                    onClick={handleAddEditSpec}
                    className="text-[10px] font-bold text-pink-500 dark:text-pink-400 bg-pink-500/10 px-2 py-1 rounded hover:bg-pink-500/20 transition-colors"
                  >
                    + Add Spec
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {editSpecsList.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Key"
                        value={spec.key}
                        onChange={(e) => handleEditSpecChange(index, "key", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-surface-3 border border-pink-500/30 text-ink rounded-lg text-xs focus:outline-none focus:border-pink-500 transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => handleEditSpecChange(index, "value", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-surface-3 border border-pink-500/30 text-ink rounded-lg text-xs focus:outline-none focus:border-pink-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditSpec(index)}
                        className="text-ink-3 hover:text-red-500 transition-colors text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {editSpecsList.length === 0 && <p className="text-[10px] text-ink-3">No specifications.</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-surface-3 border border-line hover:bg-surface-4 text-ink-2 text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setConfirmSave(true)}
                disabled={isSaving}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────── */}
      <ConfirmModal
        isOpen={!!confirmDelete}
        variant="danger"
        icon="🗑️"
        title="Delete Product?"
        message={`"${confirmDelete?.title}" will be permanently removed from the inventory. This cannot be undone.`}
        detail={`ID: ${confirmDelete?.id || "—"}`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          const p = confirmDelete;
          setConfirmDelete(null);
          try {
            await deleteProduct(p.id);
            toast({ type: "warning", title: "Product Deleted", message: `"${p.title}" has been removed from inventory.` });
          } catch {
            toast({ type: "error", title: "Delete Failed", message: "Could not delete product. Please try again." });
          }
        }}
      />

      {/* ── Save Changes Confirmation Modal ───────────────── */}
      <ConfirmModal
        isOpen={confirmSave}
        variant="warning"
        icon="💾"
        title="Save Changes?"
        message={`You are about to update "${editingProduct?.title}". This will overwrite the existing product data.`}
        detail={`Category: ${editingProduct?.category} · Price: $${editingProduct?.price}`}
        confirmLabel="Save Now"
        cancelLabel="Go Back"
        onCancel={() => setConfirmSave(false)}
        onConfirm={() => {
          setConfirmSave(false);
          handleSaveChanges();
        }}
      />
    </div>
  );
};

export default ManageItems;
