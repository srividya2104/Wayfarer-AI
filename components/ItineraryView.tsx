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
  DollarSign,
  Gauge,
  Sun,
  Printer,
  Clock,
  Compass,
  Utensils,
  Landmark,
  ArrowUp,
  FileText,
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalStops = itinerary.days.reduce((acc, d) => acc + d.stops.length, 0);
  const totalMinutes = itinerary.days.reduce(
    (acc, d) => acc + d.stops.reduce((sAcc, s) => sAcc + s.durationMinutes, 0),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  let foodCount = 0;
  let historyCount = 0;
  itinerary.days.forEach((day) => {
    day.stops.forEach((stop) => {
      const text = (stop.name + " " + stop.description).toLowerCase();
      if (text.includes("ramen") || text.includes("food") || text.includes("cafe") || text.includes("dining") || text.includes("tea")) {
        foodCount++;
      }
      if (text.includes("temple") || text.includes("shrine") || text.includes("museum") || text.includes("historic") || text.includes("castle")) {
        historyCount++;
      }
    });
  });

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

  const handleCopyItinerary = () => {
    let text = `Wayfarer AI - Trip Itinerary: ${itinerary.destination} (${itinerary.durationDays} Days)\n`;
    text += `Budget: ${itinerary.budget || "Moderate"} | Pace: ${itinerary.pace || "Relaxed"}\n\n`;

    itinerary.days.forEach((day) => {
      text += `DAY ${day.day}: ${day.title}\n`;
      day.stops.forEach((stop, idx) => {
        text += `  ${idx + 1}. [${stop.time}] ${stop.name} (${stop.durationMinutes} mins, ${stop.estimatedCost || "Free"})\n`;
        text += `     Location: ${stop.location}\n`;
        text += `     Note: ${stop.description}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    onShowToast("Itinerary copied to clipboard!");
  };

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

  const handleDownloadPDF = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recs = itinerary.smartRecommendations || {};

  return (
    <div
      id="itinerary-print-area"
      ref={containerRef}
      className="w-full space-y-5 my-6 animate-in fade-in duration-300 relative"
    >
      {/* Clean Trip Summary Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider font-mono">
              Wayfarer AI • Travel Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              {itinerary.destination}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {itinerary.durationDays}-Day Personalized Travel Itinerary
            </p>
          </div>

          {/* Export Toolbar (Hidden during print) */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={handleCopyItinerary}
              aria-label="Copy text itinerary"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 min-h-[36px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              aria-label="Download JSON file"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[36px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              aria-label="Download PDF report"
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 min-h-[36px] focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print itinerary"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 min-h-[36px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Clean Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Calendar className="w-3 h-3 text-indigo-400" /> Duration
            </div>
            <div className="text-xs font-bold text-slate-100 font-mono">{itinerary.durationDays} Days</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Layers className="w-3 h-3 text-purple-400" /> Total Stops
            </div>
            <div className="text-xs font-bold text-slate-100 font-mono">{totalStops} Attractions</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Est. Budget
            </div>
            <div className="text-xs font-bold text-emerald-300 font-mono">{itinerary.estimatedTotalCost || "$150-$350"}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Gauge className="w-3 h-3 text-amber-400" /> Pace
            </div>
            <div className="text-xs font-bold text-amber-300">{itinerary.pace || "Relaxed"}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Utensils className="w-3 h-3 text-amber-400" /> Food Spots
            </div>
            <div className="text-xs font-bold text-amber-300 font-mono">{foodCount > 0 ? foodCount : 3} Places</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-0.5">
              <Sun className="w-3 h-3 text-amber-400" /> Best Season
            </div>
            <div className="text-xs font-bold text-slate-200 truncate">{itinerary.bestTimeToVisit || "Spring/Autumn"}</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Expand/Collapse (Hidden during print) */}
      <div className="flex items-center justify-between px-1 no-print">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Day-by-Day Itinerary
        </h3>

        <button
          type="button"
          onClick={() => setIsGloballyExpanded(!isGloballyExpanded)}
          aria-label={isGloballyExpanded ? "Collapse all days" : "Expand all days"}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors min-h-[36px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          {isGloballyExpanded ? (
            <>
              <ChevronsUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Collapse All Days</span>
            </>
          ) : (
            <>
              <ChevronsDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Expand All Days</span>
            </>
          )}
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-3.5">
        {itinerary.days.map((dayPlan, dIdx) => (
          <div key={dayPlan.day || dIdx} className="print-day-card">
            <DayCard
              dayPlan={dayPlan}
              dayIndex={dIdx}
              isGloballyExpanded={isGloballyExpanded}
              onUpdateStops={(newStops) => handleUpdateDayStops(dIdx, newStops)}
              onShowToast={onShowToast}
            />
          </div>
        ))}
      </div>

      {/* Smart Recommendations Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-md print-day-card">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          Recommendations & Highlights
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <span className="text-xl">🏯</span>
            <div>
              <span className="text-[10px] font-bold text-indigo-300 block uppercase">Bonus Attraction</span>
              <span className="text-xs text-slate-200 font-medium">{recs.nearbyAttraction || "Fushimi Inari Shrine"}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <span className="text-xl">🍜</span>
            <div>
              <span className="text-[10px] font-bold text-amber-300 block uppercase">Food Recommendation</span>
              <span className="text-xs text-slate-200 font-medium">{recs.localFood || "Matcha Parfait & Tonkotsu Ramen"}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <span className="text-xl">💎</span>
            <div>
              <span className="text-[10px] font-bold text-pink-300 block uppercase">Hidden Gem</span>
              <span className="text-xs text-slate-200 font-medium">{recs.hiddenGem || "Gio-ji Temple Moss Garden"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button (Hidden during print) */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 no-print">
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 shadow-lg hover:bg-slate-800 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
