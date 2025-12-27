/**
 * API utilities for CRS (Client Requirements Specification) operations
 */

import { apiCall, getAccessToken } from "./api";

export type CRSStatus = "draft" | "under_review" | "approved" | "rejected";

export interface CRSOut {
  id: number;
  project_id: number;
  status: CRSStatus;
  version: number;
  content: string;
  summary_points: string[];
  created_by: number | null;
  approved_by: number | null;
  created_at: string;
}

export interface CRSCreate {
  project_id: number;
  content: string;
  summary_points?: string[];
}

export interface CRSStatusUpdate {
  status: CRSStatus;
}

/**
 * Fetch the latest CRS for a project
 */
export async function fetchLatestCRS(projectId: number): Promise<CRSOut> {
  return apiCall<CRSOut>(`/api/crs/latest?project_id=${projectId}`);
}

/**
 * Fetch all CRS versions for a project
 */
export async function fetchCRSVersions(projectId: number): Promise<CRSOut[]> {
  return apiCall<CRSOut[]>(`/api/crs/versions?project_id=${projectId}`);
}

/**
 * Fetch all CRS documents for BA review (optionally filtered by team and status)
 */
export async function fetchCRSForReview(teamId?: number, status?: CRSStatus): Promise<CRSOut[]> {
  const params = new URLSearchParams();
  if (teamId) params.append("team_id", teamId.toString());
  if (status) params.append("status", status);
  
  const url = params.toString() 
    ? `/api/crs/review?${params.toString()}`
    : `/api/crs/review`;
  return apiCall<CRSOut[]>(url);
}

/**
 * Create a new CRS document
 */
export async function createCRS(payload: CRSCreate): Promise<CRSOut> {
  return apiCall<CRSOut>("/api/crs/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update CRS status (approval workflow)
 */
export async function updateCRSStatus(crsId: number, status: CRSStatus): Promise<CRSOut> {
  return apiCall<CRSOut>(`/api/crs/${crsId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

/**
 * Export CRS document as PDF or Markdown
 */
export async function exportCRS(crsId: number, format: "pdf" | "markdown" = "pdf"): Promise<Blob> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/crs/${crsId}/export?format=${format}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Export failed");
  }

  return response.blob();}