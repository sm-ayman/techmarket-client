"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContext } from "../context/ToastContext";

const Navbar = () => {
  const { user, logoutUser, loading: authLoading } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { toast } = useContext(ToastContext);
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
      toast({ type: "info", title: "Session Terminated", message: "You have been signed out securely." });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({ type: "error", title: "Logout Error", message: "Could not sign out. Please try again." });
    }
  };

  const isActive = (path) => pathname === path;

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive(path)
        ? "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10"
        : "text-ink-2 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/40 bg-surface-2/90 backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,243,255,0.15)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-2xl tracking-tight text-ink transition-all group-hover:text-pink-500 dark:group-hover:text-pink-400">
                TechMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {authLoading ? (
              <div className="flex items-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative h-9 w-20 rounded-lg overflow-hidden border border-cyan-500/10">
                    <div className="absolute inset-0 bg-surface-3/50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-[shimmer_1.2s_infinite]" style={{backgroundSize: "200% 100%", animation: "shimmer 1.2s infinite linear"}} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Link href="/" className={linkClass("/")}>
                  Home
                </Link>
                <Link href="/items" className={linkClass("/items")}>
                  Shop
                </Link>
                <Link href="/about" className={linkClass("/about")}>
                  About
                </Link>
                <Link href="/contact" className={linkClass("/contact")}>
                  Contact
                </Link>
                {user?.email === "admin@techmarket.com" && (
                  <>
                    <Link href="/items/add" className={linkClass("/items/add")}>
                      Add Product
                    </Link>
                    <Link href="/items/manage" className={linkClass("/items/manage")}>
                      Manage Products
                    </Link>
                    <Link href="/orders" className={linkClass("/orders")}>
                      Orders
                    </Link>
                    <Link href="/customers" className={linkClass("/customers")}>
                      Customers
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Action Button / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all cursor-pointer"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Search Bar */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="relative">
              <Link href="/cart" className="relative p-2 text-ink-2 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-all group inline-flex items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold leading-none text-white bg-pink-500 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.6)] animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Auth area — show techy skeleton while Firebase resolves */}
            {authLoading ? (
              <div className="flex items-center gap-2">
                <div className="relative h-9 w-28 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-surface-3 border border-cyan-500/20 rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-[shimmer_1.2s_infinite]" style={{backgroundSize: "200% 100%", animation: "shimmer 1.2s infinite linear"}} />
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/60 animate-bounce" style={{animationDelay:"0ms"}} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/60 animate-bounce" style={{animationDelay:"150ms"}} />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/60 animate-bounce" style={{animationDelay:"300ms"}} />
                  </div>
                </div>
              </div>
            ) : user ? (
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
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-cyan-500/30 bg-surface-2/95 backdrop-blur-xl p-3 shadow-[0_0_20px_rgba(0,243,255,0.15)] ring-1 ring-line/10 transition-all">
                    <div className="px-4 py-3 border-b border-line mb-2 bg-surface-4 rounded-xl">
                      <p className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="truncate text-sm font-bold text-ink">
                        {user.displayName || "User Account"}
                      </p>
                      <p className="truncate text-xs font-medium text-ink-3 mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {user?.email === "admin@techmarket.com" && (
                      <div className="px-2 py-2 border-b border-line/60 mb-2">
                        <Link
                          href="/items/add"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-sm font-bold text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          ➕ Add Product
                        </Link>
                        <Link
                          href="/items/manage"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-sm font-bold text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer mt-1"
                        >
                          ⚙️ Manage Products
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-sm font-bold text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer mt-1"
                        >
                          📦 Orders
                        </Link>
                      </div>
                    )}
                    {user?.email !== "admin@techmarket.com" && (
                      <div className="px-2 py-2 border-b border-line/60 mb-2">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-3 py-2 text-sm font-bold text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          👤 My Profile & Orders
                        </Link>
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 px-4 py-2.5 mt-2 text-sm font-bold rounded-xl text-pink-500 dark:text-pink-400 bg-transparent border border-transparent hover:border-pink-500/50 hover:bg-pink-500/10 transition-all cursor-pointer"
                    >
                      <span>🚪</span> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 rounded-xl bg-transparent border border-cyan-500 text-cyan-500 dark:text-cyan-400 px-5 py-2 text-sm font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:text-white hover:bg-cyan-500 transition-all cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="inline-flex items-center justify-center rounded-lg p-2 text-ink-2 hover:bg-surface-3 focus:outline-none cursor-pointer"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-ink-2 hover:bg-surface-3 focus:outline-none cursor-pointer"
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
        <div className="absolute top-full left-0 w-full bg-surface-2/95 backdrop-blur-md border-b border-cyan-500/40 shadow-[0_10px_30px_rgba(0,243,255,0.1)] p-4 flex gap-2">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="flex-1 bg-surface-3 border border-cyan-500/30 text-ink px-4 py-2 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400"
            autoFocus
          />
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="px-4 py-2 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-all"
          >
            Close
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-surface-2 py-3 px-4 flex flex-col gap-2 shadow-inner">
          {authLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative h-10 w-full rounded-lg overflow-hidden border border-cyan-500/10">
                  <div className="absolute inset-0 bg-surface-3/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-[shimmer_1.2s_infinite]" style={{backgroundSize: "200% 100%", animation: "shimmer 1.2s infinite linear"}} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400"
              >
                Home
              </Link>
              <Link
                href="/items"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400"
              >
                Contact
              </Link>
              {user ? (
                <>
                  {user?.email === "admin@techmarket.com" && (
                    <>
                      <Link href="/items/add" onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400">
                        Add Product
                      </Link>
                      <Link href="/items/manage" onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400">
                        Manage Products
                      </Link>
                      <Link href="/orders" onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-purple-500 dark:hover:text-purple-400">
                        Orders
                      </Link>
                      <Link href="/customers" onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-purple-500 dark:hover:text-purple-400">
                        Customers
                      </Link>
                    </>
                  )}
                  {user?.email !== "admin@techmarket.com" && (
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400">
                      👤 My Profile & Orders
                    </Link>
                  )}
                  <div className="mt-4 border-t border-cyan-500/20 pt-4">
                    <div className="flex items-center gap-3 px-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 font-bold text-white shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{user.displayName || "User Account"}</p>
                        <p className="text-xs text-ink-3 truncate max-w-[200px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-pink-500 dark:text-pink-400 hover:bg-pink-500/10 cursor-pointer transition-colors"
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
                    className="flex w-full items-center justify-center px-4 py-2.5 text-base font-medium text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors border border-cyan-500/30"
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
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
