/**
 * Team Edit Dialog
 * Single Responsibility: Edit team UI
 */

"use client";

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

interface TeamEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  teamDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function TeamEditDialog({
  open,
  onOpenChange,
  teamName,
  teamDescription,
  onNameChange,
  onDescriptionChange,
  onConfirm,
  isLoading,
  error,
}: TeamEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={teamName}
              onChange={(e) => onNameChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="edit-description"
              value={teamDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              disabled={isLoading}
              className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
