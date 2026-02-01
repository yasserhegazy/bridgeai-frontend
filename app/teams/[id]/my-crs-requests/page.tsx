"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { FileCheck, Loader2 } from "lucide-react";
import { MyCRSRequestsTable } from "@/components/my-crs-requests/MyCRSRequestsTable";
import { CRSDetailsDialog } from "@/components/my-crs-requests/CRSDetailsDialog";
import { useMyCRSRequests, useProjects, useTeamsList } from "@/hooks";
import { CRSDTO, CRSStatus } from "@/dto/crs.dto";

export default function MyCRSRequestsPage() {
  const params = useParams();
  const teamId = parseInt(params.id as string, 10);

  const [selectedCRS, setSelectedCRS] = useState<CRSDTO | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    setActiveTeamId,
  } = useProjects(teamId);

  const {
    filteredRequests,
    isLoading: isCRSLoading,
    error: crsError,
    selectedStatus,
    setSelectedStatus,
    selectedTeam,
    setSelectedTeam,
    selectedProject,
    setSelectedProject,
    searchTerm,
    setSearchTerm,
    refreshRequests,
  } = useMyCRSRequests(teamId, projects);

  const {
    teams,
    isLoading: isTeamsLoading,
    error: teamsError
  } = useTeamsList();

  const isLoading = isCRSLoading || isProjectsLoading || isTeamsLoading;
  const error = crsError || projectsError || teamsError;

  const handleTeamChange = useCallback((teamId: number | "all") => {
    setSelectedTeam(teamId);
    if (teamId !== "all") {
      setActiveTeamId(teamId);
    }
  }, [setSelectedTeam, setActiveTeamId]);

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
    const updatedRequests = await refreshRequests();

    if (selectedCRS && updatedRequests) {
      const updatedCRS = updatedRequests.find((crs: CRSDTO) => crs.id === selectedCRS.id);
      if (updatedCRS) {
        setSelectedCRS(updatedCRS);
      }
    }

    setSuccessMessage("CRS updated successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [refreshRequests, selectedCRS]);

  const getProjectName = useCallback(
    (projectId: number): string => {
      const project = projects.find((p) => p.id === projectId);
      return project ? project.name : `Project #${projectId}`;
    },
    [projects]
  );

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <FileCheck className="h-[26px] w-[26px] text-primary" />
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              My CRS Requests
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track the progress of your client requirements specification documents.
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
            {/* crs table */}
            <MyCRSRequestsTable
              documents={filteredRequests}
              projects={projects}
              teams={teams.map(t => ({ id: t.id, name: t.name }))}
              onViewDetails={handleViewDetails}
              statusFilter={selectedStatus}
              onFilterChange={handleFilterChange}
              selectedTeam={selectedTeam}
              onTeamChange={handleTeamChange}
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              currentTeamId={teamId}
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
