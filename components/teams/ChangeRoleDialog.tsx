/**
 * Change Role Dialog Component
 * Modal for changing team member role
 * Single Responsibility: Role change UI
 */

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface ChangeRoleDialogProps {
  currentRole: string;
  onConfirm: (newRole: string) => void;
  onCancel: () => void;
}

const AVAILABLE_ROLES = ["owner", "admin", "member", "viewer"];

function getRoleBadgeColor(role: string): string {
  const roleColors: Record<string, string> = {
    owner: "bg-red-100 text-red-800",
    admin: "bg-purple-100 text-purple-800",
    member: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
  };

  return roleColors[role.toLowerCase()] || "bg-gray-100 text-gray-800";
}

export function ChangeRoleDialog({
  currentRole,
  onConfirm,
  onCancel,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedRole);
  }, [selectedRole, onConfirm]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Change Member Role</h3>
        <div className="space-y-2 mb-4">
          {AVAILABLE_ROLES.map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-4 h-4 text-[#341BAB]"
              />
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                  role
                )}`}
              >
                {role}
              </span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
