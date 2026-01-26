/**
 * Team Dashboard Page
 * Displays team statistics and overview
 * Refactored for consistency
 */

import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { PageHeader } from "@/components/shared/PageHeader";

export default function DashboardPage() {
  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          description="View your team statistics in one place."
        />

        {/* Main content */}
        <main className="flex-1 mt-8 overflow-auto">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
}
