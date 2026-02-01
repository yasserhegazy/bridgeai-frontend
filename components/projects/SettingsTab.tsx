/**
 * SettingsTab Component
 * Project settings management
 * Single Responsibility: Project settings UI
 */

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useProjectDetails, useFlashMessage } from "@/hooks";
import { Loader2, Pencil, Plus } from "lucide-react";

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
    <div className="flex flex-col gap-6 bg-gray-50/50 min-h-[calc(100vh-100px)] p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-2">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Pencil className="w-6 h-6 text-primary" />
            Project Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure project name, description, and visibility.
          </p>
        </div>
        <Button
          variant="primary"
          size="default"
          className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-6 border-none h-10"
          onClick={handleSaveChanges}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 font-bold" />
          )}
          <span className="font-semibold text-sm">{isUpdating ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>

      <div className="space-y-6 px-4 pb-10">
        {/* Success/Error Alerts */}
        {flashMessage && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {flashMessage.message}
            </div>
          </div>
        )}
        {(localError || error) && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {localError || error}
            </div>
          </div>
        )}

        {/* Main Settings Card */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-900 ml-1 block mb-3">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Awesome Project"
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
              placeholder="Describe your project goals..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm min-h-[120px] resize-none"
              disabled={isUpdating}
            />
          </div>
        </section>

      </div>
    </div>
  );
}
