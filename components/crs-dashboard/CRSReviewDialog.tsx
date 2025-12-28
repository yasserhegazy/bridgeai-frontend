"use client";

import { useState } from "react";
import { CRSOut, CRSStatus, updateCRSStatus } from "@/lib/api-crs";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { CRSExportButton } from "@/components/shared/CRSExportButton";

interface CRSReviewDialogProps {
  crs: CRSOut;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function CRSReviewDialog({ crs, open, onClose, onStatusUpdate }: CRSReviewDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      await updateCRSStatus(crs.id, "approved");
      onStatusUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve CRS");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      await updateCRSStatus(crs.id, "rejected", rejectionReason);
      onStatusUpdate();
      setShowRejectDialog(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject CRS");
    } finally {
      setIsUpdating(false);
    }
  };

  const canApprove = crs.status === "under_review" || crs.status === "draft";
  const canReject = crs.status === "under_review" || crs.status === "draft";

  return (
    <>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>CRS Review - Project #{crs.project_id}</span>
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

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-600">Version</p>
              <p className="text-xl font-bold text-black">v{crs.version}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-600">Created</p>
              <p className="text-sm font-medium text-black mt-1">
                {new Date(crs.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-xs font-semibold text-gray-600">Creator ID</p>
              <p className="text-sm font-medium text-black mt-1">
                User #{crs.created_by}
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
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" disabled={isUpdating}>
              Close
            </Button>
            
            {canReject && (
              <Button
                onClick={handleRejectClick}
                variant="destructive"
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700 text-white"
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
                className="bg-green-600 hover:bg-green-700 text-white"
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
              placeholder="Explain what needs to be improved, what's missing, or what's incorrect..."
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
              setError(null);
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
