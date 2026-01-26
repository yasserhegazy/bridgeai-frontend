/**
 * CRS Status Badge Component
 * Displays status badges for CRS (Client Requirements Specification) documents
 */

import { CRSStatus } from "@/dto/crs.dto";

interface CRSStatusBadgeProps {
  status: CRSStatus;
}

export function CRSStatusBadge({ status }: CRSStatusBadgeProps) {
  const statusConfig: Record<CRSStatus, { label: string; textColor: string; bgColor: string }> = {
    draft: {
      label: "Draft",
      textColor: "text-gray-700",
      bgColor: "bg-gray-100",
    },
    under_review: {
      label: "Under Review",
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    approved: {
      label: "Validated",
      textColor: "text-green-700",
      bgColor: "bg-green-100",
    },
    rejected: {
      label: "Rejected",
      textColor: "text-red-700",
      bgColor: "bg-red-100",
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.textColor} ${config.bgColor}`}>
      {config.label}
    </div>
  );
}
