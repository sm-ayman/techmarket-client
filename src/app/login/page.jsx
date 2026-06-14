"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { user, loginUser, loginWithGoogle } = useContext(AuthContext);
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
      await loginUser(email, password);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@techmarket.com");
    setPassword("admin123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] px-4 py-12 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="w-full max-w-md space-y-8 bg-[#0a0a0a] p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,243,255,0.15)] relative overflow-hidden">
        {/* Decorative neon blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-white neon-text-cyan">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Or{" "}
            <Link
              href="/register"
              className="font-bold text-pink-400 hover:text-pink-300 hover:neon-text-pink transition-all"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div 
          onClick={fillDemoCredentials}
          className="relative z-10 rounded-xl bg-[#050505] border border-cyan-500/50 p-4 text-xs text-cyan-400 cursor-pointer hover:bg-cyan-500/10 hover:neon-glow-cyan transition-all"
        >
          <strong className="neon-text-cyan">Click to use Admin Credentials:</strong><br />
          <div className="mt-2 space-y-1">
            <p>Email: <code className="font-mono bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-cyan-500/30">admin@techmarket.com</code></p>
            <p>Password: <code className="font-mono bg-[#0a0a0a] px-1.5 py-0.5 rounded border border-cyan-500/30">admin123</code></p>
          </div>
        </div>

        {error && (
          <div className="relative z-10 rounded-xl bg-pink-950/30 border border-pink-500/50 p-4 text-sm text-pink-400 neon-glow-pink">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-4 py-3 bg-[#050505] border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all placeholder-zinc-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-4 py-3 bg-[#050505] border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all placeholder-zinc-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 py-3.5 px-4 text-sm font-bold text-black neon-glow-cyan focus:outline-none disabled:opacity-50 transition-all cursor-pointer uppercase tracking-wider"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6 relative z-10">
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#0a0a0a] px-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-[#050505] py-3.5 px-4 text-sm font-bold text-white hover:border-pink-500/50 hover:bg-pink-500/10 hover:neon-glow-pink focus:outline-none transition-all cursor-pointer"
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
