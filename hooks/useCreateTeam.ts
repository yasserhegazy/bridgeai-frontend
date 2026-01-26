/**
 * Create Team Hook
 * Handles team creation business logic and side effects
 * Single Responsibility: Team creation state management
 */

"use client";

import { useState, useCallback } from "react";
import { CreateTeamRequestDTO } from "@/dto/teams.dto";
import { createTeam, TeamsError } from "@/services/teams.service";

interface UseCreateTeamReturn {
  isLoading: boolean;
  error: string | null;
  createNewTeam: (teamData: CreateTeamRequestDTO) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for creating teams
 */
export function useCreateTeam(): UseCreateTeamReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewTeam = useCallback(
    async (teamData: CreateTeamRequestDTO): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await createTeam(teamData);
        return true;
      } catch (err) {
        if (err instanceof TeamsError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while creating the team");
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

  return {
    isLoading,
    error,
    createNewTeam,
    clearError,
  };
}
