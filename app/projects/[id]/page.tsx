/**
 * Project Page
 * Main project page with tabs for Dashboard, Chats, and Settings
 * REFACTORED: Following SOLID principles
 * - Uses hooks for state management
 * - Uses services for API calls
 * - Optimized with proper error handling
 */

"use client";

import { use, useEffect } from "react";
import { ProjectPageGrid } from "@/components/projects/ProjectPageGrid";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { useProjectDetails, useCurrentUser } from "@/hooks";
import { setCurrentTeamId } from "@/lib/team-context";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const projectId = parseInt(id, 10);

  const { project, isLoading: projectLoading, error: projectError } = useProjectDetails(projectId);
  const { user, isLoading: userLoading } = useCurrentUser();

  const isLoading = projectLoading || userLoading;
  const userRole = user?.role === "ba" ? "BA" : "Client";

  // Store team ID when project is loaded
  useEffect(() => {
    if (project?.team_id) {
      setCurrentTeamId(project.team_id);
    }
  }, [project?.team_id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Loading project..." />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ErrorState message={projectError || "Project not found"} />
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all aspects of this project.
            </p>
          </div>
        </div>

        <main className="flex-1 mt-4 overflow-auto">
          <ProjectPageGrid 
            projectId={project.id}
            teamId={project.team_id}
            projectName={project.name} 
            projectDescription={project.description || ""}
            userRole={userRole} 
          />
        </main>
      </div>
    </div>
  );
}