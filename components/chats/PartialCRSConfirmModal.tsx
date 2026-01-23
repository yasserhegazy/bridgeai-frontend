"use client";

import { AlertTriangle, ArrowLeft, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PartialCRSConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completenessPercentage: number;
  missingRequiredFields: string[];
  weakFields: string[];
  onConfirmGenerate: () => void;
  onContinueClarification: () => void;
  isGenerating?: boolean;
}

export function PartialCRSConfirmModal({
  open,
  onOpenChange,
  completenessPercentage,
  missingRequiredFields,
  weakFields,
  onConfirmGenerate,
  onContinueClarification,
  isGenerating = false,
}: PartialCRSConfirmModalProps) {
  const isBelowMinimum = completenessPercentage < 40;
  
  // Filter out weak fields from missing required to avoid duplication
  const trulyMissingFields = missingRequiredFields.filter(
    field => !weakFields.includes(field)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                CRS is {completenessPercentage}% Complete
              </DialogTitle>
              <DialogDescription className="mt-1">
                The requirements gathering is not yet finished. You can generate a draft now or continue the conversation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Minimum threshold warning */}
          {isBelowMinimum && (
            <Alert variant="destructive">
              <AlertDescription>
                Cannot generate CRS below 40% completion. Please provide more information about the project.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress indicator */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-gray-900">{completenessPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  completenessPercentage >= 80 ? 'bg-lime-500' : 
                  completenessPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${completenessPercentage}%` }}
              />
            </div>
          </div>

          {/* Missing/Weak fields */}
          {(trulyMissingFields.length > 0 || weakFields.length > 0) && (
            <div className="space-y-3">
              {trulyMissingFields.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">
                    Missing Required Information:
                  </h4>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {trulyMissingFields.map(field => (
                      <li key={field}>{formatFieldName(field)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {weakFields.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-orange-900 mb-2">
                    Needs More Detail:
                  </h4>
                  <ul className="text-sm text-orange-700 list-disc list-inside space-y-1">
                    {weakFields.map(field => (
                      <li key={field}>{formatFieldName(field)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* What will happen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">If you generate now:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>CRS will be saved as <strong>draft</strong> status</li>
                  <li>Only gathered information will be included</li>
                  <li>You can edit and update it later</li>
                  <li>Business Analyst will see it's incomplete</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onContinueClarification}
            disabled={isGenerating}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Clarification
          </Button>
          <Button
            onClick={onConfirmGenerate}
            disabled={isBelowMinimum || isGenerating}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Draft
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Format field names for display (e.g., "project_title" -> "Project Title")
 */
function formatFieldName(field: string): string {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
