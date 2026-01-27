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
    onMessage: (msg: any) => void;
    onCRSComplete?: () => void;
  }) => {
    if (data?.error) {
      console.error("[Chat] Server error:", data.error);
      setWsError(data.error);
      return;
    }

    // Handle CRS completion
    if (data?.crs?.is_complete && handlers.onCRSComplete) {
      handlers.onCRSComplete();
    }

    // Validate message format
    if (typeof data?.id !== "number" || !data.content) {
      console.warn("[Chat] Invalid message format:", data);
      return;
    }

    // Hide typing indicator when AI responds
    if (data.sender_type === "ai") {
      setIsAiTyping(false);
    }

    handlers.onMessage(data);
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
