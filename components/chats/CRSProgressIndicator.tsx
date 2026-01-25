"use client";

import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CRSProgressIndicatorProps {
  percentage: number;
  isComplete: boolean;
  missingRequiredFields?: string[];
  missingOptionalFields?: string[];
  weakFields?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CRSProgressIndicator({
  percentage,
  isComplete,
  missingRequiredFields = [],
  missingOptionalFields = [],
  weakFields = [],
  className,
  size = "md",
}: CRSProgressIndicatorProps) {
  // Color based on completion percentage
  const getProgressColor = () => {
    if (percentage >= 100) return "text-green-600 bg-green-100";
    if (percentage >= 80) return "text-lime-600 bg-lime-100";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressBarColor = () => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 80) return "bg-lime-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getIcon = () => {
    if (isComplete || percentage >= 100) {
      return <CheckCircle2 className={cn(
        size === "sm" && "h-4 w-4",
        size === "md" && "h-5 w-5",
        size === "lg" && "h-6 w-6"
      )} />;
    }
    if (missingRequiredFields.length > 0) {
      return <AlertCircle className={cn(
        size === "sm" && "h-4 w-4",
        size === "md" && "h-5 w-5",
        size === "lg" && "h-6 w-6"
      )} />;
    }
    return <Circle className={cn(
      size === "sm" && "h-4 w-4",
      size === "md" && "h-5 w-5",
      size === "lg" && "h-6 w-6"
    )} />;
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress Badge */}
      <div className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium",
        getProgressColor(),
        sizeClasses[size]
      )}>
        {getIcon()}
        <span>{percentage}% Complete</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            getProgressBarColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status Message */}
      <div className="text-xs text-gray-600 space-y-1">
        {isComplete && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span className="text-green-600 font-medium">CRS is ready!</span>
          </div>
        )}
        
        {!isComplete && (
          <>
            {/* Special message for 95% (clarification mode cap) */}
            {percentage === 95 && missingRequiredFields.length === 0 && weakFields.length === 0 && (
              <div className="flex items-start gap-1.5">
                <Circle className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                <span className="text-blue-600">
                  Almost there! The AI is still gathering final details.
                </span>
              </div>
            )}
            {/* Show truly missing fields (not in weak_fields) */}
            {missingRequiredFields.filter(f => !weakFields.includes(f)).length > 0 && (
              <div className="flex items-start gap-1.5">
                <AlertCircle className="h-3 w-3 mt-0.5 text-red-500 flex-shrink-0" />
                <span className="text-red-600 font-medium">
                  Missing required: {missingRequiredFields.filter(f => !weakFields.includes(f)).map(formatFieldName).join(", ")}
                </span>
              </div>
            )}
            {weakFields.length > 0 && (
              <div className="flex items-start gap-1.5">
                <Circle className="h-3 w-3 mt-0.5 text-orange-500 flex-shrink-0" />
                <span className="text-orange-600">
                  Needs more detail: {weakFields.map(formatFieldName).join(", ")}
                </span>
              </div>
            )}
            {missingRequiredFields.length === 0 && weakFields.length === 0 && missingOptionalFields.length > 2 && percentage !== 95 && (
              <div className="flex items-start gap-1.5">
                <Circle className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                <span className="text-yellow-600">
                  Need {2 - (5 - missingOptionalFields.length)} more optional field(s) to complete
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
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
