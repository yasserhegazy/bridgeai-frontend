"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { NotificationToastContainer } from "@/components/notifications/NotificationToast";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Extract team ID synchronously from /teams/{id}/...
    const parts = pathname.split("/");
    const idIndex = parts.indexOf("teams") + 1;
    const currentTeamId = idIndex > 0 && idIndex < parts.length ? parts[idIndex] : "";

    const hideSidebar = pathname === "/teams" || pathname.startsWith("/auth") || pathname === "/notifications";

    return (
        <NotificationProvider>
            {/* Fixed Header */}
            <Header currentTeamId={currentTeamId} />

            {/* Toast Notifications */}
            <NotificationToastContainer />

            {/* Content area with sidebar + main */}
            <div className="flex flex-1 overflow-hidden">
                {!hideSidebar && (
                    <Sidebar 
                        currentTeamId={currentTeamId} 
                        isCollapsed={isCollapsed}
                        onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                )}

                {/* Main scrollable content */}
                <main className="flex-1 overflow-y-auto p-6 flex justify-center">
                    <div className="w-full max-w-7xl">{children}</div>
                </main>
            </div>
        </NotificationProvider>
    );
}
