/**
 * DashboardTab Component
 * Displays project dashboard with stats and quick actions
 * Single Responsibility: Dashboard UI rendering
 */

"use client";

import { Plus, MessageCircle, FileText, Folder, Users, Layout, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { useProjectDashboard } from "@/hooks/projects/useProjectDashboard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { CRSStatus } from "@/dto/crs.dto";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { parseUTCDate } from "@/lib/utils";

interface DashboardTabProps {
  userRole: "BA" | "Client";
  onStartChat: () => void;
  projectId: number;
}

export function DashboardTab({
  userRole,
  onStartChat,
  projectId,
}: DashboardTabProps) {
  const { stats, isLoading, error, refresh } = useProjectDashboard(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading project dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 bg-gray-50/50 min-h-[calc(100vh-100px)] p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-2">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Layout className="w-6 h-6 text-primary" />
            Project Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Overview of your project activity, documents, and recent chats.
          </p>
        </div>
        {userRole === "Client" && (
          <Button
            variant="primary"
            size="lg"
            className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-6 border-none"
            onClick={onStartChat}
          >
            <Plus className="w-5 h-5 font-bold" />
            <span className="font-semibold">New Chat</span>
          </Button>
        )}
      </div>

      <div className="space-y-9">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {userRole === "Client" && (
            <StatCard
              title="Total Chats"
              value={stats.chats.total}
              statusCounts={stats.chats.by_status}
              icon={<MessageCircle className="w-5 h-5" />}
            />
          )}
          <StatCard
            title="Project Docs"
            value={stats.documents.total}
            icon={<Folder className="w-5 h-5" />}
          />
          <StatCard
            title="CRS History"
            value={stats.crs.total}
            statusCounts={stats.crs.by_status}
            icon={<FileText className="w-5 h-5" />}
          />
        </div>

        {/* Activity Section */}
        <div className="space-y-9 px-4 pb-10">
          {userRole === "Client" && stats.recent_chats.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 px-1">Recent Chats</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.recent_chats.slice(0, 3).map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chats/${chat.id}?projectId=${projectId}`}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover-lift flex flex-col justify-center min-h-[125px]"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-1.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors shrink-0">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                          {chat.name}
                        </h4>
                      </div>
                      <StatusBadge status={chat.status} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1 min-w-0">
                        <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(chat.started_at), { addSuffix: true })}
                        </span>
                      </div>
                      <span>•</span>
                      <span className="font-medium text-primary/60">{chat.message_count} messages</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Specification Section */}
          {stats.crs.latest && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 px-1">Active Specification</h3>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold text-gray-900">Version {stats.crs.latest.version}.0</h4>
                      <CRSStatusBadge status={stats.crs.latest.status as CRSStatus} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pattern: <span className="font-bold text-gray-700">{stats.crs.latest.pattern.toUpperCase()}</span> •
                      Updated {formatDistanceToNow(parseUTCDate(stats.crs.latest.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CRSExportButton
                    crsId={stats.crs.latest.id}
                    version={stats.crs.latest.version}
                  />
                  <CRSAuditButton crsId={stats.crs.latest.id} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
