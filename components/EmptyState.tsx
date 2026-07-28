"use client";

import React from "react";
import { Compass, MapPin, Sparkles, Clock, ShieldCheck } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400 shadow-inner">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">
        Ready for Your Next Adventure?
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        Describe your dream destination above, choose your preferred pace and budget, and let AI build a detailed interactive schedule in seconds.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full max-w-2xl">
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <MapPin className="w-5 h-5 text-indigo-400 mb-2" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">Interactive Days</h4>
          <p className="text-xs text-slate-400">Reorder stops up/down or remove activities dynamically on the fly.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">Schema Defended</h4>
          <p className="text-xs text-slate-400">Guaranteed structured JSON itineraries validated server-side by Zod.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <Clock className="w-5 h-5 text-purple-400 mb-2" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">Real Timings</h4>
          <p className="text-xs text-slate-400">Accurate estimated duration and morning-to-evening scheduling.</p>
        </div>
      </div>
    </div>
  );
}
