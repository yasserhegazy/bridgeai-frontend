/**
 * Data Transfer Objects for Projects
 * Defines strict contracts for project-related data
 */

export interface ProjectDTO {
  id: number;
  name: string;
  description: string | null;
  team_id: number;
  created_by: number;
  created_by_name?: string | null;
  created_by_email?: string | null;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "archived";
  approved_by: number | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequestDTO {
  name: string;
  description?: string;
  team_id: number;
}

export interface CreateProjectResponseDTO {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_by: number;
  created_at: string;
}

export interface ProjectListItemDTO {
  id: number;
  name: string;
  lastUpdate: string;
  team: string[];
  status: string;
}

export interface ApproveProjectRequestDTO {
  project_id: number;
}

export interface RejectProjectRequestDTO {
  project_id: number;
  rejection_reason: string;
}

export type ProjectStatus = "pending" | "approved" | "rejected" | "active" | "completed";
