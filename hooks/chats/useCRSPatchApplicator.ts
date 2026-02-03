/**
 * Hook for applying JSON Patch operations to CRS documents.
 * Implements RFC 6902 JSON Patch with fallback to full document updates.
 */

import { useCallback, useRef } from 'react';
import { applyPatch, deepClone, Operation } from 'fast-json-patch';
import { CRSDTO } from '@/dto/crs.dto';

interface PatchMetrics {
  patchOperations: number;
  patchSizeBytes: number;
  fullSizeBytes: number;
  sizeReductionPercent: number;
  applicationTimeMs: number;
  success: boolean;
  fallbackToFull: boolean;
}

interface UseCRSPatchApplicatorReturn {
  applyPatchToCRS: (
    currentCRS: CRSDTO | null,
    patch: Operation[],
    fullDocument?: string,
    metadata?: any
  ) => { updatedCRS: CRSDTO | null; metrics: PatchMetrics };
  getMetrics: () => PatchMetrics[];
  clearMetrics: () => void;
}

export function useCRSPatchApplicator(): UseCRSPatchApplicatorReturn {
  const metricsHistory = useRef<PatchMetrics[]>([]);

  const applyPatchToCRS = useCallback(
    (
      currentCRS: CRSDTO | null,
      patch: Operation[],
      fullDocument?: string,
      metadata?: any
    ): { updatedCRS: CRSDTO | null; metrics: PatchMetrics } => {
      const startTime = performance.now();
      
      const metrics: PatchMetrics = {
        patchOperations: patch?.length || 0,
        patchSizeBytes: metadata?._metrics?.patch_size_bytes || 0,
        fullSizeBytes: metadata?._metrics?.full_size_bytes || 0,
        sizeReductionPercent: metadata?._metrics?.size_reduction_percent || 0,
        applicationTimeMs: 0,
        success: false,
        fallbackToFull: false,
      };

      // If no current CRS, use full document
      if (!currentCRS) {
        console.log('[CRS Patch] No current CRS, creating new from full document');
        metrics.fallbackToFull = true;
        metrics.applicationTimeMs = performance.now() - startTime;
        
        if (fullDocument && metadata) {
          const newCRS: CRSDTO = {
            id: metadata.id || metadata.crs_document_id,
            project_id: metadata.project_id,
            chat_session_id: metadata.chat_session_id,
            content: fullDocument,
            status: metadata.status || 'draft',
            pattern: metadata.pattern,
            version: metadata.version || 1,
            edit_version: metadata.edit_version || 1,
            summary_points: metadata.summary_points || [],
            field_sources: metadata.field_sources,
            created_at: metadata.created_at || new Date().toISOString(),
            updated_at: metadata.updated_at,
            created_by: metadata.created_by,
          };
          console.log('[CRS Patch] Created new CRS:', newCRS);
          metrics.success = true;
          metricsHistory.current.push(metrics);
          return { updatedCRS: newCRS, metrics };
        }
        
        console.warn('[CRS Patch] No full document available for new CRS');
        metricsHistory.current.push(metrics);
        return { updatedCRS: null, metrics };
      }

      // Try to apply patch
      if (patch && patch.length > 0) {
        try {
          // Parse current content
          const currentContent = JSON.parse(currentCRS.content);
          
          // Clone to avoid mutation
          const documentCopy = deepClone(currentContent);
          
          // Apply patch operations
          const patchResult = applyPatch(documentCopy, patch, true, false);
          
          if (patchResult.newDocument) {
            // Patch applied successfully
            const updatedCRS: CRSDTO = {
              ...currentCRS,
              ...metadata,
              content: JSON.stringify(patchResult.newDocument),
              edit_version: metadata?.edit_version || currentCRS.edit_version,
              updated_at: metadata?.updated_at || currentCRS.updated_at,
            };
            
            metrics.success = true;
            metrics.applicationTimeMs = performance.now() - startTime;
            metricsHistory.current.push(metrics);
            
            console.log(
              `[CRS Patch] Applied ${patch.length} operations successfully in ${metrics.applicationTimeMs.toFixed(2)}ms`
            );
            
            return { updatedCRS, metrics };
          }
        } catch (error) {
          console.error('[CRS Patch] Failed to apply patch, falling back to full document:', error);
          metrics.fallbackToFull = true;
        }
      }

      // Fallback to full document
      if (fullDocument) {
        console.log('[CRS Patch] Using full document (fallback)');
        metrics.fallbackToFull = true;
        
        const updatedCRS: CRSDTO = {
          ...currentCRS,
          ...metadata,
          content: fullDocument,
          edit_version: metadata?.edit_version || currentCRS.edit_version,
          updated_at: metadata?.updated_at || currentCRS.updated_at,
        };
        
        metrics.success = true;
        metrics.applicationTimeMs = performance.now() - startTime;
        metricsHistory.current.push(metrics);
        
        return { updatedCRS, metrics };
      }

      // No patch and no full document - return current
      metrics.applicationTimeMs = performance.now() - startTime;
      metricsHistory.current.push(metrics);
      console.warn('[CRS Patch] No patch or full document available, keeping current CRS');
      
      return { updatedCRS: currentCRS, metrics };
    },
    []
  );

  const getMetrics = useCallback(() => {
    return [...metricsHistory.current];
  }, []);

  const clearMetrics = useCallback(() => {
    metricsHistory.current = [];
  }, []);

  return {
    applyPatchToCRS,
    getMetrics,
    clearMetrics,
  };
}
