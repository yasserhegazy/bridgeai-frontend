/**
 * SettingsTab Component
 * Project settings management
 * Single Responsibility: Project settings UI
 */

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useProjectDetails, useFlashMessage } from "@/hooks";
import { Loader2 } from "lucide-react";

interface SettingsTabProps {
  projectId: number;
}

export function SettingsTab({ projectId }: SettingsTabProps) {
  const { project, isLoading, isUpdating, error, saveProjectChanges } =
    useProjectDetails(projectId);

  const { flashMessage, showSuccess } = useFlashMessage();
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSaveChanges = useCallback(async () => {
    try {
      setLocalError(null);

      if (!project) {
        setLocalError("Project not loaded");
        return;
      }

      // Check if anything changed
      if (name === project.name && description === project.description) {
        setLocalError("No changes to save");
        return;
      }

      // Prepare update payload with only changed fields
      const updateData: { name?: string; description?: string } = {};
      if (name !== project.name) updateData.name = name;
      if (description !== project.description) updateData.description = description;

      const success = await saveProjectChanges(updateData);
      if (success) {
        showSuccess("Project updated successfully!");
      }
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Failed to update project"
      );
    }
  }, [name, description, project, saveProjectChanges, showSuccess]);

  // Update local state when project loads
  if (project && !name && !description) {
    setName(project.name);
    setDescription(project.description || "");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#341bab]" />
        <span className="ml-3 text-gray-600">Loading project settings...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Project Info</h2>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleSaveChanges}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Success Message */}
        {flashMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {flashMessage.message}
          </div>
        )}

        {/* Error Message */}
        {(localError || error) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError || error}
          </div>
        )}

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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab] min-h-[100px]"
              disabled={isUpdating}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
