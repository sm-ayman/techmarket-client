"use client";

import React from "react";
import Link from "next/link";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { products, loading } = useProducts();

  // Get first 3 products for featured section
  const featuredProducts = products.slice(0, 3);

  const categories = [
    { name: "Phones", icon: "📱", count: "12+ Items" },
    { name: "Laptops", icon: "💻", count: "8+ Items" },
    { name: "Audio", icon: "🎧", count: "15+ Items" },
    { name: "Tablets", icon: "📟", count: "6+ Items" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-zinc-950 to-zinc-950 py-24 sm:py-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.900),theme(colors.zinc.950))] opacity-40" />
        <div className="absolute right-1/2 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-teal-400 opacity-10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400 mb-6 backdrop-blur-md">
            🚀 Welcome to TechMarket v2.0
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
            Your Premium Destination for <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Next-Gen Tech</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Discover a handpicked collection of high-performance smartphones, powerful workstations, immersive sound gear, and cutting-edge tech accessories.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/items"
              className="rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Browse Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors"
            >
              Learn More <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Categories Grid Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Explore Popular Categories
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Find exactly what you need with our carefully categorized inventory of devices and components.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/items?category=${cat.name}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-100 p-6 shadow-sm hover:shadow-md dark:bg-zinc-900 dark:border-zinc-800 transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-teal-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {cat.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="py-20 bg-white dark:bg-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Featured Highlights
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Top picks from our community, renowned for quality and peak performance.
              </p>
            </div>
            <Link
              href="/items"
              className="mt-4 md:mt-0 font-semibold text-teal-500 hover:text-teal-600 transition-colors text-sm flex items-center gap-1"
            >
              View All Products <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 rounded-full bg-teal-500/95 px-2.5 py-1 text-xs font-semibold text-white">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-bold text-xl text-zinc-950 dark:text-white">
                        ${p.price}
                      </span>
                      <Link
                        href={`/items/${p.id}`}
                        className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-600 transition-colors cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Special Promo Banner Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-emerald-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Limited Time Upgrade
            </span>
            <h2 className="text-3xl font-extrabold mt-4 sm:text-4xl">
              Unleash Peak Tech Performance Today
            </h2>
            <p className="mt-4 text-teal-50/90 max-w-lg">
              Get an extra 10% off your first checkout. Level up your setup with standard warranties and 24/7 technical customer support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
            <Link
              href="/items"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-teal-600 hover:bg-zinc-55 shadow-md transition-all hover:-translate-y-0.5 text-center cursor-pointer"
            >
              Shop Deals
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-white/50 px-6 py-3.5 text-sm font-bold hover:bg-white/10 transition-colors text-center cursor-pointer"
            >
              Contact Agent
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us / Features Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Why Professionals Choose Us
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              We focus on absolute product quality, swift shipping logistics, and full client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-2xl font-bold mb-6">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Blazing Fast Dispatch</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Your orders are packed immediately and dispatched via standard express delivery networks within 24 hours.
              </p>
            </div>
            <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-2xl font-bold mb-6">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Verified Warranty</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Every single electronics purchase is covered by our comprehensive manufacturer warranty program.
              </p>
            </div>
            <div className="bg-white border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-2xl font-bold mb-6">
                💬
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">24/7 Expert Support</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Have setup questions? Our dedicated engineering support staff is available around the clock to assist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-20 bg-white dark:bg-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Trusted by Creators & Developers
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              See what engineers, tech enthusiasts, and digital nomads say about their gear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800 flex flex-col justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                &ldquo;The MacBook Pro I purchased from TechMarket arrived within 24 hours. The packaging was pristine, and their customer service guided me through warranty setup immediately.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center">AS</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Alex Stone</h4>
                  <p className="text-xs text-zinc-500">Lead Frontend Engineer</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800 flex flex-col justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                &ldquo;TechMarket&rsquo;s selection is unmatched. I got my Keychron keyboard and Sony headphones here. Exceptional pricing, verified products, and fast delivery.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center">MH</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Maria Hansen</h4>
                  <p className="text-xs text-zinc-500">Digital Creator</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl dark:bg-zinc-950 dark:border-zinc-800 flex flex-col justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                &ldquo;The iPad Pro M4 is an absolute beast. Ordering was simple, payment was secure, and I was up and running with my new digital sketchpad the next morning.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center">DK</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Devon King</h4>
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
