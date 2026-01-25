"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/header/Header";
import { useEffect, useState } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentTeamId, setCurrentTeamId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Extract team ID from URL: /teams/{id}/...
  useEffect(() => {
    const parts = pathname.split("/");
    const idIndex = parts.indexOf("teams") + 1;
    if (idIndex > 0 && idIndex < parts.length) {
      setCurrentTeamId(parts[idIndex]);
    }
  }, [pathname]);

  const hideSidebar = pathname === "/teams";

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header currentTeamId={currentTeamId} setCurrentTeamId={setCurrentTeamId} />
      <div className="flex flex-1">
        {!hideSidebar && currentTeamId && (
          <Sidebar 
            currentTeamId={currentTeamId} 
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
          />
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}