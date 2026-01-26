"use client";

import { useState, useCallback } from "react";
import { CRSDTO, CRSStatus, CRSPattern } from "@/dto/crs.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { useCRSStatusUpdate } from "@/hooks/crs/useCRSStatusUpdate";

type PatternKey = CRSPattern | "unknown";

const PATTERN_LABELS: Record<PatternKey, string> = {
  iso_iec_ieee_29148: "ISO/IEC/IEEE 29148",
  ieee_830: "IEEE 830",
  babok: "BABOK",
  agile_user_stories: "Agile User Stories",
  unknown: "Unknown",
};

const PATTERN_COLORS: Record<PatternKey, { bg: string; text: string }> = {
  iso_iec_ieee_29148: { bg: "bg-blue-50", text: "text-blue-900" },
  ieee_830: { bg: "bg-purple-50", text: "text-purple-900" },
  babok: { bg: "bg-green-50", text: "text-green-900" },
  agile_user_stories: { bg: "bg-orange-50", text: "text-orange-900" },
  unknown: { bg: "bg-gray-50", text: "text-gray-900" },
};

interface CRSReviewDialogProps {
  crs: CRSDTO;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function CRSReviewDialog({ crs, open, onClose, onStatusUpdate }: CRSReviewDialogProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { isUpdating, error, updateStatus, clearError } = useCRSStatusUpdate();

  const handleApprove = useCallback(async () => {
    setValidationError(null);
    const success = await updateStatus(crs.id, "approved");
    if (success) {
      onStatusUpdate();
      onClose();
    }
  }, [crs.id, updateStatus, onStatusUpdate, onClose]);

  const handleRejectClick = useCallback(() => {
    setValidationError(null);
    clearError();
    setShowRejectDialog(true);
  }, [clearError]);

  const handleRejectConfirm = useCallback(async () => {
    if (!rejectionReason.trim()) {
      setValidationError("Please provide a reason for rejection");
      return;
    }

    const success = await updateStatus(crs.id, "rejected", rejectionReason);
    if (success) {
      onStatusUpdate();
      setShowRejectDialog(false);
      onClose();
    }
  }, [crs.id, rejectionReason, updateStatus, onStatusUpdate, onClose]);

  const canApprove = crs.status === "under_review" || crs.status === "draft";
  const canReject = crs.status === "under_review" || crs.status === "draft";
  const patternKey: PatternKey = crs.pattern ?? "unknown";

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl">CRS Review - Project #{crs.project_id}</span>
              <CRSStatusBadge status={crs.status} />
            </DialogTitle>
            {/* Ensure accessibility by providing a description if needed, or visually hidden */}
            <DialogDescription className="sr-only">
              Review the Client Requirements Specification document.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {/* Error Message */}
              {(validationError || error) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm animate-in fade-in slide-in-from-top-2">
                  {validationError || error}
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">v{crs.version}</p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pattern</p>
                  <p className={`text-sm font-semibold mt-2 px-2 py-1 rounded inline-block ${PATTERN_COLORS[patternKey].bg} ${PATTERN_COLORS[patternKey].text}`}>
                    {PATTERN_LABELS[patternKey]}
                  </p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {new Date(crs.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Creator</p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    User #{crs.created_by}
                  </p>
                </div>
              </div>

              {/* Summary Points */}
              {crs.summary_points && crs.summary_points.length > 0 && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Key Points
                  </h3>
                  <ul className="grid gap-2">
                    {crs.summary_points.map((point, idx) => (
                      <li key={idx} className="text-sm text-blue-900/80 pl-2 border-l-2 border-blue-200">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CRS Content */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[400px]">
                <CRSContentDisplay content={crs.content} />
              </div>
            </div>

            {/* Right Panel: Comments */}
            <div className="w-[350px] lg:w-[400px] border-l border-gray-200 bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_20px_-5px_inset]">
              <CommentsSection crsId={crs.id} className="h-full border-none rounded-none shadow-none" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-3 z-10">
            <div className="flex gap-2">
              <CRSExportButton crsId={crs.id} version={crs.version} />
              <CRSAuditButton crsId={crs.id} />
            </div>

            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" disabled={isUpdating} className="border-gray-300">
                Close
              </Button>

              {canReject && (
                <Button
                  onClick={handleRejectClick}
                  variant="destructive"
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              )}

              {canApprove && (
                <Button
                  onClick={handleApprove}
                  variant="default"
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject CRS Document</DialogTitle>
            <DialogDescription>
              Please provide a detailed reason for rejecting this CRS. This feedback will help the client improve their requirements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                placeholder="Explain what needs to be improved..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
                setValidationError(null);
                clearError();
              }}
              variant="outline"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              variant="destructive"
              disabled={isUpdating || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
