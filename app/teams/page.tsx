/**
 * Teams List Page
 * Displays and manages teams
 * Refactored for SOLID principles and best practices
 */

"use client";

import { useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardGrid } from "@/components/shared/CardGrid";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";
import { EmptyTeams } from "@/components/teams/EmptyTeams";
import { TeamsFilters } from "@/components/teams/TeamsFilters";
import { Pagination } from "@/components/shared/Pagination";
import { useTeamsList, useModal } from "@/hooks";

const ITEMS_PER_PAGE = 9;


export default function TeamsList() {
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    teams,
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTeams = useMemo(() => filteredTeams.slice(startIndex, endIndex), [filteredTeams, startIndex, endIndex]);

  // Reset to page 1 when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, [setSearchQuery]);

  const handleStatusChange = useCallback((statuses: string[]) => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  }, [setSelectedStatuses]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setCurrentPage(1);
  }, [resetFilters]);

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
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search teams by name"
        filters={
          <TeamsFilters
            selectedStatuses={selectedStatuses}
            onStatusChange={handleStatusChange}
            onReset={handleResetFilters}
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

      {/* Empty States */}
      {!isLoading && !error && teams.length === 0 && (
        <EmptyTeams onCreateTeam={openModal} />
      )}

      {!isLoading && !error && teams.length > 0 && filteredTeams.length === 0 && (
        <EmptyState message="No teams found matching your filters." />
      )}

      {/* Teams Grid */}
      {!isLoading && !error && currentTeams.length > 0 && (
        <>
          <CardGrid items={currentTeams} type="team" onItemsChange={refetchTeams} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
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
