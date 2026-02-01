/**
 * QuickActions Component
 * Displays quick action buttons for team dashboard
 * Single Responsibility: Quick actions UI rendering
 */

"use client";

import { memo } from "react";
import { Plus, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

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
      <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Quick Actions</h2>

      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onCreateProject}
          className="w-full h-12 gap-3 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onInviteMember}
          className="w-full h-12 gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-sm bg-gray-50/50 hover:bg-gray-50 border-gray-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </Button>
      </div>
    </div>
  );
});
