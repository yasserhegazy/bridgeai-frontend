/**
 * Projects Service
 * Handles all projects-related API communication
 * Single Responsibility: External projects operations
 */

import {
  ProjectDTO,
  CreateProjectRequestDTO,
  CreateProjectResponseDTO,
  ApproveProjectRequestDTO,
  RejectProjectRequestDTO,
} from "@/dto/projects.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for projects errors
 */
export class ProjectsError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ProjectsError";
  }
}

/**
 * Create authorization headers with token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new ProjectsError("No authentication token found", 401);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Parse API error response
 */
function parseApiError(error: unknown, statusCode: number): string {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as { detail?: string; message?: string };
    return errorObj.detail || errorObj.message || "An error occurred";
  }
  return "An error occurred";
}

/**
 * Fetch projects for a specific team
 */
export async function fetchTeamProjects(teamId: number | string): Promise<ProjectDTO[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/projects`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ProjectsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Create a new project
 */
export async function createProject(
  projectData: CreateProjectRequestDTO
): Promise<CreateProjectResponseDTO> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects`,
      {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
          team_id: projectData.team_id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ProjectsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch pending projects for approval
 */
export async function fetchPendingProjects(): Promise<ProjectDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/pending`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ProjectsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Approve a project
 */
export async function approveProject(projectId: number): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/approve`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ProjectsError(errorMessage, response.status, errorData);
    }
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Reject a project
 */
export async function rejectProject(
  projectId: number,
  reason: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/reject`,
      {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({ rejection_reason: reason }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ProjectsError(errorMessage, response.status, errorData);
    }
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch a single project by ID
 */
export async function fetchProjectById(projectId: number): Promise<ProjectDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new ProjectsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
