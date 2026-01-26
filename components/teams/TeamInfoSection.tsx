/**
 * Team Info Section Component
 * Displays and edits team name and description
 * Single Responsibility: Team info UI
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useTeamSettings } from "@/hooks/teams/useTeamSettings";

interface TeamInfoSectionProps {
  teamId: string;
  teamName: string;
  teamDescription: string;
  onUpdate?: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function TeamInfoSection({
  teamId,
  teamName,
  teamDescription,
  onUpdate,
  onSuccess,
  onError,
}: TeamInfoSectionProps) {
  const [name, setName] = useState(teamName);
  const [description, setDescription] = useState(teamDescription || "");
  const { isUpdating, updateTeamInfo } = useTeamSettings();

  const hasChanges = useMemo(() => {
    return name !== teamName || description !== (teamDescription || "");
  }, [name, teamName, description, teamDescription]);

  const handleSave = useCallback(async () => {
    if (!hasChanges) {
      onSuccess?.("No changes to save");
      return;
    }

    const success = await updateTeamInfo(teamId, name, description);

    if (success) {
      onSuccess?.("Team updated successfully!");
      onUpdate?.();
    } else {
      onError?.("Failed to update team. Please try again.");
    }
  }, [hasChanges, teamId, name, description, updateTeamInfo, onUpdate, onSuccess, onError]);

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Team Info</h2>
        <Button
          variant="primary"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleSave}
          disabled={isUpdating || !hasChanges}
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            disabled={isUpdating}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
            rows={3}
            disabled={isUpdating}
          />
        </div>
      </div>
    </section>
  );
}
