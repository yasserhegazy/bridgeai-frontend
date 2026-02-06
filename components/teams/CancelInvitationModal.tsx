/**
 * Cancel Invitation Modal Component
 * Modal for canceling pending team invitations
 * Single Responsibility: Cancel invitation confirmation UI
 */

"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, UserX } from "lucide-react";

interface CancelInvitationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onConfirm: () => Promise<void>;
}

export function CancelInvitationModal({
  open,
  onOpenChange,
  email,
  onConfirm,
}: CancelInvitationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm, onOpenChange]);

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      onOpenChange(false);
    }
  }, [isLoading, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight text-center">
            Cancel Invitation?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-3 text-center">
            Are you sure you want to cancel the invitation for{" "}
            <span className="font-semibold text-gray-900">{email}</span>?
            <br />
            <span className="text-xs mt-2 inline-block">
              This action cannot be undone. You can send a new invitation later if needed.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-8 sm:justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-8 transition-all hover:scale-105 active:scale-95 font-semibold border-none hover:bg-gray-100"
          >
            Keep Invitation
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={handleConfirm}
            disabled={isLoading}
            className="shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white min-w-40"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserX className="w-5 h-5" />
            )}
            <span>{isLoading ? "Canceling..." : "Cancel Invitation"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
