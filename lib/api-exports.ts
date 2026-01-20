/**
 * API utilities for export operations
 */
import { getAccessToken } from "./api";

export type ExportFormat = "markdown" | "pdf" | "csv";

export interface ExportRequest {
  filename?: string;
  format: ExportFormat;
  content: string;
}

/**
 * Export project content as markdown or PDF
 */
export async function exportProject(
  projectId: number,
  request: ExportRequest
): Promise<Blob> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/projects/${projectId}/export`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Export failed");
  }

  return response.blob();
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
