"use client";

import React from "react";
import { Compass } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Wayfarer AI
              <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">
                • Trip Planner
              </span>
            </h1>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>Interactive Itinerary</span>
        </div>
      </div>
    </header>
  );
}
