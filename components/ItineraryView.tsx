"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Layers,
  ChevronsDown,
  ChevronsUp,
  Download,
  Copy,
  Sparkles,
  DollarSign,
  Gauge,
  Sun,
  CheckCircle2,
} from "lucide-react";
import { Itinerary, Stop } from "@/lib/schemas";
import DayCard from "./DayCard";

interface ItineraryViewProps {
  itinerary: Itinerary;
  setItinerary: React.Dispatch<React.SetStateAction<Itinerary | null>>;
  onShowToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
}

export default function ItineraryView({
  itinerary,
  setItinerary,
  onShowToast,
}: ItineraryViewProps) {
  const [isGloballyExpanded, setIsGloballyExpanded] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Requirement 7: Smooth scroll into view & subtle scale success animation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Compute stats
  const totalStops = itinerary.days.reduce((acc, d) => acc + d.stops.length, 0);

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

  // Requirement 13: Copy Readable Itinerary to Clipboard
  const handleCopyItinerary = () => {
    let text = `✈️ ITINERARY: ${itinerary.destination} (${itinerary.durationDays} Days)\n`;
    text += `Budget: ${itinerary.budget || "Moderate"} | Pace: ${itinerary.pace || "Relaxed"}\n\n`;

    itinerary.days.forEach((day) => {
      text += `📅 DAY ${day.day}: ${day.title}\n`;
      day.stops.forEach((stop, idx) => {
        text += `  ${idx + 1}. [${stop.time}] ${stop.name} (${stop.durationMinutes} mins, ${stop.estimatedCost || "Free"})\n`;
        text += `     📍 ${stop.location}\n`;
        text += `     ${stop.description}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    onShowToast("Itinerary copied to clipboard!");
  };

  // Requirement 14: Download Structured JSON
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `itinerary-${itinerary.destination.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast("Exported JSON itinerary!");
  };

  return (
    <div
      ref={containerRef}
      className="w-full space-y-6 my-6 animate-in fade-in zoom-in-95 duration-500"
    >
      {/* 10. Dashboard Style Trip Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Verified Itinerary Dashboard
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {itinerary.destination}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Custom {itinerary.durationDays}-Day AI Travel Schedule
            </p>
          </div>

          {/* Quick Actions: Copy & Download */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyItinerary}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all active:scale-95 min-h-[44px]"
            >
              <Copy className="w-4 h-4 text-indigo-400" />
              <span>Copy Text</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Duration
            </div>
            <div className="text-sm font-bold text-slate-100 font-mono">{itinerary.durationDays} Days</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Total Stops
            </div>
            <div className="text-sm font-bold text-slate-100 font-mono">{totalStops} Stops</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Budget
            </div>
            <div className="text-sm font-bold text-emerald-300">{itinerary.budget || "Moderate"}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" /> Pace
            </div>
            <div className="text-sm font-bold text-amber-300">{itinerary.pace || "Relaxed"}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total Cost
            </div>
            <div className="text-sm font-bold text-slate-100 font-mono">{itinerary.estimatedTotalCost || "$150-$350"}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Best Time
            </div>
            <div className="text-xs font-bold text-slate-200 truncate">{itinerary.bestTimeToVisit || "Spring/Autumn"}</div>
          </div>
        </div>

        {/* 11. Trip Days Progress Indicator */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Trip Structure Breakdown</span>
            <span className="text-indigo-400 font-mono">{itinerary.days.length} Days Configured</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {itinerary.days.map((dayPlan) => (
              <div
                key={dayPlan.day}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Day {dayPlan.day} ({dayPlan.stops.length})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar: Expand All / Collapse All */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Interactive Day-by-Day Schedule
        </h3>

        <button
          type="button"
          onClick={() => setIsGloballyExpanded(!isGloballyExpanded)}
          className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors min-h-[40px]"
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

      {/* Days Accordion List */}
      <div className="space-y-4">
        {itinerary.days.map((dayPlan, dIdx) => (
          <DayCard
            key={dayPlan.day || dIdx}
            dayPlan={dayPlan}
            dayIndex={dIdx}
            isGloballyExpanded={isGloballyExpanded}
            onUpdateStops={(newStops) => handleUpdateDayStops(dIdx, newStops)}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </div>
  );
}
