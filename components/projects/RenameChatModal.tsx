/**
 * RenameChatModal Component
 * Modal for renaming an existing chat
 * Single Responsibility: Chat rename UI
 */

"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Pencil, Loader2, AlertCircle } from "lucide-react";

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

  useEffect(() => {
    if (open) {
      setName(chatName);
    }
  }, [open, chatName]);

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
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Rename Chat</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Give this chat a clear, descriptive name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 ml-1 mb-3">
              Chat Name
            </label>
            <Input
              className="border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-12 px-4 text-gray-900 rounded-xl shadow-sm placeholder:text-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a descriptive name..."
            />
          </div>

          {(validationError || error) && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1 ml-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validationError || error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="mt-10 sm:justify-end gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleClose}
            className="px-6 transition-all hover:scale-105 active:scale-95 font-semibold text-primary border-none hover:bg-primary/5"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isSaving}
            className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Pencil className="w-5 h-5" />
            )}
            <span>{isSaving ? "Saving..." : "Update Name"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
