"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, MapPin, Calendar, CheckCircle2 } from "lucide-react";

const LOADING_STEPS = [
  "Connecting to Gemini AI Engine...",
  "Analyzing travel preferences & duration...",
  "Selecting top-rated attractions & hidden gems...",
  "Calculating realistic transit times...",
  "Validating structured JSON itinerary with Zod...",
  "Finalizing your interactive day-by-day plan...",
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 p-1.5 bg-purple-500 rounded-full text-white shadow-md">
          <Sparkles className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">Generating Your Custom Itinerary</h3>
      <p className="text-sm text-indigo-300 font-medium mb-6 animate-pulse">
        {LOADING_STEPS[currentStep]}
      </p>

      {/* Progress steps indicator */}
      <div className="w-full max-w-md space-y-2 text-left bg-slate-950/50 p-4 rounded-xl border border-slate-800">
        {LOADING_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-colors duration-300 ${
                isDone
                  ? "text-emerald-400 font-medium"
                  : isCurrent
                  ? "text-indigo-300 font-semibold"
                  : "text-slate-600"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>

      {/* Skeleton placeholders */}
      <div className="w-full max-w-xl mt-8 space-y-4 opacity-40">
        <div className="h-12 bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-800/60 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-800/60 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
