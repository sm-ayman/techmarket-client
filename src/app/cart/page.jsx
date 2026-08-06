"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartContext } from "../../context/CartContext";

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 border-t border-line">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-3xl font-extrabold text-ink mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-ink-2 mb-8">
            Looks like you haven&apos;t added anything yet. Browse our catalog and find something you&apos;ll love.
          </p>
          <Link
            href="/items"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-8 py-3.5 text-sm font-black text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)] transition-all uppercase tracking-wider"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-ink">
              Your Cart
            </h1>
            <p className="mt-1 text-ink-2 text-sm">
              {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-pink-500 hover:text-pink-400 border border-pink-500/30 hover:border-pink-500/60 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-surface-2 border border-line rounded-2xl p-4 hover:border-cyan-500/30 transition-all group"
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-surface-4 rounded-xl overflow-hidden border border-line flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink text-sm leading-tight line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="inline-block mt-1 text-[10px] font-black text-pink-600 dark:text-pink-400 border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>

                  <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                    {/* Qty control */}
                    <div className="flex items-center gap-2 bg-surface-3 border border-line-strong rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-ink-2 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all font-bold text-lg cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-ink font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-ink-2 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all font-bold text-lg cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="font-mono font-black text-ink text-base">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-ink-3 hover:text-pink-500 transition-colors cursor-pointer p-1.5 hover:bg-pink-500/10 rounded-lg"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-2 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,243,255,0.08)] sticky top-24 space-y-5">
              <h2 className="font-bold text-lg text-ink">Order Summary</h2>

              <div className="space-y-3 text-sm border-b border-line pb-5">
                <div className="flex justify-between text-ink-2">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-mono text-ink">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-2">
                  <span>Shipping</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-ink-2">
                  <span>Tax (10%)</span>
                  <span className="font-mono text-ink">৳{(cartTotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-black text-ink">Total</span>
                <span className="font-mono font-black text-xl text-ink">
                  ৳{(cartTotal * 1.1).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)] cursor-pointer"
              >
                Proceed to Checkout →
              </button>

              <Link
                href="/items"
                className="block text-center text-xs font-bold text-ink-3 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mt-2"
              >
                ← Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="border-t border-line pt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: "🔒", label: "Secure" },
                  { icon: "🚀", label: "Fast Ship" },
                  { icon: "🛡️", label: "Warranty" },
                ].map((b) => (
                  <div key={b.label} className="text-[10px] text-ink-3 flex flex-col items-center gap-1">
                    <span className="text-base">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
