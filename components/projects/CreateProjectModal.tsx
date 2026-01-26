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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Submit a new project request for your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="projectName" className="block text-sm font-medium">
              Project Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              required
              maxLength={256}
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/256 characters
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="projectDescription" className="block text-sm font-medium">
              Description <span className="text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              id="projectDescription"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              rows={4}
              className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
            />
          </div>

          {(formError || error) && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-900">{formError || error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-900">{successMessage}</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating}
              className="hover:cursor-pointer sm:ml-2"
            >
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
