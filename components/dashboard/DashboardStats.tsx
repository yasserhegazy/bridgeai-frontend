/**
 * DashboardStats Component
 * Displays statistics cards for team dashboard
 * Single Responsibility: Stats cards rendering
 */

"use client";

import { memo } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { TeamDashboardStatsDTO } from "@/dto/teams.dto";
import { FolderOpen, MessageSquare, FileText } from "lucide-react";

interface DashboardStatsProps {
  stats: TeamDashboardStatsDTO;
}

export const DashboardStats = memo(function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Projects"
        value={stats.projects.total}
        statusCounts={stats.projects.by_status}
        icon={<FolderOpen className="w-6 h-6" />}
      />

      <StatCard
        title="Chats"
        value={stats.chats.total}
        statusCounts={stats.chats.by_status}
        icon={<MessageSquare className="w-6 h-6" />}
      />

      <StatCard
        title="CRS Documents"
        value={stats.crs.total}
        statusCounts={stats.crs.by_status}
        icon={<FileText className="w-6 h-6" />}
      />
    </div>
  );
});
