"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { TeamSettingsGrid } from "@/components/TeamSettingsGrid";
import { apiCall } from "@/lib/api";

interface Team {
  id: string;
  name: string;
  description: string;
}

interface TeamSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamSettingsPage({ params }: TeamSettingsPageProps) {
  const resolvedParams = use(params);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch real team data from backend
        const data = await apiCall<Team>(`/api/teams/${resolvedParams.id}`);
        setTeam(data);
      } catch (err) {
        console.error('Error fetching team:', err);
        setError(err instanceof Error ? err.message : 'Failed to load team');
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#341BAB]"></div>
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
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-semibold tracking-tight">Team Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team information and members.
            </p>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 mt-8 mb-14 overflow-auto">
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
