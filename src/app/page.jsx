"use client";

import React from "react";
import Link from "next/link";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { products, loading } = useProducts();

  // Get first 3 products for featured section
  const featuredProducts = products.slice(0, 3);
  // Get next 8 products for more products section
  const moreProducts = products.slice(3, 11);

  const categories = [
    { name: "Phones", icon: "📱", count: "12+ Items" },
    { name: "Laptops", icon: "💻", count: "8+ Items" },
    { name: "Audio", icon: "🎧", count: "15+ Items" },
    { name: "Tablets", icon: "📟", count: "6+ Items" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-[#020202]">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&auto=format&fit=crop&q=80"
            alt="Neon Tech Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-black/80 to-[#050505]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.cyan.600),transparent)] opacity-30 mix-blend-screen" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 mb-6 backdrop-blur-md neon-glow-cyan">
            🚀 NEON OVERDRIVE ACTIVATED
          </div>
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Welcome to the Future of <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent neon-text-cyan">High-Tech Hardware</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Discover a handpicked collection of high-performance smartphones, powerful workstations, immersive sound gear, and cutting-edge tech accessories.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/items"
              className="rounded-xl bg-transparent border-2 border-cyan-400 px-6 py-3.5 text-sm font-black text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)] transition-all hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
            >
              Enter Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-bold leading-6 text-pink-400 hover:text-pink-300 hover:neon-text-pink transition-all uppercase tracking-wider"
            >
              Learn More <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Categories Grid Section */}
      <section className="py-20 bg-[#050505] transition-colors border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl neon-text-purple">
              Explore Popular Categories
            </h2>
            <p className="mt-4 text-zinc-400">
              Find exactly what you need with our carefully categorized inventory of devices and components.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/items?category=${cat.name}`}
                className="group relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-zinc-800 p-6 shadow-sm hover:neon-glow-purple transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{cat.icon}</div>
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {cat.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="py-20 bg-[#020202] border-t border-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white neon-text-cyan">
                Featured Highlights
              </h2>
              <p className="mt-2 text-zinc-400">
                Top picks from our community, renowned for quality and peak performance.
              </p>
            </div>
            <Link
              href="/items"
              className="mt-4 md:mt-0 font-bold text-cyan-400 hover:text-cyan-300 hover:neon-text-cyan transition-colors text-sm flex items-center gap-1 uppercase tracking-wider"
            >
              View All Products <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] transition-all hover:neon-glow-cyan hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#050505]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <span className="absolute top-3 right-3 rounded-full border border-pink-500 bg-pink-500/20 px-2.5 py-1 text-[10px] font-black text-pink-400 tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)]">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-800/80">
                      <span className="font-mono font-bold text-xl text-white">
                        ৳{p.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-transparent border border-pink-500 p-2 text-pink-400 hover:bg-pink-500 hover:text-white transition-all cursor-pointer shadow-[0_0_5px_rgba(255,0,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]" title="Add to Cart">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                        <Link
                          href={`/items/${p.id}`}
                          className="rounded-lg bg-cyan-500 px-4 py-2 text-[10px] font-black tracking-widest text-black hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.4)] hover:shadow-[0_0_20px_rgba(0,243,255,0.8)] uppercase"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4.5 More Products Section */}
      <section className="py-20 bg-[#050505] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white neon-text-purple">
                More Products to Explore
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Discover more of our highly rated gadgets and accessories.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {moreProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] transition-all hover:neon-glow-purple hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#020202]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <span className="absolute top-2 right-2 rounded-full border border-purple-500 bg-purple-500/20 px-2 py-0.5 text-[10px] font-black text-purple-400 uppercase tracking-wider shadow-[0_0_10px_rgba(176,38,255,0.3)]">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {p.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/80 mt-4">
                      <span className="font-mono font-bold text-lg text-white">
                        ৳{p.price}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button className="rounded-lg bg-transparent border border-cyan-500 p-1.5 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer shadow-[0_0_5px_rgba(0,243,255,0.2)] hover:shadow-[0_0_15px_rgba(0,243,255,0.6)]" title="Add to Cart">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                        <Link
                          href={`/items/${p.id}`}
                          className="rounded-lg bg-purple-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-purple-500 transition-all cursor-pointer shadow-[0_0_10px_rgba(176,38,255,0.4)] hover:shadow-[0_0_20px_rgba(176,38,255,0.8)] uppercase tracking-wider"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show More Button */}
          <div className="flex justify-center mt-4">
            <Link
              href="/items"
              className="rounded-xl border border-purple-500 bg-transparent px-8 py-3.5 text-sm font-black text-purple-400 hover:bg-purple-500 hover:text-white shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)] transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              Show More <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Special Promo Banner Section */}
      <section className="py-16 bg-[#020202] border-t border-b border-cyan-500/30 text-white relative overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.1)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.cyan.900),transparent)] opacity-40 mix-blend-screen" />
        <div className="absolute top-0 right-0 h-[200px] w-[200px] bg-pink-500/20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[200px] bg-purple-500/20 blur-[80px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="max-w-2xl text-center md:text-left">
            <span className="rounded-full border border-pink-500/50 bg-pink-500/10 px-3 py-1 text-xs font-black text-pink-400 uppercase tracking-widest neon-glow-pink">
              Limited Time Upgrade
            </span>
            <h2 className="text-3xl font-extrabold mt-6 sm:text-4xl neon-text-cyan">
              Unleash Peak Tech Performance
            </h2>
            <p className="mt-4 text-zinc-300 max-w-lg">
              Get an extra 10% off your first checkout. Level up your setup with standard warranties and 24/7 technical customer support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
            <Link
              href="/items"
              className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-black text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all hover:-translate-y-0.5 text-center cursor-pointer uppercase tracking-wider"
            >
              Shop Deals
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-pink-500 px-8 py-3.5 text-sm font-black text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all text-center cursor-pointer uppercase tracking-wider"
            >
              Contact Agent
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us / Features Section */}
      <section className="py-20 bg-[#050505] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl neon-text-pink">
              Why Professionals Choose Us
            </h2>
            <p className="mt-4 text-zinc-400">
              We focus on absolute product quality, swift shipping logistics, and full client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl hover:neon-glow-pink transition-all">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-2xl font-bold mb-6 border border-pink-500/30 neon-glow-pink">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Blazing Fast Dispatch</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Your orders are packed immediately and dispatched via standard express delivery networks within 24 hours.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl hover:neon-glow-cyan transition-all">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl font-bold mb-6 border border-cyan-500/30 neon-glow-cyan">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified Warranty</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Every single electronics purchase is covered by our comprehensive manufacturer warranty program.
              </p>
            </div>
            <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl hover:neon-glow-purple transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl font-bold mb-6 border border-purple-500/30 neon-glow-purple">
                💬
              </div>
              <h3 className="text-lg font-bold text-white mb-2">24/7 Expert Support</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Have setup questions? Our dedicated engineering support staff is available around the clock to assist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="py-20 bg-[#020202] border-t border-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl neon-text-cyan">
              Customer Reviews
            </h2>
            <p className="mt-4 text-zinc-400">
              See what our customers say about their gear and shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#0a0a0a] border border-cyan-500/30 p-8 rounded-2xl flex flex-col justify-between hover:neon-glow-cyan transition-all">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;The MacBook Pro I purchased from TechMarket arrived within 24 hours. The packaging was pristine, and their customer service guided me through warranty setup immediately.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-cyan-400 bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center shadow-[0_0_10px_rgba(0,243,255,0.3)]">AS</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alex Stone</h4>
                  <p className="text-xs text-zinc-500">Lead Frontend Engineer</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-pink-500/30 p-8 rounded-2xl flex flex-col justify-between hover:neon-glow-pink transition-all">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;TechMarket&rsquo;s selection is unmatched. I got my Keychron keyboard and Sony headphones here. Exceptional pricing, verified products, and fast delivery.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-pink-400 bg-pink-500/10 text-pink-400 font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.3)]">MH</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Maria Hansen</h4>
                  <p className="text-xs text-zinc-500">Digital Creator</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-purple-500/30 p-8 rounded-2xl flex flex-col justify-between hover:neon-glow-purple transition-all">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;The iPad Pro M4 is an absolute beast. Ordering was simple, payment was secure, and I was up and running with my new digital sketchpad the next morning.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-purple-400 bg-purple-500/10 text-purple-400 font-bold flex items-center justify-center shadow-[0_0_10px_rgba(176,38,255,0.3)]">DK</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Devon King</h4>
                  <p className="text-xs text-zinc-500">Mobile Architect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
