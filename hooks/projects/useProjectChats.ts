/**
 * useProjectChats Hook
 * Manages project chats list and operations
 * Single Responsibility: Project chats state management
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchProjectChats,
  ChatSummaryDTO,
  ChatDetailDTO,
  createChat,
  updateChat,
  deleteChat,
  ChatsError,
  CreateChatRequestDTO,
  UpdateChatRequestDTO,
} from "@/services";

export function useProjectChats(projectId: number) {
  const [chats, setChats] = useState<ChatSummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeChat = useCallback(
    (chat: ChatSummaryDTO | ChatDetailDTO): ChatSummaryDTO => ({
      ...chat,
      message_count:
        typeof chat.message_count === "number"
          ? chat.message_count
          : Array.isArray((chat as any).messages)
          ? (chat as any).messages.length
          : 0,
    }),
    []
  );

  const loadChats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProjectChats(projectId);
      setChats(data.map(normalizeChat));
    } catch (err) {
      const errorMessage =
        err instanceof ChatsError
          ? err.message
          : err instanceof Error
          ? err.message
          : "Failed to load chats";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, normalizeChat]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const createNewChat = useCallback(
    async (chatData: CreateChatRequestDTO): Promise<ChatDetailDTO | null> => {
      try {
        setError(null);
        const created = await createChat(projectId, chatData);
        setChats((prev) => [normalizeChat(created), ...prev]);
        return created;
      } catch (err) {
        const errorMessage =
          err instanceof ChatsError
            ? err.message
            : err instanceof Error
            ? err.message
            : "Failed to create chat";
        setError(errorMessage);
        return null;
      }
    },
    [projectId, normalizeChat]
  );

  const renameChat = useCallback(
    async (chatId: number, name: string): Promise<boolean> => {
      try {
        setError(null);
        const updated = await updateChat(projectId, chatId, { name });
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === updated.id ? normalizeChat(updated) : chat
          )
        );
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ChatsError
            ? err.message
            : err instanceof Error
            ? err.message
            : "Failed to rename chat";
        setError(errorMessage);
        return false;
      }
    },
    [projectId, normalizeChat]
  );

  const removeChat = useCallback(
    async (chatId: number): Promise<boolean> => {
      try {
        setError(null);
        await deleteChat(projectId, chatId);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ChatsError
            ? err.message
            : err instanceof Error
            ? err.message
            : "Failed to delete chat";
        setError(errorMessage);
        return false;
      }
    },
    [projectId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chats,
    isLoading,
    error,
    createNewChat,
    renameChat,
    removeChat,
    refreshChats: loadChats,
    clearError,
  };
}
