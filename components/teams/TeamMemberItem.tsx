/**
 * Team Member Item Component
 * Displays individual team member with actions
 * Single Responsibility: Member item UI
 */

"use client";

import { useMemo, useCallback } from "react";
import { MoreHorizontal, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamMember } from "@/services/teamMembers.service";

interface TeamMemberItemProps {
  member: TeamMember;
  onChangeRole: (memberId: number, currentRole: string) => void;
  onRemove: (memberId: number, memberName: string) => void;
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

export function TeamMemberItem({
  member,
  onChangeRole,
  onRemove,
}: TeamMemberItemProps) {
  const displayName = useMemo(() => {
    return (
      member.user.full_name ||
      member.user.username ||
      member.user.email.split("@")[0]
    );
  }, [member.user]);

  const initial = useMemo(() => {
    return displayName.charAt(0).toUpperCase();
  }, [displayName]);

  const handleChangeRole = useCallback(() => {
    onChangeRole(member.id, member.role);
  }, [member.id, member.role, onChangeRole]);

  const handleRemove = useCallback(() => {
    onRemove(member.id, displayName);
  }, [member.id, displayName, onRemove]);

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white hover:shadow-md border border-gray-100 transition-all duration-200 group bg-gray-50/30">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
          {initial}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 truncate">{displayName}</span>
          <span className="text-xs font-medium text-gray-500 truncate">{member.user.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getRoleBadgeColor(
            member.role
          )}`}
        >
          {member.role}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl p-1">
            <DropdownMenuItem onClick={handleChangeRole} className="rounded-lg text-sm font-medium py-2">
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 rounded-lg text-sm font-medium py-2" onClick={handleRemove}>
              <UserX className="w-4 h-4 mr-2" />
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
