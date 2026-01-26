"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { ProjectDTO } from "@/dto/projects.dto";
import { RejectDialog } from "./RejectDialog";

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

interface PendingRequestsTableProps {
  projects: ProjectDTO[];
  onApprove: (projectId: number) => Promise<void>;
  onReject: (projectId: number, reason: string) => Promise<void>;
  onViewDetails: (project: ProjectDTO) => void;
}

export function PendingRequestsTable({
  projects,
  onApprove,
  onReject,
  onViewDetails,
}: PendingRequestsTableProps) {
  const [loadingApprove, setLoadingApprove] = useState<number | null>(null);
  const [rejectingProjectId, setRejectingProjectId] = useState<number | null>(null);

  const handleApprove = async (projectId: number) => {
    setLoadingApprove(projectId);
    try {
      await onApprove(projectId);
    } finally {
      setLoadingApprove(null);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (rejectingProjectId) {
      await onReject(rejectingProjectId, reason);
      setRejectingProjectId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground mb-2">No pending requests</p>
        <p className="text-sm text-muted-foreground">
          All client project requests have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Project Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Created By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Requested Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{project.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {project.description || "No description"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {project.created_by_name || `User ${project.created_by}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {formatDate(project.created_at)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      Pending
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(project)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(project.id)}
                        disabled={loadingApprove === project.id}
                        className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {loadingApprove === project.id ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectingProjectId(project.id)}
                        className="h-8 px-3"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RejectDialog
        isOpen={rejectingProjectId !== null}
        onClose={() => setRejectingProjectId(null)}
        onSubmit={handleRejectSubmit}
        projectName={
          projects.find((p) => p.id === rejectingProjectId)?.name || ""
        }
      />
    </>
  );
}
