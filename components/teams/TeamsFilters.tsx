"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamsFiltersProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = ["Active", "Inactive", "Archived"];

export function TeamsFilters({
  selectedStatuses,
  onStatusChange,
  onReset,
}: TeamsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const hasActiveFilters = selectedStatuses.length > 0;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="primary" 
            size="sm"
            className={hasActiveFilters ? "ring-2 ring-blue-500" : ""}
          >
            Filters {hasActiveFilters && `(${selectedStatuses.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
          </div>
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusToggle(status)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                selectedStatuses.includes(status)
                  ? "bg-primary border-primary"
                  : "border-muted-foreground"
              }`}>
                {selectedStatuses.includes(status) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              {status}
            </DropdownMenuItem>
          ))}

          {hasActiveFilters && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onReset()}
                className="text-sm cursor-pointer"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
