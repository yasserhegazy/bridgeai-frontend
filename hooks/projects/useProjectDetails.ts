/**
 * useProjectDetails Hook
 * Manages project details and updates
 * Single Responsibility: Single project state management
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchProjectById,
  updateProject,
  ProjectsError,
} from "@/services";
import { ProjectDTO } from "@/dto/projects.dto";

export function useProjectDetails(projectId: number) {
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProjectById(projectId);
      setProject(data);
    } catch (err) {
      const errorMessage =
        err instanceof ProjectsError
          ? err.message
          : err instanceof Error
          ? err.message
          : "Failed to load project";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const saveProjectChanges = useCallback(
    async (updates: {
      name?: string;
      description?: string;
    }): Promise<boolean> => {
      try {
        setIsUpdating(true);
        setError(null);
        const updated = await updateProject(projectId, updates);
        setProject(updated);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof ProjectsError
            ? err.message
            : err instanceof Error
            ? err.message
            : "Failed to update project";
        setError(errorMessage);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [projectId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    project,
    isLoading,
    error,
    isUpdating,
    saveProjectChanges,
    refreshProject: loadProject,
    clearError,
  };
}
