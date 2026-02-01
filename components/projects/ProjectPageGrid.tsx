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
import { Layout, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardTab } from "./DashboardTab";
import { ChatsTab } from "./ChatsTab";
import { SettingsTab } from "./SettingsTab";

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

  const handleStartChat = useCallback(() => {
    setActiveTab("chats");
    setCreateChatTrigger(Date.now());
  }, []);

  const handleTabChange = useCallback((tab: "dashboard" | "chats" | "settings") => {
    setActiveTab(tab);
    setCreateChatTrigger(0);
  }, []);

  // Filter tabs based on user role
  const visibleTabs = useMemo(() => {
    const tabs = [
      { id: "dashboard", label: "Dashboard", icon: Layout },
      { id: "chats", label: "Chats", icon: MessageSquare },
      { id: "settings", label: "Settings", icon: Settings },
    ] as const;

    return tabs.filter(
      (tab) => tab.id !== "chats" || userRole === "Client"
    );
  }, [userRole]);

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-semibold transition-all hover:cursor-pointer",
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-black"
              )}
              onClick={() => handleTabChange(tab.id as any)}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-gray-500")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <DashboardTab
          userRole={userRole}
          onStartChat={handleStartChat}
          projectId={projectId}
        />
      )}

      {activeTab === "chats" && userRole === "Client" && (
        <ChatsTab projectId={projectId} teamId={teamId} createChatTrigger={createChatTrigger} />
      )}

      {activeTab === "settings" && <SettingsTab projectId={projectId} />}
    </div>
  );
}
