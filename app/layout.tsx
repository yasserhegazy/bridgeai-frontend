"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { NotificationToastContainer } from "@/components/notifications/NotificationToast";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    } else if (isMobile) {
      // Default to collapsed on mobile
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  // Save sidebar state to localStorage when it changes
  const handleToggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // Extract team ID synchronously from /teams/{id}/...
  const parts = pathname.split("/");
  const idIndex = parts.indexOf("teams") + 1;
  const currentTeamId = idIndex > 0 && idIndex < parts.length ? parts[idIndex] : "";

  const hideSidebar = pathname === "/teams" || pathname.startsWith("/auth") || pathname === "/notifications";
  const isLandingPage = pathname === "/";

  return (
    <html lang="en">
      <head>
        <title>BridgeAI - AI-Powered Requirements Engineering Platform</title>
        <meta name="description" content="Transform conversations into professional CRS documents with AI. BridgeAI bridges clients and Business Analysts through intelligent automation." />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={isLandingPage ? "" : "app-layout h-screen flex flex-col"}>
        <NotificationProvider>
          {!isLandingPage && (
            <>
              {/* Fixed Header */}
              <Header currentTeamId={currentTeamId} />

              {/* Toast Notifications */}
              <NotificationToastContainer />

              {/* Content area with sidebar + main */}
              <div className="flex flex-1 overflow-hidden">
                {!hideSidebar && (
                  <Sidebar 
                    currentTeamId={currentTeamId} 
                    isCollapsed={isSidebarCollapsed}
                    onToggle={handleToggleSidebar}
                  />
                )}

                {/* Main scrollable content - dynamically adjust margin based on sidebar state */}
                <main 
                  className={`flex-1 overflow-y-auto p-6 flex justify-center transition-all duration-300 ease-in-out ${
                    !hideSidebar ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : ''
                  }`}
                >
                  <div className="w-full max-w-7xl">{children}</div>
                </main>
              </div>
            </>
          )}

          {/* Landing Page - Full control over layout */}
          {isLandingPage && children}
        </NotificationProvider>
      </body>
    </html>
  );
}
