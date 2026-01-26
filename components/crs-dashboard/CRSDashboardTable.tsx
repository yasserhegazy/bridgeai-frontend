"use client";

import { CRSDTO, CRSStatus, CRSPattern } from "@/dto/crs.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { Eye } from "lucide-react";

interface CRSDashboardTableProps {
  documents: CRSDTO[];
  onViewDetails: (crs: CRSDTO) => void;
  statusFilter: CRSStatus | "all";
  onFilterChange: (status: CRSStatus | "all") => void;
}

type PatternKey = CRSPattern | "unknown";

const PATTERN_LABELS: Record<PatternKey, string> = {
  iso_iec_ieee_29148: "ISO/IEC/IEEE 29148",
  ieee_830: "IEEE 830",
  babok: "BABOK",
  agile_user_stories: "Agile User Stories",
  unknown: "Unknown",
};

const PATTERN_COLORS: Record<PatternKey, string> = {
  iso_iec_ieee_29148: "bg-blue-100 text-blue-800",
  ieee_830: "bg-purple-100 text-purple-800",
  babok: "bg-green-100 text-green-800",
  agile_user_stories: "bg-orange-100 text-orange-800",
  unknown: "bg-gray-100 text-gray-800",
};

export function CRSDashboardTable({
  documents,
  onViewDetails,
  statusFilter,
  onFilterChange,
}: CRSDashboardTableProps) {
  const statusOptions: Array<{ value: CRSStatus | "all"; label: string }> = [
    { value: "all", label: "All Status" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            CRS Documents ({documents.length})
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => onFilterChange(e.target.value as CRSStatus | "all")}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#341bab] focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {documents.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No CRS documents found.</p>
          <p className="text-sm mt-1">Try changing the filter or wait for clients to submit documents.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pattern
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Summary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((crs) => {
                const patternKey: PatternKey = crs.pattern ?? "unknown";
                const summaryCount = crs.summary_points?.length ?? 0;
                return (
                <tr key={crs.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Project #{crs.project_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PATTERN_COLORS[patternKey]}`}>
                      {PATTERN_LABELS[patternKey]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    v{crs.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CRSStatusBadge status={crs.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="max-w-xs truncate">
                      {crs.summary_points?.[0] || "No summary available"}
                    </div>
                    {summaryCount > 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{summaryCount - 1} more points
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(crs.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onViewDetails(crs)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#341bab] text-white rounded-md hover:bg-[#2a1589] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
