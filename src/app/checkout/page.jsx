"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    payment: "card",
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(() =>
    "TM" + Math.random().toString(36).substring(2, 9).toUpperCase()
  );

  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        contact: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          address: form.address,
          city: form.city,
          zip: form.zip,
        },
        payment: form.payment,
        items: cartItems.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: cartTotal,
        tax: tax,
        total: grandTotal,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Failed to place order");

      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Order Success Screen ──────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#020202] border-t border-zinc-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Animated checkmark */}
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,243,255,0.5)] animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl">✓</div>
          </div>

          <h1 className="text-3xl font-extrabold text-white neon-text-cyan mb-3">
            Order Confirmed!
          </h1>
          <p className="text-zinc-400 mb-2">
            Thank you, <span className="text-white font-bold">{form.name || "Customer"}</span>!
          </p>
          <p className="text-zinc-500 text-sm mb-6">
            Your order has been placed and is being processed.
          </p>

          <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-5 mb-8 text-left shadow-[0_0_20px_rgba(0,243,255,0.08)]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Order ID</span>
              <span className="font-mono font-bold text-cyan-400">#{orderId}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Amount Paid</span>
              <span className="font-mono font-bold text-white">৳{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Est. Delivery</span>
              <span className="font-bold text-white">3–5 Business Days</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all uppercase tracking-wider"
            >
              Back to Home
            </Link>
            <Link
              href="/items"
              className="rounded-xl border border-zinc-700 hover:border-cyan-500/50 px-6 py-3 text-sm font-black text-white hover:text-cyan-400 transition-all uppercase tracking-wider"
            >
              Shop More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center px-4 border-t border-zinc-900">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Nothing to Checkout</h1>
          <p className="text-zinc-400 mb-8">Add products to your cart first.</p>
          <Link
            href="/items"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 text-sm font-black text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all uppercase tracking-wider"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  // ── Checkout Form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020202] border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white neon-text-cyan">Checkout</h1>
          <p className="mt-1 text-zinc-400 text-sm">
            Fill in your details below to complete your purchase.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="text-cyan-400">01</span> Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,243,255,0.3)] transition-all placeholder-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,243,255,0.3)] transition-all placeholder-zinc-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+880 1X XX XXX XXX"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,243,255,0.3)] transition-all placeholder-zinc-600"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="text-pink-400">02</span> Shipping Address
                </h2>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Street Address</label>
                  <input
                    name="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Tech Street, Apt 4B"
                    className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:shadow-[0_0_8px_rgba(255,0,255,0.2)] transition-all placeholder-zinc-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">City</label>
                    <input
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Dhaka"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:shadow-[0_0_8px_rgba(255,0,255,0.2)] transition-all placeholder-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">ZIP / Postal Code</label>
                    <input
                      name="zip"
                      type="text"
                      required
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="1207"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:shadow-[0_0_8px_rgba(255,0,255,0.2)] transition-all placeholder-zinc-600"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="text-purple-400">03</span> Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "card", label: "Credit / Debit Card", icon: "💳" },
                    { value: "bkash", label: "bKash", icon: "📱" },
                    { value: "cod", label: "Cash on Delivery", icon: "💵" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.payment === method.value
                          ? "border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(176,38,255,0.2)]"
                          : "border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={form.payment === method.value}
                        onChange={handleChange}
                        className="accent-purple-500"
                      />
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-xs font-bold text-white">{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Card details placeholder */}
                {form.payment === "card" && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all placeholder-zinc-600"
                      maxLength={19}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all placeholder-zinc-600"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all placeholder-zinc-600"
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}
                {form.payment === "bkash" && (
                  <div className="mt-4">
                    <input
                      type="tel"
                      placeholder="bKash number: 01X-XXXXXXXX"
                      className="w-full px-4 py-3 bg-[#050505] border border-zinc-700 text-white rounded-xl text-sm focus:outline-none focus:border-purple-400 transition-all placeholder-zinc-600"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,243,255,0.08)] sticky top-24 space-y-5">
                <h2 className="font-bold text-lg text-white neon-text-cyan">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 flex-shrink-0 bg-[#050505] border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-white">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">৳{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-cyan-400 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Tax (10%)</span>
                    <span className="font-mono text-white">৳{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                  <span className="font-black text-white">Grand Total</span>
                  <span className="font-mono font-black text-xl text-white neon-text-cyan">
                    ৳{grandTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-pink-500 hover:bg-pink-400 disabled:opacity-60 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.8)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order →"
                  )}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-xs font-bold text-zinc-500 hover:text-cyan-400 transition-colors"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
