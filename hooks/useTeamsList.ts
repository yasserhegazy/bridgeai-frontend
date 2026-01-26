/**
 * Teams List Hook
 * Handles teams fetching, filtering, and state management
 * Single Responsibility: Teams list logic
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TeamDTO, TeamListItemDTO } from "@/dto/teams.dto";
import { fetchTeams, TeamsError } from "@/services/teams.service";

interface UseTeamsListReturn {
  teams: TeamListItemDTO[];
  filteredTeams: TeamListItemDTO[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedStatuses: string[];
  setSearchQuery: (query: string) => void;
  setSelectedStatuses: (statuses: string[]) => void;
  resetFilters: () => void;
  refetchTeams: () => Promise<void>;
}

/**
 * Transform backend team DTO to display format
 */
function transformTeamToListItem(team: TeamDTO): TeamListItemDTO {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    status: team.status.charAt(0).toUpperCase() + team.status.slice(1),
    lastUpdate: team.created_at
      ? new Date(team.created_at).toLocaleDateString()
      : "N/A",
    members: new Array(team.member_count || 0)
      .fill(null)
      .map((_, i) => `Member ${i + 1}`),
    member_count: team.member_count,
  };
}

/**
 * Custom hook for managing teams list
 */
export function useTeamsList(): UseTeamsListReturn {
  const [teams, setTeams] = useState<TeamListItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const loadTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeams();
      const transformedTeams = data.map(transformTeamToListItem);
      setTeams(transformedTeams);
    } catch (err) {
      if (err instanceof TeamsError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching teams");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const filteredTeams = useMemo(() => {
    let filtered = teams;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.description?.toLowerCase().includes(query)
      );
    }

    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((team) =>
        selectedStatuses
          .map((s) => s.toLowerCase())
          .includes(team.status.toLowerCase())
      );
    }

    // Sort by last update (newest first)
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.lastUpdate).getTime() || 0;
      const dateB = new Date(b.lastUpdate).getTime() || 0;
      return dateB - dateA;
    });
  }, [teams, searchQuery, selectedStatuses]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedStatuses([]);
  }, []);

  return {
    teams,
    filteredTeams,
    isLoading,
    error,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setSelectedStatuses,
    resetFilters,
    refetchTeams: loadTeams,
  };
}
