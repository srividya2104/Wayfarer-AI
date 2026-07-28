"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, MapPin, Calendar, Clock } from "lucide-react";

const LOADING_MESSAGES = [
  "Analyzing destination & local highlights...",
  "Planning daily schedule & transit routes...",
  "Optimizing travel time & pacing...",
  "Finalizing itinerary & validating JSON structure...",
];

export default function LoadingState() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 sm:p-10 my-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Top Banner Status */}
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generating Itinerary...</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-100 transition-all duration-300">
          {LOADING_MESSAGES[msgIdx]}
        </h3>
        <p className="text-xs text-slate-400">
          Gemini 3.6 Flash engine is crafting your customized schedule.
        </p>
      </div>

      {/* Animated Skeleton Cards */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Skeleton Day 1 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-slate-800 rounded-lg" />
            <div className="h-5 w-20 bg-slate-800/80 rounded-md" />
          </div>

          <div className="space-y-3">
            <div className="h-20 bg-slate-900 border border-slate-800/60 rounded-lg p-3 flex flex-col justify-between">
              <div className="h-4 w-1/2 bg-slate-800 rounded" />
              <div className="h-3 w-3/4 bg-slate-800/60 rounded" />
            </div>

            <div className="h-20 bg-slate-900 border border-slate-800/60 rounded-lg p-3 flex flex-col justify-between">
              <div className="h-4 w-2/5 bg-slate-800 rounded" />
              <div className="h-3 w-2/3 bg-slate-800/60 rounded" />
            </div>
          </div>
        </div>

        {/* Skeleton Day 2 */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4 animate-pulse opacity-60">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-slate-800 rounded-lg" />
            <div className="h-5 w-20 bg-slate-800/80 rounded-md" />
          </div>

          <div className="h-20 bg-slate-900 border border-slate-800/60 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
