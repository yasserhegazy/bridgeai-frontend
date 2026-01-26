/**
 * Team Actions Dialogs
 * Single Responsibility: Render all team action dialogs
 */

"use client";

import { TeamEditDialog } from "./TeamEditDialog";
import { TeamConfirmDialog } from "./TeamConfirmDialog";

type DialogType = "edit" | "archive" | "unarchive" | "deactivate" | "activate" | "delete" | null;

interface TeamActionsDialogsProps {
  openDialog: DialogType;
  onClose: () => void;
  teamName: string;
  teamStatus: string;
  editName: string;
  editDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEditConfirm: () => void;
  onArchiveConfirm: () => void;
  onUnarchiveConfirm: () => void;
  onDeactivateConfirm: () => void;
  onActivateConfirm: () => void;
  onDeleteConfirm: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function TeamActionsDialogs({
  openDialog,
  onClose,
  teamName,
  teamStatus,
  editName,
  editDescription,
  onNameChange,
  onDescriptionChange,
  onEditConfirm,
  onArchiveConfirm,
  onUnarchiveConfirm,
  onDeactivateConfirm,
  onActivateConfirm,
  onDeleteConfirm,
  isLoading,
  error,
}: TeamActionsDialogsProps) {
  return (
    <>
      <TeamEditDialog
        open={openDialog === "edit"}
        onOpenChange={(open) => !open && onClose()}
        teamName={editName}
        teamDescription={editDescription}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
        onConfirm={onEditConfirm}
        isLoading={isLoading}
        error={error}
      />

      <TeamConfirmDialog
        open={openDialog === "archive"}
        onOpenChange={(open) => !open && onClose()}
        title="Archive Team"
        description={`Are you sure you want to archive "${teamName}"? Archived teams can be restored later.`}
        confirmLabel="Archive"
        onConfirm={onArchiveConfirm}
        isLoading={isLoading}
        error={error}
      />

      <TeamConfirmDialog
        open={openDialog === "unarchive"}
        onOpenChange={(open) => !open && onClose()}
        title="Unarchive Team"
        description={`Are you sure you want to unarchive "${teamName}"? It will become active again.`}
        confirmLabel="Unarchive"
        onConfirm={onUnarchiveConfirm}
        isLoading={isLoading}
        error={error}
      />

      <TeamConfirmDialog
        open={openDialog === "deactivate"}
        onOpenChange={(open) => !open && onClose()}
        title="Deactivate Team"
        description={`Are you sure you want to deactivate "${teamName}"? Deactivated teams can be reactivated later.`}
        confirmLabel="Deactivate"
        confirmVariant="destructive"
        onConfirm={onDeactivateConfirm}
        isLoading={isLoading}
        error={error}
      />

      <TeamConfirmDialog
        open={openDialog === "activate"}
        onOpenChange={(open) => !open && onClose()}
        title="Activate Team"
        description={`Are you sure you want to activate "${teamName}"? This will make the team active again.`}
        confirmLabel="Activate"
        onConfirm={onActivateConfirm}
        isLoading={isLoading}
        error={error}
      />

      <TeamConfirmDialog
        open={openDialog === "delete"}
        onOpenChange={(open) => !open && onClose()}
        title="Delete Team"
        description={`Are you sure you want to permanently delete "${teamName}"? This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        confirmVariant="destructive"
        onConfirm={onDeleteConfirm}
        isLoading={isLoading}
        error={error}
        showInactiveWarning={teamStatus.toLowerCase() === "inactive"}
      />
    </>
  );
}
