/**
 * ProjectPageGrid Component
 * Main project page with tabs for Dashboard, Chats, and Settings
 * Single Responsibility: Tab navigation and composition
 * 
 * REFACTORED: Following SOLID principles
 * - Separated concerns into smaller tab components
 * - Uses hooks for state management
 * - Uses services for API calls
 * - Optimized with useMemo and useCallback
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardTab } from "./DashboardTab";
import { ChatsTab } from "./ChatsTab";
import { SettingsTab } from "./SettingsTab";
import { useProjectChats } from "@/hooks";

interface ProjectPageGridProps {
  projectId: number;
  teamId?: number;
  projectName: string;
  projectDescription?: string;
  userRole: "BA" | "Client";
  initialTab?: "dashboard" | "chats" | "settings";
}

export function ProjectPageGrid({
  projectId,
  teamId,
  userRole,
  initialTab,
}: ProjectPageGridProps) {
  const searchParams = useSearchParams?.();
  const [activeTab, setActiveTab] = useState<"dashboard" | "chats" | "settings">(
    initialTab ||
      (searchParams?.get("tab") as "dashboard" | "chats" | "settings") ||
      "dashboard"
  );
  const [createChatTrigger, setCreateChatTrigger] = useState<number>(0);

  // Load chats to get count for dashboard
  const { chats } = useProjectChats(projectId);

  const handleStartChat = useCallback(() => {
    setActiveTab("chats");
    setCreateChatTrigger(Date.now());
  }, []);

  const handleTabChange = useCallback((tab: "dashboard" | "chats" | "settings") => {
    setActiveTab(tab);
  }, []);

  // Filter tabs based on user role
  const visibleTabs = useMemo(
    () =>
      (["dashboard", "chats", "settings"] as const).filter(
        (tab) => tab !== "chats" || userRole === "Client"
      ),
    [userRole]
  );

  const tabLabels = useMemo(
    () => ({
      dashboard: "Dashboard",
      chats: "Chats",
      settings: "Settings",
    }),
    []
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? "border-b-2 border-[#341bab] text-black"
                : "text-gray-500 hover:text-black hover:cursor-pointer"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <DashboardTab
          userRole={userRole}
          onStartChat={handleStartChat}
          projectId={projectId}
          chatCount={chats.length}
          documentCount={3} // Mock value - would come from actual data
        />
      )}

      {activeTab === "chats" && userRole === "Client" && (
        <ChatsTab projectId={projectId} teamId={teamId} createChatTrigger={createChatTrigger} />
      )}

      {activeTab === "settings" && <SettingsTab projectId={projectId} />}
    </div>
  );
}
