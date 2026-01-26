/**
 * Pending Invitation Item Component
 * Displays pending invitation with cancel action
 * Single Responsibility: Invitation item UI
 */

"use client";

import { useMemo, useCallback } from "react";
import { Mail, Clock, MoreHorizontal, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invitation } from "@/services/teamMembers.service";

interface PendingInvitationItemProps {
  invitation: Invitation;
  onCancel: (invitationId: string) => void;
}

function getRoleBadgeColor(role: string): string {
  const roleColors: Record<string, string> = {
    owner: "bg-red-100 text-red-800",
    admin: "bg-purple-100 text-purple-800",
    member: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
  };

  return roleColors[role.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PendingInvitationItem({
  invitation,
  onCancel,
}: PendingInvitationItemProps) {
  const formattedCreatedAt = useMemo(() => {
    return formatDate(invitation.created_at);
  }, [invitation.created_at]);

  const formattedExpiresAt = useMemo(() => {
    return formatDate(invitation.expires_at);
  }, [invitation.expires_at]);

  const handleCancel = useCallback(() => {
    onCancel(invitation.id);
  }, [invitation.id, onCancel]);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-black">{invitation.email}</span>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Invited {formattedCreatedAt}</span>
            <span>•</span>
            <span>Expires {formattedExpiresAt}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
            invitation.role
          )}`}
        >
          {invitation.role}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-600" onClick={handleCancel}>
              <UserX className="w-4 h-4 mr-2" />
              Cancel Invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
