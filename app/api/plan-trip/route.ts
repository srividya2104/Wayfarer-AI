import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItinerarySchema, TripInput } from "@/lib/schemas";

/**
 * Gemini response schema definition enforcing strict structured JSON output.
 * Primary layer of defense against malformed or unstructured text.
 */
const geminiItinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: {
      type: Type.STRING,
      description: "Primary destination city, region, or country",
    },
    durationDays: {
      type: Type.INTEGER,
      description: "Total duration of the trip in days",
    },
    days: {
      type: Type.ARRAY,
      description: "Array of day plans",
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.INTEGER,
            description: "1-indexed day number",
          },
          title: {
            type: Type.STRING,
            description: "Theme or main focus area of the day",
          },
          stops: {
            type: Type.ARRAY,
            description: "Sequential stops for the day",
            items: {
              type: Type.OBJECT,
              properties: {
                id: {
                  type: Type.STRING,
                  description: "Unique string id like 'd1s1'",
                },
                time: {
                  type: Type.STRING,
                  description: "Time of day e.g. '09:00' or '14:30'",
                },
                name: {
                  type: Type.STRING,
                  description: "Attraction, restaurant, or activity name",
                },
                description: {
                  type: Type.STRING,
                  description: "1-2 sentence detailed summary",
                },
                durationMinutes: {
                  type: Type.INTEGER,
                  description: "Duration in minutes e.g. 60, 90, 120",
                },
                location: {
                  type: Type.STRING,
                  description: "Specific neighborhood or address area",
                },
              },
              required: ["id", "time", "name", "description", "durationMinutes", "location"],
            },
          },
        },
        required: ["day", "title", "stops"],
      },
    },
  },
  required: ["destination", "durationDays", "days"],
};

/**
 * Helper to construct the system prompt for Gemini based on user input parameters.
 */
function buildSystemPrompt(input: TripInput, retryContext?: string): string {
  return `You are an expert travel planner assistant. Create a realistic, highly detailed, day-by-day travel itinerary.

TRIP DETAILS:
- Prompt/Request: ${input.prompt}
- Duration: ${input.durationDays} day(s)
- Budget level: ${input.budget}
- Travel pace: ${input.pace}
- Interests: ${input.interests.length > 0 ? input.interests.join(", ") : "General sightseeing"}

CRITICAL REQUIREMENTS:
1. Provide exactly ${input.durationDays} day(s) in the 'days' array.
2. For each day, include 3 to 5 realistic sequential stops spanning morning to evening.
3. Generate unique string IDs for stops formatted as 'd{day_number}s{stop_number}' (e.g. 'd1s1', 'd1s2', 'd2s1').
4. 'durationMinutes' MUST be an integer representing estimated time in minutes.
5. Do NOT include markdown code blocks or explanatory conversational text. Output pure JSON matching the specified schema.

${retryContext ? `\n[ATTENTION - PREVIOUS ATTEMPT FAILED SCHEMA VALIDATION]:\n${retryContext}\nPlease strictly fix the schema violations above and ensure all required fields are present with exact types.` : ""}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: TripInput = await req.json();

    if (!body || !body.prompt) {
      return NextResponse.json(
        { error: "Invalid request body: 'prompt' is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your .env.local file.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // --- STEP 1: First attempt calling Gemini with schema constraint ---
    let promptText = buildSystemPrompt(body);
    let rawText = "";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: geminiItinerarySchema,
          temperature: 0.7,
        },
      });

      rawText = response.text || "";
    } catch (apiErr: any) {
      console.error("[Gemini API Call Error]:", apiErr);
      return NextResponse.json(
        { error: `Gemini API service error: ${apiErr.message || "Failed to reach AI service"}` },
        { status: 502 }
      );
    }

    // --- STEP 2: Server-side validation using Zod ---
    let parsedJson: any;
    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseErr) {
      console.warn("[JSON Parse Warning] Gemini returned unparseable JSON on 1st attempt. Retrying...");
    }

    let validationResult = parsedJson ? ItinerarySchema.safeParse(parsedJson) : null;

    // --- STEP 3: Server-side retry logic if 1st attempt failed schema validation ---
    if (!validationResult || !validationResult.success) {
      const errorMsg = validationResult
        ? validationResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
        : "Failed to parse JSON string";

      console.warn(`[Zod Validation Failed - Retrying Once]: ${errorMsg}`);

      // Retry Gemini call once with stricter error reminder context prompt
      const retryPrompt = buildSystemPrompt(body, errorMsg);
      try {
        const retryResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: retryPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: geminiItinerarySchema,
            temperature: 0.3, // Lower temperature for strict schema adherence
          },
        });

        rawText = retryResponse.text || "";
        parsedJson = JSON.parse(rawText);
        validationResult = ItinerarySchema.safeParse(parsedJson);
      } catch (retryErr: any) {
        console.error("[Gemini Retry API Error]:", retryErr);
      }
    }

    // --- STEP 4: Final defense check ---
    if (!validationResult || !validationResult.success) {
      console.error(
        "[Schema Validation Permanent Failure]:",
        validationResult ? validationResult.error : "Failed after retry"
      );
      return NextResponse.json(
        {
          error:
            "The AI generated an invalid itinerary structure after retry. Please refine your prompt or try again.",
        },
        { status: 422 }
      );
    }

    // Successfully validated structure against Zod schema
    return NextResponse.json(validationResult.data, { status: 200 });
  } catch (error: any) {
    console.error("[POST /api/plan-trip Server Error]:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred while generating the itinerary." },
      { status: 500 }
    );
  }
}
