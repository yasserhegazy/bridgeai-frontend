/**
 * Team Projects Page
 * Displays and manages team projects
 * Refactored for SOLID principles and separation of concerns
 */

"use client";

import { useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { useProjects, useModal } from "@/hooks";


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

  const handleProjectCreated = useCallback(() => {
    closeModal();
    refreshProjects();
  }, [closeModal, refreshProjects]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <PageHeader
          title="Projects"
          description="Manage all projects for your team in one place."
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
              Add Project
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
        {!isLoading && !error && cardProjects.length === 0 && (
          <EmptyState
            message={
              searchTerm
                ? "No projects found matching your search"
                : "No projects yet"
            }
            action={
              !searchTerm && (
                <Button variant="primary" onClick={openModal}>
                  Create Your First Project
                </Button>
              )
            }
          />
        )}

        {/* Projects Grid */}
        {!isLoading && !error && cardProjects.length > 0 && (
          <CardGrid items={cardProjects} showAvatars={false} />
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
