"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProducts } from "../hooks/useProducts";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import { motion } from "framer-motion";

// Reusable "Add to Cart" button with success flash
function AddToCartBtn({ product, className = "", iconOnly = false }) {
  const { addToCart } = useContext(CartContext);
  const { toast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        type: "error",
        title: "Authentication Required",
        message: "Please login to add to cart",
      });
      router.push("/login");
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    toast({
      type: "cart",
      title: "Added to Cart",
      message: `${product.title} \u2014 $${product.price}`,
    });
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleAdd}
        title="Add to Cart"
        className={`rounded-lg bg-transparent border p-2 transition-all cursor-pointer z-10 relative ${
          added
            ? "border-cyan-500 dark:border-cyan-400 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
            : "border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_5px_rgba(255,0,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]"
        } ${className}`}
      >
        {added ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button onClick={handleAdd} className={className}>
      {added ? "✓ Added!" : "🛒 Add to Cart"}
    </button>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- NEW DYNAMIC SECTIONS ---

const BentoHero = () => {
  return (
    <section className="py-4 md:py-6 bg-surface border-t border-line transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">

          {/* ROW 1 */}
          <div className="flex flex-col lg:flex-row gap-3 lg:h-[340px]">

            {/* MAIN HERO CARD */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative flex-1 rounded-[24px] bg-surface-2 border border-line overflow-hidden p-6 md:p-7 group min-h-[280px] lg:min-h-0"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-cyan-500/10 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full bg-purple-500/10 blur-[100px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-3 border border-line-strong px-3 py-1 text-[10px] font-bold text-ink-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,243,255,0.9)]" />
                  TechMarket Flagship
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-[2.4rem] font-extrabold text-ink leading-[1.08] mb-3 max-w-sm">
                  ASUS ROG{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                    Zephyrus
                  </span>
                  <br />Dominate All.
                </h1>
                <p className="text-ink-2 text-xs max-w-xs mb-5 leading-relaxed">
                  AMD Ryzen 9 &bull; RTX 4060 &bull; 3K OLED 165Hz. The ultimate gaming ultrabook.
                </p>
                <Link
                  href="/items"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#c8ff00] text-black px-5 py-2.5 text-xs font-extrabold hover:bg-[#b8f000] active:scale-95 transition-all shadow-[0_0_20px_rgba(200,255,0,0.35)]"
                >
                  View All Products
                  <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
              <motion.img
                src="/laptop.png"
                alt="ASUS ROG Zephyrus G14"
                className="absolute bottom-0 right-0 h-[78%] w-auto object-contain drop-shadow-[0_24px_60px_rgba(0,243,255,0.22)] z-0"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.9, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </motion.div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-3 lg:w-[240px] shrink-0 h-full">
              {/* Popular Colors */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="rounded-[24px] bg-surface-2 border border-line p-4 flex flex-col justify-center" style={{ flex: "0 0 118px" }}
              >
                <p className="text-[9px] font-black text-ink-3 uppercase tracking-[0.2em] mb-3">Popular Colors</p>
                <div className="flex gap-2">
                  {["bg-blue-500","bg-orange-500","bg-emerald-500","bg-rose-500","bg-cyan-400"].map((bg, i) => (
                    <button key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white/20 hover:scale-125 hover:border-white/60 transition-all duration-200`} />
                  ))}
                </div>
              </motion.div>

              {/* Pixel 9 Pro */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="rounded-[24px] bg-surface-2 border border-line flex-1 relative overflow-hidden group"
              >
                <div className="p-4 flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-ink-3 mb-1">New Release</p>
                    <h3 className="font-extrabold text-ink text-base leading-tight">New Gen<br />Pixel 9 Pro</h3>
                    <p className="text-ink-3 text-[10px] mt-0.5">Google AI Built-in</p>
                  </div>
                  <Link href="/items/google-pixel-9-pro" className="w-7 h-7 bg-surface-3 border border-line text-ink rounded-full flex items-center justify-center hover:bg-surface-4 transition-colors text-xs shrink-0">
                    ↗
                  </Link>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=80"
                  alt="Google Pixel 9 Pro"
                  className="absolute bottom-0 right-0 h-[72%] w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 z-0"
                />
              </motion.div>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="flex flex-col lg:flex-row gap-3 lg:h-[170px]">

            {/* More Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="rounded-[24px] bg-surface-2 border border-line p-4 flex flex-col justify-between lg:w-[210px] shrink-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-ink text-xs">More Products</h3>
                  <p className="text-ink-3 text-[10px] mt-0.5">460+ items in store</p>
                </div>
                <span>&#10084;&#65039;</span>
              </div>
              <div className="flex gap-2">
                {[
                  "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=120&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=120&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=120&auto=format&fit=crop&q=80",
                ].map((src, i) => (
                  <div key={i} className="flex-1 aspect-square rounded-xl overflow-hidden border border-line bg-surface-4">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="rounded-[24px] bg-surface-2 border border-line p-4 flex flex-col items-center justify-center text-center relative overflow-hidden lg:w-[140px] shrink-0"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col items-center justify-center shadow-[0_8px_24px_rgba(59,130,246,0.45)] mb-2 relative z-10">
                <span className="font-extrabold text-sm leading-none">5m+</span>
                <span className="text-[7px] opacity-90 uppercase tracking-wider font-bold mt-0.5">Sales</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-ink bg-surface-4 px-3 py-1.5 rounded-full border border-line relative z-10">
                <span className="text-yellow-400">&#9733;</span> 4.6 rating
              </div>
            </motion.div>

            {/* Sony WH */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="rounded-[24px] bg-surface-2 border border-line p-4 relative overflow-hidden group flex flex-col flex-1"
            >
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded-full mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />Popular
                  </span>
                  <h3 className="font-extrabold text-ink text-sm leading-tight">Sony WH-1000XM5</h3>
                  <p className="text-ink-3 text-[10px] mt-0.5">Industry-leading ANC</p>
                </div>
                <Link href="/items/sony-wh-1000xm5" className="w-8 h-8 bg-surface-3 border border-line text-ink rounded-full flex items-center justify-center hover:bg-surface-4 transition-colors text-xs shrink-0">&#8599;</Link>
              </div>
              <div className="absolute bottom-4 left-5 flex -space-x-2 z-10">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full border-2 border-surface-2 object-cover" alt="" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full border-2 border-surface-2 object-cover" alt="" />
                <div className="w-7 h-7 rounded-full border-2 border-surface-2 bg-surface-4 flex items-center justify-center text-[8px] font-bold text-ink">+9</div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&auto=format&fit=crop&q=80"
                alt="Sony WH-1000XM5"
                className="absolute bottom-0 right-0 h-[95%] w-auto object-contain opacity-90 group-hover:scale-105 transition-transform duration-500 z-0 drop-shadow-xl"
              />
            </motion.div>

            {/* Headphone Photo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
              className="rounded-[24px] overflow-hidden relative flex flex-col justify-end group lg:w-[210px] shrink-0 min-h-[150px] lg:min-h-0"
            >
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
                alt="Surface Headphone"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />
              <div className="relative z-20 p-4">
                <Link href="/items" className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 text-black rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg text-[10px]">&#8599;</Link>
                <h3 className="font-extrabold text-white text-xs leading-tight mb-0.5">Light Grey Surface<br />Headphone</h3>
                <p className="text-white/70 text-[10px]">Boosted with bass</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

const BrandMarquee = () => {
  const brands = ["NVIDIA", "APPLE", "SONY", "ASUS", "RAZER", "LOGITECH", "CORSAIR", "SAMSUNG", "MSI", "NZXT"];
  return (
    <div className="overflow-hidden flex flex-col bg-surface py-12 border-t border-line">
      <div className="text-center mb-8">
        <p className="text-xs font-black text-ink-3 uppercase tracking-[0.3em]">Authorized Reseller For</p>
      </div>
      <div className="relative flex w-full">
        {/* Left and Right gradients for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap gap-24 px-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {/* Duplicate array 3 times for seamless scrolling */}
          {[...brands, ...brands, ...brands].map((b, i) => (
            <span key={i} className="text-3xl md:text-4xl font-extrabold text-ink-3 uppercase tracking-widest hover:text-ink-2 transition-colors cursor-default">
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const SETUP_SLOTS = [
  {
    key: "device",
    label: "Core Device",
    hint: "The heart of your build",
    icon: "🖥️",
    none: "Skip — I'm not adding a device",
    categories: ["Laptops", "Tablets", "Phones", "Gaming", "Drones", "Wearables"],
  },
  {
    key: "display",
    label: "Display",
    hint: "Where everything comes to life",
    icon: "📺",
    none: "Skip — I already have a display",
    categories: ["Displays"],
  },
  {
    key: "keyboard",
    label: "Keyboard",
    hint: "Your primary input",
    icon: "⌨️",
    none: "Skip — I already have a keyboard",
    categories: ["Accessories"],
    filter: (p) => p.title.toLowerCase().includes("keyboard"),
  },
  {
    key: "mouse",
    label: "Mouse",
    hint: "Precision control",
    icon: "🖱️",
    none: "Skip — I already have a mouse",
    categories: ["Accessories"],
    filter: (p) => p.title.toLowerCase().includes("mx master"),
  },
  {
    key: "audio",
    label: "Audio",
    hint: "Immerse yourself",
    icon: "🎧",
    none: "Skip — I already have headphones",
    categories: ["Audio"],
  },
];

const BuildSetup = ({ products }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const slots = SETUP_SLOTS.map((slot) => ({
    ...slot,
    options: products.filter(
      (p) =>
        slot.categories.includes(p.category) &&
        (!slot.filter || slot.filter(p))
    ),
  })).filter((s) => s.options.length > 0);

  const [selection, setSelection] = useState({});
  const effectiveSelection = Object.fromEntries(
    slots.map((s) => [
      s.key,
      selection[s.key] !== undefined ? selection[s.key] : s.options[0].id,
    ])
  );

  const selectedItems = slots
    .map((s) =>
      effectiveSelection[s.key]
        ? products.find((p) => p.id === effectiveSelection[s.key])
        : null
    )
    .filter(Boolean);

  const total = selectedItems.reduce((sum, p) => sum + p.price, 0);

  if (slots.length === 0) return null;

  const handleAddSetup = () => {
    if (!user) {
      toast({
        type: "error",
        title: "Authentication Required",
        message: "Please login to add this setup to cart",
      });
      router.push("/login");
      return;
    }
    selectedItems.forEach((p) => addToCart(p));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast({
      type: "cart",
      title: "Setup Added to Cart",
      message: `${selectedItems.length} items added \u2014 $${total}`,
    });
  };

  return (
    <section className="py-24 bg-surface-4 border-t border-line relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> Build a Setup
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl mt-4">
            Configure Your Dream Setup
          </h2>
          <p className="mt-4 text-ink-2">
            Choose a component for each slot and watch your build — and its price — come together live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Slot selectors */}
          <div className="lg:col-span-3 space-y-4">
            {slots.map((slot) => (
              <div
                key={slot.key}
                className="rounded-2xl border border-line bg-surface-2/80 p-5 backdrop-blur transition-colors focus-within:border-cyan-500/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-lg">
                    {slot.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink text-sm uppercase tracking-wider">{slot.label}</h3>
                    <p className="text-xs text-ink-3">{slot.hint}</p>
                  </div>
                </div>
                <select
                  value={effectiveSelection[slot.key]}
                  onChange={(e) =>
                    setSelection((prev) => ({ ...prev, [slot.key]: e.target.value }))
                  }
                  className="w-full rounded-xl bg-surface-3 border border-line px-4 py-3 text-ink text-sm focus:outline-none focus:border-cyan-500/60 transition-colors"
                >
                  <option value="" className="bg-surface-3">
                    {slot.none}
                  </option>
                  {slot.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title} — ${opt.price}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 rounded-2xl border border-line bg-surface-2/80 backdrop-blur p-6">
            <h3 className="font-black text-ink uppercase tracking-wider text-sm mb-4">
              Your Build Summary
            </h3>
            <ul className="space-y-3 mb-6">
              {selectedItems.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 rounded-lg object-cover border border-line"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">{p.title}</p>
                    <p className="text-xs text-ink-3">{p.category}</p>
                  </div>
                  <span className="font-mono text-sm text-cyan-600 dark:text-cyan-400">${p.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-line pt-4 mb-5">
              <span className="text-ink-2 text-sm font-bold uppercase tracking-wider">Total</span>
              <span className="font-mono font-black text-2xl text-ink">${total}</span>
            </div>
            <button
              onClick={handleAddSetup}
              className={`w-full rounded-xl px-6 py-3.5 text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                added
                  ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                  : "bg-pink-500 text-white hover:bg-pink-400 shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.8)]"
              }`}
            >
              {added ? "✓ Added to Cart!" : `🛒 Add Entire Setup (${selectedItems.length} items)`}
            </button>
            <p className="text-center text-[11px] text-ink-3 mt-3">
              Every component is also available individually in the shop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CommunityPerks = () => {
  return (
    <section className="py-24 bg-surface border-t border-line overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
          
          {/* Large Asymmetrical Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-gradient-to-br from-cyan-500/10 to-surface-2 border border-cyan-500/30 rounded-[2rem] p-10 md:p-14 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-all duration-700" />
            <div className="relative z-10 max-w-lg">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm">Community</span>
              <h3 className="text-3xl md:text-5xl font-extrabold text-ink mt-4 leading-tight">Join the Tech <br/>Revolution.</h3>
              <p className="text-ink-2 mt-6 mb-8 text-lg">Connect with thousands of tech enthusiasts. Get early access to drops, exclusive discounts, and expert advice on our Discord server.</p>
              <button className="rounded-xl bg-cyan-500 px-8 py-4 text-sm font-black text-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] uppercase tracking-wider">
                Join Discord Server
              </button>
            </div>
          </motion.div>

          {/* Smaller Asymmetrical Card 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 bg-gradient-to-bl from-pink-500/10 to-surface-2 border border-pink-500/30 rounded-[2rem] p-10 relative overflow-hidden group flex flex-col justify-end"
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px] group-hover:bg-pink-500/30 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/50 rounded-xl flex items-center justify-center text-xl mb-8">
                📬
              </div>
              <h3 className="text-2xl font-bold text-ink mb-3">Weekly Tech Digest</h3>
              <p className="text-ink-2 text-sm mb-6">Stay ahead of the curve. Get the latest hardware news directly in your inbox.</p>
              <div className="flex bg-surface-3 border border-line rounded-xl overflow-hidden focus-within:border-pink-500/50 transition-colors">
                <input type="email" placeholder="Email address" className="bg-transparent border-none px-4 py-3 text-ink text-sm w-full focus:outline-none placeholder-ink-3" />
                <button className="bg-pink-600 px-4 py-3 text-white font-bold hover:bg-pink-500 transition-colors">
                  →
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// Hero product bento grid: asymmetric product cards rendered from live products
const HeroBentoGrid = ({ products }) => {
  const router = useRouter();
  const [big, ...rest] = products;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:auto-rows-[9rem]"
    >
      {/* Large featured card */}
      {big && (
        <motion.div
          variants={scaleUp}
          onClick={() => router.push(`/items/${big.id}`)}
          className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl border border-line bg-surface-2 cursor-pointer hover:shadow-[0_0_25px_rgba(0,243,255,0.15)] transition-shadow"
        >
          <img
            src={big.image}
            alt={big.title}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute top-4 right-4 rounded-full border border-pink-500/50 bg-pink-500/20 px-3 py-1 text-[10px] font-black tracking-widest text-pink-400 uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)] backdrop-blur-md">
            Featured
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white text-lg font-bold line-clamp-1 drop-shadow-lg">{big.title}</p>
            <p className="mt-1 text-white/70 text-xs line-clamp-1">{big.category}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-xl font-black text-cyan-400">৳{big.price}</span>
              <AddToCartBtn product={big} iconOnly />
            </div>
          </div>
        </motion.div>
      )}

      {/* Smaller bento cards */}
      {rest.slice(0, 3).map((p) => (
        <motion.div
          key={p.id}
          variants={fadeInUp}
          whileHover={{ y: -4 }}
          onClick={() => router.push(`/items/${p.id}`)}
          className="group relative row-span-1 overflow-hidden rounded-3xl border border-line bg-surface-2 cursor-pointer hover:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-shadow"
        >
          <img
            src={p.image}
            alt={p.title}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-bold line-clamp-1 drop-shadow">{p.title}</p>
            <p className="mt-1 font-mono text-xs font-bold text-cyan-400">৳{p.price}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// --- MAIN HOME COMPONENT ---

export default function Home() {
  const { products, loading } = useProducts();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const router = useRouter();
  const isAdmin = user?.email === "admin@techmarket.com";

  const explicitFeatured = products.filter(p => p.isFeatured);
  const otherProducts = products.filter(p => !p.isFeatured);
  
  // Fill up to 3 slots with explicit featured products
  const featuredProducts = [...explicitFeatured, ...otherProducts].slice(0, 3);
  
  // Show 8 other products
  const displayedFeaturedIds = new Set(featuredProducts.map(p => p.id));
  const moreProducts = products.filter(p => !displayedFeaturedIds.has(p.id)).slice(0, 8);

  // Hero spotlight product (falls back to first product while loading)
  const heroProduct = featuredProducts[0] || products[0] || null;

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (!user) {
      toast({
        type: "error",
        title: "Authentication Required",
        message: "Please login to buy product",
      });
      router.push("/login");
      return;
    }
    addToCart(product);
    router.push("/checkout");
  };

  const categories = [
    {
      name: "Phones",
      icon: "📱",
      tagline: "Flagship & budget mobiles",
      badge: "bg-cyan-500/10 border-cyan-500/40 text-cyan-600 dark:text-cyan-300",
      gradient: "from-cyan-500/20 via-transparent to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,243,255,0.25)]",
    },
    {
      name: "Laptops",
      icon: "💻",
      tagline: "Ultrabooks & gaming rigs",
      badge: "bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-300",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(176,38,255,0.25)]",
    },
    {
      name: "Audio",
      icon: "🎧",
      tagline: "Headphones & speakers",
      badge: "bg-pink-500/10 border-pink-500/40 text-pink-600 dark:text-pink-300",
      gradient: "from-pink-500/20 via-transparent to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(255,0,255,0.25)]",
    },
    {
      name: "Tablets",
      icon: "📟",
      tagline: "Portable productivity",
      badge: "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
      glow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.25)]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* NEW: Bento Box Hero */}
      <BentoHero />

      {/* NEW: Brand Marquee */}
      <BrandMarquee />

      {/* Categories */}
      <section className="py-20 bg-surface transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <motion.div variants={fadeInUp} className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                Shop by Category
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Explore{" "}
                <span className="text-purple-600 dark:text-purple-400">Popular Categories</span>
              </h2>
              <p className="mt-4 text-ink-2">
                Find exactly what you need with our carefully curated inventory of devices and components.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link
                href="/items"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-5 py-2.5 text-sm font-bold text-ink-2 transition-all hover:border-purple-500/60 hover:text-purple-600 dark:hover:text-purple-400 group"
              >
                Browse All
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat, idx) => {
              const itemCount = products.filter((p) => p.category === cat.name).length;
              return (
                <motion.div key={idx} variants={scaleUp} className="h-full">
                  <Link
                    href={`/items?category=${cat.name}`}
                    className={`group relative block h-full overflow-hidden rounded-2xl border border-line bg-surface-2 p-6 transition-all duration-300 hover:-translate-y-1.5 ${cat.glow}`}
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ink/5 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface-3 text-3xl transition-all duration-300 group-hover:border-line-strong group-hover:scale-110 group-hover:shadow-lg">
                        {cat.icon}
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${cat.badge}`}>
                        {itemCount} {itemCount === 1 ? "Item" : "Items"}
                      </span>
                    </div>

                    <div className="relative mt-6">
                      <h3 className="text-lg font-bold text-ink transition-colors duration-300 group-hover:text-ink">
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm text-ink-3">{cat.tagline}</p>
                    </div>

                    <div className="relative mt-6 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-ink-3 transition-colors duration-300 group-hover:text-ink">
                      Shop Now
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-surface-4 border-t border-line transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold tracking-tight text-ink">Featured Highlights</h2>
              <p className="mt-2 text-ink-2">Top picks from our community, renowned for quality and peak performance.</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/items" className="mt-4 md:mt-0 font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors text-sm flex items-center gap-1 uppercase tracking-wider">
                View All Products <span>→</span>
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-surface-3 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featuredProducts.map((p) => (
                <motion.div key={p.id} variants={fadeInUp} whileHover={{ y: -5 }} className="h-full z-10 relative">
                  <div
                    onClick={() => router.push(`/items/${p.id}`)}
                    className="group flex flex-col h-full overflow-hidden rounded-2xl border border-line bg-surface-2 transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] cursor-pointer relative z-10"
                  >
                    <div className="relative aspect-video overflow-hidden bg-surface-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      <span className="absolute top-3 right-3 rounded-full border border-pink-500 bg-pink-500/20 px-2.5 py-1 text-[10px] font-black text-pink-600 dark:text-pink-400 tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)] backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-bold text-lg text-ink line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                      <p className="mt-2 text-sm text-ink-2 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-line relative z-20">
                        <span className="font-mono font-bold text-xl text-ink">৳{p.price}</span>
                        {!isAdmin && (
                          <div className="flex items-center gap-2">
                            <AddToCartBtn product={p} iconOnly />
                            <button
                              onClick={(e) => handleBuyNow(e, p)}
                              className="rounded-lg bg-cyan-500 px-4 py-2 text-[10px] font-black tracking-widest text-black hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.4)] hover:shadow-[0_0_20px_rgba(0,243,255,0.8)] uppercase relative z-20"
                            >
                              Buy Now
                            </button>
                          </div>
                        )}
                        {isAdmin && (
                          <Link
                            href={`/items/${p.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg bg-pink-500 px-4 py-2 text-[10px] font-black tracking-widest text-white hover:bg-pink-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,255,0.4)] hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] uppercase"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* NEW: Build Your Setup */}
      <BuildSetup products={products} />

      {/* More Products */}
      <section className="py-20 bg-surface transition-colors border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold tracking-tight text-ink">More Products to Explore</h2>
              <p className="mt-2 text-ink-2">Discover more of our highly rated gadgets and accessories.</p>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-surface-3 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {moreProducts.map((p) => (
                <motion.div key={p.id} variants={scaleUp} whileHover={{ y: -5 }} className="h-full relative z-10">
                  <div
                    onClick={() => router.push(`/items/${p.id}`)}
                    className="group flex flex-col h-full overflow-hidden rounded-2xl border border-line bg-surface-2 transition-all hover:shadow-[0_0_20px_rgba(176,38,255,0.2)] cursor-pointer relative z-10"
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      <span className="absolute top-2 right-2 rounded-full border border-purple-500 bg-purple-500/20 px-2 py-0.5 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider shadow-[0_0_10px_rgba(176,38,255,0.3)] backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-bold text-base text-ink line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{p.title}</h3>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-line mt-4 relative z-20">
                        <span className="font-mono font-bold text-lg text-ink">৳{p.price}</span>
                        {!isAdmin && (
                          <div className="flex items-center gap-1.5">
                            <AddToCartBtn
                              product={p}
                              iconOnly
                              className="rounded-lg bg-transparent border border-cyan-500 p-1.5 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer shadow-[0_0_5px_rgba(0,243,255,0.2)] hover:shadow-[0_0_15px_rgba(0,243,255,0.6)] relative z-20"
                            />
                            <button
                              onClick={(e) => handleBuyNow(e, p)}
                              className="rounded-lg bg-purple-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-purple-500 transition-all cursor-pointer shadow-[0_0_10px_rgba(176,38,255,0.4)] hover:shadow-[0_0_20px_rgba(176,38,255,0.8)] uppercase tracking-wider relative z-20"
                            >
                              Buy Now
                            </button>
                          </div>
                        )}
                        {isAdmin && (
                          <Link
                            href={`/items/${p.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-lg bg-pink-500 px-3 py-1.5 text-[10px] font-black tracking-widest text-white hover:bg-pink-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(255,0,255,0.4)] hover:shadow-[0_0_20px_rgba(255,0,255,0.8)] uppercase"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-4"
          >
            <Link
              href="/items"
              className="rounded-xl border border-purple-500 bg-transparent px-8 py-3.5 text-sm font-black text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)] transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider hover:-translate-y-1"
            >
              Show More <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEW: Asymmetrical Community Section */}
      <CommunityPerks />

      {/* Promo Banner */}
      <section className="py-16 bg-surface-4 border-t border-b border-cyan-500/30 text-ink relative overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.1)]">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.cyan.500/20),transparent)] mix-blend-screen" 
        />
        <div className="absolute top-0 right-0 h-[200px] w-[200px] bg-pink-500/20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[200px] bg-purple-500/20 blur-[80px]" />
        
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center justify-between gap-8 z-10"
        >
          <motion.div variants={fadeInUp} className="max-w-2xl text-center md:text-left">
            <span className="rounded-full border border-pink-500/50 bg-pink-500/10 px-3 py-1 text-xs font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest">
              Limited Time Upgrade
            </span>
            <h2 className="text-3xl font-extrabold mt-6 sm:text-4xl">Unleash Peak Tech Performance</h2>
            <p className="mt-4 text-ink-2 max-w-lg">
              Get an extra 10% off your first checkout. Level up your setup with standard warranties and 24/7 technical customer support.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
            <Link href="/items" className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-black text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all hover:-translate-y-0.5 text-center cursor-pointer uppercase tracking-wider">
              Shop Deals
            </Link>
            <Link href="/about" className="rounded-xl border border-pink-500 px-8 py-3.5 text-sm font-black text-pink-600 dark:text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all text-center cursor-pointer uppercase tracking-wider hover:-translate-y-0.5">
              Contact Agent
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
