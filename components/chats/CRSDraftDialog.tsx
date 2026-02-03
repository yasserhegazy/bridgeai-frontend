/**
 * CRSDraftDialog Component
 * Modal for viewing and managing CRS draft
 * Refactored to use CRS service layer
 */

"use client";

import { useState } from "react";
import { Loader2, Edit, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CRSDTO } from "@/dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { CRSContentEditor } from "@/components/shared/CRSContentEditor";
import { updateCRSContent } from "@/services/crs.service";
import { CRSError } from "@/services/errors.service";

interface CRSDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestCRS: CRSDTO | null;
  crsLoading: boolean;
  crsError: string | null;
  onSubmitForReview: () => Promise<void>;
  onRegenerate: () => void;
  onCRSUpdate?: () => void; // Callback to refresh CRS data after edit
}

export function CRSDraftDialog({
  open,
  onOpenChange,
  latestCRS,
  crsLoading,
  crsError,
  onSubmitForReview,
  onRegenerate,
  onCRSUpdate,
}: CRSDraftDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [currentCrs, setCurrentCrs] = useState<CRSDTO | null>(latestCRS);
  const [isCommentsCollapsed, setIsCommentsCollapsed] = useState(false);
  const [reactiveCrsData, setReactiveCrsData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'doc' | 'json'>('doc');

  // Sync currentCrs and reactiveCrsData with latestCRS when dialog opens or latestCRS changes
  if (open && latestCRS && (currentCrs?.id !== latestCRS.id || currentCrs?.version !== latestCRS.version)) {
    setCurrentCrs(latestCRS);
    try {
      setReactiveCrsData(JSON.parse(latestCRS.content));
    } catch {
      setReactiveCrsData(null);
    }
  }

  const handleSaveContent = async (newContent: string) => {
    if (!currentCrs) return;

    try {
      setContentError(null);
      const updatedCRS = await updateCRSContent(
        currentCrs.id,
        newContent,
        currentCrs.edit_version || 0
      );

      // Update local view with response from server
      setCurrentCrs(updatedCRS);
      setReactiveCrsData(JSON.parse(updatedCRS.content));
      setIsEditing(false);

      // Notify parent to refresh data
      if (onCRSUpdate) {
        onCRSUpdate();
      }
    } catch (err) {
      if (err instanceof CRSError) {
        setContentError(err.message);
      } else {
        setContentError("Failed to save changes. Please try again.");
      }
    }
  };

  const handleLiveUpdate = (newData: any) => {
    setReactiveCrsData(newData);
  };

  const canEdit = currentCrs?.status !== "approved";

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setIsEditing(false);
        setContentError(null);
      }
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">CRS Document</span>
            <div className="flex items-center gap-3 pr-8">
              {currentCrs && (
                <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                  <Button
                    variant={viewMode === 'doc' ? 'primary' : 'ghost'}
                    size="sm"
                    className="h-7 px-3 text-[10px] font-bold"
                    onClick={() => setViewMode('doc')}
                  >
                    Document
                  </Button>
                  <Button
                    variant={viewMode === 'json' ? 'primary' : 'ghost'}
                    size="sm"
                    className="h-7 px-3 text-[10px] font-bold"
                    onClick={() => setViewMode('json')}
                  >
                    JSON Source
                  </Button>
                </div>
              )}
              {currentCrs && <CRSStatusBadge status={currentCrs.status} />}
              {currentCrs && (
                <Button
                  variant="outline"
                  onClick={() => setIsCommentsCollapsed(!isCommentsCollapsed)}
                  className={`min-w-11 ${isCommentsCollapsed ? 'bg-gray-100' : ''}`}
                  title={isCommentsCollapsed ? "Show comments" : "Hide comments"}
                >
                  <MessageSquare className="w-4 h-4" />
                  {isCommentsCollapsed && <span className="ml-2">Comments</span>}
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review the Client Requirements Specification document.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50/30">
            {crsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-base text-gray-500">Loading document...</span>
              </div>
            ) : crsError || !currentCrs ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {crsError || "No CRS document found for this project."}
                </p>
              </div>
            ) : isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <CRSContentEditor
                    initialContent={currentCrs.content}
                    onSave={handleSaveContent}
                    onUpdate={handleLiveUpdate}
                    onCancel={() => {
                      setIsEditing(false);
                      setContentError(null);
                      // Reset reactive data to original content
                      try {
                        setReactiveCrsData(JSON.parse(currentCrs.content));
                      } catch {
                        setReactiveCrsData(null);
                      }
                    }}
                  />
                </div>
                {/* Live Preview during editing */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-y-auto hidden lg:block">
                  <div className="mb-4 pb-2 border-b flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-400 tracking-tight">Live Preview</h4>
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold animate-pulse">Reactive Sync Active</span>
                  </div>
                  <CRSContentDisplay crsData={reactiveCrsData} />
                </div>
              </div>
            ) : (
              <>
                {/* Error Display */}
                {contentError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{contentError}</p>
                  </div>
                )}

                {/* Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Version
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">v{currentCrs.version}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pattern
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      {currentCrs.pattern === "iso_iec_ieee_29148"
                        ? "ISO/IEC/IEEE 29148"
                        : currentCrs.pattern === "ieee_830"
                          ? "IEEE 830"
                          : currentCrs.pattern === "agile_user_stories"
                            ? "Agile User Stories"
                            : "BABOK"}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      {new Date(currentCrs.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                </div>

                {/* Summary Points */}
                {currentCrs.summary_points && currentCrs.summary_points.length > 0 && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Key Points
                    </h3>
                    <ul className="grid gap-2">
                      {currentCrs.summary_points.map((point, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-blue-900/80 pl-2 border-l-2 border-blue-200"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Structured CRS Content */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[400px]">
                  {viewMode === 'json' ? (
                    <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-xs overflow-auto h-full min-h-[500px]">
                      <pre>{JSON.stringify(reactiveCrsData, null, 2)}</pre>
                    </div>
                  ) : (
                    <CRSContentDisplay crsData={reactiveCrsData} />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Panel: Comments - Collapsible */}
          {currentCrs && (
            <div className={`border-l border-gray-200 bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_20px_-5px_inset] transition-all duration-300 ${isCommentsCollapsed ? 'w-0' : 'w-[350px] lg:w-[400px]'
              }`}>
              {!isCommentsCollapsed && (
                <CommentsSection
                  crsId={currentCrs.id}
                  className="h-full border-none rounded-none shadow-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer - Hide when editing as Editor has its own actions */}
        {!isEditing && (
          <DialogFooter className="shrink-0 px-8 py-5 border-t border-gray-200 bg-white flex items-center justify-between gap-4 z-10">
            <div className="flex gap-2">
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Close
              </Button>
              {currentCrs && <CRSExportButton crsId={currentCrs.id} version={currentCrs.version} />}
            </div>

            <div className="flex gap-2">
              {canEdit && currentCrs && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              )}
              {currentCrs && currentCrs.status === "draft" && (
                <Button onClick={onSubmitForReview} variant="primary">
                  Submit for Review
                </Button>
              )}
              {currentCrs && currentCrs.status === "rejected" && (
                <Button
                  onClick={onRegenerate}
                  variant="primary"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Regenerate CRS
                </Button>
              )}
              {currentCrs && currentCrs.status === "approved" && (
                <span className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md border border-green-200 flex items-center">
                  ✅ Final Approved
                </span>
              )}

            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
