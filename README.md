# ✈️ Wayfarer AI

Wayfarer AI is a production-quality, responsive Next.js (App Router) web application built for an AI Trip Planner coding evaluation. It converts free-form travel prompts into structured, interactive day-by-day itineraries with full reordering and editing controls, server-side Zod validation with 1-step automatic retry, and client race-condition protection.

---

## 📐 Architecture & System Flow Diagram

```mermaid
graph TD
    User([User Prompt Input]) -->|Submit Request| Client[React Client (app/page.tsx)]
    Client -->|Abort In-Flight Socket| Abort[AbortController]
    Client -->|Increment ID| ReqID[latestRequestId Ref Counter]
    Client -->|POST /api/plan-trip| Server[Next.js Server Handler (route.ts)]
    Server -->|Read GEMINI_API_KEY| Env[.env.local]
    Server -->|Schema-Constrained Call| Gemini[Gemini 3.6 Flash LLM]
    Gemini -->|Structured JSON Output| Server
    Server -->|Parse & Validate| Zod{Zod Schema safeParse}
    Zod -->|Success| ClientCommit[Commit to UI State]
    Zod -->|Validation Failure| ServerRetry[1-Step Automatic Server Retry]
    ServerRetry -->|Retry with Schema Error Prompt| Gemini
    ServerRetry -->|Failure after retry| ErrorState[Return HTTP 422 Error]
```

---

## 🏛️ Folder Structure

```
wayfarer-ai/
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
│   ├── Header.tsx               # Navigation header with live AI status
│   ├── Footer.tsx               # Footer with tech stack breakdown
│   ├── TripForm.tsx             # Hero section, prompt form, character counter, destination presets
│   ├── ItineraryView.tsx        # Dashboard, timeline schedule, smart recommendations, export tools
│   ├── DayCard.tsx              # Day level accordion, timeline connectors, weather/cost metrics
│   ├── StopCard.tsx             # Interactive stop item (move up/down, remove, tips, photo spots)
│   ├── EmptyState.tsx           # Interactive sample itinerary preview card
│   ├── LoadingState.tsx         # Multi-step animated AI generation workflow
│   ├── ErrorState.tsx           # Illustrated error card with Retry action trigger
│   └── ToastContainer.tsx       # Toast notifications (Stop removed, Undo, Copied, Exported)
├── .env.example                 # Template environment variables file
├── .env.local                   # Local environment variables file (git-ignored)
└── README.md                    # Comprehensive documentation & interview defense guide
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` / `Cmd + Enter` | Submit prompt & generate AI itinerary |
| `Esc` | Blur active input / collapse dialogs |
| `Tab` / `Shift + Tab` | Navigate interactive controls & buttons |

---

## 💡 Key Architectural Choices & Interview Talking Points

### 1. Why Next.js (App Router)?
- **Serverless API Protection**: Serves as the secure single gateway holding `GEMINI_API_KEY` on the server (`app/api/plan-trip/route.ts`). The API key never reaches the browser.
- **Single Repository Architecture**: Avoids needing a separate backend server (Express/FastAPI), satisfying the serverless route handler requirement cleanly.

### 2. Why Gemini 3.6 Flash?
- **Native Structured JSON Mode**: Supports `responseMimeType: "application/json"` and `responseSchema` natively, forcing the LLM engine to return valid JSON matching our contract.
- **Latency & Reliability**: Sub-2-second generation times ideal for real-time interactive UI.

### 3. Why Zod Validation & 1-Step Server Retry?
- **Defense in Depth**: LLMs can occasionally omit required fields despite schema instructions. Zod guarantees strict runtime parsing (`ItinerarySchema.safeParse`) before forwarding data to React.
- **Automatic Server Retry**: If the 1st attempt fails validation, `route.ts` logs the exact issue and automatically retries Gemini once with an error-correction prompt before giving up.

### 4. Why AbortController + `latestRequestId` Guard?
- **Race Condition Prevention**: Prevents slow older requests from overwriting newer fast requests if a user double-submits prompts rapidly.
- **Implementation**:
  - `abortControllerRef.current.abort()` cancels the in-flight HTTP socket.
  - `latestRequestId` incrementing ref ensures callbacks verify `requestId === latestRequestId.current` before mutating React state.

---

## 🚀 Quick Setup & Run Instructions

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd wayfarer-ai
npm install
```

### 2. Configure Environment Key
Copy `.env.example` to `.env.local` and paste your Gemini key:
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

- **Architecture & Scaffolding**: 40 mins
- **API Handler & Zod Server Retry**: 40 mins
- **Client Race Guard & State Machine**: 35 mins
- **Interactive Timeline & Reordering UI**: 50 mins
- **SaaS Polish (Dashboard, Keyboard Shortcuts, Toasts, A11y)**: 50 mins
- **Documentation**: 30 mins
- **Total Time**: ~4 hours 45 mins

*AI Usage Note*: AI assistance was used for initial Next.js scaffolding and CSS token definitions. Core state management, race condition guards, Zod schemas, server retry loops, and accessible UI controls were hand-designed and verified.
