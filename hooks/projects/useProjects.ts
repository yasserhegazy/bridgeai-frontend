/**
 * useProjects Hook
 * Manages team projects listing with filtering
 * Single Responsibility: Projects listing state and operations
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchTeamProjects, ProjectsError } from "../../services/projects.service";
import { ProjectDTO } from "../../dto/projects.dto";

interface UseProjectsReturn {
  projects: ProjectDTO[];
  filteredProjects: ProjectDTO[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  refreshProjects: () => Promise<void>;
  setActiveTeamId: (teamId: number) => void;
}

export function useProjects(initialTeamId: number): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<number>(initialTeamId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loadProjects = useCallback(async (teamIdOverride?: number) => {
    const targetTeamId = teamIdOverride || activeTeamId;
    if (!targetTeamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTeamProjects(targetTeamId);
      setProjects(data);
    } catch (err) {
      const errorMessage =
        err instanceof ProjectsError
          ? err.message
          : "Failed to load projects";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeTeamId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, selectedStatus]);

  const refreshProjects = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    refreshProjects,
    // Add specific method to change team if needed, though usually handled by parent
    setActiveTeamId
  };
}
