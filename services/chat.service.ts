/**
 * Chat Service
 * Handles chat-specific CRS preview operations
 * Single Responsibility: Chat session CRS preview/status
 * 
 * Note: For full CRS operations (create, update, export), use services/crs.service.ts
 */

import { CRSPreviewOut } from "./crs.service";
import { getAuthToken } from "@/services/token.service";
import { ChatError, parseApiError } from "./errors.service";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Get CRS preview data for completeness check
 * This is a convenience wrapper around crs.service.getPreviewCRS
 * for chat-specific contexts
 */
export async function getPreviewCRS(
  sessionId: number,
  pattern?: string
): Promise<CRSPreviewOut> {
  const token = getAuthToken();
  if (!token) {
    throw new ChatError("No authentication token found", 401);
  }

  try {
    const url = pattern
      ? `${API_BASE}/api/crs/sessions/${sessionId}/preview?pattern=${pattern}`
      : `${API_BASE}/api/crs/sessions/${sessionId}/preview`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ChatError(
        parseApiError(errorData, response.status),
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError(
      error instanceof Error ? error.message : "Failed to fetch CRS preview"
    );
  }
}
