"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

const STATUS_COLORS = {
  pending:   "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30",
  shipped:   "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30",
};

const STATUS_ICONS = {
  pending:   "⏳",
  confirmed: "✅",
  shipped:   "🚚",
  delivered: "📦",
  cancelled: "❌",
};

export default function ProfilePage() {
  const { user, loading: authLoading, logoutUser } = useContext(AuthContext);
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user, API_URL]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-surface text-ink-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto" />
          <p className="mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "confirmed" || o.status === "shipped").length;

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email.charAt(0).toUpperCase();

  return (
    <div className="bg-surface text-ink min-h-screen font-sans border-t border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Profile Hero */}
        <div className="bg-surface-2 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-[0_0_30px_rgba(0,243,255,0.08)]">
          <div className="flex-shrink-0 h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="h-20 w-20 rounded-2xl object-cover" />
            ) : initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              {user.displayName || "My Account"}
            </h1>
            <p className="text-ink-2 text-sm mt-1">{user.email}</p>
            <p className="text-ink-3 text-xs mt-2">Member since {new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          </div>
          <button
            onClick={async () => { await logoutUser(); router.push("/"); }}
            className="px-4 py-2 border border-pink-500/50 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            🚪 Sign Out
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-2 border border-cyan-500/30 rounded-2xl p-5 text-center hover:border-cyan-500/40 transition-all">
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block">Total Orders</span>
            <span className="text-4xl font-black text-ink mt-2 block">
              {ordersLoading ? "..." : orders.length}
            </span>
          </div>
          <div className="bg-surface-2 border border-green-500/30 rounded-2xl p-5 text-center hover:border-green-500/40 transition-all">
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest block">Total Spent</span>
            <span className="text-4xl font-black text-green-600 dark:text-green-400 mt-2 block">
              {ordersLoading ? "..." : `৳${totalSpent.toLocaleString()}`}
            </span>
          </div>
          <div className="bg-surface-2 border border-yellow-500/30 rounded-2xl p-5 text-center hover:border-yellow-500/40 transition-all">
            <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest block">Active Orders</span>
            <span className="text-4xl font-black text-yellow-600 dark:text-yellow-400 mt-2 block">
              {ordersLoading ? "..." : pendingCount}
            </span>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Order History</h2>
            <Link
              href="/items"
              className="text-xs font-bold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-xl hover:bg-cyan-500/10 transition-all"
            >
              🛍️ Shop More
            </Link>
          </div>

          {ordersLoading ? (
            <div className="py-16 text-center text-ink-3 bg-surface-2 border border-line rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4" />
              <span>Fetching your orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-line rounded-2xl bg-surface-2">
              <p className="text-5xl mb-4">🛒</p>
              <p className="font-bold text-ink">No orders yet!</p>
              <p className="text-xs text-ink-3 mt-1 mb-6">You haven't placed any orders. Start shopping now.</p>
              <Link
                href="/items"
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-surface-2 border border-line rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all">

                  {/* Order Header */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{STATUS_ICONS[order.status] || "📦"}</span>
                      <div>
                        <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold text-sm">#{order.orderId}</span>
                        <p className="text-[10px] text-ink-3 mt-0.5">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          {" · "}
                          {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider capitalize ${STATUS_COLORS[order.status] || "bg-surface-3 text-ink-3"}`}>
                        {order.status}
                      </span>
                      <span className="font-black text-ink text-lg">৳{order.total?.toLocaleString()}</span>
                      <span className="text-ink-3">{expandedOrder === order._id ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-line p-4 sm:p-6 space-y-4">

                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-surface-3 rounded-xl p-3 border border-line">
                            {item.image && (
                              <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg object-cover border border-line-strong shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-ink truncate">{item.title}</p>
                              <p className="text-xs text-ink-3">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-bold text-ink-2 shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      {/* Shipping + Payment Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface-3 p-4 rounded-xl border border-line">
                          <p className="text-[10px] text-ink-3 uppercase tracking-widest font-bold mb-2">Delivery Address</p>
                          <p className="text-sm text-ink-2">{order.shipping?.address}</p>
                          <p className="text-sm text-ink-2">{order.shipping?.city}, {order.shipping?.zip}</p>
                        </div>
                        <div className="bg-surface-3 p-4 rounded-xl border border-line">
                          <p className="text-[10px] text-ink-3 uppercase tracking-widest font-bold mb-2">Order Summary</p>
                          <div className="flex justify-between text-xs text-ink-3">
                            <span>Subtotal</span><span>৳{order.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-ink-3 mt-1">
                            <span>Tax</span><span>৳{order.tax?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-black text-ink mt-2 pt-2 border-t border-line">
                            <span>Total</span><span>৳{order.total?.toLocaleString()}</span>
                          </div>
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
}
