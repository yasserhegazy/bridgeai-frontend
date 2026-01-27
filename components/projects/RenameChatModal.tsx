/**
 * RenameChatModal Component
 * Modal for renaming an existing chat
 * Single Responsibility: Chat rename UI
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
import { Input } from "@/components/ui/input";

interface RenameChatModalProps {
  open: boolean;
  chatName: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  error: string | null;
}

export function RenameChatModal({
  open,
  chatName,
  onClose,
  onSubmit,
  error,
}: RenameChatModalProps) {
  const [name, setName] = useState(chatName);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setValidationError("Chat name is required");
      return;
    }

    try {
      setIsSaving(true);
      setValidationError(null);
      await onSubmit(trimmed);
    } finally {
      setIsSaving(false);
    }
  }, [name, onSubmit]);

  const handleClose = useCallback(() => {
    setName(chatName);
    setValidationError(null);
    onClose();
  }, [chatName, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Give this chat a clear, descriptive name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Chat name
            <Input
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Client kickoff discussion"
            />
          </label>

          {(validationError || error) && (
            <p className="text-sm text-red-600">{validationError || error}</p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="default" size="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="default"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Update chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
