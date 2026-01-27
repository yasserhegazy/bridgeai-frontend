/**
 * DeleteChatModal Component
 * Modal for deleting a chat
 * Single Responsibility: Chat deletion confirmation UI
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

interface DeleteChatModalProps {
  open: boolean;
  chatName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteChatModal({
  open,
  chatName,
  onClose,
  onConfirm,
}: DeleteChatModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete chat</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Messages in this chat will be removed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete "{chatName}"?
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="default" size="default" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="default" onClick={onConfirm}>
            Delete chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
