/**
 * Teams Service
 * Handles all teams-related API communication
 * Single Responsibility: External teams operations
 */

import {
  TeamDTO,
  CreateTeamRequestDTO,
  CreateTeamResponseDTO,
  InviteMemberRequestDTO,
  InviteMemberResponseDTO,
} from "@/dto/teams.dto";
import { getAuthToken } from "./token.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for teams errors
 */
export class TeamsError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "TeamsError";
  }
}

/**
 * Create authorization headers with token
 */
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new TeamsError("No authentication token found", 401);
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
 * Fetch all teams for the current user
 */
export async function fetchTeams(): Promise<TeamDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new TeamsError("Unauthorized. Please log in again.", 401);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new TeamsError(errorMessage, response.status, errorData);
    }

    const data = await response.json();
    
    // Handle both array and single object responses
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    if (error instanceof TeamsError) {
      throw error;
    }
    throw new TeamsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Create a new team
 */
export async function createTeam(
  teamData: CreateTeamRequestDTO
): Promise<CreateTeamResponseDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new TeamsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamsError) {
      throw error;
    }
    throw new TeamsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Send invitation to join a team
 */
export async function inviteTeamMember(
  teamId: string,
  invitation: InviteMemberRequestDTO
): Promise<InviteMemberResponseDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/invite`, {
      method: "POST",
      headers: createAuthHeaders(),
      body: JSON.stringify(invitation),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new TeamsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamsError) {
      throw error;
    }
    throw new TeamsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Fetch a specific team by ID
 */
export async function fetchTeamById(teamId: number | string): Promise<TeamDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
      method: "GET",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new TeamsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamsError) {
      throw error;
    }
    throw new TeamsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Delete a team
 */
export async function deleteTeam(teamId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/`, {
      method: "DELETE",
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new TeamsError(errorMessage, response.status, errorData);
    }
  } catch (error) {
    if (error instanceof TeamsError) {
      throw error;
    }
    throw new TeamsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Update team details
 */
export async function updateTeam(
  teamId: number,
  updates: Partial<CreateTeamRequestDTO & { status?: string }>
): Promise<TeamDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/`, {
      method: "PUT",
      headers: createAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new TeamsError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TeamsError) {
      throw error;
    }
    throw new TeamsError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Update team status (archive, activate, deactivate)
 */
export async function updateTeamStatus(
  teamId: number,
  status: "active" | "inactive" | "archived"
): Promise<TeamDTO> {
  return updateTeam(teamId, { status });
}

/**
 * Archive a team
 */
export async function archiveTeam(teamId: number): Promise<TeamDTO> {
  return updateTeamStatus(teamId, "archived");
}

/**
 * Activate a team
 */
export async function activateTeam(teamId: number): Promise<TeamDTO> {
  return updateTeamStatus(teamId, "active");
}

/**
 * Deactivate a team
 */
export async function deactivateTeam(teamId: number): Promise<TeamDTO> {
  return updateTeamStatus(teamId, "inactive");
}
