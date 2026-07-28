"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, DollarSign, Gauge, Tag, Compass, CheckCircle2 } from "lucide-react";
import { TripInput } from "@/lib/schemas";

interface TripFormProps {
  onSubmit: (input: TripInput) => void;
  isLoading: boolean;
}

const PRESET_TRIPS = [
  {
    title: "Kyoto Heritage",
    prompt: "Historical temples, traditional tea ceremonies, bamboo grove, and authentic ramen spots in Kyoto.",
    duration: 3,
    budget: "Moderate" as const,
    pace: "Moderate" as const,
    interests: ["Culture & History", "Food & Dining"],
  },
  {
    title: "Paris Art",
    prompt: "Romantic walks, iconic museums (Louvre, D'Orsay), cozy Montmartre bakeries, and Seine sunset views.",
    duration: 4,
    budget: "Luxury" as const,
    pace: "Relaxed" as const,
    interests: ["Art & Museums", "Food & Dining"],
  },
  {
    title: "Iceland Waterfalls",
    prompt: "Golden Circle highlights, majestic waterfalls, geothermal black sand beaches, and Northern Lights.",
    duration: 5,
    budget: "Moderate" as const,
    pace: "Packed" as const,
    interests: ["Nature & Outdoors", "Hidden Gems"],
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
  
  // Validation state: only validate on blur or submit
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

  const handleApplyPreset = (preset: (typeof PRESET_TRIPS)[0]) => {
    setPrompt(preset.prompt);
    setDurationDays(preset.duration);
    setBudget(preset.budget);
    setPace(preset.pace);
    setSelectedInterests(preset.interests);
    setTouched(false);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Character counter color calculation
  const charLength = prompt.length;
  const charCounterColor =
    charLength > 480
      ? "text-rose-400 font-bold"
      : charLength > 400
      ? "text-amber-400 font-medium"
      : "text-slate-500";

  return (
    <div className="w-full space-y-6">
      {/* 1. Hero Section */}
      <div className="text-center space-y-3 py-4 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Design Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Perfect Journey</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Generate structured AI travel itineraries that you can edit, reorder, and customize in seconds.
        </p>

        {/* Hero Badges */}
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

      {/* Main Form Container */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-slate-700/80"
      >
        {/* Preset Prompt Pills */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Click to fill sample trip description:
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TRIPS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                disabled={isLoading}
                className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 hover:text-indigo-200 border border-slate-700/70 rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 group disabled:opacity-50 min-h-[36px] active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Free-form text prompt */}
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

          {/* Validation UX */}
          {isInvalid && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
              Please enter a trip description (at least 5 characters).
            </p>
          )}
        </div>

        {/* Grid Options: Duration, Budget, Pace */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Duration Slider */}
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

          {/* Budget Buttons */}
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

          {/* Pace Buttons */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] hover:scale-[1.005] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-base min-h-[48px]"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>{isLoading ? "Crafting Your Itinerary..." : "Generate AI Itinerary"}</span>
        </button>
      </form>
    </div>
  );
}
