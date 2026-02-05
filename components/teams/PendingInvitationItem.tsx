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
    client: "bg-blue-100 text-blue-800",
    ba: "bg-purple-100 text-purple-800",
  };

  return roleColors[role.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    client: "Client",
    ba: "Business Analyst",
  };

  return roleLabels[role.toLowerCase()] || role;
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
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white hover:shadow-md border border-yellow-100 transition-all duration-200 group bg-yellow-50/20">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors">
          <Mail className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 truncate">{invitation.email}</span>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="uppercase tracking-tight">Invited {formattedCreatedAt}</span>
            <span className="text-gray-200">•</span>
            <span className="uppercase tracking-tight text-yellow-600/70">Expires {formattedExpiresAt}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getRoleBadgeColor(
            invitation.role
          )}`}
        >
          {getRoleLabel(invitation.role)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl p-1">
            <DropdownMenuItem className="text-red-600 rounded-lg text-sm font-medium py-2" onClick={handleCancel}>
              <UserX className="w-4 h-4 mr-2" />
              Cancel Invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
