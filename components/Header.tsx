"use client";

import React from "react";
import { Plane } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
              Wayfarer AI
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Interactive Itinerary Generator
              </span>
            </h1>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">AI Online</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-300">Gemini 3.6 Flash</span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400">Structured JSON</span>
        </div>
      </div>
    </header>
  );
}
