"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-5 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-semibold text-slate-300">Wayfarer AI Planner</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Compact Tech Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Gemini 3.6 Flash</span>
          <span className="text-slate-700">•</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Structured JSON</span>
          <span className="text-slate-700">•</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Zod Validated</span>
          <span className="text-slate-700">•</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Next.js App Router</span>
        </div>
      </div>
    </footer>
  );
}
