/**
 * Pending Requests Hook
 * Handles fetching and managing pending project requests
 * Single Responsibility: Pending requests list logic
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectDTO } from "@/dto/projects.dto";
import {
  fetchPendingProjects,
  approveProject,
  rejectProject,
  ProjectsError,
} from "@/services/projects.service";

interface UsePendingRequestsReturn {
  projects: ProjectDTO[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  handleApprove: (projectId: number) => Promise<void>;
  handleReject: (projectId: number, reason: string) => Promise<void>;
  refetchProjects: () => Promise<void>;
}

/**
 * Custom hook for managing pending project requests
 */
export function usePendingRequests(): UsePendingRequestsReturn {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPendingProjects();
      setProjects(data);
    } catch (err) {
      if (err instanceof ProjectsError) {
        setError(err.message);
      } else {
        setError("Failed to load pending requests");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleApprove = useCallback(async (projectId: number) => {
    setError(null);
    setSuccessMessage(null);

    try {
      await approveProject(projectId);
      setSuccessMessage("Project approved successfully");

      // Remove approved project from list
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (err instanceof ProjectsError) {
        setError(err.message);
      } else {
        setError("Failed to approve project");
      }
    }
  }, []);

  const handleReject = useCallback(
    async (projectId: number, reason: string) => {
      setError(null);
      setSuccessMessage(null);

      try {
        await rejectProject(projectId, reason);
        setSuccessMessage("Project rejected successfully");

        // Remove rejected project from list
        setProjects((prev) => prev.filter((p) => p.id !== projectId));

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        if (err instanceof ProjectsError) {
          setError(err.message);
        } else {
          setError("Failed to reject project");
        }
      }
    },
    []
  );

  return {
    projects,
    isLoading,
    error,
    successMessage,
    handleApprove,
    handleReject,
    refetchProjects: loadProjects,
  };
}
