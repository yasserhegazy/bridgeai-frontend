/**
 * Team Actions Menu Component
 * Dropdown menu for team management actions
 * Single Responsibility: Team actions UI
 */

"use client";

import { useState, useCallback } from "react";
import { MoreVertical, Edit2, Archive, Trash2, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeamActions } from "@/hooks/teams/useTeamActions";
import { TeamActionsDialogs } from "./TeamActionsDialogs";

interface TeamActionsMenuProps {
  teamId: number;
  teamName: string;
  teamStatus: string;
  teamDescription?: string;
  onActionComplete?: () => void;
}

type DialogType = "edit" | "archive" | "unarchive" | "deactivate" | "activate" | "delete" | null;

export function TeamActionsMenu({
  teamId,
  teamName,
  teamStatus,
  teamDescription = "",
  onActionComplete,
}: TeamActionsMenuProps) {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [editName, setEditName] = useState(teamName);
  const [editDescription, setEditDescription] = useState(teamDescription);

  const {
    isLoading,
    error,
    editTeam,
    removeTeam,
    archiveTeamAction,
    unarchiveTeam,
    activateTeamAction,
    deactivateTeamAction,
  } = useTeamActions();

  const closeDialog = useCallback(() => setOpenDialog(null), []);

  const handleEditTeam = useCallback(async () => {
    const success = await editTeam(teamId, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });

    if (success) {
      closeDialog();
      onActionComplete?.();
    }
  }, [teamId, editName, editDescription, editTeam, onActionComplete, closeDialog]);

  const handleArchiveTeam = useCallback(async () => {
    const success = await archiveTeamAction(teamId);
    if (success) {
      closeDialog();
      onActionComplete?.();
    }
  }, [teamId, archiveTeamAction, onActionComplete, closeDialog]);

  const handleUnarchiveTeam = useCallback(async () => {
    const success = await unarchiveTeam(teamId);
    if (success) {
      closeDialog();
      onActionComplete?.();
    }
  }, [teamId, unarchiveTeam, onActionComplete, closeDialog]);

  const handleActivateTeam = useCallback(async () => {
    const success = await activateTeamAction(teamId);
    if (success) {
      closeDialog();
      onActionComplete?.();
    }
  }, [teamId, activateTeamAction, onActionComplete, closeDialog]);

  const handleDeactivateTeam = useCallback(async () => {
    const success = await deactivateTeamAction(teamId);
    if (success) {
      closeDialog();
      onActionComplete?.();
    }
  }, [teamId, deactivateTeamAction, onActionComplete, closeDialog]);

  const handleDeleteTeam = useCallback(async () => {
    const success = await removeTeam(teamId);
    if (success) {
      closeDialog();
      onActionComplete?.();
    }
  }, [teamId, removeTeam, onActionComplete, closeDialog]);

  const handleOpenEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(teamName);
    setEditDescription(teamDescription);
    setOpenDialog("edit");
  }, [teamName, teamDescription]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleOpenEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {teamStatus.toLowerCase() === "archived" ? (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              setOpenDialog("unarchive");
            }}>
              <Archive className="mr-2 h-4 w-4" />
              <span>Unarchive</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              setOpenDialog("archive");
            }}>
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </DropdownMenuItem>
          )}

          {teamStatus.toLowerCase() === "inactive" ? (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              setOpenDialog("activate");
            }}>
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Activate</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog("deactivate");
              }}
              className="text-destructive focus:text-destructive"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Deactivate</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog("delete");
            }}
            className="text-destructive focus:text-destructive"
            disabled={teamStatus.toLowerCase() === "inactive"}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TeamActionsDialogs
        openDialog={openDialog}
        onClose={closeDialog}
        teamName={teamName}
        teamStatus={teamStatus}
        editName={editName}
        editDescription={editDescription}
        onNameChange={setEditName}
        onDescriptionChange={setEditDescription}
        onEditConfirm={handleEditTeam}
        onArchiveConfirm={handleArchiveTeam}
        onUnarchiveConfirm={handleUnarchiveTeam}
        onDeactivateConfirm={handleDeactivateTeam}
        onActivateConfirm={handleActivateTeam}
        onDeleteConfirm={handleDeleteTeam}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
