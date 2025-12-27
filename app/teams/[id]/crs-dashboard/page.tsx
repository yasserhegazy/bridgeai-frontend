"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileCheck, Loader2 } from "lucide-react";
import { CRSDashboardTable } from "@/components/crs-dashboard/CRSDashboardTable";
import { CRSReviewDialog } from "@/components/crs-dashboard/CRSReviewDialog";
import { fetchCRSForReview } from "@/lib/api-crs";
import { getCurrentUser } from "@/lib/api";
import type { CRSOut, CRSStatus } from "@/lib/api-crs";

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
  full_name: string;
}

export default function TeamCRSDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = parseInt(params.id as string);

  const [crsDocuments, setCrsDocuments] = useState<CRSOut[]>([]);
  const [selectedCRS, setSelectedCRS] = useState<CRSOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CRSStatus | "all">("under_review");

  // Fetch user and verify BA role
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await getCurrentUser<User>();
        if (user.role !== "ba") {
          router.push("/");
          return;
        }
        // User is BA, continue to fetch CRS documents (only submitted ones by default)
        await fetchCRSDocuments("under_review");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify user");
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [router, teamId]);

  const fetchCRSDocuments = async (status?: CRSStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCRSForReview(teamId, status);
      setCrsDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CRS documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newStatus: CRSStatus | "all") => {
    setStatusFilter(newStatus);
    if (newStatus === "all") {
      fetchCRSDocuments();
    } else {
      fetchCRSDocuments(newStatus);
    }
  };

  const handleViewDetails = (crs: CRSOut) => {
    setSelectedCRS(crs);
  };

  const handleStatusUpdate = async () => {
    // Refresh the list after status update
    await fetchCRSDocuments(statusFilter === "all" ? undefined : statusFilter);
    setSuccessMessage("CRS status updated successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#341bab]" />
            <span className="ml-3 text-gray-600">Loading CRS documents...</span>
          </div>
        ) : (
          <>
            {/* CRS Table */}
            <CRSDashboardTable
              documents={crsDocuments}
              onViewDetails={handleViewDetails}
              statusFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />

            {/* CRS Review Dialog */}
            {selectedCRS && (
              <CRSReviewDialog
                crs={selectedCRS}
                open={!!selectedCRS}
                onClose={() => setSelectedCRS(null)}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
