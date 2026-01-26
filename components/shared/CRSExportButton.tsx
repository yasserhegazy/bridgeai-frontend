"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCRSExport } from "@/hooks/crs/useCRSExport";

interface CRSExportButtonProps {
  crsId: number;
  version: number;
}

export function CRSExportButton({ crsId, version }: CRSExportButtonProps) {
  const { isExporting, error, exportDocument } = useCRSExport();

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
            onClick={() => exportDocument(crsId, version, "markdown")}
            disabled={isExporting}
          >
            Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => exportDocument(crsId, version, "pdf")}
            disabled={isExporting}
          >
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => exportDocument(crsId, version, "csv")}
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
