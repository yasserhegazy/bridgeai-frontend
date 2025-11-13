"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";

interface Team {
  id: number;
  name: string;
  lastUpdate: string;
  members?: string[];
  status: string;
  description?: string;
  created_by?: number;
  created_at?: string;
  member_count?: number;
}

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/teams/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized. Please log in again.");
          localStorage.removeItem("access_token");
        } else if (response.status === 404) {
          setError("Teams endpoint not found.");
        } else {
          setError(`Failed to fetch teams: ${response.statusText}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      // Handle both array and single object responses
      const teamsList = Array.isArray(data) ? data : [data];
      
      // Map the backend response to match the expected format
      const formattedTeams = teamsList.map((team: Team) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        status: team.status.charAt(0).toUpperCase() + team.status.slice(1),
        lastUpdate: team.created_at ? new Date(team.created_at).toLocaleDateString() : "N/A",
        members: new Array(team.member_count || 0).fill(null).map((_, i) => `Member ${i + 1}`),
      }));

      setTeams(formattedTeams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-14 px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all teams for your organization in one place.</p>
        </div>
      </div>

      <div className="flex items-center bg-[#fafafb] p-4 justify-between mb-7 w-full max-w-7xl mx-auto gap-3 rounded">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <SearchBar placeholder="Search teams by name" />
          <Button variant="primary" size="sm">Filters</Button>
        </div>
        <Button variant="primary" className="hover:cursor-pointer" onClick={() => setIsModalOpen(true)}>Add Team</Button>
      </div>

      {loading && <p className="text-center text-muted-foreground">Loading teams...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && <CardGrid items={teams} type="team" />}

      <CreateTeamModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onTeamCreated={fetchTeams}
      />
    </div>
  );
}