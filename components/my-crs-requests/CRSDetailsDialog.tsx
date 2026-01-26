"use client";

import { useCallback } from "react";
import { CRSDTO } from "@/dto/crs.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";
import { useCRSStatusUpdate } from "@/hooks/crs/useCRSStatusUpdate";

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
  const { isUpdating, error, updateStatus, clearError } = useCRSStatusUpdate();

  const handleResubmit = useCallback(async () => {
    clearError();
    const success = await updateStatus(crs.id, "under_review");
    if (success) {
      onStatusUpdate();
      onClose();
    }
  }, [crs.id, updateStatus, onStatusUpdate, onClose, clearError]);

  const canResubmit = crs.status === "rejected";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>CRS Request - {projectName}</span>
            <CRSStatusBadge status={crs.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Rejection Alert */}
          {crs.status === "rejected" && crs.rejection_reason && (
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
                      {crs.rejection_reason}
                    </p>
                  </div>
                  {crs.reviewed_at && (
                    <p className="text-xs text-red-700 mt-2">
                      Reviewed on {new Date(crs.reviewed_at).toLocaleString("en-US", {
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
          {crs.status === "approved" && (
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
                  {crs.reviewed_at && (
                    <p className="text-xs text-green-700 mt-2">
                      Approved on {new Date(crs.reviewed_at).toLocaleString("en-US", {
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
          {crs.status === "under_review" && (
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
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-600">Version</p>
              <p className="text-xl font-bold text-black">v{crs.version}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-600">Created</p>
              <p className="text-sm font-medium text-black mt-1">
                {new Date(crs.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-600">Status</p>
              <p className="text-sm font-medium text-black mt-1 capitalize">
                {crs.status.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Summary Points */}
          {crs.summary_points && crs.summary_points.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Key Points</h3>
              <ul className="list-disc list-inside space-y-1">
                {crs.summary_points.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CRS Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <CRSContentDisplay content={crs.content} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <CRSExportButton crsId={crs.id} version={crs.version} />
            <CRSAuditButton crsId={crs.id} />
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" disabled={isUpdating}>
              Close
            </Button>

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
                    Resubmitting...
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
      </DialogContent>
    </Dialog>
  );
}
