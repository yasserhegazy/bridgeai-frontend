"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { FileCheck, Loader2 } from "lucide-react";
import { CRSDashboardTable } from "@/components/crs-dashboard/CRSDashboardTable";
import { CRSReviewDialog } from "@/components/crs-dashboard/CRSReviewDialog";
import { useCRSDashboard } from "@/hooks/crs/useCRSDashboard";
import { useRoleGuard } from "@/hooks/shared/useRoleGuard";
import { CRSDTO, CRSStatus } from "@/dto/crs.dto";

export default function TeamCRSDashboardPage() {
  const params = useParams();
  const teamId = parseInt(params.id as string, 10);

  const [selectedCRS, setSelectedCRS] = useState<CRSDTO | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isChecking, isAuthorized } = useRoleGuard({
    roles: ["ba"],
    redirectTo: "/",
  });

  const {
    filteredDocuments,
    isLoading,
    error,
    selectedStatus,
    setSelectedStatus,
    refreshDocuments,
  } = useCRSDashboard(teamId, isAuthorized);

  const handleFilterChange = useCallback(
    (newStatus: CRSStatus | "all") => {
      setSelectedStatus(newStatus);
    },
    [setSelectedStatus]
  );

  const handleViewDetails = useCallback((crs: CRSDTO) => {
    setSelectedCRS(crs);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedCRS(null);
  }, []);

  const handleStatusUpdate = useCallback(async () => {
    await refreshDocuments();
    setSuccessMessage("CRS status updated successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [refreshDocuments]);

  return (
    <div className="flex justify-center mt-14 px-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              CRS Review Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Review and manage CRS documents for this team.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Loading State */}
        {(isChecking || isLoading) ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#341bab]" />
            <span className="ml-3 text-gray-600">
              {isChecking ? "Verifying access..." : "Loading CRS documents..."}
            </span>
          </div>
        ) : (
          <>
            {/* CRS Table */}
            <CRSDashboardTable
              documents={filteredDocuments}
              onViewDetails={handleViewDetails}
              statusFilter={selectedStatus}
              onFilterChange={handleFilterChange}
            />

            {/* CRS Review Dialog */}
            {selectedCRS && (
              <CRSReviewDialog
                crs={selectedCRS}
                open={!!selectedCRS}
                onClose={handleCloseDialog}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
