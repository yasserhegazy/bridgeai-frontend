"use client";

import { usePathname } from "next/navigation";
import { Home, FolderGit2Icon, Settings, ClipboardList } from "lucide-react";
import { NavItem } from "./NavItem";
import { COLORS } from "@/constants";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/api";

interface SidebarProps {
  currentTeamId: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
}

export function Sidebar({ currentTeamId }: SidebarProps) {
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
      <aside className="fixed top-12 left-0 h-[calc(100vh-3rem)] w-16 flex flex-col items-center py-5 space-y-4 text-white" style={{ backgroundColor: "#341BAB" }}>
        {/* Empty sidebar while loading */}
      </aside>
    );
  }

  const navItems = [
    { href: `/teams/${currentTeamId}/dashboard`, label: "Dashboard", icon: Home },
    { href: `/teams/${currentTeamId}/projects`, label: "Projects", icon: FolderGit2Icon },
  ];

  // Only add "Project Requests" link for confirmed BAs (don't show while loading)
  if (userRole === "ba") {
    navItems.push({
      href: `/teams/${currentTeamId}/pending-requests`,
      label: "Project Requests",
      icon: ClipboardList,
    });
  }

  navItems.push({ href: `/teams/${currentTeamId}/settings`, label: "Team Settings", icon: Settings });

  return (
    <aside className="fixed top-12 left-0 h-[calc(100vh-3rem)] w-16 flex flex-col items-center py-5 space-y-4 text-white" style={{ backgroundColor: "#341BAB" }}>
      {navItems.map(item => (
        <NavItem key={item.href} {...item} isActive={pathname.startsWith(item.href)} />
      ))}
    </aside>
  );
}
