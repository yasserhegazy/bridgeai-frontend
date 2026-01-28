/**
 * useMyCRSRequests Hook
 * Manages client's CRS requests
 * Single Responsibility: My CRS requests state and operations
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchMyCRSRequests } from "../../services/crs.service";
import { CRSError } from "../../services/errors.service";
import { CRSDTO, CRSStatus } from "../../dto/crs.dto";

interface UseMyCRSRequestsReturn {
  crsRequests: CRSDTO[];
  filteredRequests: CRSDTO[];
  isLoading: boolean;
  error: string | null;
  selectedProject: number | "all";
  setSelectedProject: (projectId: number | "all") => void;
  selectedStatus: CRSStatus | "all";
  setSelectedStatus: (status: CRSStatus | "all") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refreshRequests: () => Promise<CRSDTO[] | null>;
}

export function useMyCRSRequests(teamId: number): UseMyCRSRequestsReturn {
  const [crsRequests, setCRSRequests] = useState<CRSDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<CRSStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadCRSRequests = useCallback(async (): Promise<CRSDTO[] | null> => {
    if (!teamId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const projectId = selectedProject === "all" ? undefined : selectedProject;
      const status = selectedStatus === "all" ? undefined : selectedStatus;
      const data = await fetchMyCRSRequests(teamId, projectId, status);
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
  }, [teamId, selectedProject, selectedStatus]);

  useEffect(() => {
    loadCRSRequests();
  }, [loadCRSRequests]);

  const filteredRequests = useMemo(() => {
    if (!searchTerm) return crsRequests;

    return crsRequests.filter((request) => {
      const matchesSearch =
        request.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [crsRequests, searchTerm]);

  const refreshRequests = useCallback(async (): Promise<CRSDTO[] | null> => {
    return await loadCRSRequests();
  }, [loadCRSRequests]);

  return {
    crsRequests,
    filteredRequests,
    isLoading,
    error,
    selectedProject,
    setSelectedProject,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    refreshRequests,
  };
}
