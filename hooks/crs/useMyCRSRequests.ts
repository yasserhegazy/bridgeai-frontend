/**
 * useMyCRSRequests Hook
 * Manages client's CRS requests
 * Single Responsibility: My CRS requests state and operations
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchMyCRSRequests } from "../../services/crs.service";
import { CRSError } from "../../services/errors.service";
import { CRSDTO, CRSStatus } from "../../dto/crs.dto";

import { ProjectDTO } from "../../dto/projects.dto";

interface UseMyCRSRequestsReturn {
  crsRequests: CRSDTO[];
  filteredRequests: CRSDTO[];
  isLoading: boolean;
  error: string | null;
  selectedTeam: number | "all";
  setSelectedTeam: (teamId: number | "all") => void;
  selectedProject: number | "all";
  setSelectedProject: (projectId: number | "all") => void;
  selectedStatus: CRSStatus | "all";
  setSelectedStatus: (status: CRSStatus | "all") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refreshRequests: () => Promise<CRSDTO[] | null>;
}

export function useMyCRSRequests(initialTeamId: number, projects: ProjectDTO[] = []): UseMyCRSRequestsReturn {
  const [crsRequests, setCRSRequests] = useState<CRSDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | "all">(initialTeamId);
  const [selectedProject, setSelectedProject] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<CRSStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadCRSRequests = useCallback(async (): Promise<CRSDTO[] | null> => {
    if (selectedTeam === "all" && !initialTeamId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const activeTeamId = selectedTeam === "all" ? initialTeamId : selectedTeam;
      const projectId = selectedProject === "all" ? undefined : selectedProject;
      const status = selectedStatus === "all" ? undefined : selectedStatus;

      const data = await fetchMyCRSRequests(activeTeamId, projectId, status);
      setCRSRequests(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof CRSError ? err.message : "Failed to load CRS requests";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTeam, selectedProject, selectedStatus, initialTeamId]);

  useEffect(() => {
    loadCRSRequests();
  }, [loadCRSRequests]);

  const filteredRequests = useMemo(() => {
    if (!searchTerm) return crsRequests;

    const term = searchTerm.toLowerCase();
    return crsRequests.filter((request) => {
      // Find project name from passed projects list if missing in request
      const fallbackProject = projects.find(p => p.id === request.project_id);
      const projectName = (request.project_name || fallbackProject?.name || "").toLowerCase();

      const matchesProject = projectName.includes(term);
      const matchesClient = request.client_name?.toLowerCase().includes(term);
      const matchesVersion = `v${request.version}`.toLowerCase().includes(term);
      const matchesId = request.id.toString().includes(term);

      return matchesProject || matchesClient || matchesVersion || matchesId;
    });
  }, [crsRequests, searchTerm, projects]);

  const refreshRequests = useCallback(async (): Promise<CRSDTO[] | null> => {
    return await loadCRSRequests();
  }, [loadCRSRequests]);

  return {
    crsRequests,
    filteredRequests,
    isLoading,
    error,
    selectedTeam,
    setSelectedTeam,
    selectedProject,
    setSelectedProject,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    refreshRequests,
  };
}
