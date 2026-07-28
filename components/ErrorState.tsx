"use client";

import React from "react";
import { AlertOctagon, RefreshCw, WifiOff, FileWarning, ShieldAlert } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const isNetwork = message.toLowerCase().includes("network") || message.toLowerCase().includes("fetch");
  const isValidation = message.toLowerCase().includes("invalid") || message.toLowerCase().includes("schema");

  return (
    <div className="w-full bg-slate-900/90 border border-rose-800/40 rounded-2xl p-6 sm:p-10 text-center flex flex-col items-center justify-center my-6 shadow-2xl relative overflow-hidden">
      {/* Illustrated Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400 shadow-inner">
        {isNetwork ? (
          <WifiOff className="w-8 h-8 animate-pulse" />
        ) : isValidation ? (
          <FileWarning className="w-8 h-8 animate-bounce" />
        ) : (
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">
        {isNetwork ? "Network Connection Error" : isValidation ? "AI Returned Invalid Response" : "Itinerary Generation Issue"}
      </h3>

      <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-6 leading-relaxed">
        {isNetwork
          ? "We couldn't connect to the server. Please check your internet connection or try again."
          : isValidation
          ? "The AI service generated a structure that didn't pass server-side Zod validation. Click retry to regenerate."
          : message}
      </p>

      {/* Raw Error Detail box */}
      <div className="w-full max-w-lg bg-slate-950/80 p-3 rounded-xl border border-rose-900/40 text-left font-mono text-xs text-rose-300 mb-6 overflow-x-auto">
        <span className="text-rose-500 font-bold">Error Detail: </span>
        {message}
      </div>

      {/* Retry Action Button */}
      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all duration-200 active:scale-95 min-h-[44px]"
      >
        <RefreshCw className="w-4 h-4" />
        <span>{isValidation ? "Try Again (Regenerate)" : "Retry Generation"}</span>
      </button>
    </div>
  );
}
