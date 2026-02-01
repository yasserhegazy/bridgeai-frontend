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
import { Trash2, AlertCircle } from "lucide-react";

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
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-8">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Dangerous Action</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Delete Chat</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            This action cannot be undone. All messages will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-4 mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-gray-900">"{chatName}"</span>?
          </p>
        </div>

        <DialogFooter className="mt-8 sm:justify-end gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="px-6 transition-all hover:scale-105 active:scale-95 font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-none"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white"
          >
            <Trash2 className="w-5 h-5" />
            Delete Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
