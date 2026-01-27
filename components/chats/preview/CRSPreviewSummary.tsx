/**
 * CRSPreviewSummary Component
 * Displays overall summary and key points
 */

"use client";

import { FileText, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CRSPreviewOut } from "@/dto";

interface CRSPreviewSummaryProps {
  preview: CRSPreviewOut;
}

export function CRSPreviewSummary({ preview }: CRSPreviewSummaryProps) {
  return (
    <ScrollArea className="h-[500px] rounded-lg border bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Overall Summary */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Overall Summary
          </h3>
          <p className="text-gray-700 leading-relaxed bg-white rounded-lg p-4 border">
            {preview.overall_summary || "No summary available yet"}
          </p>
        </div>

        {/* Key Points */}
        {preview.summary_points && preview.summary_points.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Key Points
            </h3>
            <ul className="space-y-2">
              {preview.summary_points.map((point, index) => (
                <li key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 border">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
