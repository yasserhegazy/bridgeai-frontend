/**
 * Notifications List Hook
 * Handles notifications fetching, filtering, and state management
 * Single Responsibility: Notifications list logic
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { NotificationDTO } from "@/dto/notifications.dto";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  NotificationError,
} from "@/services/notifications.service";

interface UseNotificationsListReturn {
  notifications: NotificationDTO[];
  isLoading: boolean;
  error: string | null;
  filter: "all" | "unread";
  setFilter: (filter: "all" | "unread") => void;
  refetchNotifications: () => Promise<void>;
  handleMarkAsRead: (notificationId: number) => Promise<void>;
  handleDelete: (notificationId: number) => Promise<void>;
}

/**
 * Custom hook for managing notifications list
 */
export function useNotificationsList(): UseNotificationsListReturn {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchNotifications(filter === "unread");
      setNotifications(data.notifications || []);
    } catch (err) {
      if (err instanceof NotificationError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching notifications");
      }
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await markNotificationAsRead(notificationId);
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
      } catch (err) {
        if (err instanceof NotificationError) {
          setError(err.message);
        } else {
          setError("Failed to mark notification as read");
        }
      }
    },
    []
  );

  const handleDelete = useCallback(async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      if (err instanceof NotificationError) {
        setError(err.message);
      } else {
        setError("Failed to delete notification");
      }
    }
  }, []);

  return {
    notifications,
    isLoading,
    error,
    filter,
    setFilter,
    refetchNotifications: loadNotifications,
    handleMarkAsRead,
    handleDelete,
  };
}
