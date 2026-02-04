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
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw, Loader2, Edit, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl">
        <DialogHeader className="px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
              CRS Request: {projectName}
            </DialogTitle>
            <CRSStatusBadge status={currentCrs.status} />
          </div>
        </DialogHeader>

        {isEditing ? (
          <div className="flex-1 overflow-hidden">
            <CRSContentEditor
              initialContent={currentCrs.content}
              onSave={handleSaveContent}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50/30">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm font-medium flex items-center gap-3"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Rejection Alert */}
            {currentCrs.status === "rejected" && currentCrs.rejection_reason && (
              <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-red-900 mb-1 tracking-tight">
                      Revisions Required
                    </h3>
                    <div className="text-xs text-red-800/60 mb-4 font-medium italic">
                      Reviewed on {new Date(currentCrs.reviewed_at || "").toLocaleString(undefined, {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">
                        {currentCrs.rejection_reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Approval Notice */}
            {currentCrs.status === "approved" && (
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-green-200">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-green-900 mb-1 tracking-tight">
                      Request Approved
                    </h3>
                    <p className="text-sm text-green-800/80 font-medium">
                      The requirements have been finalized and validated for production.
                    </p>
                    {currentCrs.reviewed_at && (
                      <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest mt-3 opacity-60">
                        Finalized: {new Date(currentCrs.reviewed_at).toLocaleDateString(undefined, { dateStyle: "long" })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Under Review Notice */}
            {currentCrs.status === "under_review" && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-primary mb-1 tracking-tight">
                      Active Review Phase
                    </h3>
                    <p className="text-sm text-primary/60 font-medium">
                      Our analysts are currently validating these requirements. We'll notify you once complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Version</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black text-gray-900">v{currentCrs.version}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">Stable</span>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Original Issue</p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {new Date(currentCrs.created_at).toLocaleDateString(undefined, {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Class</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full",
                    currentCrs.status === 'approved' ? 'bg-green-500' :
                      currentCrs.status === 'rejected' ? 'bg-red-500' : 'bg-primary'
                  )} />
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {currentCrs.status.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Points */}
            {currentCrs.summary_points && currentCrs.summary_points.length > 0 && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Key Specification Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentCrs.summary_points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-primary/5">
                      <div className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-primary/40" />
                      <span className="text-sm text-gray-700 font-medium leading-tight">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Display */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <FileText className="w-24 h-24" />
              </div>
              <CRSContentDisplay content={currentCrs.content} />
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between gap-4 shrink-0">
            <div className="flex gap-2">
              <CRSExportButton crsId={currentCrs.id} version={currentCrs.version} />
              <CRSAuditButton crsId={currentCrs.id} />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isUpdating}
                className="rounded-xl font-bold text-xs h-10 px-6"
              >
                Close
              </Button>

              {canEdit && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-10 px-6 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit content
                </Button>
              )}

              {canResubmit && (
                <Button
                  onClick={handleResubmit}
                  variant="primary"
                  disabled={isUpdating}
                  className="rounded-xl font-bold text-xs h-10 px-8"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resubmit for review
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
