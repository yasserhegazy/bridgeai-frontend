/**
 * useChat WebSocket Hook
 * Manages WebSocket connection state and lifecycle
 */

import { useEffect, useRef, useCallback } from "react";
import { ConnectionState, WebSocketMessageData } from "@/dto";
import { chatWebSocketService } from "@/services/chatWebSocket.service";

interface UseChatSocketOptions {
  sessionId: number;
  projectId: number;
  apiBase: string;
  token: string;
  enabled?: boolean;
  onMessage: (data: WebSocketMessageData) => void;
  onError: (error: string) => void;
  onConnectionChange: (state: ConnectionState) => void;
}

export function useChatSocket({
  sessionId,
  projectId,
  apiBase,
  token,
  enabled = true,
  onMessage,
  onError,
  onConnectionChange,
}: UseChatSocketOptions) {
  const didMountRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onConnectionChangeRef = useRef(onConnectionChange);

  // Keep refs updated
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onConnectionChangeRef.current = onConnectionChange;
  }, [onMessage, onError, onConnectionChange]);

  useEffect(() => {
    console.log("[useChatSocket] Effect triggered:", {
      enabled,
      sessionId,
      hasToken: !!token,
      tokenLength: token?.length,
      didMount: didMountRef.current,
    });

    if (!enabled) {
      console.log("[useChatSocket] Skipping - not enabled");
      return;
    }
    if (!sessionId) {
      console.log("[useChatSocket] Skipping - no sessionId");
      return;
    }
    if (!token) {
      console.log("[useChatSocket] Skipping - no token");
      return;
    }
    if (didMountRef.current) {
      console.log("[useChatSocket] Skipping - already mounted");
      return;
    }

    const wsProtocol = apiBase.startsWith("https") ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://${apiBase.replace(/^https?:\/\//, "")}/api/projects/${projectId}/chats/${sessionId}/ws?token=${token}`;

    console.log("[useChatSocket] Connecting to:", wsUrl.replace(token, "***TOKEN***"));

    chatWebSocketService.connect({
      url: wsUrl,
      sessionId,
      token,
      onMessage: (data) => onMessageRef.current(data),
      onError: (error) => onErrorRef.current(error),
      onConnectionChange: (state) => onConnectionChangeRef.current(state),
    });

    didMountRef.current = true;

    return () => {
      console.log("[useChatSocket] Disconnecting WebSocket");
      chatWebSocketService.disconnect();
      didMountRef.current = false;
    };
  }, [enabled, sessionId, projectId, apiBase, token]);

  const sendMessage = useCallback((message: any) => {
    chatWebSocketService.send(message);
  }, []);

  const isConnected = useCallback(() => {
    return chatWebSocketService.isConnected();
  }, []);

  return {
    sendMessage,
    isConnected,
  };
}
