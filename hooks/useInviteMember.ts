/**
 * Invite Team Member Hook
 * Handles member invitation business logic and side effects
 * Single Responsibility: Member invitation state management
 */

"use client";

import { useState, useCallback } from "react";
import { InviteMemberRequestDTO } from "@/dto/teams.dto";
import { inviteTeamMember, TeamsError } from "@/services/teams.service";

interface UseInviteMemberReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  inviteMember: (teamId: string, invitation: InviteMemberRequestDTO) => Promise<boolean>;
  clearError: () => void;
  resetSuccess: () => void;
}

/**
 * Custom hook for inviting team members
 */
export function useInviteMember(): UseInviteMemberReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inviteMember = useCallback(
    async (teamId: string, invitation: InviteMemberRequestDTO): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await inviteTeamMember(teamId, invitation);
        setSuccess(true);
        return true;
      } catch (err) {
        if (err instanceof TeamsError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while sending the invitation");
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    isLoading,
    error,
    success,
    inviteMember,
    clearError,
    resetSuccess,
  };
}
