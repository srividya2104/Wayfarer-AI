"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, MapPin, Plus } from "lucide-react";
import { DayPlan, Stop } from "@/lib/schemas";
import StopCard from "./StopCard";

interface DayCardProps {
  dayPlan: DayPlan;
  dayIndex: number;
  isGloballyExpanded?: boolean;
  onUpdateStops: (newStops: Stop[]) => void;
}

export default function DayCard({
  dayPlan,
  dayIndex,
  isGloballyExpanded,
  onUpdateStops,
}: DayCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Sync with global expand/collapse state when changed by parent
  useEffect(() => {
    if (isGloballyExpanded !== undefined) {
      setIsOpen(isGloballyExpanded);
    }
  }, [isGloballyExpanded]);

  // Handler: Remove a stop immutably
  const handleRemoveStop = (stopIndex: number) => {
    const updated = dayPlan.stops.filter((_, idx) => idx !== stopIndex);
    onUpdateStops(updated);
  };

  // Handler: Move a stop UP immutably
  const handleMoveUp = (stopIndex: number) => {
    if (stopIndex <= 0) return;
    const updated = [...dayPlan.stops];
    const temp = updated[stopIndex];
    updated[stopIndex] = updated[stopIndex - 1];
    updated[stopIndex - 1] = temp;
    onUpdateStops(updated);
  };

  // Handler: Move a stop DOWN immutably
  const handleMoveDown = (stopIndex: number) => {
    if (stopIndex >= dayPlan.stops.length - 1) return;
    const updated = [...dayPlan.stops];
    const temp = updated[stopIndex];
    updated[stopIndex] = updated[stopIndex + 1];
    updated[stopIndex + 1] = temp;
    onUpdateStops(updated);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Day Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-sm">
            Day {dayPlan.day}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              {dayPlan.title}
            </h4>
            <p className="text-xs text-slate-400">
              {dayPlan.stops.length} {dayPlan.stops.length === 1 ? "stop" : "stops"} scheduled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {isOpen ? "Collapse" : "Expand"}
          </span>
          <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Accordion Body Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
          {dayPlan.stops.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              All stops removed for this day.
            </div>
          ) : (
            dayPlan.stops.map((stop, sIdx) => (
              <StopCard
                key={stop.id || `d${dayPlan.day}-s${sIdx}`}
                stop={stop}
                index={sIdx}
                totalStops={dayPlan.stops.length}
                onRemove={() => handleRemoveStop(sIdx)}
                onMoveUp={() => handleMoveUp(sIdx)}
                onMoveDown={() => handleMoveDown(sIdx)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
