"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Mail, Clock, UserX } from "lucide-react";
import { InviteMemberModal } from "@/components/teams/InviteMemberModal";
import { invitationAPI, InvitationResponse } from "@/lib/api-invitations";
import { apiCall } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Member {
  id: number;
  team_id: number;
  user_id: number;
  role: string;
  is_active?: boolean;
  joined_at?: string;
  updated_at?: string;
  user: {
    id: number;
    email: string;
    full_name?: string;
    username?: string;
    role?: string;
  };
}

interface TeamSettingsGridProps {
  teamId: string;
  teamName?: string;
  teamDescription?: string;
  members?: Member[];
  onTeamUpdate?: () => void;
}

export function TeamSettingsGrid({
  teamId,
  teamName = "Awesome Team",
  teamDescription = "This is the team description",
  members: initialMembers,
  onTeamUpdate,
}: TeamSettingsGridProps) {
  const [pendingInvites, setPendingInvites] = useState<InvitationResponse[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [members, setMembers] = useState<Member[]>(initialMembers || []);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [updatingName, setUpdatingName] = useState(teamName || '');
  const [updatingDescription, setUpdatingDescription] = useState(teamDescription || '');
  const [isSaving, setIsSaving] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [changingRoleMemberId, setChangingRoleMemberId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    fetchPendingInvites();
    fetchTeamMembers();
  }, [teamId]);

  useEffect(() => {
    setUpdatingName(teamName || '');
    setUpdatingDescription(teamDescription || '');
  }, [teamName, teamDescription]);

  const fetchPendingInvites = async () => {
    try {
      setLoadingInvites(true);
      const invites = await invitationAPI.getTeamInvitations(teamId);
      setPendingInvites(invites.filter(invite => invite.status === 'pending'));
    } catch (error) {
      // Silently handle error - endpoint might not be implemented yet
      console.log('Team invitations endpoint not available yet');
      setPendingInvites([]);
    } finally {
      setLoadingInvites(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setLoadingMembers(true);
      const data = await apiCall<Member[]>(`/api/teams/${teamId}/members`);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleInviteSent = () => {
    fetchPendingInvites();
    fetchTeamMembers();
    onTeamUpdate?.();
  };

  const handleSaveChanges = async () => {
    // Check if anything has changed
    if (updatingName === teamName && updatingDescription === teamDescription) {
      setFlashMessage({ type: 'info', message: 'No changes to save' });
      setTimeout(() => setFlashMessage(null), 3000);
      return;
    }

    try {
      setIsSaving(true);
      await apiCall(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatingName,
          description: updatingDescription,
        }),
      });
      setFlashMessage({ type: 'success', message: 'Team updated successfully!' });
      setTimeout(() => setFlashMessage(null), 3000);
      onTeamUpdate?.();
    } catch (error) {
      console.error('Error updating team:', error);
      setFlashMessage({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to update team. Please try again.' 
      });
      setTimeout(() => setFlashMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    try {
      await invitationAPI.cancelInvitation(invitationId);
      fetchPendingInvites();
    } catch (error) {
      console.log('Cancel invitation feature not available yet');
      alert('Cancel invitation feature is not available yet. Please contact support.');
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    try {
      await invitationAPI.resendInvitation(invitationId);
      alert('Invitation resent successfully!');
    } catch (error) {
      console.log('Resend invitation feature not available yet');
      alert('Resend invitation feature is not available yet. Please contact support.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChangeRole = async (memberId: number, currentRole: string) => {
    setChangingRoleMemberId(memberId);
    setNewRole(currentRole);
  };

  const handleConfirmRoleChange = async () => {
    if (!changingRoleMemberId || !newRole) return;

    try {
      await apiCall(`/api/teams/${teamId}/members/${changingRoleMemberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      setFlashMessage({ type: 'success', message: 'Member role updated successfully!' });
      setTimeout(() => setFlashMessage(null), 3000);
      
      fetchTeamMembers();
      setChangingRoleMemberId(null);
      setNewRole('');
    } catch (error) {
      console.error('Error changing role:', error);
      setFlashMessage({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to change member role' 
      });
      setTimeout(() => setFlashMessage(null), 5000);
    }
  };

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    try {
      await apiCall(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE'
      });
      
      setFlashMessage({ type: 'success', message: 'Member removed successfully!' });
      setTimeout(() => setFlashMessage(null), 3000);
      
      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      setFlashMessage({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to remove member' 
      });
      setTimeout(() => setFlashMessage(null), 5000);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'member': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Flash Message */}
      {flashMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 ${
            flashMessage.type === 'success'
              ? 'bg-green-500 text-white'
              : flashMessage.type === 'info'
              ? 'bg-blue-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {flashMessage.type === 'success' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {flashMessage.type === 'info' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {flashMessage.type === 'error' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{flashMessage.message}</span>
        </div>
      )}

      {/* Team Info Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Team Info</h2>
          <Button 
            variant="primary" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={updatingName}
              onChange={(e) => setUpdatingName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={updatingDescription}
              onChange={(e) => setUpdatingDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            />
          </div>
        </div>
      </section>

      {/* Team Members Section */}
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
          {loadingMembers ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#341BAB]"></div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No members yet
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const displayName = member.user.full_name || member.user.username || member.user.email.split('@')[0];
                const displayEmail = member.user.email;
                const initial = displayName.charAt(0).toUpperCase();
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#341bab] text-white flex items-center justify-center font-semibold">
                        {initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-black">{displayName}</span>
                        <span className="text-sm text-gray-600">{displayEmail}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleChangeRole(member.id, member.role)}>
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleRemoveMember(member.id, displayName)}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Invites */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Invitations ({pendingInvites.length})
            </h3>
            {loadingInvites && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
            )}
          </div>
          
          {pendingInvites.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {loadingInvites ? "Loading invitations..." : "No pending invitations"}
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-black">{invite.email}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Invited {formatDate(invite.created_at)}</span>
                        <span>•</span>
                        <span>Expires {formatDate(invite.expires_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(invite.role)}`}>
                      {invite.role}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleResendInvite(invite.id)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleCancelInvite(invite.id)}
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Cancel Invitation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Role Change Dialog */}
      {changingRoleMemberId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Member Role</h3>
            <div className="space-y-2 mb-4">
              {['owner', 'admin', 'member', 'viewer'].map((role) => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={newRole === role}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-4 h-4 text-[#341BAB]"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}>
                    {role}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setChangingRoleMemberId(null);
                  setNewRole('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmRoleChange}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
