"use client";

import { use, useState, useCallback } from "react";
import { PendingRequestsTable } from "@/components/pending-requests/PendingRequestsTable";
import { ProjectDetailsDialog } from "@/components/pending-requests/ProjectDetailsDialog";
import { usePendingProjects } from "@/hooks/projects/usePendingProjects";
import { useRoleGuard } from "@/hooks/shared/useRoleGuard";
import { ProjectDTO } from "@/dto/projects.dto";

interface PendingRequestsPageProps {
  params: Promise<{ id: string }>;
}

export default function PendingRequestsPage({ params }: PendingRequestsPageProps) {
  const { id: teamId } = use(params);
  const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { isChecking, isAuthorized } = useRoleGuard({
    roles: ["ba"],
    redirectTo: `/teams/${teamId}/dashboard`,
  });

  const {
    pendingProjects,
    isLoading,
    error,
    isProcessing,
    handleApprove,
    handleReject,
  } = usePendingProjects(isAuthorized);

  const onApprove = useCallback(
    async (projectId: number) => {
      const success = await handleApprove(projectId);
      if (success) {
        setSuccessMessage("Project approved successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    },
    [handleApprove]
  );

  const onReject = useCallback(
    async (projectId: number, reason: string) => {
      const success = await handleReject(projectId, reason);
      if (success) {
        setSuccessMessage("Project rejected successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    },
    [handleReject]
  );

  const onViewDetails = useCallback((project: ProjectDTO) => {
    setSelectedProject(project);
  }, []);

  const onCloseDialog = useCallback(() => {
    setSelectedProject(null);
  }, []);

  if (isChecking || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">
          {isChecking ? "Verifying access..." : "Loading pending requests..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Project Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve or reject client project requests
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Projects Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {pendingProjects.length} {pendingProjects.length === 1 ? "request" : "requests"} pending review
          </p>
        </div>

        {/* Table */}
        <PendingRequestsTable
          projects={pendingProjects}
          onApprove={onApprove}
          onReject={onReject}
          onViewDetails={onViewDetails}
        />

        {/* Details Dialog */}
        <ProjectDetailsDialog
          isOpen={selectedProject !== null}
          onClose={onCloseDialog}
          project={selectedProject}
        />
      </div>
    </div>
  );
}
