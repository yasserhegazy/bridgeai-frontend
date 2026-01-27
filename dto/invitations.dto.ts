/**
 * Invitations DTOs
 * Data Transfer Objects for team invitation-related data
 */

/**
 * Invitation status enum
 */
export type InvitationStatus = "pending" | "accepted" | "expired" | "canceled";

/**
 * Team member role enum
 */
export type InvitationRole = "owner" | "admin" | "member" | "viewer";

/**
 * Send invitation request DTO
 */
export interface SendInvitationRequestDTO {
  email: string;
  role: InvitationRole;
}

/**
 * Invitation response DTO
 */
export interface InvitationDTO {
  id: string;
  email: string;
  role: string;
  team_id: string;
  invited_by_user_id: string;
  token: string;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
}

/**
 * Public invitation details DTO (no auth required)
 */
export interface InvitationPublicDetailsDTO {
  email: string;
  role: string;
  team_id: number;
  team_name: string;
  team_description?: string;
  invited_by_name: string;
  invited_by_email: string;
  created_at: string;
  expires_at: string;
  status: string;
}

/**
 * Accept invitation response DTO
 */
export interface AcceptInvitationResponseDTO {
  message: string;
  team_id?: number;
  team?: {
    id: string | number;
    name: string;
    description: string;
  };
  role: string;
}

/**
 * Reject invitation response DTO
 */
export interface RejectInvitationResponseDTO {
  message: string;
}

/**
 * Cancel invitation response DTO
 */
export interface CancelInvitationResponseDTO {
  message: string;
}

/**
 * Resend invitation response DTO
 */
export interface ResendInvitationResponseDTO {
  message: string;
}

/**
 * Pending invitation item DTO
 */
export interface PendingInvitationDTO {
  id: string;
  email: string;
  role: string;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
}
