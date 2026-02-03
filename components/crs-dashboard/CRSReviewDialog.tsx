"use client";

import { useState, useCallback } from "react";
import { CRSDTO, CRSStatus, CRSPattern } from "@/dto/crs.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, FileText } from "lucide-react";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { useCRSStatusUpdate } from "@/hooks/crs/useCRSStatusUpdate";
import { cn } from "@/lib/utils";

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
      {/* Main Review Dialog */}
      <Dialog open={open && !showRejectDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[95vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl">
          <DialogHeader className="px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                Reviewing: {crs.project_name || `Project #${crs.project_id}`}
              </DialogTitle>
              <CRSStatusBadge status={crs.status} />
            </div>
            <DialogDescription className="sr-only">
              Review the Client Requirements Specification document.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50/30">
              {/* Error Message */}
              {(validationError || error) && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm font-medium flex items-center gap-3">
                  <XCircle className="w-4 h-4 shrink-0" />
                  {validationError || error}
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Version</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-black text-gray-900">v{crs.version}.0</p>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">Stable</span>
                  </div>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pattern</p>
                  <p className={cn("text-xs font-bold mt-2 px-2 py-1 rounded-lg inline-block text-center", PATTERN_COLORS[patternKey].bg, PATTERN_COLORS[patternKey].text)}>
                    {PATTERN_LABELS[patternKey]}
                  </p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Original Issue</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {new Date(crs.created_at).toLocaleDateString(undefined, {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Submission status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full",
                      crs.status === 'approved' ? 'bg-green-500' :
                        crs.status === 'rejected' ? 'bg-red-500' : 'bg-[#341bab]'
                    )} />
                    <p className="text-sm font-bold text-gray-900 capitalize">
                      {crs.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Points */}
              {crs.summary_points && crs.summary_points.length > 0 && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Key Specification Insights
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {crs.summary_points.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-primary/5">
                        <div className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-primary/40" />
                        <span className="text-sm text-gray-700 font-medium leading-tight">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CRS Content */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative overflow-hidden min-h-[500px]">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <FileText className="w-24 h-24" />
                </div>
                <CRSContentDisplay content={crs.content} />
              </div>
            </div>

            {/* Right Panel: Comments */}
            <div className="w-[350px] lg:w-[400px] border-l border-gray-200 bg-white shadow-[rgba(0,0,0,0.03)_0px_0px_20px_-5px_inset]">
              <CommentsSection crsId={crs.id} className="h-full border-none rounded-none shadow-none" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between gap-4 z-10">
            <div className="flex gap-2">
              <CRSExportButton crsId={crs.id} version={crs.version} />
              <CRSAuditButton crsId={crs.id} />
            </div>

            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" disabled={isUpdating} className="rounded-xl font-bold text-xs h-10 px-6">
                Close
              </Button>

              {canReject && (
                <Button
                  onClick={handleRejectClick}
                  variant="destructive"
                  disabled={isUpdating}
                  className="rounded-xl font-bold text-xs h-10 px-6 gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject submission
                </Button>
              )}

              {canApprove && (
                <Button
                  onClick={handleApprove}
                  variant="primary"
                  disabled={isUpdating}
                  className="rounded-xl font-bold text-xs h-10 px-8 gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-[1.05] active:scale-95"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve document
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
