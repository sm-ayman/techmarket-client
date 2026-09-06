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

  const isAdmin = user?.email === "admin@techmarket.com";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

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

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive(path)
        ? "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10"
        : "text-ink-2 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10"
    }`;

  const dropdownLinkClass = (highlight = "cyan") =>
    `flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer text-ink-2 hover:text-${highlight}-500 dark:hover:text-${highlight}-400 hover:bg-${highlight}-500/10`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/40 bg-surface-2/90 backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,243,255,0.15)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* ── Logo ────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl tracking-tight text-ink transition-all group-hover:text-pink-500 dark:group-hover:text-pink-400">
              TechMarket
            </span>
          </Link>

          {/* ── Desktop Nav Links (Public only) ─────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {authLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="relative h-9 w-20 rounded-lg overflow-hidden border border-cyan-500/10">
                  <div className="absolute inset-0 bg-surface-3/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" style={{ animation: "shimmer 1.2s infinite linear", backgroundSize: "200% 100%" }} />
                </div>
              ))
            ) : (
              <>
                <Link href="/" className={navLinkClass("/")}>Home</Link>
                <Link href="/items" className={navLinkClass("/items")}>Shop</Link>
                <Link href="/about" className={navLinkClass("/about")}>About</Link>
                <Link href="/contact" className={navLinkClass("/contact")}>Contact</Link>
              </>
            )}
          </div>

          {/* ── Right-side Actions ───────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
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

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-ink-2 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10 rounded-full transition-all inline-flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold leading-none text-white bg-pink-500 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.6)] animate-pulse">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth / Avatar */}
            {authLoading ? (
              <div className="relative h-9 w-9 rounded-full overflow-hidden border border-cyan-500/20">
                <div className="absolute inset-0 bg-surface-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" style={{ animation: "shimmer 1.2s infinite linear", backgroundSize: "200% 100%" }} />
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  id="avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan-500" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 font-bold text-white shadow-sm text-sm">
                      {(user.displayName || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* ── Unified Dropdown ──────────────────────────── */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-cyan-500/30 bg-surface-2/95 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.15)] overflow-hidden">

                    {/* User info header */}
                    <div className="px-4 py-3 bg-surface-3/60">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan-500/50" />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 font-bold text-white text-sm">
                            {(user.displayName || user.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">{user.displayName || "User Account"}</p>
                          <p className="truncate text-xs text-ink-3">{user.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-500/15 text-purple-500 dark:text-purple-400 border border-purple-500/30">
                          ⚡ Admin
                        </span>
                      )}
                    </div>

                    <div className="p-2">
                      {/* Admin section */}
                      {isAdmin && (
                        <>
                          <p className="px-3 pt-1 pb-1.5 text-[9px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest">Admin Panel</p>
                          <Link href="/items/add" onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer mb-0.5 ${isActive("/items/add") ? "bg-purple-500/15 text-purple-500 dark:text-purple-400" : "text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10"}`}>
                            <span>➕</span> Add Product
                          </Link>
                          <Link href="/items/manage" onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer mb-0.5 ${isActive("/items/manage") ? "bg-purple-500/15 text-purple-500 dark:text-purple-400" : "text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10"}`}>
                            <span>🗂️</span> Manage Products
                          </Link>
                          <Link href="/orders" onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer mb-0.5 ${isActive("/orders") ? "bg-purple-500/15 text-purple-500 dark:text-purple-400" : "text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10"}`}>
                            <span>📦</span> Orders
                          </Link>
                          <Link href="/customers" onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${isActive("/customers") ? "bg-purple-500/15 text-purple-500 dark:text-purple-400" : "text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10"}`}>
                            <span>👥</span> Customers
                          </Link>
                          <div className="my-2 h-px bg-line" />
                        </>
                      )}

                      {/* Regular user section */}
                      {!isAdmin && (
                        <>
                          <Link href="/profile" onClick={() => setDropdownOpen(false)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${isActive("/profile") ? "bg-cyan-500/15 text-cyan-500 dark:text-cyan-400" : "text-ink-2 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-500/10"}`}>
                            <span>👤</span> My Profile & Orders
                          </Link>
                          <div className="my-2 h-px bg-line" />
                        </>
                      )}

                      {/* Sign out */}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl text-pink-500 dark:text-pink-400 hover:bg-pink-500/10 transition-all cursor-pointer"
                      >
                        <span>🚪</span> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-transparent border border-cyan-500 text-cyan-500 dark:text-cyan-400 px-5 py-2 text-sm font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:text-white hover:bg-cyan-500 transition-all cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile right side ────────────────────────────── */}
          <div className="flex md:hidden items-center gap-1">
            <button onClick={toggleTheme} className="p-2 text-ink-2 hover:bg-surface-3 rounded-lg cursor-pointer">
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
            <Link href="/cart" className="relative p-2 text-ink-2 hover:bg-surface-3 rounded-lg cursor-pointer inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[8px] font-bold text-white bg-pink-500 rounded-full">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-2 hover:bg-surface-3 rounded-lg cursor-pointer"
            >
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

      {/* ── Search overlay ─────────────────────────────────── */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-surface-2/95 backdrop-blur-md border-b border-cyan-500/40 shadow-[0_10px_30px_rgba(0,243,255,0.1)] p-4 flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-surface-3 border border-cyan-500/30 text-ink px-4 py-2 rounded-xl focus:outline-none focus:border-cyan-500"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-4 py-2 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* ── Mobile Menu ────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/20 bg-surface-2 shadow-inner">
          {/* Public nav links */}
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/") ? "bg-cyan-500/10 text-cyan-500" : "text-ink hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-surface-3"}`}>
              🏠 Home
            </Link>
            <Link href="/items" onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/items") ? "bg-cyan-500/10 text-cyan-500" : "text-ink hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-surface-3"}`}>
              🛍️ Shop
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/about") ? "bg-cyan-500/10 text-cyan-500" : "text-ink hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-surface-3"}`}>
              💡 About
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive("/contact") ? "bg-cyan-500/10 text-cyan-500" : "text-ink hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-surface-3"}`}>
              📬 Contact
            </Link>
          </div>

          {/* Account / Admin section */}
          {authLoading ? (
            <div className="px-4 pb-3 flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative h-10 w-full rounded-xl overflow-hidden border border-cyan-500/10">
                  <div className="absolute inset-0 bg-surface-3/50" />
                </div>
              ))}
            </div>
          ) : user ? (
            <div className="border-t border-line mx-4 mt-1 pb-4 pt-3">
              {/* User header */}
              <div className="flex items-center gap-3 px-2 mb-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-cyan-500/50" />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 font-bold text-white text-sm">
                    {(user.displayName || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{user.displayName || "User Account"}</p>
                  <p className="text-xs text-ink-3 truncate">{user.email}</p>
                </div>
              </div>

              {/* Admin links */}
              {isAdmin && (
                <div className="mb-3 rounded-xl bg-purple-500/5 border border-purple-500/20 p-1.5">
                  <p className="px-3 pt-1 pb-1.5 text-[9px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest">Admin Panel</p>
                  <Link href="/items/add" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                    <span>➕</span> Add Product
                  </Link>
                  <Link href="/items/manage" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                    <span>🗂️</span> Manage Products
                  </Link>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                    <span>📦</span> Orders
                  </Link>
                  <Link href="/customers" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-2 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                    <span>👥</span> Customers
                  </Link>
                </div>
              )}

              {/* Regular user profile link */}
              {!isAdmin && (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-ink hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-surface-3 transition-colors mb-2">
                  <span>👤</span> My Profile & Orders
                </Link>
              )}

              {/* Sign out */}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-pink-500 dark:text-pink-400 hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                <span>🚪</span> Sign out
              </button>
            </div>
          ) : (
            <div className="border-t border-line mx-4 mt-1 pb-4 pt-3 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-sm font-bold text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/10 rounded-xl border border-cyan-500/30 transition-colors">
                Log in
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-sm font-bold text-black bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow-[0_0_10px_rgba(0,243,255,0.4)] transition-colors">
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
