/**
 * Team Members Section Component
 * Displays and manages team members and invitations
 * Single Responsibility: Team members section UI
 */

"use client";

import { useState, useCallback } from "react";
import { InviteMemberModal } from "@/components/teams/InviteMemberModal";
import { TeamMemberItem } from "@/components/teams/TeamMemberItem";
import { PendingInvitationItem } from "@/components/teams/PendingInvitationItem";
import { ChangeRoleDialog } from "@/components/teams/ChangeRoleDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTeamMembers } from "@/hooks/teams/useTeamMembers";
import { useTeamInvitations } from "@/hooks/teams/useTeamInvitations";

interface TeamMembersSectionProps {
  teamId: string;
  onUpdate?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

interface RoleChangeState {
  memberId: number;
  currentRole: string;
}

export function TeamMembersSection({
  teamId,
  onUpdate,
  onSuccess,
  onError,
}: TeamMembersSectionProps) {
  const [roleChangeState, setRoleChangeState] = useState<RoleChangeState | null>(null);

  const {
    members,
    isLoading: membersLoading,
    refreshMembers,
    changeRole,
    removeMemberById,
  } = useTeamMembers(teamId);

  const {
    pendingInvitations,
    isLoading: invitationsLoading,
    refreshInvitations,
    cancelInvitation,
  } = useTeamInvitations(teamId);

  const isLoading = membersLoading || invitationsLoading;

  const handleInviteSent = useCallback(() => {
    refreshMembers();
    refreshInvitations();
    onUpdate?.();
  }, [refreshMembers, refreshInvitations, onUpdate]);

  const handleChangeRole = useCallback((memberId: number, currentRole: string) => {
    setRoleChangeState({ memberId, currentRole });
  }, []);

  const handleConfirmRoleChange = useCallback(
    async (newRole: string) => {
      if (!roleChangeState) return;

      const success = await changeRole(roleChangeState.memberId, newRole);

      if (success) {
        onSuccess?.("Member role updated successfully!");
        setRoleChangeState(null);
      } else {
        onError?.("Failed to change member role");
      }
    },
    [roleChangeState, changeRole, onSuccess, onError]
  );

  const handleCancelRoleChange = useCallback(() => {
    setRoleChangeState(null);
  }, []);

  const handleRemoveMember = useCallback(
    async (memberId: number, memberName: string) => {
      const confirmed = window.confirm(
        `Are you sure you want to remove ${memberName} from the team?`
      );

      if (!confirmed) return;

      const success = await removeMemberById(memberId);

      if (success) {
        onSuccess?.("Member removed successfully!");
      } else {
        onError?.("Failed to remove member");
      }
    },
    [removeMemberById, onSuccess, onError]
  );

  const handleCancelInvitation = useCallback(
    async (invitationId: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this invitation?"
      );

      if (!confirmed) return;

      const success = await cancelInvitation(invitationId);

      if (success) {
        onSuccess?.("Invitation canceled successfully");
      } else {
        onError?.("Failed to cancel invitation");
      }
    },
    [cancelInvitation, onSuccess, onError]
  );

  return (
    <>
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <InviteMemberModal teamId={teamId} onInviteSent={handleInviteSent} />
        </div>

        {/* Current Members */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Members ({members.length})
          </h3>
          {membersLoading ? (
            <LoadingSpinner className="py-4" />
          ) : members.length === 0 ? (
            <EmptyState message="No members yet" />
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <TeamMemberItem
                  key={member.id}
                  member={member}
                  onChangeRole={handleChangeRole}
                  onRemove={handleRemoveMember}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pending Invitations */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Invitations ({pendingInvitations.length})
            </h3>
            {invitationsLoading && <LoadingSpinner size="sm" />}
          </div>

          {pendingInvitations.length === 0 ? (
            <EmptyState
              message={
                invitationsLoading
                  ? "Loading invitations..."
                  : "No pending invitations"
              }
            />
          ) : (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <PendingInvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  onCancel={handleCancelInvitation}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Role Change Dialog */}
      {roleChangeState && (
        <ChangeRoleDialog
          currentRole={roleChangeState.currentRole}
          onConfirm={handleConfirmRoleChange}
          onCancel={handleCancelRoleChange}
        />
      )}
    </>
  );
}
