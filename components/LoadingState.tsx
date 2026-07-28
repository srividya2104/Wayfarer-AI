"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Loader2, MapPin, Calendar, Utensils, Route, ShieldCheck, PartyPopper } from "lucide-react";

const WORKFLOW_STEPS = [
  { label: "Understanding your destination...", icon: Sparkles },
  { label: "Planning the best route...", icon: Route },
  { label: "Finding attractions & landmarks...", icon: MapPin },
  { label: "Matching your pace & interests...", icon: Utensils },
  { label: "Creating daily schedule...", icon: Calendar },
  { label: "Validating structured JSON with Zod...", icon: ShieldCheck },
  { label: "Finalizing itinerary...", icon: PartyPopper },
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < WORKFLOW_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 sm:p-10 my-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Main Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/20 mb-1">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">
          Crafting Your AI Itinerary
        </h3>
        <p className="text-xs text-indigo-300 font-medium animate-pulse">
          {WORKFLOW_STEPS[activeStep].label}
        </p>
      </div>

      {/* Animated Step List */}
      <div className="max-w-md mx-auto bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 relative z-10">
        {WORKFLOW_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? "text-emerald-400 font-medium"
                  : isCurrent
                  ? "text-indigo-300 font-semibold scale-[1.02] translate-x-1"
                  : "text-slate-600 opacity-60"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  isDone
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isCurrent
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-slate-900 border-slate-800 text-slate-700"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                ) : (
                  <StepIcon className="w-3.5 h-3.5" />
                )}
              </div>

              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Skeleton placeholders */}
      <div className="max-w-xl mx-auto space-y-3 opacity-30">
        <div className="h-10 bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-20 bg-slate-800/60 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
