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
    <div className="flex items-center bg-[#fafafb] p-4 justify-between mb-7 gap-3 rounded">
      <div className="flex items-center gap-2 flex-1 max-w-sm">
        <SearchBar
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
        />
        {filters}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
