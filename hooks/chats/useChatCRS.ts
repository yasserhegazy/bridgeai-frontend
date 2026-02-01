/**
 * useChatCRS Hook
 * Manages CRS state and operations within chat context
 */

import { useState, useCallback, useEffect } from "react";
import { CRSDTO, CreateCRSRequestDTO, CRSPattern } from "@/dto/crs.dto";
import {
  fetchCRSForSession,
  getPreviewCRS,
  createCRS,
  updateCRSStatus,
  CRSPreviewOut,
} from "@/services/crs.service";
import { UpdateCRSStatusRequestDTO } from "@/dto/crs.dto";

interface UseChatCRSOptions {
  sessionId: number;
  projectId: number;
  crsPattern: CRSPattern;
}

export function useChatCRS({
  sessionId,
  projectId,
  crsPattern,
}: UseChatCRSOptions) {
  const [latestCRS, setLatestCRS] = useState<CRSDTO | null>(null);
  const [crsLoading, setCrsLoading] = useState(false);
  const [crsError, setCrsError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<CRSPreviewOut | null>(null);

  // Load CRS on mount
  useEffect(() => {
    if (sessionId) {
      loadCRS();
    }
  }, [sessionId]);

  const loadCRS = useCallback(async () => {
    if (!sessionId) return null;

    try {
      setCrsLoading(true);
      setCrsError(null);
      const crs = await fetchCRSForSession(sessionId);
      setLatestCRS(crs);
      return crs;
    } catch (err: unknown) {
      // Don't show error for 404 (no CRS yet)
      if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode !== 404) {
        setCrsError(err instanceof Error ? err.message : "Failed to load CRS");
      }
      setLatestCRS(null);
      return null;
    } finally {
      setCrsLoading(false);
    }
  }, [sessionId]);

  const fetchPreview = useCallback(async () => {
    try {
      setIsGenerating(true);
      setCrsError(null);
      const preview = await getPreviewCRS(sessionId);
      setPreviewData(preview);
      return preview;
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to fetch CRS preview");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId]);

  const generateCRS = useCallback(async (preview: CRSPreviewOut) => {
    try {
      setIsGenerating(true);
      setCrsError(null);
      const isPartial = preview.completeness_percentage < 100;

      const payload: CreateCRSRequestDTO = {
        project_id: projectId,
        content: preview.content,
        summary_points: preview.summary_points,
        allow_partial: isPartial,
        completeness_percentage: preview.completeness_percentage,
        session_id: sessionId,
        pattern: crsPattern,
      };

      const crs = await createCRS(payload);
      setLatestCRS(crs);

      return { crs, isPartial };
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to generate CRS");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, sessionId, crsPattern]);

  const submitForReview = useCallback(async () => {
    if (!latestCRS) {
      throw new Error("No CRS to submit");
    }

    try {
      const statusUpdate: UpdateCRSStatusRequestDTO = {
        status: "under_review",
      };
      const updatedCRS = await updateCRSStatus(latestCRS.id, statusUpdate);
      setLatestCRS(updatedCRS);
      return updatedCRS;
    } catch (err) {
      throw err;
    }
  }, [latestCRS]);

  // Determine available actions based on CRS status
  const canGenerateCRS = !latestCRS || latestCRS.status === "draft" || latestCRS.status === "rejected";
  const canSubmitCRS = latestCRS?.status === "draft";
  const isUnderReview = latestCRS?.status === "under_review";
  const isApproved = latestCRS?.status === "approved";
  const isRejected = latestCRS?.status === "rejected";

  const [recentInsights, setRecentInsights] = useState<{
    summary_points: string[];
    quality_summary?: string;
  } | null>(null);

  return {
    latestCRS,
    crsLoading,
    crsError,
    isGenerating,
    setIsGenerating,
    previewData,
    recentInsights,
    setRecentInsights,
    loadCRS,
    fetchPreview,
    generateCRS,
    submitForReview,
    canGenerateCRS,
    canSubmitCRS,
    isUnderReview,
    isApproved,
    isRejected,
    setPreviewData,
  };
}
