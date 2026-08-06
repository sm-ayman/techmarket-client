"use client";

import React from "react";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-surface py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,theme(colors.purple.200/50),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,theme(colors.purple.900/20),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_left,theme(colors.cyan.200/50),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,theme(colors.cyan.900/20),transparent_50%)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-black text-pink-600 dark:text-pink-400 mb-6 uppercase tracking-widest">
            Get in Touch
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-ink mb-6">
            Let's build something <span className="text-pink-600 dark:text-pink-400">great</span> together.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-ink-2 text-lg">
            Have a question about an order? Need enterprise hardware solutions? Drop us a message and our support team will respond within 24 hours.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left Side: Contact Info */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-8">
            <div className="bg-surface-2 border border-line p-8 rounded-[2rem] hover:border-cyan-500/30 transition-colors group">
              <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl mb-6 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all">
                📍
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Our Headquarters</h3>
              <p className="text-ink-2 text-sm leading-relaxed">
                TechMarket HQ<br />
                Innovation Block 4, Silicon Avenue<br />
                Tech District, 10010
              </p>
            </div>

            <div className="bg-surface-2 border border-line p-8 rounded-[2rem] hover:border-purple-500/30 transition-colors group">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl mb-6 group-hover:shadow-[0_0_20px_rgba(176,38,255,0.2)] transition-all">
                ✉️
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Contact Details</h3>
              <p className="text-ink-2 text-sm leading-relaxed">
                Support: <a href="mailto:support@techmarket.com" className="text-purple-600 dark:text-purple-400 hover:underline">support@techmarket.com</a><br />
                Sales: <a href="mailto:sales@techmarket.com" className="text-purple-600 dark:text-purple-400 hover:underline">sales@techmarket.com</a><br />
                Phone: +1 (555) 123-4567
              </p>
            </div>

            <div className="bg-surface-2 border border-line p-8 rounded-[2rem] hover:border-pink-500/30 transition-colors group">
              <div className="h-12 w-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-xl mb-6 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all">
                ⏰
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Business Hours</h3>
              <p className="text-ink-2 text-sm leading-relaxed">
                Monday - Friday: 9:00 AM - 6:00 PM (EST)<br />
                Weekend Support: Available for Enterprise Clients
              </p>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-7">
            <div className="bg-surface-2 border border-line rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-2xl font-bold text-ink mb-8">Send us a Message</h2>
              
              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-3 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-surface-3 border border-line-strong rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-ink-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-3 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-surface-3 border border-line-strong rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-ink-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-3 uppercase tracking-widest">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help you?"
                    className="w-full bg-surface-3 border border-line-strong rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-ink-3"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-3 uppercase tracking-widest">Message</label>
                  <textarea 
                    rows="5"
                    placeholder="Tell us about your inquiry..."
                    className="w-full bg-surface-3 border border-line-strong rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 transition-all placeholder-ink-3 resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full rounded-xl bg-cyan-500 px-8 py-4 text-sm font-black text-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] uppercase tracking-wider mt-4"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
