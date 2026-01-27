/**
 * DashboardTab Component
 * Displays project dashboard with stats and quick actions
 * Single Responsibility: Dashboard UI rendering
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, MessageCircle, Users, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./StatCard";
import { fetchLatestCRS } from "@/services/crs.service";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";
import { CRSDTO } from "@/dto";

interface DashboardTabProps {
  userRole: "BA" | "Client";
  onStartChat: () => void;
  projectId: number;
  chatCount: number;
  documentCount: number;
}

export function DashboardTab({
  userRole,
  onStartChat,
  projectId,
  chatCount,
  documentCount,
}: DashboardTabProps) {
  const [latestCRS, setLatestCRS] = useState<CRSDTO | null>(null);
  const [crsLoading, setCrsLoading] = useState(false);
  const [crsError, setCrsError] = useState<string | null>(null);

  useEffect(() => {
    const loadCRS = async () => {
      try {
        setCrsLoading(true);
        setCrsError(null);
        const crs = await fetchLatestCRS(projectId);
        setLatestCRS(crs);
      } catch (err) {
        setCrsError(err instanceof Error ? err.message : "No CRS available");
      } finally {
        setCrsLoading(false);
      }
    };

    loadCRS();
  }, [projectId]);

  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      <div className="grid grid-cols-3 gap-6">
        {userRole === "Client" && (
          <StatCard
            title="Chats"
            value={chatCount}
            statusCounts={{ Active: 1, Completed: 0, Pending: 0 }}
            icon={<MessageCircle />}
          />
        )}
        <StatCard
          title="Documents"
          value={documentCount}
          statusCounts={{ Active: 1, Completed: 0, Pending: 0 }}
          icon={<Clock />}
        />

        {/* Quick Actions */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
          {userRole === "Client" && (
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2"
              onClick={onStartChat}
            >
              <MessageCircle className="w-4 h-4" /> Start Chat
            </Button>
          )}
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Add Team Member
          </Button>
        </section>
      </div>

      {/* CRS Status Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#341bab]" />
          <h2 className="text-lg font-semibold">CRS Document</h2>
        </div>
        {crsLoading ? (
          <p className="text-sm text-gray-500">Loading CRS status...</p>
        ) : crsError || !latestCRS ? (
          <p className="text-sm text-gray-500">No CRS document available yet</p>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Version {latestCRS.version}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(latestCRS.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CRSStatusBadge status={latestCRS.status} />
                <CRSExportButton crsId={latestCRS.id} version={latestCRS.version} />
                <CRSAuditButton crsId={latestCRS.id} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
