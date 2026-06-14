"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-black">
                T
              </span>
              <span>Tech<span className="text-teal-400">Market</span></span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              Your ultimate destination for the finest curated tech gadgets, premium accessories, and high-performance hardware.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/items?category=Phones" className="hover:text-white transition-colors">Smartphones</Link>
              </li>
              <li>
                <Link href="/items?category=Laptops" className="hover:text-white transition-colors">Laptops</Link>
              </li>
              <li>
                <Link href="/items?category=Audio" className="hover:text-white transition-colors">Audio & Sound</Link>
              </li>
              <li>
                <Link href="/items?category=Tablets" className="hover:text-white transition-colors">Tablets & Pads</Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter section */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3.5 py-2 text-sm bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold bg-teal-500 text-white rounded-lg hover:bg-teal-600 shadow-md shadow-teal-500/10 transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom border & socials */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Tech Market. All rights reserved. Built with Next.js.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors text-sm">Twitter</a>
            <a href="#" className="hover:text-white transition-colors text-sm">GitHub</a>
            <a href="#" className="hover:text-white transition-colors text-sm">Discord</a>
            <a href="#" className="hover:text-white transition-colors text-sm">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
