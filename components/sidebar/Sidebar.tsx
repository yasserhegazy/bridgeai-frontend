"use client";

import { usePathname } from "next/navigation";
import { Home, FolderGit2Icon, Settings, ClipboardList, FileCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { NavItem } from "./NavItem";
import { COLORS } from "@/constants";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api";

interface SidebarProps {
  currentTeamId: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
}

export function Sidebar({ currentTeamId, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<"ba" | "client" | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser<User>();
        setUserRole(user.role);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Set to client as fallback to show sidebar
        setUserRole("client");
      }
    };

    fetchUser();
  }, []);

  // Don't render sidebar items until role is loaded
  if (userRole === null) {
    return (
      <aside 
        className={`fixed top-12 left-0 h-[calc(100vh-3rem)] flex flex-col py-5 text-white transition-all duration-300 ease-in-out z-40 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`} 
        style={{ backgroundColor: "#341BAB" }}
      >
        {/* Empty sidebar while loading */}
      </aside>
    );
  }

  const navItems = [
    { href: `/teams/${currentTeamId}/dashboard`, label: "Dashboard", icon: Home },
    { href: `/teams/${currentTeamId}/projects`, label: "Projects", icon: FolderGit2Icon },
  ];

  // Role-specific navigation items
  if (userRole === "ba") {
    // BA-only links
    navItems.push({
      href: `/teams/${currentTeamId}/pending-requests`,
      label: "Project Requests",
      icon: ClipboardList,
    });
    navItems.push({
      href: `/teams/${currentTeamId}/crs-dashboard`,
      label: "CRS Dashboard",
      icon: FileCheck,
    });
  } else if (userRole === "client") {
    // Client-only links
    navItems.push({
      href: `/teams/${currentTeamId}/my-crs-requests`,
      label: "My CRS Requests",
      icon: FileCheck,
    });
  }

  navItems.push({ href: `/teams/${currentTeamId}/settings`, label: "Team Settings", icon: Settings });

  return (
    <aside 
      className={`fixed top-12 left-0 h-[calc(100vh-3rem)] flex flex-col py-5 text-white transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`} 
      style={{ backgroundColor: "#341BAB" }}
    >
      <div className="flex-1 flex flex-col space-y-2 px-2">
        {navItems.map(item => (
          <NavItem 
            key={item.href} 
            {...item} 
            isActive={pathname.startsWith(item.href)} 
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
      
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="mt-auto mx-2 p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
