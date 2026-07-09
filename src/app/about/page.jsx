"use client";

import React from "react";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&auto=format&fit=crop&q=80"
            alt="Hardware Circuit Background"
            className="h-full w-full object-cover opacity-80 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-[#050505]/80 to-[#050505]" />
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-1.5 text-xs font-black text-cyan-400 mb-6 uppercase tracking-widest neon-glow-cyan">
            Our Mission
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
            Engineering the <span className="neon-text-cyan">Future</span> of Commerce.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Building the next generation curated hardware catalog for developers, digital nomads, and creators worldwide. We don't just sell tech; we curate power.
          </motion.p>
        </motion.div>
      </section>

      {/* Intro Image/Details Section */}
      <section className="py-20 border-t border-zinc-900 bg-[#020202]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white neon-text-purple">
                Curating Only the Best.
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Tech Market started with a simple belief: finding high-quality tech gear shouldn't require scrolling through thousands of unverified listings. 
              </p>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We handpick every single laptop, phone, mechanical keyboard, and audio accessory on our platform to ensure they meet our rigorous performance standards. Whether you are compiling massive codebases, designing digital art, or mixing audio, our catalog is curated to give you maximum computing power, sleek ergonomics, and long-term durability.
              </p>
              <div className="pt-4 flex gap-4">
                <div className="flex flex-col border-l-2 border-cyan-500 pl-4">
                  <span className="text-3xl font-black text-white">10K+</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Happy Clients</span>
                </div>
                <div className="flex flex-col border-l-2 border-pink-500 pl-4">
                  <span className="text-3xl font-black text-white">100%</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Verified Gear</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(176,38,255,0.1)] border border-purple-500/30 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-80 z-10" />
              <img
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
                alt="Tech workspace"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-md border border-zinc-700 p-4 rounded-xl">
                <p className="text-white font-bold">Our Headquarters</p>
                <p className="text-zinc-400 text-xs">Innovation Hub, Block 4</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-24 bg-[#050505] border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-extrabold text-white sm:text-4xl neon-text-cyan">Our Core Values</motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-zinc-400">The principles that drive every decision we make.</motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="bg-[#0a0a0a] border border-cyan-500/30 p-10 rounded-[2rem] hover:neon-glow-cyan transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] group-hover:bg-cyan-500/20 transition-all" />
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl mb-6">💎</div>
              <h3 className="text-xl font-bold text-white mb-4">Uncompromised Quality</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We test all products for performance and durability. If it's not good enough for our developers, it doesn't make it to our catalog.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="bg-[#0a0a0a] border border-pink-500/30 p-10 rounded-[2rem] hover:neon-glow-pink transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[40px] group-hover:bg-pink-500/20 transition-all" />
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-2xl mb-6">🤝</div>
              <h3 className="text-xl font-bold text-white mb-4">Community First</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We shape our collection around feedback from the coding and creative communities, adding and removing products based on real-world reviews.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="bg-[#0a0a0a] border border-purple-500/30 p-10 rounded-[2rem] hover:neon-glow-purple transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-all" />
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-white mb-4">Open Transparency</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Full specifications, real-time reviews, and transparent pricing. No hidden fees or bait-and-switch advertising. We respect our customers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;