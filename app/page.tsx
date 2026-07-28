"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import TripForm from "@/components/TripForm";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ItineraryView from "@/components/ItineraryView";
import ToastContainer from "@/components/ToastContainer";
import Footer from "@/components/Footer";
import { Itinerary, TripInput, Toast } from "@/lib/schemas";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<TripInput | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, actionLabel?: string, onAction?: () => void) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type: "info",
      actionLabel,
      onAction,
    };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Race condition defense
  const latestRequestId = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTripPlan = useCallback(async (input: TripInput) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++latestRequestId.current;

    setStatus("loading");
    setErrorMessage(null);
    setLastSubmittedInput(input);

    const timeoutId = setTimeout(() => {
      if (latestRequestId.current === currentRequestId) {
        controller.abort();
      }
    }, 20000);

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (currentRequestId !== latestRequestId.current) {
        console.warn(`[Stale Response Guarded] Discarding response for obsolete request #${currentRequestId}`);
        return;
      }

      if (!response.ok) {
        let errText = "Failed to generate itinerary.";
        try {
          const errData = await response.json();
          errText = errData.error || errText;
        } catch (_) {
          errText = `Server responded with HTTP ${response.status}: ${response.statusText}`;
        }

        setStatus("error");
        setErrorMessage(errText);
        return;
      }

      const data = await response.json();

      if (currentRequestId === latestRequestId.current) {
        setItinerary(data);
        setStatus("success");
        addToast("Itinerary generated successfully!");
      }
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (currentRequestId !== latestRequestId.current) {
        console.log(`[Obsolete Request Aborted] Request #${currentRequestId} was aborted.`);
        return;
      }

      if (err.name === "AbortError") {
        setStatus("error");
        setErrorMessage("Request timed out (exceeded 20s budget) or was cancelled by a new prompt.");
      } else {
        setStatus("error");
        setErrorMessage(err.message || "Network error. Please check your internet connection.");
      }
    }
  }, [addToast]);

  const handleRetry = () => {
    if (lastSubmittedInput) {
      fetchTripPlan(lastSubmittedInput);
    }
  };

  // Global Keyboard Shortcuts (Esc to close/collapse dialogs or return)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Blur active inputs or dismiss toasts
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <TripForm onSubmit={fetchTripPlan} isLoading={status === "loading"} />

        {/* Dynamic State Machine */}
        <section aria-label="Itinerary Results Area" className="mt-8">
          {status === "idle" && <EmptyState />}
          {status === "loading" && <LoadingState />}
          {status === "error" && (
            <ErrorState message={errorMessage || "Failed to generate plan."} onRetry={handleRetry} />
          )}
          {status === "success" && itinerary && (
            <ItineraryView
              itinerary={itinerary}
              setItinerary={setItinerary}
              onShowToast={addToast}
            />
          )}
        </section>
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
