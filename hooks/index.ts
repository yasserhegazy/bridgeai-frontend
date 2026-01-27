/**
 * Hooks Export
 * Central export point for all custom hooks
 * Organized by feature domain for better maintainability
 */

// ============================================================================
// AUTH HOOKS
// ============================================================================
export { useLogin } from "./auth/useLogin";
export { useRegister } from "./auth/useRegister";
export { useCurrentUser } from "./auth/useCurrentUser";

// ============================================================================
// TEAMS HOOKS
// ============================================================================
export { useTeamsList } from "./teams/useTeamsList";
export { useCreateTeam } from "./teams/useCreateTeam";
export { useTeamDetails } from "./teams/useTeamDetails";
export { useTeamActions } from "./teams/useTeamActions";
export { useTeamMembers } from "./teams/useTeamMembers";
export { useTeamInvitations } from "./teams/useTeamInvitations";
export { useTeamSettings } from "./teams/useTeamSettings";
export { useInviteMember } from "./teams/useInviteMember";

// ============================================================================
// PROJECTS HOOKS
// ============================================================================
export { useProjects } from "./projects/useProjects";
export { useCreateProject } from "./projects/useCreateProject";
export { usePendingProjects } from "./projects/usePendingProjects";
export { useProjectChats } from "./projects/useProjectChats";
export { useProjectDetails } from "./projects/useProjectDetails";

// ============================================================================
// NOTIFICATIONS HOOKS
// ============================================================================
export { useNotificationsList } from "./notifications/useNotificationsList";
export { useNotificationActions } from "./notifications/useNotificationActions";

// ============================================================================
// INVITATIONS HOOKS
// ============================================================================
export { useInvitationDetails } from "./invitations/useInvitationDetails";
export { useInvitationActions } from "./invitations/useInvitationActions";

// ============================================================================
// PENDING REQUESTS HOOKS
// ============================================================================
export { usePendingRequests } from "./pending-requests/usePendingRequests";

// ============================================================================
// CRS HOOKS
// ============================================================================
export { useCRSDashboard } from "./crs/useCRSDashboard";
export { useMyCRSRequests } from "./crs/useMyCRSRequests";
export { useCRSStatusUpdate } from "./crs/useCRSStatusUpdate";
export { useCRSExport } from "./crs/useCRSExport";
export { useCRSAuditLogs } from "./crs/useCRSAuditLogs";

// ============================================================================
// SHARED/COMMON HOOKS
// ============================================================================
export { useFormValidation } from "./shared/useFormValidation";
export type { ValidationRule, ValidationRules, ValidationErrors } from "./shared/useFormValidation";
export { useRoleGuard } from "./shared/useRoleGuard";
export { useModal } from "./shared/useModal";
export { useFlashMessage } from "./shared/useFlashMessage";

// ============================================================================
// CHAT HOOKS
// ============================================================================
export { useChatSocket } from "./chats/useChatSocket";
export { useChatMessages } from "./chats/useChatMessages";
export { useChatCRS } from "./chats/useChatCRS";
export { useChatInput } from "./chats/useChatInput";
export { useChatScroll } from "./chats/useChatScroll";
export { useChatState } from "./chats/useChatState";
