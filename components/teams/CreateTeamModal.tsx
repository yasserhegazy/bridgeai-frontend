/**
 * Create Team Modal Component
 * Modal for creating new teams
 * Single Responsibility: Team creation UI
 */

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTeam } from "@/hooks/teams/useCreateTeam";
import { AlertCircle, CheckCircle, Loader2, Plus } from "lucide-react";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamCreated?: () => void;
}

export function CreateTeamModal({
  open,
  onOpenChange,
  onTeamCreated,
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isLoading, error, createNewTeam } = useCreateTeam();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMessage(null);

      if (!name.trim()) {
        return;
      }

      try {
        const success = await createNewTeam({
          name: name.trim(),
          description: description.trim() || undefined,
        });

        if (success) {
          setSuccessMessage("Team created successfully!");

          // Reset form after short delay
          setTimeout(() => {
            setName("");
            setDescription("");
            setSuccessMessage(null);
            onOpenChange(false);
            onTeamCreated?.();
          }, 2000);
        }
      } catch (err) {
        // Error is handled by useCreateTeam hook
      }
    },
    [name, description, createNewTeam, onOpenChange, onTeamCreated]
  );

  const handleCancel = useCallback(() => {
    if (isLoading) return;
    setName("");
    setDescription("");
    setSuccessMessage(null);
    onOpenChange(false);
  }, [onOpenChange, isLoading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Create New Team</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Add a new team to your organization to start collaborating.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="teamName" className="block text-sm font-semibold text-gray-700 ml-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="teamName"
              placeholder="e.g. Engineering Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-12 px-4 text-gray-900 rounded-xl shadow-sm placeholder:text-gray-400"
              required
              maxLength={256}
            />
            <p className="text-[10px] text-muted-foreground ml-1">
              {name.length}/256 characters
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="teamDescription" className="block text-sm font-semibold text-gray-700 ml-1">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="teamDescription"
              placeholder="Describe what this team is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-sm shadow-sm resize-none min-h-[120px]"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-2 text-green-700 animate-in fade-in slide-in-from-top-1">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-semibold">{successMessage}</p>
            </div>
          )}

          <DialogFooter className="mt-10 sm:justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 transition-all hover:scale-105 active:scale-95 font-semibold text-primary border-none hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 font-bold" />
              )}
              <span>{isLoading ? "Creating..." : "Create Team"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
