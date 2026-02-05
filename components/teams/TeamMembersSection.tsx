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
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Loader2 } from "lucide-react";

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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Members
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage team members (maximum 2: 1 Client + 1 BA). Roles are automatically assigned.
            </p>
          </div>
          <InviteMemberModal
            teamId={teamId}
            onInviteSent={handleInviteSent}
            triggerLabel="Invite Member"
            triggerSize="default"
            triggerVariant="primary"
            triggerClassName="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 px-6 border-none h-10 font-semibold text-sm"
            currentMemberCount={members?.length || 0}
          />
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-8">
          {/* Current Members */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <label className="text-sm font-bold text-gray-900">
                Current Members ({members.length})
              </label>
            </div>
            {membersLoading ? (
              <LoadingSpinner className="py-4" />
            ) : members.length === 0 ? (
              <EmptyState message="No members yet" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4 px-1">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Pending Invitations ({pendingInvitations.length})
                {invitationsLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              </label>
            </div>

            {pendingInvitations.length === 0 ? (
              <div className="bg-gray-50/50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                <p className="text-sm text-muted-foreground italic">
                  {invitationsLoading ? "Loading invitations..." : "No pending invitations"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

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
