"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateProject } from "@/hooks/projects/useCreateProject";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { AlertCircle, CheckCircle, Loader2, Plus } from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onProjectCreated?: () => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  teamId,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user } = useCurrentUser();
  const { isCreating, error, createNewProject, clearError } = useCreateProject();

  const handleCreateProject = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();
    setSuccessMessage(null);

    if (!name.trim()) {
      setFormError("Project name is required");
      return;
    }

    if (name.trim().length > 256) {
      setFormError("Project name must be 256 characters or less");
      return;
    }

    try {
      const success = await createNewProject({
        name: name.trim(),
        description: description.trim() || undefined,
        team_id: parseInt(teamId, 10),
      });

      if (!success) {
        return;
      }

      // Show role-based success message
      if (user?.role === "ba") {
        setSuccessMessage("Project created successfully!");
      } else {
        setSuccessMessage(
          "Project request submitted successfully! Waiting for Business Analyst approval."
        );
      }

      // Reset form after short delay
      setTimeout(() => {
        setName("");
        setDescription("");
        setSuccessMessage(null);
        onOpenChange(false);

        // Trigger refresh of projects list
        if (onProjectCreated) {
          onProjectCreated();
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create project";
      setFormError(errorMessage);
    }
  }, [name, description, teamId, createNewProject, user?.role, onOpenChange, onProjectCreated, clearError]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Create New Project</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Submit a new project request for your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateProject} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 ml-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="projectName"
              placeholder="e.g. My Awesome Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              className="border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-12 px-4 text-gray-900 rounded-xl shadow-sm placeholder:text-gray-400"
              required
              maxLength={256}
            />
            <p className="text-[10px] text-muted-foreground ml-1">
              {name.length}/256 characters
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="projectDescription" className="block text-sm font-semibold text-gray-700 ml-1">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="projectDescription"
              placeholder="Describe what this project is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-sm shadow-sm resize-none min-h-[120px]"
            />
          </div>

          {(formError || error) && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-semibold">{formError || error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-2 text-green-700 animate-in fade-in slide-in-from-top-1">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-semibold">{successMessage}</p>
            </div>
          )}

          <DialogFooter className="mt-10 sm:justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
              className="px-6 transition-all hover:scale-105 active:scale-95 font-semibold text-primary border-none hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isCreating}
              className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white"
            >
              {isCreating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 font-bold" />
              )}
              <span>{isCreating ? "Creating..." : "Create Project"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
