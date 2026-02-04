/**
 * CRSPreviewModal Component - Refactored
 * Displays CRS preview with content, summary, and progress in tabbed interface
 * Decomposed into focused components following SOLID principles
 */

"use client";

import { useState } from "react";
import { FileText, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CRSPreviewOut } from "@/dto";
import { CRSPreviewContent } from "./preview/CRSPreviewContent";
import { CRSPreviewSummary } from "./preview/CRSPreviewSummary";
import { CRSPreviewProgress } from "./preview/CRSPreviewProgress";

interface CRSPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: CRSPreviewOut | null;
  loading?: boolean;
  onGenerateDraft?: () => Promise<void>;
  generatingDraft?: boolean;
}

export function CRSPreviewModal({
  open,
  onOpenChange,
  preview,
  loading = false,
  onGenerateDraft,
  generatingDraft = false,
}: CRSPreviewModalProps) {
  const [activeTab, setActiveTab] = useState("preview");

  if (!preview && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                CRS Preview
              </DialogTitle>
              <DialogDescription>
                Review your progress and see what information has been captured so far
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-gray-600">Generating preview...</p>
            </div>
          </div>
        ) : preview && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">CRS Content</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="progress">What's Missing</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
              <CRSPreviewContent preview={preview} />
            </TabsContent>

            <TabsContent value="summary" className="flex-1 overflow-hidden mt-4">
              <CRSPreviewSummary preview={preview} />
            </TabsContent>

            <TabsContent value="progress" className="flex-1 overflow-hidden mt-4">
              <CRSPreviewProgress preview={preview} />
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          {preview && !preview.is_complete && onGenerateDraft && (
            <Button
              onClick={onGenerateDraft}
              disabled={generatingDraft}
              variant="primary"
            >
              {generatingDraft ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Generate Draft CRS
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
