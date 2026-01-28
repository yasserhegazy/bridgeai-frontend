/**
 * CRS Details Dialog Component
 * Modal for viewing and managing CRS details from client's my-crs-requests page
 * Refactored to use CRS service layer
 */

"use client";

import { useCallback, useState } from "react";
import { CRSDTO } from "@/dto/crs.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Loader2, Edit } from "lucide-react";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";
import { CRSContentEditor } from "@/components/shared/CRSContentEditor";
import { useCRSStatusUpdate } from "@/hooks/crs/useCRSStatusUpdate";
import { updateCRSContent } from "@/services/crs.service";
import { CRSError } from "@/services/errors.service";

interface CRSDetailsDialogProps {
  crs: CRSDTO;
  projectName: string;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function CRSDetailsDialog({
  crs,
  projectName,
  open,
  onClose,
  onStatusUpdate
}: CRSDetailsDialogProps) {
  const { isUpdating, error: statusError, updateStatus, clearError } = useCRSStatusUpdate();
  const [isEditing, setIsEditing] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  // Update local state when prop changes to ensure we have latest version
  const [currentCrs, setCurrentCrs] = useState<CRSDTO>(crs);

  // Sync state with props when dialog opens or crs changes
  // We use a simplified check to avoid infinite loops if we were to put this in useEffect with strict deps
  if (open && (crs.id !== currentCrs.id || crs.version !== currentCrs.version)) {
    setCurrentCrs(crs);
  }

  const handleResubmit = useCallback(async () => {
    clearError();
    const success = await updateStatus(crs.id, "under_review");
    if (success) {
      onStatusUpdate();
      onClose();
    }
  }, [crs.id, updateStatus, onStatusUpdate, onClose, clearError]);

  const handleSaveContent = async (newContent: string) => {
    try {
      setContentError(null);
      const updatedCRS = await updateCRSContent(
        currentCrs.id,
        newContent,
        currentCrs.edit_version
      );

      // Update local view with response from server
      setCurrentCrs(updatedCRS);
      setIsEditing(false);
      onStatusUpdate(); // Tell parent to refresh list/data
    } catch (err) {
      if (err instanceof CRSError) {
        setContentError(err.message);
      } else {
        setContentError("Failed to save changes. Please try again.");
      }
    }
  };

  const canResubmit = currentCrs.status === "rejected";
  const canEdit = currentCrs.status !== "approved";
  const error = statusError || contentError;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setIsEditing(false);
        setContentError(null);
        clearError();
        onClose();
      }
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col px-8 py-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>CRS Request - {projectName}</span>
            <CRSStatusBadge status={currentCrs.status} />
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <div className="flex-1 overflow-hidden mt-4">
            <CRSContentEditor
              initialContent={currentCrs.content}
              onSave={handleSaveContent}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Rejection Alert */}
            {currentCrs.status === "rejected" && currentCrs.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-900 mb-2">
                      CRS Rejected - Action Required
                    </h3>
                    <p className="text-sm text-red-800 mb-3">
                      <strong>Business Analyst Feedback:</strong>
                    </p>
                    <div className="bg-white border border-red-200 rounded p-3">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {currentCrs.rejection_reason}
                      </p>
                    </div>
                    {currentCrs.reviewed_at && (
                      <p className="text-xs text-red-700 mt-2">
                        Reviewed on {new Date(currentCrs.reviewed_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Approval Notice */}
            {currentCrs.status === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-900 mb-1">
                      CRS Approved
                    </h3>
                    <p className="text-sm text-green-800">
                      Your requirements have been validated and approved by the Business Analyst.
                    </p>
                    {currentCrs.reviewed_at && (
                      <p className="text-xs text-green-700 mt-2">
                        Approved on {new Date(currentCrs.reviewed_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Under Review Notice */}
            {currentCrs.status === "under_review" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      Under Review
                    </h3>
                    <p className="text-sm text-blue-800">
                      Your CRS is currently being reviewed by a Business Analyst. You will be notified once the review is complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-xs font-semibold text-gray-600">Version</p>
                <p className="text-xl font-bold text-black">v{currentCrs.version}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-xs font-semibold text-gray-600">Created</p>
                <p className="text-sm font-medium text-black mt-1">
                  {new Date(currentCrs.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-xs font-semibold text-gray-600">Status</p>
                <p className="text-sm font-medium text-black mt-1 capitalize">
                  {currentCrs.status.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Summary Points */}
            {currentCrs.summary_points && currentCrs.summary_points.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Key Points</h3>
                <ul className="list-disc list-inside space-y-1">
                  {currentCrs.summary_points.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CRS Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <CRSContentDisplay content={currentCrs.content} />
            </div>
          </div>
        )}

        {/* Actions - Hide when editing as Editor defines its own actions */}
        {!isEditing && (
          <div className="mt-6 flex items-center justify-between gap-4 pt-5 border-t border-gray-200">
            <div className="flex gap-2">
              <CRSExportButton crsId={currentCrs.id} version={currentCrs.version} />
              <CRSAuditButton crsId={currentCrs.id} />
            </div>

            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" disabled={isUpdating}>
                Close
              </Button>

              {canEdit && (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
              )}

              {canResubmit && (
                <Button
                  onClick={handleResubmit}
                  variant="default"
                  disabled={isUpdating}
                  className="bg-[#341BAB] hover:bg-[#2a1589] text-white"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resubmit for Review
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
