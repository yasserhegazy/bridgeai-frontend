/**
 * DashboardTab Component
 * Displays project dashboard with stats and quick actions
 * Single Responsibility: Dashboard UI rendering
 */

"use client";

import { Plus, MessageCircle, FileText, Folder } from "lucide-react";
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
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userRole === "Client" && (
          <StatCard
            title="Chats"
            value={stats.chats.total}
            statusCounts={stats.chats.by_status}
            icon={<MessageCircle />}
          />
        )}
        <StatCard
          title="Documents"
          value={stats.documents.total}
          icon={<Folder />}
        />
        <StatCard
          title="CRS Documents"
          value={stats.crs.total}
          statusCounts={stats.crs.by_status}
          icon={<FileText />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Chats */}
        {userRole === "Client" && stats.recent_chats.length > 0 && (
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Recent Chats
            </h2>
            <div className="space-y-3">
              {stats.recent_chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {chat.name}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{chat.message_count} messages</span>
                        <span>
                          {formatDistanceToNow(new Date(chat.started_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={chat.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {userRole === "Client" && (
              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                onClick={onStartChat}
              >
                <MessageCircle className="w-4 h-4" /> Start New Chat
              </Button>
            )}
            {stats.crs.latest && (
              <>
                <CRSExportButton
                  crsId={stats.crs.latest.id}
                  version={stats.crs.latest.version}
                />
                <CRSAuditButton crsId={stats.crs.latest.id} />
              </>
            )}
          </div>
        </section>
      </div>

      {/* CRS Status Section */}
      {stats.crs.latest && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Latest CRS Document
            </h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-medium text-gray-900">
                Version {stats.crs.latest.version}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Created:{" "}
                {formatDistanceToNow(new Date(stats.crs.latest.created_at), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-sm text-gray-600">
                Pattern: {stats.crs.latest.pattern}
              </p>
            </div>
            <CRSStatusBadge status={stats.crs.latest.status as CRSStatus} />
          </div>
        </section>
      )}

      {!stats.crs.latest && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">CRS Document</h2>
          </div>
          <p className="text-sm text-gray-500">
            No CRS document available yet. Start a chat to generate one.
          </p>
        </section>
      )}
    </div>
  );
}
