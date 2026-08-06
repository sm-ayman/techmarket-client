"use client";

import React, { useState, useCallback, useRef } from "react";
import { ToastContext } from "./ToastContext";

// ── Icons ────────────────────────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  cart: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const STYLES = {
  success: {
    border: "border-cyan-500/60",
    glow: "shadow-[0_0_20px_rgba(0,243,255,0.3)]",
    icon: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/50",
    title: "text-cyan-600 dark:text-cyan-400",
    bar: "bg-cyan-500",
    badge: "text-cyan-600/70 dark:text-cyan-500/60",
  },
  error: {
    border: "border-pink-500/60",
    glow: "shadow-[0_0_20px_rgba(255,0,128,0.3)]",
    icon: "bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/50",
    title: "text-pink-600 dark:text-pink-400",
    bar: "bg-pink-500",
    badge: "text-pink-600/70 dark:text-pink-500/60",
  },
  info: {
    border: "border-purple-500/60",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    icon: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/50",
    title: "text-purple-600 dark:text-purple-400",
    bar: "bg-purple-500",
    badge: "text-purple-600/70 dark:text-purple-500/60",
  },
  cart: {
    border: "border-cyan-500/60",
    glow: "shadow-[0_0_20px_rgba(0,243,255,0.3)]",
    icon: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/50",
    title: "text-cyan-600 dark:text-cyan-400",
    bar: "bg-cyan-500",
    badge: "text-cyan-600/70 dark:text-cyan-500/60",
  },
  warning: {
    border: "border-yellow-500/60",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
    icon: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/50",
    title: "text-yellow-600 dark:text-yellow-400",
    bar: "bg-yellow-500",
    badge: "text-yellow-600/70 dark:text-yellow-500/60",
  },
};

// Single toast tile
function ToastTile({ toast, onClose }) {
  const s = STYLES[toast.type] || STYLES.info;
  const icon = ICONS[toast.type] || ICONS.info;

  return (
    <div
      className={`
        relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]
        bg-surface-2/95 backdrop-blur-xl border ${s.border} ${s.glow}
        rounded-2xl p-4 overflow-hidden
        animate-[slideInRight_0.3s_cubic-bezier(0.22,1,0.36,1)_forwards]
      `}
    >
      {/* Scanline shimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-2xl" />

      {/* Icon */}
      <span className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl ${s.icon}`}>
        {icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className={`text-xs font-black uppercase tracking-widest ${s.badge}`}>
          SYS://NOTIFY
        </p>
        <p className={`text-sm font-bold ${s.title} mt-0.5`}>{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-ink-3 hover:text-ink transition-colors cursor-pointer mt-0.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Auto-dismiss progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${s.bar} rounded-full`}
        style={{
          animation: `shrink ${toast.duration || 3500}ms linear forwards`,
          width: "100%",
        }}
      />
    </div>
  );
}

// Provider
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback(({ title, message, type = "info", duration = 3500 }) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration + 400); // +400ms to allow exit animation
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container — fixed top-right */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastTile toast={t} onClose={dismiss} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(110%) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
