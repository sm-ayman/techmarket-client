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
            ? "border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
            : "border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_5px_rgba(255,0,255,0.2)] hover:shadow-[0_0_15px_rgba(255,0,255,0.6)]"
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

const FlagshipShowcase = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 30; // Reduced sensitivity
    const y = (clientY - top - height / 2) / 30;
    setMousePos({ x, y });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative py-24 overflow-hidden bg-[#020202] border-t border-zinc-900 perspective-1000"
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-black text-purple-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> 
            Flagship Spotlight
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Next-Gen <span className="neon-text-cyan text-cyan-400">RTX 5090</span><br />
            Absolute Power.
          </h2>
          <p className="text-lg text-zinc-400 max-w-lg">
            Experience uncompromised visual fidelity and groundbreaking AI performance. The apex of rendering technology is here.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link href="/items" className="rounded-xl bg-purple-600 px-8 py-3.5 text-sm font-black text-white hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(176,38,255,0.4)] hover:shadow-[0_0_25px_rgba(176,38,255,0.8)] uppercase tracking-wider">
              Pre-Order Now
            </Link>
            <span className="text-zinc-500 font-bold text-sm uppercase">Starting at ৳199,999</span>
          </div>
        </motion.div>

        <div className="flex-1 relative flex justify-center items-center h-[400px] w-full">
          {/* 3D Parallax Layers */}
          <motion.div 
            animate={{ x: mousePos.x * -1, y: mousePos.y * -1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.cyan.900/40),transparent_70%)]"
          />
          <motion.img
            src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80"
            alt="Flagship Product"
            animate={{ x: mousePos.x * 2, y: mousePos.y * 2, rotateY: mousePos.x * 0.5, rotateX: mousePos.y * -0.5 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="w-full max-w-md object-contain filter drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] rounded-2xl border border-zinc-800"
          />
          {/* Floating badges */}
          <motion.div 
            animate={{ x: mousePos.x * 3, y: mousePos.y * 3 }}
            className="absolute top-10 right-10 bg-black/80 backdrop-blur-md border border-cyan-500/50 p-4 rounded-xl shadow-xl"
          >
            <p className="text-cyan-400 font-bold text-lg">24GB</p>
            <p className="text-zinc-400 text-xs font-mono">GDDR7 VRAM</p>
          </motion.div>
          <motion.div 
            animate={{ x: mousePos.x * 4, y: mousePos.y * 4 }}
            className="absolute bottom-10 left-10 bg-black/80 backdrop-blur-md border border-pink-500/50 p-4 rounded-xl shadow-xl"
          >
            <p className="text-pink-400 font-bold text-lg">8K</p>
            <p className="text-zinc-400 text-xs font-mono">Ready Gaming</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const BrandMarquee = () => {
  const brands = ["NVIDIA", "APPLE", "SONY", "ASUS", "RAZER", "LOGITECH", "CORSAIR", "SAMSUNG", "MSI", "NZXT"];
  return (
    <div className="overflow-hidden flex flex-col bg-[#050505] py-12 border-t border-zinc-900">
      <div className="text-center mb-8">
        <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Authorized Reseller For</p>
      </div>
      <div className="relative flex w-full">
        {/* Left and Right gradients for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap gap-24 px-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {/* Duplicate array 3 times for seamless scrolling */}
          {[...brands, ...brands, ...brands].map((b, i) => (
            <span key={i} className="text-3xl md:text-4xl font-extrabold text-zinc-800 uppercase tracking-widest hover:text-zinc-500 transition-colors cursor-default">
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
    <section className="py-24 bg-[#020202] border-t border-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-black text-cyan-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Build a Setup
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl neon-text-cyan mt-4">
            Configure Your Dream Setup
          </h2>
          <p className="mt-4 text-zinc-400">
            Choose a component for each slot and watch your build — and its price — come together live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Slot selectors */}
          <div className="lg:col-span-3 space-y-4">
            {slots.map((slot) => (
              <div
                key={slot.key}
                className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/80 p-5 backdrop-blur transition-colors focus-within:border-cyan-500/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-lg">
                    {slot.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">{slot.label}</h3>
                    <p className="text-xs text-zinc-500">{slot.hint}</p>
                  </div>
                </div>
                <select
                  value={effectiveSelection[slot.key]}
                  onChange={(e) =>
                    setSelection((prev) => ({ ...prev, [slot.key]: e.target.value }))
                  }
                  className="w-full rounded-xl bg-[#050505] border border-zinc-800 px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-colors"
                >
                  <option value="" className="bg-[#050505]">
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
          <div className="lg:col-span-2 lg:sticky lg:top-24 rounded-2xl border border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur p-6">
            <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4">
              Your Build Summary
            </h3>
            <ul className="space-y-3 mb-6">
              {selectedItems.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.title}</p>
                    <p className="text-xs text-zinc-500">{p.category}</p>
                  </div>
                  <span className="font-mono text-sm text-cyan-400">${p.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mb-5">
              <span className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Total</span>
              <span className="font-mono font-black text-2xl text-white neon-text-pink">${total}</span>
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
            <p className="text-center text-[11px] text-zinc-600 mt-3">
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
    <section className="py-24 bg-[#050505] border-t border-zinc-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
          
          {/* Large Asymmetrical Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 bg-gradient-to-br from-cyan-900/40 to-[#0a0a0a] border border-cyan-500/30 rounded-[2rem] p-10 md:p-14 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-all duration-700" />
            <div className="relative z-10 max-w-lg">
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm">Community</span>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white mt-4 leading-tight">Join the Tech <br/>Revolution.</h3>
              <p className="text-zinc-400 mt-6 mb-8 text-lg">Connect with thousands of tech enthusiasts. Get early access to drops, exclusive discounts, and expert advice on our Discord server.</p>
              <button className="rounded-xl bg-cyan-500 px-8 py-4 text-sm font-black text-black hover:bg-white transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] uppercase tracking-wider">
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
            className="md:col-span-4 bg-gradient-to-bl from-pink-900/40 to-[#0a0a0a] border border-pink-500/30 rounded-[2rem] p-10 relative overflow-hidden group flex flex-col justify-end"
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px] group-hover:bg-pink-500/30 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/50 rounded-xl flex items-center justify-center text-xl mb-8 neon-glow-pink">
                📬
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Weekly Tech Digest</h3>
              <p className="text-zinc-400 text-sm mb-6">Stay ahead of the curve. Get the latest hardware news directly in your inbox.</p>
              <div className="flex bg-[#050505] border border-zinc-800 rounded-xl overflow-hidden focus-within:border-pink-500/50 transition-colors">
                <input type="email" placeholder="Email address" className="bg-transparent border-none px-4 py-3 text-white text-sm w-full focus:outline-none placeholder-zinc-600" />
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
    { name: "Phones", icon: "📱", count: "12+ Items" },
    { name: "Laptops", icon: "💻", count: "8+ Items" },
    { name: "Audio", icon: "🎧", count: "15+ Items" },
    { name: "Tablets", icon: "📟", count: "6+ Items" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop&q=80"
            alt="Neon Tech Background"
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-black/50 to-[#050505]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.cyan.600),transparent)] mix-blend-screen" 
        />

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 mb-6 backdrop-blur-md neon-glow-cyan">
            ⚡ Your One-Stop Premium Tech Destination
          </motion.div>
          <motion.h1 variants={fadeInUp} className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Welcome to the Future of{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent neon-text-cyan">
              High-Tech Hardware
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Premium smartphones, laptops, audio gear, and accessories — all in one place.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-x-6">
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
          </motion.div>
        </motion.div>
      </section>

      {/* NEW: Flagship Showcase */}
      <FlagshipShowcase />

      {/* NEW: Brand Marquee */}
      <BrandMarquee />

      {/* Categories */}
      <section className="py-20 bg-[#050505] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl neon-text-purple">
              Explore Popular Categories
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-zinc-400">
              Find exactly what you need with our carefully categorized inventory of devices and components.
            </motion.p>
          </motion.div>
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat, idx) => (
              <motion.div key={idx} variants={scaleUp}>
                <Link
                  href={`/items?category=${cat.name}`}
                  className="block group relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-zinc-800 p-6 shadow-sm hover:neon-glow-purple transition-all hover:-translate-y-1 h-full"
                >
                  <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{cat.icon}</div>
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#020202] border-t border-zinc-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold tracking-tight text-white neon-text-cyan">Featured Highlights</h2>
              <p className="mt-2 text-zinc-400">Top picks from our community, renowned for quality and peak performance.</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/items" className="mt-4 md:mt-0 font-bold text-cyan-400 hover:text-cyan-300 hover:neon-text-cyan transition-colors text-sm flex items-center gap-1 uppercase tracking-wider">
                View All Products <span>→</span>
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-zinc-900 animate-pulse" />
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
                    className="group flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] transition-all hover:neon-glow-cyan cursor-pointer relative z-10"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#050505]">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      <span className="absolute top-3 right-3 rounded-full border border-pink-500 bg-pink-500/20 px-2.5 py-1 text-[10px] font-black text-pink-400 tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)] backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                      <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">{p.shortDescription}</p>
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-800/80 relative z-20">
                        <span className="font-mono font-bold text-xl text-white">৳{p.price}</span>
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
      <section className="py-20 bg-[#050505] transition-colors border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold tracking-tight text-white neon-text-purple">More Products to Explore</h2>
              <p className="mt-2 text-zinc-400">Discover more of our highly rated gadgets and accessories.</p>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-zinc-800 animate-pulse" />
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
                    className="group flex flex-col h-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0a] transition-all hover:neon-glow-purple cursor-pointer relative z-10"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#020202]">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      <span className="absolute top-2 right-2 rounded-full border border-purple-500 bg-purple-500/20 px-2 py-0.5 text-[10px] font-black text-purple-400 uppercase tracking-wider shadow-[0_0_10px_rgba(176,38,255,0.3)] backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-purple-400 transition-colors">{p.title}</h3>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/80 mt-4 relative z-20">
                        <span className="font-mono font-bold text-lg text-white">৳{p.price}</span>
                        {!isAdmin && (
                          <div className="flex items-center gap-1.5">
                            <AddToCartBtn
                              product={p}
                              iconOnly
                              className="rounded-lg bg-transparent border border-cyan-500 p-1.5 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer shadow-[0_0_5px_rgba(0,243,255,0.2)] hover:shadow-[0_0_15px_rgba(0,243,255,0.6)] relative z-20"
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
              className="rounded-xl border border-purple-500 bg-transparent px-8 py-3.5 text-sm font-black text-purple-400 hover:bg-purple-500 hover:text-white shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:shadow-[0_0_20px_rgba(176,38,255,0.6)] transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider hover:-translate-y-1"
            >
              Show More <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEW: Asymmetrical Community Section */}
      <CommunityPerks />

      {/* Promo Banner */}
      <section className="py-16 bg-[#020202] border-t border-b border-cyan-500/30 text-white relative overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.1)]">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.cyan.900),transparent)] mix-blend-screen" 
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
            <span className="rounded-full border border-pink-500/50 bg-pink-500/10 px-3 py-1 text-xs font-black text-pink-400 uppercase tracking-widest neon-glow-pink">
              Limited Time Upgrade
            </span>
            <h2 className="text-3xl font-extrabold mt-6 sm:text-4xl neon-text-cyan">Unleash Peak Tech Performance</h2>
            <p className="mt-4 text-zinc-300 max-w-lg">
              Get an extra 10% off your first checkout. Level up your setup with standard warranties and 24/7 technical customer support.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
            <Link href="/items" className="rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-black text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all hover:-translate-y-0.5 text-center cursor-pointer uppercase tracking-wider">
              Shop Deals
            </Link>
            <Link href="/about" className="rounded-xl border border-pink-500 px-8 py-3.5 text-sm font-black text-pink-400 hover:bg-pink-500 hover:text-white shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all text-center cursor-pointer uppercase tracking-wider hover:-translate-y-0.5">
              Contact Agent
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
