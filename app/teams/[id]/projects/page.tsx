/**
 * Team Projects Page
 * Displays and manages team projects
 * Refactored for SOLID principles and separation of concerns
 */

"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { Pagination } from "@/components/shared/Pagination";
import { useProjects, useModal, useCurrentUser } from "@/hooks";

const ITEMS_PER_PAGE = 9;


interface CardProject {
  id: number;
  name: string;
  lastUpdate: string;
  team: string[];
  status: string;
}

/**
 * Format project status to display format
 */
function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Format date to display format
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectsList() {
  const params = useParams();
  const teamId = parseInt(params.id as string, 10);
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    filteredProjects,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refreshProjects,
  } = useProjects(teamId);

  // Transform projects to card format with memoization
  const cardProjects = useMemo((): CardProject[] => {
    return filteredProjects.map((project) => ({
      id: project.id,
      name: project.name,
      lastUpdate: formatDate(project.updated_at),
      team: [],
      status: formatStatus(project.status),
    }));
  }, [filteredProjects]);

  // Calculate pagination
  const totalPages = Math.ceil(cardProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = useMemo(() => cardProjects.slice(startIndex, endIndex), [cardProjects, startIndex, endIndex]);

  const handleProjectCreated = useCallback(() => {
    closeModal();
    refreshProjects();
  }, [closeModal, refreshProjects]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    },
    [setSearchTerm]
  );

  const { user } = useCurrentUser();
  const isBA = user?.role === "ba";

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <PageHeader
          title="Projects"
          description={isBA
            ? "Audit project lifecycle, validate requirements scope, and oversee development progress."
            : "Manage all projects for your team in one place."}
        />

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search projects by name"
          filters={
            <Button variant="primary" size="sm">
              Filters
            </Button>
          }
          actions={
            <Button variant="primary" onClick={openModal}>
              {isBA ? "New Project Entry" : "Add Project"}
            </Button>
          }
        />

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner className="py-12" message="Loading projects..." />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState message={error} onRetry={refreshProjects} />
        )}

        {/* Empty State */}
        {!isLoading && !error && currentProjects.length === 0 && (
          <EmptyState
            message={
              searchTerm
                ? "No projects found matching your search"
                : isBA
                  ? "No active project entries registered in this team workspace"
                  : "No projects yet"
            }
            action={
              !searchTerm && (
                <Button variant="primary" onClick={openModal}>
                  {isBA ? "Initialize Team Project" : "Create Your First Project"}
                </Button>
              )
            }
          />
        )}

        {/* Projects Grid */}
        {!isLoading && !error && currentProjects.length > 0 && (
          <>
            <CardGrid items={currentProjects} showAvatars={false} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          open={isOpen}
          onOpenChange={closeModal}
          teamId={teamId.toString()}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </div>
  );
}
