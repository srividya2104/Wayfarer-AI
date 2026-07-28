"use client";

import React from "react";
import { Sparkles, Code2, ShieldCheck, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-300">Wayfarer AI Planner</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Gemini 3.6 Flash</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Structured JSON</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Server Validation</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Next.js App Router</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Zod</span>
        </div>
      </div>
    </footer>
  );
}
