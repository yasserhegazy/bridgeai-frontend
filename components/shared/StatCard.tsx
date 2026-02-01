/**
 * StatCard Component
 * Displays statistics with optional status breakdown
 * Single Responsibility: Stats UI rendering
 * Reusable across team and project dashboards
 */

"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: Record<string, number>;
  icon?: React.ReactNode;
  className?: string;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-primary/10 text-primary",
  pending: "bg-secondary/10 text-secondary font-bold", // Replaced yellow with secondary violet
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-700",
  under_review: "bg-primary/5 text-primary border border-primary/10",
  archived: "bg-gray-100 text-gray-700",
  inactive: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
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
      className={cn(
        "relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover-lift group",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
        </div>
        <div className="text-4xl font-bold text-primary tracking-tighter">
          {value}
        </div>
      </div>

      {statusCounts && Object.keys(statusCounts).length > 0 && (
        <div className="space-y-3 mt-6 pt-6 border-t border-gray-50">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
                {formatStatus(status)}
              </span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide",
                  statusColors[status.toLowerCase()] ||
                  "bg-gray-100 text-gray-700"
                )}
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
