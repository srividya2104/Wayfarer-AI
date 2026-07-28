"use client";

import React from "react";
import { MapPin, Calendar, Layers, Sparkles, DollarSign, Sun, Footprints, Map } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center my-6 shadow-2xl relative overflow-hidden">
      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>Example Itinerary Preview</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">
        See What You Can Generate
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        Below is a live preview of how your AI-generated itinerary will look and function.
      </p>

      {/* 9. Enhanced Sample Trip Preview Card */}
      <div className="w-full max-w-lg bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 text-left shadow-xl relative group transition-all hover:border-indigo-500/50">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xl font-extrabold text-slate-100">Kyoto, Japan</h4>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest flex items-center gap-1">
            <Map className="w-3 h-3 text-indigo-400" /> Map Preview
          </span>
        </div>

        {/* Dashboard Metrics Badges */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-300 mb-4">
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> 3 Days
          </span>
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 flex items-center gap-1 font-mono">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> 12 Stops
          </span>
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-emerald-400 flex items-center gap-1 font-mono">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> $150 - $350
          </span>
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-amber-400 flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Spring & Autumn
          </span>
          <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-indigo-300 flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5 text-indigo-400" /> ~45 min/day walk
          </span>
        </div>

        {/* Day 1 Timeline Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 font-mono">DAY 1 • MORNING TO EVENING</span>
            <span className="text-[11px] text-slate-400">Higashiyama & Zen Culture</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Kiyomizu-dera Temple
              </span>
              <span className="text-[11px] text-slate-500 font-mono">09:00 AM • $10</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Gion District & Yasaka Shrine
              </span>
              <span className="text-[11px] text-slate-500 font-mono">11:30 AM • Free</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Traditional Matcha Tea Ceremony
              </span>
              <span className="text-[11px] text-slate-500 font-mono">02:30 PM • $25</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 font-medium">
          ✨ This is an example itinerary. Use the form above to generate your custom trip!
        </p>
      </div>
    </div>
  );
}
