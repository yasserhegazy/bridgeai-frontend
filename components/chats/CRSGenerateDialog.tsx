/**
 * CRSGenerateDialog Component
 * Modal for initiating CRS generation
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CRSGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  crsPattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";
}

export function CRSGenerateDialog({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
  crsPattern,
}: CRSGenerateDialogProps) {
  const getPatternLabel = () => {
    switch (crsPattern) {
      case "iso_iec_ieee_29148":
        return "ISO/IEC/IEEE 29148";
      case "ieee_830":
        return "IEEE 830";
      case "agile_user_stories":
        return "Agile User Stories";
      default:
        return "BABOK";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate CRS Document</DialogTitle>
          <DialogDescription>
            The system will generate your CRS document based on the conversation history and your
            selected pattern.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              The system will compile your conversation into a structured CRS document using the{" "}
              <strong>{getPatternLabel()}</strong> standard.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <strong>How it works:</strong> After you submit, the system will ask clarifying
              questions if needed. Once clarification is complete, your CRS document will be
              automatically generated using your selected standard.
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6 flex gap-2">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={onGenerate} variant="primary" disabled={isGenerating}>
            {isGenerating ? "Submitting..." : "Submit & Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
