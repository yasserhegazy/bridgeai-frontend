/**
 * Team Settings Grid Component
 * Refactored to follow SOLID principles and separation of concerns
 * Single Responsibility: Compose team settings UI sections
 */

"use client";

import { TeamInfoSection } from "@/components/teams/TeamInfoSection";
import { TeamMembersSection } from "@/components/teams/TeamMembersSection";
import { FlashMessage } from "@/components/shared/FlashMessage";
import { useFlashMessage } from "@/hooks/shared/useFlashMessage";
import { useCallback } from "react";

interface TeamSettingsGridProps {
  teamId: string;
  teamName?: string;
  teamDescription?: string;
  onTeamUpdate?: () => void;
}

export function TeamSettingsGrid({
  teamId,
  teamName = "Awesome Team",
  teamDescription = "This is the team description",
  onTeamUpdate,
}: TeamSettingsGridProps) {
  const { flashMessage, showSuccess, showError, clearMessage } = useFlashMessage();

  const handleSuccess = useCallback(
    (message: string) => {
      showSuccess(message);
    },
    [showSuccess]
  );

  const handleError = useCallback(
    (message: string) => {
      showError(message);
    },
    [showError]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Flash Message */}
      {flashMessage && (
        <FlashMessage
          type={flashMessage.type}
          message={flashMessage.message}
          onClose={clearMessage}
        />
      )}

      {/* Team Info Section */}
      <TeamInfoSection
        teamId={teamId}
        teamName={teamName}
        teamDescription={teamDescription}
        onUpdate={onTeamUpdate}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {/* Team Members Section */}
      <TeamMembersSection
        teamId={teamId}
        onUpdate={onTeamUpdate}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

             