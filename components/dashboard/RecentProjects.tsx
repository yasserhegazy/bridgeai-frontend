/**
 * RecentProjects Component
 * Displays recent projects list with navigation
 * Single Responsibility: Recent projects list rendering
 */

"use client";

import { memo } from "react";
import Link from "next/link";
import { ProjectSimpleDTO } from "@/dto/teams.dto";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentProjectsProps {
  projects: ProjectSimpleDTO[];
  teamId: number;
}

export const RecentProjects = memo(function RecentProjects({
  projects,
  teamId,
}: RecentProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
        <Link
          href={`/teams/${teamId}/projects`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(project.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
