/**
 * Pending Requests Page
 * BA-only page for reviewing and approving/rejecting project requests
 * Refactored for SOLID principles and best practices
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PendingRequestsTable } from "@/components/pending-requests/PendingRequestsTable";
import { ProjectDetailsDialog } from "@/components/pending-requests/ProjectDetailsDialog";
import { usePendingRequests } from "@/hooks";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { ProjectDTO } from "@/dto/projects.dto";
import { useCurrentUser } from "@/hooks";

export default function PendingRequestsPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(null);
  const { user: currentUser, isLoading: userLoading } = useCurrentUser();

  const {
    projects,
    isLoading,
    error,
    successMessage,
    handleApprove,
    handleReject,
  } = usePendingRequests();

  // Verify BA role
  useEffect(() => {
    if (!userLoading && currentUser && currentUser.role !== "ba") {
      router.push("/");
    }
  }, [currentUser, userLoading, router]);

  const handleViewDetails = useCallback((project: ProjectDTO) => {
    setSelectedProject(project);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProject(null);
  }, []);

  if (userLoading || isLoading) {
    return (
      <LoadingSpinner
        className="min-h-screen"
        message="Loading pending requests..."
      />
    );
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8 pb-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Project Requests
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Review and manage client project requests for your validation.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Projects Table/Cards */}
        <PendingRequestsTable
          projects={projects}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
        />

        {/* Details Dialog */}
        <ProjectDetailsDialog
          isOpen={selectedProject !== null}
          onClose={handleCloseDetails}
          project={selectedProject}
        />
      </div>
    </div>
  );
}

