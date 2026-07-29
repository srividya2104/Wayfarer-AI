"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, XCircle, Clock } from "lucide-react";
import { ApiError } from "@/lib/schemas";

interface ErrorStateProps {
  error: ApiError;
  onRetry: () => void;
  onClear: () => void;
}

export default function ErrorState({ error, onRetry, onClear }: ErrorStateProps) {
  const [countdown, setCountdown] = useState<number | null>(
    error.retryDelaySeconds && error.retryDelaySeconds > 0 ? error.retryDelaySeconds : null
  );

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isRateLimit = error.statusCode === 429;

  return (
    <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-xl p-5 sm:p-7 text-center flex flex-col items-center justify-center my-6 shadow-md relative overflow-hidden animate-in fade-in duration-200">
      {/* Warning Icon */}
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
        {isRateLimit ? <Clock className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6 animate-bounce" />}
      </div>

      {/* Clean Error Title */}
      <h3 className="text-lg font-bold text-slate-100 mb-1">
        {error.title || "Itinerary Generation Issue"}
      </h3>

      {/* User-Friendly Message */}
      <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-3 leading-relaxed">
        {error.message}
      </p>

      {/* Retry Delay Badge */}
      {countdown !== null && countdown > 0 && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Try again in approximately {countdown} seconds.</span>
        </div>
      )}

      {/* Action Buttons: Retry & Clear */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[38px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Generation</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 min-h-[38px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          <XCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear Alert</span>
        </button>
      </div>
    </div>
  );
}
