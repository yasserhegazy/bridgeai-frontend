/**
 * Data Transfer Objects for Teams
 * Defines strict contracts between backend and frontend
 */

export interface TeamDTO {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_by?: number;
  created_at?: string;
  member_count?: number;
}

export interface CreateTeamRequestDTO {
  name: string;
  description?: string;
}

export interface CreateTeamResponseDTO {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  created_by: number;
}

export interface TeamListItemDTO {
  id: number;
  name: string;
  description?: string;
  status: string;
  lastUpdate: string;
  members?: string[];
  member_count?: number;
}

export interface InviteMemberRequestDTO {
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
}

export interface InviteMemberResponseDTO {
  id: string;
  email: string;
  role: string;
  team_id: string;
  invited_by_user_id: string;
  token: string;
  status: "pending" | "accepted" | "expired" | "canceled";
  created_at: string;
  expires_at: string;
}

export interface TeamMemberDTO {
  id: number;
  user_id: number;
  team_id: number;
  role: string;
  joined_at: string;
}

export type TeamStatus = "active" | "inactive" | "archived";
export type MemberRole = "owner" | "admin" | "member" | "viewer";
