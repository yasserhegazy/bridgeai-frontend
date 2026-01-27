/**
 * Notifications DTOs
 * Data Transfer Objects for notification-related data
 */

/**
 * Notification type enum
 */
export type NotificationType =
  | "project_approval"
  | "team_invitation"
  | "crs_created"
  | "crs_updated"
  | "crs_status_changed"
  | "crs_comment_added"
  | "crs_approved"
  | "crs_rejected"
  | "crs_review_assigned";

/**
 * Notification metadata for different notification types
 */
export interface NotificationMetadata {
  // Project notifications
  project_id?: number;
  project_name?: string;
  project_status?: string;
  project_description?: string;

  // Team invitation notifications
  team_id?: number;
  team_name?: string;
  invitation_token?: string;
  invitation_role?: string;
  action_type?: "invitation_received" | "invitation_accepted";

  // CRS notifications
  crs_id?: number;
  status?: string;
}

/**
 * Single notification DTO
 */
export interface NotificationDTO {
  id: number;
  user_id: number;
  type: NotificationType;
  reference_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: NotificationMetadata;
}

/**
 * Notification list response DTO
 */
export interface NotificationListDTO {
  notifications: NotificationDTO[];
  unread_count: number;
  total_count: number;
}

/**
 * Mark notification as read response DTO
 */
export interface MarkAsReadResponseDTO {
  message: string;
}

/**
 * Accept invitation from notification response DTO
 */
export interface AcceptInvitationResponseDTO {
  message: string;
  team_id: number;
  role: string;
}
