"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useProducts } from "../../../hooks/useProducts";

const ItemDetails = ({ params }) => {
  const { id } = use(params);
  const { products, loading } = useProducts();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [backgroundPos, setBackgroundPos] = useState("50% 50%");

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPos(`${x}% ${y}%`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-zinc-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto" />
          <p className="mt-4">Loading tech specs...</p>
        </div>
      </div>
    );
  }

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="mt-2 text-zinc-500">The specifications you requested are unavailable.</p>
        <Link
          href="/items"
          className="mt-6 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-sm font-semibold rounded-xl transition-all"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Predefined thumbnail mocks based on the main product image
  const images = [
    product.image,
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&auto=format&fit=crop&q=80"
  ];

  // Specific spec mapping for the 2x2 grid based on product metadata
  const gridSpecs = [
    {
      label: "NOISE CONTROL",
      value: product.specs?.["Noise Cancelling"] || product.specs?.["Processor"] || "Active NC",
      icon: "🎧"
    },
    {
      label: "BATTERY LIFE",
      value: product.specs?.["Battery Life"] || product.specs?.["Battery"] || "30 Hours",
      icon: "🔋"
    },
    {
      label: "BLUETOOTH",
      value: product.specs?.["Connectivity"]?.split("|")[0] || "v5.2",
      icon: "📶"
    },
    {
      label: "SPEED & POWER",
      value: product.specs?.["Type"] || product.specs?.["Thickness"] || "Premium",
      icon: "⚡"
    }
  ];

  // Mocked related items as requested by UI design
  const relatedItems = [
    {
      id: "bose-700",
      title: "Bose Noise Cancelling 700",
      price: 329,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "airpods-max",
      title: "Apple AirPods Max",
      price: 549,
      image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "momentum-4",
      title: "Sennheiser Momentum 4",
      price: 349,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "sony-xm4",
      title: "Sony WH-1000XM4",
      price: 278,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Top Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
          
          {/* Left: Image Canvas */}
          <div className="space-y-6">
            <div 
              className="relative aspect-square w-full rounded-3xl bg-radial-[circle_at_center,rgba(0,243,255,0.05)_0%,rgba(5,5,5,1)_100%] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,243,255,0.1)] flex items-center justify-center overflow-hidden group cursor-zoom-in hover:neon-glow-cyan transition-all"
              onMouseMove={handleMouseMove}
            >
              {/* Featured Badge */}
              <div className="absolute top-6 left-6 rounded-full border border-pink-500 bg-pink-500/20 px-3 py-1 text-[10px] font-black text-pink-400 tracking-widest uppercase z-10 pointer-events-none shadow-[0_0_10px_rgba(255,0,255,0.3)]">
                FEATURED TECH
              </div>
              
              {/* Base Image */}
              <img
                src={images[selectedImageIdx]}
                alt={product.title}
                className="max-h-[80%] max-w-[80%] object-contain transition-opacity duration-300 group-hover:opacity-0"
              />

              {/* Magnified Image Layer */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundImage: `url(${images[selectedImageIdx]})`,
                  backgroundPosition: backgroundPos,
                  backgroundSize: '250%', // Zoom factor
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`aspect-square rounded-xl bg-[#020202] border overflow-hidden p-2 flex items-center justify-center transition-all ${
                    selectedImageIdx === idx ? "border-cyan-400 neon-glow-cyan scale-105" : "border-zinc-800 hover:border-pink-500/50 hover:neon-glow-pink"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Spec Controls */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {product.title}
              </h1>
              <p className="mt-4 text-zinc-400 text-base leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Feature Cards Grid (2x2) */}
            <div className="grid grid-cols-2 gap-4">
              {gridSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-5 hover:border-purple-500/50 hover:neon-glow-purple transition-all"
                >
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold tracking-wider uppercase">
                    <span className="text-purple-400">{spec.icon}</span>
                    <span>{spec.label}</span>
                  </div>
                  <div className="text-lg font-bold text-white mt-2 leading-snug">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Card */}
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 space-y-6 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Price</span>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <span className="text-3xl font-black text-white">৳{product.price}.99</span>
                    <span className="text-xs text-zinc-500 line-through">৳{product.price + 50}.99</span>
                  </div>
                </div>
                <div className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-400">
                  Save ৳50.00
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-2">
                <button className="w-full py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] flex items-center justify-center gap-2 cursor-pointer">
                  🛒 Add to Cart
                </button>
                <button className="w-full py-4 bg-pink-500 hover:bg-pink-400 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_10px_rgba(255,0,255,0.4)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] cursor-pointer">
                  Buy Now
                </button>
              </div>

              {/* Info Label */}
              <div className="text-[10px] text-center text-zinc-500 font-medium">
                🛡️ Official Brand Warranty Included
              </div>
            </div>
          </div>
        </div>

        {/* Mid-section: Experience Pure Silence */}
        <div className="border-t border-zinc-800/80 pt-20 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-12">
            <h2 className="text-3xl font-extrabold text-white leading-tight lg:col-span-1">
              Experience Pure Silence
            </h2>
            <div className="lg:col-span-2 space-y-6">
              <p className="text-zinc-400 text-base leading-relaxed">
                The {product.title} headphones rewrite the rules for distraction-free listening. From airplane noise to people&apos;s voices, our noise-canceling headphones with multiple microphone technologies keep out more high and mid frequency sounds than ever.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div>
                  <h3 className="font-bold text-purple-400 text-sm tracking-wider uppercase mb-2">Magnificent Sound</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    The specially designed 30mm driver unit with light and rigid dome using carbon fiber composite material improves high frequency sensitivity for more natural sound quality.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-purple-400 text-sm tracking-wider uppercase mb-2">Crystal Clear Calls</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    With four beamforming microphones, these headphones are calibrated to only pick up your voice. An improved signal-to-noise ratio enables them to catch every single word.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Graphic */}
          <div className="relative rounded-3xl overflow-hidden aspect-video max-h-[380px] border border-zinc-800/80 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=1200&auto=format&fit=crop&q=80"
              alt="Experience Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Focus Anywhere.</h3>
            </div>
          </div>
        </div>

        {/* Bottom Section: You Might Also Like */}
        <div className="border-t border-zinc-800/80 pt-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white">You Might Also Like</h2>
            <Link href="/items" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedItems.map((item, idx) => (
              <Link
                href={`/items/${item.id}`}
                key={idx}
                className="group bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:neon-glow-cyan hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="aspect-square bg-[#020202] rounded-xl overflow-hidden p-4 mb-4 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                  <span className="block font-mono font-bold text-cyan-400 text-xs mt-2">৳{item.price}.00</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItemDetails;