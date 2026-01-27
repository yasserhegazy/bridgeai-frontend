/**
 * CRSDraftDialog Component
 * Modal for viewing and managing CRS draft
 */

"use client";

import { Loader2 } from "lucide-react";
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

interface CRSDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestCRS: CRSDTO | null;
  crsLoading: boolean;
  crsError: string | null;
  onSubmitForReview: () => Promise<void>;
  onRegenerate: () => void;
}

export function CRSDraftDialog({
  open,
  onOpenChange,
  latestCRS,
  crsLoading,
  crsError,
  onSubmitForReview,
  onRegenerate,
}: CRSDraftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">CRS Document</span>
            {latestCRS && <CRSStatusBadge status={latestCRS.status} />}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review the Client Requirements Specification document.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
            {crsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-base text-gray-500">Loading document...</span>
              </div>
            ) : crsError || !latestCRS ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {crsError || "No CRS document found for this project."}
                </p>
              </div>
            ) : (
              <>
                {/* Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Version
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">v{latestCRS.version}</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pattern
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      {latestCRS.pattern === "iso_iec_ieee_29148"
                        ? "ISO/IEC/IEEE 29148"
                        : latestCRS.pattern === "ieee_830"
                        ? "IEEE 830"
                        : latestCRS.pattern === "agile_user_stories"
                        ? "Agile User Stories"
                        : "BABOK"}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      {new Date(latestCRS.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                </div>

                {/* Summary Points */}
                {latestCRS.summary_points && latestCRS.summary_points.length > 0 && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Key Points
                    </h3>
                    <ul className="grid gap-2">
                      {latestCRS.summary_points.map((point, idx) => (
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
                  <CRSContentDisplay content={latestCRS.content} />
                </div>
              </>
            )}
          </div>

          {/* Right Panel: Comments */}
          {latestCRS && (
            <div className="w-[350px] lg:w-[400px] border-l border-gray-200 bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_20px_-5px_inset]">
              <CommentsSection
                crsId={latestCRS.id}
                className="h-full border-none rounded-none shadow-none"
              />
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-3 z-10">
          <div className="flex gap-2">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="border-gray-300">
              Close
            </Button>
            {latestCRS && <CRSExportButton crsId={latestCRS.id} version={latestCRS.version} />}
          </div>

          <div className="flex gap-2">
            {latestCRS && latestCRS.status === "draft" && (
              <Button onClick={onSubmitForReview} variant="primary">
                Submit for Review
              </Button>
            )}
            {latestCRS && latestCRS.status === "rejected" && (
              <Button
                onClick={onRegenerate}
                variant="primary"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Regenerate CRS
              </Button>
            )}
            {latestCRS && latestCRS.status === "approved" && (
              <span className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md border border-green-200 flex items-center">
                ✅ Final Approved
              </span>
            )}
            {latestCRS && latestCRS.status === "under_review" && (
              <span className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md border border-blue-200 flex items-center">
                ⏳ Pending Review
              </span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
