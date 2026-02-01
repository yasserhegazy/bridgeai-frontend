/**
 * Team Settings Page
 * Displays team settings and member management
 * Refactored for consistency and best practices
 */

"use client";

import { use } from "react";
import { TeamSettingsGrid } from "@/components/TeamSettingsGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { useTeamDetails } from "@/hooks/teams/useTeamDetails";

interface TeamSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamSettingsPage({ params }: TeamSettingsPageProps) {
  const resolvedParams = use(params);
  const { team, isLoading, error } = useTeamDetails(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500 max-w-md">
          <h2 className="font-semibold mb-2">Error Loading Team</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 text-yellow-500 max-w-md">
          <h2 className="font-semibold mb-2">Team Not Found</h2>
          <p>The team you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20 pb-14 px-6 sm:px-8 flex justify-center">
      <div className="w-full max-w-6xl">
        <main className="flex-1 overflow-auto">
          <TeamSettingsGrid
            teamId={resolvedParams.id}
            teamName={team.name}
            teamDescription={team.description}
          />
        </main>
      </div>
    </div>
  );
}

