"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportProject, downloadBlob, type ExportFormat } from "@/lib/api-exports";
import { exportCRS } from "@/lib/api-crs";

interface ExportButtonProps {
  projectId: number;
  content: string;
  filename?: string;
  crsId?: number;
}

export function ExportButton({
  projectId,
  content,
  filename = "export",
  crsId,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setError(null);

    try {
      let extension = "md";
      if (format === "pdf") extension = "pdf";
      if (format === "csv") extension = "csv";
      const finalFilename = `${filename}.${extension}`;

      let blob: Blob;
      if (crsId) {
        blob = await exportCRS(crsId, format);
      } else {
        blob = await exportProject(projectId, {
          filename: finalFilename,
          format,
          content,
        });
      }

      downloadBlob(blob, finalFilename);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      setError(message);
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isExporting || !content}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleExport("markdown")}
            disabled={isExporting}
          >
            Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
          >
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport("csv")}
            disabled={isExporting}
          >
            CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
