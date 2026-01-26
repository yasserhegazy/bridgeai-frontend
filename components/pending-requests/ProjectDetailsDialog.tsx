"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectDTO } from "@/dto/projects.dto";
import { X } from "lucide-react";

interface ProjectDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDTO | null;
}

export function ProjectDetailsDialog({
  isOpen,
  onClose,
  project,
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.name}</DialogTitle>
          <DialogDescription>
            Project request details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge 
                variant="outline" 
                className="bg-yellow-100 text-yellow-700 border-yellow-300"
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="mt-1 text-sm">
              {project.description || "No description provided"}
            </p>
          </div>

          {/* Team ID */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Team ID</label>
            <p className="mt-1 text-sm">{project.team_id}</p>
          </div>

          {/* Created By */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created By</label>
            <p className="mt-1 text-sm">
              {project.created_by_name || `User ${project.created_by}`}
              {project.created_by_email && (
                <span className="text-muted-foreground ml-2">({project.created_by_email})</span>
              )}
            </p>
          </div>

          {/* Created At */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Requested On</label>
            <p className="mt-1 text-sm">{formatDate(project.created_at)}</p>
          </div>

          {/* Updated At */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="mt-1 text-sm">{formatDate(project.updated_at)}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
