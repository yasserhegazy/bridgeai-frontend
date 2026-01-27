/**
 * Notification Actions Hook
 * Handles individual notification actions
 * Single Responsibility: Notification interaction logic
 */

"use client";

import { useState, useCallback } from "react";
import {
  acceptInvitationFromNotification,
  NotificationError,
} from "@/services/notifications.service";

interface UseNotificationActionsReturn {
  isAccepting: boolean;
  error: string | null;
  handleAcceptInvitation: (notificationId: number) => Promise<{
    success: boolean;
    teamId?: number;
    role?: string;
  }>;
  clearError: () => void;
}

/**
 * Custom hook for notification actions
 */
export function useNotificationActions(): UseNotificationActionsReturn {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptInvitation = useCallback(
    async (notificationId: number) => {
      setIsAccepting(true);
      setError(null);

      try {
        const response = await acceptInvitationFromNotification(notificationId);
        return {
          success: true,
          teamId: response.team_id,
          role: response.role,
        };
      } catch (err) {
        if (err instanceof NotificationError) {
          setError(err.message);
        } else {
          setError("Failed to accept invitation");
        }
        return { success: false };
      } finally {
        setIsAccepting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAccepting,
    error,
    handleAcceptInvitation,
    clearError,
  };
}
