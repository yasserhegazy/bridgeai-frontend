/**
 * Invitation Actions Hook
 * Handles accepting/rejecting invitations
 * Single Responsibility: Invitation action logic
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  acceptInvitation,
  rejectInvitation,
  InvitationError,
} from "@/services/invitations.service";

interface UseInvitationActionsReturn {
  isAccepting: boolean;
  isRejecting: boolean;
  success: boolean;
  error: string | null;
  handleAccept: (token: string, teamId?: number) => Promise<void>;
  handleReject: (token: string) => Promise<void>;
}

/**
 * Custom hook for invitation actions
 */
export function useInvitationActions(): UseInvitationActionsReturn {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAccept = useCallback(
    async (token: string, teamId?: number) => {
      setIsAccepting(true);
      setError(null);

      try {
        const result = await acceptInvitation(token);
        setSuccess(true);

        // Redirect to team page after 2 seconds
        setTimeout(() => {
          const redirectTeamId =
            result.team?.id || result.team_id || teamId;
          if (redirectTeamId) {
            router.push(`/teams/${redirectTeamId}/dashboard`);
          } else {
            router.push("/teams");
          }
        }, 2000);
      } catch (err) {
        if (
          err instanceof InvitationError &&
          err.message === "Authentication required"
        ) {
          // Redirect to login with return URL
          const returnUrl = encodeURIComponent(`/invite/accept?token=${token}`);
          router.push(`/auth/login?redirect=${returnUrl}`);
        } else if (err instanceof InvitationError) {
          setError(err.message);
        } else {
          setError("Failed to accept invitation");
        }
      } finally {
        setIsAccepting(false);
      }
    },
    [router]
  );

  const handleReject = useCallback(
    async (token: string) => {
      setIsRejecting(true);
      setError(null);

      try {
        await rejectInvitation(token);
        setSuccess(true);

        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err) {
        if (err instanceof InvitationError) {
          setError(err.message);
        } else {
          setError("Failed to reject invitation");
        }
      } finally {
        setIsRejecting(false);
      }
    },
    [router]
  );

  return {
    isAccepting,
    isRejecting,
    success,
    error,
    handleAccept,
    handleReject,
  };
}
