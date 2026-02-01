/**
 * Team Info Section Component
 * Displays and edits team name and description
 * Single Responsibility: Team info UI
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useTeamSettings } from "@/hooks/teams/useTeamSettings";

import { Pencil, Save, Loader2 } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Team Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure team name and description.
          </p>
        </div>
        <Button
          variant="primary"
          size="default"
          className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-6 border-none h-10"
          onClick={handleSave}
          disabled={isUpdating || !hasChanges}
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="font-semibold text-sm">{isUpdating ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label className="text-sm font-bold text-gray-900 ml-1 block mb-3">
            Team Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Engineering Team"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
            disabled={isUpdating}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-900 ml-1 block mb-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your team's focus..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm min-h-[120px] resize-none"
            rows={4}
            disabled={isUpdating}
          />
        </div>
      </section>
    </div>
  );
}
