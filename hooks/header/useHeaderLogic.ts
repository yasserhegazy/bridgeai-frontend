/**
 * Header Logic Hook
 * Handles state and logic for the Header component
 * Single Responsibility: Header logic orchestration
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useTeamsList } from "@/hooks/teams/useTeamsList";
import { getCookie } from "@/lib/utils";
import { TeamListItemDTO } from "@/dto/teams.dto";
import { CurrentUserDTO } from "@/dto/auth.dto";

interface UseHeaderLogicReturn {
  isAuthenticated: boolean | null;
  currentUser: CurrentUserDTO | null;
  currentTeamId: string;
  currentTeamName: string;
  teams: TeamListItemDTO[];
  loadingTeams: boolean;
  handleTeamSelect: (teamId: number) => void;
  handleLogout: () => void;
  handleProfileClick: () => void;
  shouldShowTeamSelector: boolean;
}

export function useHeaderLogic(
  initialTeamId?: string,
  setParentTeamId?: (id: string) => void
): UseHeaderLogicReturn {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState(
    initialTeamId || (typeof window !== 'undefined' ? pathname.split("/")[2] : "") || ""
  );

  // Auth check logic
  const checkAuth = useCallback(() => {
    const token = getCookie("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-state-changed", checkAuth);
    return () => {
      window.removeEventListener("auth-state-changed", checkAuth);
    };
  }, [checkAuth]);

  // Sync currentTeamId with initialTeamId or URL
  useEffect(() => {
    if (initialTeamId) {
      setCurrentTeamId(initialTeamId);
    } else if (!currentTeamId && pathname.startsWith("/teams/")) {
       const urlTeamId = pathname.split("/")[2];
       if(urlTeamId) setCurrentTeamId(urlTeamId);
    }
  }, [initialTeamId, pathname, currentTeamId]);

  // Persist team selection
  useEffect(() => {
    if (currentTeamId) {
      localStorage.setItem("selectedTeamId", currentTeamId);
    }
  }, [currentTeamId]);

  // Load persisted team on mount
  useEffect(() => {
    const savedTeamId = localStorage.getItem("selectedTeamId");
    if (savedTeamId && !initialTeamId && !pathname.includes("/teams/")) {
      setCurrentTeamId(savedTeamId);
    }
  }, [initialTeamId, pathname]);

  // Data fetching
  const { user: currentUser, refresh: refreshUser } = useCurrentUser(!!isAuthenticated);
  const { teams, isLoading: loadingTeams } = useTeamsList(!!isAuthenticated);

  // Listen for avatar updates and refresh user data
  useEffect(() => {
    const handleAvatarUpdate = () => {
      refreshUser();
    };
    window.addEventListener("avatar-updated", handleAvatarUpdate);
    return () => window.removeEventListener("avatar-updated", handleAvatarUpdate);
  }, [refreshUser]);

  // Derived state
  const currentTeamName =
    !loadingTeams && currentTeamId
      ? teams.find((t) => t.id === Number(currentTeamId))?.name || "Select Team"
      : loadingTeams ? "Loading..." : "Select Team";

  // Handlers
  const handleTeamSelect = useCallback(
    (teamId: number) => {
      const teamIdStr = String(teamId);
      setCurrentTeamId(teamIdStr);
      if (setParentTeamId) setParentTeamId(teamIdStr);
      localStorage.setItem("selectedTeamId", teamIdStr);
      router.push(`/teams/${teamId}/dashboard`);
    },
    [router, setParentTeamId]
  );

  const handleLogout = useCallback(() => {
    // Clear token and role from cookies
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    try {
      sessionStorage.removeItem("current_team_id");
      localStorage.removeItem("selectedTeamId");
    } catch (e) {
      // ignore storage errors
    }
    
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("auth-state-changed"));
    router.push("/");
  }, [router]);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

  // UI logic
  const shouldShowTeamSelector = pathname !== "/teams" && pathname !== "/notifications";

  return {
    isAuthenticated,
    currentUser,
    currentTeamId,
    currentTeamName,
    teams,
    loadingTeams,
    handleTeamSelect,
    handleLogout,
    handleProfileClick,
    shouldShowTeamSelector,
  };
}
