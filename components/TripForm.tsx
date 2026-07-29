"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, DollarSign, Gauge, Tag, Globe, Command, Loader2 } from "lucide-react";
import { TripInput } from "@/lib/schemas";

interface TripFormProps {
  onSubmit: (input: TripInput) => void;
  isLoading: boolean;
}

const POPULAR_DESTINATIONS = [
  {
    name: "Kyoto, Japan ⛩️",
    prompt: "3 days in Kyoto: Arashiyama bamboo grove, historic Fushimi Inari torii gates, authentic ramen, and traditional tea ceremony.",
    duration: 3,
    budget: "Moderate" as const,
    pace: "Moderate" as const,
    interests: ["Culture & History", "Food & Dining"],
  },
  {
    name: "Amalfi, Italy 🇮🇹",
    prompt: "4 days in Amalfi Coast: Positano coastal walks, boat tours, lemon groves, authentic Italian pasta, and cliffside sunsets.",
    duration: 4,
    budget: "Luxury" as const,
    pace: "Relaxed" as const,
    interests: ["Nature & Outdoors", "Food & Dining"],
  },
  {
    name: "Swiss Alps 🇨🇭",
    prompt: "5 days in Switzerland: Interlaken scenic trains, Jungfraujoch mountain peaks, mountain lake hikes, and cozy fondue spots.",
    duration: 5,
    budget: "Luxury" as const,
    pace: "Moderate" as const,
    interests: ["Nature & Outdoors", "Hidden Gems"],
  },
  {
    name: "Bali, Indonesia 🇮🇩",
    prompt: "4 days in Bali: Ubud rice terraces, monkey forest, beach sunset dining, wellness spa sessions, and water temples.",
    duration: 4,
    budget: "Budget" as const,
    pace: "Relaxed" as const,
    interests: ["Relaxation & Spa", "Culture & History"],
  },
  {
    name: "Fjords, Norway 🇳🇴",
    prompt: "5 days in Norway: Bergen wharf, Geirangerfjord cruise, scenic train rides, waterfall viewpoints, and seafood tasting.",
    duration: 5,
    budget: "Moderate" as const,
    pace: "Packed" as const,
    interests: ["Nature & Outdoors", "Art & Museums"],
  },
];

const AVAILABLE_INTERESTS = [
  "Culture & History",
  "Food & Dining",
  "Nature & Outdoors",
  "Art & Museums",
  "Shopping",
  "Relaxation & Spa",
  "Nightlife",
  "Hidden Gems",
];

const MAX_CHARS = 500;

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [prompt, setPrompt] = useState("");
  const [durationDays, setDurationDays] = useState(3);
  const [budget, setBudget] = useState<"Budget" | "Moderate" | "Luxury">("Moderate");
  const [pace, setPace] = useState<"Relaxed" | "Moderate" | "Packed">("Moderate");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Culture & History", "Food & Dining"]);
  
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isInvalid = (touched || submitted) && (!prompt.trim() || prompt.trim().length < 5);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleApplyDestination = (dest: (typeof POPULAR_DESTINATIONS)[0]) => {
    if (isLoading) return;
    setPrompt(dest.prompt);
    setDurationDays(dest.duration);
    setBudget(dest.budget);
    setPace(dest.pace);
    setSelectedInterests(dest.interests);
    setTouched(false);
    setSubmitted(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return; // Prevent multiple simultaneous submissions

    setSubmitted(true);

    if (!prompt.trim() || prompt.trim().length < 5) {
      return;
    }

    onSubmit({
      prompt: prompt.trim(),
      durationDays,
      budget,
      pace,
      interests: selectedInterests,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt, durationDays, budget, pace, selectedInterests, isLoading]);

  const charLength = prompt.length;
  const charCounterColor =
    charLength > 480
      ? "text-rose-400 font-bold"
      : charLength > 400
      ? "text-amber-400 font-medium"
      : "text-slate-500";

  return (
    <div className="w-full space-y-5">
      {/* Clean Internship-Style Hero Header */}
      <div className="text-center space-y-1.5 py-1 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Wayfarer AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-normal">
          Plan your trip with AI and generate a personalized itinerary.
        </p>
      </div>

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md"
      >
        {/* Destination Presets */}
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Sample Destinations:
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DESTINATIONS.map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyDestination(dest)}
                disabled={isLoading}
                aria-label={`Fill form with ${dest.name} details`}
                className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 hover:text-indigo-200 border border-slate-700/70 rounded-lg px-2.5 py-1 transition-all flex items-center gap-1.5 group disabled:opacity-50 min-h-[34px] active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Free-form Prompt Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="prompt-input" className="block text-xs sm:text-sm font-medium text-slate-200">
              Trip Description & Requests <span className="text-rose-400">*</span>
            </label>
            <span className={`text-xs font-mono ${charCounterColor}`}>
              {charLength} / {MAX_CHARS}
            </span>
          </div>

          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setPrompt(e.target.value);
              }
            }}
            onBlur={() => setTouched(true)}
            disabled={isLoading}
            rows={3}
            maxLength={MAX_CHARS}
            placeholder="e.g., 3 days in Tokyo visiting anime spots, historic shrines, street food markets, and a day trip to Kamakura."
            aria-label="Trip description input"
            className={`w-full bg-slate-950/80 border ${
              isInvalid ? "border-rose-500/80 focus:ring-rose-500/50" : "border-slate-700/80 focus:ring-indigo-500/80 focus:border-indigo-500"
            } rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm resize-none disabled:opacity-50`}
          />

          {isInvalid && (
            <p className="mt-1 text-xs text-rose-400 font-medium animate-in fade-in duration-200">
              Please enter a trip description (at least 5 characters).
            </p>
          )}
        </div>

        {/* Options: Duration, Budget, Pace */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <label htmlFor="duration-slider" className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Duration
              </span>
              <span className="text-indigo-400 font-bold text-xs font-mono">{durationDays} {durationDays === 1 ? "Day" : "Days"}</span>
            </label>
            <input
              id="duration-slider"
              type="range"
              min={1}
              max={10}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              disabled={isLoading}
              aria-label="Select trip duration in days"
              className="w-full accent-indigo-500 cursor-pointer disabled:opacity-50 min-h-[28px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 day</span>
              <span>5 days</span>
              <span>10 days</span>
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Budget Style
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Budget", "Moderate", "Luxury"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  disabled={isLoading}
                  aria-label={`Select ${b} budget`}
                  className={`text-xs py-1 rounded-md border font-medium transition-all min-h-[34px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    budget === b
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              Travel Pace
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Relaxed", "Moderate", "Packed"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPace(p)}
                  disabled={isLoading}
                  aria-label={`Select ${p} travel pace`}
                  className={`text-xs py-1 rounded-md border font-medium transition-all min-h-[34px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    pace === p
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
            <Tag className="w-3.5 h-3.5 text-purple-400" />
            Interests
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_INTERESTS.map((interest) => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  disabled={isLoading}
                  aria-label={`Toggle interest ${interest}`}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all min-h-[32px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                    active
                      ? "bg-purple-500/20 border-purple-500/60 text-purple-300 font-medium"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {interest} {active ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Generate AI Itinerary"
          className="w-full py-3 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm min-h-[44px] focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating Itinerary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Itinerary</span>
              <span className="text-[11px] opacity-75 font-normal bg-black/20 px-2 py-0.5 rounded flex items-center gap-1 ml-auto">
                <Command className="w-3 h-3" /> + Enter
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
