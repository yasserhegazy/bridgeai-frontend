
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";
import { TeamsFilters } from "@/components/teams/TeamsFilters";
import { useTeamsList } from "@/hooks/useTeamsList";

export default function TeamsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    filteredTeams,
    isLoading,
    error,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setSelectedStatuses,
    resetFilters,
    refetchTeams,
  } = useTeamsList();

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);

  const handleTeamCreated = useCallback(() => {
    refetchTeams();
  }, [refetchTeams]);

  return (
    <div className="max-w-6xl mx-auto mt-14 px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all teams for your organization in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center bg-[#fafafb] p-4 justify-between mb-7 w-full max-w-7xl mx-auto gap-3 rounded">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <SearchBar 
            placeholder="Search teams by name" 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <TeamsFilters 
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            onReset={resetFilters}
          />
        </div>
        <Button 
          variant="primary" 
          className="hover:cursor-pointer" 
          onClick={handleOpenModal}
        >
          Add Team
        </Button>
      </div>

      {isLoading && (
        <p className="text-center text-muted-foreground">Loading teams...</p>
      )}
      
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}
      
      {!isLoading && !error && (
        <>
          {filteredTeams.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No teams found matching your filters.
            </p>
          ) : (
            <CardGrid 
              items={filteredTeams} 
              type="team" 
              onItemsChange={refetchTeams} 
            />
          )}
        </>
      )}

      <CreateTeamModal 
        open={isModalOpen} 
        onOpenChange={handleCloseModal}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
}
