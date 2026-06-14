"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => pathname === path;

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive(path)
        ? "text-cyan-400 neon-text-cyan bg-cyan-500/10"
        : "text-zinc-300 hover:text-pink-400 hover:neon-text-pink hover:bg-pink-500/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/50 bg-[#050505]/90 backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,243,255,0.15)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-2xl tracking-tight text-white neon-text-cyan transition-all group-hover:neon-text-pink">
                TechMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/items" className={linkClass("/items")}>
              Shop
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>
            {user && (
              <>
                <Link href="/items/add" className={linkClass("/items/add")}>
                  Add Product
                </Link>
                <Link href="/items/manage" className={linkClass("/items/manage")}>
                  Manage Products
                </Link>
              </>
            )}
          </div>

          {/* Action Button / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-300 hover:text-cyan-400 hover:neon-text-cyan hover:bg-cyan-500/10 rounded-full transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="relative">
              <button className="p-2 text-zinc-300 hover:text-pink-400 hover:neon-text-pink hover:bg-pink-500/10 rounded-full transition-all group cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-pink-500 rounded-full neon-glow-pink">
                  3
                </span>
              </button>
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan-500"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 font-bold text-white shadow-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-cyan-500/30 bg-[#0a0a0a]/95 backdrop-blur-xl p-3 shadow-[0_0_20px_rgba(0,243,255,0.15)] ring-1 ring-white/5 transition-all">
                    <div className="px-4 py-3 border-b border-zinc-800 mb-2 bg-[#020202] rounded-xl">
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1 neon-text-cyan">Signed in as</p>
                      <p className="truncate text-sm font-bold text-white">
                        {user.displayName || "User Account"}
                      </p>
                      <p className="truncate text-xs font-medium text-zinc-400 mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="px-2 py-2 border-b border-zinc-800/50 mb-2">
                      <Link
                        href="/items/add"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm font-bold text-zinc-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        ➕ Add Product
                      </Link>
                      <Link
                        href="/items/manage"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm font-bold text-zinc-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer mt-1"
                      >
                        ⚙️ Manage Products
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm font-bold rounded-xl text-pink-400 bg-transparent border border-transparent hover:border-pink-500/50 hover:bg-pink-500/10 hover:neon-glow-pink transition-all cursor-pointer"
                    >
                      <span>🚪</span> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 rounded-xl bg-transparent border border-cyan-500 text-cyan-400 px-5 py-2 text-sm font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:neon-glow-cyan hover:text-white hover:bg-cyan-500 transition-all cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-md border-b border-cyan-500/50 shadow-[0_10px_30px_rgba(0,243,255,0.1)] p-4 flex gap-2">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="flex-1 bg-zinc-900/80 border border-cyan-500/30 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan"
            autoFocus
          />
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="px-4 py-2 bg-pink-500 text-white font-bold rounded-xl hover:neon-glow-pink transition-all"
          >
            Close
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-[#050505] py-3 px-4 flex flex-col gap-2 shadow-inner">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:text-cyan-400"
          >
            Home
          </Link>
          <Link
            href="/items"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:text-cyan-400"
          >
            Shop
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:text-cyan-400"
          >
            About
          </Link>
          {user ? (
            <>
              <Link
                href="/items/add"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:text-cyan-400"
              >
                Add Product
              </Link>
              <Link
                href="/items/manage"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:text-cyan-400"
              >
                Manage Products
              </Link>
              <div className="mt-4 border-t border-cyan-500/20 pt-4">
                <div className="flex items-center gap-3 px-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 font-bold text-white shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.displayName || "User Account"}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-pink-400 hover:bg-pink-500/10 cursor-pointer transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-cyan-500/20">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-base font-medium text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/30"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-base font-medium text-black bg-cyan-500 hover:bg-cyan-400 rounded-lg shadow-[0_0_10px_rgba(0,243,255,0.4)] transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
