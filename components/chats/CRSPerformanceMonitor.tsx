/**
 * CRS Performance Monitor Component
 * Displays real-time metrics for JSON Patch vs Full Document updates
 * Useful for development and optimization
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface PerformanceMetric {
  timestamp: number;
  patchOperations: number;
  patchSizeBytes: number;
  fullSizeBytes: number;
  sizeReductionPercent: number;
  applicationTimeMs: number;
  success: boolean;
  fallbackToFull: boolean;
}

interface CRSPerformanceMonitorProps {
  enabled?: boolean;
  maxHistorySize?: number;
}

export function CRSPerformanceMonitor({ 
  enabled = false, 
  maxHistorySize = 50 
}: CRSPerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(enabled);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    if (!isVisible) return;

    // Listen for CRS performance events
    const handlePerformanceEvent = (event: CustomEvent) => {
      const metric = event.detail;
      setMetrics((prev) => {
        const updated = [...prev, { ...metric, timestamp: Date.now() }];
        return updated.slice(-maxHistorySize); // Keep only recent metrics
      });
    };

    window.addEventListener('crs-performance-metric' as any, handlePerformanceEvent);
    
    return () => {
      window.removeEventListener('crs-performance-metric' as any, handlePerformanceEvent);
    };
  }, [isVisible, maxHistorySize]);

  if (!isVisible) return null;

  const totalUpdates = metrics.length;
  const patchSuccesses = metrics.filter(m => m.success && !m.fallbackToFull).length;
  const fallbacks = metrics.filter(m => m.fallbackToFull).length;
  const avgSizeReduction = totalUpdates > 0
    ? metrics.reduce((sum, m) => sum + m.sizeReductionPercent, 0) / totalUpdates
    : 0;
  const avgApplicationTime = totalUpdates > 0
    ? metrics.reduce((sum, m) => sum + m.applicationTimeMs, 0) / totalUpdates
    : 0;
  const totalBytesSaved = metrics.reduce((sum, m) => {
    return sum + (m.success && !m.fallbackToFull ? (m.fullSizeBytes - m.patchSizeBytes) : 0);
  }, 0);

  const recentMetrics = metrics.slice(-10).reverse();

  return (
    <Card className="fixed bottom-4 right-4 w-96 p-4 shadow-lg z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          📊 CRS Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="text-gray-600 dark:text-gray-400">Total Updates</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {totalUpdates}
            </div>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="text-gray-600 dark:text-gray-400">Patch Success</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {patchSuccesses}/{totalUpdates}
            </div>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
            <div className="text-gray-600 dark:text-gray-400">Avg Reduction</div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {avgSizeReduction.toFixed(1)}%
            </div>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <div className="text-gray-600 dark:text-gray-400">Bytes Saved</div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {(totalBytesSaved / 1024).toFixed(1)}KB
            </div>
          </div>
        </div>

        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            Avg Application Time
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {avgApplicationTime.toFixed(2)}ms
          </div>
        </div>

        {/* Recent Updates */}
        <div>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recent Updates
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {recentMetrics.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                No updates yet...
              </div>
            ) : (
              recentMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded flex justify-between items-center"
                >
                  <div>
                    <span className={metric.fallbackToFull ? "text-orange-600" : "text-green-600"}>
                      {metric.fallbackToFull ? "📄 Full" : "🔧 Patch"}
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {metric.patchOperations} ops
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-mono">
                      {metric.applicationTimeMs.toFixed(1)}ms
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      -{metric.sizeReductionPercent.toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fallback Warning */}
        {fallbacks > 0 && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ {fallbacks} update{fallbacks > 1 ? 's' : ''} used fallback (full document)
          </div>
        )}
      </div>
    </Card>
  );
}
