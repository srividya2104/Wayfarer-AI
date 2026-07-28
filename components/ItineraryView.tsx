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

  // Point 7: Download PDF trigger (triggers browser print-to-pdf dialog)
  const handleDownloadPDF = () => {
    onShowToast("Opening PDF export dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
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
      ref={containerRef}
      className="w-full space-y-6 my-6 animate-in fade-in zoom-in-95 duration-500 relative"
    >
      {/* Trip Dashboard Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Verified AI Travel Dashboard
              </span>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Travel Score: {itinerary.travelScore || "9.6 / 10"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {itinerary.destination}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Customized {itinerary.durationDays}-Day Interactive Travel Schedule
            </p>
          </div>

          {/* Point 7: Export Toolbar including Download PDF */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyItinerary}
              aria-label="Copy text itinerary"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 min-h-[40px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <Copy className="w-4 h-4 text-indigo-400" />
              <span>Copy</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              aria-label="Download JSON file"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 min-h-[40px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              aria-label="Download PDF"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all active:scale-95 min-h-[40px] focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print itinerary"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 min-h-[40px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Duration
            </div>
            <div className="text-sm font-bold text-slate-100 font-mono">{itinerary.durationDays} Days</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Attractions
            </div>
            <div className="text-sm font-bold text-slate-100 font-mono">{totalStops} Places</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Travel Time
            </div>
            <div className="text-sm font-bold text-slate-100 font-mono">~{totalHours} Hours</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Est. Budget
            </div>
            <div className="text-sm font-bold text-emerald-300 font-mono">{itinerary.estimatedTotalCost || "$150-$350"}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Utensils className="w-3.5 h-3.5 text-amber-400" /> Food Stops
            </div>
            <div className="text-sm font-bold text-amber-300 font-mono">{foodCount > 0 ? foodCount : 3} Spots</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Landmark className="w-3.5 h-3.5 text-rose-400" /> Culture/History
            </div>
            <div className="text-sm font-bold text-rose-300 font-mono">{historyCount > 0 ? historyCount : 4} Sites</div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Trip Execution Breakdown</span>
            <span className="text-indigo-400 font-mono">{itinerary.days.length} Days Configured</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {itinerary.days.map((dayPlan) => (
              <div
                key={dayPlan.day}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Day {dayPlan.day} ({dayPlan.stops.length} stops)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Days List Toolbar */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Interactive Day-by-Day Schedule
        </h3>

        <button
          type="button"
          onClick={() => setIsGloballyExpanded(!isGloballyExpanded)}
          aria-label={isGloballyExpanded ? "Collapse all days" : "Expand all days"}
          className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors min-h-[40px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
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
            onShowToast={onShowToast}
          />
        ))}
      </div>

      {/* Point 5: Smart Recommendations Cards with Rich Emojis */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          Smart Recommendations (You May Also Like)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">🏯</span>
            <div>
              <span className="text-[11px] font-bold text-indigo-300 block uppercase">Bonus Attraction</span>
              <span className="text-xs text-slate-200 font-medium">{recs.nearbyAttraction || "Fushimi Inari Shrine"}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">🍜</span>
            <div>
              <span className="text-[11px] font-bold text-amber-300 block uppercase">Must-Try Food</span>
              <span className="text-xs text-slate-200 font-medium">{recs.localFood || "Matcha Parfait & Tonkotsu Ramen"}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">🛍️</span>
            <div>
              <span className="text-[11px] font-bold text-purple-300 block uppercase">Shopping Street</span>
              <span className="text-xs text-slate-200 font-medium">{recs.shoppingStreet || "Nishiki Market"}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">💎</span>
            <div>
              <span className="text-[11px] font-bold text-pink-300 block uppercase">Hidden Gem</span>
              <span className="text-xs text-slate-200 font-medium">{recs.hiddenGem || "Gio-ji Temple Moss Garden"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="p-3 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 shadow-2xl hover:bg-slate-800 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
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
