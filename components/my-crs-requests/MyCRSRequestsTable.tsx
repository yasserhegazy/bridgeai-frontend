"use client";

import { CRSDTO, CRSStatus } from "@/dto/crs.dto";
import { ProjectDTO } from "@/dto/projects.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { Eye, AlertCircle } from "lucide-react";

interface MyCRSRequestsTableProps {
  documents: CRSDTO[];
  projects: ProjectDTO[];
  onViewDetails: (crs: CRSDTO) => void;
  statusFilter: CRSStatus | "all";
  onFilterChange: (status: CRSStatus | "all") => void;
}

export function MyCRSRequestsTable({
  documents,
  projects,
  onViewDetails,
  statusFilter,
  onFilterChange,
}: MyCRSRequestsTableProps) {
  const statusOptions: Array<{ value: CRSStatus | "all"; label: string }> = [
    { value: "all", label: "All Status" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const getProjectName = (projectId: number): string => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            My CRS Requests ({documents.length})
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
          <p>No CRS requests found.</p>
          <p className="text-sm mt-1">
            {statusFilter === "all" 
              ? "You haven't submitted any CRS documents for review yet." 
              : `No ${statusFilter.replace("_", " ")} CRS requests.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
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
                  Reviewed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((crs) => {
                const summaryCount = crs.summary_points?.length ?? 0;
                return (
                <tr key={crs.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProjectName(crs.project_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    v{crs.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CRSStatusBadge status={crs.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {crs.rejection_reason && crs.status === "rejected" ? (
                      <div className="flex items-start gap-2 max-w-xs">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-red-600 font-medium mb-1">Rejected</div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {crs.rejection_reason}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-xs">
                        <div className="truncate">
                          {crs.summary_points?.[0] || "No summary available"}
                        </div>
                        {summaryCount > 1 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{summaryCount - 1} more points
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(crs.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {crs.reviewed_at ? (
                      formatDate(crs.reviewed_at)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onViewDetails(crs)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#341bab] text-white rounded-md hover:bg-[#2a1589] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
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
