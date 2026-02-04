/**
 * Team Dashboard Page
 * Displays team statistics and overview with real-time data
 * Follows SOLID principles and best practices
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { useTeamDashboard } from "@/hooks/teams/useTeamDashboard";
import { RefreshCw } from "lucide-react";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { InviteMemberModal } from "@/components/teams/InviteMemberModal";
import { useCurrentUser } from "@/hooks";

export default function DashboardPage() {
  const params = useParams();
  const teamId = parseInt(params.id as string);
  const { stats, isLoading, error, refresh } = useTeamDashboard(teamId);
  const { user } = useCurrentUser();
  const isBA = user?.role === "ba";

  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center mt-14 px-6 sm:px-8">
        <div className="w-full max-w-6xl">
          <PageHeader
            title="Dashboard"
            description={isBA
              ? "Audit team lifecycle and overview with real-time analytics."
              : "View your team statistics in one place."}
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" message="Loading dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center mt-14 px-6 sm:px-8">
        <div className="w-full max-w-6xl">
          <PageHeader
            title="Dashboard"
            description={isBA
              ? "Audit team lifecycle and overview with real-time analytics."
              : "View your team statistics in one place."}
          />
          <div className="flex items-center justify-center min-h-[400px]">
            <ErrorState
              message={error}
              onRetry={refresh}
            />
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no projects
  if (stats && stats.projects.total === 0) {
    return (
      <div className="flex justify-center mt-14 px-6 sm:px-8">
        <div className="w-full max-w-6xl">
          <PageHeader
            title="Dashboard"
            description={isBA
              ? "Ready to initiate a project audit entry?"
              : "Get started by creating your first project."}
          />
          <main className="flex-1 mt-8">
            <EmptyDashboard
              onCreateProject={() => setIsCreateProjectModalOpen(true)}
            />
          </main>

          {/* Modals */}
          {isCreateProjectModalOpen && (
            <CreateProjectModal
              teamId={teamId.toString()}
              open={isCreateProjectModalOpen}
              onOpenChange={setIsCreateProjectModalOpen}
              onProjectCreated={refresh}
            />
          )}
        </div>
      </div>
    );
  }

  // Main dashboard with data
  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            title="Dashboard"
            description={isBA
              ? "Audit team lifecycle and overview with real-time analytics."
              : "View your team statistics in one place."}
          />
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Refresh dashboard"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Main content */}
        <main className="flex-1">
          <div className="space-y-8">
            {/* Statistics Cards */}
            {stats && <DashboardStats stats={stats} />}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Projects - Takes 2 columns */}
              <div className="lg:col-span-2">
                {stats && stats.recent_projects.length > 0 && (
                  <RecentProjects
                    projects={stats.recent_projects}
                    teamId={teamId}
                  />
                )}
              </div>

              {/* Quick Actions - Takes 1 column */}
              <div className="lg:col-span-1">
                <QuickActions
                  onCreateProject={() => setIsCreateProjectModalOpen(true)}
                  onInviteMember={() => setIsInviteMemberModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        {isCreateProjectModalOpen && (
          <CreateProjectModal
            teamId={teamId.toString()}
            open={isCreateProjectModalOpen}
            onOpenChange={setIsCreateProjectModalOpen}
            onProjectCreated={refresh}
          />
        )}

        {isInviteMemberModalOpen && (
          <InviteMemberModal
            teamId={teamId.toString()}
            open={isInviteMemberModalOpen}
            onOpenChange={setIsInviteMemberModalOpen}
            onInviteSent={() => {
              setIsInviteMemberModalOpen(false);
              refresh();
            }}
          />
        )}
      </div>
    </div>
  );
}
