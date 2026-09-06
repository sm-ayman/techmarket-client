"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";

const STATUS_COLORS = {
  pending:   "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30",
  shipped:   "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30",
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const OrdersPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Filters & Pagination
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Bulk Actions
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkActionStatus, setBulkActionStatus] = useState("");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        paginated: 'true',
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'All') params.append('status', filterStatus);
      
      const res = await fetch(`${API_URL}/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      
      // Fallback in case the backend hasn't been restarted and returns the old array format
      if (Array.isArray(data)) {
        setOrders(data);
        setTotalOrders(data.length);
        setTotalPages(1);
      } else {
        setOrders(data.data || []);
        setTotalOrders(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      toast({ type: "error", title: "Fetch Failed", message: "Could not load orders." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Small debounce for search query
      const delay = setTimeout(() => {
        fetchOrders();
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [user, page, limit, startDate, endDate, sortBy, sortOrder, searchQuery, filterStatus]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, sortBy, sortOrder, searchQuery, filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setConfirmModal(null);
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
      toast({
        type: "success",
        title: "Status Updated",
        message: `Order #${orderId} → ${newStatus.toUpperCase()}`,
      });
    } catch (err) {
      console.error(err);
      toast({ type: "error", title: "Update Failed", message: "Could not update order status. Try again." });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkActionStatus || selectedOrders.length === 0) return;
    setIsBulkUpdating(true);
    try {
      const res = await fetch(`${API_URL}/orders/bulk-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrders, status: bulkActionStatus }),
      });
      if (!res.ok) throw new Error("Failed to bulk update status");
      
      setOrders((prev) =>
        prev.map((o) => (selectedOrders.includes(o.orderId) ? { ...o, status: bulkActionStatus } : o))
      );
      
      toast({
        type: "success",
        title: "Bulk Update Successful",
        message: `${selectedOrders.length} orders updated to ${bulkActionStatus.toUpperCase()}`,
      });
      setSelectedOrders([]);
      setBulkActionStatus("");
    } catch (err) {
      console.error(err);
      toast({ type: "error", title: "Bulk Update Failed", message: "Could not update orders." });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const requestStatusChange = (orderId, currentStatus, newStatus) => {
    setConfirmModal({ orderId, currentStatus, newStatus });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Status", "Items", "Total (BDT)"];
    
    const csvContent = [
      headers.join(","),
      ...orders.map(o => {
        const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "";
        const name = `"${o.contact?.name || ''}"`;
        const email = `"${o.contact?.email || ''}"`;
        const itemsCount = o.items?.length || 0;
        return `${o.orderId},${date},${name},${email},${o.status},${itemsCount},${o.total}`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-surface text-ink-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Stats (only current page stats, accurate full stats would require a separate endpoint)
  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="bg-surface text-ink min-h-screen font-sans border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400">
              Orders Dashboard
            </h1>
            <p className="text-ink-3 text-xs mt-1">Manage and process all customer orders in real-time.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-surface-3 text-ink border border-line-strong hover:bg-surface-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              📥 Export CSV
            </button>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 border border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface-2 border border-purple-500/30 p-6 rounded-2xl hover:shadow-[0_0_20px_rgba(176,38,255,0.2)] transition-all">
            <span className="block text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Total Found</span>
            <span className="text-4xl font-black text-ink mt-2 block">
              {loading ? "..." : totalOrders}
            </span>
          </div>
          <div className="bg-surface-2 border border-yellow-500/30 p-6 rounded-2xl hover:border-yellow-500/50 transition-all">
            <span className="block text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">Pending (Page)</span>
            <span className="text-4xl font-black text-yellow-600 dark:text-yellow-400 mt-2 block">
              {loading ? "..." : pendingCount}
            </span>
          </div>
          <div className="bg-surface-2 border border-green-500/30 p-6 rounded-2xl hover:border-green-500/50 transition-all">
            <span className="block text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Revenue (Page)</span>
            <span className="text-4xl font-black text-green-600 dark:text-green-400 mt-2 block">
              {loading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Advanced Filters Bar */}
        <div className="bg-surface-2 border border-line rounded-3xl p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-ink-3 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search ID, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-colors placeholder-ink-3"
              />
            </div>

            {/* Date Range */}
            <div className="flex gap-2 items-center">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-colors"
                title="Start Date"
              />
              <span className="text-ink-3">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 transition-colors"
                title="End Date"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="createdAt">Date</option>
                <option value="total">Amount</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 cursor-pointer capitalize"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          {/* Bulk Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-line-strong mt-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox"
                id="selectAll"
                checked={orders.length > 0 && selectedOrders.length === orders.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-surface-3"
              />
              <label htmlFor="selectAll" className="text-xs font-bold text-ink-2 cursor-pointer">
                Select All
              </label>
            </div>
            
            <div className="h-4 w-px bg-line-strong"></div>
            
            <select
              value={bulkActionStatus}
              onChange={(e) => setBulkActionStatus(e.target.value)}
              className="px-3 py-1.5 bg-surface-3 border border-line-strong text-ink rounded-xl text-xs focus:outline-none focus:border-purple-500 cursor-pointer capitalize"
            >
              <option value="">-- Bulk Status --</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            
            <button
              onClick={handleBulkStatusChange}
              disabled={!bulkActionStatus || selectedOrders.length === 0 || isBulkUpdating}
              className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(176,38,255,0.3)] cursor-pointer"
            >
              {isBulkUpdating ? "Updating..." : `Apply to ${selectedOrders.length}`}
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-surface-2 border border-line rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.2)] p-4 sm:p-5">
          {loading ? (
            <div className="py-20 text-center text-ink-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
              <span>Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-ink-3 border border-dashed border-line-strong rounded-2xl">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-bold">No orders found.</p>
              <p className="text-xs mt-1 text-ink-3">Try adjusting your filters or date range.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className={`bg-surface-2 border rounded-2xl overflow-hidden transition-all ${selectedOrders.includes(order.orderId) ? 'border-purple-500/50 shadow-[0_0_15px_rgba(176,38,255,0.1)]' : 'border-line hover:border-purple-500/30'}`}>
                  
                  {/* Order Row Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
                    {/* Checkbox */}
                    <div className="shrink-0 flex items-center pr-2">
                       <input 
                          type="checkbox"
                          checked={selectedOrders.includes(order.orderId)}
                          onChange={() => handleSelectOrder(order.orderId)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-surface-3 cursor-pointer"
                        />
                    </div>
                    
                    <div 
                      className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div>
                          <span className="font-mono text-purple-600 dark:text-purple-400 font-bold text-sm">#{order.orderId}</span>
                          <div className="text-xs text-ink-3 mt-0.5">
                            {order.contact?.name} · {order.contact?.email}
                          </div>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[order.status] || "bg-surface-3 text-ink-3"}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-black text-ink text-lg">৳{order.total?.toLocaleString()}</span>
                          <div className="text-[10px] text-ink-3 mt-0.5">
                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                            {" · "}
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                          </div>
                        </div>
                        <span className="text-ink-3 text-lg">{expandedOrder === order._id ? "▲" : "▼"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-line p-4 sm:p-6 space-y-5 bg-surface-1">
                      
                      {/* 3-col info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-surface-3 p-4 rounded-xl border border-line">
                          <p className="text-[10px] text-ink-3 uppercase tracking-widest font-bold mb-2">Contact</p>
                          <p className="text-sm text-ink font-bold">{order.contact?.name}</p>
                          <p className="text-xs text-ink-2">{order.contact?.email}</p>
                          <p className="text-xs text-ink-2">{order.contact?.phone}</p>
                        </div>
                        <div className="bg-surface-3 p-4 rounded-xl border border-line">
                          <p className="text-[10px] text-ink-3 uppercase tracking-widest font-bold mb-2">Shipping</p>
                          <p className="text-xs text-ink-2">{order.shipping?.address}</p>
                          <p className="text-xs text-ink-2">{order.shipping?.city}, {order.shipping?.zip}</p>
                        </div>
                        <div className="bg-surface-3 p-4 rounded-xl border border-line">
                          <p className="text-[10px] text-ink-3 uppercase tracking-widest font-bold mb-2">Payment</p>
                          <p className="text-xs text-ink-2 capitalize">{order.payment?.method || order.payment}</p>
                          <p className="text-xs text-ink-3 mt-1">
                            Sub: ৳{order.subtotal?.toFixed(2)} · Tax: ৳{order.tax?.toFixed(2)}
                          </p>
                          <p className="text-sm font-black text-ink mt-1">Total: ৳{order.total?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <p className="text-[10px] text-ink-3 uppercase tracking-widest font-bold mb-3">Order Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-surface-3 rounded-xl p-3 border border-line">
                              {item.image && (
                                <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover border border-line-strong" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-ink truncate">{item.title}</p>
                                <p className="text-xs text-ink-3">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-ink shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-line-strong">
                        <p className="text-xs font-bold text-ink-3 uppercase tracking-widest shrink-0">Update Status:</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              disabled={order.status === s || updatingId === order.orderId}
                              onClick={() => requestStatusChange(order.orderId, order.status, s)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer capitalize ${
                                order.status === s
                                  ? `${STATUS_COLORS[s]} opacity-100`
                                  : "bg-surface-3 border border-line-strong text-ink-3 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 disabled:cursor-not-allowed"
                              }`}
                            >
                              {updatingId === order.orderId && order.status !== s ? "..." : s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-line-strong">
              <div className="text-xs text-ink-3">
                Showing page <span className="font-bold text-ink">{page}</span> of <span className="font-bold text-ink">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 bg-surface-3 border border-line-strong text-ink-2 hover:text-ink hover:bg-surface-4 disabled:opacity-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1.5 bg-surface-3 border border-line-strong text-ink-2 hover:text-ink hover:bg-surface-4 disabled:opacity-50 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Status Confirmation Modal ───────────────────────────── */}
      {confirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-2 border border-purple-500/50 rounded-2xl w-full max-w-sm p-6 shadow-[0_0_40px_rgba(176,38,255,0.3)] animate-in fade-in zoom-in duration-200">
            
            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-full bg-purple-500/10 border border-purple-500/30">
              <span className="text-2xl">⚠️</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-extrabold text-ink text-center mb-1">
              Confirm Status Update
            </h3>
            <p className="text-ink-3 text-xs text-center mb-6">
              Order <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">#{confirmModal.orderId}</span>
            </p>

            {/* Status Change Arrow */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[confirmModal.currentStatus] || "bg-surface-3 text-ink-3"}`}>
                {confirmModal.currentStatus}
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-black text-lg">→</span>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[confirmModal.newStatus] || "bg-surface-3 text-ink-3"}`}>
                {confirmModal.newStatus}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 bg-surface-3 border border-line-strong text-ink-2 hover:text-ink hover:bg-surface-4 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(confirmModal.orderId, confirmModal.newStatus)}
                disabled={updatingId === confirmModal.orderId}
                className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(176,38,255,0.4)] cursor-pointer uppercase tracking-wider"
              >
                {updatingId === confirmModal.orderId ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
