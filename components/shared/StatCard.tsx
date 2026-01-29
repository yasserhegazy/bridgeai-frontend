/**
 * StatCard Component
 * Displays statistics with optional status breakdown
 * Single Responsibility: Stats UI rendering
 * Reusable across team and project dashboards
 */

"use client";

import { memo } from "react";

interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: Record<string, number>;
  icon?: React.ReactNode;
  className?: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
  under_review: "bg-orange-100 text-orange-800",
  archived: "bg-gray-100 text-gray-800",
  inactive: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

/**
 * Format status string for display
 */
function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const StatCard = memo(function StatCard({
  title,
  value,
  statusCounts,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`relative p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-2xl text-gray-700">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-4xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
      </div>

      {statusCounts && Object.keys(statusCounts).length > 0 && (
        <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-gray-600 font-medium">
                {formatStatus(status)}
              </span>
              <span
                className={`px-3 py-1 rounded-full font-semibold text-xs ${
                  statusColors[status.toLowerCase()] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
