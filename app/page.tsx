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
import { Itinerary, TripInput, Toast, ApiError } from "@/lib/schemas";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "complete" | "error" | "success">("idle");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [errorObj, setErrorObj] = useState<ApiError | null>(null);
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

  // Race Condition & Abort Safety: AbortController ref + incrementing request ID ref
  const latestRequestId = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Unmount cleanup: cancel any pending fetch when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchTripPlan = useCallback(async (input: TripInput) => {
    // Abort previous in-flight request if present
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Create fresh AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++latestRequestId.current;

    setStatus("loading");
    setErrorObj(null);
    setLastSubmittedInput(input);

    // Set a generous 45-second timeout budget for LLM generation
    let isTimedOut = false;
    const timeoutId = setTimeout(() => {
      if (latestRequestId.current === currentRequestId) {
        isTimedOut = true;
        controller.abort();
      }
    }, 45000);

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      // Clear timeout immediately upon response arrival
      clearTimeout(timeoutId);

      // Ignore stale responses if a newer request was started
      if (currentRequestId !== latestRequestId.current) {
        return;
      }

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch (jsonErr) {
          console.error("[Client Fetch Error]: Failed to parse error JSON", jsonErr);
        }

        const parsedError: ApiError = {
          statusCode: errData.statusCode || response.status,
          title: errData.errorTitle || "Generation Issue",
          message: errData.message || "Failed to generate itinerary. Please try again.",
          retryDelaySeconds: errData.retryDelaySeconds,
        };

        setStatus("error");
        setErrorObj(parsedError);
        return;
      }

      const data = await response.json();

      if (currentRequestId === latestRequestId.current) {
        setStatus("complete");
        setItinerary(data);

        setTimeout(() => {
          if (currentRequestId === latestRequestId.current) {
            setStatus("success");
            addToast("Itinerary generated successfully!");
          }
        }, 500);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);

      // Ignore stale responses if a newer request superseded this one
      if (currentRequestId !== latestRequestId.current) {
        return;
      }

      // Check if error is an AbortError
      const isAbortError =
        err?.name === "AbortError" ||
        (typeof DOMException !== "undefined" && err instanceof DOMException && err.name === "AbortError") ||
        String(err?.message || "").toLowerCase().includes("aborted");

      if (isAbortError) {
        if (isTimedOut) {
          // Only show error UI if request actually timed out after 45s
          setStatus("error");
          setErrorObj({
            statusCode: 408,
            title: "Request Timed Out",
            message: "The request exceeded the 45-second limit. Please try again or refine your prompt.",
          });
        } else {
          // Ignore AbortError caused by cancellation or new submission - DO NOT show error UI
          console.log("[fetchTripPlan]: Request aborted silently (new prompt or navigation).");
        }
        return;
      }

      console.error("[Client Fetch Exception]:", err);
      setStatus("error");
      setErrorObj({
        statusCode: 0,
        title: "Network Connection Issue",
        message: "Unable to connect to the server. Please check your internet connection and try again.",
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }, [addToast]);

  const handleRetry = () => {
    if (lastSubmittedInput) {
      fetchTripPlan(lastSubmittedInput);
    }
  };

  const handleClearError = () => {
    setErrorObj(null);
    if (itinerary) {
      setStatus("success");
    } else {
      setStatus("idle");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        <TripForm onSubmit={fetchTripPlan} isLoading={status === "loading" || status === "complete"} />

        {/* Dynamic State Machine */}
        <section aria-label="Itinerary Results Area" className="mt-6">
          {status === "idle" && <EmptyState />}
          {(status === "loading" || status === "complete") && (
            <LoadingState isComplete={status === "complete"} />
          )}
          {status === "error" && errorObj && (
            <div className="space-y-6">
              <ErrorState error={errorObj} onRetry={handleRetry} onClear={handleClearError} />
              {itinerary && (
                <div className="opacity-75">
                  <div className="text-xs text-slate-400 font-mono text-center mb-2">Previous Itinerary (Preserved):</div>
                  <ItineraryView itinerary={itinerary} setItinerary={setItinerary} onShowToast={addToast} />
                </div>
              )}
            </div>
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
