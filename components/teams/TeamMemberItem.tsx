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
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#341bab] text-white flex items-center justify-center font-semibold">
          {initial}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-black">{displayName}</span>
          <span className="text-sm text-gray-600">{member.user.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
            member.role
          )}`}
        >
          {member.role}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleChangeRole}>
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleRemove}>
              <UserX className="w-4 h-4 mr-2" />
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
