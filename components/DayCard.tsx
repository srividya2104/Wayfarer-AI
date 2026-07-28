"use client";

import React, { useState, useEffect, memo } from "react";
import { ChevronDown, ChevronUp, Calendar, Footprints, DollarSign, CloudSun } from "lucide-react";
import { DayPlan, Stop } from "@/lib/schemas";
import StopCard from "./StopCard";

interface DayCardProps {
  dayPlan: DayPlan;
  dayIndex: number;
  isGloballyExpanded?: boolean;
  onUpdateStops: (newStops: Stop[]) => void;
  onShowToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
}

const DayCard = memo(function DayCard({
  dayPlan,
  dayIndex,
  isGloballyExpanded,
  onUpdateStops,
  onShowToast,
}: DayCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Sync with global expand/collapse toggle
  useEffect(() => {
    if (isGloballyExpanded !== undefined) {
      setIsOpen(isGloballyExpanded);
    }
  }, [isGloballyExpanded]);

  // Handler: Remove a stop with Undo option in Toast notification
  const handleRemoveStop = (stopIndex: number) => {
    const removedStop = dayPlan.stops[stopIndex];
    const updated = dayPlan.stops.filter((_, idx) => idx !== stopIndex);
    onUpdateStops(updated);

    onShowToast(`Removed "${removedStop.name}"`, "Undo", () => {
      const restored = [...updated];
      restored.splice(stopIndex, 0, removedStop);
      onUpdateStops(restored);
    });
  };

  // Handler: Move stop UP
  const handleMoveUp = (stopIndex: number) => {
    if (stopIndex <= 0) return;
    const updated = [...dayPlan.stops];
    const temp = updated[stopIndex];
    updated[stopIndex] = updated[stopIndex - 1];
    updated[stopIndex - 1] = temp;
    onUpdateStops(updated);
    onShowToast(`Moved "${temp.name}" up`);
  };

  // Handler: Move stop DOWN
  const handleMoveDown = (stopIndex: number) => {
    if (stopIndex >= dayPlan.stops.length - 1) return;
    const updated = [...dayPlan.stops];
    const temp = updated[stopIndex];
    updated[stopIndex] = updated[stopIndex + 1];
    updated[stopIndex + 1] = temp;
    onUpdateStops(updated);
    onShowToast(`Moved "${temp.name}" down`);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Day Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-label={`Toggle Day ${dayPlan.day} schedule`}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer bg-slate-900/70 hover:bg-slate-900 transition-colors select-none focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-extrabold text-indigo-300 text-sm shrink-0">
            D{dayPlan.day}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                DAY {dayPlan.day}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">
                {dayPlan.stops.length} {dayPlan.stops.length === 1 ? "Stop" : "Stops"}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              {dayPlan.title}
            </h4>
          </div>
        </div>

        {/* Day Meta Information Badges & Chevron */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800 flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-indigo-400" />
            {dayPlan.estimatedWalkingTime || "45 mins walk"}
          </span>

          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-950/80 text-emerald-300 border border-slate-800 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            {dayPlan.dayCostEstimate || "$40 - $80"}
          </span>

          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-950/80 text-amber-300 border border-slate-800 flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            {dayPlan.weatherForecast || "Sunny 22°C"}
          </span>

          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 ml-auto sm:ml-0">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Day Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-800/80 space-y-3 bg-slate-950/40 animate-in fade-in duration-200">
          {dayPlan.stops.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              All stops removed for Day {dayPlan.day}. You can regenerate or restore stops.
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
});

export default DayCard;
