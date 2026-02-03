/**
 * useCRSStream Hook
 * Manages Server-Sent Events (SSE) connection for real-time CRS updates
 * Runs in parallel with WebSocket chat connection for background CRS generation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getAuthToken } from "@/services/token.service";

export type CRSStreamEvent = {
  type:
  | "crs_generation_started"
  | "crs_progress"
  | "crs_complete"
  | "crs_updated"
  | "crs_error"
  | "crs_retry"
  | "crs_partial";
  session_id?: number;
  percentage?: number;
  step?: string;
  message?: string;
  crs_template?: any;
  summary_points?: string[];
  overall_summary?: string;
  is_complete?: boolean;
  completeness_info?: {
    percentage: number;
    missing_required_fields: string[];
    weak_fields: string[];
  };
  error?: string;
  attempt?: number;
  max_attempts?: number;
  wait_time?: number;
  timestamp?: string;
  crs_document_id?: number;
  content?: string;
};

export type CRSStreamStatus = "idle" | "connecting" | "connected" | "error" | "closed";

interface UseCRSStreamOptions {
  sessionId: number | null;
  enabled?: boolean;
  onProgress?: (event: CRSStreamEvent) => void;
  onComplete?: (event: CRSStreamEvent) => void;
  onError?: (error: string) => void;
  onUpdate?: (crsTemplate: any) => void;
}

export function useCRSStream({
  sessionId,
  enabled = true,
  onProgress,
  onComplete,
  onError,
  onUpdate,
}: UseCRSStreamOptions) {
  const [status, setStatus] = useState<CRSStreamStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // Connect/disconnect when sessionId or enabled changes
  useEffect(() => {
    const accessToken = getAuthToken();

    if (!sessionId || !enabled || !accessToken) {
      return;
    }

    console.log(`[CRS Stream] Initializing connection for session ${sessionId}`);
    setStatus("connecting");
    setError(null);

    // EventSource doesn't support custom headers, so we pass token as query param
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = `${apiUrl}/api/crs/stream/${sessionId}?token=${accessToken}`;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log(`[CRS Stream] Connected to session ${sessionId}`);
      setStatus("connected");
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onmessage = (event) => {
      try {
        const data: CRSStreamEvent = JSON.parse(event.data);
        console.log("[CRS Stream] Received event:", data.type, data);

        // Update local state based on event type
        switch (data.type) {
          case "crs_generation_started":
            setProgress(0);
            setCurrentStep("Started");
            setRetryCount(0);
            break;

          case "crs_progress":
            if (data.percentage !== undefined) {
              setProgress(data.percentage);
            }
            if (data.step) {
              setCurrentStep(data.step);
            }
            if (data.message) {
              setCurrentStep(data.message);
            }

            // Update CRS template if provided
            if (data.crs_template && onUpdate) {
              onUpdate(data.crs_template);
            }

            // Call progress callback
            if (onProgress) {
              onProgress(data);
            }
            break;

          case "crs_complete":
          case "crs_updated":
            setProgress(100);
            setCurrentStep(data.is_complete ? "Complete" : "Updated");

            // Update final CRS template
            if (data.crs_template && onUpdate) {
              onUpdate(data.crs_template);
            }

            // Call completion callback
            if (data.is_complete && onComplete) {
              onComplete(data);
            } else if (onProgress) {
              onProgress(data);
            }
            break;

          case "crs_error":
            setError(data.error || "CRS generation failed");
            setStatus("error");
            if (onError) {
              onError(data.error || "CRS generation failed");
            }
            break;

          case "crs_retry":
            setRetryCount(data.attempt || 0);
            if (data.message) {
              setCurrentStep(data.message);
            }
            if (onProgress) {
              onProgress(data);
            }
            break;

          case "crs_partial":
            if (data.content && onUpdate) {
              try {
                const partialTemplate = JSON.parse(data.content);
                onUpdate(partialTemplate);
              } catch (e) {
                console.error("[CRS Stream] Failed to parse partial content:", e);
              }
            }
            break;
        }
      } catch (err) {
        console.error("[CRS Stream] Failed to parse event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("[CRS Stream] Connection error:", err);
      setStatus("error");
      eventSource.close();

      // Attempt reconnection with exponential backoff
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current += 1;
        const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);

        console.log(
          `[CRS Stream] Reconnecting in ${backoffTime}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          // Will trigger useEffect to run again
          setStatus("idle");
        }, backoffTime);
      } else {
        const errorMsg = "CRS stream connection lost. Please refresh the page.";
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
      }
    };

    // Cleanup on unmount or when dependencies change
    return () => {
      console.log(`[CRS Stream] Cleaning up connection for session ${sessionId}`);
      eventSource.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [sessionId, enabled]); // Only re-run when sessionId or enabled changes

  const reconnect = useCallback(() => {
    console.log("[CRS Stream] Manual reconnect triggered");
    reconnectAttemptsRef.current = 0;
    setStatus("idle"); // Trigger useEffect to reconnect
  }, []);

  return {
    status,
    progress,
    currentStep,
    error,
    retryCount,
    reconnect,
    isConnected: status === "connected",
    isGenerating: progress > 0 && progress < 100,
  };
}
