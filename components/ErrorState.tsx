"use client";

import React from "react";
import { AlertTriangle, RefreshCw, HelpCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="w-full bg-rose-950/20 border border-rose-800/40 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center my-6 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
        <AlertTriangle className="w-7 h-7 animate-bounce" />
      </div>

      <h3 className="text-lg font-bold text-rose-200 mb-2">Itinerary Generation Error</h3>

      <p className="text-sm text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-rose-900/30 max-w-lg mb-6 text-left font-mono break-words">
        {message || "An unexpected error occurred while communicating with the AI service."}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Generation</span>
        </button>
      </div>
    </div>
  );
}
