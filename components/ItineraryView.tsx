"use client";

import React, { useState } from "react";
import { MapPin, Calendar, Layers, ChevronsDown, ChevronsUp, Download, Sparkles } from "lucide-react";
import { Itinerary, Stop } from "@/lib/schemas";
import DayCard from "./DayCard";

interface ItineraryViewProps {
  itinerary: Itinerary;
  setItinerary: React.Dispatch<React.SetStateAction<Itinerary | null>>;
}

export default function ItineraryView({ itinerary, setItinerary }: ItineraryViewProps) {
  const [isGloballyExpanded, setIsGloballyExpanded] = useState<boolean>(true);

  // Compute stats dynamically
  const totalStops = itinerary.days.reduce((acc, d) => acc + d.stops.length, 0);
  const totalMinutes = itinerary.days.reduce(
    (acc, d) => acc + d.stops.reduce((sAcc, s) => sAcc + s.durationMinutes, 0),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  const handleUpdateDayStops = (dayIndex: number, newStops: Stop[]) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      const updatedDays = [...prev.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        stops: newStops,
      };
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  return (
    <div className="w-full space-y-6 my-6">
      {/* Top Banner / Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                AI Generated Plan
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {itinerary.destination}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Customized {itinerary.durationDays}-Day Trip Plan
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-xs text-slate-400">Total Days</div>
              <div className="text-base font-bold text-slate-100 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4 text-indigo-400" />
                {itinerary.durationDays}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-xs text-slate-400">Total Stops</div>
              <div className="text-base font-bold text-slate-100 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                {totalStops}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-xs text-slate-400">Activity Time</div>
              <div className="text-base font-bold text-slate-100">
                ~{totalHours} hrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toolbar: Expand All / Collapse All */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Daily Schedule
        </h3>

        <button
          type="button"
          onClick={() => setIsGloballyExpanded(!isGloballyExpanded)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          {isGloballyExpanded ? (
            <>
              <ChevronsUp className="w-4 h-4 text-indigo-400" />
              <span>Collapse All Days</span>
            </>
          ) : (
            <>
              <ChevronsDown className="w-4 h-4 text-indigo-400" />
              <span>Expand All Days</span>
            </>
          )}
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {itinerary.days.map((dayPlan, dIdx) => (
          <DayCard
            key={dayPlan.day || dIdx}
            dayPlan={dayPlan}
            dayIndex={dIdx}
            isGloballyExpanded={isGloballyExpanded}
            onUpdateStops={(newStops) => handleUpdateDayStops(dIdx, newStops)}
          />
        ))}
      </div>
    </div>
  );
}
