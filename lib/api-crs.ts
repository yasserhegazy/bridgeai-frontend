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
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface CRSCreate {
  project_id: number;
  content: string;
  summary_points?: string[];
}

export interface CRSStatusUpdate {
  status: CRSStatus;
  rejection_reason?: string;
}

/**
 * Fetch the latest CRS for a project
 */
export async function fetchLatestCRS(projectId: number): Promise<CRSOut> {
  return apiCall<CRSOut>(`/api/crs/latest?project_id=${projectId}`);
}

/**
 * Fetch the CRS document linked to a specific chat session
 */
export async function fetchCRSForSession(sessionId: number): Promise<CRSOut | null> {
  try {
    return await apiCall<CRSOut>(`/api/crs/session/${sessionId}`);
  } catch (error) {
    // Return null if no CRS exists for this session
    return null;
  }
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
 * Fetch all CRS documents created by the current user (client view)
 * Optionally filter by team, project, and status
 */
export async function fetchMyCRSRequests(teamId?: number, projectId?: number, status?: CRSStatus): Promise<CRSOut[]> {
  const params = new URLSearchParams();
  if (teamId) params.append("team_id", teamId.toString());
  if (projectId) params.append("project_id", projectId.toString());
  if (status) params.append("status", status);

  const url = params.toString()
    ? `/api/crs/my-requests?${params.toString()}`
    : `/api/crs/my-requests`;
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
export async function updateCRSStatus(
  crsId: number,
  status: CRSStatus,
  rejectionReason?: string
): Promise<CRSOut> {
  return apiCall<CRSOut>(`/api/crs/${crsId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, rejection_reason: rejectionReason }),
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

  return response.blob();
}

export interface CRSAuditLog {
  id: number;
  crs_id: number;
  action: string;
  changed_by: number;         // was performed_by
  changed_at: string;         // was performed_at
  old_status?: string;
  new_status?: string;
  old_content?: string;
  new_content?: string;
  summary?: string;
  // details field is removed as it's not in the response, we can add a computed property or just use the fields directly if we want
}

/**
 * Fetch audit logs for a specific CRS
 */
export async function fetchCRSAudit(crsId: number): Promise<CRSAuditLog[]> {
  return apiCall<CRSAuditLog[]>(`/api/crs/${crsId}/audit`);
}
