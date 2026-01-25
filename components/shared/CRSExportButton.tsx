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
import { exportCRS } from "@/lib/api-crs";

interface CRSExportButtonProps {
  crsId: number;
  version: number;
}

export function CRSExportButton({ crsId, version }: CRSExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: "pdf" | "markdown" | "csv") => {
    setIsExporting(true);
    setError(null);

    try {
      let extension = "md";
      if (format === "pdf") extension = "pdf";
      if (format === "csv") extension = "csv";
      const filename = `crs-v${version}.${extension}`;

      const blob = await exportCRS(crsId, format);

      // Download the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      setError(message);
      console.error("CRS export error:", err);
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
            disabled={isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CRS
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
