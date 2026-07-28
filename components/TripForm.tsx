"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, DollarSign, Gauge, Tag, Compass, CheckCircle2, Globe, Command } from "lucide-react";
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

  // Keyboard shortcut listener: Ctrl + Enter / Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt, durationDays, budget, pace, selectedInterests]);

  const charLength = prompt.length;
  const charCounterColor =
    charLength > 480
      ? "text-rose-400 font-bold"
      : charLength > 400
      ? "text-amber-400 font-medium"
      : "text-slate-500";

  return (
    <div className="w-full space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 py-2 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Design Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Perfect Journey</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Generate structured AI travel itineraries that you can edit, reorder, and customize in seconds.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            Structured JSON
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            Server Validated
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
            Interactive Itinerary
          </span>
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-slate-700/80"
      >
        {/* Requirement 12: Popular Destinations Preset Pills */}
        <div className="mb-6">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Select a Popular Destination Preset:
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DESTINATIONS.map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyDestination(dest)}
                disabled={isLoading}
                className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 hover:text-indigo-200 border border-slate-700/70 rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 group disabled:opacity-50 min-h-[36px] active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Free-form Prompt Field */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-200">
              Trip Description & Specific Requests <span className="text-rose-400">*</span>
            </label>
            <span className={`text-xs font-mono ${charCounterColor}`}>
              {charLength} / {MAX_CHARS} characters
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
            className={`w-full bg-slate-950/70 border ${
              isInvalid ? "border-rose-500/80 focus:ring-rose-500/50" : "border-slate-700/80 focus:ring-indigo-500/80 focus:border-indigo-500"
            } rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm resize-none disabled:opacity-50`}
          />

          {isInvalid && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              Please enter a trip description (at least 5 characters).
            </p>
          )}
        </div>

        {/* Form Options: Duration, Budget, Pace */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Duration
              </span>
              <span className="text-indigo-400 font-bold text-sm font-mono">{durationDays} {durationDays === 1 ? "Day" : "Days"}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              disabled={isLoading}
              className="w-full accent-indigo-500 cursor-pointer disabled:opacity-50 min-h-[32px]"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 day</span>
              <span>5 days</span>
              <span>10 days</span>
            </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Budget Style
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Budget", "Moderate", "Luxury"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  disabled={isLoading}
                  className={`text-xs py-2 rounded-lg border font-medium transition-all min-h-[44px] sm:min-h-[36px] ${
                    budget === b
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              Travel Pace
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["Relaxed", "Moderate", "Packed"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPace(p)}
                  disabled={isLoading}
                  className={`text-xs py-2 rounded-lg border font-medium transition-all min-h-[44px] sm:min-h-[36px] ${
                    pace === p
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests Tags */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Tag className="w-4 h-4 text-purple-400" />
            Focus & Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map((interest) => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  disabled={isLoading}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all min-h-[36px] ${
                    active
                      ? "bg-purple-500/20 border-purple-500/60 text-purple-300 font-semibold"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {interest} {active ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button with Keyboard Hint */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] hover:scale-[1.005] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-base min-h-[48px]"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>{isLoading ? "Crafting Your Itinerary..." : "Generate AI Itinerary"}</span>
          <span className="text-xs opacity-75 font-normal bg-black/20 px-2 py-0.5 rounded flex items-center gap-1">
            <Command className="w-3 h-3" /> + Enter
          </span>
        </button>
      </form>
    </div>
  );
}
