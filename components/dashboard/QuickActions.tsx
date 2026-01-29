/**
 * QuickActions Component
 * Displays quick action buttons for team dashboard
 * Single Responsibility: Quick actions UI rendering
 */

"use client";

import { memo } from "react";
import { Plus, UserPlus } from "lucide-react";

interface QuickActionsProps {
  onCreateProject: () => void;
  onInviteMember: () => void;
}

export const QuickActions = memo(function QuickActions({
  onCreateProject,
  onInviteMember,
}: QuickActionsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

      <div className="space-y-3">
        <button
          onClick={onCreateProject}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Project</span>
        </button>

        <button
          onClick={onInviteMember}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Team Member</span>
        </button>
      </div>

    </div>
  );
});
