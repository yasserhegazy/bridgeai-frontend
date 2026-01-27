/**
 * Invitation Details Hook
 * Handles fetching and displaying invitation details
 * Single Responsibility: Invitation details logic
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { InvitationPublicDetailsDTO } from "@/dto/invitations.dto";
import {
  getInvitationDetails,
  InvitationError,
} from "@/services/invitations.service";

interface UseInvitationDetailsReturn {
  invitation: InvitationPublicDetailsDTO | null;
  isLoading: boolean;
  error: string | null;
  refetchInvitation: () => Promise<void>;
}

/**
 * Custom hook for managing invitation details
 */
export function useInvitationDetails(
  token: string | null
): UseInvitationDetailsReturn {
  const [invitation, setInvitation] =
    useState<InvitationPublicDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvitation = useCallback(async () => {
    if (!token) {
      setError("Invalid invitation link");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getInvitationDetails(token);
      setInvitation(data);
    } catch (err) {
      if (err instanceof InvitationError) {
        setError(err.message);
      } else {
        setError("Failed to load invitation");
      }
      setInvitation(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadInvitation();
  }, [loadInvitation]);

  return {
    invitation,
    isLoading,
    error,
    refetchInvitation: loadInvitation,
  };
}
