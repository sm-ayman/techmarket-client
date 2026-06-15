"use client";

import React, { useEffect } from "react";

/**
 * Techy neon confirmation modal.
 *
 * Props:
 *  - isOpen        : boolean
 *  - onConfirm     : () => void
 *  - onCancel      : () => void
 *  - variant       : "danger" | "warning" | "success"  (default: "danger")
 *  - title         : string  — headline text
 *  - message       : string  — body description
 *  - confirmLabel  : string  — confirm button text (default: "Confirm")
 *  - cancelLabel   : string  — cancel button text  (default: "Cancel")
 *  - icon          : string  — emoji/icon override
 *  - detail        : string  — small extra detail line (optional)
 */
export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  variant = "danger",
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
  detail,
}) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variants = {
    danger: {
      border: "border-pink-500/60",
      glow: "shadow-[0_0_40px_rgba(255,0,128,0.25)]",
      accent: "text-pink-400",
      badge: "bg-pink-500/10 border border-pink-500/30 text-pink-400",
      bar: "from-pink-500 to-rose-500",
      confirmBtn: "bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_15px_rgba(255,0,128,0.5)] hover:shadow-[0_0_25px_rgba(255,0,128,0.8)]",
      iconBg: "bg-pink-500/10 border border-pink-500/30",
      defaultIcon: "🗑️",
    },
    warning: {
      border: "border-yellow-500/60",
      glow: "shadow-[0_0_40px_rgba(234,179,8,0.2)]",
      accent: "text-yellow-400",
      badge: "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",
      bar: "from-yellow-500 to-orange-500",
      confirmBtn: "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.8)]",
      iconBg: "bg-yellow-500/10 border border-yellow-500/30",
      defaultIcon: "⚠️",
    },
    success: {
      border: "border-cyan-500/60",
      glow: "shadow-[0_0_40px_rgba(0,243,255,0.2)]",
      accent: "text-cyan-400",
      badge: "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
      bar: "from-cyan-500 to-blue-500",
      confirmBtn: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)]",
      iconBg: "bg-cyan-500/10 border border-cyan-500/30",
      defaultIcon: "✅",
    },
  };

  const v = variants[variant] || variants.danger;
  const displayIcon = icon || v.defaultIcon;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Panel */}
      <div
        className={`
          relative w-full max-w-sm bg-[#0a0a0a] border ${v.border} ${v.glow}
          rounded-2xl overflow-hidden
          animate-[modalPop_0.25s_cubic-bezier(0.22,1,0.36,1)_forwards]
        `}
      >
        {/* Top neon bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${v.bar}`} />

        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)] pointer-events-none rounded-2xl" />

        <div className="p-6 relative z-10">
          {/* System badge */}
          <div className="flex items-center justify-between mb-5">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${v.badge}`}>
              SYS://CONFIRM_OP
            </span>
            <button
              onClick={onCancel}
              className="text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${v.iconBg}`}>
              {displayIcon}
            </div>
            <div>
              <h3 className={`text-base font-black tracking-tight ${v.accent}`}>
                {title}
              </h3>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{message}</p>
              {detail && (
                <p className="text-xs text-zinc-600 mt-2 font-mono border-l-2 border-zinc-700 pl-2">{detail}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800 my-5" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 text-sm font-bold hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${v.confirmBtn}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>

        {/* Bottom neon bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${v.bar} opacity-50`} />
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}
