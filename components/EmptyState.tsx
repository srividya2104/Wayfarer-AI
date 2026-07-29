"use client";

import React from "react";
import { MapPin, Calendar, Layers, DollarSign, Sun, Footprints } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-7 text-center flex flex-col items-center justify-center my-6 shadow-md">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Example Itinerary Preview
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-1">
        Sample Itinerary Output
      </h3>
      <p className="text-xs text-slate-400 max-w-md mb-5">
        Here is how your generated itinerary will look. Use the form above to create your own!
      </p>

      {/* Clean Sample Trip Preview Card */}
      <div className="w-full max-w-lg bg-slate-950/90 border border-slate-800 rounded-xl p-5 text-left shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <h4 className="text-lg font-bold text-slate-100">Kyoto, Japan</h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Sample
          </span>
        </div>

        {/* Essential Badges Only */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-300 mb-4">
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-indigo-400" /> 3 Days
          </span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1 font-mono">
            <Layers className="w-3 h-3 text-purple-400" /> 12 Stops
          </span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-emerald-400 flex items-center gap-1 font-mono">
            <DollarSign className="w-3 h-3 text-emerald-400" /> $150 - $350
          </span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-amber-300 flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" /> Spring & Autumn
          </span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400 flex items-center gap-1">
            <Footprints className="w-3 h-3 text-indigo-400" /> ~45 min walk
          </span>
        </div>

        {/* Day 1 Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 font-mono">DAY 1</span>
            <span className="text-slate-400">Higashiyama Temples & Tea</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded border border-slate-800/80">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Kiyomizu-dera Temple
              </span>
              <span className="text-[11px] text-slate-500 font-mono">09:00 AM • $10</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded border border-slate-800/80">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Gion District & Yasaka Shrine
              </span>
              <span className="text-[11px] text-slate-500 font-mono">11:30 AM • Free</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded border border-slate-800/80">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                Matcha Tea Ceremony
              </span>
              <span className="text-[11px] text-slate-500 font-mono">02:30 PM • $25</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          This is an example itinerary. Generate your own using AI above.
        </p>
      </div>
    </div>
  );
}
