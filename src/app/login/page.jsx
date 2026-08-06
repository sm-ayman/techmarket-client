"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";

const Login = () => {
  const { user, loginUser, loginWithGoogle } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(email, password);
      const name = result?.displayName || result?.email || email;
      const isAdmin = (result?.email || email) === "admin@techmarket.com";
      toast({
        type: "success",
        title: isAdmin ? "Admin Access Granted" : "Welcome Back!",
        message: isAdmin ? "System access authenticated. Hello, Admin." : `Logged in as ${name}`,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      const msg = err.message.replace("Firebase: ", "");
      setError(msg);
      toast({ type: "error", title: "Auth Failed", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      toast({
        type: "success",
        title: "Google Auth Successful",
        message: `Welcome, ${result?.user?.displayName || "User"}!`,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      const msg = err.message.replace("Firebase: ", "");
      setError(msg);
      toast({ type: "error", title: "Google Auth Failed", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@techmarket.com");
    setPassword("admin123");
  };

  const fillCustomerCredentials = () => {
    setEmail("customer@techmarket.com");
    setPassword("customer123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8 border-t border-line">
      <div className="w-full max-w-md space-y-8 bg-surface-2 p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden">
        {/* Decorative neon blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-screen filter blur-[80px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-ink">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-ink-2">
            Or{" "}
            <Link
              href="/register"
              className="font-bold text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300 transition-all"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div 
            onClick={fillDemoCredentials}
            className="rounded-xl bg-surface-3 border border-cyan-500/50 p-4 text-xs text-cyan-600 dark:text-cyan-400 cursor-pointer hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-all flex flex-col justify-between"
          >
            <strong className="text-cyan-600 dark:text-cyan-400">Admin Demo:</strong>
            <div className="mt-2 space-y-1">
              <p>Email: <code className="block mt-0.5 font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-cyan-500/30 truncate" title="admin@techmarket.com">admin@techmarket.com</code></p>
              <p>Pass: <code className="block mt-0.5 font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-cyan-500/30">admin123</code></p>
            </div>
          </div>

          <div 
            onClick={fillCustomerCredentials}
            className="rounded-xl bg-surface-3 border border-pink-500/50 p-4 text-xs text-pink-600 dark:text-pink-400 cursor-pointer hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(255,0,255,0.15)] transition-all flex flex-col justify-between"
          >
            <strong className="text-pink-600 dark:text-pink-400">Customer Demo:</strong>
            <div className="mt-2 space-y-1">
              <p>Email: <code className="block mt-0.5 font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-pink-500/30 truncate" title="customer@techmarket.com">customer@techmarket.com</code></p>
              <p>Pass: <code className="block mt-0.5 font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-pink-500/30">customer123</code></p>
            </div>
          </div>
        </div>

        {error && (
          <div className="relative z-10 rounded-xl bg-pink-500/10 border border-pink-500/50 p-4 text-sm text-pink-600 dark:text-pink-400 shadow-[0_0_15px_rgba(255,0,255,0.1)]">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-4 py-3 bg-surface-3 border border-line-strong text-ink rounded-xl text-sm focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all placeholder-ink-3"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-4 py-3 bg-surface-3 border border-line-strong text-ink rounded-xl text-sm focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all placeholder-ink-3"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3.5 px-4 text-sm font-bold text-black shadow-[0_0_15px_rgba(0,243,255,0.3)] focus:outline-none disabled:opacity-50 transition-all cursor-pointer uppercase tracking-wider"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6 relative z-10">
          <div className="relative flex justify-center text-sm">
            <span className="bg-surface-2 px-4 text-ink-3 text-xs font-bold uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-surface-3 py-3.5 px-4 text-sm font-bold text-ink hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(255,0,255,0.1)] focus:outline-none transition-all cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
