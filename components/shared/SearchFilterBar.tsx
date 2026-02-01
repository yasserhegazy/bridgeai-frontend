/**
 * Search and Filter Bar Component
 * Reusable search bar with filters and actions
 * Single Responsibility: Search and filter UI
 */

import { ReactNode } from "react";
import { SearchBar } from "./SearchBar";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  actions,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3 flex-1 w-full md:max-w-xl">
        <SearchBar
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
        {filters}
      </div>
      {actions && <div className="flex shrink-0">{actions}</div>}
    </div>
  );
}
