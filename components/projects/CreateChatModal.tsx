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

  const handleSubmit = useCallback(async () => {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create chat</DialogTitle>
          <DialogDescription>
            Give this chat a name to start collaborating.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Chat name
            <Input
              className="mt-1"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="e.g. Client kickoff discussion"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Requirement Standard
            <Select
              value={crsPattern}
              onValueChange={(v) => setCrsPattern(v as CRSPattern)}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="babok">
                  BABOK (Business Analysis Body of Knowledge)
                </SelectItem>
                <SelectItem value="iso_iec_ieee_29148">
                  ISO/IEC/IEEE 29148 (Systems & Software Engineering)
                </SelectItem>
                <SelectItem value="ieee_830">
                  IEEE 830 (Software Requirements Specifications)
                </SelectItem>
                <SelectItem value="agile_user_stories">
                  Agile User Stories
                </SelectItem>
              </SelectContent>
            </Select>
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
            {isSaving ? "Creating..." : "Create chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
