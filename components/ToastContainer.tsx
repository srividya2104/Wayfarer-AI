"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { Toast } from "@/lib/schemas";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 text-slate-100 p-3.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === "warning" && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span className="text-xs font-medium truncate">{toast.message}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 transition-colors"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
