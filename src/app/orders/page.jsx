"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

const STATUS_COLORS = {
  pending:   "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  shipped:   "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
  delivered: "bg-green-500/10 text-green-400 border border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const OrdersPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
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
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-zinc-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Verifying access...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
    const matchesSearch =
      o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-purple-400 neon-text-purple">
              Orders Dashboard
            </h1>
            <p className="text-zinc-500 text-xs mt-1">Manage and process all customer orders in real-time.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            🔄 Refresh Orders
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-purple-500/30 p-6 rounded-2xl hover:neon-glow-purple transition-all">
            <span className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest">Total Orders</span>
            <span className="text-4xl font-black text-white mt-2 block neon-text-purple">
              {loading ? "..." : orders.length}
            </span>
          </div>
          <div className="bg-[#0a0a0a] border border-yellow-500/30 p-6 rounded-2xl hover:border-yellow-400/50 transition-all">
            <span className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Pending</span>
            <span className="text-4xl font-black text-yellow-400 mt-2 block">
              {loading ? "..." : pendingCount}
            </span>
          </div>
          <div className="bg-[#0a0a0a] border border-green-500/30 p-6 rounded-2xl hover:border-green-400/50 transition-all">
            <span className="block text-[10px] font-bold text-green-500 uppercase tracking-widest">Total Revenue</span>
            <span className="text-4xl font-black text-green-400 mt-2 block">
              {loading ? "..." : `৳${totalRevenue.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Filters + Table */}
        <div className="bg-[#020202] border border-zinc-800 rounded-3xl overflow-hidden p-6 space-y-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-500 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by Order ID, name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-purple-500/30 text-white rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-colors placeholder-zinc-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    filterStatus === s
                      ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                      : "bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="py-20 text-center text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
              <span>Loading orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-bold">No orders found.</p>
              <p className="text-xs mt-1 text-zinc-600">Orders will appear here once customers checkout.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all">
                  
                  {/* Order Row Header */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div>
                        <span className="font-mono text-purple-400 font-bold text-sm">#{order.orderId}</span>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {order.contact?.name} · {order.contact?.email}
                        </div>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[order.status] || "bg-zinc-800 text-zinc-400"}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-black text-white text-lg">৳{order.total?.toLocaleString()}</span>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                          {" · "}
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                        </div>
                      </div>
                      <span className="text-zinc-500 text-lg">{expandedOrder === order._id ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-zinc-800 p-4 sm:p-6 space-y-5">
                      
                      {/* 3-col info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Contact</p>
                          <p className="text-sm text-white font-bold">{order.contact?.name}</p>
                          <p className="text-xs text-zinc-400">{order.contact?.email}</p>
                          <p className="text-xs text-zinc-400">{order.contact?.phone}</p>
                        </div>
                        <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Shipping</p>
                          <p className="text-xs text-zinc-300">{order.shipping?.address}</p>
                          <p className="text-xs text-zinc-300">{order.shipping?.city}, {order.shipping?.zip}</p>
                        </div>
                        <div className="bg-[#050505] p-4 rounded-xl border border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Payment</p>
                          <p className="text-xs text-zinc-300 capitalize">{order.payment?.method || order.payment}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Sub: ৳{order.subtotal?.toFixed(2)} · Tax: ৳{order.tax?.toFixed(2)}
                          </p>
                          <p className="text-sm font-black text-white mt-1">Total: ৳{order.total?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Order Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-[#050505] rounded-xl p-3 border border-zinc-800/50">
                              {item.image && (
                                <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover border border-zinc-700" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-zinc-200 shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-zinc-800/50">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest shrink-0">Update Status:</p>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              disabled={order.status === s || updatingId === order.orderId}
                              onClick={() => handleStatusChange(order.orderId, s)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer capitalize ${
                                order.status === s
                                  ? `${STATUS_COLORS[s]} opacity-100`
                                  : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-purple-500/50 hover:text-purple-300 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
