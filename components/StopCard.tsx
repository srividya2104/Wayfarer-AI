"use client";

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import { Stop } from "@/lib/schemas";

interface StopCardProps {
  stop: Stop;
  index: number;
  totalStops: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function StopCard({
  stop,
  index,
  totalStops,
  onRemove,
  onMoveUp,
  onMoveDown,
}: StopCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isFirst = index === 0;
  const isLast = index === totalStops - 1;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 transition-all duration-200 hover:border-slate-700 shadow-md group">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Sequential step index badge */}
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-mono font-bold text-indigo-400 shrink-0 mt-0.5">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                {stop.time}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                {stop.durationMinutes} min
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                {stop.location}
              </span>
            </div>

            <h5 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
              {stop.name}
            </h5>
          </div>
        </div>

        {/* Action Controls: Move Up, Move Down, Expand/Collapse, Delete */}
        <div className="flex items-center gap-1 shrink-0 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
          {/* Move Up Button */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move stop up"
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Move stop up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Move Down Button */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move stop down"
            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Move stop down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-800 my-auto mx-0.5" />

          {/* Toggle Details Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse details" : "Expand details"}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Delete Stop */}
          <button
            type="button"
            onClick={onRemove}
            title="Remove stop from itinerary"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            aria-label="Remove stop"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Stop Description */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>{stop.description}</p>
        </div>
      )}
    </div>
  );
}
