"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileCheck, Loader2 } from "lucide-react";
import { MyCRSRequestsTable } from "@/components/my-crs-requests/MyCRSRequestsTable";
import { CRSDetailsDialog } from "@/components/my-crs-requests/CRSDetailsDialog";
import { fetchMyCRSRequests } from "@/lib/api-crs";
import { fetchProjects } from "@/lib/api-projects";
import { getCurrentUser } from "@/lib/api";
import type { CRSOut, CRSStatus } from "@/lib/api-crs";
import type { Project } from "@/lib/api-projects";

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
  full_name: string;
}

export default function MyCRSRequestsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = parseInt(params.id as string);

  const [crsDocuments, setCrsDocuments] = useState<CRSOut[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCRS, setSelectedCRS] = useState<CRSOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CRSStatus | "all">("all");

  // Fetch user and verify client role, then fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser<User>();
        
        // Note: This page is available to all users, but optimized for clients
        // BAs can also view their own CRS submissions if they create any
        
        // Fetch projects and CRS documents in parallel
        const [projectsData, crsData] = await Promise.all([
          fetchProjects(teamId),
          fetchMyCRSRequests(teamId),
        ]);
        
        setProjects(projectsData);
        setCrsDocuments(crsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, teamId]);

  const fetchCRSDocuments = async (status?: CRSStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMyCRSRequests(teamId, undefined, status);
      setCrsDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CRS requests");
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
    setSuccessMessage("CRS resubmitted successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getProjectName = (projectId: number): string => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  return (
    <div className="flex justify-center mt-14 px-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="h-8 w-8 text-[#341bab]" />
            <h1 className="text-3xl font-bold text-gray-900">
              My CRS Requests
            </h1>
          </div>
          <p className="text-gray-600">
            Track the progress of your Client Requirements Specification documents.
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
            <span className="ml-3 text-gray-600">Loading your CRS requests...</span>
          </div>
        ) : (
          <>
            {/* CRS Table */}
            <MyCRSRequestsTable
              documents={crsDocuments}
              projects={projects}
              onViewDetails={handleViewDetails}
              statusFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />

            {/* CRS Details Dialog */}
            {selectedCRS && (
              <CRSDetailsDialog
                crs={selectedCRS}
                projectName={getProjectName(selectedCRS.project_id)}
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
