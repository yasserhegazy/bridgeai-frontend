/**
 * CreateChatModal Component
 * Modal for creating a new chat
 * Single Responsibility: Chat creation UI
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CRSPattern } from "@/services";
import { AlertCircle, Plus, Loader2 } from "lucide-react";

interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, pattern: CRSPattern) => Promise<void>;
  error: string | null;
}

export function CreateChatModal({
  open,
  onClose,
  onSubmit,
  error,
}: CreateChatModalProps) {
  const [chatName, setChatName] = useState("");
  const [crsPattern, setCrsPattern] = useState<CRSPattern>("babok");
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = chatName.trim();
    if (!trimmed) {
      setValidationError("Chat name is required");
      return;
    }

    try {
      setIsSaving(true);
      setValidationError(null);
      await onSubmit(trimmed, crsPattern);
      setChatName("");
      setCrsPattern("babok");
    } finally {
      setIsSaving(false);
    }
  }, [chatName, crsPattern, onSubmit]);

  const handleClose = useCallback(() => {
    setChatName("");
    setCrsPattern("babok");
    setValidationError(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">New Chat</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Set up your chat to start requirements gathering.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 ml-1 mb-3">
              Chat Name
            </label>
            <Input
              className="border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-12 px-4 text-gray-900 rounded-xl shadow-sm placeholder:text-gray-400"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter a descriptive name..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 ml-1 mb-3">
              Requirement Standard
            </label>
            <Select
              value={crsPattern}
              onValueChange={(v) => setCrsPattern(v as CRSPattern)}
            >
              <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all h-12 px-4 text-gray-700 rounded-xl shadow-sm">
                <SelectValue placeholder="Select a standard" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-100 rounded-xl shadow-2xl p-1">
                <SelectItem value="babok" className="focus:bg-primary/5 focus:text-primary py-3 px-4 rounded-lg cursor-pointer">
                  BABOK Standard
                </SelectItem>
                <SelectItem value="iso_iec_ieee_29148" className="focus:bg-primary/5 focus:text-primary py-3 px-4 rounded-xl cursor-pointer">
                  ISO/IEC/IEEE 29148
                </SelectItem>
                <SelectItem value="ieee_830" className="focus:bg-primary/5 focus:text-primary py-3 px-4 rounded-xl cursor-pointer">
                  IEEE 830 Standard
                </SelectItem>
                <SelectItem value="agile_user_stories" className="focus:bg-primary/5 focus:text-primary py-3 px-4 rounded-xl cursor-pointer">
                  Agile User Stories
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(validationError || error) && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1 ml-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validationError || error}</span>
            </div>
          )}

          <DialogFooter className="mt-10 sm:justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleClose}
              className="px-6 transition-all hover:scale-105 active:scale-95 font-semibold text-primary border-none hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
              className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 font-bold" />
              )}
              <span>{isSaving ? "Creating..." : "Create Chat"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
