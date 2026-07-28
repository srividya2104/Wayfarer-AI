# ✈️ Wayfarer AI - Interactive Trip Planner

Wayfarer AI is a production-quality, responsive Next.js (App Router) web application built for an AI Trip Planner coding evaluation. It transforms free-form travel prompts into structured, interactive day-by-day itineraries with full reordering and editing controls, server-side Zod validation with 1-step automatic retry, and client race-condition protection.

---

## 🏛️ Architecture & Folder Structure

```
ai-trip-planner/
├── app/
│   ├── api/
│   │   └── plan-trip/
│   │       └── route.ts         # Server Route Handler: Gemini API + Zod validation & retry
│   ├── globals.css              # Custom CSS variables, responsive rules, scrollbar & animations
│   ├── layout.tsx               # Root layout & font metadata
│   └── page.tsx                 # Client page state machine & AbortController race guard
├── lib/
│   └── schemas.ts               # Shared Zod schemas, TypeScript types, and Toast interfaces
├── components/
│   ├── Header.tsx               # Navigation header with status indicator
│   ├── Footer.tsx               # Footer with tech stack breakdown
│   ├── TripForm.tsx             # Hero section, prompt form, character counter, preset fillers
│   ├── ItineraryView.tsx        # Dashboard summary card, copy text, download JSON, days list
│   ├── DayCard.tsx              # Day level accordion, weather/cost metrics, stop array state updates
│   ├── StopCard.tsx             # Interactive stop item (move up/down, remove, expand details)
│   ├── EmptyState.tsx           # Sample itinerary preview card
│   ├── LoadingState.tsx         # Skeleton loader with rotating progress messages
│   ├── ErrorState.tsx           # Illustrated error card with Retry action trigger
│   └── ToastContainer.tsx       # Toast notifications (Stop removed, Undo, Copied, Exported)
├── .env.example                 # Template environment variables file
├── .env.local                   # Local environment variables file (git-ignored)
└── README.md                    # Detailed documentation & interview defense notes
```

---

## 💡 Key Architectural Choices: Why Next.js, Gemini & Zod?

### 1. Why Next.js (App Router)?
- **Serverless API Route Protection**: Serves as the single secure gateway holding the `GEMINI_API_KEY` on the server (`app/api/plan-trip/route.ts`). The API key never touches the client bundle.
- **Single Repository Setup**: Avoids needing a separate backend server (Express/FastAPI) to host serverless functions, simplifying deployment to Vercel.

### 2. Why Gemini 3.6 Flash API?
- **Native JSON Schema Constraints**: Supports `responseMimeType: "application/json"` and `responseSchema` natively, forcing the LLM engine to return structured JSON matching our contract rather than raw markdown/text.
- **Performance & Cost**: Ultra-fast latency (~1-2s) ideal for real-time interactive trip planning.

### 3. Why Zod Validation?
- **Defense in Depth**: LLMs can occasionally return malformed structures despite schema instructions. Zod guarantees strict runtime parsing (`ItinerarySchema.safeParse`) before forwarding data to the React UI.
- **Type Safety**: Automatically infers TypeScript types (`type Itinerary = z.infer<typeof ItinerarySchema>`), preventing `undefined` property crashes in client UI components.

---

## 🛡️ Failure Handling & Defense Mechanisms

### 1. Server-Side 1-Step Automatic Retry (`app/api/plan-trip/route.ts`)
- If Gemini's initial response fails Zod validation (e.g. missing required field or wrong data type), the route handler **logs the specific schema issue** and executes **1 automatic server retry**, appending an explicit error-correction prompt.
- If the second attempt also fails, it returns a clean HTTP `422 Unprocessable Entity` response instead of corrupting the client UI.

### 2. Client Race-Condition & Stale Response Guarding (`app/page.tsx`)
- **The Problem**: If a user submits Prompt A (slow 8s) and quickly follows with Prompt B (fast 2s), Prompt B completes first. Without staleness guarding, Prompt A would finish later and overwrite Prompt B's fresh result with Prompt A's obsolete itinerary!
- **Double-Layered Defense**:
  - **`AbortController` (`abortControllerRef.current`)**: Instantly aborts the previous in-flight HTTP request socket when a new prompt is submitted.
  - **`latestRequestId` Ref Counter**: Auto-incrementing request ID counter ensures that even if an un-aborted promise resolves out of order, it verifies `requestId === latestRequestId.current` before mutating React state.
  - **20-Second Client Timeout**: Aborts hanging network requests and transitions the UI to a clean `ErrorState` with a **Retry** trigger.

---

## 🎙️ Live Interview Talking Points

If asked to explain implementation decisions during screening:

1. **"Why use Move Up/Down buttons instead of Drag-and-Drop?"**
   > *Answer*: Drag-and-drop on mobile viewports (375px–430px) frequently interferes with touch scrolling, leading to bad UX and fragile code. Move Up/Down buttons provide deterministic, accessible (`aria-label`, keyboard navigable) array reordering that works flawlessly across touch devices.

2. **"How do you handle API key security?"**
   > *Answer*: The key lives exclusively in `process.env.GEMINI_API_KEY` on the server within `app/api/plan-trip/route.ts`. The client only calls `/api/plan-trip` relative endpoint. `.env.local` is git-ignored and `.env.example` is committed.

3. **"How do you protect against race conditions?"**
   > *Answer*: I use an `AbortController` to cancel previous fetch sockets on new submissions, paired with a `latestRequestId` ref counter to ensure only responses matching the newest submission mutate state.

---

## 🚀 Quick Setup & Local Run Instructions

### 1. Clone & Install
```bash
git clone <repository-url>
cd ai-trip-planner
npm install
```

### 2. Set Environment Variable
Create `.env.local`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## ⏱️ Time Spent & AI Usage Disclosure

- **Architecture & Plan**: 25 mins
- **Scaffolding & Zod Schema**: 20 mins
- **Gemini API Route & Server Retry**: 35 mins
- **Client Race Guard & State Machine**: 30 mins
- **Interactive UI & Reordering Controls**: 45 mins
- **SaaS Polish Pass (Toasts, Dashboard, A11y, Mobile)**: 45 mins
- **Documentation**: 25 mins
- **Total Time**: ~3 hours 45 mins

*AI Usage Note*: AI assistance was used for initial Next.js boilerplate scaffolding and Tailwind color tokens. Core state management, race condition guards, Zod schemas, server retry loops, and accessible UI controls were hand-designed and verified.
