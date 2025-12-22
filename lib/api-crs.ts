/**
 * API utilities for CRS (Client Requirements Specification) operations
 */

import { apiCall } from "./api";

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
