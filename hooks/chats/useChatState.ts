/**
 * useChatState Hook
 * Manages combined chat state (WebSocket connection, messages, typing indicators)
 */

import { useState, useCallback } from "react";
import { ConnectionState, WebSocketMessageData } from "@/dto";

export function useChatState() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [wsError, setWsError] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleConnectionChange = useCallback((state: ConnectionState) => {
    setConnectionState(state);
    if (state === "open") {
      setWsError(null);
    }
  }, []);

  const handleError = useCallback((error: string) => {
    setWsError(error);
  }, []);

  const handleWebSocketMessage = useCallback((data: WebSocketMessageData, handlers: {
    onMessage: (msg: WebSocketMessageData) => void;
    onCRSComplete?: () => void;
    onStatusUpdate?: (status: string, isGenerating: boolean) => void;
  }) => {
    if (data?.error || data?.type === "error") {
      setWsError(data.error || "An unknown error occurred");
      setIsAiTyping(false);
      if (handlers.onStatusUpdate) handlers.onStatusUpdate("idle", false);
      return;
    }

    // Handle status updates
    if (data?.type === "status" && handlers.onStatusUpdate) {
      handlers.onStatusUpdate(data.status || "idle", !!data.is_generating);
      return;
    }

    // Handle CRS completion
    if (data?.crs?.is_complete && handlers.onCRSComplete) {
      handlers.onCRSComplete();
    }

    // Validate message format for standard messages
    if (data?.type === "message" || (typeof data?.id === "number" && data.content)) {
      // Hide typing indicator and reset drafting pulse when AI responds
      if (data.sender_type === "ai") {
        setIsAiTyping(false);
        if (handlers.onStatusUpdate) handlers.onStatusUpdate("idle", false);
      }
      handlers.onMessage(data);
    }
  }, []);

  const showAiTyping = useCallback(() => {
    setIsAiTyping(true);
  }, []);

  const hideAiTyping = useCallback(() => {
    setIsAiTyping(false);
  }, []);

  return {
    connectionState,
    wsError,
    isAiTyping,
    handleConnectionChange,
    handleError,
    handleWebSocketMessage,
    showAiTyping,
    hideAiTyping,
  };
}
