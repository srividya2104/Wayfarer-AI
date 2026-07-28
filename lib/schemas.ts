import { z } from "zod";

/**
 * Zod schema defining the data contract for an individual stop in a day's itinerary.
 */
export const StopSchema = z.object({
  id: z.string().describe("Unique string identifier for the stop, e.g. 'd1s1'"),
  time: z.string().describe("Estimated time or time range, e.g. '09:00' or 'Morning'"),
  name: z.string().describe("Name of the place, attraction, or activity"),
  description: z.string().describe("Short 1-2 sentence overview of what to do or see"),
  durationMinutes: z.number().int().positive().describe("Estimated time spent in minutes"),
  location: z.string().describe("Neighborhood, city area, or address"),
  estimatedCost: z.string().optional().default("Free - $15").describe("Estimated per-person cost e.g. '$15' or 'Free'"),
});

/**
 * Zod schema for a single day plan containing multiple stops.
 */
export const DayPlanSchema = z.object({
  day: z.number().int().positive().describe("Day number, starting at 1"),
  title: z.string().describe("Theme or focal neighborhood for the day"),
  stops: z.array(StopSchema).min(1).describe("List of scheduled activities for this day"),
  estimatedWalkingTime: z.string().optional().default("45 mins").describe("Estimated total walking or transit time for the day"),
  weatherForecast: z.string().optional().default("Sunny, 22°C").describe("Typical or expected weather condition for the destination"),
  dayCostEstimate: z.string().optional().default("$40 - $80").describe("Estimated total cost for the day"),
});

/**
 * Master itinerary schema for Gemini structured JSON output verification.
 */
export const ItinerarySchema = z.object({
  destination: z.string().describe("Target city or country"),
  durationDays: z.number().int().positive().describe("Total length of trip in days"),
  budget: z.string().optional().default("Moderate").describe("Overall budget tier"),
  pace: z.string().optional().default("Relaxed").describe("Travel pace"),
  estimatedTotalCost: z.string().optional().default("$150 - $350").describe("Estimated total trip cost per person"),
  bestTimeToVisit: z.string().optional().default("Spring & Autumn").describe("Ideal season or months to visit"),
  days: z.array(DayPlanSchema).min(1).describe("Array of daily plans"),
});

export type Stop = z.infer<typeof StopSchema>;
export type DayPlan = z.infer<typeof DayPlanSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;

export interface TripInput {
  prompt: string;
  durationDays: number;
  budget: "Budget" | "Moderate" | "Luxury";
  pace: "Relaxed" | "Moderate" | "Packed";
  interests: string[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  actionLabel?: string;
  onAction?: () => void;
}
