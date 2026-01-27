/**
 * CRSPreviewProgress Component
 * Shows completion progress and missing fields
 */

"use client";

import { Info, AlertCircle, CheckCircle2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CRSPreviewOut } from "@/dto";
import { CRSProgressIndicator } from "../CRSProgressIndicator";

interface CRSPreviewProgressProps {
  preview: CRSPreviewOut;
}

function formatFieldName(field: string): string {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CRSPreviewProgress({ preview }: CRSPreviewProgressProps) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <CRSProgressIndicator
            percentage={preview.completeness_percentage}
            isComplete={preview.is_complete}
            missingRequiredFields={preview.missing_required_fields}
            missingOptionalFields={preview.missing_optional_fields}
            weakFields={preview.weak_fields}
            size="lg"
          />
        </div>

        {/* What's Missing Section */}
        <div className="space-y-4">
          {/* Special message for 95% (clarification mode) */}
          {preview.completeness_percentage === 95 && 
           preview.missing_required_fields.length === 0 && 
           (!preview.weak_fields || preview.weak_fields.length === 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Almost Complete!
              </h3>
              <p className="text-sm text-blue-700">
                Your CRS is nearly ready. The AI is still asking clarification questions to ensure all details are captured accurately. 
                Once the conversation is complete, your CRS will reach 100% and be ready for review.
              </p>
            </div>
          )}
          
          {preview.missing_required_fields.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Required Fields Missing
              </h3>
              <ul className="space-y-2">
                {preview.missing_required_fields.filter(field => 
                  !preview.weak_fields?.includes(field)
                ).map((field) => (
                  <li key={field} className="flex items-center gap-2 text-red-700">
                    <X className="h-4 w-4" />
                    <span>{formatFieldName(field)}</span>
                  </li>
                ))}
              </ul>
              {preview.missing_required_fields.filter(field => 
                !preview.weak_fields?.includes(field)
              ).length > 0 && (
                <p className="mt-3 text-sm text-red-600">
                  Continue the conversation to provide this information.
                </p>
              )}
            </div>
          )}

          {preview.weak_fields && preview.weak_fields.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Fields Need More Detail
              </h3>
              <ul className="space-y-2">
                {preview.weak_fields.map((field) => (
                  <li key={field} className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>{formatFieldName(field)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-orange-600">
                These fields have some content but need more specific details to count toward completion.
              </p>
            </div>
          )}

          {preview.missing_required_fields.length === 0 && preview.missing_optional_fields.length > 2 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Optional Fields (Need {2 - preview.filled_optional_count} more)
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                You need at least 2 optional fields to complete the CRS. Consider providing:
              </p>
              <ul className="space-y-2">
                {preview.missing_optional_fields.slice(0, 5).map((field) => (
                  <li key={field} className="flex items-center gap-2 text-yellow-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{formatFieldName(field)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preview.is_complete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                CRS Complete!
              </h3>
              <p className="text-green-700">
                All required information has been gathered. The CRS will be automatically saved.
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
