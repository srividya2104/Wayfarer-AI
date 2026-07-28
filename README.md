# ✈️ Wayfarer AI - Interactive Trip Planner

A production-quality, responsive Next.js (App Router) web application built for an AI Trip Planner evaluation. Wayfarer accepts free-form trip prompts and generates structured, interactive day-by-day itineraries featuring race-condition protection, server-side Zod validation with 1-step automatic retry, and full mobile reordering controls.

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- Node.js 18.x or 20.x installed
- A Google Gemini API key (Free tier available at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd ai-trip-planner
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> 🔒 **Security Guarantee**: The API key is restricted to Next.js Route Handlers (`app/api/plan-trip/route.ts`) on the server and is **never** exposed to the browser client.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Defense-in-Depth Architecture & Key Decisions

This application employs a 3-layered defense strategy against unstructured output, server failures, and client-side race conditions:

### 1. Primary Defense: Model-Constrained JSON Output
- Uses `@google/genai` with `responseMimeType: "application/json"` and `responseSchema`.
- Forces the Gemini LLM engine to strictly conform to our structured JSON schema (destination, duration, days, stops with timings and durations).

### 2. Secondary Defense: Server Validation & Automatic 1-Step Retry (`app/api/plan-trip/route.ts`)
- All LLM JSON responses are validated server-side using **Zod** (`ItinerarySchema.safeParse`).
- If Zod validation fails due to missing keys or invalid types, the Route Handler **automatically executes 1 server retry** appending an explicit error-correction prompt.
- If the second attempt fails, it returns a clean `422 Unprocessable Entity` HTTP error instead of forwarding malformed data to the client.

### 3. Client Defense: Race Condition & Stale Response Guard (`app/page.tsx`)
- **Problem**: Rapid prompt submissions can cause out-of-order API responses, where an older slow request overwrites a newer fast request.
- **Solution**:
  - `AbortController` (`abortControllerRef.current`): Immediately aborts in-flight fetch HTTP sockets upon new submission.
  - `latestRequestId` ref counter: Every request gets an auto-incrementing ID. The client only updates state if `requestId === latestRequestId.current`.
  - **Client Timeout**: Uses a 20-second timeout guard to gracefully abort slow calls and show an error state with a **Retry** button.

---

## 🎨 Interactive Features

- **Dynamic Form**: Custom prompt input with duration slider (1–10 days), budget style, travel pace, focus tags, and instant preset templates.
- **Day Accordion**: Expand/collapse individual days or use global "Expand All / Collapse All".
- **Interactive Stop Controls**:
  - ⬆️ / ⬇️ **Reorder Stops**: Move activities up or down within a day without fragile drag-and-drop.
  - 🗑️ **Remove Stop**: Delete unwanted stops dynamically.
  - ℹ️ **Details Expand/Collapse**: Toggle detailed stop descriptions.
- **State Machine UX**: Distinct Empty, Loading (with progress steps), and Error (with Retry button) states.

---

## 🤖 Honest AI Usage Disclosure

- **Scaffolding & Boilerplate**: AI assistance was used to outline Next.js App Router boilerplate, Zod schema structures, and initial Tailwind CSS color palettes.
- **Logic & Defensive Architecture**: Hand-designed and reviewed the race-condition guarding strategy (`AbortController` + `latestRequestId`), server-side retry loop, and component state immutability.
- **Icons & Styling**: Integrated `lucide-react` icons and glassmorphism styling parameters.

---

## ⚠️ Known Limitations & Future Enhancements

1. **Multi-Day Drag & Drop Across Days**: Reordering is currently constrained within each individual day via Move Up/Down buttons (as requested by the brief for mobile reliability). Future iterations could add cross-day drag handles for desktop.
2. **Interactive Map Visualizer**: Adding Leaflet / Google Maps pinpoint visualization for stop locations.
3. **PDF / Calendar Export**: Exporting the itinerary directly to `.ics` calendar format or downloadable PDF.

---

## ⏱️ Time Spent

- **Planning & Architecture Plan**: 25 mins
- **Scaffolding & Zod Schema**: 20 mins
- **Gemini API Route & Server Retry Defense**: 35 mins
- **Client Race Guard & State Machine**: 30 mins
- **Interactive UI (Days & Stops Reordering)**: 45 mins
- **Mobile Responsive Pass & Testing**: 25 mins
- **Documentation**: 20 mins
- **Total Time**: ~3 hours 20 mins
