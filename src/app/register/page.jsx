"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const { user, createUser, updateUserProfile } = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await createUser(email, password);
      // Wait for auth to finish, then update displayName
      await updateUserProfile(name, "");
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-zinc-100 shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-teal-500 hover:text-teal-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="relative block w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder-zinc-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder-zinc-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder-zinc-400"
                placeholder="•••••••• (Min 6 chars)"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder-zinc-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 py-3 px-4 text-sm font-semibold text-white hover:from-teal-600 hover:to-emerald-500 shadow-md shadow-teal-500/10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
