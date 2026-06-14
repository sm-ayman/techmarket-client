"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-black shadow-md shadow-teal-500/20">
                T
              </span>
              <span>Tech<span className="text-teal-500">Market</span></span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/items" className={linkClass("/items")}>
              Items
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
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-teal-500/50"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 font-bold text-white shadow-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-white/5">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Signed in as</p>
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                        {user.displayName || "User Account"}
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/items/add"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm rounded-lg text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Add Product
                    </Link>
                    <Link
                      href="/items/manage"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm rounded-lg text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Manage Products
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2 mt-1 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 shadow-sm dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-800 focus:outline-none"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-3 px-4 flex flex-col gap-2 shadow-inner">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Home
          </Link>
          <Link
            href="/items"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Items
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            About
          </Link>
          {user ? (
            <>
              <Link
                href="/items/add"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Add Product
              </Link>
              <Link
                href="/items/manage"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Manage Products
              </Link>
              <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div className="flex items-center gap-3 px-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 font-bold text-white">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">{user.displayName || "User Account"}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-base font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center px-4 py-2.5 text-base font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg shadow-sm"
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
