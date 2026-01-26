/**
 * Teams List Page
 * Displays and manages teams
 * Refactored for SOLID principles and best practices
 */

"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";
import { TeamsFilters } from "@/components/teams/TeamsFilters";
import { useTeamsList, useModal } from "@/hooks";


export default function TeamsList() {
  const { isOpen, openModal, closeModal } = useModal();

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

  const handleCloseModal = useCallback(
    (open: boolean) => {
      if (!open) {
        closeModal();
      }
    },
    [closeModal]
  );

  const handleTeamCreated = useCallback(() => {
    refetchTeams();
  }, [refetchTeams]);

  return (
    <div className="max-w-6xl mx-auto mt-14 px-6">
      {/* Header */}
      <PageHeader
        title="Teams"
        description="Manage all teams for your organization in one place."
      />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search teams by name"
        filters={
          <TeamsFilters
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            onReset={resetFilters}
          />
        }
        actions={
          <Button variant="primary" className="hover:cursor-pointer" onClick={openModal}>
            Add Team
          </Button>
        }
      />

      {/* Loading State */}
      {isLoading && (
        <LoadingSpinner className="py-12" message="Loading teams..." />
      )}

      {/* Error State */}
      {error && !isLoading && <ErrorState message={error} />}

      {/* Empty State */}
      {!isLoading && !error && filteredTeams.length === 0 && (
        <EmptyState message="No teams found matching your filters." />
      )}

      {/* Teams Grid */}
      {!isLoading && !error && filteredTeams.length > 0 && (
        <CardGrid items={filteredTeams} type="team" onItemsChange={refetchTeams} />
      )}

      {/* Create Team Modal */}
      <CreateTeamModal
        open={isOpen}
        onOpenChange={handleCloseModal}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
}
