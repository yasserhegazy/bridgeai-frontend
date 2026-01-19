"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Archive, Trash2, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeamActionsMenuProps {
  teamId: number;
  teamName: string;
  teamStatus: string;
  teamDescription?: string;
  onActionComplete?: () => void;
}

export function TeamActionsMenu({
  teamId,
  teamName,
  teamStatus,
  teamDescription = "",
  onActionComplete,
}: TeamActionsMenuProps) {
  const [openDialog, setOpenDialog] = useState<
    "edit" | "archive" | "unarchive" | "deactivate" | "activate" | "delete" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(teamName);
  const [editDescription, setEditDescription] = useState(teamDescription);

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  const handleEditTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/teams/${teamId}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName.trim(),
            description: editDescription.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update team");
      }

      setOpenDialog(null);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/teams/${teamId}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "archived",
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to archive team";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setOpenDialog(null);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Archive team error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnarchiveTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/teams/${teamId}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "active",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to unarchive team");
      }

      setOpenDialog(null);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/teams/${teamId}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "active",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to activate team");
      }

      setOpenDialog(null);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/teams/${teamId}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "inactive",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to deactivate team");
      }

      setOpenDialog(null);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/teams/${teamId}/`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to delete team";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setOpenDialog(null);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Delete team error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setOpenDialog("edit");
          }}>
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

      {/* Edit Dialog */}
      <Dialog open={openDialog === "edit"} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update the team name and description
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-sm font-medium">
                Team Name
              </label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                disabled={isLoading}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditTeam}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={openDialog === "archive"} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Archive Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive "{teamName}"? Archived teams can be restored later.
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleArchiveTeam}
              disabled={isLoading}
            >
              {isLoading ? "Archiving..." : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unarchive Dialog */}
      <Dialog open={openDialog === "unarchive"} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Unarchive Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to unarchive "{teamName}"? It will become active again.
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUnarchiveTeam}
              disabled={isLoading}
            >
              {isLoading ? "Unarchiving..." : "Unarchive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog */}
      <Dialog open={openDialog === "deactivate"} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-destructive">Deactivate Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "{teamName}"? Deactivated teams can be reactivated later.
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivateTeam}
              disabled={isLoading}
            >
              {isLoading ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Dialog */}
      <Dialog open={openDialog === "activate"} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Activate Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to activate "{teamName}"? This will make the team active again.
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleActivateTeam}
              disabled={isLoading}
            >
              {isLoading ? "Activating..." : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDialog === "delete"} onOpenChange={(open) => {
        if (!open) setOpenDialog(null);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "{teamName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {teamStatus.toLowerCase() === "inactive" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              <p className="font-medium">Note:</p>
              <p>This team is inactive. Consider activating it first if you want to verify team information before deleting.</p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
