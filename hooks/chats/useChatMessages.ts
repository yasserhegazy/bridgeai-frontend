/**
 * useChatMessages Hook
 * Manages chat message state and operations
 */

import { useState, useCallback, useMemo } from "react";
import { LocalChatMessage, ChatMessageDTO, SendMessagePayload } from "@/dto";

interface UseChatMessagesOptions {
  sessionId: number;
  initialMessages: ChatMessageDTO[];
  currentUserId: number;
  onSendSuccess?: () => void;
  onSendError?: (error: string) => void;
}

export function useChatMessages({
  sessionId,
  initialMessages,
  currentUserId,
  onSendSuccess,
  onSendError,
}: UseChatMessagesOptions) {
  const [messages, setMessages] = useState<LocalChatMessage[]>(initialMessages);
  const [isLoading] = useState(false); // No loading since we have initial data
  const [error] = useState<string | null>(null);

  // Add incoming message from WebSocket
  const addMessage = useCallback((incoming: ChatMessageDTO) => {
    setMessages((prev) => {
      // Avoid duplicates
      const exactIdx = prev.findIndex((m) => m.id === incoming.id);
      if (exactIdx >= 0) {
        const updated = [...prev];
        updated[exactIdx] = incoming;
        return updated;
      }

      // Replace matching pending local message
      const pendingIdx = prev.findIndex(
        (m) =>
          m.pending &&
          m.sender_type === incoming.sender_type &&
          m.content === incoming.content &&
          (m.sender_id ?? currentUserId) === (incoming.sender_id ?? currentUserId)
      );

      if (pendingIdx >= 0) {
        const updated = [...prev];
        updated[pendingIdx] = incoming;
        return updated;
      }

      return [...prev, incoming];
    });
  }, [currentUserId]);

  // Add pending message (optimistic UI)
  const addPendingMessage = useCallback((content: string, senderType: "ba" | "client") => {
    const pendingLocal: LocalChatMessage = {
      _localId: `local-${Date.now()}`,
      id: Date.now() * -1,
      session_id: sessionId,
      sender_type: senderType,
      sender_id: currentUserId,
      content,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, pendingLocal]);
    return pendingLocal;
  }, [sessionId, currentUserId]);

  // Mark pending message as failed
  const markPendingAsFailed = useCallback((localId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m._localId === localId ? { ...m, pending: false, failed: true } : m
      )
    );
  }, []);

  // Sorted messages by timestamp
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);

  // Check if message is from current user
  const isOwnMessage = useCallback((msg: LocalChatMessage) => {
    return msg.sender_id === currentUserId && msg.sender_type !== "ai";
  }, [currentUserId]);

  return {
    messages: sortedMessages,
    isLoading,
    error,
    addMessage,
    addPendingMessage,
    markPendingAsFailed,
    isOwnMessage,
  };
}
