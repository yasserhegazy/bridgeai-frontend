"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { FileCheck, Loader2 } from "lucide-react";
import { MyCRSRequestsTable } from "@/components/my-crs-requests/MyCRSRequestsTable";
import { CRSDetailsDialog } from "@/components/my-crs-requests/CRSDetailsDialog";
import { useMyCRSRequests } from "@/hooks/crs/useMyCRSRequests";
import { useProjects } from "@/hooks/projects/useProjects";
import { CRSDTO, CRSStatus } from "@/dto/crs.dto";
import { ProjectDTO } from "@/dto/projects.dto";

export default function MyCRSRequestsPage() {
  const params = useParams();
  const teamId = parseInt(params.id as string, 10);

  const [selectedCRS, setSelectedCRS] = useState<CRSDTO | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    filteredRequests,
    isLoading: isCRSLoading,
    error: crsError,
    selectedStatus,
    setSelectedStatus,
    refreshRequests,
  } = useMyCRSRequests(teamId);

  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useProjects(teamId);

  const isLoading = isCRSLoading || isProjectsLoading;
  const error = crsError || projectsError;

  const handleFilterChange = useCallback(
    (newStatus: CRSStatus | "all") => {
      setSelectedStatus(newStatus);
    },
    [setSelectedStatus]
  );

  const handleViewDetails = useCallback((crs: CRSDTO) => {
    setSelectedCRS(crs);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedCRS(null);
  }, []);

  const handleStatusUpdate = useCallback(async () => {
    await refreshRequests();
    setSuccessMessage("CRS resubmitted successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [refreshRequests]);

  const getProjectName = useCallback(
    (projectId: number): string => {
      const project = projects.find((p) => p.id === projectId);
      return project ? project.name : `Project #${projectId}`;
    },
    [projects]
  );

  return (
    <div className="flex justify-center mt-14 px-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="h-8 w-8 text-[#341bab]" />
            <h1 className="text-3xl font-bold text-gray-900">
              My CRS Requests
            </h1>
          </div>
          <p className="text-gray-600">
            Track the progress of your Client Requirements Specification documents.
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

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#341bab]" />
            <span className="ml-3 text-gray-600">Loading your CRS requests...</span>
          </div>
        ) : (
          <>
            {/* CRS Table */}
            <MyCRSRequestsTable
              documents={filteredRequests}
              projects={projects}
              onViewDetails={handleViewDetails}
              statusFilter={selectedStatus}
              onFilterChange={handleFilterChange}
            />

            {/* CRS Details Dialog */}
            {selectedCRS && (
              <CRSDetailsDialog
                crs={selectedCRS}
                projectName={getProjectName(selectedCRS.project_id)}
                open={!!selectedCRS}
                onClose={handleCloseDialog}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
